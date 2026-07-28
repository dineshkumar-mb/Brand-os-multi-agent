import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { agentOrchestrator } from "../packages/agents/src/index";
import { publisherService, MissingAccessTokenError } from "../packages/publisher/src/index";
import { Platform } from "../packages/shared/src/index";
import { preflightService } from "../packages/preflight/src/index";
import { prisma } from "../packages/database/src/index";

export enum PublishMode {
  LIVE = "LIVE",
  SIMULATION = "SIMULATION",
  AUTO = "AUTO",
}

// ==========================================
// STRUCTURED LOGGER & UTILS
// ==========================================

function logStructured(level: "INFO" | "WARN" | "ERROR", step: string, message: string, meta: Record<string, any> = {}) {
  const payload = {
    workflow: "daily-automated-post",
    timestamp: new Date().toISOString(),
    level,
    step,
    message,
    ...meta,
  };
  console.log(JSON.stringify(payload));
}

function writeGitHubStepSummary(summaryMarkdown: string) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    try {
      fs.appendFileSync(summaryPath, summaryMarkdown + "\n\n");
    } catch (err: any) {
      console.warn("[GitHub Summary] Failed to write step summary:", err.message);
    }
  }
}

function writeGitHubOutput(key: string, value: string) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    try {
      fs.appendFileSync(outputPath, `${key}=${value}\n`);
    } catch (err: any) {
      console.warn("[GitHub Output] Failed to write output:", err.message);
    }
  }
}

function saveToDeadLetterQueue(payload: any, errorReason: string) {
  try {
    const dlqDir = path.join(__dirname, "dead_letter_queue");
    if (!fs.existsSync(dlqDir)) {
      fs.mkdirSync(dlqDir, { recursive: true });
    }
    const fileName = `failed_post_${Date.now()}.json`;
    const filePath = path.join(dlqDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify({ errorReason, payload, timestamp: new Date().toISOString() }, null, 2));
    logStructured("WARN", "dead_letter_queue", `Failed post payload saved to DLQ: ${filePath}`);
  } catch (err: any) {
    logStructured("ERROR", "dead_letter_queue", `Failed to save DLQ payload: ${err.message}`);
  }
}

// ==========================================
// IDEMPOTENCY CHECK
// ==========================================

function checkIdempotency(postText: string): { isDuplicate: boolean; hash: string; dateKey: string } {
  const dateKey = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const hash = crypto.createHash("sha256").update(postText.trim()).digest("hex").substring(0, 16);
  const cacheDir = path.join(__dirname, ".state");
  const cacheFile = path.join(cacheDir, `published_${dateKey}.json`);

  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
      if (data.hash === hash || data.publishedToday) {
        return { isDuplicate: true, hash, dateKey };
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  return { isDuplicate: false, hash, dateKey };
}

function recordPublishedState(dateKey: string, hash: string, externalId: string) {
  try {
    const cacheDir = path.join(__dirname, ".state");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const cacheFile = path.join(cacheDir, `published_${dateKey}.json`);
    fs.writeFileSync(
      cacheFile,
      JSON.stringify({ dateKey, hash, externalId, publishedToday: true, timestamp: new Date().toISOString() }, null, 2)
    );
  } catch (err: any) {
    logStructured("WARN", "idempotency", `Failed to record published state: ${err.message}`);
  }
}

// ==========================================
// MAIN PIPELINE RUNNER
// ==========================================

async function main() {
  const startTime = Date.now();
  console.log("==========================================================");
  console.log(" 🚀 STARTING PERSONAL BRAND OS AUTOMATED SWARM PIPELINE  ");
  console.log("==========================================================");
  console.log(`Pipeline started at: ${new Date().toISOString()}`);

  // Generate Correlation pipelineId
  const pipelineId = crypto.randomUUID();
  console.log(`[Pipeline ID: ${pipelineId}] Correlation ID successfully generated.`);
  writeGitHubOutput("pipeline_id", pipelineId);

  // Parse CLI flags
  const isDryRun = process.argv.includes("--dry-run");
  const cliModeArg = process.argv.find((a) => a.startsWith("--mode="))?.split("=")[1]?.toUpperCase();

  let mode: PublishMode;
  if (isDryRun) {
    mode = PublishMode.SIMULATION;
  } else if (cliModeArg === "LIVE" || cliModeArg === "SIMULATION" || cliModeArg === "AUTO") {
    mode = cliModeArg as PublishMode;
  } else {
    const envMode = process.env.PUBLISH_MODE?.toUpperCase();
    mode = envMode === "LIVE" ? PublishMode.LIVE : envMode === "SIMULATION" ? PublishMode.SIMULATION : PublishMode.AUTO;
  }

  logStructured("INFO", "init", `Execution configured with Mode: [${mode}] | Dry-Run: ${isDryRun}`, { pipelineId });

  if (process.env.FORCE_FAIL === "true") {
    throw new Error("Simulated Controlled Failure for Slack notification verification");
  }

  // Stage 1: Reusable Preflight Checks (database, redis, filesystem, platforms)
  logStructured("INFO", "preflight", "Running comprehensive preflight health checks...", { pipelineId });
  try {
    await preflightService.run();
    logStructured("INFO", "preflight", "Preflight checks passed successfully ✅", { pipelineId });
  } catch (err: any) {
    logStructured("ERROR", "preflight", `Critical Preflight Checks Failed: ${err.message}`, { pipelineId });
    writeGitHubStepSummary(`### ❌ Preflight Checks Failed\n\n${err.message}`);
    throw err;
  }

  // Determine trigger source
  const triggerSource = process.env.GITHUB_ACTIONS ? "GITHUB_ACTIONS" : "MANUAL";

  // Create PipelineExecution DB record
  let executionRecord: any = null;
  try {
    executionRecord = await prisma.pipelineExecution.create({
      data: {
        id: pipelineId,
        triggerSource,
        publishMode: mode,
        status: "RUNNING",
      }
    });
  } catch (dbErr: any) {
    console.warn(`[Observability] Failed to create PipelineExecution record: ${dbErr.message}`);
  }

  // Stage 2: Swarm Execution (Agent Generation & Quality Evaluation with Smoke Tests)
  logStructured("INFO", "swarm", "Executing Multi-Agent Swarm (Trend, Research, FactCheck, Writing, Quality Review)...", { pipelineId });
  
  let swarmResult;
  try {
    swarmResult = await agentOrchestrator.executePipeline({
      autoPublish: false,
      pipelineId,
      publishMode: mode as any,
    });
    
    // Update State: QUALITY_PASSED with Replay data
    if (executionRecord) {
      executionRecord = await prisma.pipelineExecution.update({
        where: { id: pipelineId },
        data: {
          status: "QUALITY_PASSED",
          promptPayload: JSON.parse(JSON.stringify({
            topic: swarmResult.topic,
            research: {
              summary: swarmResult.research.summary,
              key_insights_count: swarmResult.research.key_insights.length,
            },
          })),
          generatedContent: JSON.parse(JSON.stringify({
            linkedInPost: swarmResult.linkedInPost,
            mediumArticle: swarmResult.mediumArticle,
          })),
        }
      }).catch(() => executionRecord);
    }
  } catch (swarmErr: any) {
    if (executionRecord) {
      await prisma.pipelineExecution.update({
        where: { id: pipelineId },
        data: { status: "FAILED", error: `Swarm execution failed: ${swarmErr.message}` }
      }).catch(() => {});
    }
    throw swarmErr;
  }

  logStructured("INFO", "trend_discovery", `Primary Topic: "${swarmResult.topic.title}" (Score: ${swarmResult.topic.score})`, { pipelineId });
  logStructured("INFO", "fact_verification", `Fact Check Score: ${swarmResult.factCheck.confidenceScore}% (Passed: ${swarmResult.factCheck.factCheckPassed})`, { pipelineId });
  logStructured("INFO", "quality_review", `Quality Gate Score: ${swarmResult.review.overallScore}/100 (Passed: ${swarmResult.review.passedThreshold})`, { pipelineId });

  console.log("\n----------------------------------------------------------");
  console.log(" 📄 GENERATED TRENDING LINKEDIN POST PAYLOAD              ");
  console.log("----------------------------------------------------------");
  console.log(`Title: ${swarmResult.linkedInPost.title}`);
  console.log(`Hook: ${swarmResult.linkedInPost.hook}`);
  console.log(`\nFull Text:\n${swarmResult.linkedInPost.fullText}`);
  console.log("----------------------------------------------------------");

  // Stage 3: Idempotency Deduplication Check
  const idempotency = checkIdempotency(swarmResult.linkedInPost.fullText);
  if (idempotency.isDuplicate) {
    const skipMsg = `Post already published today (${idempotency.dateKey}) with hash [${idempotency.hash}]. Skipping duplicate publication to protect feed.`;
    logStructured("WARN", "idempotency", skipMsg, { pipelineId });

    writeGitHubStepSummary(
      `## ⚠️ Pipeline Skipped (Idempotency Guard)\n\n${skipMsg}\n\n- **Topic**: ${swarmResult.topic.title}\n- **Quality Score**: ${swarmResult.review.overallScore}/100`
    );

    if (executionRecord) {
      await prisma.pipelineExecution.update({
        where: { id: pipelineId },
        data: { status: "FAILED", error: "Skipped via idempotency guard (duplicate detected)" }
      }).catch(() => {});
    }

    console.log(`\n==========================================================`);
    console.log(` ⏭️ PIPELINE COMPLETED (SKIPPED DUPLICATE PUBLISH)       `);
    console.log(`==========================================================`);
    return;
  }

  // Stage 4: Publish to LinkedIn Platform (Primary Target - Failures are Fatal)
  logStructured("INFO", "publisher", `Dispatching post to LinkedIn Publisher in [${mode}] mode...`, { pipelineId });

  let publishResult;
  try {
    if (executionRecord) {
      executionRecord = await prisma.pipelineExecution.update({
        where: { id: pipelineId },
        data: { status: "PUBLISHING" }
      }).catch(() => executionRecord);
    }

    publishResult = await publisherService.publish(Platform.LINKEDIN, swarmResult.linkedInPost, { mode: mode as any });
    
    // Explicit Validation of LinkedIn Response
    if (!publishResult.success) {
      throw new Error(`LinkedIn API responded with failure: ${publishResult.message || publishResult.reason}`);
    }
    
    if (mode === PublishMode.LIVE && publishResult.mode === "SIMULATION") {
      throw new Error("Requested LIVE publishing mode but LinkedIn publisher returned SIMULATION mode.");
    }
  } catch (err: any) {
    saveToDeadLetterQueue(swarmResult.linkedInPost, err.message);
    logStructured("ERROR", "publisher", `LinkedIn Publishing failed with exception: ${err.message}`, { mode, error: err.message, pipelineId });
    writeGitHubStepSummary(
      `## ❌ LinkedIn Publishing Failed\n\n- **Error**: ${err.message}\n- **Mode**: ${mode}\n- **Topic**: ${swarmResult.topic.title}`
    );
    
    if (executionRecord) {
      await prisma.pipelineExecution.update({
        where: { id: pipelineId },
        data: { status: "FAILED", error: `LinkedIn Publishing Error: ${err.message}` }
      }).catch(() => {});
    }
    throw err; // LinkedIn failure is fatal and blocks the pipeline
  }

  // Record idempotency state on successful primary publish
  recordPublishedState(idempotency.dateKey, idempotency.hash, publishResult.externalId);

  // Stage 4b: Publish to Medium Platform (Optional Target - Warning & continue)
  let mediumPublishResult = null;
  const mediumToken = process.env.MEDIUM_INTEGRATION_TOKEN?.trim();
  if (mediumToken || mode === PublishMode.LIVE) {
    logStructured("INFO", "publisher", `Dispatching article to Medium Publisher in [${mode}] mode...`, { pipelineId });
    try {
      mediumPublishResult = await publisherService.publish(Platform.MEDIUM, swarmResult.mediumArticle, { mode: mode as any });
      if (mediumPublishResult.success) {
        logStructured("INFO", "publisher", `Medium article published successfully!`, { url: mediumPublishResult.url, mode: mediumPublishResult.mode, pipelineId });
      } else {
        logStructured("WARN", "publisher", `Medium publishing warning: ${mediumPublishResult.message || mediumPublishResult.reason}`, { pipelineId });
      }
    } catch (mErr: any) {
      logStructured("WARN", "publisher", `Medium publishing exception: ${mErr.message}`, { pipelineId });
    }
  }

  // Stage 4c: Publish to Dev.to Platform (Optional Target - Warning & continue)
  let devtoPublishResult = null;
  const devtoApiKey = process.env.DEVTO_API_KEY?.trim();
  if (devtoApiKey || mode === PublishMode.LIVE) {
    logStructured("INFO", "publisher", `Dispatching article to Dev.to Publisher in [${mode}] mode...`, { pipelineId });
    try {
      devtoPublishResult = await publisherService.publish(Platform.DEVTO, swarmResult.mediumArticle, { mode: mode as any });
      if (devtoPublishResult.success) {
        logStructured("INFO", "publisher", `Dev.to article published successfully!`, { url: devtoPublishResult.url, mode: devtoPublishResult.mode, pipelineId });
      } else {
        logStructured("WARN", "publisher", `Dev.to publishing warning: ${devtoPublishResult.message || devtoPublishResult.reason}`, { pipelineId });
      }
    } catch (dErr: any) {
      logStructured("WARN", "publisher", `Dev.to publishing exception: ${dErr.message}`, { pipelineId });
    }
  }

  const durationMs = Date.now() - startTime;
  const durationSec = (durationMs / 1000).toFixed(2);

  // Stage 5: Aggregate Cost, Token Usage & Models used from AI Gateway logs
  let promptTokens = 0;
  let completionTokens = 0;
  let totalTokens = 0;
  let costUsd = 0.0;
  let modelsUsed: string[] = [];

  try {
    const logs = await prisma.aIGatewayLog.findMany({
      where: { pipelineId },
    });
    
    logs.forEach((log) => {
      promptTokens += log.promptTokens;
      completionTokens += log.completionTokens;
      totalTokens += log.totalTokens;
      costUsd += log.costUsd;
      if (log.model && !modelsUsed.includes(log.model)) {
        modelsUsed.push(log.model);
      }
    });
  } catch (telemetryErr: any) {
    console.warn(`[Observability] Failed to retrieve AI Gateway logs for telemetry: ${telemetryErr.message}`);
  }

  // Persist final telemetry statistics to Database execution record
  try {
    if (executionRecord) {
      await prisma.pipelineExecution.update({
        where: { id: pipelineId },
        data: {
          status: "PUBLISHED",
          endedAt: new Date(),
          modelsUsed,
          promptTokens,
          completionTokens,
          totalTokens,
          costUsd,
          linkedinResult: publishResult ? JSON.parse(JSON.stringify(publishResult)) : null,
          mediumResult: mediumPublishResult ? JSON.parse(JSON.stringify(mediumPublishResult)) : null,
          devtoResult: devtoPublishResult ? JSON.parse(JSON.stringify(devtoPublishResult)) : null,
        }
      });
    }
  } catch (saveErr: any) {
    console.warn(`[Observability] Failed to save final pipeline execution record: ${saveErr.message}`);
  }

  // Stage 6: Structured Execution Summary & GitHub Actions Output
  logStructured("INFO", "completed", `Post published successfully!`, {
    externalId: publishResult.externalId,
    url: publishResult.url,
    mode: publishResult.mode,
    retries: publishResult.retries,
    latencyMs: publishResult.latencyMs,
    totalDurationSec: durationSec,
    pipelineId,
    promptTokens,
    completionTokens,
    totalTokens,
    costUsd,
    modelsUsed,
  });

  const mediumSummaryLine = mediumPublishResult
    ? `\n| **Medium Publish** | Mode: \`${mediumPublishResult.mode}\` \\| URL: [View Medium Article](${mediumPublishResult.url}) | 🎉 ${mediumPublishResult.success ? "Published" : "Warning"} |`
    : "";

  const devtoSummaryLine = devtoPublishResult
    ? `\n| **Dev.to Publish** | Mode: \`${devtoPublishResult.mode}\` \\| URL: [View Dev.to Article](${devtoPublishResult.url}) | 🎉 ${devtoPublishResult.success ? "Published" : "Warning"} |`
    : "";

  const summaryMarkdown = `## 🚀 Daily Automated Multi-Platform Post Summary
  
| Metric | Details |
| :--- | :--- |
| **Pipeline ID** | \`${pipelineId}\` |
| **Publish Mode** | \`${publishResult.mode}\` |
| **Total Swarm Duration** | \`${durationSec}s\` |
| **Total Prompt Tokens** | \`${promptTokens}\` |
| **Total Completion Tokens** | \`${completionTokens}\` |
| **Total USD Cost** | \`$${costUsd.toFixed(5)}\` |
| **Models Activated** | \`${modelsUsed.join(", ")}\` |

| Platform Stage | Details | Status |
| :--- | :--- | :--- |
| **Preflight Checks** | API Keys & Database verified | ✅ Passed |
| **Trend Discovered** | ${swarmResult.topic.title} | 🚀 Score: ${swarmResult.topic.score} |
| **Fact Verification** | Verified Claims | ✅ Score: ${swarmResult.factCheck.confidenceScore}% |
| **Quality Gate** | Smoke Tests & Swarm Review | ✅ Score: ${swarmResult.review.overallScore}/100 |
| **LinkedIn Publish** | Mode: \`${publishResult.mode}\` \\| ID: \`${publishResult.externalId}\` | 🎉 Published |${mediumSummaryLine}${devtoSummaryLine}

- **LinkedIn Post URL**: [View LinkedIn Post](${publishResult.url})
${mediumPublishResult ? `- **Medium Article URL**: [View Medium Article](${mediumPublishResult.url})\n` : ""}${devtoPublishResult ? `- **Dev.to Article URL**: [View Dev.to Article](${devtoPublishResult.url})\n` : ""}- **Retries**: ${publishResult.retries}
- **Published At**: ${publishResult.publishedAt}`;

  writeGitHubStepSummary(summaryMarkdown);

  console.log("\n==========================================================");
  console.log(" 🎉 PIPELINE & PUBLISHING COMPLETED SUCCESSFULLY          ");
  console.log("==========================================================");
  console.log(`Pipeline ID:    ${pipelineId}`);
  console.log(`Topic:          ${swarmResult.topic.title}`);
  console.log(`Quality Score:  ${swarmResult.review.overallScore}/100`);
  console.log(`Publish Mode:   ${publishResult.mode}`);
  console.log(`Post ID:        ${publishResult.externalId}`);
  console.log(`Post URL:       ${publishResult.url}`);
  console.log(`Duration:       ${durationSec}s`);
  console.log(`Estimated Cost: $${costUsd.toFixed(5)}`);
  console.log("==========================================================");
  writeGitHubOutput("status", "success");
  writeGitHubOutput("topic", swarmResult.topic.title);
  writeGitHubOutput("linkedin_url", publishResult.url);
}

main().catch((err) => {
  logStructured("ERROR", "fatal", `Pipeline failed with error: ${err.message}`, { stack: err.stack });
  console.error("\n❌ Pipeline failed with error:", err.message);
  writeGitHubOutput("status", "failure");
  writeGitHubOutput("error", err.message);
  process.exit(1);
});

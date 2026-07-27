import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { agentOrchestrator } from "../packages/agents/src/index";
import { publisherService, MissingAccessTokenError } from "../packages/publisher/src/index";
import { Platform, PublishMode as SharedPublishMode } from "../packages/shared/src/index";

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
// PREFLIGHT CHECK
// ==========================================

function runPreflightChecks(mode: PublishMode): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  logStructured("INFO", "preflight", "Running preflight validation checks...");

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const nvidiaKey = process.env.NVIDIA_NIM_API_KEY;
  if (!openrouterKey && !nvidiaKey) {
    warnings.push("Neither OPENROUTER_API_KEY nor NVIDIA_NIM_API_KEY is configured. Falling back to synthetic responses.");
  }

  const linkedinToken = process.env.LINKEDIN_ACCESS_TOKEN?.trim();
  if (mode === PublishMode.LIVE && !linkedinToken) {
    errors.push("LINKEDIN_ACCESS_TOKEN is missing or empty in LIVE publish mode.");
  } else if (!linkedinToken) {
    warnings.push("LINKEDIN_ACCESS_TOKEN is missing. Pipeline will operate in SIMULATION mode.");
  }

  return { valid: errors.length === 0, errors, warnings };
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

  logStructured("INFO", "init", `Execution configured with Mode: [${mode}] | Dry-Run: ${isDryRun}`);

  // Stage 1: Preflight Validation
  const preflight = runPreflightChecks(mode);
  if (preflight.warnings.length > 0) {
    preflight.warnings.forEach((w) => logStructured("WARN", "preflight", w));
  }

  if (!preflight.valid) {
    preflight.errors.forEach((e) => logStructured("ERROR", "preflight", e));
    writeGitHubStepSummary(`### ❌ Preflight Check Failed\n\n${preflight.errors.map((e) => `- ${e}`).join("\n")}`);
    throw new Error(`Preflight check failed: ${preflight.errors.join("; ")}`);
  }
  logStructured("INFO", "preflight", "Preflight checks passed successfully ✅");

  // Stage 2: Swarm Execution (Agent Generation & Quality Evaluation)
  logStructured("INFO", "swarm", "Executing Multi-Agent Swarm (Trend, Research, FactCheck, Writing, Quality Review)...");
  const swarmResult = await agentOrchestrator.executePipeline(false);

  logStructured("INFO", "trend_discovery", `Primary Topic: "${swarmResult.topic.title}" (Score: ${swarmResult.topic.score})`);
  logStructured("INFO", "fact_verification", `Fact Check Score: ${swarmResult.factCheck.confidenceScore}% (Passed: ${swarmResult.factCheck.factCheckPassed})`);
  logStructured("INFO", "quality_review", `Quality Gate Score: ${swarmResult.review.overallScore}/100 (Passed: ${swarmResult.review.passedThreshold})`);

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
    logStructured("WARN", "idempotency", skipMsg);

    writeGitHubStepSummary(
      `## ⚠️ Pipeline Skipped (Idempotency Guard)\n\n${skipMsg}\n\n- **Topic**: ${swarmResult.topic.title}\n- **Quality Score**: ${swarmResult.review.overallScore}/100`
    );

    console.log(`\n==========================================================`);
    console.log(` ⏭️ PIPELINE COMPLETED (SKIPPED DUPLICATE PUBLISH)       `);
    console.log(`==========================================================`);
    return;
  }

  // Stage 4: Publish to LinkedIn Platform
  logStructured("INFO", "publisher", `Dispatching post to LinkedIn Publisher in [${mode}] mode...`);

  let publishResult;
  try {
    publishResult = await publisherService.publish(Platform.LINKEDIN, swarmResult.linkedInPost, { mode });
  } catch (err: any) {
    saveToDeadLetterQueue(swarmResult.linkedInPost, err.message);
    logStructured("ERROR", "publisher", `Publishing failed with exception: ${err.message}`, { mode, error: err.message });
    writeGitHubStepSummary(
      `## ❌ LinkedIn Publishing Failed\n\n- **Error**: ${err.message}\n- **Mode**: ${mode}\n- **Topic**: ${swarmResult.topic.title}`
    );
    throw err;
  }

  if (!publishResult.success) {
    saveToDeadLetterQueue(swarmResult.linkedInPost, publishResult.message || publishResult.reason || "Publish failed");
    logStructured("ERROR", "publisher", `LinkedIn API publishing failed: ${publishResult.message}`, publishResult);
    writeGitHubStepSummary(
      `## ❌ LinkedIn Publishing Failed\n\n- **Message**: ${publishResult.message}\n- **Reason**: ${publishResult.reason || "N/A"}\n- **Mode**: ${publishResult.mode}`
    );
    throw new Error(`LinkedIn publishing failed: ${publishResult.message}`);
  }

  // If live posting was requested but mode returned simulation unexpectedly
  if (mode === PublishMode.LIVE && publishResult.mode === "SIMULATION") {
    const err = "Requested LIVE publishing mode but publisher returned SIMULATION mode.";
    saveToDeadLetterQueue(swarmResult.linkedInPost, err);
    logStructured("ERROR", "publisher", err, publishResult);
    throw new Error(err);
  }

  // Record idempotency state on success
  recordPublishedState(idempotency.dateKey, idempotency.hash, publishResult.externalId);

  // Stage 4b: Publish to Medium Platform
  let mediumPublishResult = null;
  const mediumToken = process.env.MEDIUM_INTEGRATION_TOKEN?.trim();
  if (mediumToken || mode === PublishMode.LIVE) {
    logStructured("INFO", "publisher", `Dispatching article to Medium Publisher in [${mode}] mode...`);
    try {
      mediumPublishResult = await publisherService.publish(Platform.MEDIUM, swarmResult.mediumArticle, { mode });
      if (mediumPublishResult.success) {
        logStructured("INFO", "publisher", `Medium article published successfully!`, { url: mediumPublishResult.url, mode: mediumPublishResult.mode });
      } else {
        logStructured("WARN", "publisher", `Medium publishing warning: ${mediumPublishResult.message}`);
      }
    } catch (mErr: any) {
      logStructured("WARN", "publisher", `Medium publishing exception: ${mErr.message}`);
    }
  // Stage 4c: Publish to Dev.to Platform
  let devtoPublishResult = null;
  const devtoApiKey = process.env.DEVTO_API_KEY?.trim();
  if (devtoApiKey || mode === PublishMode.LIVE) {
    logStructured("INFO", "publisher", `Dispatching article to Dev.to Publisher in [${mode}] mode...`);
    try {
      devtoPublishResult = await publisherService.publish(Platform.DEVTO, swarmResult.mediumArticle, { mode });
      if (devtoPublishResult.success) {
        logStructured("INFO", "publisher", `Dev.to article published successfully!`, { url: devtoPublishResult.url, mode: devtoPublishResult.mode });
      } else {
        logStructured("WARN", "publisher", `Dev.to publishing warning: ${devtoPublishResult.message}`);
      }
    } catch (dErr: any) {
      logStructured("WARN", "publisher", `Dev.to publishing exception: ${dErr.message}`);
    }
  }

  const durationMs = Date.now() - startTime;
  const durationSec = (durationMs / 1000).toFixed(2);

  // Stage 5: Structured Execution Summary & GitHub Actions Output
  logStructured("INFO", "completed", `Post published successfully!`, {
    externalId: publishResult.externalId,
    url: publishResult.url,
    mode: publishResult.mode,
    retries: publishResult.retries,
    latencyMs: publishResult.latencyMs,
    totalDurationSec: durationSec,
  });

  const mediumSummaryLine = mediumPublishResult
    ? `\n| **Medium Publish** | Mode: \`${mediumPublishResult.mode}\` \\| URL: [View Medium Article](${mediumPublishResult.url}) | 🎉 ${mediumPublishResult.success ? "Published" : "Warning"} |`
    : "";

  const devtoSummaryLine = devtoPublishResult
    ? `\n| **Dev.to Publish** | Mode: \`${devtoPublishResult.mode}\` \\| URL: [View Dev.to Article](${devtoPublishResult.url}) | 🎉 ${devtoPublishResult.success ? "Published" : "Warning"} |`
    : "";

  const summaryMarkdown = `## 🚀 Daily Automated Multi-Platform Post Summary

| Stage | Details | Status |
| :--- | :--- | :--- |
| **Preflight Checks** | API Keys & Token Verified | ✅ Passed |
| **Trend Discovered** | ${swarmResult.topic.title} | 🚀 Score: ${swarmResult.topic.score} |
| **Fact Verification** | Verified Technical Claims | ✅ Score: ${swarmResult.factCheck.confidenceScore}% |
| **Quality Gate** | Multi-Agent Review | ✅ Score: ${swarmResult.review.overallScore}/100 |
| **LinkedIn Publish** | Mode: \`${publishResult.mode}\` \\| ID: \`${publishResult.externalId}\` | 🎉 Published |${mediumSummaryLine}${devtoSummaryLine}

- **LinkedIn Post URL**: [View LinkedIn Post](${publishResult.url})
${mediumPublishResult ? `- **Medium Article URL**: [View Medium Article](${mediumPublishResult.url})\n` : ""}${devtoPublishResult ? `- **Dev.to Article URL**: [View Dev.to Article](${devtoPublishResult.url})\n` : ""}- **Retries**: ${publishResult.retries}
- **Total Execution Time**: ${durationSec}s
- **Published At**: ${publishResult.publishedAt}`;

  writeGitHubStepSummary(summaryMarkdown);

  console.log("\n==========================================================");
  console.log(" 🎉 PIPELINE & PUBLISHING COMPLETED SUCCESSFULLY          ");
  console.log("==========================================================");
  console.log(`Topic:          ${swarmResult.topic.title}`);
  console.log(`Quality Score:  ${swarmResult.review.overallScore}/100`);
  console.log(`Publish Mode:   ${publishResult.mode}`);
  console.log(`Post ID:        ${publishResult.externalId}`);
  console.log(`Post URL:       ${publishResult.url}`);
  console.log(`Duration:       ${durationSec}s`);
  console.log("==========================================================");
  console.log("🎉 Post published successfully to LinkedIn!");
}

main().catch((err) => {
  logStructured("ERROR", "fatal", `Pipeline failed with error: ${err.message}`, { stack: err.stack });
  console.error("\n❌ Pipeline failed with error:", err.message);
  process.exit(1);
});

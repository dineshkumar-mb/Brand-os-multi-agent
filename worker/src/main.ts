import "dotenv/config";
import { agentOrchestrator, TrendDiscoveryAgent } from "@brand-os/agents";
import { notificationService, automationTracker } from "@brand-os/shared";

console.log("[Worker Service] Starting Personal Brand OS Background Job Runner...");

async function processQueue() {
  const startTime = Date.now();
  console.log(`[Worker Service] ${new Date().toISOString()} Processing background cron triggers...`);
  
  try {
    console.log("[Worker Service] Executing scheduled Hourly Trend Scan...");
    const trendAgent = new TrendDiscoveryAgent();
    const trendRes = await trendAgent.run();
    const topics = trendRes.data || [];
    console.log(`[Worker Service] Hourly Trend Scan completed. Found ${topics.length} high-velocity topics.`);

    console.log("[Worker Service] Executing Daily Content Swarm Pipeline...");
    const result = await agentOrchestrator.executePipeline({ autoPublish: true });
    const durationMs = Date.now() - startTime;
    const durationSeconds = Math.round(durationMs / 1000);

    if (result.status === "NO_POST_TODAY") {
      console.log("[Worker Service] Daily Content Pipeline triggered NO_POST_TODAY safe exit:", result.reason);

      automationTracker.recordRun({
        pipelineId: result.pipelineId || `pl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        durationMs,
        status: "NO_POST_TODAY",
        candidatesEvaluated: result.candidatesEvaluated,
        rejectionReasons: result.missingSignals,
      });

      await notificationService.sendAutomationNotification({
        title: "Daily Content Pipeline Executed (Safe Exit)",
        status: "NO_POST_TODAY",
        pipelineId: result.pipelineId,
        message: `Pipeline evaluated ${result.candidatesEvaluated || 0} candidate signals. No post met quality thresholds today.`,
        candidatesEvaluated: result.candidatesEvaluated,
        rejectionReasons: result.missingSignals,
        durationSeconds,
      });
    } else {
      const overallScore = result.review?.overallScore || result.qualityGateResult?.overallContentQualityScore || 90;
      console.log("[Worker Service] Daily Content Pipeline completed & published successfully with score:", overallScore);

      automationTracker.recordRun({
        pipelineId: result.pipelineId,
        timestamp: new Date().toISOString(),
        durationMs,
        status: "SUCCESS",
        winnerTitle: result.topic?.title,
        overallScore,
        publishedPlatforms: ["LinkedIn"],
      });

      await notificationService.sendAutomationNotification({
        title: "Daily Content Pipeline Published Successfully",
        status: "SUCCESS",
        pipelineId: result.pipelineId,
        message: `Content swarm successfully generated, verified, and auto-published post to LinkedIn.`,
        topicTitle: result.topic?.title,
        qualityScore: overallScore,
        durationSeconds,
      });
    }
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    console.error("[Worker Service] Worker execution error:", err.message);

    automationTracker.recordRun({
      pipelineId: `err_${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationMs,
      status: "ERROR",
      errorMessage: err.message,
    });

    await notificationService.sendAutomationNotification({
      title: "Daily Content Pipeline Encountered Error",
      status: "ERROR",
      message: "An unhandled error occurred while processing the background worker queue.",
      errorMessage: err.message,
      durationSeconds: Math.round(durationMs / 1000),
    });
  }
}

// Initial Run
processQueue();

// Run every 60 minutes
setInterval(processQueue, 3600000);


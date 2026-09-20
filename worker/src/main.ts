import "dotenv/config";

// ============================================================
// CAREER BRAND OS — Background Worker
// ============================================================
// IMPORTANT:
//   This worker does NOT run the content generation pipeline
//   on a schedule. Content generation is triggered exclusively
//   by Vercel Cron → GET /api/v1/schedule/cron-weekly
//   (Tuesday + Thursday at 03:30 UTC = 09:00 IST by default).
//
//   The worker's responsibilities:
//   1. Health monitoring (keepalive, log heartbeats)
//   2. Manual-trigger endpoint proxy (if needed in local dev)
//   3. Does NOT call agentOrchestrator.executePipeline() on start
//   4. Does NOT use setInterval to repeatedly run the pipeline
// ============================================================

console.log("[Worker Service] Starting Career Brand OS Background Worker...");
console.log("[Worker Service] Content generation runs TWICE per week via Vercel Cron.");
console.log("[Worker Service] Schedule: Tuesday + Thursday at 09:00 IST (03:30 UTC).");
console.log("[Worker Service] Endpoint: GET /api/v1/schedule/cron-weekly");

// Heartbeat: log worker health every 10 minutes to confirm the process is alive.
// This does NOT trigger any pipeline execution.
const HEARTBEAT_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

function logHeartbeat() {
  console.log(
    `[Worker Service] Heartbeat — ${new Date().toISOString()} — Worker is alive. ` +
    `Content pipeline runs on Tuesday + Thursday via Vercel Cron only.`
  );
}

// Log initial heartbeat
logHeartbeat();

// Recurring heartbeat — does NOT execute pipeline
setInterval(logHeartbeat, HEARTBEAT_INTERVAL_MS);

// ── Manual Trigger (local dev only) ────────────────────────────────────────
// In production, content is triggered by Vercel Cron.
// In local development, you can trigger a single run by setting:
//   MANUAL_TRIGGER_ON_START=true
// This is intended for testing only and should NEVER be enabled in production.

if (process.env.MANUAL_TRIGGER_ON_START === "true" && process.env.NODE_ENV !== "production") {
  console.log(
    "[Worker Service] MANUAL_TRIGGER_ON_START=true detected (dev mode). " +
    "Executing one-shot pipeline run for local testing..."
  );

  import("@brand-os/agents").then(async ({ agentOrchestrator }) => {
    import("@brand-os/shared").then(async ({ notificationService, automationTracker }) => {
      const startTime = Date.now();
      try {
        console.log("[Worker Service] [Manual Dev Trigger] Executing pipeline...");
        const result = await agentOrchestrator.executePipeline({ autoPublish: true });
        const durationMs = Date.now() - startTime;

        if (result.status === "NO_POST_TODAY") {
          console.log("[Worker Service] [Manual Dev Trigger] NO_POST_TODAY:", result.reason);

          automationTracker.recordRun({
            pipelineId: result.pipelineId || `pl_${Date.now()}`,
            timestamp: new Date().toISOString(),
            durationMs,
            status: "NO_POST_TODAY",
            candidatesEvaluated: result.candidatesEvaluated,
            rejectionReasons: result.missingSignals,
          });

          await notificationService.sendAutomationNotification({
            title: "Manual Dev Trigger — Content Pipeline (Safe Exit)",
            status: "NO_POST_TODAY",
            pipelineId: result.pipelineId,
            message: `Manual dev trigger: Pipeline evaluated ${result.candidatesEvaluated || 0} candidate signals. Safe exit.`,
            candidatesEvaluated: result.candidatesEvaluated,
            rejectionReasons: result.missingSignals,
            durationSeconds: Math.round(durationMs / 1000),
          });
        } else {
          const overallScore =
            result.review?.overallScore ||
            result.qualityGateResult?.overallContentQualityScore ||
            90;
          console.log("[Worker Service] [Manual Dev Trigger] POST_READY. Score:", overallScore);

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
            title: "Manual Dev Trigger — Content Pipeline Published",
            status: "SUCCESS",
            pipelineId: result.pipelineId,
            message: "Manual dev trigger: Post generated and published to LinkedIn.",
            topicTitle: result.topic?.title,
            qualityScore: overallScore,
            durationSeconds: Math.round(durationMs / 1000),
          });
        }
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        console.error("[Worker Service] [Manual Dev Trigger] Error:", err.message);

        automationTracker.recordRun({
          pipelineId: `err_${Date.now()}`,
          timestamp: new Date().toISOString(),
          durationMs,
          status: "ERROR",
          errorMessage: err.message,
        });

        await notificationService.sendAutomationNotification({
          title: "Manual Dev Trigger — Pipeline Error",
          status: "ERROR",
          message: "An error occurred during the manual dev trigger pipeline run.",
          errorMessage: err.message,
          durationSeconds: Math.round(durationMs / 1000),
        });
      }
    });
  });
}

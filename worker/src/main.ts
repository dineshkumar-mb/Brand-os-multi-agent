import path from "path";
import fs from "fs";

// Load environment variables from file if present
function loadEnvFile(envPath: string) {
  if (!fs.existsSync(envPath)) return;
  try {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const rawLine of content.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIdx = line.indexOf("=");
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  } catch {
    // Non-blocking env parse failure
  }
}

// Resolve environment variables from all possible locations
const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env"),
];

for (const envPath of possibleEnvPaths) {
  loadEnvFile(envPath);
}

// ============================================================
// CAREER BRAND OS — Background Worker & Autonomous Scheduler
// ============================================================
// Execution Model:
//   1. Autonomous Worker Scheduler: Runs inside this process, checking every
//      30 seconds if the current moment matches the configured generation
//      window (Tuesday + Thursday at 09:00 IST / Asia/Kolkata).
//   2. Vercel Cron Endpoint: Also supported via GET /api/v1/schedule/cron-weekly.
//   3. Distributed Idempotency: Uses scheduleConfig.hasDuplicateRun to ensure
//      a calendar-day slot executes EXACTLY ONCE, whether triggered by worker
//      or Vercel Cron.
//   4. Health Heartbeats: Logs keepalive status every 10 minutes.
// ============================================================

import { scheduleConfig } from "@brand-os/scheduler";
import { agentOrchestrator } from "@brand-os/agents";
import { notificationService, automationTracker } from "@brand-os/shared";

const cfg = scheduleConfig.getConfig();
console.log("[Worker Service] Starting Career Brand OS Background Worker...");
console.log(`[Worker Service] ${scheduleConfig.describe()}`);

let isPipelineRunning = false;

/**
 * Executes a single scheduled or manual pipeline run with full error handling,
 * stage-level logging, persistence, and notifications.
 */
async function runScheduledPipeline(triggerSource: "AUTONOMOUS_WORKER_SCHEDULER" | "MANUAL_DEV_TRIGGER") {
  if (isPipelineRunning) {
    console.warn(`[Worker Service] Pipeline execution already in progress. Skipping ${triggerSource} trigger.`);
    return;
  }

  isPipelineRunning = true;
  const startTime = Date.now();
  const now = new Date();
  const dayName = scheduleConfig.getWeekdayName(now.getDay());
  const idempotencyKey = scheduleConfig.getIdempotencyKey(now);

  console.log(`[Worker Service] [${triggerSource}] Executing pipeline for ${dayName} (Key: ${idempotencyKey})...`);

  try {
    const result = await agentOrchestrator.executePipeline({ autoPublish: true });
    const durationMs = Date.now() - startTime;
    const durationSeconds = Math.round(durationMs / 1000);

    if (result.status === "NO_POST_TODAY") {
      console.log(`[Worker Service] [${triggerSource}] Pipeline completed with safe exit: NO_POST_TODAY. Reason:`, result.reason);

      automationTracker.recordRun({
        pipelineId: result.pipelineId || `pl_${Date.now()}`,
        timestamp: now.toISOString(),
        durationMs,
        status: "NO_POST_TODAY",
        candidatesEvaluated: result.candidatesEvaluated,
        rejectionReasons: result.missingSignals,
      });

      const intel = result.dailyIntelligenceSummary;
      await notificationService.sendAutomationNotification({
        title: `⚠️ CAREER BRAND OS — ${dayName} Worker Run (Safe Exit)`,
        status: "NO_POST_TODAY",
        pipelineId: result.pipelineId,
        message: `Worker scheduled run on ${dayName} evaluated ${result.candidatesEvaluated || 0} candidates. Safe exit executed without publishing.`,
        candidatesEvaluated: result.candidatesEvaluated,
        rejectionReasons: result.missingSignals,
        durationSeconds,
        signalsScanned: intel?.signalsScanned,
        verifiedEvents: intel?.verifiedEvents,
        freshEvents: intel?.freshEvents,
        novelOpportunities: intel?.novelOpportunities,
        experienceMatches: intel?.experienceMatches,
      });
    } else {
      const qg = result.qualityGateResult;
      const overallScore = qg?.overallContentQualityScore || result.review?.overallScore || 90;
      const pubResult = result.publishResult;
      const pubMode = pubResult?.mode || process.env.PUBLISH_MODE || "LIVE";
      const isSimulation = pubMode.toUpperCase() === "SIMULATION";

      console.log(`[Worker Service] [${triggerSource}] POST_READY and dispatched (${pubMode}). Overall score: ${overallScore}/100.`);

      automationTracker.recordRun({
        pipelineId: result.pipelineId,
        timestamp: now.toISOString(),
        durationMs,
        status: "SUCCESS",
        winnerTitle: result.topic?.title,
        overallScore,
        topicNoveltyScore: qg?.topicNovelty,
        recruiterAttractionScore: result.dailyIntelligenceSummary?.scores?.recruiterAttraction,
        demonstratedSkills: result.topic?.supportingTech,
        publishMode: pubMode,
        externalPostId: pubResult?.externalId,
        postUrl: pubResult?.url,
        publishedPlatforms: [isSimulation ? "SIMULATION" : "LinkedIn"],
      });

      await notificationService.sendAutomationNotification({
        title: `✅ CAREER BRAND OS — ${dayName} Worker Run (${isSimulation ? "Simulation" : "Published"})`,
        status: "SUCCESS",
        pipelineId: result.pipelineId,
        message: isSimulation
          ? `${dayName} worker content pipeline ran in Simulation mode. Post validated.`
          : `${dayName} post successfully published to LinkedIn via autonomous worker!`,
        topicTitle: result.topic?.title,
        qualityScore: overallScore,
        freshnessScore: qg?.trendFreshness,
        noveltyScore: qg?.topicNovelty,
        careerSignalScore: qg?.careerSignal,
        visualNoveltyScore: qg?.visualNovelty,
        experienceMatchScore: qg?.experienceMatch,
        durationSeconds,
        publishMode: pubMode,
        postUrl: pubResult?.url,
      });
    }
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[Worker Service] [${triggerSource}] Unhandled Error:`, err.message, err.stack);

    automationTracker.recordRun({
      pipelineId: `err_${Date.now()}`,
      timestamp: now.toISOString(),
      durationMs,
      status: "ERROR",
      errorMessage: err.message,
    });

    await notificationService.sendAutomationNotification({
      title: "❌ CAREER BRAND OS — Worker Pipeline Error",
      status: "ERROR",
      message: `An error occurred during worker scheduled execution on ${dayName}.`,
      errorMessage: `${err.message}\n\nStack: ${err.stack?.substring(0, 400) || "N/A"}`,
      durationSeconds: Math.round(durationMs / 1000),
    });
  } finally {
    isPipelineRunning = false;
  }
}

/**
 * Evaluates whether the current moment in Asia/Kolkata matches the schedule window.
 */
function checkScheduleWindow(): void {
  const now = new Date();
  const currentCfg = scheduleConfig.getConfig();

  // Guard 1: Weekend block
  if (scheduleConfig.isWeekend(now)) return;

  // Guard 2: Must be a configured weekday (Tuesday or Thursday)
  if (!scheduleConfig.isScheduledDay(now)) return;

  // Format current time in configured timezone (HH:MM)
  const currentTimeInTz = new Intl.DateTimeFormat("en-GB", {
    timeZone: currentCfg.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const [schedH, schedM] = currentCfg.generationTime.split(":").map(Number);
  const [currH, currM] = currentTimeInTz.split(":").map(Number);

  // Active execution window: within 10 minutes of configured generation time (e.g. 09:00 - 09:10 IST)
  const schedTotalMin = schedH * 60 + schedM;
  const currTotalMin = currH * 60 + currM;
  const isInsideWindow = currTotalMin >= schedTotalMin && currTotalMin < schedTotalMin + 10;

  if (!isInsideWindow) return;

  // Guard 3: Idempotency check — ensure today has not already run
  const history = automationTracker.getHistory(20);
  if (scheduleConfig.hasDuplicateRun(history, now)) {
    return; // Already executed today
  }

  console.log(
    `[Worker Scheduler] Trigger condition met: ${currentTimeInTz} ${currentCfg.timezone} on ${scheduleConfig.getWeekdayName(now.getDay())}. Initiating scheduled run...`
  );
  runScheduledPipeline("AUTONOMOUS_WORKER_SCHEDULER");
}

// ── Background Scheduling & Heartbeats ──────────────────────────────────────
const SCHEDULE_CHECK_INTERVAL_MS = 30 * 1000; // Check schedule every 30 seconds
const HEARTBEAT_INTERVAL_MS = 10 * 60 * 1000;  // Heartbeat every 10 minutes

setInterval(checkScheduleWindow, SCHEDULE_CHECK_INTERVAL_MS);

function logHeartbeat() {
  console.log(
    `[Worker Service] Heartbeat — ${new Date().toISOString()} — Worker is active. ` +
    `Autonomous schedule: ${cfg.generationDays.join(" + ")} at ${cfg.generationTime} ${cfg.timezone}.`
  );
}

logHeartbeat();
setInterval(logHeartbeat, HEARTBEAT_INTERVAL_MS);

// ── Manual Dev Trigger (dev mode only) ──────────────────────────────────────
if (process.env.MANUAL_TRIGGER_ON_START === "true" && process.env.NODE_ENV !== "production") {
  console.log("[Worker Service] MANUAL_TRIGGER_ON_START=true detected. Executing one-shot manual run...");
  runScheduledPipeline("MANUAL_DEV_TRIGGER");
}

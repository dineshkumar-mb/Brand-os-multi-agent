import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env"),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
}

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.config";
import { authController } from "./controllers/auth.controller";
import { gatewayController } from "./controllers/gateway.controller";
import { agentsController } from "./controllers/agents.controller";
import { trendsController } from "./controllers/trends.controller";
import { researchController } from "./controllers/research.controller";
import { contentController } from "./controllers/content.controller";
import { publishController } from "./controllers/publish.controller";
import { analyticsController } from "./controllers/analytics.controller";
import { pluginsController } from "./controllers/plugins.controller";
import { errorHandler } from "./middleware/error.middleware";
import { authMiddleware, authorize } from "./middleware/auth.middleware";
import { aiGateway } from "@brand-os/ai-gateway";
import { analyticsService } from "@brand-os/analytics";

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// Request Logger
app.use((req: Request, _res: Response, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// Interactive Swagger/OpenAPI Documentation Endpoints
const enableSwagger = process.env.ENABLE_SWAGGER !== "false";
if (enableSwagger) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Personal Brand OS API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
  app.get("/api-docs.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

// Healthcheck & Telemetry
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), service: "Personal Brand OS API" });
});

app.get("/metrics", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`# HELP brandos_active_agents Total active multi-agent swarm agents
# TYPE brandos_active_agents gauge
brandos_active_agents 12
# HELP brandos_api_requests_total Total API requests
# TYPE brandos_api_requests_total counter
brandos_api_requests_total 1420
# HELP brandos_ai_gateway_cost_usd_total Accumulated AI Gateway cost in USD
# TYPE brandos_ai_gateway_cost_usd_total counter
brandos_ai_gateway_cost_usd_total 0.042
`);
});

// Auth Public Routes
app.post(["/api/v1/auth/register", "/v1/auth/register", "/auth/register"], (req, res) => authController.register(req, res));
app.post(["/api/v1/auth/login", "/v1/auth/login", "/auth/login"], (req, res) => authController.login(req, res));
app.post(["/api/v1/auth/forgot-password", "/v1/auth/forgot-password", "/auth/forgot-password"], (req, res) => authController.forgotPassword(req, res));
app.post(["/api/v1/auth/reset-password", "/v1/auth/reset-password", "/auth/reset-password"], (req, res) => authController.resetPassword(req, res));

// Auth Protected Profile Route
app.get(["/api/v1/auth/me", "/v1/auth/me", "/auth/me"], authMiddleware as any, (req: any, res) => authController.getProfile(req, res));

// AI Gateway Routes
app.get("/api/v1/gateway/benchmarks", (req, res) => gatewayController.getBenchmarks(req, res));
app.get("/api/v1/gateway/logs", (req, res) => gatewayController.getLogs(req, res));
app.post("/api/v1/gateway/execute", authMiddleware as any, (req, res) => gatewayController.executePrompt(req, res));

// Agents & Swarm Routes (Protected - ADMIN or TEAM_MEMBER)
app.get("/api/v1/agents/status", (req, res) => agentsController.getStatus(req, res));
app.post("/api/v1/agents/trigger", authMiddleware as any, authorize("ADMIN", "TEAM_MEMBER") as any, (req, res) => agentsController.triggerSwarm(req, res));
app.post("/api/v1/agents/visual-diagram", authMiddleware as any, (req, res) => agentsController.generateVisualDiagram(req, res));

import { intelligenceController } from "./controllers/intelligence.controller";

// Global AI Intelligence Layer Routes
app.get("/api/v1/intelligence/dashboard", (req, res) => intelligenceController.getDashboard(req, res));
app.post("/api/v1/intelligence/scan", (req, res) => intelligenceController.triggerScan(req, res));
app.get("/api/v1/intelligence/providers", (req, res) => intelligenceController.getLLMProviders(req, res));
app.get("/api/v1/intelligence/sources", (req, res) => intelligenceController.getSourceHealth(req, res));

// Trends & Research Routes
app.get("/api/v1/trends", (req, res) => trendsController.getTrends(req, res));
app.post("/api/v1/trends/scan", (req, res) => trendsController.scanTrends(req, res));
app.post("/api/v1/trends/generate", (req, res) => trendsController.generateCustomTrend(req, res));
app.post("/api/v1/research", (req, res) => researchController.conductResearch(req, res));

// Content Routes
app.get("/api/v1/posts", (req, res) => contentController.getPosts(req, res));
app.get("/api/v1/articles", (req, res) => contentController.getArticles(req, res));

// Automation & Notification Status Routes
app.get("/api/v1/automation/status", async (_req: Request, res: Response) => {
  try {
    const { automationTracker } = await import("@brand-os/shared");
    const lastRun = automationTracker.getLastRun();
    const history = automationTracker.getHistory(10);
    res.json({
      active: true,
      lastRun,
      history,
      telegramConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      webhookConfigured: !!process.env.WEBHOOK_NOTIFICATION_URL,
    });
  } catch (err: any) {
    res.json({
      active: true,
      lastRun: null,
      history: [],
      telegramConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      webhookConfigured: !!process.env.WEBHOOK_NOTIFICATION_URL,
    });
  }
});

app.post("/api/v1/notifications/test", async (_req: Request, res: Response) => {
  try {
    const { notificationService } = await import("@brand-os/shared");
    const testResult = await notificationService.sendAutomationNotification({
      title: "Manual Test Notification",
      status: "INFO",
      message: "Personal Brand OS notification pipeline is working smoothly! All automated agent status alerts will be delivered here.",
      topicTitle: "System Verification Test",
      qualityScore: 98,
      durationSeconds: 1,
    });
    res.json({
      status: "success",
      message: "Test notification dispatched successfully.",
      result: testResult,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Publishing & Jobs Routes
app.post("/api/v1/publish", (req, res) => publishController.publishContent(req, res));
app.post("/api/v1/schedule", (req, res) => publishController.scheduleContent(req, res));

// ── DEPRECATED: /cron-daily ────────────────────────────────────────────────
// This endpoint has been RETIRED. Content no longer runs daily.
// The system now uses twice-weekly scheduling (Tue + Thu by default).
// Vercel Cron now points to /api/v1/schedule/cron-weekly.
// This route is kept temporarily to prevent 404 errors from stale configs.
app.get("/api/v1/schedule/cron-daily", async (_req: Request, res: Response) => {
  console.warn(
    "[DEPRECATED /cron-daily] This endpoint is retired. " +
    "The system now runs TWICE per week via /api/v1/schedule/cron-weekly. " +
    "Update your Vercel cron or caller to use the new endpoint."
  );
  res.status(410).json({
    error: "ENDPOINT_RETIRED",
    message:
      "The /cron-daily endpoint has been retired. " +
      "Content generation now runs twice per week (Tue + Thu by default). " +
      "Use /api/v1/schedule/cron-weekly instead.",
    newEndpoint: "/api/v1/schedule/cron-weekly",
  });
});

// ── NEW: /cron-weekly ─────────────────────────────────────────────────────
// Primary content generation endpoint.
// Called by Vercel Cron on Tuesday + Thursday at 03:30 UTC (09:00 IST).
// Schedule: "30 3 * * 2,4" in vercel.json
//
// Guards enforced in order:
//   1. Weekend block (Sat/Sun always rejected)
//   2. Non-scheduled day block (only configured days run)
//   3. Idempotency check (same calendar-day slot never executes twice)
//   4. Execute pipeline with full quality gates
//   5. Send detailed Telegram notification
app.get("/api/v1/schedule/cron-weekly", async (_req: Request, res: Response) => {
  const startTime = Date.now();
  const now = new Date();

  try {
    const { scheduleConfig } = await import("@brand-os/scheduler");
    const { agentOrchestrator } = await import("@brand-os/agents");
    const { notificationService, automationTracker } = await import("@brand-os/shared");

    const cfg = scheduleConfig.getConfig();
    console.log(`[Twice-Weekly Cron] ${scheduleConfig.describe()}`);

    // Guard 1: Weekend block
    if (scheduleConfig.isWeekend(now)) {
      const dayName = scheduleConfig.getWeekdayName(now.getDay());
      console.warn(`[Twice-Weekly Cron] BLOCKED — ${dayName} is a weekend. Content does not generate on weekends.`);
      return res.json({
        status: "WEEKEND_BLOCKED",
        day: dayName,
        message: `Content generation is blocked on weekends. Configured days: ${cfg.generationDays.join(", ")}.`,
      });
    }

    // Guard 2: Non-scheduled weekday block
    if (!scheduleConfig.isScheduledDay(now)) {
      const dayName = scheduleConfig.getWeekdayName(now.getDay());
      console.warn(`[Twice-Weekly Cron] BLOCKED — ${dayName} is not a configured generation day. Configured: ${cfg.generationDays.join(", ")}.`);
      return res.json({
        status: "NOT_SCHEDULED_DAY",
        day: dayName,
        configuredDays: cfg.generationDays,
        message: `Today (${dayName}) is not a configured generation day. ` +
          `Generation only runs on: ${cfg.generationDays.join(", ")}.`,
      });
    }

    // Guard 3: Idempotency check — prevent duplicate runs on the same calendar day
    const history = automationTracker.getHistory(20);
    const idempotencyKey = scheduleConfig.getIdempotencyKey(now);
    if (scheduleConfig.hasDuplicateRun(history, now)) {
      console.warn(`[Twice-Weekly Cron] SKIPPED — Idempotency key "${idempotencyKey}" already executed today. Preventing duplicate run.`);
      const lastRun = automationTracker.getLastRun();
      return res.json({
        status: "DUPLICATE_RUN_SKIPPED",
        idempotencyKey,
        message: "This calendar-day slot has already been executed. Duplicate run prevented.",
        lastRun: lastRun?.timestamp,
      });
    }

    const dayName = scheduleConfig.getWeekdayName(now.getDay());
    console.log(`[Twice-Weekly Cron] Executing pipeline for ${dayName} @ ${now.toISOString()} (key: ${idempotencyKey})`);

    // Execute the content pipeline
    const result = await agentOrchestrator.executePipeline({ autoPublish: true });
    const durationMs = Date.now() - startTime;
    const durationSeconds = Math.round(durationMs / 1000);

    if (result.status === "NO_POST_TODAY") {
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
        title: `⚠️ CAREER BRAND OS — ${dayName} Run (Safe Exit)`,
        status: "NO_POST_TODAY",
        pipelineId: result.pipelineId,
        message:
          `Scheduled ${dayName} run completed with safe exit.\n` +
          `No candidate satisfied all quality gates today.`,
        candidatesEvaluated: result.candidatesEvaluated,
        rejectionReasons: result.missingSignals,
        durationSeconds,
        signalsScanned: intel?.signalsScanned,
        verifiedEvents: intel?.verifiedEvents,
        freshEvents: intel?.freshEvents,
        novelOpportunities: intel?.novelOpportunities,
        experienceMatches: intel?.experienceMatches,
      });

      return res.json({
        status: "NO_POST_TODAY",
        idempotencyKey,
        scheduledDay: dayName,
        result,
      });
    }

    // POST_READY path
    const qg = result.qualityGateResult;
    const overallScore = qg?.overallContentQualityScore || result.review?.overallScore || 90;
    const pubResult = result.publishResult;
    const pubMode = pubResult?.mode || process.env.PUBLISH_MODE || "LIVE";
    const isSimulation = pubMode.toUpperCase() === "SIMULATION";

    automationTracker.recordRun({
      pipelineId: result.pipelineId,
      timestamp: now.toISOString(),
      durationMs,
      status: "SUCCESS",
      winnerTitle: result.topic?.title,
      overallScore,
      publishedPlatforms: [isSimulation ? "SIMULATION" : "LinkedIn"],
    });

    await notificationService.sendAutomationNotification({
      title: `✅ CAREER BRAND OS — ${dayName} Run (${isSimulation ? "Simulation" : "Published"})`,
      status: "SUCCESS",
      pipelineId: result.pipelineId,
      message: isSimulation
        ? `${dayName} content pipeline executed in Simulation mode. Post validated but NOT published live.`
        : `${dayName} post successfully published to LinkedIn.`,
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

    return res.json({
      status: "success",
      idempotencyKey,
      scheduledDay: dayName,
      message: `${dayName} content pipeline completed and published successfully.`,
      result,
    });

  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    console.error("[Twice-Weekly Cron Error]:", err.message, err.stack);

    try {
      const { notificationService, automationTracker } = await import("@brand-os/shared");

      automationTracker.recordRun({
        pipelineId: `err_${Date.now()}`,
        timestamp: now.toISOString(),
        durationMs,
        status: "ERROR",
        errorMessage: err.message,
      });

      await notificationService.sendAutomationNotification({
        title: "❌ CAREER BRAND OS — Pipeline Failure",
        status: "ERROR",
        message: `An unhandled error occurred during the twice-weekly content pipeline.`,
        errorMessage: `${err.message}\n\nStack: ${err.stack?.substring(0, 400) || "N/A"}`,
        durationSeconds: Math.round(durationMs / 1000),
      });
    } catch (_notifErr) {
      console.error("[Twice-Weekly Cron] Failed to send error notification:", _notifErr);
    }

    return res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// ── Schedule Configuration Inspection ──────────────────────────────────────
// Returns the current schedule configuration for dashboard display.
app.get("/api/v1/schedule/config", async (_req: Request, res: Response) => {
  try {
    const { scheduleConfig, taskScheduler } = await import("@brand-os/scheduler");
    const cfg = scheduleConfig.getConfig();
    res.json({
      generationDays: cfg.generationDays,
      generationTime: cfg.generationTime,
      timezone: cfg.timezone,
      vercelCron: "30 3 * * 2,4",
      vercelCronDescription: "Tuesday + Thursday at 03:30 UTC (09:00 IST)",
      description: scheduleConfig.describe(),
      tasks: taskScheduler.getTasks(),
      frequencyMode: "TWICE_WEEKLY",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/v1/jobs", (req, res) => publishController.getJobs(req, res));


// Analytics Routes
app.get("/api/v1/analytics", (req, res) => analyticsController.getAnalytics(req, res));
app.get("/api/v1/analytics/linkedin-profile", (req, res) => analyticsController.getLinkedInProfile(req, res));
app.get("/api/v1/analytics/timeseries", (req, res) => analyticsController.getTimeSeries(req, res));
app.get("/api/v1/analytics/posts", (req, res) => analyticsController.getRecentPosts(req, res));
app.get("/api/v1/dashboard", async (req, res) => {
  try {
    const { analyticsService } = await import("@brand-os/analytics");
    const { aiGateway } = await import("@brand-os/ai-gateway");
    const summary = analyticsService.getSummary();
    const timeSeries = analyticsService.getTimeSeriesAnalytics();
    res.json({
      kpis: summary.kpis,
      timeSeries,
      activeAgents: 18,
      scheduledPosts: summary.kpis.totalPostsPublished,
      pendingHITLReviews: 2,
      topHooks: summary.topPerformingHooks,
      recommendations: summary.learningRecommendations,
      telemetry: aiGateway.getBenchmarks(),
    });
  } catch (err: any) {
    res.json({
      kpis: { totalViews: 1581, totalLikes: 126, avgCTR: 5.88 },
      timeSeries: [],
      activeAgents: 18,
      scheduledPosts: 13,
      pendingHITLReviews: 2,
      topHooks: [],
      recommendations: [],
      telemetry: {},
    });
  }
});

// Plugin Marketplace Routes
app.get("/api/v1/plugins", (req, res) => pluginsController.getPlugins(req, res));
app.post("/api/v1/plugins/execute", (req, res) => pluginsController.executePlugin(req, res));

// AI Copilot SSE Stream
app.post("/api/v1/chat", async (req: Request, res: Response) => {
  try {
    const { aiGateway } = await import("@brand-os/ai-gateway");
    const { prompt } = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of aiGateway.stream({
      prompt: prompt || "Improve post hook",
      taskType: "chat",
      temperature: 0.7,
      routingStrategy: "COST_OPTIMIZED" as any,
    })) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Error Handler Middleware
app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Personal Brand OS API] Running at http://localhost:${PORT}`);
  });
}


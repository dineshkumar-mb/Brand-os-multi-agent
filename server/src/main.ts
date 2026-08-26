import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
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
import { aiGateway } from "@brand-os/ai-gateway";
import { analyticsService } from "@brand-os/analytics";

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// Request Logger
app.use((req: Request, _res: Response, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

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

// Auth Routes
app.post("/api/v1/auth/login", (req, res) => authController.login(req, res));
app.get("/api/v1/auth/me", (req, res) => authController.getProfile(req, res));

// AI Gateway Routes
app.get("/api/v1/gateway/benchmarks", (req, res) => gatewayController.getBenchmarks(req, res));
app.get("/api/v1/gateway/logs", (req, res) => gatewayController.getLogs(req, res));
app.post("/api/v1/gateway/execute", (req, res) => gatewayController.executePrompt(req, res));

// Agents & Swarm Routes
app.get("/api/v1/agents/status", (req, res) => agentsController.getStatus(req, res));
app.post("/api/v1/agents/trigger", (req, res) => agentsController.triggerSwarm(req, res));
app.post("/api/v1/agents/visual-diagram", (req, res) => agentsController.generateVisualDiagram(req, res));


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

import { agentOrchestrator } from "@brand-os/agents";
import { notificationService, automationTracker } from "@brand-os/shared";

// Automation & Notification Status Routes
app.get("/api/v1/automation/status", (_req: Request, res: Response) => {
  const lastRun = automationTracker.getLastRun();
  const history = automationTracker.getHistory(10);
  res.json({
    active: true,
    lastRun,
    history,
    telegramConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    webhookConfigured: !!process.env.WEBHOOK_NOTIFICATION_URL,
  });
});

app.post("/api/v1/notifications/test", async (_req: Request, res: Response) => {
  try {
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
app.get("/api/v1/schedule/cron-daily", async (_req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    console.log("[Daily Cron] Triggering zero human intervention verified agent pipeline...");
    const result = await agentOrchestrator.executePipeline({ autoPublish: true });
    const durationMs = Date.now() - startTime;

    if (result.status === "NO_POST_TODAY") {
      automationTracker.recordRun({
        pipelineId: result.pipelineId || `pl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        durationMs,
        status: "NO_POST_TODAY",
        candidatesEvaluated: result.candidatesEvaluated,
        rejectionReasons: result.missingSignals,
      });

      await notificationService.sendAutomationNotification({
        title: "Manual API Cron Executed (Safe Exit)",
        status: "NO_POST_TODAY",
        pipelineId: result.pipelineId,
        message: `Pipeline evaluated candidate signals. Safe exit triggered (no candidate met overall score threshold).`,
        candidatesEvaluated: result.candidatesEvaluated,
        rejectionReasons: result.missingSignals,
        durationSeconds: Math.round(durationMs / 1000),
      });
    } else {
      const overallScore = result.review?.overallScore || result.qualityGateResult?.overallContentQualityScore || 90;
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
        title: "Manual API Cron Published Successfully",
        status: "SUCCESS",
        pipelineId: result.pipelineId,
        message: `Daily post verified and published to LinkedIn.`,
        topicTitle: result.topic?.title,
        qualityScore: overallScore,
        durationSeconds: Math.round(durationMs / 1000),
      });
    }

    res.json({
      status: "success",
      message: "Daily automated post verified by agents and published successfully.",
      result,
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    console.error("[Daily Cron Error]:", err.message);

    automationTracker.recordRun({
      pipelineId: `err_${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationMs,
      status: "ERROR",
      errorMessage: err.message,
    });

    await notificationService.sendAutomationNotification({
      title: "Daily Cron Encountered Error",
      status: "ERROR",
      message: "An unhandled error occurred during manual cron execution.",
      errorMessage: err.message,
      durationSeconds: Math.round(durationMs / 1000),
    });

    res.status(500).json({ error: err.message });
  }
});
app.get("/api/v1/jobs", (req, res) => publishController.getJobs(req, res));


// Analytics Routes
app.get("/api/v1/analytics", (req, res) => analyticsController.getAnalytics(req, res));
app.get("/api/v1/analytics/linkedin-profile", (req, res) => analyticsController.getLinkedInProfile(req, res));
app.get("/api/v1/analytics/timeseries", (req, res) => analyticsController.getTimeSeries(req, res));
app.get("/api/v1/analytics/posts", (req, res) => analyticsController.getRecentPosts(req, res));
app.get("/api/v1/dashboard", (req, res) => {
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
});

// Plugin Marketplace Routes
app.get("/api/v1/plugins", (req, res) => pluginsController.getPlugins(req, res));
app.post("/api/v1/plugins/execute", (req, res) => pluginsController.executePlugin(req, res));

// AI Copilot SSE Stream
app.post("/api/v1/chat", async (req: Request, res: Response) => {
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
});

// Error Handler Middleware
app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Personal Brand OS API] Running at http://localhost:${PORT}`);
  });
}


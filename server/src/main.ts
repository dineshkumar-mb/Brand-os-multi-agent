import express, { Request, Response } from "express";
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

const app = express();
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

// Trends & Research Routes
app.get("/api/v1/trends", (req, res) => trendsController.getTrends(req, res));
app.post("/api/v1/trends/scan", (req, res) => trendsController.scanTrends(req, res));
app.post("/api/v1/research", (req, res) => researchController.conductResearch(req, res));

// Content Routes
app.get("/api/v1/posts", (req, res) => contentController.getPosts(req, res));
app.get("/api/v1/articles", (req, res) => contentController.getArticles(req, res));

// Publishing & Jobs Routes
app.post("/api/v1/publish", (req, res) => publishController.publishContent(req, res));
app.post("/api/v1/schedule", (req, res) => publishController.scheduleContent(req, res));
app.get("/api/v1/jobs", (req, res) => publishController.getJobs(req, res));

// Analytics Routes
app.get("/api/v1/analytics", (req, res) => analyticsController.getAnalytics(req, res));
app.get("/api/v1/dashboard", (req, res) => {
  res.json({
    kpis: { totalViews: 148200, totalLikes: 12450, avgCTR: 4.85, followersGained: 1280 },
    activeAgents: 12,
    scheduledPosts: 5,
    pendingHITLReviews: 2,
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

app.listen(PORT, () => {
  console.log(`[Personal Brand OS API] Running at http://localhost:${PORT}`);
});

import swaggerJSDoc from "swagger-jsdoc";
import { commonSchemas } from "./schemas/common.schema";
import { authSchemas } from "./schemas/auth.schema";
import { topicSchemas } from "./schemas/topic.schema";
import { contentSchemas } from "./schemas/content.schema";
import { gatewaySchemas } from "./schemas/gateway.schema";
import { agentSchemas } from "./schemas/agent.schema";
import { publishSchemas } from "./schemas/publish.schema";

const PORT = process.env.PORT || 4000;
const serverUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Brand OS Multi-Agent API Documentation",
      version: "1.0.0",
      description:
        "Autonomous Multi-Agent AI Platform for Daily Technical Content Intelligence, Live GitHub & Official LLM Provider Monitoring, Dynamic Architecture Visuals & Selective Personal Brand Automation (LinkedIn + Dev.to).",
      contact: {
        name: "Personal Brand OS Engineering Team",
        url: "https://github.com/dineshkumar-mb/Brand-os-multi-agent",
      },
    },
    servers: [
      {
        url: serverUrl,
        description: "Primary API Server Environment",
      },
      {
        url: "/",
        description: "Relative Path Environment",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from POST /api/v1/auth/login",
        },
      },
      schemas: {
        ...commonSchemas,
        ...authSchemas,
        ...topicSchemas,
        ...contentSchemas,
        ...gatewaySchemas,
        ...agentSchemas,
        ...publishSchemas,
      },
      responses: {
        UnauthorizedError: {
          description: "Unauthorized - Missing or invalid JWT Bearer token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                error: "Unauthorized: Missing or invalid token",
                timestamp: "2026-09-06T15:21:18.000Z",
                path: "/api/v1/auth/me",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                error: "Resource not found",
                timestamp: "2026-09-06T15:21:18.000Z",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                error: "Internal Server Error",
                timestamp: "2026-09-06T15:21:18.000Z",
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "System & Health", description: "Healthcheck and Prometheus metrics endpoints" },
      { name: "Authentication", description: "User authentication & JWT token management" },
      { name: "AI Gateway", description: "LLM Provider benchmark monitoring & prompt execution" },
      { name: "Agents & Swarm", description: "Multi-agent swarm execution & technical visual diagram generation" },
      { name: "Intelligence Layer", description: "Real-time feed scanning, LLM provider matrix & source health" },
      { name: "Trends & Research", description: "Live trend discovery, custom topic generation & technical research" },
      { name: "Content", description: "LinkedIn posts & Dev.to/Medium technical articles" },
      { name: "Automation & Telemetry", description: "Daily automation status & test notification dispatch" },
      { name: "Publishing & Jobs", description: "Content publishing, job scheduling & daily cron trigger" },
      { name: "Analytics", description: "Performance telemetry, time series data & LinkedIn profile analytics" },
      { name: "Plugin Marketplace", description: "Installed plugins and dynamic plugin action execution" },
      { name: "AI Copilot Stream", description: "Server-Sent Events (SSE) streaming for AI engineering assistant" },
    ],
    paths: {
      "/health": {
        get: {
          tags: ["System & Health"],
          summary: "Get API server health status",
          description: "Returns healthcheck status and server timestamp.",
          responses: {
            "200": {
              description: "API server is healthy",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                },
              },
            },
          },
        },
      },
      "/metrics": {
        get: {
          tags: ["System & Health"],
          summary: "Get Prometheus metrics",
          description: "Exposes active agent count, API request count, and AI Gateway cost telemetry in Prometheus text format.",
          responses: {
            "200": {
              description: "Prometheus telemetry metrics",
              content: {
                "text/plain": {
                  schema: { type: "string" },
                  example: "# HELP brandos_active_agents Total active multi-agent swarm agents\n# TYPE brandos_active_agents gauge\nbrandos_active_agents 12",
                },
              },
            },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Authenticate user and issue JWT token",
          description: "Validates credentials and returns JWT Bearer token along with user profile metadata.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Authentication successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthTokenResponse" },
                },
              },
            },
            "400": {
              description: "Invalid credentials or missing required fields",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { error: "Email and password required" },
                },
              },
            },
          },
        },
      },
      "/api/v1/auth/me": {
        get: {
          tags: ["Authentication"],
          summary: "Get current authenticated user profile",
          description: "Returns current user details, role, career stage, and target audience persona.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Current user profile metadata",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserProfile" },
                },
              },
            },
            "401": { $ref: "#/components/responses/UnauthorizedError" },
          },
        },
      },
      "/api/v1/gateway/benchmarks": {
        get: {
          tags: ["AI Gateway"],
          summary: "Get LLM provider benchmarks",
          description: "Retrieves benchmark latency, cost per 1k tokens, and reliability metrics across OpenAI, Anthropic, Google, and NVIDIA NIM.",
          responses: {
            "200": {
              description: "LLM provider benchmarks",
              content: {
                "application/json": {
                  example: {
                    benchmarks: {
                      "openrouter/anthropic/claude-3.5-sonnet": { latencyMs: 420, costPer1kTokens: 0.003, reliability: 0.99 },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/gateway/logs": {
        get: {
          tags: ["AI Gateway"],
          summary: "Get AI Gateway execution logs",
          description: "Returns past LLM prompt execution logs including token usage, USD cost, latency, and routing decisions.",
          responses: {
            "200": {
              description: "Gateway execution logs",
              content: {
                "application/json": {
                  example: {
                    logs: [
                      {
                        id: "req_9812",
                        provider: "OPENAI",
                        model: "gpt-4o",
                        taskType: "linkedin_writer",
                        promptTokens: 420,
                        completionTokens: 280,
                        totalTokens: 700,
                        costUsd: 0.00385,
                        latencyMs: 840,
                        routingDecision: "Balanced default choice",
                        wasFailover: false,
                        createdAt: "2026-09-06T15:00:00.000Z",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/gateway/execute": {
        post: {
          tags: ["AI Gateway"],
          summary: "Execute AI prompt via unified routing engine",
          description: "Dispatches LLM execution to optimal provider based on COST_OPTIMIZED, LOWEST_LATENCY, or ACCURACY_FIRST routing strategies.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExecutePromptRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Prompt execution result",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ExecutePromptResponse" },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/agents/status": {
        get: {
          tags: ["Agents & Swarm"],
          summary: "Get status of all 12+ master agents",
          description: "Returns current status, last run timestamps, and swarm activity status.",
          responses: {
            "200": {
              description: "Agent swarm status summary",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AgentStatusResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/agents/trigger": {
        post: {
          tags: ["Agents & Swarm"],
          summary: "Trigger 5-layer intelligence architecture pipeline",
          description: "Executes end-to-end candidate collection, STAR storytelling, technical review, visual planning, decision gate, and publisher agent.",
          responses: {
            "200": {
              description: "Daily generation result",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    result: {
                      status: "POST_READY",
                      pipelineId: "pl_987654",
                      topic: { title: "Model Context Protocol (MCP): Multi-Agent Architecture" },
                    },
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/agents/visual-diagram": {
        post: {
          tags: ["Agents & Swarm"],
          summary: "Generate technical SVG architecture diagram",
          description: "Generates custom topic-tailored vector architecture diagram or renders selected infographic preset.",
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VisualDiagramRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Generated SVG diagram payload",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/VisualDiagramResponse" },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/intelligence/dashboard": {
        get: {
          tags: ["Intelligence Layer"],
          summary: "Get global AI intelligence dashboard",
          description: "Returns aggregated live feed scan results, provider availability matrix, and official source health telemetry.",
          responses: {
            "200": {
              description: "Intelligence layer dashboard",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    scanResult: { mode: "ON_DEMAND", timestamp: "2026-09-06T15:00:00.000Z" },
                    providerMatrix: [],
                    sourceHealth: {},
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/intelligence/scan": {
        post: {
          tags: ["Intelligence Layer"],
          summary: "Trigger on-demand live trend and release feed scan",
          description: "Scans GitHub Trending, official LLM provider RSS feeds (OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek), HuggingFace, Hacker News, and Dev.to.",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mode: { type: "string", enum: ["ON_DEMAND", "BACKGROUND"], example: "ON_DEMAND" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Scan execution summary",
              content: {
                "application/json": {
                  example: { success: true, scanResult: { signalsScanned: 35, verifiedEvents: 12 } },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/intelligence/providers": {
        get: {
          tags: ["Intelligence Layer"],
          summary: "Get LLM provider availability matrix",
          description: "Returns live status, latency, pricing, and capabilities across registered AI lab models.",
          responses: {
            "200": {
              description: "Provider matrices and model comparison",
              content: {
                "application/json": {
                  example: { success: true, providers: [], comparison: {} },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/intelligence/sources": {
        get: {
          tags: ["Intelligence Layer"],
          summary: "Get live source health metrics",
          description: "Returns connectivity and authority status across Level 1 (GitHub, Official RSS) and Level 3 (Community) feed sources.",
          responses: {
            "200": {
              description: "Source health summary",
              content: {
                "application/json": {
                  example: { success: true, health: { "github-trending": { status: "ONLINE", latencyMs: 120 } } },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/trends": {
        get: {
          tags: ["Trends & Research"],
          summary: "Get discovered trending technical topics",
          description: "Retrieves candidate technical topics ranked by 7-dimension weighted credibility formula.",
          responses: {
            "200": {
              description: "List of discovered topics",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      topics: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Topic" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/trends/scan": {
        post: {
          tags: ["Trends & Research"],
          summary: "Scan live trend sources for new topic opportunities",
          description: "Executes real-time discovery against 7 live feed sources and returns passing candidates.",
          responses: {
            "200": {
              description: "Discovered topic count and list",
              content: {
                "application/json": {
                  example: { success: true, count: 5, topics: [] },
                },
              },
            },
          },
        },
      },
      "/api/v1/trends/generate": {
        post: {
          tags: ["Trends & Research"],
          summary: "Generate custom trend topic via AI Copilot",
          description: "Transforms a user text prompt into a structured candidate Topic card with score, audience, and keywords.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CustomTrendRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Generated custom topic card",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      topic: { $ref: "#/components/schemas/Topic" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Missing required prompt parameter",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { error: "Prompt is required" },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/research": {
        post: {
          tags: ["Trends & Research"],
          summary: "Conduct deep technical research on a topic",
          description: "Runs DeepResearchAgent to extract architecture insights, pros/cons, trade-offs, and code snippets.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResearchRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Deep research output",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    research: {
                      summary: "Model Context Protocol standardizes JSON-RPC schemas...",
                      key_insights: ["Decouples tools from prompt templates"],
                      pros: ["Interoperability"],
                      cons: ["Schema versioning overhead"],
                    },
                  },
                },
              },
            },
            "400": {
              description: "Missing topic parameter",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { error: "Topic object required" },
                },
              },
            },
          },
        },
      },
      "/api/v1/posts": {
        get: {
          tags: ["Content"],
          summary: "Get generated LinkedIn posts",
          description: "Retrieves list of generated LinkedIn post drafts, status, and quality evaluation scores.",
          responses: {
            "200": {
              description: "List of LinkedIn posts",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      posts: {
                        type: "array",
                        items: { $ref: "#/components/schemas/LinkedInPost" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/articles": {
        get: {
          tags: ["Content"],
          summary: "Get generated Dev.to / Medium articles",
          description: "Retrieves list of long-form technical article drafts, reading times, and publication status.",
          responses: {
            "200": {
              description: "List of long-form articles",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      articles: {
                        type: "array",
                        items: { $ref: "#/components/schemas/DevToArticle" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/automation/status": {
        get: {
          tags: ["Automation & Telemetry"],
          summary: "Get daily automation status and notification integrations",
          description: "Returns active status, last execution run, execution history, and Telegram/Webhook channel configuration status.",
          responses: {
            "200": {
              description: "Automation status summary",
              content: {
                "application/json": {
                  example: {
                    active: true,
                    lastRun: { pipelineId: "pl_123", status: "SUCCESS", durationMs: 4200 },
                    history: [],
                    telegramConfigured: false,
                    webhookConfigured: false,
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/notifications/test": {
        post: {
          tags: ["Automation & Telemetry"],
          summary: "Send manual test notification",
          description: "Dispatches a verification test payload through active notification channels (Telegram, Webhook, Console).",
          responses: {
            "200": {
              description: "Notification dispatch result",
              content: {
                "application/json": {
                  example: {
                    status: "success",
                    message: "Test notification dispatched successfully.",
                    result: { success: true },
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/publish": {
        post: {
          tags: ["Publishing & Jobs"],
          summary: "Publish post content to platform",
          description: "Dispatches content payload to target platform (LinkedIn, Dev.to, Medium) via official APIs.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublishContentRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Platform publication response",
              content: {
                "application/json": {
                  example: { result: { success: true, externalId: "urn:li:share:12345" } },
                },
              },
            },
          },
        },
      },
      "/api/v1/schedule": {
        post: {
          tags: ["Publishing & Jobs"],
          summary: "Schedule post for delayed publication",
          description: "Enqueues post ID into TaskScheduler for execution at target ISO timestamp.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ScheduleContentRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Post scheduled successfully",
              content: {
                "application/json": {
                  example: { success: true, postId: "post_101", scheduledFor: "2026-09-07T09:00:00.000Z" },
                },
              },
            },
          },
        },
      },
      "/api/v1/schedule/cron-daily": {
        get: {
          tags: ["Publishing & Jobs"],
          summary: "Trigger zero-human-intervention daily automated pipeline",
          description: "Executes automated agent pipeline, verifies technical credibility, posts to LinkedIn if verified, and dispatches telemetry notifications.",
          responses: {
            "200": {
              description: "Cron execution result",
              content: {
                "application/json": {
                  example: {
                    status: "success",
                    message: "Daily automated post verified by agents and published successfully.",
                    result: { status: "POST_READY" },
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/jobs": {
        get: {
          tags: ["Publishing & Jobs"],
          summary: "Get active scheduled background jobs",
          description: "Returns active scheduled tasks enqueued in TaskScheduler.",
          responses: {
            "200": {
              description: "List of scheduled tasks",
              content: {
                "application/json": {
                  example: { jobs: [{ id: "job_1", status: "SCHEDULED", runAt: "2026-09-07T09:00:00.000Z" }] },
                },
              },
            },
          },
        },
      },
      "/api/v1/analytics": {
        get: {
          tags: ["Analytics"],
          summary: "Get high-level analytics summary",
          description: "Returns aggregated post views, likes, CTR, top performing hooks, and learning recommendations.",
          responses: {
            "200": {
              description: "Analytics dashboard summary",
              content: {
                "application/json": {
                  example: { totalViews: 12500, followersGained: 142, avgCTR: 4.8 },
                },
              },
            },
          },
        },
      },
      "/api/v1/analytics/linkedin-profile": {
        get: {
          tags: ["Analytics"],
          summary: "Get LinkedIn profile telemetry",
          description: "Fetches live or cached LinkedIn profile follower counts, search appearances, and 90-day viewers.",
          responses: {
            "200": {
              description: "LinkedIn profile telemetry",
              content: {
                "application/json": {
                  example: {
                    id: "user_123",
                    name: "Staff AI Engineer",
                    followersCount: 5420,
                    profileViewers90Days: 840,
                    searchAppearancesWeek: 310,
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/analytics/timeseries": {
        get: {
          tags: ["Analytics"],
          summary: "Get engagement time series telemetry",
          description: "Returns daily views, likes, comments, shares, and CTR data points for charts.",
          responses: {
            "200": {
              description: "Time series data points",
              content: {
                "application/json": {
                  example: [
                    { name: "Mon", date: "2026-09-01", views: 420, likes: 45, comments: 12, shares: 5, ctr: 4.2 },
                  ],
                },
              },
            },
          },
        },
      },
      "/api/v1/analytics/posts": {
        get: {
          tags: ["Analytics"],
          summary: "Get recent published post performance records",
          description: "Returns list of published posts with individual impression, reaction, comment, and share metrics.",
          responses: {
            "200": {
              description: "Historical post records",
              content: {
                "application/json": {
                  example: [
                    {
                      id: "urn:li:share:7486750714623414272",
                      title: "Building an Autonomous Multi-Agent Personal Brand OS",
                      platform: "LINKEDIN",
                      engagementMetrics: { impressions: 342, reactions: 42, comments: 12 },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      "/api/v1/dashboard": {
        get: {
          tags: ["Analytics"],
          summary: "Get main system and analytics dashboard",
          description: "Combines KPIs, time series metrics, active agent counts, top hooks, recommendations, and AI gateway telemetry.",
          responses: {
            "200": {
              description: "Combined main dashboard payload",
              content: {
                "application/json": {
                  example: {
                    kpis: { totalPostsPublished: 42 },
                    activeAgents: 18,
                    pendingHITLReviews: 2,
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/plugins": {
        get: {
          tags: ["Plugin Marketplace"],
          summary: "Get installed plugin registry list",
          description: "Returns list of active plugins, versions, and exposed actions.",
          responses: {
            "200": {
              description: "List of installed plugins",
              content: {
                "application/json": {
                  example: {
                    plugins: [
                      { id: "p1", name: "GitHub Trending Enricher", version: "1.0.0", active: true },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/plugins/execute": {
        post: {
          tags: ["Plugin Marketplace"],
          summary: "Execute dynamic plugin action",
          description: "Triggers execution of specified plugin action with custom payload.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PluginExecutionRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Plugin action result",
              content: {
                "application/json": {
                  example: { result: { success: true } },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/api/v1/chat": {
        post: {
          tags: ["AI Copilot Stream"],
          summary: "Stream AI Copilot engineering advice (SSE)",
          description: "Establishes Server-Sent Events (SSE) stream for real-time text generation chunks.",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    prompt: { type: "string", example: "How can I optimize React 19 server actions?" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Server-Sent Events stream (`text/event-stream`)",
              content: {
                "text/event-stream": {
                  schema: { type: "string" },
                  example: "data: {\"text\":\"React 19 server actions allow...\"}\n\ndata: [DONE]\n\n",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);

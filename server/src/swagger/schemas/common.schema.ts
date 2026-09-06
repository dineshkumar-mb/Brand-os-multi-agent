export const commonSchemas = {
  HealthResponse: {
    type: "object",
    properties: {
      status: { type: "string", example: "healthy" },
      timestamp: { type: "string", format: "date-time", example: "2026-09-06T15:21:18.000Z" },
      service: { type: "string", example: "Personal Brand OS API" },
    },
    required: ["status", "timestamp", "service"],
  },
  ErrorResponse: {
    type: "object",
    properties: {
      error: { type: "string", example: "Unauthorized: Missing or invalid token" },
      timestamp: { type: "string", format: "date-time", example: "2026-09-06T15:21:18.000Z" },
      path: { type: "string", example: "/api/v1/auth/me" },
    },
    required: ["error"],
  },
  PluginExecutionRequest: {
    type: "object",
    properties: {
      name: { type: "string", example: "github-trending-enricher" },
      action: { type: "string", example: "sync" },
      payload: { type: "object", example: { category: "Agentic AI" } },
    },
    required: ["name", "action"],
  },
};

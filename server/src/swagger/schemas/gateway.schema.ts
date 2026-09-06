export const gatewaySchemas = {
  ExecutePromptRequest: {
    type: "object",
    properties: {
      prompt: { type: "string", example: "Generate technical hook for React 19 Server Actions" },
      taskType: { type: "string", example: "linkedin_writer" },
      routingStrategy: {
        type: "string",
        enum: ["COST_OPTIMIZED", "LOWEST_LATENCY", "ACCURACY_FIRST", "BALANCED"],
        example: "COST_OPTIMIZED",
      },
    },
    required: ["prompt"],
  },
  ExecutePromptResponse: {
    type: "object",
    properties: {
      response: {
        type: "object",
        properties: {
          text: { type: "string", example: "Stop writing repetitive form handlers in React 19..." },
          modelUsed: { type: "string", example: "openrouter/anthropic/claude-3.5-sonnet" },
          costUsd: { type: "number", example: 0.0035 },
          latencyMs: { type: "number", example: 420 },
        },
      },
    },
  },
  GatewayLog: {
    type: "object",
    properties: {
      id: { type: "string", example: "req_9812" },
      provider: { type: "string", example: "OPENAI" },
      model: { type: "string", example: "gpt-4o" },
      taskType: { type: "string", example: "linkedin_writer" },
      promptTokens: { type: "number", example: 420 },
      completionTokens: { type: "number", example: 280 },
      totalTokens: { type: "number", example: 700 },
      costUsd: { type: "number", example: 0.00385 },
      latencyMs: { type: "number", example: 840 },
      routingDecision: { type: "string", example: "Balanced default choice" },
      wasFailover: { type: "boolean", example: false },
      createdAt: { type: "string", format: "date-time", example: "2026-09-06T15:00:00.000Z" },
    },
  },
};

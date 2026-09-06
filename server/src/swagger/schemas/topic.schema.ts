export const topicSchemas = {
  Topic: {
    type: "object",
    properties: {
      id: { type: "string", example: "top_mcp_101" },
      title: { type: "string", example: "Model Context Protocol (MCP): Multi-Agent Architecture" },
      category: { type: "string", example: "Agentic AI" },
      framework: { type: "string", example: "MCP" },
      supportingTech: {
        type: "array",
        items: { type: "string" },
        example: ["TypeScript", "JSON-RPC"],
      },
      score: { type: "number", example: 95 },
      reason: { type: "string", example: "Surging GitHub trend with official LLM provider releases" },
      trend_velocity: { type: "number", example: 9.5 },
      difficulty: { type: "string", enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], example: "ADVANCED" },
      competition: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], example: "MEDIUM" },
      audience: { type: "string", example: "AI Engineers & Systems Architects" },
      keywords: {
        type: "array",
        items: { type: "string" },
        example: ["MCP", "Multi-Agent", "Tool Calling"],
      },
      references: {
        type: "array",
        items: { type: "string" },
        example: ["https://modelcontextprotocol.io"],
      },
    },
    required: ["id", "title", "category", "score"],
  },
  CustomTrendRequest: {
    type: "object",
    properties: {
      prompt: { type: "string", example: "React 19 Server Actions & Optimistic UI" },
    },
    required: ["prompt"],
  },
  ResearchRequest: {
    type: "object",
    properties: {
      topic: { $ref: "#/components/schemas/Topic" },
    },
    required: ["topic"],
  },
};

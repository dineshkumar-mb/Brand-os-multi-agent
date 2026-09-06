export const agentSchemas = {
  AgentStatus: {
    type: "object",
    properties: {
      name: { type: "string", example: "Trend Discovery Agent" },
      status: { type: "string", example: "ACTIVE" },
      lastRun: { type: "string", format: "date-time", example: "2026-09-06T15:00:00.000Z" },
    },
  },
  AgentStatusResponse: {
    type: "object",
    properties: {
      activeAgents: { type: "number", example: 12 },
      swarmStatus: { type: "string", example: "IDLE" },
      agents: {
        type: "array",
        items: { $ref: "#/components/schemas/AgentStatus" },
      },
    },
  },
  VisualDiagramRequest: {
    type: "object",
    properties: {
      topic: { type: "string", example: "RAG vs CAG Architecture" },
      presetKey: { type: "string", example: "RAG_ARCHITECTURE" },
    },
  },
  VisualDiagramResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      renderedSvg: { type: "string", example: "<svg>...</svg>" },
      diagramSpec: { type: "object" },
    },
  },
};

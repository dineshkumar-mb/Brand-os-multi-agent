export const contentSchemas = {
  LinkedInPost: {
    type: "object",
    properties: {
      id: { type: "string", example: "post_101" },
      platform: { type: "string", example: "LINKEDIN" },
      title: { type: "string", example: "React 19 Actions & Compiler Optimization" },
      hook: { type: "string", example: "Stop writing repetitive state hooks in React. React 19 changes everything." },
      fullText: { type: "string", example: "Stop writing repetitive state hooks in React. React 19 changes everything. 🚀\n\nActionable Takeaways..." },
      cta: { type: "string", example: "How is your team handling React 19 mutations?" },
      hashtags: {
        type: "array",
        items: { type: "string" },
        example: ["#React19", "#WebDev", "#TypeScript"],
      },
      imageUrl: { type: "string", example: "data:image/svg+xml;utf8,<svg>...</svg>" },
      status: { type: "string", example: "PENDING_REVIEW" },
      evaluationScore: { type: "number", example: 93.2 },
      createdAt: { type: "string", format: "date-time", example: "2026-09-06T15:00:00.000Z" },
    },
    required: ["id", "title", "fullText"],
  },
  DevToArticle: {
    type: "object",
    properties: {
      id: { type: "string", example: "art_201" },
      platform: { type: "string", example: "MEDIUM" },
      title: { type: "string", example: "React 19 Actions & Compiler Optimization: Enterprise Guide" },
      subtitle: { type: "string", example: "Comprehensive deep dive into architecture and benchmarks." },
      readingTimeMinutes: { type: "number", example: 8 },
      status: { type: "string", example: "APPROVED" },
      evaluationScore: { type: "number", example: 95.8 },
      createdAt: { type: "string", format: "date-time", example: "2026-09-06T15:00:00.000Z" },
    },
    required: ["id", "title"],
  },
};

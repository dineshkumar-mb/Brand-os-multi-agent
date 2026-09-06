export const publishSchemas = {
  PublishContentRequest: {
    type: "object",
    properties: {
      platform: { type: "string", example: "LINKEDIN" },
      content: {
        type: "object",
        properties: {
          title: { type: "string", example: "React 19 Server Actions in Enterprise SaaS" },
          fullText: { type: "string", example: "Stop writing repetitive form mutations in React..." },
        },
      },
    },
  },
  ScheduleContentRequest: {
    type: "object",
    properties: {
      postId: { type: "string", example: "post_101" },
      scheduledFor: { type: "string", format: "date-time", example: "2026-09-07T09:00:00.000Z" },
    },
    required: ["postId"],
  },
};

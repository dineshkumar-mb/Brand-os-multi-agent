export const authSchemas = {
  LoginRequest: {
    type: "object",
    properties: {
      email: { type: "string", format: "email", example: "engineer@brand-os.ai" },
      password: { type: "string", format: "password", example: "supersecret123" },
    },
    required: ["email", "password"],
  },
  AuthTokenResponse: {
    type: "object",
    properties: {
      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
      user: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_123" },
          email: { type: "string", example: "engineer@brand-os.ai" },
          name: { type: "string", example: "Staff AI Engineer" },
          role: { type: "string", example: "ADMIN" },
        },
      },
    },
    required: ["token", "user"],
  },
  UserProfile: {
    type: "object",
    properties: {
      id: { type: "string", example: "user_123" },
      email: { type: "string", example: "engineer@brand-os.ai" },
      name: { type: "string", example: "Staff AI Engineer" },
      role: { type: "string", example: "ADMIN" },
      profile: {
        type: "object",
        properties: {
          industry: { type: "string", example: "AI & Software Engineering" },
          careerStage: { type: "string", example: "Senior / Lead Engineer" },
          targetAudience: { type: "string", example: "Developers & Tech Leaders" },
          writingTone: { type: "string", example: "Authoritative, engaging, data-driven" },
        },
      },
    },
    required: ["id", "email", "name", "role"],
  },
};

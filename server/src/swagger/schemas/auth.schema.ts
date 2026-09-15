export const authSchemas = {
  LoginRequest: {
    type: "object",
    properties: {
      email: { type: "string", format: "email", example: "engineer@brand-os.ai" },
      password: { type: "string", format: "password", example: "supersecret123" },
    },
    required: ["email", "password"],
  },
  RegisterRequest: {
    type: "object",
    properties: {
      name: { type: "string", example: "Alex Mercer" },
      email: { type: "string", format: "email", example: "alex@brand-os.ai" },
      password: { type: "string", format: "password", example: "SecurePass123!" },
      role: { type: "string", enum: ["USER", "ADMIN", "TEAM_MEMBER"], example: "USER" },
    },
    required: ["name", "email", "password"],
  },
  ForgotPasswordRequest: {
    type: "object",
    properties: {
      email: { type: "string", format: "email", example: "alex@brand-os.ai" },
    },
    required: ["email"],
  },
  ResetPasswordRequest: {
    type: "object",
    properties: {
      token: { type: "string", example: "a1b2c3d4e5f6..." },
      newPassword: { type: "string", format: "password", example: "NewSecurePass123!" },
    },
    required: ["token", "newPassword"],
  },
  AuthTokenResponse: {
    type: "object",
    properties: {
      message: { type: "string", example: "Login successful." },
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

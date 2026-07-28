import { z } from "zod";

export const ConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).optional().default("4000"),
  WEB_PORT: z.string().transform(Number).optional().default("3000"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  CHROMADB_URL: z.string().optional().default("http://localhost:8000"),
  
  // AI Keys
  OPENROUTER_API_KEY: z.string().optional(),
  NVIDIA_NIM_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().optional().default("http://localhost:11434"),
  
  // Platform Keys
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_ACCESS_TOKEN: z.string().optional(),
  LINKEDIN_ORGANIZATION_ID: z.string().optional(),
  LINKEDIN_PERSON_URN: z.string().optional(),
  MEDIUM_INTEGRATION_TOKEN: z.string().optional(),
  DEVTO_API_KEY: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

let cachedConfig: Config | null = null;

export function loadConfig(forceReload = false): Config {
  if (cachedConfig && !forceReload) {
    return cachedConfig;
  }

  // Support reading from process.env
  const result = ConfigSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`[Config Validation Error] Missing or invalid environment variables:\n${errorDetails}`);
  }

  // Preflight validation for required AI Provider keys (ensure at least one is present)
  const config = result.data;
  const hasOpenRouter = config.OPENROUTER_API_KEY && !config.OPENROUTER_API_KEY.includes("placeholder");
  const hasNvidia = config.NVIDIA_NIM_API_KEY && !config.NVIDIA_NIM_API_KEY.includes("placeholder");
  
  if (config.NODE_ENV === "production" && !hasOpenRouter && !hasNvidia) {
    throw new Error("[Config Validation Error] In production mode, either OPENROUTER_API_KEY or NVIDIA_NIM_API_KEY must be configured.");
  }

  cachedConfig = config;
  return config;
}

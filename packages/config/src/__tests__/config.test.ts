import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadConfig } from "../index";

describe("Config Validation & Loader Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("should successfully parse and load valid environment variables", () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "postgresql://localhost:5432";
    process.env.REDIS_URL = "redis://localhost:6379";
    process.env.JWT_SECRET = "super_secret_jwt_token";

    const config = loadConfig(true);
    expect(config.NODE_ENV).toBe("test");
    expect(config.DATABASE_URL).toBe("postgresql://localhost:5432");
    expect(config.JWT_SECRET).toBe("super_secret_jwt_token");
  });

  it("should fail validation if critical environment variables are missing", () => {
    delete process.env.DATABASE_URL;
    process.env.JWT_SECRET = "some_secret";

    expect(() => loadConfig(true)).toThrowError(/DATABASE_URL/);
  });

  it("should enforce at least one AI provider in production mode", () => {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_URL = "postgresql://localhost:5432";
    process.env.REDIS_URL = "redis://localhost:6379";
    process.env.JWT_SECRET = "secret";
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.NVIDIA_NIM_API_KEY;

    expect(() => loadConfig(true)).toThrowError(/OPENROUTER_API_KEY or NVIDIA_NIM_API_KEY/);
  });
});

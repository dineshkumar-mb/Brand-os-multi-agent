import { describe, it, expect, beforeEach, vi } from "vitest";
import { PreflightService } from "../index";

// Mock the config module
vi.mock("@brand-os/config", () => ({
  loadConfig: () => ({
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://localhost:5432",
    REDIS_URL: "redis://localhost:6379",
    JWT_SECRET: "mock_jwt_secret",
  }),
}));

// Mock the database client
vi.mock("@brand-os/database", () => ({
  prisma: {
    $queryRaw: vi.fn().mockImplementation(async () => [{ 1: 1 }]),
  },
}));

// Mock the redis client
vi.mock("redis", () => ({
  createClient: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue(true),
    ping: vi.fn().mockResolvedValue("PONG"),
    disconnect: vi.fn().mockResolvedValue(true),
  })),
}));

describe("Preflight Health Check Service Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully pass all health checks under normal mock conditions", async () => {
    const service = new PreflightService();
    const results = await service.run();

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    const envCheck = results.find(r => r.component === "Environment");
    expect(envCheck?.success).toBe(true);
    const dbCheck = results.find(r => r.component === "Database");
    expect(dbCheck?.success).toBe(true);
  });

  it("should handle database or redis failure gracefully in non-production environments", async () => {
    const { prisma } = await import("@brand-os/database");
    prisma.$queryRaw = vi.fn().mockRejectedValueOnce(new Error("Connection refused"));

    const service = new PreflightService();
    // Should NOT throw in 'test' / development environment since it's a warning only
    const results = await service.run();
    
    const dbCheck = results.find(r => r.component === "Database");
    expect(dbCheck?.success).toBe(false);
    expect(dbCheck?.error).toContain("Connection refused");
  });
});

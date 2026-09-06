import { describe, it, expect } from "vitest";
import { swaggerSpec } from "../swagger.config";

describe("Swagger / OpenAPI Interactive Documentation Unit Tests", () => {
  const spec = swaggerSpec as any;

  it("should generate a valid OpenAPI 3.0.0 specification object", () => {
    expect(spec).toBeDefined();
    expect(spec.openapi).toBe("3.0.0");
    expect(spec.info.title).toContain("Personal Brand OS");
    expect(spec.info.version).toBe("1.0.0");
  });

  it("should contain securitySchemes with bearerAuth JWT configuration", () => {
    const securitySchemes = spec.components?.securitySchemes;
    expect(securitySchemes).toBeDefined();
    expect(securitySchemes?.bearerAuth).toBeDefined();
    expect(securitySchemes?.bearerAuth?.type).toBe("http");
    expect(securitySchemes?.bearerAuth?.scheme).toBe("bearer");
    expect(securitySchemes?.bearerAuth?.bearerFormat).toBe("JWT");
  });

  it("should document 100% of existing API endpoints", () => {
    const paths = spec.paths;
    expect(paths).toBeDefined();

    const expectedEndpoints = [
      "/health",
      "/metrics",
      "/api/v1/auth/login",
      "/api/v1/auth/me",
      "/api/v1/gateway/benchmarks",
      "/api/v1/gateway/logs",
      "/api/v1/gateway/execute",
      "/api/v1/agents/status",
      "/api/v1/agents/trigger",
      "/api/v1/agents/visual-diagram",
      "/api/v1/intelligence/dashboard",
      "/api/v1/intelligence/scan",
      "/api/v1/intelligence/providers",
      "/api/v1/intelligence/sources",
      "/api/v1/trends",
      "/api/v1/trends/scan",
      "/api/v1/trends/generate",
      "/api/v1/research",
      "/api/v1/posts",
      "/api/v1/articles",
      "/api/v1/automation/status",
      "/api/v1/notifications/test",
      "/api/v1/publish",
      "/api/v1/schedule",
      "/api/v1/schedule/cron-daily",
      "/api/v1/jobs",
      "/api/v1/analytics",
      "/api/v1/analytics/linkedin-profile",
      "/api/v1/analytics/timeseries",
      "/api/v1/analytics/posts",
      "/api/v1/dashboard",
      "/api/v1/plugins",
      "/api/v1/plugins/execute",
      "/api/v1/chat",
    ];

    expectedEndpoints.forEach((ep) => {
      expect(paths[ep], `Expected endpoint ${ep} to be documented in Swagger spec`).toBeDefined();
    });
  });
});

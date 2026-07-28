import { describe, it, expect, beforeEach, vi } from "vitest";

// We can test run_pipeline components by mocking orchestrator and publisher
vi.mock("../../packages/agents/src/index", () => ({
  agentOrchestrator: {
    executePipeline: vi.fn().mockResolvedValue({
      pipelineId: "test_pipeline_id",
      topic: { title: "Deduplicated Swarm Architecture", score: 9.8 },
      factCheck: { confidenceScore: 98, factCheckPassed: true },
      review: { overallScore: 92, passedThreshold: true },
      linkedInPost: { title: "Deduplicated Swarm Architecture", hook: "Hook!", fullText: "This is a full post of sufficient length to pass the smoke check." },
      mediumArticle: { title: "Deduplicated Swarm Architecture", fullMarkdown: "Full markdown description containing code blueprint sample." },
    }),
  },
}));

vi.mock("../../packages/publisher/src/index", () => ({
  publisherService: {
    publish: vi.fn().mockResolvedValue({
      success: true,
      platform: "LINKEDIN",
      externalId: "urn:li:share:999888",
      url: "https://linkedin.com/update/999888",
      publishedAt: new Date().toISOString(),
      mode: "SIMULATION",
      retries: 0,
      latencyMs: 15,
    }),
  },
  MissingAccessTokenError: Error,
}));

vi.mock("../../packages/database/src/index", () => ({
  prisma: {
    pipelineExecution: {
      create: vi.fn().mockResolvedValue({ id: "test_pipeline_id" }),
      update: vi.fn().mockResolvedValue({ id: "test_pipeline_id" }),
    },
    aIGatewayLog: {
      findMany: vi.fn().mockResolvedValue([
        { promptTokens: 100, completionTokens: 50, totalTokens: 150, costUsd: 0.00015, model: "gpt-4o" },
      ]),
    },
  },
}));

vi.mock("../../packages/preflight/src/index", () => ({
  preflightService: {
    run: vi.fn().mockResolvedValue([{ success: true, component: "Environment", message: "OK" }]),
  },
}));

describe("Pipeline Script Verification Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should verify pipeline imports and mocks behave as expected", async () => {
    const { agentOrchestrator } = await import("../../packages/agents/src/index");
    const { publisherService } = await import("../../packages/publisher/src/index");
    const { preflightService } = await import("../../packages/preflight/src/index");

    const preflightResults = await preflightService.run();
    expect(preflightResults[0].success).toBe(true);

    const swarmResult = await agentOrchestrator.executePipeline({ autoPublish: false });
    expect(swarmResult.review.overallScore).toBe(92);

    const pubResult = await publisherService.publish("LINKEDIN" as any, swarmResult.linkedInPost);
    expect(pubResult.success).toBe(true);
    expect(pubResult.mode).toBe("SIMULATION");
  });
});

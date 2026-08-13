import { describe, it, expect, beforeEach, vi } from "vitest";
import { AgentOrchestrator } from "../index";

// Mock global fetch to prevent actual network calls during trend discovery
const mockFetch = vi.fn().mockImplementation(async (url: string) => {
  if (url.includes("hacker-news")) {
    return { ok: true, json: async () => [12345] };
  }
  if (url.includes("item/12345")) {
    return { ok: true, json: async () => ({ title: "Decoupled AI Swarms", score: 100, url: "https://example.com" }) };
  }
  if (url.includes("reddit")) {
    return { ok: true, json: async () => ({ data: { children: [{ data: { title: "Reddit Tech Discussion", ups: 50 } }] } }) };
  }
  if (url.includes("dev.to")) {
    return { ok: true, json: async () => [{ title: "Dev.to rising tech", tag_list: ["ai"] }] };
  }
  return { ok: true, json: async () => ({}) };
});
global.fetch = mockFetch;

// Mock AI Gateway
vi.mock("@brand-os/ai-gateway", () => ({
  aiGateway: {
    execute: vi.fn().mockImplementation(async (req) => {
      if (req.taskType === "trend_discovery") {
        return {
          text: `[{"title": "Decoupled AI Swarms in Enterprise Devops", "score": 9.5, "keywords": ["AI", "DevOps"], "summary": "Detailed trends analysis."}]`,
        };
      }
      if (req.taskType === "research") {
        return {
          text: JSON.stringify({
            summary: "Deep technical analysis summary.",
            key_insights: ["Insight 1", "Insight 2"],
            code_snippets: [{ language: "typescript", code: "const x = 1;" }],
          }),
        };
      }
      if (req.taskType === "linkedin_writer") {
        // Return a fully valid object matching LinkedInPostPayloadSchema
        return {
          text: JSON.stringify({
            title: "Decoupled AI Swarms in Enterprise Devops",
            hook: "Scroll stopping hook!",
            story: "We built an autonomous swarm pipeline to orchestrate content production.",
            lesson: "Decoupling concerns ensures fault tolerance.",
            actionableInsight: "Establish a quality evaluation gatekeeper agent.",
            cta: "How is your engineering team balancing abstraction complexity versus runtime performance? Let's discuss in the comments.",
            hashtags: ["ai", "devops"],
            fullText: "Here is the full text of our viral tech post that exceeds 100 characters in length to pass the smoke tests validation checks.",
          }),
        };
      }
      return { text: "{}" };
    }),
  },
}));

// Mock MCP client
vi.mock("@brand-os/mcp-client", () => ({
  mcpClient: {
    googleSearch: vi.fn().mockResolvedValue({ data: [{ url: "https://example.com" }] }),
    browserScrapePage: vi.fn().mockResolvedValue({ data: { extractedText: "Mocked scraped page contents." } }),
    githubSearch: vi.fn().mockResolvedValue({ data: [{ name: "MockRepo", description: "Mocked github repository", url: "" }] }),
  },
}));

// Mock Publisher Service
vi.mock("@brand-os/publisher", () => ({
  publisherService: {
    publish: vi.fn().mockResolvedValue({
      success: true,
      platform: "LINKEDIN",
      externalId: "urn:li:share:123",
      url: "https://linkedin.com/update/123",
      publishedAt: new Date().toISOString(),
      mode: "SIMULATION",
      retries: 0,
      latencyMs: 10,
    }),
  },
}));

describe("Agent Swarm Orchestrator & Smoke Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully execute the full swarm pipeline and pass smoke checks", async () => {
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.executePipeline({ autoPublish: false, pipelineId: "test_pipeline_id" });

    expect(result).toBeDefined();
    expect(result.linkedInPost?.title).toBeDefined();
    expect(result.factCheck?.factCheckPassed).toBe(true);
    expect(result.review.overallScore).toBeGreaterThanOrEqual(85);
  });

  it("should throw a smoke test validation error if generated post fullText is too short", async () => {
    const { aiGateway } = await import("@brand-os/ai-gateway");
    aiGateway.execute = vi.fn().mockImplementation(async (req) => {
      if (req.taskType === "trend_discovery") {
        return { text: `[{"title": "Short text title", "score": 9.0, "keywords": ["AI"], "summary": "summary"}]` };
      }
      if (req.taskType === "research") {
        return { text: JSON.stringify({ summary: "summary", key_insights: [], code_snippets: [] }) };
      }
      if (req.taskType === "linkedin_writer" || req.taskType === "senior_engineering_writer") {
        return {
          text: JSON.stringify({
            title: "Short Title",
            hook: "Hook",
            story: "Story",
            lesson: "Lesson",
            actionableInsight: "Insight",
            cta: "CTA",
            fullText: "too short", // fails length constraint (> 100 characters)
            hashtags: [],
          }),
        };
      }
      return { text: "{}" };
    });

    const orchestrator = new AgentOrchestrator();
    await expect(
      orchestrator.executePipeline({ autoPublish: false, pipelineId: "test_short_id" })
    ).rejects.toThrow("fullText is too short");
  });
});

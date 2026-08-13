import { describe, it, expect } from "vitest";
import { globalIntelligenceEngine } from "../index.js";
import { llmProviderRegistry } from "../sources/llm-provider-registry.js";
import { modelComparisonEngine } from "../sources/model-comparison.js";
import { doNotPublishGate } from "../ranking/do-not-publish.js";

describe("Global AI Intelligence Layer Unit Tests", () => {
  it("should initialize LLM Provider Registry with OpenAI, Anthropic, DeepSeek, and Groq models", () => {
    const providers = llmProviderRegistry.getAllProviders();
    expect(providers.length).toBeGreaterThanOrEqual(10);
    const deepseek = providers.find((p) => p.model === "deepseek-r1");
    expect(deepseek).toBeDefined();
    expect(deepseek?.reasoning).toBe(true);
  });

  it("should perform Model Comparison Intelligence matrix generation", () => {
    const comparison = modelComparisonEngine.compareModels(["gpt-4o", "claude-3-5-sonnet", "deepseek-r1"]);
    expect(comparison.modelsCompared.length).toBe(3);
    expect(comparison.costDifferenceRatio).toBeGreaterThan(0);
    expect(comparison.bestForCoding).toBeDefined();
  });

  it("should execute full multi-source intelligence scan and produce ContentOpportunities", async () => {
    const result = await globalIntelligenceEngine.executeScan("ON_DEMAND");
    expect(result.totalSignalsCollected).toBeGreaterThan(0);
    expect(result.canonicalEventsCount).toBeGreaterThan(0);
    expect(result.opportunitiesGenerated.length).toBeGreaterThan(0);
    expect(result.sourceHealth.sources.length).toBeGreaterThan(0);
  }, 15000);

  it("should evaluate Do-Not-Publish Gate and reject low experience match topics", () => {
    const mockHypeOpportunity: any = {
      id: "opp_hype_1",
      topic: "Generic AI Hype News",
      personalExperienceMatch: 10, // < 30 threshold
      careerRelevanceScore: 40,
      sourceAuthorityScore: 40,
      overallScore: 45,
    };
    const gateCheck = doNotPublishGate.evaluateOpportunity(mockHypeOpportunity);
    expect(gateCheck.shouldReject).toBe(true);
    expect(gateCheck.rejectionReason).toContain("REJECTED");
  });
});

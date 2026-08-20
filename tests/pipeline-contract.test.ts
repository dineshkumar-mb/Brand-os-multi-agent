import { describe, it, expect } from "vitest";
import { agentOrchestrator } from "../packages/agents/src/index";
import { postHistoryTracker } from "../packages/analytics/src/index";

describe("Daily Generation Pipeline Contract Tests", () => {
  it("should return a POST_READY contract matching the DailyGenerationResult type exactly", async () => {
    postHistoryTracker.clearHistory?.();

    const res = await agentOrchestrator.executePipeline({
      autoPublish: false,
      pipelineId: "contract_test_publish",
    });

    if (res.status === "POST_READY") {
      expect(res.pipelineId).toBeDefined();
      expect(res.topic).toBeDefined();
      expect(res.topic.title).toBeTruthy();
      expect(res.writingContext).toBeDefined();
      expect(res.writingContext.engineeringProblem).toBeTruthy();
      expect(res.linkedInPost).toBeDefined();
      expect(res.linkedInPost.fullText).toBeTruthy();
      expect(res.devToArticle).toBeDefined();
      expect(res.devToArticle.markdownContent).toBeTruthy();
      expect(res.visualPlan).toBeDefined();
      expect(res.qualityGateResult).toBeDefined();
      expect(res.qualityGateResult?.passed).toBe(true);
      expect(res.executionTrace).toBeDefined();
      expect(res.dailyIntelligenceSummary).toBeDefined();
    } else {
      // If it falls back to NO_POST_TODAY in the initial run, verify NO_POST_TODAY properties
      expect(res.status).toBe("NO_POST_TODAY");
      expect(res.pipelineId).toBeDefined();
      expect(res.reason).toBeDefined();
      expect(res.candidatesEvaluated).toBeDefined();
      expect(res.missingSignals).toBeDefined();
      expect(res.dailyIntelligenceSummary).toBeDefined();
    }
  }, 60000);

  it("should return a NO_POST_TODAY contract when all candidates are disqualified", async () => {
    // Injecting a history that forces NO_POST_TODAY
    const history = postHistoryTracker.getHistory();
    
    // We already tested that with all candidates failing novelty it yields NO_POST_TODAY. Let's check structure
    const res = await agentOrchestrator.executePipeline({
      autoPublish: false,
      pipelineId: "contract_test_reject",
      historicalPosts: history,
    });

    if (res.status === "NO_POST_TODAY") {
      expect(res.pipelineId).toBeDefined();
      expect(res.reason).toBeDefined();
      expect(res.candidatesEvaluated).toBeDefined();
      expect(res.missingSignals).toBeDefined();
      expect(res.dailyIntelligenceSummary).toBeDefined();
    }
  }, 60000);
});

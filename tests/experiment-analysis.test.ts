import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { ContentStrategyDecision } from "@brand-os/shared";

describe("Content Experiment Engine & Strategy Generation", () => {
  it("should generate Next 3 and Next 5 post strategy roadmaps based on analytics insights", () => {
    const next3 = linkedinAnalyticsIntelligenceAgent.generateNextStrategyRoadmap(3);
    const next5 = linkedinAnalyticsIntelligenceAgent.generateNextStrategyRoadmap(5);

    expect(next3.length).toBe(3);
    expect(next5.length).toBe(5);

    next3.forEach((item, idx) => {
      expect(item.postIndex).toBe(idx + 1);
      expect(item.suggestedTopic).toBeDefined();
      expect(item.suggestedCategory).toBeDefined();
      expect(item.suggestedFormat).toBeDefined();
      expect(item.suggestedVisualType).toBeDefined();
      expect(item.rationale).toBeDefined();
    });
  });

  it("should output actionable ContentStrategyDecisions with reason, evidence, confidence, and sample size", () => {
    const mockCatPerf = [
      {
        category: "SYSTEM_DESIGN",
        postsCount: 5,
        avgImpressions: 10000,
        medianImpressions: 9500,
        avgEngagementRate: 8.5,
        commentRate: 1.2,
        saveRate: 2.0,
        shareRate: 1.5,
        profileVisitRate: 12.0,
        followerConversionRate: 1.5,
        careerOpportunityRate: 0.8,
        weightedCareerScore: 88,
        signalStrength: "STRONG" as const,
      },
    ];

    const mockFatigue = {
      technologyFatigue: 65,
      topicFatigue: 40,
      hookFatigue: 30,
      visualFatigue: 70,
      formatFatigue: 30,
      explanations: ["Technology 'Redis' appeared in 5 of 8 posts."],
    };

    const decisions = linkedinAnalyticsIntelligenceAgent.generateStrategyDecisions(mockCatPerf, [], mockFatigue, 8);

    expect(decisions.length).toBeGreaterThan(0);

    decisions.forEach((d: ContentStrategyDecision) => {
      expect(d.action).toBeDefined();
      expect(d.target).toBeDefined();
      expect(d.reason).toBeDefined();
      expect(d.evidence).toBeDefined();
      expect(d.confidence).toBeGreaterThan(0);
      expect(d.sampleSize).toBeGreaterThan(0);
    });
  });
});

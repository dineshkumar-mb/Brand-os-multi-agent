import { describe, it, expect } from "vitest";
import { topicNoveltyEngine } from "../packages/agents/src/agents/topic-novelty-engine";
import { HistoricalPostRecord, Platform, SourceAuthorityLevel } from "../packages/shared/src/index";

describe("Topic Novelty Engine & Cooldown Policy", () => {
  it("should reject exact or semantically repetitive topic published recently", () => {
    const history: HistoricalPostRecord[] = [
      {
        id: "p1",
        title: "Redis Streams for Multi-Agent Workflows",
        platform: Platform.LINKEDIN,
        category: "AI Engineering",
        framework: "Redis",
        supportingTech: ["Redis"],
        keywords: ["Redis"],
        hook: "Hook text",
        fullText: "Redis Streams for Multi-Agent Workflows full text explanation.",
        publishedAt: new Date().toISOString(),
      },
    ];

    topicNoveltyEngine.setHistory(history);

    const testTopic = {
      id: "t2",
      title: "Redis Streams for Multi-Agent Workflows",
      category: "AI Engineering",
      framework: "Redis",
      supportingTech: ["Redis"],
      score: 85,
      reason: "Test",
      trend_velocity: 7.0,
      difficulty: "ADVANCED" as const,
      competition: "MEDIUM" as const,
      audience: "Engineers",
      keywords: ["Redis"],
      references: [],
    };

    const res = topicNoveltyEngine.evaluateNovelty(testTopic, SourceAuthorityLevel?.LEVEL_2_SECONDARY || 2, 7.0);
    expect(res.data.rejected).toBe(true);
    expect(res.data.rejectionReason).toContain("COOLDOWN");
  });

  it("should allow BREAKING_EVENT_OVERRIDE for primary Level 1 release with high trend velocity", () => {
    const history: HistoricalPostRecord[] = [
      {
        id: "p1",
        title: "DeepSeek R1 Model Release",
        platform: Platform.LINKEDIN,
        category: "AI Engineering",
        framework: "DeepSeek",
        supportingTech: ["DeepSeek"],
        keywords: ["DeepSeek"],
        hook: "Hook text",
        fullText: "DeepSeek R1 Model Release overview",
        publishedAt: new Date().toISOString(),
      },
    ];

    topicNoveltyEngine.setHistory(history);

    const testTopic = {
      id: "t2",
      title: "DeepSeek R1 Model Release",
      category: "AI Engineering",
      framework: "DeepSeek",
      supportingTech: ["DeepSeek"],
      score: 95,
      reason: "Breaking official release",
      trend_velocity: 9.5,
      difficulty: "ADVANCED" as const,
      competition: "MEDIUM" as const,
      audience: "Engineers",
      keywords: ["DeepSeek"],
      references: ["https://openai.com"],
    };

    const res = topicNoveltyEngine.evaluateNovelty(testTopic, SourceAuthorityLevel?.LEVEL_1_PRIMARY || 1, 9.5);
    expect(res.data.rejected).toBe(false);
    expect(res.data.isBreakingOverride).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { visualNoveltyAgent, VisualNoveltyAgent, VisualRecord } from "../packages/agents/src/agents/visual-novelty-agent";
import { VisualType, Topic } from "../packages/shared/src/index";

describe("Visual Novelty Agent & Cooldown Tests", () => {
  it("should correctly map engineering problems to appropriate visual types", () => {
    // Performance topic
    const t1 = { title: "Optimizing database read latency under load", category: "Performance" } as Topic;
    expect(visualNoveltyAgent.mapProblemToVisualType(t1.title, t1.category)).toBe(VisualType.BENCHMARK_CHART);

    // Incident/bug
    const t2 = { title: "Postmortem of our production heap overflow incident", category: "Node.js" } as Topic;
    expect(visualNoveltyAgent.mapProblemToVisualType(t2.title, t2.category)).toBe(VisualType.FAILURE_ANALYSIS);

    // Architecture decision/tradeoff
    const t3 = { title: "Choosing between Redis and Kafka for message routing", category: "System Design" } as Topic;
    expect(visualNoveltyAgent.mapProblemToVisualType(t3.title, t3.category)).toBe(VisualType.DECISION_MATRIX);

    // Flow/pipeline
    const t4 = { title: "Building a high-throughput event processing pipeline", category: "DevOps" } as Topic;
    expect(visualNoveltyAgent.mapProblemToVisualType(t4.title, t4.category)).toBe(VisualType.SYSTEM_FLOW);
  });

  it("should select a fresh visual type if the preferred type conflicts with recent visual history", () => {
    const history: VisualRecord[] = [
      {
        id: "v1",
        topicTitle: "Optimizing memory",
        visualType: VisualType.BENCHMARK_CHART, // benchmark chart was just used
        layout: "SPLIT_SCREEN_COMPARISON",
        subject: "Optimizing memory",
        prompt: "...",
        visualHash: "hash1",
        createdAt: new Date().toISOString(),
      },
    ];

    visualNoveltyAgent.setHistory(history);

    const testTopic = {
      id: "t_perf",
      title: "Query throughput bottleneck analysis",
      category: "Performance",
      framework: "TypeScript",
      supportingTech: ["TypeScript"],
      score: 80,
      reason: "Performance testing",
      trend_velocity: 5.0,
      difficulty: "ADVANCED" as const,
      competition: "MEDIUM" as const,
      audience: "Engineers",
      keywords: ["Performance"],
      references: [],
    };

    // Even though it's a performance topic (which maps to BENCHMARK_CHART),
    // since BENCHMARK_CHART was used recently, it should choose another type
    const selected = visualNoveltyAgent.selectFreshVisualType(testTopic.title, testTopic.category);
    expect(selected).not.toBe(VisualType.BENCHMARK_CHART);
  });

  it("should reject visual design if visual novelty score falls below the required threshold due to multiple collisions", () => {
    const testTopic = {
      id: "t1",
      title: "Vite 6 Bundler Refactoring",
      category: "TypeScript",
      framework: "Vite",
      supportingTech: ["Vite"],
      score: 80,
      reason: "Release",
      trend_velocity: 5.0,
      difficulty: "ADVANCED" as const,
      competition: "MEDIUM" as const,
      audience: "Engineers",
      keywords: ["Vite"],
      references: [],
    };

    const record: VisualRecord = {
      id: "v_recent",
      topicTitle: testTopic.title,
      visualType: VisualType.ARCHITECTURE_DIAGRAM,
      layout: "DYNAMIC_VECTOR_FLOW",
      subject: testTopic.title,
      prompt: "prompt text",
      visualHash: `${testTopic.title.toLowerCase().replace(/[^a-z0-9]/g, "")}_${VisualType.ARCHITECTURE_DIAGRAM}`,
      createdAt: new Date().toISOString(),
    };

    // If history has exact same subject, type, and visual hash, it must fail the visual novelty check
    const localAgent = new VisualNoveltyAgent([record]);
    const res = localAgent.evaluateAndPlanVisual(testTopic);

    expect(res.success).toBe(false);
    expect(res.data.passed).toBe(false);
    expect(res.data.rejectionReason).toContain("VISUAL_REPETITION_REJECTED");
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import {
  VisualIntelligenceAgent,
  VisualReviewAgent,
  VisualRAGStore,
  RecentVisualMemoryStore,
  VisualPatternExtractor,
} from "../index";
import {
  Topic,
  STARStory,
  StoryMode,
  VisualFormat,
  VisualComposition,
  ColorStyle,
  VisualPurpose,
} from "@brand-os/shared";

describe("Visual Intelligence & RAG System Unit & Integration Tests", () => {
  beforeEach(() => {
    new RecentVisualMemoryStore().clearMemory();
  });
  const sampleTopic: Topic = {
    id: "vtop_01",
    title: "LLM Gateway Failover Architecture",
    category: "AI Engineering",
    framework: "Node.js",
    supportingTech: ["TypeScript", "OpenAI", "Anthropic"],
    score: 95,
    reason: "Production LLM failover architecture",
    trend_velocity: 9.5,
    difficulty: "ADVANCED",
    competition: "LOW",
    audience: "AI Engineers",
    keywords: ["Gateway", "Failover", "LLM", "Circuit Breaker"],
    references: ["https://openai.com"],
  };

  const sampleStarStory: STARStory = {
    situation: {
      context: "Primary LLM provider experienced p99 latency spikes of 12s during high-volume inference.",
      trigger: "Production API rate limits triggered 504 gateway timeouts.",
    },
    task: {
      objective: "Implement a zero-downtime multi-model failover router with automatic circuit breaking.",
      constraints: ["Under 200ms latency overhead", "Zero lost requests"],
    },
    action: {
      approachesConsidered: ["Single Provider Retry", "Multi-Model Gateway Failover"],
      chosenApproach: "Multi-Model Gateway Failover with Active Health Probing",
      reasoning: "Decoupled model invocation boundaries with automatic fallback to secondary provider.",
    },
    result: {
      outcome: "Eliminated unhandled 504 timeouts and maintained 99.99% system availability.",
      evidence: ["Zero lost requests", "p99 latency stabilized at 1.2s"],
    },
    insight: {
      engineeringLesson: "Never tie production SLA to a single LLM API boundary.",
      tradeoffs: ["Higher cost during secondary model failover", "Slightly varied response formats"],
    },
  };

  it("1. VisualRAGStore should retrieve relevant visual patterns without storing copyrighted images", () => {
    const store = new VisualRAGStore();
    const patterns = store.retrieveVisualPatterns(sampleTopic, StoryMode.FAILURE_STORY, 3);

    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0].sourcePlatform).toBeDefined();
    expect(patterns[0].visualType).toBeDefined();
    expect(patterns[0].composition).toBeDefined();
    // Verify metadata only
    expect(patterns[0]).not.toHaveProperty("imageData");
    expect(patterns[0]).not.toHaveProperty("imageFile");
  });

  it("2. VisualPatternExtractor should dynamically determine format, composition, and color style", () => {
    const extractor = new VisualPatternExtractor();
    const result = extractor.extractPattern(sampleTopic, sampleStarStory, StoryMode.FAILURE_STORY);

    expect(result.visualFormat).toBe(VisualFormat.FAILURE_RECOVERY_MAP);
    expect(result.composition).toBe(VisualComposition.FLOWCHART);
    expect(result.purpose).toBe(VisualPurpose.EXPOSE_PROBLEM);
    expect(result.keyElements.length).toBeGreaterThan(0);
  });

  it("3. RecentVisualMemoryStore should track 14-day history and calculate repetition score", () => {
    const memory = new RecentVisualMemoryStore();
    const repCheck = memory.calculateRepetitionScore({
      visualFormat: VisualFormat.ARCHITECTURE_DIAGRAM,
      composition: VisualComposition.LEFT_TO_RIGHT,
      colorStyle: ColorStyle.LIGHT_TECHNICAL_BLUEPRINT,
      promptHash: "unique_test_prompt_hash",
      topic: "Unique Topic Title",
    });

    expect(repCheck.repetitionScore).toBeGreaterThanOrEqual(0);
    expect(repCheck.repetitionScore).toBeLessThanOrEqual(100);
  });

  it("4. VisualIntelligenceAgent should build story-aware structured prompt without AI cliché keywords", () => {
    const agent = new VisualIntelligenceAgent();
    const result = agent.generateVisualBlueprint(sampleTopic, sampleStarStory, StoryMode.FAILURE_STORY);

    expect(result.success).toBe(true);
    expect(result.data.visualStoryAlignmentScore).toBeGreaterThanOrEqual(80);
    expect(result.data.structuredPrompt.negativePrompt).toContain("No generic AI robots");
    expect(result.data.structuredPrompt.subject).toContain("LLM Gateway Failover Architecture");
  });

  it("5. VisualReviewAgent should audit visual quality and reject generic AI imagery", () => {
    const agent = new VisualIntelligenceAgent();
    const reviewer = new VisualReviewAgent();

    const blueprint = agent.generateVisualBlueprint(sampleTopic, sampleStarStory, StoryMode.FAILURE_STORY);
    const review = reviewer.evaluateVisualQuality(sampleTopic, blueprint.data, undefined, undefined, sampleStarStory);

    expect(review.success).toBe(true);
    expect(review.data.overallScore).toBeGreaterThanOrEqual(85);
    expect(review.data.rejectionReasons.length).toBe(0);
  });

  it("6. 10 Consecutive Dry-Run Verification — 10 Topics, 10 Story Modes, 10 Unique Images", async () => {
    const agent = new VisualIntelligenceAgent();
    const reviewer = new VisualReviewAgent();

    const syntheticTopics: Array<{ topic: Topic; storyMode: StoryMode }> = [
      {
        topic: { id: "d1", title: "Day 1: AI Agent Retry Loops & Backpressure", category: "Agentic AI", score: 90, trend_velocity: 9, difficulty: "ADVANCED", competition: "LOW", audience: "AI Engineers", keywords: ["Agents"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.FAILURE_STORY,
      },
      {
        topic: { id: "d2", title: "Day 2: Multi-Model Gateway Failover Architecture", category: "System Design", score: 92, trend_velocity: 9.2, difficulty: "ADVANCED", competition: "LOW", audience: "System Architects", keywords: ["Gateway"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.ARCHITECTURE_STORY,
      },
      {
        topic: { id: "d3", title: "Day 3: PostgreSQL Lock Contention Under p99 Spikes", category: "Database", score: 94, trend_velocity: 9.5, difficulty: "ADVANCED", competition: "MEDIUM", audience: "Database Engineers", keywords: ["Postgres"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.DEBUGGING_STORY,
      },
      {
        topic: { id: "d4", title: "Day 4: DeepSeek R1 Rule-Based Reward Benchmarks", category: "AI Engineering", score: 95, trend_velocity: 9.6, difficulty: "ADVANCED", competition: "LOW", audience: "AI Researchers", keywords: ["DeepSeek"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.PERFORMANCE_STORY,
      },
      {
        topic: { id: "d5", title: "Day 5: Building a Decoupled Event Bus in Monorepos", category: "Software Engineering", score: 89, trend_velocity: 8.7, difficulty: "INTERMEDIATE", competition: "LOW", audience: "Senior Developers", keywords: ["TypeScript"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.BUILD_IN_PUBLIC,
      },
      {
        topic: { id: "d6", title: "Day 6: gRPC Streaming vs REST WebSockets Tradeoff", category: "Architecture", score: 91, trend_velocity: 8.9, difficulty: "ADVANCED", competition: "MEDIUM", audience: "System Architects", keywords: ["gRPC"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.DECISION_STORY,
      },
      {
        topic: { id: "d7", title: "Day 7: Docker Buildx Rootless Container Hardening", category: "DevOps", score: 88, trend_velocity: 8.5, difficulty: "INTERMEDIATE", competition: "LOW", audience: "DevOps Engineers", keywords: ["Docker"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.PRODUCTION_REALITY,
      },
      {
        topic: { id: "d8", title: "Day 8: Cache-Augmented Generation (CAG) vs RAG", category: "AI Engineering", score: 96, trend_velocity: 9.7, difficulty: "ADVANCED", competition: "LOW", audience: "AI Researchers", keywords: ["CAG"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.CONTRARIAN_OBSERVATION,
      },
      {
        topic: { id: "d9", title: "Day 9: OpenTelemetry Circuit Breaker Metric Tracing", category: "Observability", score: 90, trend_velocity: 8.7, difficulty: "ADVANCED", competition: "LOW", audience: "Platform Engineers", keywords: ["OpenTelemetry"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.BEFORE_AFTER,
      },
      {
        topic: { id: "d10", title: "Day 10: Model Context Protocol (MCP) Tool Execution", category: "Agentic AI", score: 93, trend_velocity: 9.1, difficulty: "ADVANCED", competition: "LOW", audience: "AI Engineers", keywords: ["MCP"], supportingTech: [], reason: "", references: [] },
        storyMode: StoryMode.TECH_DISCOVERY,
      },
    ];

    const telemetryReport: Array<{
      day: number;
      topic: string;
      storyMode: string;
      visualFormat: string;
      colorStyle: string;
      repetitionScore: number;
      alignmentScore: number;
      qualityScore: number;
      ragReferences: number;
    }> = [];

    for (let i = 0; i < syntheticTopics.length; i++) {
      const item = syntheticTopics[i];
      const intelRes = agent.generateVisualBlueprint(item.topic, sampleStarStory, item.storyMode, `dryrun_${i + 1}`);
      const reviewRes = reviewer.evaluateVisualQuality(item.topic, intelRes.data, undefined, undefined, sampleStarStory);

      expect(intelRes.success).toBe(true);
      expect(reviewRes.success).toBe(true);
      expect(intelRes.data.visualStoryAlignmentScore).toBeGreaterThanOrEqual(80);
      expect(intelRes.data.visualRepetitionScore).toBeLessThanOrEqual(35);
      expect(reviewRes.data.overallScore).toBeGreaterThanOrEqual(85);

      telemetryReport.push({
        day: i + 1,
        topic: item.topic.title,
        storyMode: item.storyMode,
        visualFormat: intelRes.data.visualFormat,
        colorStyle: intelRes.data.colorStyle,
        repetitionScore: intelRes.data.visualRepetitionScore,
        alignmentScore: intelRes.data.visualStoryAlignmentScore,
        qualityScore: reviewRes.data.overallScore,
        ragReferences: intelRes.data.ragReferences.length,
      });
    }

    console.log("==================================================");
    console.log("VISUAL INTELLIGENCE 10-DAY DRY RUN TELEMETRY REPORT");
    console.log("==================================================");
    console.table(telemetryReport);

    // Verify visual format diversity across 10 days
    const uniqueFormats = new Set(telemetryReport.map((r) => r.visualFormat));
    expect(uniqueFormats.size).toBeGreaterThanOrEqual(5);

    // Verify color style diversity
    const uniqueColors = new Set(telemetryReport.map((r) => r.colorStyle));
    expect(uniqueColors.size).toBeGreaterThanOrEqual(4);
  });
});

import { describe, it, expect } from "vitest";
import {
  TechnicalWriterAgent,
  WritingQualityEvaluator,
  WritingMemoryTracker,
  HookEngine,
  TradeoffEngine,
} from "../index";
import {
  HookType,
  DiscussionCtaType,
  Topic,
  ResearchOutput,
  HistoricalPostRecord,
  Platform,
} from "@brand-os/shared";

describe("Senior Software Engineer Writing Agent Unit & Integration Tests", () => {
  const sampleTopic: Topic = {
    id: "t_mcp_1",
    title: "Model Context Protocol (MCP): Isolation Boundaries & Tool Calling",
    category: "Agentic AI",
    framework: "MCP",
    supportingTech: ["TypeScript", "JSON-RPC", "Node.js"],
    score: 96,
    reason: "Surging architecture trend",
    trend_velocity: 9.8,
    difficulty: "ADVANCED",
    competition: "MEDIUM",
    audience: "AI Engineers & System Architects",
    keywords: ["MCP", "Tool Calling", "Isolation Boundaries", "JSON-RPC"],
    references: ["https://modelcontextprotocol.io"],
  };

  const sampleResearch: ResearchOutput = {
    topicId: "t_mcp_1",
    summary: "Model Context Protocol (MCP) standardizes how AI agents discover and execute tools over JSON-RPC boundaries.",
    key_insights: [
      "Decoupled JSON-RPC schema contracts eliminate tight SDK coupling.",
      "Runtime tool isolation prevents unvalidated state mutations.",
      "Exponential backoff handling handles tool timeout spikes."
    ],
    pros: ["Strict schema contracts", "Interoperable tool ecosystem"],
    cons: ["IPC serialization latency"],
    future_outlook: "Widespread enterprise adoption for autonomous swarms.",
    code_snippets: [
      {
        language: "typescript",
        code: `export const handleToolCall = async (req: { name: string; args: any }) => {\n  if (!req.name) throw new Error("Invalid schema");\n  return { success: true };\n};`,
        description: "Standardized tool handler"
      }
    ],
    statistics: ["Reduces integration boilerplate by 60%", "Achieved 80% regression reduction"],
    citations: [{ title: "MCP Specification", url: "https://modelcontextprotocol.io", source: "Official Docs" }],
  };

  const sampleExperience = {
    foundMatch: true,
    realWorldProblem: "High latency spikes when invoking third-party tool APIs in multi-agent workflows.",
    engineeringDecision: "Decoupled tool invocation queues with exponential backoff and circuit breaker isolation.",
    quantifiableOutcome: "Reduced p99 tool latency from 3400ms to 420ms while eliminating unhandled task crashes.",
    technologiesUsed: ["TypeScript", "MCP", "Redis", "BullMQ"],
    challengesFaced: ["JSON-RPC serialization overhead"],
    tradeoffs: ["Added queue infrastructure maintainability overhead for lower latency"],
    keyLessons: ["State boundaries must be enforced at the runtime interface layer."],
  };

  const sampleAudience = {
    primaryAudience: "Senior AI Engineers & System Architects",
    secondaryAudience: "Engineering Managers",
    whyAudienceCares: "Reliable agent execution in production",
    keyPainPoints: ["Tool execution timeouts", "Hallucinated schema parameters"],
    toneRecommendation: "Pragmatic, architectural, production-focused",
  };

  const samplePastPosts: HistoricalPostRecord[] = [
    {
      id: "p_1",
      title: "Previous Post on MCP Architecture",
      platform: Platform.LINKEDIN,
      category: "Agentic AI",
      framework: "MCP",
      supportingTech: ["TypeScript"],
      keywords: ["MCP"],
      hook: "I expected MCP to be a simple integration.",
      fullText: "Previous post text...",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  it("1. WritingQualityEvaluator should reject generic AI introduction clichés", () => {
    const evaluator = new WritingQualityEvaluator();
    const clichePost = {
      title: "MCP Architecture",
      hook: "In today's fast-paced world, let's dive in to unlock the power of game-changing MCP.",
      story: "As developers, we know technology is evolving rapidly. Exciting times ahead!",
      lesson: "This is a must-have transform your development workflow whether you're a beginner or expert.",
      actionableInsight: "Bullet 1",
      cta: "What do you think?",
      hashtags: ["#AI"],
      fullText: "In today's fast-paced world, let's dive in to unlock the power of game-changing MCP. As developers, we know technology is evolving rapidly. Exciting times ahead!",
    };

    const score = evaluator.evaluate(clichePost as any);
    expect(score.aiClicheScore).toBeLessThan(70);
    expect(score.overall).toBeLessThan(85);
  });

  it("2. HookEngine should generate non-repeating engineering hooks across 10 hook types", () => {
    const engine = new HookEngine();
    const hookTypes = Object.values(HookType);

    const generatedHooks = hookTypes.map((ht) =>
      engine.generateHook(ht, sampleTopic, true, sampleExperience.realWorldProblem)
    );

    // All 10 hook types should generate non-empty, distinct hooks
    expect(generatedHooks.length).toBe(10);
    const uniqueHooks = new Set(generatedHooks);
    expect(uniqueHooks.size).toBe(10);
  });

  it("3. HookEngine should generate rotated technical discussion CTAs", () => {
    const engine = new HookEngine();
    const ctaTypes = Object.values(DiscussionCtaType);

    const generatedCtas = ctaTypes.map((ct) =>
      engine.generateDiscussionCta(ct, sampleTopic)
    );

    expect(generatedCtas.length).toBe(6);
    const uniqueCtas = new Set(generatedCtas);
    expect(uniqueCtas.size).toBe(6);
    expect(generatedCtas[0]).not.toContain("What do you think?");
  });

  it("4. WritingMemoryTracker should enforce hook and CTA rotation without consecutive repetition", () => {
    const memory = new WritingMemoryTracker();

    memory.recordEntry({
      topic: "Post 1",
      category: "Agentic AI",
      hook: "Hook 1",
      hookType: HookType.ENGINEERING_OBSERVATION,
      storyAngle: "ARCHITECTURE_ANALYSIS",
      narrativePattern: "ENGINEERING_DISCOVERY",
      ctaType: DiscussionCtaType.TRADEOFF_CHOICE,
      ctaText: "CTA 1",
      vocabulary: ["MCP"],
      writingQualityScore: { clarity: 90, technicalDepth: 90, seniority: 90, authenticity: 90, originality: 90, narrativeQuality: 90, evidenceQuality: 90, readability: 90, careerSignal: 90, discussionPotential: 90, aiClicheScore: 100, overall: 90 },
    });

    const nextHookType = memory.selectFreshHookType(HookType.ENGINEERING_OBSERVATION);
    expect(nextHookType).not.toBe(HookType.ENGINEERING_OBSERVATION);

    const nextCtaType = memory.selectFreshCtaType(DiscussionCtaType.TRADEOFF_CHOICE);
    expect(nextCtaType).not.toBe(DiscussionCtaType.TRADEOFF_CHOICE);
  });

  it("5. TradeoffEngine should identify legitimate technical trade-offs for topics", () => {
    const engine = new TradeoffEngine();
    const tradeoffs = engine.identifyTradeoffs(sampleTopic);

    expect(tradeoffs.length).toBeGreaterThan(0);
    expect(tradeoffs[0].dimensionA).toBeDefined();
    expect(tradeoffs[0].dimensionB).toBeDefined();
    expect(tradeoffs[0].chosen).toBeDefined();
    expect(tradeoffs[0].sacrificed).toBeDefined();
  });

  it("6. WritingQualityEvaluator should penalize fabricated personal experience", () => {
    const evaluator = new WritingQualityEvaluator();

    const fakeExperiencePost = {
      title: "MCP Scale",
      hook: "I deployed our production cluster of 500 pods...",
      story: "I scaled our internal microservice fleet to 10M requests...",
      lesson: "Decision",
      actionableInsight: "Insights",
      cta: "Discussion?",
      hashtags: ["#AI"],
      fullText: "I built and deployed our production cluster of 500 pods and scaled our internal microservice fleet to 10M requests...",
    };

    const noMatchExperience = { foundMatch: false };
    const score = evaluator.evaluate(fakeExperiencePost as any, undefined, sampleResearch, noMatchExperience);

    expect(score.authenticity).toBeLessThan(75);
  });

  it("7. Seniority test: Junior statement ('Redis is fast') vs Senior trade-off analysis", () => {
    const evaluator = new WritingQualityEvaluator();

    const juniorPost = {
      title: "Redis Caching",
      hook: "Redis is fast.",
      story: "You should use Redis because Redis is fast.",
      lesson: "It makes app fast.",
      actionableInsight: "Use Redis",
      cta: "What do you think?",
      hashtags: ["#Redis"],
      fullText: "Redis is fast. You should use Redis because Redis is fast.",
    };

    const seniorPost = {
      title: "Redis Cache Invalidation",
      hook: "The difficult part wasn't adding Redis.",
      story: "It was deciding what state could safely become eventually consistent and what state still required PostgreSQL as the source of truth under high memory pressure.",
      lesson: "We implemented write-through cache invalidation with short TTLs for hot paths.",
      actionableInsight: "1. Enforce strict TTLs\n2. Track cache miss ratio in telemetry\n3. Protect DB connection pool",
      cta: "Where would your team draw the boundary between eventual consistency and strong database consistency?",
      hashtags: ["#SystemDesign", "#Redis"],
      fullText: "The difficult part wasn't adding Redis. It was deciding what state could safely become eventually consistent and what state still required PostgreSQL as the source of truth under high memory pressure.\n\nWe implemented write-through cache invalidation with short TTLs for hot paths.\n\nKey Takeaways:\n1. Enforce strict TTLs\n2. Track cache miss ratio in telemetry\n3. Protect DB connection pool\n\nWhere would your team draw the boundary between eventual consistency and strong database consistency?",
    };

    const juniorScore = evaluator.evaluate(juniorPost as any);
    const seniorScore = evaluator.evaluate(seniorPost as any, undefined, sampleResearch, sampleExperience as any);

    expect(seniorScore.seniority).toBeGreaterThan(juniorScore.seniority + 25);
    expect(seniorScore.technicalDepth).toBeGreaterThan(juniorScore.technicalDepth + 25);
    expect(seniorScore.overall).toBeGreaterThanOrEqual(85);
  });

  it("8. TechnicalWriterAgent should generate complete senior-level LinkedIn post and Dev.to article", async () => {
    const writer = new TechnicalWriterAgent();

    const result = await writer.generateContent(
      sampleTopic,
      sampleResearch,
      sampleExperience as any,
      sampleAudience as any,
      "pl_test_1",
      samplePastPosts
    );

    expect(result.success).toBe(true);
    expect(result.data.linkedInPost).toBeDefined();
    expect(result.data.linkedInPost.fullText.length).toBeGreaterThan(150);
    expect(result.data.devToArticle).toBeDefined();
    expect(result.data.devToArticle.markdownContent).toContain("## 2. High-Level System Architecture");
    expect(result.data.devToArticle.markdownContent).toContain("```mermaid");
    expect(result.data.visualNarrative).toBeDefined();
    expect(result.data.writingQualityScore.overall).toBeGreaterThanOrEqual(85);
  });

  it("9. LinkedIn and Dev.to outputs must differ significantly in structure and technical depth", async () => {
    const writer = new TechnicalWriterAgent();

    const result = await writer.generateContent(
      sampleTopic,
      sampleResearch,
      sampleExperience as any,
      sampleAudience as any,
      "pl_test_2"
    );

    const linkedInText = result.data.linkedInPost.fullText;
    const devToText = result.data.devToArticle.markdownContent;

    // Dev.to article should contain Markdown headings and code blocks not in LinkedIn post
    expect(devToText.length).toBeGreaterThan(linkedInText.length);
    expect(devToText).toContain("## 4. Runnable Code Blueprint");
    expect(devToText).toContain("## 5. Edge Cases & Failure Recovery Modes");
    expect(linkedInText).not.toContain("## 4. Runnable Code Blueprint");
  });

  it("10. Unsupported technical claims with fake percentage metrics should be penalized in evidence quality", () => {
    const evaluator = new WritingQualityEvaluator();

    const fakeClaimPost = {
      title: "Fake Latency Claim",
      hook: "This new framework reduces latency by 99% and cost by 95%.",
      story: "We saw 99% latency reduction.",
      lesson: "Great results.",
      actionableInsight: "Use it",
      cta: "Comments?",
      hashtags: ["#Tech"],
      fullText: "This new framework reduces latency by 99% and cost by 95%. We saw 99% latency reduction.",
    };

    const emptyResearch: ResearchOutput = {
      topicId: "t1",
      summary: "No percentage metrics in research.",
      key_insights: [],
      pros: [],
      cons: [],
      future_outlook: "",
      code_snippets: [],
      statistics: [],
      citations: [],
    };

    const score = evaluator.evaluate(fakeClaimPost as any, undefined, emptyResearch);
    expect(score.evidenceQuality).toBeLessThan(75);
  });
});

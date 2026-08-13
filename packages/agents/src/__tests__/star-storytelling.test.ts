import { describe, it, expect } from "vitest";
import {
  TechnicalWriterAgent,
  EngineeringReasoningAgent,
  WritingQualityEvaluator,
  WritingMemoryTracker,
  HookEngine,
  StorytellingAgent,
  DecisionGateAgent,
} from "../index";
import {
  HookType,
  DiscussionCtaType,
  Topic,
  ResearchOutput,
  StoryMode,
  FormatStyle,
  STARStory,
} from "@brand-os/shared";

describe("STAR + Human Engineering Storytelling Test Suite", () => {
  const writer = new TechnicalWriterAgent();
  const reasoningAgent = new EngineeringReasoningAgent();
  const evaluator = new WritingQualityEvaluator();
  const memoryTracker = new WritingMemoryTracker();
  const hookEngine = new HookEngine();
  const storytellingAgent = new StorytellingAgent();
  const decisionGate = new DecisionGateAgent();

  const testTopic: Topic = {
    id: "t_redis_cache_1",
    title: "PostgreSQL Read Bottlenecks & Redis Caching Boundaries",
    category: "System Design",
    framework: "PostgreSQL & Redis",
    supportingTech: ["Redis", "PostgreSQL", "Node.js", "TypeScript"],
    score: 95,
    reason: "High concurrency system design topic",
    trend_velocity: 9.2,
    difficulty: "ADVANCED",
    competition: "HIGH",
    audience: "System Architects & Senior Backend Engineers",
    keywords: ["Redis", "PostgreSQL", "Caching", "System Design"],
    references: ["https://redis.io"],
  };

  const testResearch: ResearchOutput = {
    topicId: "t_redis_cache_1",
    summary: "PostgreSQL read query throughput drops under high concurrency due to connection pool saturation.",
    key_insights: [
      "Caching key lookups reduces database load by up to 75%.",
      "Full response caching causes complex invalidation race conditions.",
      "Selective query-level caching with circuit breaking maintains source-of-truth reliability."
    ],
    pros: ["Reduced p99 latency", "Isolated read path"],
    cons: ["Cache invalidation complexity"],
    future_outlook: "Widespread adoption of read-through caching boundaries.",
    code_snippets: [
      {
        language: "typescript",
        code: `export const getCachedData = async (key: string) => {\n  const cached = await redis.get(key);\n  if (cached) return JSON.parse(cached);\n  const dbData = await db.query(key);\n  await redis.set(key, JSON.stringify(dbData), "EX", 300);\n  return dbData;\n};`,
        description: "Selective lookup cache handler"
      }
    ],
    statistics: ["p99 latency improved by 45%"],
    citations: [{ title: "Redis Architecture", url: "https://redis.io", source: "Official Docs" }],
  };

  const testExperience = {
    foundMatch: true,
    realWorldProblem: "High DB connection lock contention during spike traffic events.",
    engineeringDecision: "Isolated query-level caching with explicit invalidation TTLs and fallback read-through.",
    quantifiableOutcome: "p99 latency dropped from 240ms to 38ms under 5x peak load.",
    technologiesUsed: ["PostgreSQL", "Redis", "TypeScript"],
  };

  it("1. STAR Story Extraction — Generates valid structured STARStory", async () => {
    const res = await reasoningAgent.generateSTARStory(
      testTopic,
      testResearch,
      testExperience,
      StoryMode.DECISION_STORY
    );

    expect(res.success).toBe(true);
    const star: STARStory = res.data.starStory;
    expect(star.situation.context).toBeDefined();
    expect(star.task.objective).toBeDefined();
    expect(star.action.chosenApproach).toBeDefined();
    expect(star.action.reasoning).toBeDefined();
    expect(star.result.outcome).toBeDefined();
    expect(star.insight.engineeringLesson).toBeDefined();
  });

  it("2. STAR Completeness & Quality Scoring", () => {
    const starStory: STARStory = {
      situation: { context: "Context text", trigger: "Trigger event" },
      task: { objective: "Objective text", constraints: ["Constraint 1"] },
      action: { approachesConsidered: ["A", "B"], chosenApproach: "B", reasoning: "Reasoning text" },
      result: { outcome: "Outcome text", evidence: ["Evidence log"] },
      insight: { engineeringLesson: "Lesson text", tradeoffs: ["Tradeoff 1"] }
    };

    const dummyPost = {
      title: testTopic.title,
      hook: "I thought the database was slow. It wasn't.",
      story: "Context text",
      lesson: "Lesson text",
      actionableInsight: "Outcome text",
      cta: "Would you choose Option A or B?",
      hashtags: ["#SoftwareEngineering"],
      fullText: "I thought the database was slow. It wasn't.\n\nUnder peak load, PostgreSQL connection limits were exhausted. We evaluated full response caching vs lookup caching.\n\nWe chose lookup caching because invalidation of full objects created subtle stale state bugs.\n\np99 latency stabilized at 38ms under peak throughput.\n\nThe lesson: Caching is an architectural boundary decision about state ownership, not just a performance tweak.\n\nWould you choose Option A or B?",
    };

    const quality = evaluator.evaluateStoryQualityScore(dummyPost, starStory);
    expect(quality.starCompleteness).toBeGreaterThanOrEqual(85);
    expect(quality.overall).toBeGreaterThanOrEqual(80);
  });

  it("3. Boredom Score Calculation & Rejection Threshold", () => {
    // Boring post with literal emoji headers and formulaic list
    const boringPost = {
      title: testTopic.title,
      hook: "In today's fast-paced world, Redis is a game-changing solution.",
      story: "Here is how to use Redis.",
      lesson: "Redis is fast.",
      actionableInsight: "1. Fast 2. Scalable 3. Easy",
      cta: "What do you think?",
      hashtags: ["#Redis"],
      fullText: "1️⃣ Observation:\nIn today's fast-paced world, Redis is a game-changing solution.\n\n2️⃣ Problem & Production Bottleneck:\nHere are 5 benefits of Redis:\n1. Fast\n2. Scalable\n3. Easy\n\nWhat do you think?",
    };

    const boredom = evaluator.evaluateBoredomScore(boringPost);
    expect(boredom.overall).toBeGreaterThan(35);

    const gateRes = decisionGate.evaluateDecision(
      testTopic,
      { ...boringPost, writingQualityScore: { clarity: 80, technicalDepth: 50, seniority: 50, authenticity: 70, originality: 70, narrativeQuality: 50, evidenceQuality: 50, readability: 70, careerSignal: 50, discussionPotential: 50, aiClicheScore: 0, overall: 50, boredomScore: boredom } },
      { title: testTopic.title, description: "desc", published: false, tags: ["webdev"], canonicalUrl: "https://test.com", markdownContent: "content" },
      { passed: true, overallSimilarityScore: 0.1, breakdown: { titleSimilarity: 0, hookSimilarity: 0, technologyOverlap: 0, ctaSimilarity: 0, structureSimilarity: 0 }, rejectionReasons: [] },
      { passed: true, accuracyScore: 90, syntaxValid: true, frameworkVersionValid: true, tradeoffsAddressed: true, securityChecksPassed: true, reviewNotes: [] },
      { alignedWithArticle: true, alignmentScore: 90, categoryMatch: true, logoAccuracyPassed: true, feedbackNotes: [] },
      1
    );

    expect(gateRes.data.approvedForPublishing).toBe(false);
    expect(gateRes.data.rejectionReasons.some(r => r.includes("Human tone check failed") || r.includes("STAR headers") || r.includes("boredom"))).toBe(true);
  });

  it("4. 7-Day Pattern Exclusion in WritingMemoryTracker", () => {
    // Record entries with specific StoryModes and FormatStyles
    memoryTracker.recordEntry({
      topic: "Topic 1",
      category: "Category 1",
      hook: "Hook 1",
      hookType: HookType.ENGINEERING_OBSERVATION,
      storyAngle: "Angle 1",
      narrativePattern: "ENGINEERING_DISCOVERY",
      ctaType: DiscussionCtaType.TRADEOFF_CHOICE,
      ctaText: "CTA 1",
      vocabulary: [],
      writingQualityScore: { clarity: 90, technicalDepth: 90, seniority: 90, authenticity: 90, originality: 90, narrativeQuality: 90, evidenceQuality: 90, readability: 90, careerSignal: 90, discussionPotential: 90, aiClicheScore: 100, overall: 90 },
      storyMode: StoryMode.FAILURE_STORY,
      formatStyle: FormatStyle.NARRATIVE_PARAGRAPHS,
    });

    const freshMode = memoryTracker.selectFreshStoryMode(StoryMode.FAILURE_STORY);
    expect(freshMode).not.toBe(StoryMode.FAILURE_STORY);

    const freshFormat = memoryTracker.selectFreshFormatStyle(FormatStyle.NARRATIVE_PARAGRAPHS);
    expect(freshFormat).not.toBe(FormatStyle.NARRATIVE_PARAGRAPHS);
  });

  it("5. Engineering Tension & Decision Moment Verification", () => {
    const postWithTension = {
      title: testTopic.title,
      hook: "I could make this architecture simpler. I deliberately didn't.",
      story: "We had two options: Option A was simpler, Option B was resilient under network partition.",
      lesson: "We chose Option B because decoupling domain boundaries prevents cascading failure.",
      actionableInsight: "System resilience > Day-1 setup speed.",
      cta: "Where would you draw the boundary in your architecture?",
      hashtags: ["#SystemDesign"],
      fullText: "I could make this architecture simpler. I deliberately didn't.\n\nWe faced a trade-off between Option A (simplest setup) and Option B (resilient decoupled state).\n\nOption A passed tests, but invalidation edge cases would hide database state drift in production. That was the decision moment where we pivoted to Option B.\n\nWhere would you draw the boundary in your architecture?",
    };

    const quality = evaluator.evaluateStoryQualityScore(postWithTension);
    expect(quality.tension).toBeGreaterThanOrEqual(80);
    expect(quality.decisionQuality).toBeGreaterThanOrEqual(80);
  });

  it("6. Non-Literal STAR & Absence of Rigid Emoji Headers", () => {
    const formatted = storytellingAgent.formatDeveloperStory({
      title: testTopic.title,
      hook: "The database wasn't slow.",
      story: "1️⃣ Observation:\nWe were asking it the same question.",
      lesson: "3️⃣ Engineering Decision:\nCached key lookups.",
      actionableInsight: "p99 latency 38ms",
      cta: "What do you think?",
      hashtags: ["#Tech"],
      fullText: "1️⃣ Observation:\nThe database wasn't slow.\n\n2️⃣ Problem:\nWe were asking expensive queries.\n\nSituation:\nPostgreSQL load spike.",
    });

    expect(formatted.data.fullText).not.toContain("1️⃣ Observation:");
    expect(formatted.data.fullText).not.toContain("2️⃣ Problem:");
    expect(formatted.data.fullText).not.toContain("Situation:");
  });

  it("7. 10 Synthetic Examples — Verifies Structural Variety Across Topics", async () => {
    const topics: Topic[] = [
      { id: "s1", title: "Model Context Protocol (MCP) Tool Calling", category: "Agentic AI", score: 90, trend_velocity: 9, difficulty: "ADVANCED", competition: "LOW", audience: "AI Engineers", keywords: ["MCP"], supportingTech: [], reason: "", references: [] },
      { id: "s2", title: "Docker Buildx Rootless Hardening", category: "DevOps", score: 88, trend_velocity: 8.5, difficulty: "INTERMEDIATE", competition: "LOW", audience: "DevOps Engineers", keywords: ["Docker"], supportingTech: [], reason: "", references: [] },
      { id: "s3", title: "TypeScript 5.7 Project References", category: "TypeScript", score: 92, trend_velocity: 9, difficulty: "INTERMEDIATE", competition: "LOW", audience: "Frontend Leads", keywords: ["TypeScript"], supportingTech: [], reason: "", references: [] },
      { id: "s4", title: "Event-Driven SQS Queue Deduplication", category: "System Design", score: 85, trend_velocity: 8, difficulty: "ADVANCED", competition: "MEDIUM", audience: "Backend Engineers", keywords: ["AWS"], supportingTech: [], reason: "", references: [] },
      { id: "s5", title: "PostgreSQL B-Tree Index Bloat Debugging", category: "Database", score: 94, trend_velocity: 9.1, difficulty: "ADVANCED", competition: "MEDIUM", audience: "Database Engineers", keywords: ["PostgreSQL"], supportingTech: [], reason: "", references: [] },
      { id: "s6", title: "React 19 Server Actions & Optimistic UI", category: "React", score: 89, trend_velocity: 8.8, difficulty: "INTERMEDIATE", competition: "HIGH", audience: "Full Stack Engineers", keywords: ["React"], supportingTech: [], reason: "", references: [] },
      { id: "s7", title: "gRPC Streaming vs REST WebSockets", category: "Architecture", score: 91, trend_velocity: 8.9, difficulty: "ADVANCED", competition: "MEDIUM", audience: "System Architects", keywords: ["gRPC"], supportingTech: [], reason: "", references: [] },
      { id: "s8", title: "Kubernetes Pod Disruption Budgets", category: "Cloud", score: 87, trend_velocity: 8.2, difficulty: "ADVANCED", competition: "LOW", audience: "Site Reliability Engineers", keywords: ["Kubernetes"], supportingTech: [], reason: "", references: [] },
      { id: "s9", title: "LLM Cache-Augmented Generation (CAG)", category: "AI Engineering", score: 96, trend_velocity: 9.7, difficulty: "ADVANCED", competition: "LOW", audience: "AI Research Engineers", keywords: ["CAG"], supportingTech: [], reason: "", references: [] },
      { id: "s10", title: "OpenTelemetry Circuit Breaker Metrics", category: "Observability", score: 90, trend_velocity: 8.7, difficulty: "ADVANCED", competition: "LOW", audience: "Platform Engineers", keywords: ["OpenTelemetry"], supportingTech: [], reason: "", references: [] },
    ];

    const generatedTexts: string[] = [];

    for (const t of topics) {
      const res = await writer.generateContent(
        t,
        testResearch,
        testExperience,
        { primaryAudience: "Engineers", keyPainPoints: ["Latency"], secondaryAudience: "Architects", whyAudienceCares: "Reliability", toneRecommendation: "Technical" }
      );

      expect(res.success).toBe(true);
      const postText = res.data.linkedInPost.fullText;
      expect(postText.length).toBeGreaterThan(100);
      expect(postText).not.toContain("Situation:");
      expect(postText).not.toContain("Task:");
      expect(postText).not.toContain("1️⃣");
      generatedTexts.push(postText);
    }

    // Verify distinct text structures across synthetic examples
    const uniqueFirstLines = new Set(generatedTexts.map(t => t.split("\n")[0]));
    expect(uniqueFirstLines.size).toBeGreaterThanOrEqual(4);
  });

  it("8. Five-Day Consecutive Dry Run Verification", async () => {
    const dryRunTopics: Topic[] = [
      { id: "d1", title: "Day 1: AI Agent Retry Loops & Backpressure", category: "Agentic AI", score: 90, trend_velocity: 9, difficulty: "ADVANCED", competition: "LOW", audience: "AI Engineers", keywords: ["Agents"], supportingTech: [], reason: "", references: [] },
      { id: "d2", title: "Day 2: Multi-Model Gateway Failover Architecture", category: "System Design", score: 92, trend_velocity: 9.2, difficulty: "ADVANCED", competition: "LOW", audience: "System Architects", keywords: ["Gateway"], supportingTech: [], reason: "", references: [] },
      { id: "d3", title: "Day 3: PostgreSQL Lock Contention Under p99 Spikes", category: "Database", score: 94, trend_velocity: 9.5, difficulty: "ADVANCED", competition: "MEDIUM", audience: "Database Engineers", keywords: ["Postgres"], supportingTech: [], reason: "", references: [] },
      { id: "d4", title: "Day 4: DeepSeek R1 Rule-Based Reward Benchmarks", category: "AI Engineering", score: 95, trend_velocity: 9.6, difficulty: "ADVANCED", competition: "LOW", audience: "AI Researchers", keywords: ["DeepSeek"], supportingTech: [], reason: "", references: [] },
      { id: "d5", title: "Day 5: Building a Decoupled Event Bus in Monorepos", category: "Software Engineering", score: 89, trend_velocity: 8.7, difficulty: "INTERMEDIATE", competition: "LOW", audience: "Senior Developers", keywords: ["TypeScript"], supportingTech: [], reason: "", references: [] },
    ];

    const dryRunRecords: Array<{
      day: number;
      topic: string;
      hookType: string;
      storyMode: string;
      boredomScore: number;
      storyQuality: number;
    }> = [];

    for (let day = 1; day <= 5; day++) {
      const topic = dryRunTopics[day - 1];
      const res = await writer.generateContent(
        topic,
        testResearch,
        testExperience,
        { primaryAudience: "Senior Engineers", keyPainPoints: ["Scalability"], secondaryAudience: "Architects", whyAudienceCares: "Reliability", toneRecommendation: "Technical" },
        `dryrun_pipeline_${day}`
      );

      expect(res.success).toBe(true);
      const post = res.data.linkedInPost;
      const score = res.data.writingQualityScore;

      dryRunRecords.push({
        day,
        topic: topic.title,
        hookType: memoryTracker.getHistory(1)[0]?.hookType || "HOOK",
        storyMode: post.storyMode || "MODE",
        boredomScore: score.boredomScore?.overall || 0,
        storyQuality: score.storyQualityScore?.overall || 85,
      });
    }

    console.log("=== 5-DAY DRY RUN RESULTS ===");
    console.table(dryRunRecords);

    // Verify all 5 days selected distinct story modes
    const modesUsed = new Set(dryRunRecords.map(r => r.storyMode));
    expect(modesUsed.size).toBe(5);
  });
});

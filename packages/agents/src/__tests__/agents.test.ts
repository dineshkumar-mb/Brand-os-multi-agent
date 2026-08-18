import { describe, it, expect } from "vitest";
import {
  TopicIntelligenceAgent,
  ContentGapAgent,
  AudienceResearchAgent,
  PersonalBrandStrategyAgent,
  KnowledgeGraphAgent,
  ExperienceMiningAgent,
  HumanizationAgent,
  OriginalityAgent,
  SeoAndEngagementAgent,
  VisualPlanningAgent,
  ContinuousLearningAgent,
  DecisionGateAgent,
} from "../index";
import { HistoricalPostRecord, Platform, Topic } from "@brand-os/shared";

describe("17-Agent Personal Brand Intelligence System Unit Tests", () => {
  const sampleTopic: Topic = {
    id: "t1",
    title: "Model Context Protocol (MCP): Multi-Agent Architecture",
    category: "Agentic AI",
    framework: "MCP",
    supportingTech: ["TypeScript", "JSON-RPC"],
    score: 95,
    reason: "Surging trend",
    trend_velocity: 9.5,
    difficulty: "ADVANCED",
    competition: "MEDIUM",
    audience: "AI Engineers & Systems Architects",
    keywords: ["MCP", "Multi-Agent", "Tool Calling"],
    references: ["https://modelcontextprotocol.io"],
  };

  const samplePastPosts: HistoricalPostRecord[] = [
    {
      id: "p1",
      title: "React 19 Server Actions in Enterprise SaaS",
      platform: Platform.LINKEDIN,
      category: "React",
      framework: "React 19",
      supportingTech: ["Next.js"],
      keywords: ["React 19"],
      hook: "React 19 Server actions eliminate boilerplate...",
      fullText: "Full post about React 19...",
      publishedAt: new Date().toISOString(),
    },
    {
      id: "p2",
      title: "Decoupled Redis Streams Architecture",
      platform: Platform.DEVTO,
      category: "System Design",
      framework: "Redis",
      supportingTech: ["BullMQ"],
      keywords: ["Redis"],
      hook: "Scaling asynchronous message queues...",
      fullText: "Full post about Redis...",
      publishedAt: new Date().toISOString(),
    },
  ];

  it("TopicIntelligenceAgent should filter overused topics against 50 post history", () => {
    const agent = new TopicIntelligenceAgent(samplePastPosts);

    const overusedTopic: Topic = {
      ...sampleTopic,
      title: "React 19 Server Actions in Enterprise SaaS", // exact title match
      framework: "React 19",
      trend_velocity: 5.0,
      score: 70,
      references: [],
    };

    const evalResult = agent.evaluateTopics([overusedTopic, sampleTopic]);
    expect(evalResult.success).toBe(true);
    expect(evalResult.data.selectedTopic?.title).toBe(sampleTopic.title);
    expect(evalResult.data.rejectedTopics.length).toBeGreaterThan(0);
  });

  it("ContentGapAgent should detect underrepresented categories across 35+ categories", () => {
    const agent = new ContentGapAgent();
    const result = agent.analyzeGaps(samplePastPosts);
    expect(result.success).toBe(true);
    expect(result.data.underrepresentedCategories.length).toBeGreaterThan(20);
  });

  it("AudienceResearchAgent should identify primary persona and pain points", () => {
    const agent = new AudienceResearchAgent();
    const result = agent.analyzeAudience(sampleTopic);
    expect(result.success).toBe(true);
    expect(result.data.primaryAudience).toBe("AI Engineers");
    expect(result.data.keyPainPoints.length).toBeGreaterThan(0);
  });

  it("PersonalBrandStrategyAgent should verify alignment with Full Stack AI Engineer identity", () => {
    const agent = new PersonalBrandStrategyAgent();
    const result = agent.evaluateBrandStrategy(sampleTopic);
    expect(result.success).toBe(true);
    expect(result.data.brandAlignmentPassed).toBe(true);
    expect(result.data.keyPillarsReinforced).toContain("Production-Ready AI Systems");
  });

  it("KnowledgeGraphAgent should map concept nodes and relationships", () => {
    const agent = new KnowledgeGraphAgent();
    const result = agent.mapConceptGraph(sampleTopic);
    expect(result.success).toBe(true);
    expect(result.data.conceptName).toBe("Model Context Protocol (MCP)");
    expect(result.data.relatedConcepts).toContain("Tool Calling");
  });

  it("ExperienceMiningAgent should extract authentic production narratives when log matches", () => {
    const sampleLog = {
      id: "exp_1",
      title: "MCP Architecture",
      category: "Agentic AI",
      description: "Built MCP server for agent tool calling.",
      technologiesUsed: ["MCP", "TypeScript"],
      challengesFaced: ["Schema validation overhead"],
      solutionApproach: "Standardized JSON-RPC contracts.",
      metricsOrOutcome: "Reduced serialization latency by 40%.",
      keyLessons: ["Schema discipline"],
      tradeoffs: ["Boilerplate vs safety"],
      createdAt: new Date().toISOString(),
    };
    const agent = new ExperienceMiningAgent([sampleLog]);
    const result = agent.mineExperience(sampleTopic);
    expect(result.success).toBe(true);
    expect(result.data.foundMatch).toBe(true);
    expect(result.data.quantifiableOutcome).toBeDefined();
  });

  it("HumanizationAgent should remove AI clichés", () => {
    const agent = new HumanizationAgent();
    const testPost = {
      title: "Test",
      hook: "In today's fast-paced world, let's dive in to unlock the power of game-changing MCP.",
      story: "Authentic production story.",
      lesson: "Clean architecture.",
      actionableInsight: "Bullet 1",
      cta: "What do you think?",
      hashtags: ["#AI"],
      fullText: "In today's fast-paced world, let's dive in to unlock the power of game-changing MCP.",
    };

    const result = agent.sanitize(testPost);
    expect(result.success).toBe(true);
    expect(result.data.clichésRemoved).toBeGreaterThan(0);
    expect(result.data.post.fullText).not.toContain("In today's fast-paced world");
  });

  it("OriginalityAgent should enforce maximum similarity threshold of 0.35", () => {
    const agent = new OriginalityAgent(samplePastPosts);
    const uniquePost = {
      title: "Completely Unique Title on MCP Architecture",
      hook: "Unique hook about multi-agent tool calling.",
      story: "Story",
      lesson: "Lesson",
      actionableInsight: "Insight",
      cta: "Discussion",
      hashtags: ["#AI"],
      fullText: "Unique text about MCP agent tool execution isolation boundaries in Node.js runtime environments.",
    };

    const result = agent.evaluateOriginality(uniquePost);
    expect(result.success).toBe(true);
    expect(result.data.overallSimilarityScore).toBeLessThanOrEqual(0.35);
  });

  it("SeoAndEngagementAgent should generate Dev.to SEO frontmatter and canonical URL", () => {
    const agent = new SeoAndEngagementAgent();
    const post = {
      title: sampleTopic.title,
      hook: "Hook",
      story: "Story",
      lesson: "Lesson",
      actionableInsight: "Insight",
      cta: "What is your approach?",
      hashtags: ["#AI"],
      fullText: "Full post text...",
    };
    const article = {
      title: sampleTopic.title,
      published: true,
      description: "Description",
      tags: ["mcp"],
      markdownContent: "Markdown...",
      canonicalUrl: "https://brand-os-multi-agent.vercel.app/blog/mcp",
    };

    const result = agent.optimize(sampleTopic, post, article);
    expect(result.success).toBe(true);
    expect(result.data.devToMeta.canonicalUrl).toContain("/blog/mcp");
  });

  it("VisualPlanningAgent should create technical architecture visual blueprint and validate alignment", () => {
    const agent = new VisualPlanningAgent();
    const result = agent.createVisualPlan(sampleTopic);
    expect(result.success).toBe(true);
    expect(result.data.visualCategory).toBe("AI_AGENTS");
    expect(result.data.imagePrompt).toContain("16:9 technical architecture blueprint");

    const validation = agent.validateVisualAlignment(sampleTopic, result.data);
    expect(validation.success).toBe(true);
    expect(validation.data.alignedWithArticle).toBe(true);
  });

  it("ContinuousLearningAgent should compute quality score and career impact metrics", () => {
    const agent = new ContinuousLearningAgent();
    const result = agent.analyzeEngagementTelemetry(samplePastPosts);
    expect(result.success).toBe(true);
    expect(result.data.engagementQualityScore).toBeGreaterThanOrEqual(0);
    expect(result.data.careerTelemetry.recruiterInteractions).toBeGreaterThanOrEqual(0);
    expect(result.data.careerImpactScore).toBeGreaterThanOrEqual(0);
  });

  it("DecisionGateAgent should require all 10 quality gates before approving for publishing", () => {
    const agent = new DecisionGateAgent();

    const post = {
      title: sampleTopic.title,
      hook: "Scroll stopping developer hook",
      story: "Observation",
      lesson: "Decision",
      actionableInsight: "Takeaways",
      cta: "What is your approach?",
      hashtags: ["#AI"],
      fullText: "Full formatted text explaining production system architecture, scaling bottlenecks, and key trade-offs in detail...",
    };
    const article = {
      title: sampleTopic.title,
      published: true,
      description: "Description",
      tags: ["mcp"],
      markdownContent: "Markdown...",
      canonicalUrl: "https://brand-os-multi-agent.vercel.app/blog/mcp",
    };
    const originality = {
      passed: true,
      overallSimilarityScore: 0.15,
      breakdown: { titleSimilarity: 0.1, hookSimilarity: 0.1, technologyOverlap: 0, ctaSimilarity: 0, structureSimilarity: 0.1 },
      rejectionReasons: [],
    };
    const techReview = { syntaxValid: true, frameworkVersionValid: true, tradeoffsAddressed: true, securityChecksPassed: true, credibilityGatePassed: true, evidenceAuthenticityScore: 95, accuracyScore: 95, passed: true, reviewNotes: [] };
    const visualValidation = { alignedWithArticle: true, alignmentScore: 95, categoryMatch: true, logoAccuracyPassed: true, feedbackNotes: [] };

    const result = agent.evaluateDecision(sampleTopic, post, article, originality, techReview, visualValidation, 0);
    expect(result.success).toBe(true);
    expect(result.data.approvedForPublishing).toBe(true);
    expect(result.data.decision).toBe("PUBLISH");
  });
});

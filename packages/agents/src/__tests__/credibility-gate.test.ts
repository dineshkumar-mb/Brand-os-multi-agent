import { describe, it, expect } from "vitest";
import {
  TechnicalReviewerAgent,
  ExperienceMiningAgent,
  EngineeringReasoningAgent,
  WritingQualityEvaluator,
  DecisionGateAgent,
} from "../index";
import { Topic, ResearchOutput, HistoricalPostRecord, Platform, STARStory, StoryMode } from "@brand-os/shared";

describe("Technical Credibility Gate & 7-Dimension Scoring Unit Tests", () => {
  const reviewer = new TechnicalReviewerAgent();
  const experienceAgent = new ExperienceMiningAgent();
  const reasoningAgent = new EngineeringReasoningAgent();
  const evaluator = new WritingQualityEvaluator();
  const decisionGate = new DecisionGateAgent();

  const testTopic: Topic = {
    id: "t_credibility_1",
    title: "Model Context Protocol (MCP) Tool Specifications",
    category: "Agentic AI",
    framework: "MCP",
    supportingTech: ["TypeScript", "JSON-RPC"],
    score: 95,
    reason: "Surging trend",
    trend_velocity: 9.5,
    difficulty: "ADVANCED",
    competition: "MEDIUM",
    audience: "AI Engineers",
    keywords: ["MCP", "JSON-RPC"],
    references: ["https://modelcontextprotocol.io"],
  };

  const testResearch: ResearchOutput = {
    topicId: "t_credibility_1",
    summary: "MCP standardizes client-server tool definitions using JSON-RPC schemas.",
    key_insights: [
      "JSON-RPC 2.0 schemas ensure type safety across language bindings.",
      "Decoupled server tools improve AI agent security boundaries."
    ],
    pros: ["Standardized interfaces"],
    cons: ["RPC serialization overhead"],
    future_outlook: "Widespread MCP ecosystem adoption.",
    code_snippets: [
      {
        language: "json",
        code: `{"jsonrpc": "2.0", "method": "tools/list"}`,
        description: "List tools JSON-RPC payload"
      }
    ],
    statistics: [],
    citations: [{ title: "MCP Spec", url: "https://modelcontextprotocol.io", source: "Official Docs" }],
  };

  it("1. Experience Mining — Switches to EXPLORED_RESEARCH mode when no experience log matches", () => {
    const minedRes = experienceAgent.mineExperience(testTopic);
    expect(minedRes.success).toBe(true);
    expect(minedRes.data.foundMatch).toBe(false);
    expect(minedRes.data.realWorldProblem).toBeUndefined();
    expect(minedRes.data.quantifiableOutcome).toBeUndefined();
    expect(minedRes.data.projectContext).toContain("Technical research & architectural exploration");
  });

  it("2. Credibility Gate — Rejects unsupported first-person build claims when foundMatch is false", () => {
    const unsupportedText = `I built a production microservice with our engineering team using event buses and benchmarked 500k ops/sec.`;
    const noExp = { foundMatch: false, projectContext: "Exploration" };

    const reviewRes = reviewer.auditTechnicalContent(unsupportedText, testResearch, noExp as any);
    expect(reviewRes.data.credibilityGatePassed).toBe(false);
    expect(reviewRes.data.evidenceAuthenticityScore).toBeLessThan(70);
    expect(reviewRes.data.credibilityDetails?.firstPersonClaimsVerified).toBe(false);
    expect(reviewRes.data.credibilityDetails?.unsupportedClaimsCount).toBeGreaterThan(0);
  });

  it("3. Benchmark Claims Protocol — Flags 'I benchmarked' without baseline/metrics for rewrite", () => {
    const textWithoutMetrics = `I benchmarked MCP server responses vs custom REST endpoints.`;
    const noExp = { foundMatch: false, projectContext: "Exploration" };

    const reviewRes = reviewer.auditTechnicalContent(textWithoutMetrics, testResearch, noExp as any);
    expect(reviewRes.data.credibilityDetails?.benchmarkClaimsVerified).toBe(false);
    expect(reviewRes.data.credibilityDetails?.suggestedRewrites[0].suggested).toBe("I explored");
  });

  it("4. Engineering Reasoning — Generates exploratory STAR story without synthetic p99 metrics when hasBuildMatch is false", async () => {
    const noExp = { foundMatch: false, projectContext: "Exploration" };
    const starRes = await reasoningAgent.generateSTARStory(testTopic, testResearch, noExp as any, StoryMode.DECISION_STORY);

    expect(starRes.success).toBe(true);
    const star: STARStory = starRes.data.starStory;
    expect(star.situation.context).not.toContain("our production team");
    expect(star.result.evidence[0]).not.toContain("Production telemetry log");
  });

  it("5. Hard Rule Enforcement — DecisionGate REJECTS post if Evidence / Authenticity < 70 regardless of total score", () => {
    const mockPost = {
      title: "MCP Integration",
      hook: "Evaluating MCP tool contracts",
      fullText: "I built an enterprise event bus microservice...",
      cta: "What are your thoughts on MCP?",
      writingQualityScore: {
        clarity: 90,
        technicalDepth: 85,
        seniority: 80,
        authenticity: 40,
        originality: 90,
        narrativeQuality: 85,
        evidenceQuality: 50,
        readability: 85,
        careerSignal: 80,
        discussionPotential: 80,
        aiClicheScore: 90,
        evidenceAuthenticityScore: 50, // < 70 HARD RULE VIOLATION
        personalExperienceScore: 50,
        engineeringDepthScore: 80,
        storytellingScore: 80,
        recruiterValueScore: 80,
        engagementPotentialScore: 80,
        weightedTotalScore: 68,
        overall: 68,
      },
    };

    const mockArticle = {
      title: "MCP Integration",
      description: "Devto article description",
      tags: ["mcp", "typescript"],
      markdownContent: "# MCP",
    };

    const mockTechReview = {
      passed: true,
      accuracyScore: 90,
      syntaxValid: true,
      frameworkVersionValid: true,
      tradeoffsAddressed: true,
      securityChecksPassed: true,
      credibilityGatePassed: false,
      evidenceAuthenticityScore: 50,
      reviewNotes: ["Credibility score < 70"],
    };

    const mockOriginality = {
      passed: true,
      overallSimilarityScore: 0.1,
      lexicalSimilarity: 0.1,
      semanticSimilarity: 0.1,
    };

    const mockVisual = {
      alignedWithArticle: true,
      alignmentScore: 90,
      categoryMatch: true,
      logoAccuracyPassed: true,
      feedbackNotes: [],
    };

    const decisionRes = decisionGate.evaluateDecision(
      testTopic,
      mockPost as any,
      mockArticle as any,
      mockOriginality as any,
      mockTechReview as any,
      mockVisual as any,
      0
    );

    expect(decisionRes.data.approvedForPublishing).toBe(false);
    expect(decisionRes.data.decision).toBe("REJECT");
    expect(decisionRes.data.rejectionReasons.some((r) => r.includes("Technical Credibility Gate"))).toBe(true);
  });
});

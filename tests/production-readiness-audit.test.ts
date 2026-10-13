import { describe, it, expect, vi } from "vitest";
import {
  linkedinAnalyticsIntelligenceAgent,
  evaluateSampleSizeSignal,
  convertHistoryToAnalyticsData,
  skillEvidenceRegistry,
  agentOrchestrator,
} from "../packages/agents/src/index";
import { candidateCompetitionEngine } from "../packages/intelligence/src/ranking/candidate-competition-engine";
import { scheduleConfig } from "../packages/scheduler/src/index";
import { LinkedInPublisherAdapter, MissingAccessTokenError } from "../packages/publisher/src/index";
import { Platform, PublishMode } from "../packages/shared/src/index";

describe("Production Readiness Audit Test Suite", () => {
  describe("1. LinkedIn Analytics Intelligence Feedback Loop", () => {
    it("should classify sample-size signals accurately", () => {
      expect(evaluateSampleSizeSignal(0)).toBe("INSUFFICIENT_DATA");
      expect(evaluateSampleSizeSignal(2)).toBe("INSUFFICIENT_DATA");
      expect(evaluateSampleSizeSignal(3)).toBe("EXPERIMENTAL_SIGNAL");
      expect(evaluateSampleSizeSignal(4)).toBe("EXPERIMENTAL_SIGNAL");
      expect(evaluateSampleSizeSignal(5)).toBe("STRATEGY_SIGNAL");
      expect(evaluateSampleSizeSignal(9)).toBe("STRATEGY_SIGNAL");
      expect(evaluateSampleSizeSignal(10)).toBe("PERSISTENT_PATTERN");
      expect(evaluateSampleSizeSignal(25)).toBe("PERSISTENT_PATTERN");
    });

    it("should convert historical post records preserving nulls without data fabrication", () => {
      const mockHistory = [
        {
          id: "hist_1",
          title: "Diagnosing V8 GC Pressure in Node.js",
          fullText: "Full post text on GC pressure",
          category: "SYSTEM_DESIGN",
          framework: "Node.js",
          hook: "The memory profile showed 2GB leaks",
          publishedAt: "2026-10-10T09:00:00.000Z",
          platform: Platform.LINKEDIN,
          supportingTech: ["Node.js", "V8"],
          keywords: ["GC", "Node.js"],
        },
      ];

      const analyticsData = convertHistoryToAnalyticsData(mockHistory as any);
      expect(analyticsData).toHaveLength(1);
      expect(analyticsData[0].postId).toBe("hist_1");
      expect(analyticsData[0].impressions).toBeNull(); // Missing metric remains null
      expect(analyticsData[0].likes).toBeNull();
      expect(analyticsData[0].comments).toBeNull();
    });

    it("should generate strategy adjustments and pass them to candidate competition", async () => {
      const mockAnalyticsDecision = {
        analysisId: "test_analytics_001",
        confidence: 85,
        sampleSize: 8,
        sampleSizeSignal: "STRATEGY_SIGNAL" as const,
        topicWeightAdjustments: { "SYSTEM_DESIGN": 0.15 },
        topicPenalties: { "AI Engineering": -0.20 },
        cooldownExtensionDays: { "Docker": 10 },
        recommendedFormat: "ARCHITECTURE_DECISION",
        recommendedVisualType: "ARCHITECTURE_DIAGRAM",
        fatigue: {
          technologyFatigue: 20,
          topicFatigue: 15,
          hookFatigue: 10,
          visualFatigue: 10,
          formatFatigue: 10,
          explanations: [],
        },
      };

      const result = await candidateCompetitionEngine.collectAndRankCandidates([], mockAnalyticsDecision);
      expect(result.rawCount).toBeGreaterThan(0);
      expect(result.allEvaluatedCandidates.length).toBeGreaterThan(0);

      // Verify that candidate records incorporate recruiter attraction and scores
      const candidate = result.allEvaluatedCandidates[0];
      expect(candidate.scores.recruiterAttraction).toBeGreaterThan(0);
      expect(candidate.scores.recruiterAttraction).toBeLessThanOrEqual(100);
      expect(candidate.recruiterAttractionScore).toBe(candidate.scores.recruiterAttraction);
    }, 30000);
  });

  describe("2. Twice-Weekly Scheduler & Timezone Verification", () => {
    it("should confirm the schedule is twice weekly on weekdays in Asia/Kolkata", () => {
      const cfg = scheduleConfig.getConfig();
      expect(cfg.generationDays).toEqual(["TUESDAY", "THURSDAY"]);
      expect(cfg.generationTime).toBe("09:00");
      expect(cfg.timezone).toBe("Asia/Kolkata");
    });

    it("should never schedule on Saturday or Sunday", () => {
      const saturday = new Date("2026-10-17T09:00:00.000Z"); // Saturday
      const sunday = new Date("2026-10-18T09:00:00.000Z");   // Sunday
      expect(scheduleConfig.isWeekend(saturday)).toBe(true);
      expect(scheduleConfig.isWeekend(sunday)).toBe(true);
      expect(scheduleConfig.isScheduledDay(saturday)).toBe(false);
      expect(scheduleConfig.isScheduledDay(sunday)).toBe(false);
    });

    it("should generate idempotency keys and prevent duplicate runs on the same calendar slot", () => {
      const date = new Date("2026-10-13T09:00:00.000Z");
      const key = scheduleConfig.getIdempotencyKey(date);
      expect(key).toBe("career-brand-os:2026-10-13:scheduled-run");

      const mockHistory = [
        { timestamp: "2026-10-13T09:01:00.000Z", status: "SUCCESS" },
      ];
      expect(scheduleConfig.hasDuplicateRun(mockHistory, date)).toBe(true);

      const nextDay = new Date("2026-10-15T09:00:00.000Z");
      expect(scheduleConfig.hasDuplicateRun(mockHistory, nextDay)).toBe(false);
    });
  });

  describe("3. Skill Evidence Registry & Recruiter Attraction Scoring", () => {
    it("should evaluate 10-dimension RecruiterAttractionScore (0-100)", () => {
      const result = skillEvidenceRegistry.evaluateRecruiterAttraction({
        title: "Architecting Resilient Multi-Provider LLM Gateway with Cost Optimization",
        category: "AI_ENGINEERING",
        framework: "LangChain",
        tags: ["LLM", "RAG", "System Design"],
        problem: "Provider rate limits and catastrophic downtime",
        evidenceCount: 1,
        hasTradeoffs: true,
      });

      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.breakdown.skillEvidence).toBeGreaterThanOrEqual(70);
      expect(result.breakdown.roleRelevance).toBeGreaterThanOrEqual(80);
      expect(result.breakdown.technicalDepth).toBeGreaterThanOrEqual(80);
      expect(result.breakdown.problemSolving).toBeGreaterThanOrEqual(80);
      expect(result.breakdown.engineeringJudgment).toBeGreaterThanOrEqual(80);
      expect(result.breakdown.portfolioValue).toBeGreaterThanOrEqual(70);
      expect(result.breakdown.differentiation).toBeGreaterThanOrEqual(75);
      expect(result.rationale).toContain("Demonstrates");
    });

    it("should maintain rolling skill coverage matrix across target categories", () => {
      const history = [
        { title: "React 19 State Machines", category: "FRONTEND", publishedAt: "2026-10-01T09:00:00.000Z" },
        { title: "Building Multi-Agent Swarm", category: "AI_ENGINEERING", publishedAt: "2026-10-05T09:00:00.000Z" },
      ];

      const matrix = skillEvidenceRegistry.getSkillCoverageMatrix(history);
      expect(matrix).toHaveLength(6);
      const fe = matrix.find((m) => m.category === "FRONTEND");
      expect(fe?.recentCount).toBe(1);
      const be = matrix.find((m) => m.category === "BACKEND");
      expect(be?.status).toBe("UNDERREPRESENTED");
    });
  });

  describe("4. LinkedIn Publisher Mode & Security Verification", () => {
    it("should reject LIVE publish mode immediately if access token is missing", async () => {
      const publisher = new LinkedInPublisherAdapter();
      const originalToken = process.env.LINKEDIN_ACCESS_TOKEN;
      delete process.env.LINKEDIN_ACCESS_TOKEN;

      try {
        await expect(
          publisher.publishPost({ title: "Test", fullText: "Test post text" }, { mode: PublishMode.LIVE })
        ).rejects.toThrow(MissingAccessTokenError);
      } finally {
        if (originalToken) process.env.LINKEDIN_ACCESS_TOKEN = originalToken;
      }
    });

    it("should safely operate in SIMULATION mode without calling real external APIs", async () => {
      const publisher = new LinkedInPublisherAdapter();
      const res = await publisher.publishPost(
        { title: "Test Architecture Breakdown", fullText: "Evaluating decoupled state engines" },
        { mode: PublishMode.SIMULATION }
      );

      expect(res.success).toBe(true);
      expect(res.mode).toBe("SIMULATION");
      expect(res.externalId).toMatch(/^urn:li:share:\d+/);
    });
  });
});

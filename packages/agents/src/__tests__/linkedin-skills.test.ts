import { describe, it, expect } from "vitest";
import {
  HookEngine,
  LinkedInAlgorithmAuditor,
  LinkedInCommentDrafterAgent,
  DecisionGateAgent,
} from "../index";
import {
  Topic,
  LinkedInPostPayload,
  DevToArticlePayload,
  HookType,
  LinkedInAlgorithmAuditResult,
} from "@brand-os/shared";

describe("LinkedIn Skills & Growth Engineering Unit Tests", () => {
  const sampleTopic: Topic = {
    id: "t_mcp_pubsub",
    title: "Decoupled Redis Streams Pub/Sub in Multi-Agent Swarms",
    category: "Distributed Systems",
    framework: "Redis",
    supportingTech: ["TypeScript", "BullMQ", "Node.js"],
    score: 95,
    reason: "Critical multi-agent orchestration architecture",
    trend_velocity: 9.2,
    difficulty: "ADVANCED",
    competition: "LOW",
    audience: "Senior Systems & AI Engineers",
    keywords: ["Redis Streams", "Pub/Sub", "Multi-Agent", "Event Bus"],
    references: ["https://redis.io"],
  };

  const validPostText = `We routed 1.2M messages/sec through a multi-agent swarm using Redis Streams.

Here is the exact architecture decision that cut end-to-end latency by 74%:

In traditional HTTP agent pipelines, agent-to-agent sync calls create cascading timeouts when a downstream agent stalls.

We refactored our agent bus:
1. Every agent emits decoupled events to Redis Streams.
2. Background worker pools consume stream events asynchronously.

The trade-off? Memory usage increased by 14%, but catastrophic pipeline backpressure dropped to 0%.

What message bus pattern does your agent swarm use in production?

#DistributedSystems #Redis #SystemDesign #MultiAgent`;

  const samplePost: LinkedInPostPayload = {
    title: sampleTopic.title,
    hook: "We routed 1.2M messages/sec through a multi-agent swarm using Redis Streams.",
    story: "In traditional HTTP agent pipelines, cascading timeouts were killing performance.",
    lesson: "Decoupled event streams isolate failures across worker nodes.",
    actionableInsight: "Use Redis Streams consumer groups for zero-loss message processing.",
    fullText: validPostText,
    cta: "What message bus pattern does your agent swarm use in production?",
    hashtags: ["#DistributedSystems", "#Redis", "#SystemDesign", "#MultiAgent"],
  };

  const sampleArticle: DevToArticlePayload = {
    title: sampleTopic.title,
    published: false,
    tags: ["redis", "architecture", "multiagent"],
    description: "Detailed system design guide for Redis stream pub/sub.",
    mainImage: "",
    markdownContent: "# Decoupled Redis Streams\n\nFull architecture breakdown.",
  };

  // ==========================================
  // 1. HOOK ENGINE TESTS (16 FORMULAS)
  // ==========================================
  describe("HookEngine (16 Tested Viral Hook Formulas)", () => {
    const hookEngine = new HookEngine();

    it("should generate non-empty hooks for all 16 viral hook formulas", () => {
      const allFormulas = Object.values(HookType);
      expect(allFormulas.length).toBeGreaterThanOrEqual(16);

      for (const formula of allFormulas) {
        const hookText = hookEngine.generateHook(formula, sampleTopic, false);
        expect(hookText).toBeDefined();
        expect(hookText.length).toBeGreaterThan(15);
      }
    });

    it("should generate metric breakdown hook with concrete numerical claims", () => {
      const metricHook = hookEngine.generateHook(HookType.METRIC_BREAKDOWN, sampleTopic, false);
      expect(metricHook).toMatch(/10M|surprised|telemetry|benchmarked/i);
    });

    it("should generate architectural paradox hook contrasting naive vs production design", () => {
      const paradoxHook = hookEngine.generateHook(HookType.ARCHITECTURAL_PARADOX, sampleTopic, false);
      expect(paradoxHook).toContain("synchronous execution");
    });

    it("should select the best hook and return valid metadata", () => {
      const selection = hookEngine.selectBestHook(sampleTopic);
      expect(selection.selectedHook).toBeDefined();
      expect(selection.selectedHook.length).toBeGreaterThan(10);
      expect(Object.values(HookType)).toContain(selection.hookType);
    });
  });

  // ==========================================
  // 2. LINKEDIN ALGORITHM AUDITOR TESTS
  // ==========================================
  describe("LinkedInAlgorithmAuditor (Pre-Publish Reach & Penalty Auditor)", () => {
    const auditor = new LinkedInAlgorithmAuditor();

    it("should pass a perfectly optimized LinkedIn technical post", () => {
      const res = auditor.auditPostForAlgorithm(samplePost, "test_pl_1");
      expect(res.success).toBe(true);
      expect(res.data.passed).toBe(true);
      expect(res.data.score).toBeGreaterThanOrEqual(85);
      expect(res.data.seeMoreFoldPassed).toBe(true);
      expect(res.data.hasLinkPenaltyHazard).toBe(false);
      expect(res.data.paragraphSpacingPassed).toBe(true);
      expect(res.data.hashtagCountPassed).toBe(true);
      expect(res.data.characterLengthPassed).toBe(true);
      expect(res.data.rejectionReasons.length).toBe(0);
    });

    it("should reject post with external URL in body due to -40-60% reach penalty hazard", () => {
      const postWithLink: LinkedInPostPayload = {
        ...samplePost,
        fullText: `${samplePost.fullText}\n\nCheck out the repo here: https://github.com/my-org/redis-swarm`,
      };

      const res = auditor.auditPostForAlgorithm(postWithLink, "test_pl_2");
      expect(res.data.passed).toBe(false);
      expect(res.data.hasLinkPenaltyHazard).toBe(true);
      expect(res.data.externalUrlsFound).toContain("https://github.com/my-org/redis-swarm");
      expect(res.data.rejectionReasons.some((r: string) => r.includes("External Link Hazard"))).toBe(true);
      expect(res.data.suggestions.some((s: string) => s.includes("Move external links"))).toBe(true);
    });

    it("should flag post when first line exceeds mobile see-more fold threshold (>210 chars)", () => {
      const longHook = "a".repeat(215) + "\n\nSecond paragraph text starts here.";
      const postWithLongHook: LinkedInPostPayload = {
        ...samplePost,
        fullText: longHook,
      };

      const res = auditor.auditPostForAlgorithm(postWithLongHook, "test_pl_3");
      expect(res.data.seeMoreFoldPassed).toBe(false);
      expect(res.data.firstLineCharCount).toBe(215);
      expect(res.data.suggestions.some((s: string) => s.includes("Mobile See-More Fold Notice"))).toBe(true);
    });

    it("should flag wall-of-text paragraph spacing (>3 lines without blank line break)", () => {
      const wallOfText = `Line 1: We refactored our system architecture last week.
Line 2: The memory pool was experiencing heavy GC pauses under peak traffic load.
Line 3: Node workers were failing health checks every 45 minutes predictably.
Line 4: Monolithic thread blocking prevented asynchronous I/O completion.
Line 5: Adding worker threads fixed the concurrency bottleneck completely.

Short closing statement.

#SystemDesign #Architecture #Nodejs`;

      const postWithWallOfText: LinkedInPostPayload = {
        ...samplePost,
        fullText: wallOfText,
      };

      const res = auditor.auditPostForAlgorithm(postWithWallOfText, "test_pl_4");
      expect(res.data.paragraphSpacingPassed).toBe(false);
      expect(res.data.maxParagraphLines).toBeGreaterThanOrEqual(5);
      expect(res.data.suggestions.some((s: string) => s.includes("Add double line breaks"))).toBe(true);
    });

    it("should flag excessive hashtag count (>5 hashtags)", () => {
      const postWithManyTags: LinkedInPostPayload = {
        ...samplePost,
        hashtags: ["#DevOps", "#Backend", "#Engineering", "#Software", "#Coding", "#TypeScript", "#Tech"],
        fullText: `${validPostText}\n\n#DevOps #Backend #Engineering #Software #Coding #TypeScript #Tech`,
      };

      const res = auditor.auditPostForAlgorithm(postWithManyTags, "test_pl_5");
      expect(res.data.hashtagCountPassed).toBe(false);
      expect(res.data.hashtagCount).toBe(7);
      expect(res.data.rejectionReasons.some((r: string) => r.includes("Excessive Hashtags"))).toBe(true);
    });
  });

  // ==========================================
  // 3. LINKEDIN COMMENT DRAFTER TESTS
  // ==========================================
  describe("LinkedInCommentDrafterAgent (Engagement & Reply Engine)", () => {
    const commentDrafter = new LinkedInCommentDrafterAgent();

    it("should draft first-comment additions across 4 distinct angles", () => {
      const angles: Array<"TECHNICAL_COUNTEREXAMPLE" | "TELEMETRY_INSIGHT" | "TRADEOFF_QUESTION" | "REINFORCE_EXPERIENCE"> = [
        "TECHNICAL_COUNTEREXAMPLE",
        "TELEMETRY_INSIGHT",
        "TRADEOFF_QUESTION",
        "REINFORCE_EXPERIENCE",
      ];

      for (const angle of angles) {
        const commentRes = commentDrafter.draftComment(samplePost.fullText, angle, "Senior Systems Engineers");
        expect(commentRes.success).toBe(true);
        expect(commentRes.data.commentText).toBeDefined();
        expect(commentRes.data.commentText.length).toBeGreaterThan(30);
        expect(commentRes.data.angle).toBe(angle);
      }
    });

    it("should draft thoughtful, technical replies to incoming developer comments", () => {
      const incomingComment = "How do you handle message ordering and node failures in Redis Streams when a consumer crashes mid-transaction?";
      const replyRes = commentDrafter.draftReply(incomingComment, sampleTopic.title);

      expect(replyRes.success).toBe(true);
      expect(replyRes.data.commentText.length).toBeGreaterThan(30);
    });
  });

  // ==========================================
  // 4. DECISION GATE INTEGRATION (GATE 14)
  // ==========================================
  describe("DecisionGateAgent Integration (Gate 14 - LinkedIn Algorithm Auditor)", () => {
    const decisionGate = new DecisionGateAgent();

    it("should pass Gate 14 when LinkedIn algorithm audit succeeds", () => {
      const mockOriginality = { passed: true, overallSimilarityScore: 0.15 } as any;
      const mockTechReview = { passed: true, accuracyScore: 95, credibilityGatePassed: true } as any;
      const mockVisualValidation = { alignedWithArticle: true, alignmentScore: 90 } as any;
      const mockImageRelevance = { passed: true, relevanceScore: 90 } as any;
      const mockPostDeduplication = { passed: true, overallSimilarityScore: 0.10 } as any;

      const mockAlgorithmPassed: LinkedInAlgorithmAuditResult = {
        passed: true,
        score: 95,
        seeMoreFoldPassed: true,
        firstLineCharCount: 85,
        hasLinkPenaltyHazard: false,
        externalUrlsFound: [],
        paragraphSpacingPassed: true,
        maxParagraphLines: 3,
        hashtagCountPassed: true,
        hashtagCount: 3,
        characterLengthPassed: true,
        characterCount: 950,
        rejectionReasons: [],
        suggestions: [],
      };

      const res = decisionGate.evaluateDecision(
        sampleTopic,
        samplePost,
        sampleArticle,
        mockOriginality,
        mockTechReview,
        mockVisualValidation,
        0,
        "test_pl_gate14_pass",
        mockImageRelevance,
        mockPostDeduplication,
        mockAlgorithmPassed
      );

      expect(res.data.approvedForPublishing).toBe(true);
      expect(res.data.gateCheckResults.linkedinAlgorithmPassed).toBe(true);
    });

    it("should fail Gate 14 and block publishing when LinkedIn algorithm audit fails", () => {
      const mockOriginality = { passed: true, overallSimilarityScore: 0.15 } as any;
      const mockTechReview = { passed: true, accuracyScore: 95, credibilityGatePassed: true } as any;
      const mockVisualValidation = { alignedWithArticle: true, alignmentScore: 90 } as any;
      const mockImageRelevance = { passed: true, relevanceScore: 90 } as any;
      const mockPostDeduplication = { passed: true, overallSimilarityScore: 0.10 } as any;

      const mockAlgorithmFailed: LinkedInAlgorithmAuditResult = {
        passed: false,
        score: 45,
        seeMoreFoldPassed: true,
        firstLineCharCount: 85,
        hasLinkPenaltyHazard: true,
        externalUrlsFound: ["https://github.com/some/repo"],
        paragraphSpacingPassed: true,
        maxParagraphLines: 3,
        hashtagCountPassed: true,
        hashtagCount: 3,
        characterLengthPassed: true,
        characterCount: 950,
        rejectionReasons: ["Gate 14 Failure: External URL penalty hazard."],
        suggestions: ["Move URL to first comment."],
      };

      const res = decisionGate.evaluateDecision(
        sampleTopic,
        samplePost,
        sampleArticle,
        mockOriginality,
        mockTechReview,
        mockVisualValidation,
        0,
        "test_pl_gate14_fail",
        mockImageRelevance,
        mockPostDeduplication,
        mockAlgorithmFailed
      );

      expect(res.data.approvedForPublishing).toBe(false);
      expect(res.data.gateCheckResults.linkedinAlgorithmPassed).toBe(false);
      expect(res.data.rejectionReasons.some((r: string) => r.includes("Gate 14 Failure"))).toBe(true);
    });
  });
});

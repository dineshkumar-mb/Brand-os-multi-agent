import { describe, it, expect } from "vitest";
import {
  ImageRelevanceVerificationAgent,
  PostHistoryDeduplicationAgent,
  DecisionGateAgent,
} from "../index";
import {
  Topic,
  LinkedInPostPayload,
  DevToArticlePayload,
  HistoricalPostRecord,
  Platform,
  VisualPlanBlueprint,
} from "@brand-os/shared";

describe("ImageRelevanceVerificationAgent & PostHistoryDeduplicationAgent Unit Tests", () => {
  const sampleTopic: Topic = {
    id: "t_react19",
    title: "React 19 Server Actions in Enterprise SaaS",
    category: "React",
    framework: "React 19",
    supportingTech: ["Next.js", "TypeScript"],
    score: 92,
    reason: "Trending framework release",
    trend_velocity: 8.5,
    difficulty: "INTERMEDIATE",
    competition: "MEDIUM",
    audience: "Senior Frontend & Fullstack Engineers",
    keywords: ["React 19", "Server Actions", "Next.js"],
    references: ["https://react.dev"],
  };

  const samplePost: LinkedInPostPayload = {
    title: "React 19 Server Actions in Enterprise SaaS",
    hook: "Stop writing repetitive form mutations in React. React 19 server actions change everything.",
    story: "Our team refactored 40+ legacy forms into async server mutations.",
    lesson: "Server actions eliminate client-side state boilerplate.",
    actionableInsight: "Use optimistic UI hooks for instantaneous form feedback.",
    fullText: "Stop writing repetitive form mutations in React. React 19 server actions change everything.\n\nWe refactored 40+ forms into zero-boilerplate async server mutations.\n\nKey Takeaways:\n⚡ 1. Zero client-side JS overhead for form hooks.\n⚡ 2. Automatic optimistic updates.\n\nHow is your team handling React 19 mutations?",
    cta: "How is your team handling React 19 mutations?",
    hashtags: ["#React19", "#WebDev", "#TypeScript"],
  };

  const sampleArticle: DevToArticlePayload = {
    title: "React 19 Server Actions in Enterprise SaaS",
    published: false,
    tags: ["react", "typescript", "webdev"],
    description: "Comprehensive guide to React 19 server actions.",
    mainImage: "",
    markdownContent: "# React 19 Server Actions\n\nDetailed breakdown of React 19 architecture.",
  };

  const samplePastPosts: HistoricalPostRecord[] = [
    {
      id: "p_past1",
      title: "React 19 Server Actions in Enterprise SaaS",
      platform: Platform.LINKEDIN,
      category: "React",
      framework: "React 19",
      supportingTech: ["Next.js"],
      keywords: ["React 19"],
      hook: "Stop writing repetitive form mutations in React...",
      fullText: "Full post about React 19 server actions...",
      publishedAt: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    },
    {
      id: "p_past2",
      title: "Decoupled Redis Streams Architecture",
      platform: Platform.DEVTO,
      category: "System Design",
      framework: "Redis",
      supportingTech: ["BullMQ"],
      keywords: ["Redis"],
      hook: "Scaling asynchronous message queues...",
      fullText: "Full post about Redis streams...",
      publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ];

  describe("ImageRelevanceVerificationAgent", () => {
    const agent = new ImageRelevanceVerificationAgent();

    it("should pass when visual diagram text matches post topic and framework", () => {
      const visualPlan: VisualPlanBlueprint = {
        topicConcept: "React 19 Server Actions",
        visualCategory: "REACT_COMPILER",
        requiredDiagramNodes: ["React 19", "Server Actions"],
        colorPalette: "light-blueprint",
        imagePrompt: "React 19 Server Actions Architecture",
        renderedSvg: `<svg xmlns="http://www.w3.org/2000/svg"><text x="100" y="50">React 19 Server Actions</text><text x="100" y="100">Client Component -> Server Mutation</text></svg>`,
        diagramSpec: {
          title: "React 19 Server Actions Architecture",
          layoutStyle: "SIDE_BY_SIDE_COMPARISON",
          colorPalette: "light-blueprint",
          columns: [
            {
              id: "col1",
              title: "React 19 Server Actions",
              subtitle: "Async Mutations",
              color: "blue",
              nodes: [{ id: "n1", label: "React 19", sublabel: "Server Actions" }],
            },
          ],
        },
      };

      const result = agent.evaluateImageRelevance(sampleTopic, samplePost, sampleArticle, null, visualPlan);
      expect(result.success).toBe(true);
      expect(result.data.passed).toBe(true);
      expect(result.data.relevanceScore).toBeGreaterThanOrEqual(80);
      expect(result.data.matchedKeywords.length).toBeGreaterThan(0);
    });

    it("should reject when image displays cross-domain mismatched content (eBPF kernel for React post)", () => {
      const visualPlan: VisualPlanBlueprint = {
        topicConcept: "React 19 Server Actions",
        visualCategory: "REACT_COMPILER",
        requiredDiagramNodes: ["eBPF"],
        colorPalette: "dark-contrast",
        imagePrompt: "eBPF kernel",
        renderedSvg: `<svg xmlns="http://www.w3.org/2000/svg"><text x="100" y="50">eBPF Zero-Trust Kernel Filter</text><text x="100" y="100">Columnar Analytics Engine</text></svg>`,
      };

      const result = agent.evaluateImageRelevance(sampleTopic, samplePost, sampleArticle, null, visualPlan);
      expect(result.data.passed).toBe(false);
      expect(result.data.domainAlignmentScore).toBeLessThan(70);
      expect(result.data.rejectionReasons.some((r) => r.includes("Domain Mismatch"))).toBe(true);
    });
  });

  describe("PostHistoryDeduplicationAgent", () => {
    it("should pass for a brand new unique topic and post", () => {
      const agent = new PostHistoryDeduplicationAgent(samplePastPosts);

      const uniqueTopic: Topic = {
        ...sampleTopic,
        id: "t_ebpf",
        title: "eBPF Socket Filter Optimization in Cloud Native Workloads",
        category: "Security & Networking",
        framework: "eBPF",
        keywords: ["eBPF", "Linux Kernel", "Networking"],
      };

      const uniquePost: LinkedInPostPayload = {
        ...samplePost,
        title: "eBPF Socket Filter Optimization in Cloud Native Workloads",
        hook: "Inspecting Linux kernel network traffic without sidecar latency.",
        fullText: "Deep dive into eBPF socket filters for high-throughput microservices...",
      };

      const result = agent.evaluatePostDeduplication(uniqueTopic, uniquePost);
      expect(result.success).toBe(true);
      expect(result.data.passed).toBe(true);
      expect(result.data.frameworkCooldownPassed).toBe(true);
    });

    it("should reject duplicate title and trigger framework cooldown for recent framework post", () => {
      const agent = new PostHistoryDeduplicationAgent(samplePastPosts);

      const result = agent.evaluatePostDeduplication(sampleTopic, samplePost, sampleArticle);
      expect(result.data.passed).toBe(false);
      expect(result.data.frameworkCooldownPassed).toBe(false);
      expect(result.data.cooldownViolations.length).toBeGreaterThan(0);
      expect(result.data.rejectionReasons.some((r) => r.includes("Cooldown Violation") || r.includes("Exact Title"))).toBe(true);
    });
  });

  describe("DecisionGateAgent Integration", () => {
    const decisionGate = new DecisionGateAgent();

    it("should enforce image relevance and post deduplication in 12 quality gates", () => {
      const mockOriginality = { passed: true, overallSimilarityScore: 0.15 } as any;
      const mockTechReview = { passed: true, accuracyScore: 95, credibilityGatePassed: true } as any;
      const mockVisualValidation = { alignedWithArticle: true, alignmentScore: 90 } as any;

      const mockImageRelevance = {
        passed: true,
        relevanceScore: 95,
        keywordMatchRate: 100,
        domainAlignmentScore: 100,
        starStoryVisualAlignmentScore: 90,
        matchedKeywords: ["React 19"],
        missingKeywords: [],
        svgNodesInspected: 5,
        rejectionReasons: [],
      };

      const mockPostDeduplication = {
        passed: true,
        overallSimilarityScore: 0.10,
        titleSimilarityScore: 0.10,
        hookSimilarityScore: 0.05,
        bodySemanticSimilarity: 0.10,
        frameworkCooldownPassed: true,
        cooldownViolations: [],
        rejectionReasons: [],
      };

      const res = decisionGate.evaluateDecision(
        sampleTopic,
        samplePost,
        sampleArticle,
        mockOriginality,
        mockTechReview,
        mockVisualValidation,
        0,
        "test_pipeline",
        mockImageRelevance,
        mockPostDeduplication
      );

      expect(res.data.approvedForPublishing).toBe(true);
      expect(res.data.gateCheckResults.imageRelevancePassed).toBe(true);
      expect(res.data.gateCheckResults.postDeduplicationPassed).toBe(true);
    });
  });
});

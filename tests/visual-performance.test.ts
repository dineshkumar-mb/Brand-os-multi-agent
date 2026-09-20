import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Visual Analytics & Visual Fatigue Detection", () => {
  it("should evaluate visual categories independently and trigger visualFatigueWarning when overused with declining scores", () => {
    const mockPosts: LinkedInPostAnalyticsData[] = Array.from({ length: 4 }).map((_, i) => ({
      postId: `vis_post_${i}`,
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      text: `Architecture Diagram Post ${i}`,
      title: `Architecture Diagram Post ${i}`,
      topic: "System Architecture",
      category: "SYSTEM_DESIGN",
      format: "ARCHITECTURE_DECISION",
      visualType: "ARCHITECTURE_DIAGRAM",
      impressions: 2000,
      likes: 50,
      comments: 2,
      shares: 1,
      saves: 1,
      clicks: 5,
      profileViews: 10,
      followersGained: 1,
      connectionRequests: 0,
      connectionAcceptance: 0,
      dms: 0,
      recruiterInteractions: 0,
      hiringManagerInteractions: 0,
      interviewInquiries: 0,
      portfolioClicks: 1,
      githubClicks: 1,
      externalLinkClicks: 0,
    }));

    const normalized = mockPosts.map((p) => ({
      post: p,
      normalized: linkedinAnalyticsIntelligenceAgent.normalizeMetrics(p),
    }));

    const visualReports = linkedinAnalyticsIntelligenceAgent.analyzeVisualPerformance(normalized);
    const archReport = visualReports.find((v) => v.visualType === "ARCHITECTURE_DIAGRAM");

    expect(archReport).toBeDefined();
    expect(archReport!.postsCount).toBe(4);
    // 4 posts with low career scores triggers visualFatigueWarning
    expect(archReport!.visualFatigueWarning).toBe(true);
  });
});

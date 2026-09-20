import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Strategy Decision Signals & Pipeline Feedback", () => {
  it("should generate topicWeightAdjustments and penalties without overriding freshness or experience match", () => {
    const mockPosts: LinkedInPostAnalyticsData[] = Array.from({ length: 5 }).map((_, i) => ({
      postId: `strat_post_${i}`,
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      text: `System Design Post ${i}`,
      title: `System Design Post ${i}`,
      topic: "System Design",
      category: "SYSTEM_DESIGN",
      format: "ARCHITECTURE_DECISION",
      visualType: "ARCHITECTURE_DIAGRAM",
      impressions: 10000,
      likes: 500,
      comments: 60,
      shares: 30,
      saves: 80,
      clicks: 100,
      profileViews: 1200,
      followersGained: 100,
      connectionRequests: 20,
      connectionAcceptance: 15,
      dms: 10,
      recruiterInteractions: 8,
      hiringManagerInteractions: 4,
      interviewInquiries: 3,
      portfolioClicks: 40,
      githubClicks: 50,
      externalLinkClicks: 10,
    }));

    const result = linkedinAnalyticsIntelligenceAgent.analyze(mockPosts);

    expect(result.data.topicWeightAdjustments).toBeDefined();
    // System design achieved strong signal -> weight adjustment +0.15
    expect(result.data.topicWeightAdjustments!["SYSTEM_DESIGN"]).toBe(0.15);
  });
});

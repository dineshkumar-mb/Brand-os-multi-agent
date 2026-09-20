import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Content Fatigue & Technology Overuse Detection", () => {
  it("should calculate explainable technology, topic, hook, visual, and format fatigue scores", () => {
    // 6 out of 8 posts use technology "Redis"
    const mockPosts: LinkedInPostAnalyticsData[] = Array.from({ length: 8 }).map((_, i) => ({
      postId: `fatigue_post_${i}`,
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      text: `Redis Post ${i}`,
      title: `Redis Streams and Caching Post ${i}`,
      topic: "Redis",
      technology: i < 6 ? "Redis" : "PostgreSQL",
      category: "DATABASE",
      format: "PRODUCTION_INCIDENT",
      hook: "Why Redis is causing issues",
      visualType: "ARCHITECTURE_DIAGRAM",
      impressions: 3000,
      likes: 100,
      comments: 10,
      shares: 5,
      saves: 5,
      clicks: 10,
      profileViews: 50,
      followersGained: 5,
      connectionRequests: 2,
      connectionAcceptance: 2,
      dms: 1,
      recruiterInteractions: 0,
      hiringManagerInteractions: 0,
      interviewInquiries: 0,
      portfolioClicks: 2,
      githubClicks: 3,
      externalLinkClicks: 0,
    }));

    const normalized = mockPosts.map((p) => ({
      post: p,
      normalized: linkedinAnalyticsIntelligenceAgent.normalizeMetrics(p),
    }));

    const fatigue = linkedinAnalyticsIntelligenceAgent.detectFatigue(normalized);

    // Redis in 6 of 8 posts (75% representation) -> technologyFatigue = 75
    expect(fatigue.technologyFatigue).toBe(75);
    expect(fatigue.explanations.length).toBeGreaterThan(0);
    expect(fatigue.explanations[0].toLowerCase()).toContain("redis");
  });
});

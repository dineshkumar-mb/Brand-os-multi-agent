import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Insufficient Data & Missing Metric Protection", () => {
  it("should return INSUFFICIENT_DATA status and confidence 30 when posts dataset is empty", () => {
    const emptyPosts: LinkedInPostAnalyticsData[] = [];
    const result = linkedinAnalyticsIntelligenceAgent.analyze(emptyPosts);

    expect(result.data.dataQuality).toBe("INSUFFICIENT");
    expect(result.data.sampleSize).toBe(0);
    expect(result.data.confidence).toBe(30);
    expect(result.data.performanceSummary.impressions).toBeNull();
  });

  it("should return INSUFFICIENT_DATA for posting-time windows with less than 3 observations", () => {
    const mockPosts: LinkedInPostAnalyticsData[] = [
      {
        postId: "single_time_post",
        publishedAt: "2026-09-22T18:00:00.000Z", // Tuesday 18:00 UTC
        text: "Single Post",
        title: "Single Post",
        topic: "Architecture",
        category: "SYSTEM_DESIGN",
        format: "ARCHITECTURE_DECISION",
        impressions: 5000,
        likes: 200,
        comments: 20,
        shares: 10,
        saves: 15,
        clicks: 30,
        profileViews: 300,
        followersGained: 20,
        connectionRequests: 5,
        connectionAcceptance: 4,
        dms: 2,
        recruiterInteractions: 2,
        hiringManagerInteractions: 1,
        interviewInquiries: 1,
        portfolioClicks: 10,
        githubClicks: 15,
        externalLinkClicks: 5,
      },
    ];

    const normalized = mockPosts.map((p) => ({
      post: p,
      normalized: linkedinAnalyticsIntelligenceAgent.normalizeMetrics(p),
    }));

    const timeReports = linkedinAnalyticsIntelligenceAgent.analyzePostingTimePerformance(normalized);
    const windowReport = timeReports[0];

    expect(windowReport).toBeDefined();
    expect(windowReport.sampleSize).toBe(1);
    // n = 1 < 3 -> must NOT state "Best posting time", must state INSUFFICIENT_DATA
    expect(windowReport.confidence).toBe("INSUFFICIENT_DATA");
    expect(windowReport.recommendationReason).toContain("Insufficient sample size");
  });
});

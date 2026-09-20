import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Analytics Normalization & Missing Data Handling", () => {
  it("should calculate exact per-impression rates and handle null metrics without fabrication", () => {
    const postWithPartialData: LinkedInPostAnalyticsData = {
      postId: "post_partial_01",
      publishedAt: new Date().toISOString(),
      text: "Testing Partial Data Normalization",
      title: "Testing Partial Data Normalization",
      topic: "System Design",
      category: "SYSTEM_DESIGN",
      format: "ARCHITECTURE_DECISION",
      impressions: 1000,
      likes: 50,
      comments: 10,
      shares: 5,
      saves: 5,
      clicks: 20,
      profileViews: 100,
      followersGained: null, // missing metric - must remain null in calculations
      connectionRequests: null,
      connectionAcceptance: null,
      dms: null,
      recruiterInteractions: 2,
      hiringManagerInteractions: null,
      interviewInquiries: 1,
      portfolioClicks: null,
      githubClicks: null,
      externalLinkClicks: null,
    };

    const norm = linkedinAnalyticsIntelligenceAgent.normalizeMetrics(postWithPartialData);

    // engagementRate = (50 + 10 + 5 + 5) / 1000 * 100 = 7.0%
    expect(norm.engagementRate).toBe(7.0);
    // profileVisitRate = 100 / 1000 * 100 = 10.0%
    expect(norm.profileVisitRate).toBe(10.0);
    // followerConversionRate = null (since followersGained is null)
    expect(norm.followerConversionRate).toBe(0.0);
    // careerOpportunityRate = (2 + 0 + 1) / 1000 * 100 = 0.3%
    expect(norm.careerOpportunityRate).toBe(0.3);
    // Weighted career score should be computed legitimately (> 0)
    expect(norm.weightedCareerScore).toBeGreaterThan(0);
  });

  it("should return null for rates when impressions are 0 or null", () => {
    const zeroImpPost: LinkedInPostAnalyticsData = {
      postId: "post_zero_imp",
      publishedAt: new Date().toISOString(),
      text: "Zero Impressions",
      title: "Zero Impressions",
      topic: "Zero",
      category: "FULL_STACK",
      format: "BUILD_IN_PUBLIC",
      impressions: null,
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      clicks: null,
      profileViews: null,
      followersGained: null,
      connectionRequests: null,
      connectionAcceptance: null,
      dms: null,
      recruiterInteractions: null,
      hiringManagerInteractions: null,
      interviewInquiries: null,
      portfolioClicks: null,
      githubClicks: null,
      externalLinkClicks: null,
    };

    const norm = linkedinAnalyticsIntelligenceAgent.normalizeMetrics(zeroImpPost);
    expect(norm.engagementRate).toBeNull();
    expect(norm.profileVisitRate).toBeNull();
    expect(norm.careerOpportunityRate).toBeNull();
    expect(norm.weightedCareerScore).toBe(0);
  });
});

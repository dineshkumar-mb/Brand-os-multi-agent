import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Career Outcome Analysis & Weighted Scoring", () => {
  it("should rank a post with low impressions but high recruiter/interview inquiries HIGHER than a high impression post with zero career signal", () => {
    // Post A: Viral fluff (100k impressions, 2k likes, 0 recruiters, 0 interview inquiries)
    const postViralFluff: LinkedInPostAnalyticsData = {
      postId: "post_viral_fluff",
      publishedAt: new Date().toISOString(),
      text: "10 Motivational Developer Quotes Every Programmer Must Read Today!",
      title: "10 Motivational Developer Quotes Every Programmer Must Read Today!",
      topic: "Career Advice",
      category: "CAREER_LESSONS",
      format: "NARRATIVE_PARAGRAPHS",
      impressions: 100000,
      likes: 2500,
      comments: 100,
      shares: 50,
      saves: 10,
      clicks: 20,
      profileViews: 30, // 0.03% profile visit rate
      followersGained: 15,
      connectionRequests: 2,
      connectionAcceptance: 1,
      dms: 0,
      recruiterInteractions: 0,
      hiringManagerInteractions: 0,
      interviewInquiries: 0,
      portfolioClicks: 2,
      githubClicks: 1,
      externalLinkClicks: 0,
    };

    // Post B: High-signal deep tech (2k impressions, 50 likes, 6 recruiter interactions, 3 interview inquiries, 300 profile views)
    const postDeepTech: LinkedInPostAnalyticsData = {
      postId: "post_deep_tech",
      publishedAt: new Date().toISOString(),
      text: "Architecting Resilient Multi-Provider LLM Gateway Routing with Dynamic Fallback",
      title: "Architecting Resilient Multi-Provider LLM Gateway Routing with Dynamic Fallback",
      topic: "LLM Gateway",
      category: "SYSTEM_DESIGN",
      format: "ARCHITECTURE_DECISION",
      impressions: 2000,
      likes: 50,
      comments: 25,
      shares: 15,
      saves: 40,
      clicks: 80,
      profileViews: 300, // 15% profile visit rate!
      followersGained: 45,
      connectionRequests: 20,
      connectionAcceptance: 18,
      dms: 12,
      recruiterInteractions: 6,
      hiringManagerInteractions: 4,
      interviewInquiries: 3,
      portfolioClicks: 25,
      githubClicks: 35,
      externalLinkClicks: 10,
    };

    const normViral = linkedinAnalyticsIntelligenceAgent.normalizeMetrics(postViralFluff);
    const normTech = linkedinAnalyticsIntelligenceAgent.normalizeMetrics(postDeepTech);

    // Deep tech post must have a significantly HIGHER weighted career score than the viral post
    expect(normTech.weightedCareerScore).toBeGreaterThan(normViral.weightedCareerScore);
    expect(normTech.careerOpportunityRate!).toBeGreaterThan(normViral.careerOpportunityRate!);
    expect(normTech.profileVisitRate!).toBeGreaterThan(normViral.profileVisitRate!);
  });
});

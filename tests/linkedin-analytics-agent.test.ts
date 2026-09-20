import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent, LinkedInAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("LinkedInAnalyticsIntelligenceAgent — End-to-End Suite", () => {
  it("should instantiate and analyze post dataset returning valid decision contract", () => {
    const agent = new LinkedInAnalyticsIntelligenceAgent();
    const mockPosts: LinkedInPostAnalyticsData[] = [
      {
        postId: "post_01",
        publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        text: "Architecting a Resilient Multi-Provider LLM Gateway",
        title: "Architecting a Resilient Multi-Provider LLM Gateway",
        hook: "Why 90% of LLM gateways fail under high load",
        topic: "LLM Gateway",
        category: "SYSTEM_DESIGN",
        format: "ARCHITECTURE_DECISION",
        visualType: "ARCHITECTURE_DIAGRAM",
        impressions: 10000,
        likes: 450,
        comments: 65,
        shares: 30,
        saves: 85,
        clicks: 120,
        profileViews: 1500,
        followersGained: 120,
        connectionRequests: 25,
        connectionAcceptance: 20,
        dms: 15,
        recruiterInteractions: 8,
        hiringManagerInteractions: 4,
        interviewInquiries: 3,
        portfolioClicks: 45,
        githubClicks: 60,
        externalLinkClicks: 15,
      },
      {
        postId: "post_02",
        publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        text: "Zero Duplicate Side Effects with Atomic Redis Deduplication",
        title: "Zero Duplicate Side Effects with Atomic Redis Deduplication",
        hook: "We had a production outage caused by duplicate worker jobs",
        topic: "Redis Deduplication",
        category: "PRODUCTION_DEBUGGING",
        format: "PRODUCTION_INCIDENT",
        visualType: "DEBUGGING_TIMELINE",
        impressions: 8500,
        likes: 380,
        comments: 50,
        shares: 20,
        saves: 60,
        clicks: 90,
        profileViews: 1100,
        followersGained: 80,
        connectionRequests: 18,
        connectionAcceptance: 15,
        dms: 10,
        recruiterInteractions: 5,
        hiringManagerInteractions: 2,
        interviewInquiries: 2,
        portfolioClicks: 30,
        githubClicks: 40,
        externalLinkClicks: 10,
      },
    ];

    const res = agent.analyze(mockPosts, { timeWindowDays: 30 });
    expect(res.success).toBe(true);
    expect(res.data.sampleSize).toBe(2);
    expect(res.data.performanceSummary.impressions).toBe(18500);
    expect(res.data.insights.length).toBeGreaterThan(0);
    expect(res.data.strategyDecisions.length).toBeGreaterThan(0);
    expect(res.data.next3Posts.length).toBe(3);
    expect(res.data.next5Posts.length).toBe(5);
  });
});

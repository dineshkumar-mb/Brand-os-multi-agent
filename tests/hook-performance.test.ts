import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Hook Performance & Repetition Warning Analysis", () => {
  it("should classify hooks correctly and trigger repetition warnings for overused hook categories", () => {
    const mockPosts: LinkedInPostAnalyticsData[] = [
      {
        postId: "hook_01",
        publishedAt: new Date().toISOString(),
        text: "Why 90% of microservices fail",
        title: "Why 90% of microservices fail",
        hook: "Why 90% of microservices fail at scale",
        topic: "Architecture",
        category: "SYSTEM_DESIGN",
        format: "ARCHITECTURE_DECISION",
        impressions: 5000,
        likes: 200,
        comments: 30,
        shares: 10,
        saves: 15,
        clicks: 40,
        profileViews: 300,
        followersGained: 20,
        connectionRequests: 5,
        connectionAcceptance: 4,
        dms: 3,
        recruiterInteractions: 2,
        hiringManagerInteractions: 1,
        interviewInquiries: 1,
        portfolioClicks: 10,
        githubClicks: 15,
        externalLinkClicks: 5,
      },
      {
        postId: "hook_02",
        publishedAt: new Date().toISOString(),
        text: "Why never use ORMs in high-throughput systems",
        title: "Why never use ORMs in high-throughput systems",
        hook: "Why never use ORMs in high-throughput systems",
        topic: "Database",
        category: "DATABASE",
        format: "ARCHITECTURE_DECISION",
        impressions: 6000,
        likes: 250,
        comments: 35,
        shares: 12,
        saves: 18,
        clicks: 45,
        profileViews: 350,
        followersGained: 25,
        connectionRequests: 6,
        connectionAcceptance: 5,
        dms: 4,
        recruiterInteractions: 3,
        hiringManagerInteractions: 1,
        interviewInquiries: 1,
        portfolioClicks: 12,
        githubClicks: 18,
        externalLinkClicks: 6,
      },
      {
        postId: "hook_03",
        publishedAt: new Date().toISOString(),
        text: "Why we broke our monolithic database",
        title: "Why we broke our monolithic database",
        hook: "Why how I broke database replication in production",
        topic: "PostgreSQL",
        category: "DATABASE",
        format: "PRODUCTION_INCIDENT",
        impressions: 7000,
        likes: 300,
        comments: 40,
        shares: 15,
        saves: 20,
        clicks: 50,
        profileViews: 400,
        followersGained: 30,
        connectionRequests: 8,
        connectionAcceptance: 6,
        dms: 5,
        recruiterInteractions: 4,
        hiringManagerInteractions: 2,
        interviewInquiries: 1,
        portfolioClicks: 15,
        githubClicks: 20,
        externalLinkClicks: 8,
      },
    ];

    const normalized = mockPosts.map((p) => ({
      post: p,
      normalized: linkedinAnalyticsIntelligenceAgent.normalizeMetrics(p),
    }));

    const hookReports = linkedinAnalyticsIntelligenceAgent.analyzeHookPerformance(normalized);

    const contrarianHook = hookReports.find((h) => h.hookCategory === "Contrarian");
    expect(contrarianHook).toBeDefined();
    expect(contrarianHook!.postsCount).toBe(3);
    // 3 posts using same Contrarian hook structure triggers repetitionWarning
    expect(contrarianHook!.repetitionWarning).toBe(true);
  });
});

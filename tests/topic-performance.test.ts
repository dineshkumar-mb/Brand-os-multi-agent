import { describe, it, expect } from "vitest";
import { linkedinAnalyticsIntelligenceAgent } from "../packages/agents/src/agents/linkedin-analytics-intelligence";
import { LinkedInPostAnalyticsData } from "@brand-os/shared";

describe("Topic Performance & Distinct Engineering Topic Tuple", () => {
  it("should distinguish Redis+Caching from Redis+Distributed Queues as separate engineering topics", () => {
    const mockPosts: LinkedInPostAnalyticsData[] = [
      {
        postId: "post_redis_cache",
        publishedAt: new Date().toISOString(),
        text: "Redis Caching Invalidation Strategies",
        title: "Redis Caching Invalidation Strategies",
        topic: "Redis Caching",
        technology: "Redis",
        engineeringProblem: "Cache Invalidation",
        category: "PERFORMANCE",
        format: "ARCHITECTURE_DECISION",
        impressions: 5000,
        likes: 200,
        comments: 15,
        shares: 10,
        saves: 20,
        clicks: 30,
        profileViews: 400,
        followersGained: 30,
        connectionRequests: 5,
        connectionAcceptance: 4,
        dms: 2,
        recruiterInteractions: 1,
        hiringManagerInteractions: 1,
        interviewInquiries: 0,
        portfolioClicks: 5,
        githubClicks: 10,
        externalLinkClicks: 2,
      },
      {
        postId: "post_redis_queue",
        publishedAt: new Date().toISOString(),
        text: "Redis Streams for Distributed Background Worker Queues",
        title: "Redis Streams for Distributed Background Worker Queues",
        topic: "Redis Queues",
        technology: "Redis",
        engineeringProblem: "Distributed Job Coordination",
        category: "SYSTEM_DESIGN",
        format: "PRODUCTION_INCIDENT",
        impressions: 12000,
        likes: 600,
        comments: 80,
        shares: 45,
        saves: 110,
        clicks: 180,
        profileViews: 1800,
        followersGained: 140,
        connectionRequests: 30,
        connectionAcceptance: 25,
        dms: 20,
        recruiterInteractions: 10,
        hiringManagerInteractions: 5,
        interviewInquiries: 4,
        portfolioClicks: 50,
        githubClicks: 70,
        externalLinkClicks: 20,
      },
    ];

    const normalized = mockPosts.map((p) => ({
      post: p,
      normalized: linkedinAnalyticsIntelligenceAgent.normalizeMetrics(p),
    }));

    const topicReports = linkedinAnalyticsIntelligenceAgent.analyzeTopicPerformance(normalized);

    // Redis+Caching and Redis+Distributed Queues must be treated as 2 distinct topics
    expect(topicReports.length).toBe(2);

    const queueTopic = topicReports.find((t) => t.engineeringProblem.includes("Distributed Job Coordination"));
    const cacheTopic = topicReports.find((t) => t.engineeringProblem.includes("Cache Invalidation"));

    expect(queueTopic).toBeDefined();
    expect(cacheTopic).toBeDefined();
    expect(queueTopic!.weightedCareerScore).toBeGreaterThan(cacheTopic!.weightedCareerScore);
  });
});

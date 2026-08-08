import { describe, it, expect } from "vitest";
import {
  globalIntelligenceEngine,
  canonicalEventEngine,
  claimVerifierEngine,
  doNotPublishGate,
  contentOpportunityGenerator,
  RawIntelligenceSignal,
} from "../index.js";
import { SourceAuthorityLevel, ContentOpportunity } from "@brand-os/shared";

describe("End-to-End Intelligence Pipeline & Selective Publishing Tests", () => {
  it("Case A: High-Value Technical Topic (AI Gateway / Multi-model routing) should yield APPROVED ContentOpportunity", () => {
    const highValueEvent = {
      eventId: "evt_ai_gateway_test",
      title: "Model Context Protocol (MCP) & AI Gateway Multi-Model Failover Architecture",
      summary: "Production guide to multi-provider AI gateway routing using MCP tool calling and cost failover.",
      primarySourceUrl: "https://openai.com/index/openai-o3-mini/",
      sources: [
        {
          sourceId: "openai_official",
          sourceName: "OpenAI Official Documentation",
          authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
          url: "https://openai.com/index/openai-o3-mini/",
        },
        {
          sourceId: "github_trending_daily",
          sourceName: "GitHub Repository Intelligence",
          authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
          url: "https://github.com/modelcontextprotocol/servers",
        },
      ],
      claims: [
        {
          claimText: "MCP standardizes tool calling and state management across multi-agent AI gateways.",
          verified: true,
          verificationSource: "OpenAI Official Documentation",
        },
      ],
      confidenceScore: 95,
      trendVelocity: 9.5,
      firstSeenAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      tags: ["MCP", "AI Gateway", "TypeScript", "Multi-Agent Systems"],
    };

    // Generate Opportunity
    const opp = contentOpportunityGenerator.generateFromEvent(highValueEvent);

    expect(opp.status).toBe("APPROVED");
    expect(opp.personalExperienceMatch).toBeGreaterThanOrEqual(30);
    expect(opp.careerRelevanceScore).toBeGreaterThanOrEqual(80);
    expect(opp.overallScore).toBeGreaterThanOrEqual(70);
    expect(opp.whyCare.whyItMatters).toBeDefined();
    expect(opp.evidence.length).toBe(2);
  });

  it("Case B: Generic Shallow AI News Topic ('Top 10 AI tools') should be STOPPED by NO_POST_TODAY gate", () => {
    const shallowHypeEvent = {
      eventId: "evt_top_10_ai_tools",
      title: "Top 10 AI Tools Every Developer Should Try Today",
      summary: "A list compilation of popular web apps and generic AI extensions.",
      primarySourceUrl: "https://random-blog.com/top-10-ai-tools",
      sources: [
        {
          sourceId: "social_aggregator",
          sourceName: "Third-Party Social Aggregator",
          authorityLevel: SourceAuthorityLevel.LEVEL_4_DISCOVERY,
          url: "https://random-blog.com/top-10-ai-tools",
        },
      ],
      claims: [
        {
          claimText: "These 10 tools will change how you program forever.",
          verified: false,
        },
      ],
      confidenceScore: 40,
      trendVelocity: 4.0,
      firstSeenAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      tags: ["Listicle", "Generic AI", "Tools"],
    };

    // Generate Opportunity
    const opp = contentOpportunityGenerator.generateFromEvent(shallowHypeEvent);

    // Gate Check
    const gateCheck = doNotPublishGate.evaluateOpportunity(opp);

    expect(opp.status).toBe("REJECTED");
    expect(gateCheck.shouldReject).toBe(true);
    expect(opp.rejectionReason).toContain("REJECTED (NO_POST_TODAY)");
  });

  it("Cross-Platform Merge: 5 signals from OpenAI, GitHub, HN, Reddit, Dev.to merge into 1 CanonicalEvent + 5 Evidence sources", () => {
    const now = new Date().toISOString();
    const signals: RawIntelligenceSignal[] = [
      {
        id: "sig_1",
        sourceId: "openai_official",
        sourceName: "OpenAI Official Releases",
        category: "OFFICIAL_LAB",
        authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
        title: "Model Context Protocol (MCP) Agent Tooling",
        content: "OpenAI officially adopts MCP tool contract for o3-mini.",
        url: "https://openai.com/index/mcp",
        publishedAt: now,
        retrievedAt: now,
        tags: ["MCP", "OpenAI"],
      },
      {
        id: "sig_2",
        sourceId: "github_trending_daily",
        sourceName: "GitHub Repository Intelligence",
        category: "OPEN_SOURCE",
        authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
        title: "GitHub Trending: modelcontextprotocol/servers",
        content: "MCP servers repo surges with 18.4k stars.",
        url: "https://github.com/modelcontextprotocol/servers",
        publishedAt: now,
        retrievedAt: now,
        tags: ["MCP", "GitHub"],
      },
      {
        id: "sig_3",
        sourceId: "hackernews_top",
        sourceName: "Hacker News Discussions",
        category: "COMMUNITY",
        authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
        title: "HackerNews Discussion on Model Context Protocol",
        content: "480 comments discussing MCP transport protocols.",
        url: "https://news.ycombinator.com/item?id=429010",
        publishedAt: now,
        retrievedAt: now,
        tags: ["MCP", "HackerNews"],
      },
      {
        id: "sig_4",
        sourceId: "reddit_tech_subs",
        sourceName: "Reddit r/LocalLLaMA",
        category: "COMMUNITY",
        authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
        title: "Reddit Thread: Local MCP Servers with Ollama",
        content: "Developers running local MCP tool servers.",
        url: "https://reddit.com/r/LocalLLaMA/comments/mcp",
        publishedAt: now,
        retrievedAt: now,
        tags: ["MCP", "Reddit"],
      },
      {
        id: "sig_5",
        sourceId: "devto_rising",
        sourceName: "Dev.to Technical Engineering",
        category: "COMMUNITY",
        authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
        title: "Dev.to Tutorial: Building an MCP Tool Client",
        content: "Step-by-step TypeScript guide for MCP client tools.",
        url: "https://dev.to/mcp_tutorial",
        publishedAt: now,
        retrievedAt: now,
        tags: ["MCP", "Dev.to"],
      },
    ];

    const canonicalEvents = canonicalEventEngine.createCanonicalEvents(signals);

    expect(canonicalEvents.length).toBe(1);
    const mcpEvent = canonicalEvents[0];
    expect(mcpEvent.sources.length).toBe(5);
    expect(mcpEvent.confidenceScore).toBe(95);

    // Verify claim verification works with Level 1 source present
    const verification = claimVerifierEngine.verifyCanonicalEvent(mcpEvent);
    expect(verification.isVerified).toBe(true);
  });
});

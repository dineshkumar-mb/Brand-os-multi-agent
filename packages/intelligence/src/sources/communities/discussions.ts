import { SourceAuthorityLevel } from "@brand-os/shared";
import { RawIntelligenceSignal } from "../types.js";

export class CommunityDiscussionsCollector {
  public async collectCommunitySignals(): Promise<RawIntelligenceSignal[]> {
    const now = new Date().toISOString();
    const signals: RawIntelligenceSignal[] = [];

    // Hacker News Technical Discussion
    signals.push({
      id: `sig_hn_${Date.now()}`,
      sourceId: "hackernews_top",
      sourceName: "Hacker News Technical Discussions",
      category: "COMMUNITY",
      authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      title: "HN Discussion: Zero-Trust Microservice Communication with Mutual TLS and eBPF",
      content: "340 comments discussing service mesh overhead, kernel-level networking, and cryptographic identity verification in Kubernetes clusters.",
      url: "https://news.ycombinator.com/item?id=431050",
      publishedAt: now,
      retrievedAt: now,
      metadata: { commentsCount: 340, score: 510 },
      tags: ["HackerNews", "Security", "DevOps", "eBPF", "Kubernetes", "System Design"],
    });

    // Reddit r/LocalLLaMA
    signals.push({
      id: `sig_reddit_${Date.now()}`,
      sourceId: "reddit_tech_subs",
      sourceName: "Reddit Technical Discussions (r/LocalLLaMA)",
      category: "COMMUNITY",
      authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      title: "Reddit r/LocalLLaMA: Benchmark of DeepSeek-R1 vs Claude 3.5 Sonnet on Complex System Architecture",
      content: "Developers discussing local quantization trade-offs, VRAM requirements, and structured function calling reliability.",
      url: "https://reddit.com/r/LocalLLaMA/comments/deepseek_r1_benchmarks",
      publishedAt: now,
      retrievedAt: now,
      metadata: { upvotes: 1420, subreddit: "LocalLLaMA" },
      tags: ["Reddit", "DeepSeek", "Model Evaluation", "Quantization", "AI Model Benchmarks"],
    });

    // Dev.to Technical Signal
    signals.push({
      id: `sig_devto_${Date.now()}`,
      sourceId: "devto_rising",
      sourceName: "Dev.to Technical Engineering Feed",
      category: "COMMUNITY",
      authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      title: "Dev.to: Distributed Rate Limiting & Sliding Window Algorithms in High-Throughput Node.js APIs",
      content: "Deep dive into memory overhead, atomic Lua scripts vs in-memory leaky bucket algorithm implementations for production microservices.",
      url: "https://dev.to/backend_architect/rate-limiting-algorithms-nodejs",
      publishedAt: now,
      retrievedAt: now,
      metadata: { reactions: 620 },
      tags: ["Dev.to", "Performance Engineering", "Node.js", "System Design", "Backend Engineering"],
    });

    // Additional Community Discussion on Automated AI Testing
    signals.push({
      id: `sig_community_eval_${Date.now()}`,
      sourceId: "devto_rising",
      sourceName: "AI Safety & Evaluation Forum",
      category: "COMMUNITY",
      authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      title: "Evaluating LLM Agent Determinism with Automated Property-Based Testing Frameworks",
      content: "Engineers sharing testing pipelines using QuickCheck principles to detect agent loop drift and tool parameter hallucination in production.",
      url: "https://dev.to/ai_testing/property-based-agent-evals",
      publishedAt: now,
      retrievedAt: now,
      metadata: { reactions: 490 },
      tags: ["AI Safety", "Model Evaluation", "Testing", "Agentic AI", "Quality Assurance"],
    });

    return signals;
  }
}

export const communityDiscussionsCollector = new CommunityDiscussionsCollector();


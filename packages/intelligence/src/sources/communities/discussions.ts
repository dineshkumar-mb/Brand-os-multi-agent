import { SourceAuthorityLevel } from "@brand-os/shared";
import { RawIntelligenceSignal } from "../types.js";

// AI/tech keywords to surface from HN top stories
const AI_TECH_KEYWORDS = [
  "llm", "gpt", "claude", "gemini", "mistral", "llama", "deepseek",
  "agent", "rag", "vector", "embedding", "fine-tun", "inference",
  "openai", "anthropic", "google ai", "huggingface",
  "kubernetes", "docker", "rust", "wasm", "webassembly",
  "typescript", "deno", "bun", "node",
  "database", "postgres", "clickhouse", "redis",
  "security", "cryptograph", "tls", "zero-trust",
  "react", "nextjs", "next.js", "svelte", "astro",
  "gpu", "cuda", "nvidia", "tpu",
  "benchmark", "performance", "open source",
];

function isRelevantTechStory(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_TECH_KEYWORDS.some((kw) => lower.includes(kw));
}

function extractTagsFromTitle(title: string): string[] {
  const lower = title.toLowerCase();
  const tags: string[] = ["HackerNews"];
  if (lower.includes("llm") || lower.includes("gpt") || lower.includes("claude") || lower.includes("gemini") || lower.includes("mistral")) tags.push("LLM", "AI Engineering");
  if (lower.includes("agent") || lower.includes("multi-agent")) tags.push("Agentic AI");
  if (lower.includes("rag") || lower.includes("vector") || lower.includes("embedding")) tags.push("RAG", "Vector Search");
  if (lower.includes("rust")) tags.push("Rust", "Systems Programming");
  if (lower.includes("typescript") || lower.includes("javascript")) tags.push("TypeScript", "Web Engineering");
  if (lower.includes("database") || lower.includes("postgres") || lower.includes("sql")) tags.push("Databases");
  if (lower.includes("security") || lower.includes("tls") || lower.includes("auth")) tags.push("Security");
  if (lower.includes("kubernetes") || lower.includes("docker") || lower.includes("container")) tags.push("DevOps", "Containers");
  if (lower.includes("performance") || lower.includes("benchmark") || lower.includes("fast") || lower.includes("speed")) tags.push("Performance Engineering");
  if (lower.includes("open source") || lower.includes("open-source")) tags.push("Open Source");
  if (tags.length === 1) tags.push("Software Engineering", "Developer Tools");
  return [...new Set(tags)].slice(0, 5);
}

// ─────────────────────────────────────────────────────────────
//  Live Hacker News — Top Stories filtered for tech relevance
// ─────────────────────────────────────────────────────────────
async function fetchHNTopStories(): Promise<RawIntelligenceSignal[]> {
  const now = new Date().toISOString();

  // Get top story IDs
  const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    headers: { "User-Agent": "PersonalBrandOS/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!idsRes.ok) throw new Error(`HN top stories: ${idsRes.status}`);
  const ids: number[] = await idsRes.json();

  // Fetch top 30 story details concurrently, filter relevant ones
  const storyPromises = ids.slice(0, 30).map((id) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
      signal: AbortSignal.timeout(5000),
    }).then((r) => r.json()).catch(() => null)
  );

  const stories = (await Promise.all(storyPromises)).filter(
    (s): s is any => s && s.type === "story" && s.title && isRelevantTechStory(s.title)
  );

  console.log(`[CommunityDiscussions] HN: Found ${stories.length} relevant tech stories from top 30`);

  return stories.slice(0, 3).map((story: any, idx: number): RawIntelligenceSignal => ({
    id: `sig_hn_${idx}_${Date.now()}`,
    sourceId: "hackernews_top",
    sourceName: "Hacker News Top Stories (Live)",
    category: "COMMUNITY" as any,
    authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
    title: `HN: ${story.title}`,
    content: `Hacker News top story with ${story.score || 0} points and ${story.descendants || 0} comments. ${story.url ? `Source: ${story.url}` : ""}`,
    url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
    publishedAt: story.time ? new Date(story.time * 1000).toISOString() : now,
    retrievedAt: now,
    metadata: { hnId: story.id, score: story.score || 0, commentsCount: story.descendants || 0 },
    tags: extractTagsFromTitle(story.title),
  }));
}

// ─────────────────────────────────────────────────────────────
//  Dev.to — Live RSS feed for top articles
// ─────────────────────────────────────────────────────────────
async function fetchDevToFeed(): Promise<RawIntelligenceSignal[]> {
  const now = new Date().toISOString();
  const res = await fetch("https://dev.to/api/articles?top=3&tag=ai&per_page=5", {
    headers: { "User-Agent": "PersonalBrandOS/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Dev.to API: ${res.status}`);
  const articles: any[] = await res.json();

  return articles.slice(0, 3).map((article: any, idx: number): RawIntelligenceSignal => ({
    id: `sig_devto_${idx}_${Date.now()}`,
    sourceId: "devto_rising",
    sourceName: "Dev.to Technical Engineering Feed (Live)",
    category: "COMMUNITY" as any,
    authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
    title: `Dev.to: ${article.title}`,
    content: `${article.description || "Technical deep-dive on " + article.title} — ${article.public_reactions_count || 0} reactions, ${article.comments_count || 0} comments. Tags: ${(article.tag_list || []).join(", ")}.`,
    url: article.url || `https://dev.to/${article.path}`,
    publishedAt: article.published_at || now,
    retrievedAt: now,
    metadata: { reactions: article.public_reactions_count || 0, comments: article.comments_count || 0, author: article.user?.name },
    tags: ["Dev.to", ...((article.tag_list || []).slice(0, 3)), "Developer Community"],
  }));
}

// ─────────────────────────────────────────────────────────────
//  Fallback static signals
// ─────────────────────────────────────────────────────────────
const FALLBACK_SIGNALS: RawIntelligenceSignal[] = (() => {
  const now = new Date().toISOString();
  return [
    {
      id: `sig_hn_fallback_${Date.now()}`,
      sourceId: "hackernews_top",
      sourceName: "Hacker News Technical Discussions",
      category: "COMMUNITY" as any,
      authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      title: "HN Discussion: Zero-Trust Microservice Communication with Mutual TLS and eBPF",
      content: "340 comments discussing service mesh overhead, kernel-level networking, and cryptographic identity in Kubernetes clusters.",
      url: "https://news.ycombinator.com/item?id=431050",
      publishedAt: now,
      retrievedAt: now,
      metadata: { commentsCount: 340, score: 510 },
      tags: ["HackerNews", "Security", "DevOps", "eBPF", "Kubernetes"],
    },
    {
      id: `sig_devto_fallback_${Date.now()}`,
      sourceId: "devto_rising",
      sourceName: "Dev.to Technical Engineering Feed",
      category: "COMMUNITY" as any,
      authorityLevel: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      title: "Dev.to: Distributed Rate Limiting & Sliding Window Algorithms in Node.js APIs",
      content: "Deep dive into memory overhead, atomic Lua scripts vs in-memory leaky bucket algorithm implementations for production microservices.",
      url: "https://dev.to/backend_architect/rate-limiting-algorithms-nodejs",
      publishedAt: now,
      retrievedAt: now,
      metadata: { reactions: 620 },
      tags: ["Dev.to", "Performance Engineering", "Node.js", "System Design", "Backend"],
    },
  ];
})();

// ─────────────────────────────────────────────────────────────
//  Main Collector
// ─────────────────────────────────────────────────────────────
export class CommunityDiscussionsCollector {
  public async collectCommunitySignals(): Promise<RawIntelligenceSignal[]> {
    const [hnResult, devToResult] = await Promise.allSettled([
      fetchHNTopStories(),
      fetchDevToFeed(),
    ]);

    const signals: RawIntelligenceSignal[] = [];

    if (hnResult.status === "fulfilled" && hnResult.value.length > 0) {
      console.log(`[CommunityDiscussions] ✅ HN Live: ${hnResult.value.length} stories`);
      signals.push(...hnResult.value);
    } else {
      const reason = hnResult.status === "rejected" ? hnResult.reason?.message : "No stories";
      console.warn("[CommunityDiscussions] ⚠️ HN Live failed:", reason, "— using fallback");
      signals.push(FALLBACK_SIGNALS[0]);
    }

    if (devToResult.status === "fulfilled" && devToResult.value.length > 0) {
      console.log(`[CommunityDiscussions] ✅ Dev.to Live: ${devToResult.value.length} articles`);
      signals.push(...devToResult.value);
    } else {
      const reason = devToResult.status === "rejected" ? devToResult.reason?.message : "No articles";
      console.warn("[CommunityDiscussions] ⚠️ Dev.to Live failed:", reason, "— using fallback");
      signals.push(FALLBACK_SIGNALS[1]);
    }

    return signals;
  }
}

export const communityDiscussionsCollector = new CommunityDiscussionsCollector();

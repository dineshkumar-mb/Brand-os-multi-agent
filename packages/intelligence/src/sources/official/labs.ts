import { SourceAuthorityLevel } from "@brand-os/shared";
import { RawIntelligenceSignal } from "../types.js";

declare const process: any;

interface LLMRelease {
  provider: string;
  model?: string;
  title: string;
  content: string;
  url: string;
  publishedAt?: string;
  tags: string[];
  metadata: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────
//  Minimal RSS/Atom parser (no external dependencies)
// ─────────────────────────────────────────────────────────────
function extractRssItems(xml: string, limit = 5): Array<{ title: string; link: string; description: string; pubDate?: string }> {
  const items: Array<{ title: string; link: string; description: string; pubDate?: string }> = [];
  const itemRe = /<item[\s\S]*?<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml)) !== null && items.length < limit) {
    const block = match[0];
    const title = (/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i.exec(block) || /<title[^>]*>([\s\S]*?)<\/title>/i.exec(block))?.[1]?.trim() || "";
    const link = (/<link[^>]*>([\s\S]*?)<\/link>/i.exec(block))?.[1]?.trim() || "";
    const description = (/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i.exec(block) || /<description[^>]*>([\s\S]*?)<\/description>/i.exec(block))?.[1]?.trim() || "";
    const pubDate = (/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i.exec(block))?.[1]?.trim();
    if (title) items.push({ title, link, description: description.replace(/<[^>]+>/g, "").substring(0, 400), pubDate });
  }
  return items;
}

function extractAtomEntries(xml: string, limit = 5): Array<{ title: string; link: string; description: string; pubDate?: string }> {
  const entries: Array<{ title: string; link: string; description: string; pubDate?: string }> = [];
  const entryRe = /<entry[\s\S]*?<\/entry>/gi;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(xml)) !== null && entries.length < limit) {
    const block = match[0];
    const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(block))?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
    const link = (/<link[^>]*href="([^"]+)"/i.exec(block))?.[1]?.trim() || "";
    const description = (/<summary[^>]*>([\s\S]*?)<\/summary>/i.exec(block) || /<content[^>]*>([\s\S]*?)<\/content>/i.exec(block))?.[1]?.replace(/<[^>]+>/g, "").trim().substring(0, 400) || "";
    const pubDate = (/<updated[^>]*>([\s\S]*?)<\/updated>/i.exec(block))?.[1]?.trim() || (/<published[^>]*>([\s\S]*?)<\/published>/i.exec(block))?.[1]?.trim();
    if (title) entries.push({ title, link, description, pubDate });
  }
  return entries;
}

async function fetchFeed(url: string): Promise<Array<{ title: string; link: string; description: string; pubDate?: string }>> {
  const res = await fetch(url, {
    headers: { "User-Agent": "PersonalBrandOS-IntelligenceEngine/1.0", "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const rssItems = extractRssItems(xml, 5);
  if (rssItems.length > 0) return rssItems;
  return extractAtomEntries(xml, 5);
}

// ─────────────────────────────────────────────────────────────
//  Hugging Face Daily Papers (live, no auth)
// ─────────────────────────────────────────────────────────────
async function fetchHuggingFacePapers(): Promise<LLMRelease[]> {
  const feed = await fetchFeed("https://huggingface.co/blog/feed.xml");
  return feed.map((item) => ({
    provider: "Hugging Face",
    title: item.title,
    content: item.description || "New HuggingFace release or research update.",
    url: item.link || "https://huggingface.co/blog",
    publishedAt: item.pubDate,
    tags: ["HuggingFace", "Open Source", "AI Research", "Model Releases"],
    metadata: { provider: "HuggingFace", type: "blog" },
  }));
}

// ─────────────────────────────────────────────────────────────
//  OpenAI (blog RSS)
// ─────────────────────────────────────────────────────────────
async function fetchOpenAIReleases(): Promise<LLMRelease[]> {
  const feed = await fetchFeed("https://openai.com/blog/rss/");
  return feed.map((item) => ({
    provider: "OpenAI",
    title: item.title,
    content: item.description || "OpenAI product announcement or research release.",
    url: item.link || "https://openai.com/blog",
    publishedAt: item.pubDate,
    tags: ["OpenAI", "LLM", "AI Research", "Model Releases", "AI Engineering"],
    metadata: { provider: "OpenAI", type: "blog" },
  }));
}

// ─────────────────────────────────────────────────────────────
//  Anthropic (blog RSS — fallback to news page JSON if RSS fails)
// ─────────────────────────────────────────────────────────────
async function fetchAnthropicReleases(): Promise<LLMRelease[]> {
  // Anthropic removed their .rss feed; try the sitemap/news JSON endpoint
  const urls = [
    "https://www.anthropic.com/news.rss",
    "https://www.anthropic.com/rss.xml",
    "https://anthropic.com/blog/rss",
  ];
  for (const url of urls) {
    try {
      const feed = await fetchFeed(url);
      if (feed.length > 0) {
        return feed.map((item) => ({
          provider: "Anthropic",
          title: item.title,
          content: item.description || "Anthropic research update or Claude product launch.",
          url: item.link || "https://www.anthropic.com/news",
          publishedAt: item.pubDate,
          tags: ["Anthropic", "Claude", "AI Safety", "Model Releases", "Agentic AI"],
          metadata: { provider: "Anthropic", type: "blog" },
        }));
      }
    } catch {
      // try next URL
    }
  }
  // None of the RSS URLs worked — use curated Anthropic news via HN search
  throw new Error("All Anthropic RSS URLs failed (provider has removed public RSS feeds)");
}

// ─────────────────────────────────────────────────────────────
//  Google AI / Gemini (Google AI blog RSS)
// ─────────────────────────────────────────────────────────────
async function fetchGoogleAIReleases(): Promise<LLMRelease[]> {
  const feed = await fetchFeed("https://blog.google/technology/ai/rss/");
  return feed.map((item) => ({
    provider: "Google",
    title: item.title,
    content: item.description || "Google AI or Gemini product release.",
    url: item.link || "https://ai.google.dev",
    publishedAt: item.pubDate,
    tags: ["Google", "Gemini", "AI Engineering", "Multimodal", "AI Research"],
    metadata: { provider: "Google", type: "blog" },
  }));
}

// ─────────────────────────────────────────────────────────────
//  Meta AI (Meta AI blog)
// ─────────────────────────────────────────────────────────────
async function fetchMetaAIReleases(): Promise<LLMRelease[]> {
  const feed = await fetchFeed("https://ai.meta.com/blog/rss/");
  return feed.map((item) => ({
    provider: "Meta",
    title: item.title,
    content: item.description || "Meta AI or Llama model release.",
    url: item.link || "https://ai.meta.com/blog",
    publishedAt: item.pubDate,
    tags: ["Meta", "Llama", "Open Source", "AI Research", "LLM Infrastructure"],
    metadata: { provider: "Meta", type: "blog" },
  }));
}

// ─────────────────────────────────────────────────────────────
//  Mistral AI (blog)
// ─────────────────────────────────────────────────────────────
async function fetchMistralReleases(): Promise<LLMRelease[]> {
  const feed = await fetchFeed("https://mistral.ai/feed.xml");
  return feed.map((item) => ({
    provider: "Mistral AI",
    title: item.title,
    content: item.description || "Mistral AI model or API release.",
    url: item.link || "https://mistral.ai/news",
    publishedAt: item.pubDate,
    tags: ["Mistral", "Open Source", "LLM", "AI Engineering", "Model Releases"],
    metadata: { provider: "Mistral AI", type: "blog" },
  }));
}

// ─────────────────────────────────────────────────────────────
//  DeepSeek (GitHub releases via GitHub API)
// ─────────────────────────────────────────────────────────────
async function fetchDeepSeekReleases(): Promise<LLMRelease[]> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
  const headers: Record<string, string> = { "User-Agent": "PersonalBrandOS/1.0", "Accept": "application/vnd.github+json" };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch("https://api.github.com/repos/deepseek-ai/DeepSeek-V3/releases?per_page=3", { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const releases: any[] = await res.json();
  return releases.map((r: any) => ({
    provider: "DeepSeek",
    title: `DeepSeek Release: ${r.name || r.tag_name}`,
    content: (r.body || "New DeepSeek model or research release.").substring(0, 400),
    url: r.html_url || "https://github.com/deepseek-ai",
    publishedAt: r.published_at,
    tags: ["DeepSeek", "Open Source", "Model Releases", "Reasoning", "LLM"],
    metadata: { provider: "DeepSeek", tag: r.tag_name, prerelease: r.prerelease },
  }));
}

// ─────────────────────────────────────────────────────────────
//  Fallback static signals (recent known events)
// ─────────────────────────────────────────────────────────────
const FALLBACK_SIGNALS: LLMRelease[] = [
  {
    provider: "OpenAI",
    model: "GPT-4o",
    title: "OpenAI GPT-4o — Omni Model with Native Audio, Vision & Real-Time Capabilities",
    content: "OpenAI released GPT-4o with native multimodal inputs, sub-300ms voice latency, and vision understanding, setting new frontier benchmarks.",
    url: "https://openai.com/index/gpt-4o-system-card/",
    tags: ["OpenAI", "GPT-4o", "Multimodal", "LLM", "AI Engineering"],
    metadata: { provider: "OpenAI", model: "gpt-4o" },
  },
  {
    provider: "Anthropic",
    model: "claude-3-5-sonnet",
    title: "Anthropic Claude 3.5 Sonnet Computer Use & Agentic Tool Execution",
    content: "Anthropic released computer use capability allowing Claude to navigate GUIs and execute complex multi-step workflows autonomously.",
    url: "https://docs.anthropic.com/en/docs/agents-and-tools/computer-use",
    tags: ["Anthropic", "Claude", "Agentic AI", "Computer Use", "Tool Calling"],
    metadata: { provider: "Anthropic", model: "claude-3-5-sonnet" },
  },
  {
    provider: "Google",
    model: "gemini-2.0-flash",
    title: "Google Gemini 2.0 Flash — Multimodal Live API & Real-Time Function Calling",
    content: "Google released Gemini 2.0 Flash featuring native audio-video streaming, sub-second latency, and dynamic function call execution.",
    url: "https://ai.google.dev",
    tags: ["Google", "Gemini 2.0", "AI Engineering", "Multimodal", "Real-Time"],
    metadata: { provider: "Google", model: "gemini-2.0-flash", streaming: true },
  },
  {
    provider: "Meta",
    model: "llama-3.3-70b",
    title: "Meta Llama 3.3 70B — High-Throughput Open-Weight Deployment",
    content: "Meta open-sourced Llama 3.3 70B with 128k context, reaching performance parity with legacy 405B models at lower compute cost.",
    url: "https://ai.meta.com/llama",
    tags: ["Meta", "Llama 3.3", "Open Source", "LLM Infrastructure", "Quantization"],
    metadata: { provider: "Meta", model: "llama-3.3-70b" },
  },
  {
    provider: "DeepSeek",
    model: "deepseek-r1",
    title: "DeepSeek R1 — Open-Weight Frontier Reasoning via Pure RL Training",
    content: "DeepSeek-R1 achieves frontier reasoning performance using pure reinforcement learning without supervised fine-tuning.",
    url: "https://github.com/deepseek-ai/DeepSeek-R1",
    tags: ["DeepSeek", "DeepSeek-R1", "Model Releases", "Open Source", "Reinforcement Learning"],
    metadata: { provider: "DeepSeek", model: "deepseek-r1", openWeight: true },
  },
  {
    provider: "Mistral AI",
    model: "mistral-large-2",
    title: "Mistral Large 2 — Multilingual LLM with Native Function Calling",
    content: "Mistral Large 2 delivers 128k context, strong multilingual performance, and reliable native function calling for agent applications.",
    url: "https://mistral.ai/news/mistral-large-2407/",
    tags: ["Mistral", "Open Source", "LLM", "Function Calling", "AI Engineering"],
    metadata: { provider: "Mistral AI", model: "mistral-large-2" },
  },
];

// ─────────────────────────────────────────────────────────────
//  Main Collector
// ─────────────────────────────────────────────────────────────
export class OfficialLabsCollector {
  public async collectOfficialSignals(): Promise<RawIntelligenceSignal[]> {
    const now = new Date().toISOString();

    // Fetch from all live provider feeds concurrently with per-source error isolation
    const fetchers: Array<{ name: string; fn: () => Promise<LLMRelease[]> }> = [
      { name: "OpenAI Blog RSS", fn: fetchOpenAIReleases },
      { name: "Anthropic Blog RSS", fn: fetchAnthropicReleases },
      { name: "Google AI Blog RSS", fn: fetchGoogleAIReleases },
      { name: "Meta AI Blog RSS", fn: fetchMetaAIReleases },
      { name: "Mistral Blog Feed", fn: fetchMistralReleases },
      { name: "HuggingFace Blog RSS", fn: fetchHuggingFacePapers },
      { name: "DeepSeek GitHub Releases", fn: fetchDeepSeekReleases },
    ];

    const results = await Promise.allSettled(fetchers.map((f) => f.fn()));
    const liveReleases: LLMRelease[] = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled" && result.value.length > 0) {
        console.log(`[OfficialLabsCollector] ✅ ${fetchers[i].name}: ${result.value.length} items`);
        liveReleases.push(...result.value.slice(0, 3)); // max 3 per provider to avoid overload
      } else {
        const reason = result.status === "rejected" ? result.reason?.message : "No items returned";
        console.warn(`[OfficialLabsCollector] ⚠️ ${fetchers[i].name} failed: ${reason}`);
      }
    });

    // Use live results if we got enough; supplement with fallback if sources are limited
    const releases = liveReleases.length >= 4 ? liveReleases : [...liveReleases, ...FALLBACK_SIGNALS];

    return releases.map((release, idx): RawIntelligenceSignal => ({
      id: `sig_lab_${idx}_${Date.now()}`,
      sourceId: `${release.provider.toLowerCase().replace(/\s/g, "_")}_official`,
      sourceName: `${release.provider} Official Releases & Blog`,
      category: "OFFICIAL_LAB" as any,
      authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      title: release.title,
      content: release.content,
      url: release.url,
      publishedAt: release.publishedAt || now,
      retrievedAt: now,
      metadata: release.metadata,
      tags: release.tags,
    }));
  }
}

export const officialLabsCollector = new OfficialLabsCollector();

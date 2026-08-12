/**
 * Smoke test: Verify live GitHub Trending + Official LLM provider feeds
 * Run with: npx ts-node --project packages/intelligence/tsconfig.json scratch/test_live_feeds.ts
 */

// Quick fetch-based test without importing compiled packages
async function testGitHubTrending() {
  console.log("\n=== GitHub Trending (ghapi.huchen.dev) ===");
  try {
    const res = await fetch("https://ghapi.huchen.dev/repositories?language=&since=daily", {
      headers: { "User-Agent": "PersonalBrandOS-Test/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    const repos: any[] = await res.json();
    console.log(`✅ Found ${repos.length} trending repos`);
    repos.slice(0, 5).forEach((r: any, i: number) => {
      console.log(`  ${i + 1}. ${r.author}/${r.name} — ⭐${r.stars || 0} (${r.language || "N/A"}) — +${r.currentPeriodStars || 0} today`);
    });
  } catch (e: any) {
    console.error("❌ GitHub ghapi failed:", e.message);
  }
}

async function testOpenAIBlog() {
  console.log("\n=== OpenAI Blog RSS ===");
  try {
    const res = await fetch("https://openai.com/blog/rss/", {
      headers: { "User-Agent": "PersonalBrandOS-Test/1.0", "Accept": "application/rss+xml" },
      signal: AbortSignal.timeout(10000),
    });
    const xml = await res.text();
    const titles = [...xml.matchAll(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/gi)].slice(1, 5).map(m => m[1]);
    if (titles.length > 0) {
      console.log(`✅ OpenAI Blog (${titles.length} recent posts):`);
      titles.forEach((t, i) => console.log(`  ${i + 1}. ${t.trim()}`));
    } else {
      // Try non-CDATA
      const titles2 = [...xml.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].slice(1, 5).map(m => m[1].replace(/<[^>]+>/g, "").trim());
      console.log(`✅ OpenAI Blog titles: ${titles2.join(" | ")}`);
    }
  } catch (e: any) {
    console.error("❌ OpenAI RSS failed:", e.message);
  }
}

async function testAnthropicBlog() {
  console.log("\n=== Anthropic Blog RSS ===");
  try {
    const res = await fetch("https://www.anthropic.com/blog.rss", {
      headers: { "User-Agent": "PersonalBrandOS-Test/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const titles = [...xml.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].slice(1, 4).map(m => m[1].replace(/<[^>]+>/g, "").trim());
    console.log(`✅ Anthropic Blog:`, titles);
  } catch (e: any) {
    console.error("❌ Anthropic RSS failed:", e.message);
  }
}

async function testHuggingFaceModels() {
  console.log("\n=== HuggingFace Trending Models ===");
  try {
    const res = await fetch("https://huggingface.co/api/models?sort=downloads&direction=-1&limit=5&full=false", {
      headers: { "User-Agent": "PersonalBrandOS-Test/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    const models: any[] = await res.json();
    console.log(`✅ Top ${models.length} HF models by downloads:`);
    models.slice(0, 5).forEach((m: any, i: number) => {
      console.log(`  ${i + 1}. ${m.modelId || m.id} — ${(m.downloads || 0).toLocaleString()} downloads — ${m.pipeline_tag || "general"}`);
    });
  } catch (e: any) {
    console.error("❌ HuggingFace API failed:", e.message);
  }
}

async function testHackerNews() {
  console.log("\n=== Hacker News Top Stories (AI-filtered) ===");
  try {
    const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
      signal: AbortSignal.timeout(8000),
    });
    const ids: number[] = await idsRes.json();
    const aiKeywords = ["llm", "gpt", "claude", "gemini", "agent", "openai", "anthropic", "rust", "typescript", "kubernetes", "security", "performance"];
    
    const storyFetches = ids.slice(0, 25).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { signal: AbortSignal.timeout(5000) })
        .then(r => r.json()).catch(() => null)
    );
    const stories = (await Promise.all(storyFetches)).filter((s: any) =>
      s && s.type === "story" && s.title &&
      aiKeywords.some(kw => s.title.toLowerCase().includes(kw))
    );
    console.log(`✅ ${stories.length} relevant tech stories from top 25:`);
    stories.slice(0, 3).forEach((s: any, i: number) => console.log(`  ${i + 1}. [${s.score}pts] ${s.title}`));
  } catch (e: any) {
    console.error("❌ HN API failed:", e.message);
  }
}

async function testDevTo() {
  console.log("\n=== Dev.to Live API ===");
  try {
    const res = await fetch("https://dev.to/api/articles?top=3&tag=ai&per_page=4", {
      headers: { "User-Agent": "PersonalBrandOS-Test/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    const articles: any[] = await res.json();
    console.log(`✅ Dev.to top AI articles (${articles.length} found):`);
    articles.slice(0, 3).forEach((a: any, i: number) => {
      console.log(`  ${i + 1}. ${a.title} — ${a.public_reactions_count} reactions`);
    });
  } catch (e: any) {
    console.error("❌ Dev.to API failed:", e.message);
  }
}

async function main() {
  console.log("🔴 Live Intelligence Feed Smoke Test");
  console.log(`📅 ${new Date().toISOString()}`);
  console.log("─".repeat(60));

  await testGitHubTrending();
  await testOpenAIBlog();
  await testAnthropicBlog();
  await testHuggingFaceModels();
  await testHackerNews();
  await testDevTo();

  console.log("\n" + "─".repeat(60));
  console.log("✅ Smoke test complete. Check results above.");
}

main().catch(console.error);

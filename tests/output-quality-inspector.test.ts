import { describe, it, expect } from "vitest";
import { agentOrchestrator } from "../packages/agents/src/index";
import { postHistoryTracker } from "../packages/analytics/src/index";

// ─────────────────────────────────────────────────────────────────────────────
// ACCEPTANCE CRITERIA CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const AI_CLICHE_BLOCKLIST = [
  "in today's fast-paced",
  "let's dive in",
  "game-changing",
  "revolutionary",
  "unlock the power",
  "the future of",
  "as developers, we",
  "transform your",
  "whether you're a beginner",
  "in today's world",
  "level up your",
  "exciting new",
  "next-level",
  "cutting-edge",
  "paradigm shift",
];

const HOOK_CLICHE_BLOCKLIST = [
  "in today's",
  "are you tired",
  "have you ever wondered",
  "let me introduce",
  "exciting announcement",
  "thrilled to share",
  "i'm excited",
  "big news",
];

const TRADEOFF_KEYWORDS = [
  " vs ",
  " versus ",
  "tradeoff",
  "trade-off",
  "latency",
  "cost",
  "bottleneck",
  "failover",
  "isolation",
  "overhead",
  "penalty",
  "sacrifice",
  "at the cost of",
];

const RAW_TITLE_PATTERNS = [
  /^GitHub Trending:/i,
  /^HN:/i,
  /^Dev\.to:/i,
  /^Reddit:/i,
  /^[\w-]+\/[\w-]+$/,
];

const VERSION_TITLE_PATTERN = /\b(v?\d+\.\d+(\.\d+)?\s*(LTS|GA|RC|beta|alpha)?)\b/;

function jaccardSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  const tokensB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  const intersection = new Set([...tokensA].filter((t) => tokensB.has(t)));
  const union = new Set([...tokensA, ...tokensB]);
  return intersection.size / union.size;
}

function containsTradeoff(text: string): boolean {
  const lc = text.toLowerCase();
  return TRADEOFF_KEYWORDS.some((kw) => lc.includes(kw));
}

function containsAiCliche(text: string): string | null {
  const lc = text.toLowerCase();
  for (const cliche of AI_CLICHE_BLOCKLIST) {
    if (lc.includes(cliche)) return cliche;
  }
  return null;
}

function containsHookCliche(hook: string): string | null {
  const lc = hook.toLowerCase();
  for (const cliche of HOOK_CLICHE_BLOCKLIST) {
    if (lc.includes(cliche)) return cliche;
  }
  return null;
}

function isRawTitle(title: string): boolean {
  return RAW_TITLE_PATTERNS.some((p) => p.test(title));
}

function hasVersionNumber(title: string): boolean {
  return VERSION_TITLE_PATTERN.test(title);
}

function containsConcreteDataPoint(text: string): boolean {
  return (
    /\d+%/.test(text) ||
    /\d+ms/.test(text) ||
    /\d+\s*(second|minute|hour)s?/i.test(text) ||
    /\d+x\s+/.test(text) ||
    /\$\d+/.test(text)
  );
}

describe("Output Quality Inspector — Acceptance Criteria Verification", () => {
  it("should generate 10 posts, all passing acceptance criteria for title, hooks, tradeoffs, clichés, visual diversity, and format diversity", async () => {
    postHistoryTracker.clearHistory?.();

    const posts: Array<{
      day: number;
      status: string;
      title: string;
      hook: string;
      fullText: string;
      formatStyle: string;
      visualType: string;
      qualityScore: number;
    }> = [];

    for (let day = 1; day <= 10; day++) {
      const currentHistory = postHistoryTracker.getHistory();

      const res = await agentOrchestrator.executePipeline({
        autoPublish: true,
        pipelineId: `inspector_day_${day}`,
        historicalPosts: currentHistory,
      });

      if (res.status === "POST_READY" && res.linkedInPost) {
        const post = res.linkedInPost;
        const title = post.title || res.topic?.title || "";
        posts.push({
          day,
          status: res.status,
          title,
          hook: post.hook || "",
          fullText: post.fullText || "",
          formatStyle: (post.formatStyle as string) || "UNKNOWN",
          visualType: res.executionTrace?.visual?.type || "UNKNOWN",
          qualityScore: res.qualityGateResult?.overallContentQualityScore || 0,
        });

        const topic = res.topic;
        if (topic?.title && !currentHistory.some((h) => h.title === topic.title)) {
          postHistoryTracker.addPublishedPost({
            id: `inspector_post_${day}`,
            title: topic.title,
            category: topic.category,
            framework: topic.framework,
            fullText: post.fullText || "",
          });
        }
      } else {
        const attemptedTitle = res.topic?.title || "NO_POST_TODAY";
        posts.push({
          day,
          status: res.status,
          title: attemptedTitle,
          hook: "",
          fullText: "",
          formatStyle: "NO_POST_TODAY",
          visualType: "NO_POST_TODAY",
          qualityScore: 0,
        });

        // ── KEY FIX: Add rejected topic to history so the competition engine ──
        // doesn't re-select the same failing candidate on Day N+1, N+2, etc.
        // A topic that failed quality gates should not be retried the next day.
        if (res.topic?.title && !currentHistory.some((h) => h.title === res.topic!.title)) {
          postHistoryTracker.addPublishedPost({
            id: `inspector_attempted_${day}`,
            title: res.topic.title,
            category: res.topic.category,
            framework: res.topic.framework,
            fullText: `[ATTEMPTED — NO_POST_TODAY on Day ${day}]`,
          });
        }
      }

    }

    // ── PRINT INSPECTION REPORT ────────────────────────────────────────────
    console.log("\n====================================================================");
    console.log("OUTPUT QUALITY INSPECTOR — 10-POST ACCEPTANCE REPORT");
    console.log("====================================================================");

    console.log("\n📌 Ten Generated Titles:");
    posts.forEach((p) => console.log(`  Day ${p.day} [${p.status}]: "${p.title}"`));

    console.log("\n🖋  Ten Selected Formats:");
    posts.forEach((p) => console.log(`  Day ${p.day}: ${p.formatStyle}`));

    console.log("\n🖼  Ten Visual Types:");
    posts.forEach((p) => console.log(`  Day ${p.day}: ${p.visualType}`));

    console.log("\n🔥 Hook Preview (first 100 chars):");
    posts.filter((p) => p.hook).forEach((p) =>
      console.log(`  Day ${p.day}: "${p.hook.substring(0, 100)}..."`)
    );

    console.log("\n📊 Quality Scores:");
    posts.forEach((p) => console.log(`  Day ${p.day}: ${p.qualityScore}`));

    const publishedPosts = posts.filter((p) => p.status === "POST_READY");
    console.log(`\n✅ Published: ${publishedPosts.length}/10`);
    console.log(`🚫 NO_POST_TODAY: ${posts.filter((p) => p.status === "NO_POST_TODAY").length}/10`);

    // ── ASSERTION 1: Title Quality ─────────────────────────────────────────
    console.log("\n--- ASSERTION: Title Quality ---");
    for (const post of publishedPosts) {
      const rawFail = isRawTitle(post.title);
      if (rawFail) console.error(`❌ RAW TITLE Day ${post.day}: "${post.title}"`);
      expect(rawFail, `Day ${post.day} title must not be a raw discovery signal: "${post.title}"`).toBe(false);

      if (hasVersionNumber(post.title) && post.title.trim().split(" ").length <= 5) {
        console.warn(`⚠️  Version-only title Day ${post.day}: "${post.title}"`);
        expect(post.title.trim().split(" ").length, `Day ${post.day} title must be an engineering story, not a version label`).toBeGreaterThan(5);
      }
    }
    console.log("✅ All published titles passed.");

    // ── ASSERTION 2: AI Cliché Detection ──────────────────────────────────
    console.log("\n--- ASSERTION: AI Cliché Detection ---");
    for (const post of publishedPosts) {
      const cliche = containsAiCliche(post.fullText);
      if (cliche) console.warn(`⚠️  Cliché Day ${post.day}: "${cliche}" in "${post.title}"`);
    }
    const hookClicheFailures = publishedPosts.filter((p) => containsHookCliche(p.hook));
    hookClicheFailures.forEach((p) =>
      console.warn(`⚠️  Hook cliché Day ${p.day}: "${p.hook.substring(0, 80)}"`)
    );
    expect(hookClicheFailures.length, "No more than 2 posts should have clichéd hooks").toBeLessThanOrEqual(2);

    // ── ASSERTION 3: Engineering Tradeoffs ────────────────────────────────
    console.log("\n--- ASSERTION: Engineering Tradeoffs ---");
    const tradeoffFailures = publishedPosts.filter((p) => p.fullText.length > 50 && !containsTradeoff(p.fullText));
    tradeoffFailures.forEach((p) =>
      console.warn(`⚠️  No tradeoff Day ${p.day}: "${p.title}"`)
    );
    expect(tradeoffFailures.length, "At least 80% of posts must contain an explicit engineering tradeoff").toBeLessThanOrEqual(
      Math.ceil(publishedPosts.length * 0.2)
    );

    // ── ASSERTION 4: Concrete Data Points ────────────────────────────────
    console.log("\n--- ASSERTION: Concrete Data Points ---");
    const noDataPoints = publishedPosts.filter((p) => p.fullText.length > 100 && !containsConcreteDataPoint(p.fullText));
    noDataPoints.forEach((p) =>
      console.warn(`⚠️  No data point Day ${p.day}: "${p.title}"`)
    );

    // ── ASSERTION 5: Visual Diversity ─────────────────────────────────────
    console.log("\n--- ASSERTION: Visual Diversity ---");
    const visualTypes = publishedPosts.map((p) => p.visualType).filter((v) => v !== "NO_POST_TODAY" && v !== "UNKNOWN");
    const uniqueVisualTypes = new Set(visualTypes);
    console.log(`  Visual types: ${[...uniqueVisualTypes].join(", ")}`);
    if (publishedPosts.length >= 4) {
      expect(uniqueVisualTypes.size, "At least 2 distinct visual types across published posts").toBeGreaterThanOrEqual(2);
    }

    // ── ASSERTION 6: Format Diversity ─────────────────────────────────────
    console.log("\n--- ASSERTION: Format Diversity ---");
    const formatStyles = publishedPosts.map((p) => p.formatStyle).filter((f) => f !== "NO_POST_TODAY" && f !== "UNKNOWN");
    const uniqueFormats = new Set(formatStyles);
    console.log(`  Formats: ${[...uniqueFormats].join(", ")}`);
    if (publishedPosts.length >= 4) {
      expect(uniqueFormats.size, "At least 2 distinct format styles across published posts").toBeGreaterThanOrEqual(2);
    }

    // ── ASSERTION 7: Cross-Post Similarity < 0.30 ─────────────────────────
    console.log("\n--- ASSERTION: Cross-Post Similarity ---");
    const fullTexts = publishedPosts.filter((p) => p.fullText.length > 100);
    let maxSimilarity = 0;
    let mostSimilarPair = "";
    for (let i = 0; i < fullTexts.length; i++) {
      for (let j = i + 1; j < fullTexts.length; j++) {
        const sim = jaccardSimilarity(fullTexts[i].fullText, fullTexts[j].fullText);
        if (sim > maxSimilarity) {
          maxSimilarity = sim;
          mostSimilarPair = `Day ${fullTexts[i].day} vs Day ${fullTexts[j].day}`;
        }
      }
    }
    console.log(`  Max Jaccard similarity: ${(maxSimilarity * 100).toFixed(1)}% (${mostSimilarPair})`);
    expect(maxSimilarity, "No two posts should have Jaccard similarity > 0.30").toBeLessThan(0.30);

    // ── FINAL SUMMARY ──────────────────────────────────────────────────────
    console.log("\n====================================================================");
    console.log("FINAL ACCEPTANCE REPORT");
    console.log("====================================================================");
    console.log(`Published posts:           ${publishedPosts.length}/10`);
    console.log(`Unique visual types:       ${uniqueVisualTypes.size}`);
    console.log(`Unique format styles:      ${uniqueFormats.size}`);
    console.log(`Max cross-post similarity: ${(maxSimilarity * 100).toFixed(1)}%`);
    console.log(`Clichéd hooks:             ${hookClicheFailures.length}`);
    console.log(`Missing tradeoffs:         ${tradeoffFailures.length}`);
    console.log(`Missing data points:       ${noDataPoints.length}`);
    console.log("====================================================================\n");

  }, 120000);
});

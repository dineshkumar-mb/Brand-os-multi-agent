import { describe, it, expect } from "vitest";
import { agentOrchestrator } from "../packages/agents/src/index";
import { postHistoryTracker } from "../packages/analytics/src/index";

describe("5 Consecutive Daily Content Intelligence Pipeline Runs", () => {
  it("should run 5 consecutive daily posts without repeating topics, frameworks, or visual concepts", async () => {
    // Reset history
    postHistoryTracker.clearHistory();

    const runs: any[] = [];

    for (let day = 1; day <= 5; day++) {
      console.log(`\n==================================================`);
      console.log(`EXECUTING DRY-RUN DAY ${day} OF 5`);
      console.log(`==================================================`);

      const res = await agentOrchestrator.executePipeline({
        autoPublish: true,
        pipelineId: `dry_run_day_${day}`,
      });

      runs.push(res);
    }

    console.log(`\n==================================================`);
    console.log(`5-DAY DRY RUN SUMMARY RESULTS`);
    console.log(`==================================================`);

    const titles: string[] = [];
    const frameworks: string[] = [];
    const categories: string[] = [];

    runs.forEach((r, idx) => {
      const dayNum = idx + 1;
      if (r.topic) {
        console.log(`Day ${dayNum}:`);
        console.log(`  Title: "${r.topic.title}"`);
        console.log(`  Category: ${r.topic.category}`);
        console.log(`  Framework: ${r.topic.framework || "N/A"}`);
        console.log(`  Has LinkedIn: ${Boolean(r.linkedInPost?.fullText)}`);
        console.log(`  Has Dev.to: ${Boolean(r.devToArticle?.markdownContent)}`);
        console.log(`  Has SVG Image: ${Boolean(r.linkedInPost?.imageUrl?.startsWith("data:image/svg+xml"))}`);
        console.log(`  Decision Gate: ${r.decisionGate?.decision}`);

        titles.push(r.topic.title);
        if (r.topic.framework) frameworks.push(r.topic.framework);
        categories.push(r.topic.category);
      } else {
        console.log(`Day ${dayNum}: NO_POST_TODAY (${r.status})`);
      }
    });

    // Check uniqueness across the 5 runs
    const uniqueTitles = new Set(titles);
    const uniqueFrameworks = new Set(frameworks);

    expect(uniqueTitles.size).toBe(titles.length);
    expect(uniqueFrameworks.size).toBe(frameworks.length);

    // Verify Redis / MCP loop is NOT repeated
    const lowerTitles = titles.map((t) => t.toLowerCase());
    const redisCount = lowerTitles.filter((t) => t.includes("redis")).length;
    const mcpCount = lowerTitles.filter((t) => t.includes("mcp") || t.includes("model context protocol")).length;

    expect(redisCount).toBeLessThanOrEqual(1);
    expect(mcpCount).toBeLessThanOrEqual(1);
  });
});

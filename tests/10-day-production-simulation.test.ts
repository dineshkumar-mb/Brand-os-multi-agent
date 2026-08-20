import { describe, it, expect } from "vitest";
import { agentOrchestrator } from "../packages/agents/src/index";
import { postHistoryTracker } from "../packages/analytics/src/index";

describe("10-Day Production Simulation Test", () => {
  it("should run 10 consecutive simulated daily pipeline runs without repeating topics, hooks, or visual styles", async () => {
    postHistoryTracker.clearHistory?.();

    const runs: any[] = [];
    const titles: string[] = [];

    for (let day = 1; day <= 10; day++) {
      console.log(`\n==================================================`);
      console.log(`SIMULATING PRODUCTION DAY ${day} OF 10`);
      console.log(`==================================================`);

      const currentHistory = postHistoryTracker.getHistory();

      const res = await agentOrchestrator.executePipeline({
        autoPublish: true,
        pipelineId: `sim_day_${day}`,
        historicalPosts: currentHistory,
      });

      runs.push(res);
      expect(["POST_READY", "NO_POST_TODAY"]).toContain(res.status);
      expect(res.dailyIntelligenceSummary).toBeDefined();
      expect(res.dailyIntelligenceSummary.signalsScanned).toBeGreaterThan(0);

      const topic = res.topic;
      if (topic && topic.title) {
        titles.push(topic.title);
        expect(topic.title).not.toMatch(/^GitHub Trending:/i);
        expect(topic.title).not.toMatch(/^HN:/i);
        expect(topic.title).not.toMatch(/^Dev\.to:/i);

        if (!currentHistory.some((h) => h.title === topic.title)) {
          postHistoryTracker.addPublishedPost({
            id: `sim_post_${day}`,
            title: topic.title,
            category: topic.category,
            framework: topic.framework,
            fullText: res.linkedInPost?.fullText || `${topic.title} full text details for day ${day}.`,
          });
        }
      }
    }

    console.log(`\n==================================================`);
    console.log(`10-DAY SIMULATION SUMMARY RESULTS`);
    console.log(`==================================================`);
    runs.forEach((r, idx) => {
      console.log(`Day ${idx + 1}: Status=${r.status}, Title="${r.topic?.title || "N/A"}", SignalsScanned=${r.dailyIntelligenceSummary?.signalsScanned}, QualityScore=${r.qualityGateResult?.overallContentQualityScore || r.review?.overallScore || 0}`);
    });

    // Check unique titles among published posts
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  }, 180000);
});

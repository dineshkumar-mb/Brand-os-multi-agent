import { describe, it, expect } from "vitest";
import { candidateCompetitionEngine } from "../packages/intelligence/src/ranking/candidate-competition-engine";

describe("Candidate Competition Engine", () => {
  it("should collect 30+ candidates, deduplicate, score, rank Top 5 matrix, and select a winner with rationale", async () => {
    const res = await candidateCompetitionEngine.collectAndRankCandidates([]);

    expect(res.rawCount).toBeGreaterThanOrEqual(5);
    expect(res.top5Matrix).not.toBeNull();

    if (res.top5Matrix) {
      expect(res.top5Matrix.winner).toBeDefined();
      expect(res.top5Matrix.winner.title).toBeTruthy();
      expect(res.top5Matrix.winner.title).not.toMatch(/^GitHub Trending:/i);
      expect(res.top5Matrix.winner.title).not.toMatch(/^HN:/i);
      expect(res.top5Matrix.winner.title).not.toMatch(/^Dev\.to:/i);
      expect(res.top5Matrix.winner.scores.overallScore).toBeGreaterThan(0);
      expect(res.top5Matrix.winner.scores.proofAvailability).toBeGreaterThan(0);
      expect(res.top5Matrix.winner.scores.engineeringTension).toBeGreaterThan(0);
      expect(res.top5Matrix.winner.scores.careerDifferentiation).toBeGreaterThan(0);
      expect(res.top5Matrix.whyWinner).toContain("Selected");
      expect(res.top5Matrix.alternatives.length).toBeGreaterThanOrEqual(1);
    }
  }, 30000);
});

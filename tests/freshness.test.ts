import { describe, it, expect } from "vitest";
import { freshTrendDiscoveryEngine } from "../packages/intelligence/src/ranking/fresh-trend-discovery";

describe("Trend Engine Freshness Calculations & Category Max Age Policies", () => {
  it("should calculate correct freshness decay score based on hours elapsed since publication", () => {
    const now = new Date();

    // < 6 hours -> 100
    const t5h = new Date(now.getTime() - 5 * 3600000).toISOString();
    expect(freshTrendDiscoveryEngine.calculateFreshnessScore(t5h)).toBe(100);

    // 6-24 hours -> 95
    const t12h = new Date(now.getTime() - 12 * 3600000).toISOString();
    expect(freshTrendDiscoveryEngine.calculateFreshnessScore(t12h)).toBe(95);

    // 1-2 days -> 85
    const t36h = new Date(now.getTime() - 36 * 3600000).toISOString();
    expect(freshTrendDiscoveryEngine.calculateFreshnessScore(t36h)).toBe(85);

    // 3-5 days -> 70
    const t4d = new Date(now.getTime() - 4 * 24 * 3600000).toISOString();
    expect(freshTrendDiscoveryEngine.calculateFreshnessScore(t4d)).toBe(70);

    // 6-7 days -> 50
    const t6d = new Date(now.getTime() - 6 * 24 * 3600000).toISOString();
    expect(freshTrendDiscoveryEngine.calculateFreshnessScore(t6d)).toBe(50);

    // 8-14 days -> 25
    const t10d = new Date(now.getTime() - 10 * 24 * 3600000).toISOString();
    expect(freshTrendDiscoveryEngine.calculateFreshnessScore(t10d)).toBe(25);

    // > 14 days -> 0
    const t20d = new Date(now.getTime() - 20 * 24 * 3600000).toISOString();
    expect(freshTrendDiscoveryEngine.calculateFreshnessScore(t20d)).toBe(0);
  });

  it("should enforce category-specific max age limits", () => {
    const now = new Date();

    // Official Tech Release: Max 48h
    const techReleaseOld = new Date(now.getTime() - 50 * 3600000).toISOString();
    const techReleaseFresh = new Date(now.getTime() - 20 * 3600000).toISOString();

    expect(freshTrendDiscoveryEngine.evaluateFreshness(techReleaseOld, "AI Engineering", "New Version Release of TypeScript").rejected).toBe(true);
    expect(freshTrendDiscoveryEngine.evaluateFreshness(techReleaseFresh, "AI Engineering", "New Version Release of TypeScript").rejected).toBe(false);

    // Major GitHub Release: Max 72h
    const githubReleaseOld = new Date(now.getTime() - 80 * 3600000).toISOString();
    const githubReleaseFresh = new Date(now.getTime() - 40 * 3600000).toISOString();

    expect(freshTrendDiscoveryEngine.evaluateFreshness(githubReleaseOld, "Open Source", "github releases deepseek").rejected).toBe(true);
    expect(freshTrendDiscoveryEngine.evaluateFreshness(githubReleaseFresh, "Open Source", "github releases deepseek").rejected).toBe(false);

    // Community Discussion: Max 72h
    const communityOld = new Date(now.getTime() - 75 * 3600000).toISOString();
    const communityFresh = new Date(now.getTime() - 20 * 3600000).toISOString();

    expect(freshTrendDiscoveryEngine.evaluateFreshness(communityOld, "Community", "HN: How Vite 6 works").rejected).toBe(true);
    expect(freshTrendDiscoveryEngine.evaluateFreshness(communityFresh, "Community", "HN: How Vite 6 works").rejected).toBe(false);

    // Security & Research: Max 7 days
    const securityOld = new Date(now.getTime() - 8 * 24 * 3600000).toISOString();
    const securityFresh = new Date(now.getTime() - 4 * 24 * 3600000).toISOString();

    expect(freshTrendDiscoveryEngine.evaluateFreshness(securityOld, "Security", "Severe vulnerability detected in package").rejected).toBe(true);
    expect(freshTrendDiscoveryEngine.evaluateFreshness(securityFresh, "Security", "Severe vulnerability detected in package").rejected).toBe(false);
  });

  it("should not allow high stars or popularity metrics to override freshness checks for stale events", () => {
    const now = new Date();
    // 15 days ago -> stale
    const staleDate = new Date(now.getTime() - 15 * 24 * 3600000).toISOString();

    // Even if it has 50,000 stars or huge trend velocity, it must be rejected
    const evalResult = freshTrendDiscoveryEngine.evaluateFreshness(staleDate, "AI Engineering", "Very Popular GitHub Project with 50k stars");
    expect(evalResult.rejected).toBe(true);
    expect(evalResult.freshnessScore).toBe(0);
  });
});

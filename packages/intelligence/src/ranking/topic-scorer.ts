import { SourceAuthorityLevel } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export interface DetailedTopicScores {
  careerRelevanceScore: number;         // 20%
  personalExperienceMatch: number;      // 20%
  technicalImportanceScore: number;     // 15%
  sourceAuthorityScore: number;         // 15%
  originalityOpportunityScore: number; // 10%
  trendVelocityScore: number;           // 10%
  contentGapScore: number;              // 5%
  developerAdoptionScore: number;       // 5%
  overallScore: number;
}

export class TopicScorerEngine {
  public calculateScores(
    event: CanonicalEvent,
    experienceMatchScore: number
  ): DetailedTopicScores {
    // 1. Source Authority (15%)
    let sourceAuthorityScore = 40;
    const hasLevel1 = event.sources.some(
      (s) => s.authorityLevel === SourceAuthorityLevel.LEVEL_1_PRIMARY
    );
    const hasLevel2 = event.sources.some(
      (s) => s.authorityLevel === SourceAuthorityLevel.LEVEL_2_TECHNICAL
    );
    if (hasLevel1) sourceAuthorityScore = 95;
    else if (hasLevel2) sourceAuthorityScore = 80;

    // 2. Trend Velocity (10%) - normalize 0-10 to 0-100
    const trendVelocityScore = Math.min(100, event.trendVelocity * 10);

    // 3. Technical Importance (15%)
    let technicalImportanceScore = 75;
    const tLower = event.title.toLowerCase();
    if (
      tLower.includes("mcp") ||
      tLower.includes("architecture") ||
      tLower.includes("deepseek") ||
      tLower.includes("reasoning")
    ) {
      technicalImportanceScore = 95;
    }

    // 4. Career Relevance (20%)
    let careerRelevanceScore = 80;
    if (tLower.includes("mcp") || tLower.includes("agent") || tLower.includes("system design")) {
      careerRelevanceScore = 95;
    }

    // 5. Personal Experience Match (20%)
    const personalExperienceMatch = experienceMatchScore;

    // 6. Originality Opportunity (10%)
    const originalityOpportunityScore = 90;

    // 7. Content Gap (5%)
    const contentGapScore = 85;

    // 8. Developer Adoption (5%)
    const developerAdoptionScore = Math.min(100, (event.sources.length * 20) + 40);

    // Exact user weighted formula:
    // 20% Career Relevance + 20% Personal Experience + 15% Tech Importance + 15% Source Authority + 10% Originality + 10% Velocity + 5% Content Gap + 5% Adoption
    const overallScore = parseFloat(
      (
        careerRelevanceScore * 0.20 +
        personalExperienceMatch * 0.20 +
        technicalImportanceScore * 0.15 +
        sourceAuthorityScore * 0.15 +
        originalityOpportunityScore * 0.10 +
        trendVelocityScore * 0.10 +
        contentGapScore * 0.05 +
        developerAdoptionScore * 0.05
      ).toFixed(1)
    );

    return {
      careerRelevanceScore,
      personalExperienceMatch,
      technicalImportanceScore,
      sourceAuthorityScore,
      originalityOpportunityScore,
      trendVelocityScore,
      contentGapScore,
      developerAdoptionScore,
      overallScore,
    };
  }
}

export const topicScorerEngine = new TopicScorerEngine();

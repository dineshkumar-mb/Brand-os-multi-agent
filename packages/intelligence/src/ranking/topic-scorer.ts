import { SourceAuthorityLevel, DEFAULT_SCORING_WEIGHTS, ScoringWeightsConfig } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export interface DetailedTopicScores {
  trendFreshnessScore: number;          // 18%
  trendVelocityScore: number;           // 15%
  technicalImportanceScore: number;     // 14%
  careerRelevanceScore: number;         // 14%
  personalExperienceMatch: number;      // 10%
  contentGapScore: number;              // 10%
  originalityOpportunityScore: number; // 8%
  audienceInterestScore: number;        // 6%
  sourceAuthorityScore: number;         // 5%
  developerAdoptionScore: number;       // 80
  overallScore: number;
}

export class TopicScorerEngine {
  private weights: ScoringWeightsConfig = DEFAULT_SCORING_WEIGHTS;

  constructor(customWeights?: Partial<ScoringWeightsConfig>) {
    this.weights = { ...DEFAULT_SCORING_WEIGHTS, ...(customWeights || {}) };
  }

  public setWeights(customWeights: ScoringWeightsConfig) {
    this.weights = customWeights;
  }

  public calculateScores(
    event: CanonicalEvent,
    experienceMatchScore: number
  ): DetailedTopicScores {
    const w = this.weights && this.weights.trendFreshness !== undefined ? this.weights : DEFAULT_SCORING_WEIGHTS;

    // 1. Source Authority (5%)
    let sourceAuthorityScore = 40;
    const hasLevel1 = event.sources.some((s) => s.authorityLevel === SourceAuthorityLevel.LEVEL_1_PRIMARY);
    const hasLevel2 = event.sources.some((s) => s.authorityLevel === SourceAuthorityLevel.LEVEL_2_TECHNICAL);
    const hasLevel3 = event.sources.some((s) => s.authorityLevel === SourceAuthorityLevel.LEVEL_3_COMMUNITY);

    if (hasLevel1) sourceAuthorityScore = 95;
    else if (hasLevel2) sourceAuthorityScore = 80;
    else if (hasLevel3) sourceAuthorityScore = 45;
    else sourceAuthorityScore = 30; // Level 4 Discovery or unverified blogs


    // 2. Trend Velocity (15%) - 0-100 score
    const trendVelocityScore = Math.min(100, Math.max(10, event.trendVelocity * 10));

    // 3. Trend Freshness (18%) - based on source timestamp
    const firstSeen = new Date(event.firstSeenAt).getTime();
    const hoursAgo = Math.max(0, (Date.now() - firstSeen) / 3600000);
    let trendFreshnessScore = 100;
    if (hoursAgo > 336) trendFreshnessScore = 15;      // > 14 days
    else if (hoursAgo > 168) trendFreshnessScore = 40; // 7 - 14 days
    else if (hoursAgo > 72) trendFreshnessScore = 65;  // 3 - 7 days
    else if (hoursAgo > 24) trendFreshnessScore = 85;  // 1 - 3 days
    else trendFreshnessScore = 100;                    // < 24h

    // 4. Technical Importance (14%) - cross source confirmation + authority
    const sourceCountBonus = Math.min(30, event.sources.length * 10);
    const technicalImportanceScore = Math.min(100, 60 + sourceCountBonus + (hasLevel1 ? 10 : 0));

    // 5. Career Relevance (14%) - software engineering relevance
    const careerRelevanceScore = 85;

    // 6. Personal Experience Match (10%) - angle differentiator
    const personalExperienceMatch = Math.min(100, Math.max(10, experienceMatchScore));

    // 7. Content Gap (10%)
    const contentGapScore = 85;

    // 8. Originality Opportunity (8%)
    const originalityOpportunityScore = 90;

    // 9. Audience Interest (6%)
    const audienceInterestScore = Math.min(100, 40 + event.sources.length * 15);

    const developerAdoptionScore = 80;

    // Configurable Normalized Weighted Score
    const overallScore = parseFloat(
      (
        (w.trendFreshness ?? 0.18) * trendFreshnessScore +
        (w.trendVelocity ?? 0.15) * trendVelocityScore +
        (w.technicalImportance ?? 0.14) * technicalImportanceScore +
        (w.careerRelevance ?? 0.14) * careerRelevanceScore +
        (w.personalExperience ?? 0.10) * personalExperienceMatch +
        (w.contentGap ?? 0.10) * contentGapScore +
        (w.originality ?? 0.08) * originalityOpportunityScore +
        (w.audienceInterest ?? 0.06) * audienceInterestScore +
        (w.sourceAuthority ?? 0.05) * sourceAuthorityScore
      ).toFixed(1)
    );

    return {
      trendFreshnessScore,
      trendVelocityScore,
      technicalImportanceScore,
      careerRelevanceScore,
      personalExperienceMatch,
      contentGapScore,
      originalityOpportunityScore,
      audienceInterestScore,
      sourceAuthorityScore,
      developerAdoptionScore,
      overallScore,
    };
  }
}

export const topicScorerEngine = new TopicScorerEngine();



import {
  ContentOpportunity,
  ContentAngle,
  Platform,
} from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";
import { whyCareAnalyzer } from "../signals/why-care-analyzer.js";
import { experienceMatcherEngine } from "../knowledge/experience-matcher.js";
import { topicScorerEngine } from "./topic-scorer.js";
import { doNotPublishGate } from "./do-not-publish.js";
import { evidenceTrackerEngine } from "../provenance/evidence-tracker.js";

export class ContentOpportunityGenerator {
  public generateFromEvent(event: CanonicalEvent): ContentOpportunity {
    // 1. Analyze Why Care
    const whyCare = whyCareAnalyzer.analyzeWhyCare(event);

    // 2. Experience Match
    const expResult = experienceMatcherEngine.matchExperience(event);

    // 3. Topic Scoring (User Weighted Formula)
    const scores = topicScorerEngine.calculateScores(event, expResult.matchPercentage);

    // 4. Evidence Tracking
    const evidence = evidenceTrackerEngine.createEvidenceProvenance(event);

    // 5. Angle Selection
    let recommendedAngle: ContentAngle = "ARCHITECTURE_ANALYSIS";
    const titleLower = event.title.toLowerCase();
    if (titleLower.includes("deepseek") || titleLower.includes("benchmark")) {
      recommendedAngle = "PERFORMANCE_COMPARISON";
    } else if (titleLower.includes("react") || titleLower.includes("next")) {
      recommendedAngle = "IMPLEMENTATION_TUTORIAL";
    } else if (titleLower.includes("redis") || titleLower.includes("queue")) {
      recommendedAngle = "PRODUCTION_TRADEOFF";
    }

    // 6. Target Audience
    const targetAudience = [
      { role: "Recruiter", relevanceReason: "High signal on enterprise AI & modern backend stack expertise." },
      { role: "Engineering Manager", relevanceReason: "Demonstrates practical production architecture decision making." },
      { role: "Senior Engineer", relevanceReason: "Deep technical insight into tool contracts and system design." },
    ];

    const opportunity: ContentOpportunity = {
      id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      canonicalEventId: event.eventId,
      topic: event.title,
      summary: event.summary,
      careerRelevanceScore: scores.careerRelevanceScore,
      personalExperienceMatch: scores.personalExperienceMatch,
      technicalImportanceScore: scores.technicalImportanceScore,
      sourceAuthorityScore: scores.sourceAuthorityScore,
      originalityOpportunityScore: scores.originalityOpportunityScore,
      trendVelocityScore: scores.trendVelocityScore,
      contentGapScore: scores.contentGapScore,
      developerAdoptionScore: scores.developerAdoptionScore,
      overallScore: scores.overallScore,
      whyCare,
      experienceEvidence: expResult.evidence,
      recommendedAngle,
      targetAudience,
      targetPlatforms: [Platform.LINKEDIN, Platform.DEVTO],
      evidence,
      status: "CANDIDATE",
      expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3-day validity
    };

    // 7. Evaluate Do-Not-Publish Gate
    const rejectionCheck = doNotPublishGate.evaluateOpportunity(opportunity);
    if (rejectionCheck.shouldReject) {
      opportunity.status = "REJECTED";
      opportunity.rejectionReason = rejectionCheck.rejectionReason;
    } else {
      opportunity.status = "APPROVED";
    }

    return opportunity;
  }
}

export const contentOpportunityGenerator = new ContentOpportunityGenerator();

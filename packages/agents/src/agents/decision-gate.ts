import {
  AgentType,
  AgentResult,
  DecisionGateResult,
  OriginalityCheckResult,
  VisualValidationResult,
  Topic,
  LinkedInPostPayload,
  DevToArticlePayload,
} from "@brand-os/shared";
import { TechnicalReviewResult } from "./technical-reviewer";

export class DecisionGateAgent {
  public evaluateDecision(
    topic: Topic | null,
    post: LinkedInPostPayload | null,
    article: DevToArticlePayload | null,
    originality: OriginalityCheckResult,
    techReview: TechnicalReviewResult,
    visualValidation: VisualValidationResult,
    clichésRemoved: number,
    pipelineId?: string
  ): AgentResult<DecisionGateResult> {
    const startTime = Date.now();
    console.log(`[Decision Gate Agent] Evaluating 10 Quality Gates for topic "${topic?.title || "N/A"}"...`);

    const rejectionReasons: string[] = [];

    if (!topic || !post || !article) {
      rejectionReasons.push("NO_POST_TODAY: Topic or post payload is missing due to topic decay or content saturation.");
      console.log(`[DECISION_GATE] topicFreshness=0 originality=0 humanTone=0 visualAlignment=0 decision=REJECT`);
      return {
        success: false,
        confidenceScore: 0,
        data: {
          approvedForPublishing: false,
          decision: "REJECT",
          gateCheckResults: {
            topicFreshnessPassed: false,
            technicalAccuracyPassed: false,
            originalityPassed: false,
            humanTonePassed: false,
            audienceRelevancePassed: false,
            brandStrategyPassed: false,
            discussionPotentialPassed: false,
            platformOptimizationPassed: false,
            visualValidationPassed: false,
            seoCompletenessPassed: false,
          },
          rejectionReasons,
          actionRequired: "NO_POST_TODAY: Safe exit executed.",
        },
        validationResult: { passed: false, errors: rejectionReasons, warnings: [] },
        metadata: {
          agentType: AgentType.DECISION_GATE,
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
          pipelineId,
        },
      };
    }

    // Gate 1: Topic Freshness
    const topicFreshnessPassed = Boolean(topic.title);
    if (!topicFreshnessPassed) rejectionReasons.push("Topic freshness check failed: Topic title is missing.");

    // Gate 2: Technical Accuracy
    const technicalAccuracyPassed = techReview.passed && techReview.accuracyScore >= 80;
    if (!technicalAccuracyPassed) rejectionReasons.push(`Technical accuracy check failed: Score is ${techReview.accuracyScore}%.`);

    // Gate 3: Originality (Semantic + Lexical similarity <= 0.35)
    const originalityPassed = originality.passed && originality.overallSimilarityScore <= 0.35;
    if (!originalityPassed) rejectionReasons.push(`Originality check failed: Similarity score is ${originality.overallSimilarityScore} (Threshold <= 0.35).`);

    // Gate 4: Human Tone & Boredom Check (No AI Clichés, no rigid "Situation:" or "1️⃣ Observation:" labels, BoredomScore <= 35)
    const hasRigidHeaders = /1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|Situation:|Task:|Action:|Result:/i.test(post.fullText);
    const boredomTooHigh = Boolean(post.writingQualityScore?.boredomScore && post.writingQualityScore.boredomScore.overall > 35);
    const humanTonePassed = clichésRemoved <= 5 && !post.fullText.includes("In today's fast-paced world") && !hasRigidHeaders && !boredomTooHigh;
    if (!humanTonePassed) {
      if (hasRigidHeaders) {
        rejectionReasons.push("Human tone check failed: Literal STAR headers or emoji bullet numbers detected in output text.");
      } else if (boredomTooHigh) {
        rejectionReasons.push(`Human tone check failed: Content boredom score too high (${post.writingQualityScore?.boredomScore?.overall} > 35).`);
      } else {
        rejectionReasons.push("Human tone check failed: AI cliché patterns detected in content.");
      }
    }

    // Gate 5: Audience Relevance
    const audienceRelevancePassed = Boolean(topic.audience || topic.title);
    if (!audienceRelevancePassed) rejectionReasons.push("Audience relevance check failed: Target persona missing.");

    // Gate 6: Personal Brand Strategy Alignment
    const brandStrategyPassed = post.fullText.length >= 80;
    if (!brandStrategyPassed) rejectionReasons.push("Brand strategy check failed: Content too short to demonstrate Full Stack AI Engineer authority.");

    // Gate 7: Discussion Potential
    const discussionPotentialPassed = Boolean(post.cta && (post.cta.length > 5 || post.fullText.includes("?")));
    if (!discussionPotentialPassed) rejectionReasons.push("Discussion potential check failed: Missing strong call-to-discussion prompt.");

    // Gate 8: Platform Optimization
    const platformOptimizationPassed = Boolean(post.fullText && article.markdownContent);
    if (!platformOptimizationPassed) rejectionReasons.push("Platform optimization check failed: Missing platform-specific payload.");

    // Gate 9: Visual Validation Alignment
    const visualValidationPassed = visualValidation.alignedWithArticle && visualValidation.alignmentScore >= 80;
    if (!visualValidationPassed) rejectionReasons.push(`Visual validation check failed: Diagram alignment score is ${visualValidation.alignmentScore}%.`);

    // Gate 10: SEO Completeness
    const seoCompletenessPassed = article.tags.length > 0 && Boolean(article.description);
    if (!seoCompletenessPassed) rejectionReasons.push("SEO completeness check failed: Dev.to metadata or tags incomplete.");

    // Gate 11: Technical Credibility Gate & Hard Authenticity Rule (Evidence / Authenticity >= 70)
    const evidenceAuthenticityScore = post.writingQualityScore?.evidenceAuthenticityScore ?? techReview.evidenceAuthenticityScore ?? 80;
    const credibilityGatePassed = techReview.credibilityGatePassed !== false && evidenceAuthenticityScore >= 70;
    if (!credibilityGatePassed) {
      rejectionReasons.push(`Technical Credibility Gate check failed: Evidence / Authenticity score is ${evidenceAuthenticityScore}% (Hard threshold >= 70%). Post rejected regardless of total score.`);
    }

    // 7-Dimension Weighted System Scoring
    const weightedEvidence = evidenceAuthenticityScore;
    const weightedTechAcc = techReview.accuracyScore || 90;
    const weightedPersonalExp = post.writingQualityScore?.personalExperienceScore || 75;
    const weightedEngDepth = post.writingQualityScore?.engineeringDepthScore || 85;
    const weightedStorytelling = post.writingQualityScore?.storytellingScore || 80;
    const weightedRecruiterVal = post.writingQualityScore?.recruiterValueScore || 85;
    const weightedEngagement = post.writingQualityScore?.engagementPotentialScore || 80;

    const totalWeightedScore = Math.round(
      weightedEvidence * 0.30 +
      weightedTechAcc * 0.20 +
      weightedPersonalExp * 0.15 +
      weightedEngDepth * 0.15 +
      weightedStorytelling * 0.10 +
      weightedRecruiterVal * 0.05 +
      weightedEngagement * 0.05
    );

    const thresholdPassed = totalWeightedScore >= 80;
    if (!thresholdPassed) {
      rejectionReasons.push(`Publishing threshold check failed: Total weighted score is ${totalWeightedScore}/100 (Threshold >= 80/100).`);
    }

    const approvedForPublishing =
      topicFreshnessPassed &&
      technicalAccuracyPassed &&
      credibilityGatePassed &&
      thresholdPassed &&
      originalityPassed &&
      humanTonePassed &&
      audienceRelevancePassed &&
      brandStrategyPassed &&
      discussionPotentialPassed &&
      platformOptimizationPassed &&
      visualValidationPassed &&
      seoCompletenessPassed;

    const decision: DecisionGateResult["decision"] = approvedForPublishing ? "PUBLISH" : "REJECT";
    const actionRequired = approvedForPublishing ? "Dispatch to Publisher Agent" : `Revise content: ${rejectionReasons.join("; ")}`;

    const topicFreshnessScore = Math.round(topic.score);
    const originalityScore = Math.round((1 - originality.overallSimilarityScore) * 100);
    const humanToneScore = Math.max(70, 100 - clichésRemoved * 5);
    const visualAlignmentScore = visualValidation.alignmentScore;

    console.log(
      `[DECISION_GATE] topicFreshness=${topicFreshnessScore} credibility=${evidenceAuthenticityScore} totalWeighted=${totalWeightedScore} decision=${decision}`
    );

    const executionTimeMs = Date.now() - startTime;
    return {
      success: approvedForPublishing,
      confidenceScore: approvedForPublishing ? 98 : 40,
      data: {
        approvedForPublishing,
        decision,
        gateCheckResults: {
          topicFreshnessPassed,
          technicalAccuracyPassed,
          credibilityGatePassed,
          evidenceAuthenticityPassed: credibilityGatePassed,
          originalityPassed,
          humanTonePassed,
          audienceRelevancePassed,
          brandStrategyPassed,
          discussionPotentialPassed,
          platformOptimizationPassed,
          visualValidationPassed,
          seoCompletenessPassed,
        },
        weightedScores: {
          evidenceAuthenticity: weightedEvidence,
          technicalAccuracy: weightedTechAcc,
          personalExperience: weightedPersonalExp,
          engineeringDepth: weightedEngDepth,
          storytelling: weightedStorytelling,
          recruiterValue: weightedRecruiterVal,
          engagementPotential: weightedEngagement,
          totalScore: totalWeightedScore,
        },
        rejectionReasons,
        actionRequired,
      },
      validationResult: {
        passed: approvedForPublishing,
        errors: rejectionReasons,
        warnings: [],
      },
      metadata: {
        agentType: AgentType.DECISION_GATE,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const decisionGateAgent = new DecisionGateAgent();

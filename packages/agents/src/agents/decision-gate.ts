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
    topic: Topic,
    post: LinkedInPostPayload,
    article: DevToArticlePayload,
    originality: OriginalityCheckResult,
    techReview: TechnicalReviewResult,
    visualValidation: VisualValidationResult,
    clichésRemoved: number,
    pipelineId?: string
  ): AgentResult<DecisionGateResult> {
    const startTime = Date.now();
    console.log(`[Decision Gate Agent] Evaluating 10 Quality Gates for topic "${topic.title}"...`);

    const rejectionReasons: string[] = [];

    // Gate 1: Topic Freshness
    const topicFreshnessPassed = Boolean(topic.title);
    if (!topicFreshnessPassed) rejectionReasons.push("Topic freshness check failed: Topic title is missing.");

    // Gate 2: Technical Accuracy
    const technicalAccuracyPassed = techReview.passed && techReview.accuracyScore >= 80;
    if (!technicalAccuracyPassed) rejectionReasons.push(`Technical accuracy check failed: Score is ${techReview.accuracyScore}%.`);

    // Gate 3: Originality (Semantic + Lexical similarity <= 0.35)
    const originalityPassed = originality.passed && originality.overallSimilarityScore <= 0.35;
    if (!originalityPassed) rejectionReasons.push(`Originality check failed: Similarity score is ${originality.overallSimilarityScore} (Threshold <= 0.35).`);

    // Gate 4: Human Tone
    const humanTonePassed = clichésRemoved <= 5 && !post.fullText.includes("In today's fast-paced world");
    if (!humanTonePassed) rejectionReasons.push("Human tone check failed: AI cliché patterns detected in content.");

    // Gate 5: Audience Relevance
    const audienceRelevancePassed = Boolean(topic.audience || topic.title);
    if (!audienceRelevancePassed) rejectionReasons.push("Audience relevance check failed: Target persona missing.");

    // Gate 6: Personal Brand Strategy Alignment
    const brandStrategyPassed = post.fullText.length >= 80;
    if (!brandStrategyPassed) rejectionReasons.push("Brand strategy check failed: Content too short to demonstrate Full Stack AI Engineer authority.");

    // Gate 7: Discussion Potential
    const discussionPotentialPassed = post.cta.length > 5;
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

    const approvedForPublishing =
      topicFreshnessPassed &&
      technicalAccuracyPassed &&
      originalityPassed &&
      humanTonePassed &&
      audienceRelevancePassed &&
      brandStrategyPassed &&
      discussionPotentialPassed &&
      platformOptimizationPassed &&
      visualValidationPassed &&
      seoCompletenessPassed;

    const decision: DecisionGateResult["decision"] = approvedForPublishing ? "PUBLISH" : "REGENERATE";
    const actionRequired = approvedForPublishing ? "Dispatch to Publisher Agent" : `Revise content: ${rejectionReasons.join("; ")}`;

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
          originalityPassed,
          humanTonePassed,
          audienceRelevancePassed,
          brandStrategyPassed,
          discussionPotentialPassed,
          platformOptimizationPassed,
          visualValidationPassed,
          seoCompletenessPassed,
        },
        rejectionReasons,
        actionRequired,
      },
      validationResult: {
        passed: approvedForPublishing,
        errors: approvedForPublishing ? [] : rejectionReasons,
        warnings: [],
      },
      metadata: {
        agentType: AgentType.DECISION_GATE,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
        retryCount: approvedForPublishing ? 0 : 1,
        errorDetails: rejectionReasons,
      },
    };
  }
}

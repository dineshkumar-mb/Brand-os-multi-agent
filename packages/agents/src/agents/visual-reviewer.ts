import {
  AgentType,
  AgentResult,
  Topic,
  STARStory,
  VisualQualityScore,
  VisualIntelligenceOutput,
  LinkedInPostPayload,
  DevToArticlePayload,
} from "@brand-os/shared";

export class VisualReviewAgent {
  public evaluateVisualQuality(
    topic: Topic,
    visualOutput: VisualIntelligenceOutput,
    linkedInPost?: LinkedInPostPayload,
    devToArticle?: DevToArticlePayload,
    starStory?: STARStory,
    pipelineId?: string
  ): AgentResult<VisualQualityScore> {
    const startTime = Date.now();
    console.log(`[Visual Review Agent] Auditing story alignment and visual quality for: "${topic.title}"...`);

    const rejectionReasons: string[] = [];

    // 1. Story Alignment Score
    const storyAlignment = visualOutput.visualStoryAlignmentScore || 85;
    if (storyAlignment < 80) {
      rejectionReasons.push(`Visual story alignment too low (${storyAlignment} < 80). Image fails to represent STAR story.`);
    }

    // 2. Technical Clarity
    let technicalClarity = 90;
    if (visualOutput.density === "HIGH" && visualOutput.structuredPrompt.keyElements.length > 6) {
      technicalClarity -= 10;
    }

    // 3. Readability & Clutter
    const readability = 92;
    const clutterLevel = visualOutput.density === "HIGH" ? 30 : 15;

    // 4. Anti-AI Cliché & Genericness Check
    const positivePrompt = (
      visualOutput.structuredPrompt.subject +
      " " +
      visualOutput.structuredPrompt.story +
      " " +
      visualOutput.structuredPrompt.keyElements.join(" ")
    ).toLowerCase();

    const containsRobotCliché = /robot|humanoid|futuristic city|glowing brain/i.test(positivePrompt);
    let genericnessScore = containsRobotCliché ? 85 : 15;

    if (containsRobotCliché) {
      rejectionReasons.push("Visual contains forbidden generic AI cliché imagery (robots/humanoids/glowing brains).");
    }

    // 5. Repetition Score Check
    const repetitionScore = visualOutput.visualRepetitionScore || 10;
    if (repetitionScore > 35) {
      rejectionReasons.push(`Visual repetition score exceeded threshold (${repetitionScore} > 35). Similar visual used in past 14 days.`);
    }

    // 6. Overall Visual Quality Calculation
    const overallScore = Math.round(
      storyAlignment * 0.3 +
      technicalClarity * 0.2 +
      readability * 0.2 +
      (100 - clutterLevel) * 0.1 +
      (100 - genericnessScore) * 0.1 +
      (100 - repetitionScore) * 0.1
    );

    if (overallScore < 85) {
      rejectionReasons.push(`Overall visual quality score below publishing threshold (${overallScore} < 85).`);
    }

    const passed = rejectionReasons.length === 0;

    console.log(
      `[VISUAL_REVIEW] passed=${passed} overallScore=${overallScore} alignment=${storyAlignment} repetition=${repetitionScore} genericness=${genericnessScore}`
    );

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: overallScore,
      data: {
        storyAlignment,
        technicalClarity,
        readability,
        clutterLevel,
        genericnessScore,
        repetitionScore,
        overallScore,
        passed,
        rejectionReasons,
      },
      validationResult: {
        passed,
        errors: rejectionReasons,
        warnings: [],
      },
      metadata: {
        agentType: AgentType.VISUAL_REVIEWER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

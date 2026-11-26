import {
  AgentType,
  AgentResult,
  LinkedInCommentDraftResult,
} from "@brand-os/shared";

export class LinkedInCommentDrafterAgent {
  public draftComment(
    postText: string,
    angle: "TECHNICAL_COUNTEREXAMPLE" | "TELEMETRY_INSIGHT" | "TRADEOFF_QUESTION" | "REINFORCE_EXPERIENCE" = "TRADEOFF_QUESTION",
    targetAudienceRole: string = "Senior Engineers & Tech Leads",
    pipelineId?: string
  ): AgentResult<LinkedInCommentDraftResult> {
    const startTime = Date.now();
    console.log(`[LinkedIn Comment Drafter] Drafting strategic comment with angle '${angle}'...`);

    const cleanSnippet = postText.replace(/\n/g, " ").substring(0, 100).trim();

    let commentText = "";

    switch (angle) {
      case "TECHNICAL_COUNTEREXAMPLE":
        commentText = `Worth noting the trade-off here: simpler direct wrappers work fine for small prototypes, while standardized boundaries pay off once multiple tools or services evolve together.`;
        break;

      case "TELEMETRY_INSIGHT":
        commentText = `In full-stack apps, adding basic request timing and error-rate tracking around external integrations early makes it obvious when to swap or cache a dependency.`;
        break;

      case "TRADEOFF_QUESTION":
        commentText = `Curious how teams here balance keeping the stack simple for onboarding versus adding abstraction layers as features grow.`;
        break;

      case "REINFORCE_EXPERIENCE":
        commentText = `Keeping component and API boundaries explicit has been one of the highest-leverage habits in full-stack TypeScript and AI projects.`;
        break;

      default:
        commentText = `Clean separation of concerns matters most when teams need to ship new features without breaking existing integrations.`;
    }

    const executionTimeMs = Date.now() - startTime;
    const resultData: LinkedInCommentDraftResult = {
      commentText,
      angle,
      targetAudienceRole,
    };

    return {
      success: true,
      confidenceScore: 95,
      data: resultData,
      validationResult: {
        passed: true,
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.LINKEDIN_COMMENT_DRAFTER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }

  public draftReply(
    parentCommentText: string,
    postTopicTitle?: string,
    pipelineId?: string
  ): AgentResult<LinkedInCommentDraftResult> {
    const startTime = Date.now();
    console.log(`[LinkedIn Comment Drafter] Drafting peer response to comment: "${parentCommentText.substring(0, 50)}..."`);

    const replyText = `Appreciate the perspective! Exactly—balancing that trade-off in production comes down to how early telemetry reveals backpressure bottlenecks. Appreciate you sharing how your team handled it.`;

    const executionTimeMs = Date.now() - startTime;
    const resultData: LinkedInCommentDraftResult = {
      commentText: replyText,
      angle: "REINFORCE_EXPERIENCE",
      targetAudienceRole: "Tech Leaders",
    };

    return {
      success: true,
      confidenceScore: 95,
      data: resultData,
      validationResult: {
        passed: true,
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.LINKEDIN_COMMENT_DRAFTER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

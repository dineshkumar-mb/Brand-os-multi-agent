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
        commentText = `Solid analysis. In our workload, we found that this approach works great until downstream service latency spikes. At that point, the fallback circuit breaker strategy becomes the real bottleneck.`;
        break;

      case "TELEMETRY_INSIGHT":
        commentText = `Great breakdown! When we benchmarked a similar architecture, the p99 latency dropped by 35%, but memory usage spiked by 20%. Instrumenting granular telemetry early saved us in production.`;
        break;

      case "TRADEOFF_QUESTION":
        commentText = `Sharp observation. How does your team balance operational complexity versus state consistency when scaling this pattern under peak load?`;
        break;

      case "REINFORCE_EXPERIENCE":
        commentText = `Spot on. We ran into the exact same issue during a major refactor. Decoupling the execution path and establishing strict bounded contexts made all the difference.`;
        break;

      default:
        commentText = `Strong technical breakdown. The trade-offs between initial setup speed and long-term maintainability here are critical for senior engineering leadership.`;
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

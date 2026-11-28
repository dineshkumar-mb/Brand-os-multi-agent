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

    const textLower = postText.toLowerCase();
    const detectedStack: string[] = [];
    if (textLower.includes("bullmq") || textLower.includes("redis")) detectedStack.push("Redis/BullMQ queues");
    if (textLower.includes("mongodb")) detectedStack.push("MongoDB tenant scoping");
    if (textLower.includes("chromadb") || textLower.includes("rag")) detectedStack.push("ChromaDB retrieval");
    if (textLower.includes("webrtc") || textLower.includes("socket.io")) detectedStack.push("WebRTC + Socket.IO signaling");
    if (textLower.includes("react") || textLower.includes("typescript")) detectedStack.push("TypeScript + React boundaries");
    const stackLabel = detectedStack.slice(0, 2).join(" & ") || "explicit service boundaries";

    let commentText = "";

    // Keep opener under ~95 chars so LinkedIn displays repo & portfolio URLs without hiding behind "...more"
    switch (angle) {
      case "TECHNICAL_COUNTEREXAMPLE":
        commentText = `Trade-off note on ${stackLabel}: start inline, isolate queues once retries hit user latency.`;
        break;

      case "TELEMETRY_INSIGHT":
        commentText = `In the repo below, check how failure logging wraps ${stackLabel} before adding caching.`;
        break;

      case "TRADEOFF_QUESTION":
        commentText = `Repo + portfolio below. Where do you split sync APIs vs async ${stackLabel} in your stack?`;
        break;

      case "REINFORCE_EXPERIENCE":
        commentText = `Keeping ${stackLabel} isolated made testing and debugging much easier in this build.`;
        break;

      default:
        commentText = `Clean ${stackLabel} boundaries kept regressions low as features scaled.`;
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

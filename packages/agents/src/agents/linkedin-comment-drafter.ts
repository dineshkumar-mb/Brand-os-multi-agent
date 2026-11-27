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

    switch (angle) {
      case "TECHNICAL_COUNTEREXAMPLE":
        commentText = `Implementation note on ${stackLabel}: direct inline handlers are faster to prototype on day 1, so we only isolate async workers or strict contracts once retries or schema drift start hitting user latency.`;
        break;

      case "TELEMETRY_INSIGHT":
        commentText = `If you inspect the repo, look at how failure logging wraps external calls around ${stackLabel}. Measuring retry counts early tells you immediately when an integration needs backoff or caching.`;
        break;

      case "TRADEOFF_QUESTION":
        commentText = `Happy to share more code walkthroughs on ${stackLabel}. Where does your team usually draw the line between shipping a quick endpoint vs. adding queues/contracts upfront?`;
        break;

      case "REINFORCE_EXPERIENCE":
        commentText = `Extra implementation context: keeping ${stackLabel} isolated made testing and debugging much easier than optimizing prompts or endpoints later. Feel free to inspect the repo and portfolio below.`;
        break;

      default:
        commentText = `Clean separation around ${stackLabel} kept regressions low as features scaled. Source repo and full portfolio linked below.`;
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

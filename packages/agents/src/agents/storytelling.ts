import {
  AgentType,
  AgentResult,
  LinkedInPostPayload,
  FormatStyle,
} from "@brand-os/shared";

export class StorytellingAgent {
  public formatDeveloperStory(
    post: LinkedInPostPayload,
    pipelineId?: string
  ): AgentResult<LinkedInPostPayload> {
    const startTime = Date.now();
    console.log("[Storytelling Agent] Refining developer storytelling flow without rigid headers...");

    if (!post.fullText || post.fullText.trim().length <= 50) {
      return {
        success: true,
        confidenceScore: 50,
        data: post,
        validationResult: { passed: true, errors: [], warnings: ["fullText is extremely short"] },
        metadata: {
          agentType: AgentType.STORYTELLING,
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
          pipelineId,
        },
      };
    }

    // Ensure text is clean, free of hardcoded STAR or emoji-number step headers
    let cleanedText = post.fullText
      .replace(/[1-6]️⃣[^\n]*/g, "")
      .replace(/Situation:/gi, "")
      .replace(/Task:/gi, "")
      .replace(/Action:/gi, "")
      .replace(/Result:/gi, "")
      .replace(/Insight:/gi, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const updatedPost: LinkedInPostPayload = {
      ...post,
      fullText: cleanedText,
    };

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 96,
      data: updatedPost,
      validationResult: {
        passed: true,
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.STORYTELLING,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const storytellingAgent = new StorytellingAgent();

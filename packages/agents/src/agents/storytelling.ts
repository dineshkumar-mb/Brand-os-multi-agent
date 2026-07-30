import {
  AgentType,
  AgentResult,
  LinkedInPostPayload,
} from "@brand-os/shared";

export class StorytellingAgent {
  public formatDeveloperStory(
    post: LinkedInPostPayload,
    pipelineId?: string
  ): AgentResult<LinkedInPostPayload> {
    const startTime = Date.now();
    console.log("[Storytelling Agent] Applying 6-step developer storytelling flow...");

    if (post.fullText && post.fullText.trim().length <= 50) {
      return {
        success: true,
        confidenceScore: 50,
        data: post,
        validationResult: { passed: true, errors: [], warnings: ["fullText is extremely short"] },
        metadata: { agentType: AgentType.STORYTELLING, timestamp: new Date().toISOString(), executionTimeMs: Date.now() - startTime, pipelineId },
      };
    }

    const hook = post.hook.trim();
    const story = post.story.trim();
    const lesson = post.lesson.trim();
    const insights = post.actionableInsight.trim();
    const cta = post.cta.trim();
    const hashtags = post.hashtags.join(" ");

    // 6-step flow structure formatting
    const formattedFullText = `${hook}

1️⃣ Observation:
${story}

2️⃣ Problem & Production Bottleneck:
Unchecked state drift and unhandled edge cases degrade reliability at scale.

3️⃣ Engineering Decision:
${lesson}

4️⃣ Key Trade-offs to Consider:
• Architectural setup overhead vs zero runtime bugs.
• High concurrency throughput vs strict telemetry dependencies.

5️⃣ Engineering Takeaways & Results:
${insights}

6️⃣ Discussion:
${cta}

${hashtags}`;

    const updatedPost: LinkedInPostPayload = {
      ...post,
      fullText: formattedFullText,
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

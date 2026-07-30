import {
  AgentType,
  AgentResult,
  LinkedInPostPayload,
  DevToArticlePayload,
} from "@brand-os/shared";

export class HumanizationAgent {
  private readonly aiCliches: RegExp[] = [
    /in today's fast-paced world/gi,
    /let's dive in/gi,
    /game-changing/gi,
    /game changer/gi,
    /revolutionary/gi,
    /unlock the power/gi,
    /delve into/gi,
    /harness the power/gi,
    /it's important to remember/gi,
    /seamlessly/gi,
    /testament to/gi,
    /in conclusion/gi,
    /at the end of the day/gi,
    /beacon of/gi,
    /paradigm shift/gi,
  ];

  public sanitize(
    post: LinkedInPostPayload,
    article?: DevToArticlePayload,
    pipelineId?: string
  ): AgentResult<{ post: LinkedInPostPayload; article?: DevToArticlePayload; clichésRemoved: number }> {
    const startTime = Date.now();
    console.log("[Humanization Agent] Scanning and removing AI clichés and unnatural sentence patterns...");

    if (post.fullText && post.fullText.trim().length <= 50) {
      return {
        success: true,
        confidenceScore: 50,
        data: { post, article, clichésRemoved: 0 },
        validationResult: { passed: true, errors: [], warnings: [] },
        metadata: { agentType: AgentType.HUMANIZATION, timestamp: new Date().toISOString(), executionTimeMs: Date.now() - startTime, pipelineId },
      };
    }

    let totalRemoved = 0;

    const sanitizeText = (text: string): string => {
      let result = text;
      for (const pattern of this.aiCliches) {
        if (pattern.test(result)) {
          totalRemoved++;
          result = result.replace(pattern, "");
        }
      }
      return result
        .replace(/\s{2,}/g, " ")
        .replace(/\. ,/g, ".")
        .replace(/\.,/g, ".")
        .trim();
    };

    const sanitizedPost: LinkedInPostPayload = {
      ...post,
      hook: sanitizeText(post.hook),
      story: sanitizeText(post.story),
      lesson: sanitizeText(post.lesson),
      actionableInsight: sanitizeText(post.actionableInsight),
      cta: sanitizeText(post.cta),
      fullText: sanitizeText(post.fullText),
    };

    let sanitizedArticle: DevToArticlePayload | undefined = undefined;
    if (article) {
      sanitizedArticle = {
        ...article,
        description: sanitizeText(article.description),
        markdownContent: sanitizeText(article.markdownContent),
      };
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: totalRemoved === 0 ? 100 : 92,
      data: {
        post: sanitizedPost,
        article: sanitizedArticle,
        clichésRemoved: totalRemoved,
      },
      validationResult: {
        passed: true,
        errors: [],
        warnings: totalRemoved > 0 ? [`Removed ${totalRemoved} AI cliché phrases from generated text.`] : [],
      },
      metadata: {
        agentType: AgentType.HUMANIZATION,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

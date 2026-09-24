import {
  AgentType,
  AgentResult,
  LinkedInPostPayload,
  DevToArticlePayload,
} from "@brand-os/shared";

export class HumanizationAgent {
  private readonly aiCliches: RegExp[] = [
    // 1. Generic AI Openings
    /in today's fast-paced world/gi,
    /in today's rapidly evolving/gi,
    /in the ever-changing world of/gi,
    /in the modern digital landscape/gi,
    /as technology continues to evolve/gi,
    /in the fast-paced world of/gi,
    /the future of [^.!\n]+ is/gi,
    /has become increasingly important/gi,
    /you may be wondering/gi,

    // 2. AI-Favorite Vocabulary
    /let's dive in/gi,
    /game-changing/gi,
    /game changer/gi,
    /revolutionary/gi,
    /unlock the power/gi,
    /\bdelve into\b/gi,
    /\bdelve\b/gi,
    /\bpivotal\b/gi,
    /\bcrucial\b/gi,
    /\btransformative\b/gi,
    /\bseamlessly\b/gi,
    /\bseamless\b/gi,
    /\brobust\b/gi,
    /\bleverage\b/gi,
    /\bfoster\b/gi,
    /\bfacilitate\b/gi,
    /\bunderscore\b/gi,
    /\bshowcase\b/gi,
    /\bintricate\b/gi,
    /\btestament to\b/gi,
    /\btestament\b/gi,
    /\binterplay\b/gi,
    /\bbolster\b/gi,
    /\bparadigm shift\b/gi,
    /\bparadigm\b/gi,
    /\bempower\b/gi,
    /\bgroundbreaking\b/gi,

    // 3. Corporate Jargon & Metaphors
    /harness the power/gi,
    /it's important to remember/gi,
    /at the end of the day/gi,
    /beacon of/gi,
    /rich tapestry/gi,
    /tapestry of/gi,
    /cutting-edge/gi,
    /spearhead/gi,
    /holistic approach/gi,
    /synergy/gi,
    /supercharge/gi,
    /navigating the landscape/gi,
    /in the realm of/gi,
    /demystify/gi,
    /embark on a journey/gi,
    /here are \d+ things/gi,
    /as developers, we/gi,
    /technology is evolving rapidly/gi,
    /exciting times ahead/gi,
    /this is a must-have/gi,
    /transform your development workflow/gi,
    /whether you're a beginner or expert/gi,

    // 4. Manufactured Conclusions & Engagement Bait
    /the future belongs to/gi,
    /ultimately, success depends on/gi,
    /this is just the beginning/gi,
    /keep learning, keep building/gi,
    /embrace the future/gi,
    /what do you think\?/gi,
    /agree or disagree\?/gi,
    /drop your thoughts below/gi,
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

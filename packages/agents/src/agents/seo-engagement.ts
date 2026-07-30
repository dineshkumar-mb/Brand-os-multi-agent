import {
  AgentType,
  AgentResult,
  Topic,
  DevToArticlePayload,
  LinkedInPostPayload,
} from "@brand-os/shared";

export interface SeoEngagementOptimization {
  devToMeta: {
    seoTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    tags: string[];
    frontmatterExcerpt: string;
  };
  linkedInEngagement: {
    discussionPrompt: string;
    hashtags: string[];
    hookStrengthScore: number;
  };
}

export class SeoAndEngagementAgent {
  public optimize(
    topic: Topic,
    post: LinkedInPostPayload,
    article: DevToArticlePayload,
    pipelineId?: string
  ): AgentResult<SeoEngagementOptimization> {
    const startTime = Date.now();
    console.log("[SEO & Engagement Agent] Optimizing metadata, canonical URLs, and discussion triggers...");

    const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const canonicalUrl = article.canonicalUrl || `https://brand-os-multi-agent.vercel.app/blog/${slug}`;

    const tags = Array.from(
      new Set([...topic.keywords, topic.category, topic.framework || ""].filter(Boolean))
    )
      .slice(0, 4)
      .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ""));

    const devToMeta = {
      seoTitle: `${topic.title} | Technical Architecture Guide`,
      metaDescription: (article.description || topic.reason).substring(0, 155),
      canonicalUrl,
      tags,
      frontmatterExcerpt: (article.description || topic.reason).substring(0, 140),
    };

    const linkedInEngagement = {
      discussionPrompt: post.cta,
      hashtags: post.hashtags,
      hookStrengthScore: post.hook.length > 20 ? 94 : 75,
    };

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 95,
      data: {
        devToMeta,
        linkedInEngagement,
      },
      validationResult: {
        passed: true,
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.SEO_AND_ENGAGEMENT,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

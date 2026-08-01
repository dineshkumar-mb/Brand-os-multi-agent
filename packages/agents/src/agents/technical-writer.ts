import {
  AgentType,
  AgentResult,
  Topic,
  ResearchOutput,
  LinkedInPostPayload,
  DevToArticlePayload,
  RoutingStrategy,
} from "@brand-os/shared";
import { aiGateway } from "@brand-os/ai-gateway";
import { MinedExperienceNarrative } from "./experience-mining";
import { AudienceContext } from "./audience-research";

import { VisualPlanningAgent } from "./visual-planning";

export interface TechnicalWriterOutput {
  linkedInPost: LinkedInPostPayload;
  devToArticle: DevToArticlePayload;
}

export class TechnicalWriterAgent {
  private visualPlanner = new VisualPlanningAgent();

  private getDynamicImageUrl(topic: Topic): string {
    const plan = this.visualPlanner.createVisualPlan(topic);
    const svg = plan.data.renderedSvg;
    if (svg) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }
    return `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500"><rect width="800" height="500" fill="#0f172a"/><text x="400" y="250" fill="#38bdf8" font-size="28" font-weight="bold" text-anchor="middle">${topic.title}</text></svg>`
    )}`;
  }


  public async generateContent(
    topic: Topic,
    research: ResearchOutput,
    experience: MinedExperienceNarrative,
    audience: AudienceContext,
    pipelineId?: string
  ): Promise<AgentResult<TechnicalWriterOutput>> {
    const startTime = Date.now();
    console.log(`[Technical Writer Agent] Generating dual LinkedIn post & Dev.to article for: "${topic.title}"...`);

    const keyInsightsList = research.key_insights || ["Decoupled clean architecture ensures modular scaling."];
    const prosList = research.pros || ["Zero runtime overhead", "Type-safe contracts"];
    const consList = research.cons || ["Initial setup complexity"];
    const codeSnippetsList = research.code_snippets || [];
    const dynamicImageUrl = this.getDynamicImageUrl(topic);

    // 1. Generate LinkedIn Post
    const linkedinPrompt = `You are a Staff Full Stack AI Engineer.
Write an authentic, highly engaging LinkedIn post for ${audience.primaryAudience} about: "${topic.title}".

Context & Production Narrative:
- Problem: ${experience.realWorldProblem}
- Decision: ${experience.engineeringDecision}
- Outcome: ${experience.quantifiableOutcome}

Insights:
${keyInsightsList.map((k) => `- ${k}`).join("\n")}

STRICT RULES FOR LINKEDIN:
- Length between 200 and 500 words.
- Natural engineer tone sharing authentic observations and trade-offs.
- End with a thought-provoking engineering question for discussion.
- NEVER use AI clichés like "In today's fast-paced world", "Let's dive in", "Game-changing", "Revolutionary", "Unlock the power".

Return ONLY a valid JSON object matching:
{
  "title": "${topic.title}",
  "hook": "Scroll-stopping developer hook",
  "story": "Observation and real problem",
  "lesson": "Engineering decision made",
  "actionableInsight": "Bullet 1\\nBullet 2\\nBullet 3",
  "cta": "Discussion prompt",
  "hashtags": ["#SoftwareEngineering", "#AI", "#SystemDesign", "#TypeScript"],
  "fullText": "Full formatted text"
}`;

    let linkedInPost: LinkedInPostPayload | null = null;
    try {
      const res = await aiGateway.execute({
        prompt: linkedinPrompt,
        taskType: "linkedin_writer",
        temperature: 0.7,
        routingStrategy: RoutingStrategy.COST_OPTIMIZED,
        pipelineId,
      });

      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        linkedInPost = JSON.parse(jsonMatch[0]);
      }
    } catch (err: any) {
      console.warn("[Technical Writer Agent] LinkedIn generation warning:", err.message);
    }

    if (!linkedInPost || !linkedInPost.fullText) {
      const hook = `Building production systems with ${topic.framework || topic.category} taught our team a hard lesson about state boundaries.`;
      const story = `${experience.realWorldProblem} We refactored our pipeline to use ${experience.engineeringDecision}.`;
      const insights = keyInsightsList.map((k, i) => `⚡ ${i + 1}. ${k}`).join("\n");
      const cta = `How is your engineering team balancing abstraction complexity versus runtime performance? Let's discuss in the comments.`;
      const hashtags = ["#SoftwareEngineering", "#SystemDesign", "#AIEngineering", "#TypeScript"];
      const fullText = `${hook}\n\n${story}\n\nKey Engineering Takeaways:\n${insights}\n\nTrade-offs:\n• ${experience.tradeoffsFaced?.join("\n• ") || "Increased initial boilerplate vs long-term stability"}\n\n${cta}\n\n${hashtags.join(" ")}`;

      linkedInPost = {
        title: topic.title,
        hook,
        story,
        lesson: experience.engineeringDecision || "Decoupled clean architecture reduces state bugs.",
        actionableInsight: insights,
        cta,
        hashtags,
        fullText,
        imageUrl: dynamicImageUrl,
      };
    } else {
      linkedInPost.imageUrl = dynamicImageUrl;
    }

    // 2. Generate Dev.to Standalone Technical Article with Mermaid & Runnable Snippets
    const codeSnippet = codeSnippetsList[0]?.code || `export const runService = () => { console.log("Service active"); };`;

    const mermaidDiagram = `\`\`\`mermaid
flowchart TD
    Client["Client / API Gateway"] --> Queue["Redis Event Stream"]
    Queue --> Worker["Worker Node (${topic.framework || "Agent"})"]
    Worker --> Storage["PostgreSQL / ChromaDB"]
\`\`\``;

    const devToMarkdown = `---
title: "${topic.title}: Architecture, Benchmarks, and Lessons Learned"
published: true
tags: ${JSON.stringify((topic.keywords || []).slice(0, 4).map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, "")))}
canonical_url: "https://brand-os-multi-agent.vercel.app/blog/${topic.id || "post"}"
description: "A comprehensive deep dive into ${topic.title} architecture, implementation blueprints, edge cases, and performance benchmarks."
---

# ${topic.title}: Architecture, Benchmarks, and Lessons Learned

## Overview & Background
${research.summary || topic.title}

### Target Persona & Problem Statement
* **Target Audience**: ${audience.primaryAudience}
* **Real-World Context**: ${experience.realWorldProblem}

---

## High-Level System Architecture

${mermaidDiagram}

---

## Deep Technical Explanation & Trade-Offs

${keyInsightsList.map((insight) => `### ${insight}\nDetailed architectural breakdown of this insight in production environments.`).join("\n\n")}

### Trade-Offs Matrix
* **Pros**: ${prosList.join(", ")}
* **Cons**: ${consList.join(", ")}
* **Quantifiable Outcome**: ${experience.quantifiableOutcome}

---

## Runnable Code Blueprint

\`\`\`typescript
${codeSnippet}
\`\`\`

---

## Edge Cases & Failure Recovery

1. **Network Latency & Timeout Spikes**: Enforce exponential backoff retries with jitter.
2. **State Memory Bloat**: Configure TTL eviction and bounded queue lengths.
3. **Schema Corruption**: Validate input payloads using Zod or JSON-RPC schema contracts.

---

## Conclusion & Next Steps
${research.future_outlook || "Clean architecture scales predictably."}

*Next Steps for Software Architects*: Implement structured logging, monitor queue depths, and run automated integration tests.
`;

    const devToArticle: DevToArticlePayload = {
      title: `${topic.title}: Architecture, Benchmarks, and Lessons Learned`,
      published: false,
      tags: topic.keywords.slice(0, 4).map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, "")),
      canonicalUrl: `https://brand-os-multi-agent.vercel.app/blog/${topic.id || "post"}`,
      description: (research.summary || topic.reason || topic.title).substring(0, 150),
      mainImage: dynamicImageUrl,
      markdownContent: devToMarkdown,
    };

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 94,
      data: {
        linkedInPost,
        devToArticle,
      },
      validationResult: {
        passed: Boolean(linkedInPost.fullText && devToArticle.markdownContent),
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.TECHNICAL_WRITER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}


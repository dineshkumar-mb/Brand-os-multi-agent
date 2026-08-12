import {
  AgentType,
  AgentResult,
  Topic,
  ResearchOutput,
  LinkedInPostPayload,
  DevToArticlePayload,
  RoutingStrategy,
  NarrativePattern,
} from "@brand-os/shared";
import { aiGateway } from "@brand-os/ai-gateway";
import { MinedExperienceNarrative } from "./experience-mining";
import { AudienceContext } from "./audience-research";
import { VisualPlanningAgent } from "./visual-planning";

export interface TechnicalWriterOutput {
  linkedInPost: LinkedInPostPayload;
  devToArticle: DevToArticlePayload;
  narrativePattern: NarrativePattern;
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

  private selectNarrativePattern(topic: Topic): NarrativePattern {
    const patterns: NarrativePattern[] = [
      "ENGINEERING_DISCOVERY",
      "UNEXPECTED_PROBLEM",
      "TECHNICAL_TRADEOFF",
      "PRODUCTION_FAILURE",
      "CONTRARIAN_OBSERVATION",
      "NEW_TECHNOLOGY_ANALYSIS",
      "BUILD_IN_PUBLIC",
      "ARCHITECTURE_LESSON",
    ];
    const sum = (topic.title || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return patterns[sum % patterns.length];
  }

  private buildDynamicHook(topic: Topic, pattern: NarrativePattern, hasMatch: boolean): string {
    const fw = topic.framework || topic.category || "this technology";
    if (pattern === "ENGINEERING_DISCOVERY") {
      return `While testing ${topic.title}, I noticed an architectural trade-off that changes how we evaluate system performance.`;
    }
    if (pattern === "UNEXPECTED_PROBLEM") {
      return `We expected ${fw} to simplify our data flow. Instead, production load exposed a subtle concurrency edge case.`;
    }
    if (pattern === "TECHNICAL_TRADEOFF") {
      return `Choosing between ${fw} and custom abstractions isn't about hype—it comes down to long-term maintenance overhead vs immediate velocity.`;
    }
    if (pattern === "PRODUCTION_FAILURE") {
      return `The implementation passed all local unit tests. Production exposed a bottleneck in state synchronization.`;
    }
    if (pattern === "CONTRARIAN_OBSERVATION") {
      return `Everyone is discussing the headline features of ${topic.title}. The part I find far more interesting is the underlying architecture change.`;
    }
    if (pattern === "NEW_TECHNOLOGY_ANALYSIS") {
      return `${topic.title} was released recently. Beyond the initial benchmarks, here is what changes for software engineers.`;
    }
    if (pattern === "BUILD_IN_PUBLIC") {
      return `Today I refactored our ${topic.category} pipeline for ${fw}. The unexpected part was how much cleaner error boundaries became.`;
    }
    return `This looked like a simple feature in ${topic.title}. Under production scale, it required decoupling our event handlers.`;
  }

  private generateTopicMermaid(topic: Topic): string {
    const t = (topic.title + " " + (topic.framework || "")).toLowerCase();
    if (t.includes("docker") || t.includes("container")) {
      return `\`\`\`mermaid
flowchart LR
    Dev["Developer Code"] --> Build["Docker Buildx Engine"]
    Build --> Scan["Security Scanner (Trivy)"]
    Scan --> Registry["Private OCI Registry"]
    Registry --> K8s["Kubernetes Cluster Node"]
\`\`\``;
    }
    if (t.includes("typescript") || t.includes("compiler")) {
      return `\`\`\`mermaid
flowchart TD
    AST["AST Parser"] --> TypeCheck["Type Checker Engine"]
    TypeCheck --> ProjectRef["Project References Resolver"]
    ProjectRef --> Emit["JS Emitter & Declaration Maps"]
\`\`\``;
    }
    if (t.includes("deepseek") || t.includes("reasoning") || t.includes("model")) {
      return `\`\`\`mermaid
flowchart TD
    Prompt["User Prompt / Context"] --> RL["Reinforcement Learning Model Engine"]
    RL --> CoT["Chain-of-Thought Verification"]
    CoT --> Out["Structured Response"]
\`\`\``;
    }
    if (t.includes("security") || t.includes("mtls") || t.includes("ebpf")) {
      return `\`\`\`mermaid
flowchart LR
    AppA["Microservice A"] --> mTLS["mTLS Proxy / Service Mesh"]
    mTLS --> eBPF["eBPF Kernel Probe Filter"]
    eBPF --> AppB["Microservice B"]
\`\`\``;
    }
    return `\`\`\`mermaid
flowchart TD
    Client["Client / API Gateway"] --> Controller["Service Controller (${topic.framework || "Backend"})"]
    Controller --> Engine["Domain Logic Processor"]
    Engine --> Storage["Database / Cache Layer"]
\`\`\``;
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
    const narrativePattern = this.selectNarrativePattern(topic);
    const hasBuildMatch = Boolean(experience.foundMatch && experience.quantifiableOutcome);

    // 1. Generate LinkedIn Post with dynamic prompt
    const linkedinPrompt = `You are a Staff Full Stack AI Engineer.
Write an authentic, highly engaging LinkedIn post for ${audience.primaryAudience} about: "${topic.title}".

Narrative Pattern: ${narrativePattern}
Experience Type: ${hasBuildMatch ? "Direct Production Experience" : "Technical Research & Benchmarking"}
- Real Context: ${hasBuildMatch ? experience.realWorldProblem : research.summary}
- Technical Insights: ${keyInsightsList.slice(0, 3).join("; ")}

STRICT RULES FOR LINKEDIN:
- Length between 200 and 500 words.
- Natural engineer tone sharing authentic observations and trade-offs.
- End with a thought-provoking engineering question for discussion.
- NEVER use AI clichés like "In today's fast-paced world", "Let's dive in", "Game-changing", "Revolutionary", "Unlock the power".

Return ONLY a valid JSON object matching:
{
  "title": "${topic.title}",
  "hook": "Scroll-stopping developer hook",
  "story": "Observation and technical scenario",
  "lesson": "Engineering decision made",
  "actionableInsight": "Bullet 1\\nBullet 2\\nBullet 3",
  "cta": "Discussion prompt",
  "hashtags": ["#SoftwareEngineering", "#SystemDesign", "#Engineering"],
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

    if (!linkedInPost || !linkedInPost.fullText || linkedInPost.fullText.trim().length < 100) {
      const hook = this.buildDynamicHook(topic, narrativePattern, hasBuildMatch);
      const story = hasBuildMatch
        ? `While working on our ${topic.category} infrastructure, ${experience.realWorldProblem} We evaluated our options and chose ${experience.engineeringDecision || topic.framework || "a modular pattern"}.`
        : `I recently analyzed and benchmarked ${topic.title}. ${research.summary.substring(0, 180)}...`;
      const insights = keyInsightsList.map((k, i) => `⚡ ${i + 1}. ${k}`).join("\n");
      const cta = `How is your engineering team approaching ${topic.framework || topic.category} in production? Let's discuss trade-offs in the comments.`;
      const hashtags = ["#SoftwareEngineering", "#SystemDesign", "#AIEngineering", "#DeveloperTools"];
      const fullText = `${hook}\n\n${story}\n\nKey Engineering Insights:\n${insights}\n\nTrade-offs:\n• Pros: ${prosList.join(", ")}\n• Cons: ${consList.join(", ")}\n\n${cta}\n\n${hashtags.join(" ")}`;

      linkedInPost = {
        title: topic.title,
        hook,
        story,
        lesson: experience.engineeringDecision || "Decoupled clean architecture reduces operational complexity.",
        actionableInsight: insights,
        cta,
        hashtags,
        fullText,
        imageUrl: dynamicImageUrl,
      };
    } else {
      linkedInPost.imageUrl = dynamicImageUrl;
    }

    // 2. Generate Dev.to Standalone Technical Article with Dynamic Mermaid Diagrams
    const generateDevToTitle = (topicTitle: string): string => {
      const cleanTitle = topicTitle.replace(/:(.*)$/, "").trim();
      const titleFormulas = [
        `🚀 ${cleanTitle}: Performance Gains, Trade-Offs, and Implementation Blueprints`,
        `Inside ${cleanTitle}: Benchmarks, System Architecture, and Production Edge Cases`,
        `Practical Architecture Guide: ${cleanTitle}`,
        `A Software Architect's Deep Dive into ${cleanTitle}`,
        `Mastering ${cleanTitle}: High-Throughput Patterns & Code Blueprints`,
      ];
      const charCodeSum = cleanTitle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return titleFormulas[charCodeSum % titleFormulas.length];
    };

    const devToTitle = generateDevToTitle(topic.title);

    const rawKeywords = (topic.keywords && topic.keywords.length > 0)
      ? topic.keywords
      : [topic.category || "webdev", "architecture", "systemdesign", "programming"];
    
    const devToTags = rawKeywords
      .map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, ""))
      .filter((k) => k.length >= 2)
      .slice(0, 4);

    if (devToTags.length === 0) {
      devToTags.push("webdev", "architecture", "softwareengineering");
    }

    const codeSnippet = codeSnippetsList[0]?.code || `// Production implementation blueprint for ${topic.title}\nexport const runService = async () => {\n  console.log("Service active: ${topic.title}");\n};`;
    const mermaidDiagram = this.generateTopicMermaid(topic);

    const devToMarkdown = `---
title: "${devToTitle}"
published: true
tags: ${JSON.stringify(devToTags)}
canonical_url: "https://brand-os-multi-agent.vercel.app/blog/${topic.id || "post"}"
description: "A comprehensive deep dive into ${topic.title} architecture, implementation blueprints, edge cases, and performance benchmarks."
---

# ${devToTitle}

## Overview & Technical Context
${research.summary || topic.title}

### Target Audience & Real-World Scenario
* **Target Audience**: ${audience.primaryAudience}
* **Engineering Narrative**: ${hasBuildMatch ? `Direct Build Experience: ${experience.realWorldProblem}` : `In-Depth Benchmarking: ${research.summary.substring(0, 150)}`}

---

## High-Level System Architecture

${mermaidDiagram}

---

## Deep Technical Explanation & Trade-Offs

${keyInsightsList.map((insight) => `### ${insight}\nDetailed architectural breakdown of this pattern in enterprise production systems.`).join("\n\n")}

### Trade-Offs Matrix
* **Pros**: ${prosList.join(", ")}
* **Cons**: ${consList.join(", ")}
* **Outcome**: ${hasBuildMatch ? experience.quantifiableOutcome : "Predictable scalability and maintainability."}

---

## Runnable Code Blueprint

\`\`\`typescript
${codeSnippet}
\`\`\`

---

## Edge Cases & Failure Recovery

1. **Network Latency & Timeout Spikes**: Enforce exponential backoff retries with jitter and circuit breakers.
2. **Resource & Memory Bounds**: Configure explicit memory limits, TTL eviction, and queue backpressure.
3. **Schema & Payload Contract Drift**: Enforce runtime validation schemas using Zod or OpenAPI contracts.

---

## Conclusion & Future Outlook
${research.future_outlook || "Modern decoupled architecture scales predictably."}

---

## 💬 Community Discussion & Feedback

> **What's your team's approach?**
> How are you handling architecture trade-offs with ${topic.title}? Have you experienced similar performance benchmarks or edge cases in production?
> 
> *Drop a comment below with your insights, thoughts, or questions—let's discuss!* 🚀
`;

    const devToArticle: DevToArticlePayload = {
      title: devToTitle,
      published: false,
      tags: devToTags,
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
        narrativePattern,
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



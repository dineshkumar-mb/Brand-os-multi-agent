import {
  AgentType,
  AgentResult,
  Topic,
  ResearchOutput,
  LinkedInPostPayload,
  DevToArticlePayload,
  RoutingStrategy,
  NarrativePattern,
  HookType,
  DiscussionCtaType,
  WritingQualityScore,
  VisualNarrative,
  HistoricalPostRecord,
  StoryMode,
  FormatStyle,
  STARStory,
  WritingContext,
} from "@brand-os/shared";
import { aiGateway } from "@brand-os/ai-gateway";
import { MinedExperienceNarrative } from "./experience-mining";
import { AudienceContext } from "./audience-research";
import { VisualPlanningAgent } from "./visual-planning";
import { writingMemoryTracker } from "./writing-memory";
import { hookEngine } from "./hook-engine";
import { tradeoffEngine } from "./tradeoff-engine";
import { writingQualityEvaluator } from "./writing-quality-evaluator";
import { engineeringReasoningAgent } from "./engineering-reasoning";

export interface TechnicalWriterOutput {
  linkedInPost: LinkedInPostPayload;
  devToArticle: DevToArticlePayload;
  narrativePattern: NarrativePattern;
  visualNarrative: VisualNarrative;
  writingQualityScore: WritingQualityScore;
  regenerationCount: number;
}

export class TechnicalWriterAgent {
  private visualPlanner = new VisualPlanningAgent();

  private buildRecruiterHashtags(topic: Topic): string[] {
    const text = `${topic.title} ${topic.category} ${topic.framework || ""} ${(topic.supportingTech || []).join(" ")} ${(topic.keywords || []).join(" ")}`.toLowerCase();
    const tags = new Set<string>(["#FullStackDeveloper"]);

    if (text.includes("mern") || text.includes("mongodb") || text.includes("express")) tags.add("#MERNStack");
    if (text.includes("react") || text.includes("shadcn") || text.includes("frontend")) tags.add("#React");
    if (text.includes("next")) tags.add("#Nextjs");
    if (text.includes("node") || text.includes("hono") || text.includes("backend")) tags.add("#NodeJS");
    if (text.includes("typescript")) tags.add("#TypeScript");
    if (text.includes("mcp") || text.includes("agent") || text.includes("langgraph")) tags.add("#AIAgents");
    if (text.includes("rag") || text.includes("llm") || text.includes("ai")) tags.add("#AIEngineering");
    if (text.includes("prisma") || text.includes("postgres") || text.includes("redis")) tags.add("#SystemDesign");
    if ((topic.references || []).some((r) => r.includes("github.com"))) tags.add("#OpenSource");
    tags.add("#SoftwareEngineering");

    return Array.from(tags).slice(0, 5);
  }

  private getDynamicImageUrl(topic: Topic, researchContext?: string): string {
    const plan = this.visualPlanner.createVisualPlan(topic, undefined, researchContext);
    const svg = plan.data.renderedSvg;
    if (svg) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }
    return `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500"><rect width="800" height="500" fill="#0f172a"/><text x="400" y="250" fill="#38bdf8" font-size="28" font-weight="bold" text-anchor="middle">${topic.title}</text></svg>`
    )}`;
  }

  private async generateAIImageUrl(topic: Topic, customPrompt?: string): Promise<string | null> {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!apiKey) {
      console.log("[Visual Generator] No OPENROUTER_API_KEY found, falling back to dynamic SVG.");
      return null;
    }

    try {
      console.log(`[Visual Generator 🎨] Requesting AI visual from OpenRouter for: "${topic.title}"...`);
      const imagePrompt = customPrompt ||
        `Clean, professional editorial tech infographic for: ${topic.title}. Modern SaaS aesthetic on a bright white and soft slate background (#ffffff / #f8fafc), clear visual hierarchy with max 3 steps or a crisp Before-vs-After comparison. Easy for non-technical recruiters and engineering managers to grasp in 3 seconds. Crisp typography, minimal text, no code snippets or dark terminal clutter, 16:9 LinkedIn editorial layout.`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://brand-os-multi-agent.vercel.app",
          "X-Title": "Personal Brand OS Multi-Agent",
        },
        body: JSON.stringify({
          model: "black-forest-labs/flux-1-schnell",
          messages: [
            {
              role: "user",
              content: imagePrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Visual Generator ⚠️] OpenRouter image request failed (${response.status}): ${errorText.substring(0, 160)}`);
        return null;
      }

      const data: any = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || "";
      const urlMatch = rawContent.match(/https:\/\/[^\s\)\"\']+/);
      if (urlMatch) {
        console.log(`[Visual Generator ✅] Received AI-generated image URL: ${urlMatch[0]}`);
        return urlMatch[0];
      }
    } catch (err: any) {
      console.warn(`[Visual Generator ⚠️] OpenRouter image generation error: ${err.message}`);
    }
    return null;
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
    if (t.includes("deepseek") || t.includes("reasoning") || t.includes("model") || t.includes("llm") || t.includes("agent") || t.includes("mcp")) {
      return `\`\`\`mermaid
flowchart TD
    Client["Client / SDK Agent"] --> Gateway["AI Gateway & Router"]
    Guard["Decision Gate & Safety Check"] --> Exec["Isolated Engine Execution"]
    Exec --> Out["Structured JSON Response"]
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
    pipelineId?: string,
    history: HistoricalPostRecord[] = [],
    writingContext?: WritingContext
  ): Promise<AgentResult<TechnicalWriterOutput>> {
    const startTime = Date.now();
    console.log(`[Senior Software Engineer Writer Subsystem] Initiating STAR + Storytelling pipeline for: "${topic.title}"...`);

    const hasBuildMatch = Boolean(experience.foundMatch && experience.quantifiableOutcome);
    const selectedStoryMode = writingMemoryTracker.selectFreshStoryMode();
    const selectedFormatStyle = writingMemoryTracker.selectFreshFormatStyle();
    const preferredHook = hasBuildMatch ? HookType.BUILD_EXPERIENCE : HookType.NEW_TECHNOLOGY;
    const selectedHookType = writingMemoryTracker.selectFreshHookType(preferredHook);
    const selectedCtaType = writingMemoryTracker.selectFreshCtaType(DiscussionCtaType.TRADEOFF_CHOICE);
    const dynamicHashtags = this.buildRecruiterHashtags(topic);

    // Stage 1: Engineering Reasoning Agent -> STARStory
    const reasoningRes = await engineeringReasoningAgent.generateSTARStory(
      topic,
      research,
      experience,
      selectedStoryMode,
      pipelineId
    );
    const starStory: STARStory = reasoningRes.data.starStory;

    const generatedHook = hookEngine.generateHook(
      selectedHookType,
      topic,
      hasBuildMatch,
      experience.realWorldProblem,
      selectedStoryMode,
      experience.quantifiableOutcome
    );

    const generatedCta = hookEngine.generateDiscussionCta(
      selectedCtaType,
      topic,
      false
    );

    // Stage 2: Full Stack & AI Developer Personal Branding Writer
    const gitHubRepoUrl = (topic.references || []).find((ref: string) => ref.includes("github.com")) || "";

    const prompt = `You are writing as Dinesh Kumar M B, a Full Stack & AI Engineer specializing in MERN Stack, React, TypeScript, Node.js, and Agentic AI.
Your goal is high reader engagement (saves, comments, and profile visits) from technical recruiters, engineering managers, startup CTOs, and fellow developers.

## VIRAL LINKEDIN ENGAGEMENT RULES:
1. Hook (First 2 lines, strictly <= 140 chars on line 1): Open with the exact failure, bottleneck, or verified build trade-off (${generatedHook}). NEVER start with "Architectural breakdown of..." or repeat the long topic title.
2. Stakes (1-2 short lines): Explain in plain English what broke or why product teams hit this bottleneck.
3. What Changed + Saveable Value (3 crisp bullets starting with "• "): Concrete architectural change, verified outcome/metric${experience.quantifiableOutcome ? ` (${experience.quantifiableOutcome})` : ""}, and the engineering trade-off accepted.
4. Rule of Thumb (1 punchy sentence): A reusable takeaway developers can bookmark and apply to their own systems.${gitHubRepoUrl ? ` Add on its own line: "Code & architecture link in the first comment."` : ""}
5. Debate Closing Question (${dynamicHashtags.join(" ")}): End with a sharp binary trade-off question engineers debate in code reviews (NOT generic "What do you think?").

Target length: **130–200 words** (scannable on mobile with double newlines \\n\\n between blocks).

## STRICT FORMATTING RULES:
- NEVER write the entire post as a single paragraph.
- NEVER include raw http:// or https:// URLs inside linkedIn.fullText (LinkedIn penalizes outbound body links by 40-60% reach).
- NEVER include "Option A:" / "Option B:" labels verbatim in the post.
- NEVER use AI clichés (delve, pivotal, crucial, transformative, revolutionary, seamless, robust, leverage, game-changing, unlock, empower, landscape).
- NEVER use em dashes (—) repetitively; prefer periods or commas.
- Keep every paragraph to 1-2 short sentences maximum.

CONTEXT FROM STAR FRAMEWORK:
- Context: ${starStory.situation.context}
- Problem/Trigger: ${starStory.situation.trigger}
- Challenge: ${starStory.task.objective}
- Approach Taken: ${starStory.action.chosenApproach}
- Technical Reasoning: ${starStory.action.reasoning}
- Outcome/Result: ${starStory.result.outcome}
- Engineering Lesson: ${starStory.insight.engineeringLesson}
- Trade-offs: ${starStory.insight.tradeoffs.join(", ")}

Return ONLY a valid JSON object matching:
{
  "linkedIn": {
    "title": "${topic.title}",
    "hook": "${generatedHook}",
    "story": "${starStory.situation.context}",
    "lesson": "${starStory.insight.engineeringLesson}",
    "actionableInsight": "${starStory.result.outcome}",
    "cta": "${generatedCta}",
    "hashtags": ${JSON.stringify(dynamicHashtags)},
    "fullText": "Full 120-220 word post text"
  },
  "devTo": {
    "title": "Inside ${topic.title}: Practical Implementation & Architecture Insights",
    "description": "${research.summary.substring(0, 140)}",
    "tags": ["webdev", "fullstack", "ai", "javascript"],
    "markdownContent": "Full Dev.to markdown article content"
  },
  "visualNarrative": {
    "coreConcept": "${topic.title}",
    "primaryFlow": "${starStory.action.chosenApproach}",
    "importantComponents": ["User Request", "AI / Full Stack Logic", "Fast Verified Result"],
    "relationships": ["User Request -> Core Engine", "Core Engine -> Output Result"],
    "keyLabels": ["Input", "Decision", "Output"],
    "visualType": "THREE_STEP_WORKFLOW"
  }
}`;

    let linkedInPayload: LinkedInPostPayload | null = null;
    let devToPayload: DevToArticlePayload | null = null;
    let visualNarrative: VisualNarrative | null = null;

    try {
      const response = await aiGateway.execute({
        prompt,
        taskType: "senior_engineering_writer",
        temperature: 0.7,
        routingStrategy: RoutingStrategy.COST_OPTIMIZED,
        pipelineId,
      });

      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let parsed: any = null;
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          try {
            const sanitized = jsonMatch[0].replace(/[\u0000-\u001F]+/g, (c: string) => (c === "\n" ? "\\n" : c === "\r" ? "\\r" : c === "\t" ? "\\t" : ""));
            parsed = JSON.parse(sanitized);
          } catch {
            const match = response.text.match(/"fullText"\s*:\s*"([\s\S]*?)(?="\s*,\s*"\w+"|\s*\}\s*\}|$)/);
            if (match) {
              parsed = { linkedIn: { fullText: match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') } };
            }
          }
        }

        if (parsed) {
          const linkedInObj = parsed.linkedIn || (parsed.fullText ? parsed : null);
          if (linkedInObj && linkedInObj.fullText) {
            linkedInPayload = {
              title: topic.title,
              hook: linkedInObj.hook || generatedHook,
              story: linkedInObj.story || starStory.situation.context,
              lesson: linkedInObj.lesson || starStory.insight.engineeringLesson,
              actionableInsight: linkedInObj.actionableInsight || starStory.result.outcome,
              cta: linkedInObj.cta || generatedCta,
              hashtags: linkedInObj.hashtags || ["#SoftwareEngineering", "#SystemDesign"],
              fullText: linkedInObj.fullText,
              storyMode: selectedStoryMode,
              formatStyle: selectedFormatStyle,
              starStory,
            };
          }
          const devToObj = parsed.devTo || (parsed.markdownContent ? parsed : null);
          if (devToObj && devToObj.markdownContent) {
            devToPayload = {
              title: devToObj.title || topic.title,
              published: false,
              tags: devToObj.tags || ["webdev", "architecture"],
              canonicalUrl: `https://brand-os-multi-agent.vercel.app/blog/${topic.id || "post"}`,
              description: devToObj.description || research.summary.substring(0, 140),
              mainImage: this.getDynamicImageUrl(topic),
              markdownContent: devToObj.markdownContent,
            };
          }
          if (parsed.visualNarrative) {
            visualNarrative = parsed.visualNarrative;
          }
        }
      }
    } catch (err: any) {
      console.warn(`[Senior Engineer Writer] Prose generation attempt warning: ${err.message}`);
    }

    // Generate AI Image via OpenRouter or fallback to dynamic SVG
    const aiImageUrl = await this.generateAIImageUrl(topic, visualNarrative?.coreConcept);
    const finalImageUrl = aiImageUrl || this.getDynamicImageUrl(topic);

    // Fallback prose generation based on FormatStyle & STARStory if LLM output was partial/missing
    if (!linkedInPayload) {
      console.warn("[Technical Writer ⚠️] Formatting fallback post with recruiter-friendly Full Stack personal branding rules...");

      const stripOptionPrefix = (s: string) =>
        s.replace(/^(Option|Pattern|Approach)\s+[A-Z]:\s*/i, "").trim();

      const hook = generatedHook || `Most developers know ${topic.framework || topic.title}. Few discuss what breaks when it scales.`;
      const context = starStory.situation?.context || `While working with ${topic.framework || topic.category}, tight coupling made changes brittle.`;

      const chosen = stripOptionPrefix(starStory.action?.chosenApproach || "Decoupled the execution boundary to isolate failures");
      const reasoning = starStory.action?.reasoning || "Made interface schemas explicit across components";
      const outcome = starStory.result?.outcome || "Improved reliability without adding unnecessary complexity";

      const insight = [
        `Key takeaways:`,
        `- ${chosen}`,
        `- ${reasoning}`,
        `- ${outcome}`,
      ].join("\n\n");

      const repoSection = gitHubRepoUrl ? `Full open-source repository link is in the first comment.` : "";
      const personalPerspective = starStory.insight?.engineeringLesson || `Keeping system boundaries explicit beats implicit framework magic.`;
      const closingQuestion = generatedCta || `How does your team handle this pattern when building in production?`;

      const tags = dynamicHashtags.join(" ");

      const fullText = [
        hook,
        context,
        insight,
        repoSection,
        personalPerspective,
        closingQuestion,
        tags
      ].filter(Boolean).join("\n\n");

      linkedInPayload = {
        title: topic.title,
        hook: generatedHook,
        story: starStory.situation.context,
        lesson: starStory.insight.engineeringLesson,
        actionableInsight: starStory.result.outcome,
        cta: generatedCta,
        hashtags: dynamicHashtags,
        fullText,
        imageUrl: finalImageUrl,
        storyMode: selectedStoryMode,
        formatStyle: selectedFormatStyle,
        starStory,
      };
    } else {
      linkedInPayload.imageUrl = finalImageUrl;
    }

    if (!devToPayload || !devToPayload.markdownContent) {
      const mermaidDiagram = this.generateTopicMermaid(topic);
      const codeSnippet = research.code_snippets[0]?.code || `// Production blueprint for ${topic.title}\nexport const runEngine = async () => {\n  console.log("Active engine: ${topic.title}");\n};`;
      const devToMarkdown = `---
title: "Inside ${topic.title}: System Architecture, Trade-Offs, and Implementation Blueprints"
published: true
tags: ["webdev", "architecture", "systemdesign"]
canonical_url: "https://brand-os-multi-agent.vercel.app/blog/${topic.id || "post"}"
description: "A software architect's deep dive into ${topic.title} architecture, blueprints, failure recovery, and trade-off analysis."
---

# Inside ${topic.title}: System Architecture, Trade-Offs, and Implementation Blueprints

## 1. Overview & Technical Context
${starStory.situation.context}

## 2. High-Level System Architecture
${starStory.action.reasoning}

### System Architecture Diagram
${mermaidDiagram}

## 3. Engineering Trade-Off Matrix
* **Objective**: ${starStory.task.objective}
* **Chosen Approach**: ${starStory.action.chosenApproach}
* **Trade-Offs**: ${starStory.insight.tradeoffs.join("; ")}

## 4. Runnable Code Blueprint
\`\`\`typescript
${codeSnippet}
\`\`\`

## 5. Edge Cases & Failure Recovery Modes
${starStory.result.outcome}
* **Evidence**: ${starStory.result.evidence.join("; ")}
* **Key Insight**: ${starStory.insight.engineeringLesson}
`;

      devToPayload = {
        title: `Inside ${topic.title}: Architecture, Trade-Offs, and Implementation Blueprints`,
        published: false,
        tags: ["webdev", "architecture", "systemdesign"],
        canonicalUrl: `https://brand-os-multi-agent.vercel.app/blog/${topic.id || "post"}`,
        description: research.summary.substring(0, 140),
        mainImage: finalImageUrl,
        markdownContent: devToMarkdown,
      };
    } else {
      devToPayload.mainImage = finalImageUrl;
    }

    if (!visualNarrative) {
      visualNarrative = {
        coreConcept: topic.title,
        primaryFlow: starStory.action.chosenApproach,
        importantComponents: ["Service Controller", "Domain Engine", "Storage Boundary"],
        relationships: ["Controller -> Engine", "Engine -> Storage Boundary"],
        keyLabels: ["Request", "Decision", "State"],
        visualType: "SYSTEM_DESIGN",
      };
    }

    // Evaluate Quality Score with STAR & Boredom Metrics
    const writingQualityScore = writingQualityEvaluator.evaluate(
      linkedInPayload,
      devToPayload,
      research,
      experience,
      history,
      starStory
    );

    // Record in writing memory
    writingMemoryTracker.recordEntry({
      topic: topic.title,
      category: topic.category,
      framework: topic.framework,
      hook: linkedInPayload.hook,
      hookType: selectedHookType,
      storyAngle: "SENIOR_ENGINEERING_REASONING",
      narrativePattern: "ENGINEERING_DISCOVERY",
      ctaType: selectedCtaType,
      ctaText: linkedInPayload.cta,
      vocabulary: [topic.category, topic.framework || ""].filter(Boolean),
      writingQualityScore,
      storyMode: selectedStoryMode,
      formatStyle: selectedFormatStyle,
      starStory,
      boredomScore: writingQualityScore.boredomScore,
    });

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 96,
      data: {
        linkedInPost: linkedInPayload,
        devToArticle: devToPayload,
        narrativePattern: "ENGINEERING_DISCOVERY",
        visualNarrative,
        writingQualityScore,
        regenerationCount: 0,
      },
      validationResult: { passed: true, errors: [], warnings: [] },
      metadata: {
        agentType: AgentType.TECHNICAL_WRITER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const technicalWriterAgent = new TechnicalWriterAgent();
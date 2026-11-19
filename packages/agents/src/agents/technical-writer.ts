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
    const selectedHookType = writingMemoryTracker.selectFreshHookType(HookType.ENGINEERING_OBSERVATION);
    const selectedCtaType = writingMemoryTracker.selectFreshCtaType(DiscussionCtaType.TRADEOFF_CHOICE);

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
      selectedStoryMode
    );

    const generatedCta = hookEngine.generateDiscussionCta(
      selectedCtaType,
      topic,
      true
    );

    // Stage 2: Full Stack & AI Developer Personal Branding Writer
    const gitHubRepoUrl = (topic.references || []).find((ref: string) => ref.includes("github.com")) || "";

    const prompt = `You are writing as a skilled Full Stack & AI Developer specializing in MERN Stack, React, Next.js, Node.js, and Agentic AI.
Your goal is to build a recognizable developer personal brand that attracts:
- Technical recruiters hiring Full Stack, MERN Stack, and AI Full Stack Developers.
- Engineering managers and tech leads.
- Startup founders and CTOs.
- Fellow developers seeking practical engineering insights.

Primary Career Objective: Increase profile visits, recruiter visibility, interview opportunities, and inbound inquiries.

## CORE WRITING PRINCIPLE:
**Simple explanation + real engineering insight + practical value.**
- A technical recruiter or hiring manager MUST understand the core value of the post in 10-15 seconds.
- Avoid overloading the reader with obscure architectural jargon, deep mathematical abstractions, or overly complex workflows.
- Instead of explaining a whole theoretical distributed system, explain the actual problem it solves, why it matters, and what a developer can learn from it.
- Target post length: **120–220 words**.

## MANDATORY LINKEDIN STRUCTURE:
1. Opening Hook: 1-2 short, curiosity-driven lines. Must make readers click "See more".
2. Context: Plain English explanation of the real-world challenge or problem.
3. Main Insight: 1-2 short sentences + concise bullet points (- ) explaining what changed or how it works.
4. Practical Application: Where developers or teams can use this in real applications.${gitHubRepoUrl ? ` Include the original GitHub repository link: ${gitHubRepoUrl}` : ""}
5. Personal Perspective: One authentic developer reflection or trade-off observation (no generic AI cheerleading).
6. Closing: One specific technical discussion question + 3-5 relevant hashtags (#FullStack #React #NodeJS #AI #WebDevelopment).

## STRICT FORMATTING RULES:
- NEVER write the entire post as a single paragraph.
- Use a crisp, line-by-line format with plenty of whitespace (double newlines \\n\\n between ideas).
- Keep every paragraph to 1-2 short sentences maximum.
- Avoid unnecessary emojis. No numbered emoji headers like "1️⃣ Observation:".
- Avoid corporate fluff and AI-favorite words (delve, pivotal, crucial, transformative, revolutionary, seamless, robust, leverage, game-changing).
- Avoid clickbait and artificial engagement bait (NEVER end with "What do you think?", "Agree or disagree?", "Drop your thoughts below").
- Ensure high readability on mobile.

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
    "hashtags": ["#FullStack", "#React", "#NodeJS", "#AI", "#WebDevelopment"],
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
  "visualNarrative": {
    "coreConcept": "${topic.title}",
    "primaryFlow": "${starStory.action.chosenApproach}",
    "importantComponents": ["Service Controller", "Domain Processor", "Database / Storage"],
    "relationships": ["Controller -> Processor", "Processor -> Database"],
    "keyLabels": ["Request", "Decision", "State"],
    "visualType": "SYSTEM_DESIGN"
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

      const hook = generatedHook || `Most developers know ${topic.title}. Few discuss what happens when request volume scales.`;
      const context = starStory.situation?.context || `While building a full-stack feature recently, we ran into an unexpected latency bottleneck.`;

      const insight = [
        `Here is what we discovered and changed:`,
        `• ${starStory.action?.chosenApproach || "Decoupled the request path to avoid synchronous blocking"}`,
        `• ${starStory.action?.reasoning || "Handled state transitions explicitly to isolate failures"}`,
        `• ${starStory.result?.outcome || "Reduced latency spikes while maintaining reliability"}`,
      ].join("\n");

      const repoSection = gitHubRepoUrl ? `Project reference: ${gitHubRepoUrl}` : "";
      const personalPerspective = starStory.insight?.engineeringLesson || `In full-stack engineering, keeping system boundaries explicit consistently beats implicit framework magic.`;
      const closingQuestion = generatedCta || `How does your team handle this pattern when building in production?`;

      const tags = ["#FullStack", "#React", "#NodeJS", "#AI", "#WebDevelopment"].join(" ");

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
        hashtags: ["#FullStack", "#React", "#NodeJS", "#AI", "#WebDevelopment"],
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
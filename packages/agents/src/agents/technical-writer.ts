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

    // Stage 2: Senior Technical Writer (Prose Transformation)
    const prompt = `You are a Principal Software Engineer and Senior Technical Writer.
Your task is to transform an internal STAR engineering framework into a natural, compelling LinkedIn engineering post AND a deep Dev.to article about: "${topic.title}".

INTERNAL STAR STORY FRAMEWORK (Do NOT literally output "Situation:", "Task:", "Action:", "Result:" headers):
- Situation: ${starStory.situation.context} (Trigger: ${starStory.situation.trigger})
- Task: ${starStory.task.objective} (Constraints: ${starStory.task.constraints.join(", ")})
- Action: Chosen ${starStory.action.chosenApproach}. Reasoning: ${starStory.action.reasoning}. Decision Moment: ${starStory.action.decisionMoment || "N/A"}
- Result: ${starStory.result.outcome}. Metrics/Evidence: ${starStory.result.evidence.join(", ")}
- Insight: ${starStory.insight.engineeringLesson}. Tradeoffs: ${starStory.insight.tradeoffs.join(", ")}

STORY MODE: ${selectedStoryMode}
FORMAT STYLE / LAYOUT: ${selectedFormatStyle}
HOOK REFERENCE: "${generatedHook}"
CTA REFERENCE: "${generatedCta}"

STRICT PROHIBITION RULES:
1. NEVER literally write "Situation:", "Task:", "Action:", "Result:", "Insight:" anywhere in the text.
2. NEVER use emoji number step headers like "1️⃣ Observation:", "2️⃣ Problem:".
3. NEVER use AI clichés like "In today's fast-paced world", "Let's dive in", "Game-changing", "Revolutionary", "Unlock the power", "The future of", "As developers, we", "Transform your development workflow", "Whether you're a beginner or expert".
4. The tone must feel like a senior engineer telling another senior engineer: "This happened. Here was the problem. Here is what I tried. Here is what changed. Here is what I learned."
5. Layout style requirement (${selectedFormatStyle}):
   - If NARRATIVE_PARAGRAPHS: Clean short paragraphs with smooth transitions.
   - If MINIMAL_BULLETS: Concise engineering notes and trade-off points.
   - If BEFORE_AFTER_LAYOUT: Clear Before vs After operational outcome contrast.
   - If SHORT_DIALOGUE: Brief conversational opening between engineers.
   - If TECHNICAL_NOTE: Engineering architectural note style.
   - If STORY_FIRST: Lead with the incident/problem, reveal architecture after.
   - If ARCHITECTURE_FIRST: Lead with boundary design, reveal incident after.

Return ONLY a valid JSON object matching:
{
  "linkedIn": {
    "title": "${topic.title}",
    "hook": "${generatedHook}",
    "story": "${starStory.situation.context}",
    "lesson": "${starStory.insight.engineeringLesson}",
    "actionableInsight": "${starStory.result.outcome}",
    "cta": "${generatedCta}",
    "hashtags": ["#SoftwareEngineering", "#SystemDesign", "#AIEngineering"],
    "fullText": "Full 200-500 word post text"
  },
  "devTo": {
    "title": "Inside ${topic.title}: Architecture, Trade-Offs, and Failure Modes",
    "description": "${research.summary.substring(0, 140)}",
    "tags": ["webdev", "architecture", "systemdesign"],
    "markdownContent": "Full Dev.to markdown article content"
  },
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
        const parsed = JSON.parse(jsonMatch[0]);
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
    } catch (err: any) {
      console.warn(`[Senior Engineer Writer] Prose generation attempt warning: ${err.message}`);
    }

    // Fallback prose generation based on FormatStyle & STARStory if LLM output was partial/missing
    if (!linkedInPayload) {
      let bodyText = "";

      if (selectedFormatStyle === FormatStyle.BEFORE_AFTER_LAYOUT) {
        bodyText = `BEFORE:\n${starStory.situation.context}\n\nPROBLEM:\n${starStory.task.objective}\n\nWHAT CHANGED:\n${starStory.action.reasoning}\n\nAFTER:\n${starStory.result.outcome}\n\nLESSON:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.MINIMAL_BULLETS) {
        bodyText = `${starStory.situation.context}\n\nThe Constraint:\n• ${starStory.task.constraints[0] || starStory.task.objective}\n\nThe Decision:\n• ${starStory.action.chosenApproach}\n\nThe Trade-Off:\n• ${starStory.insight.tradeoffs[0] || "Sacrificed setup velocity for long-term fault isolation"}\n\nThe Result:\n${starStory.result.outcome}\n\nTakeaway:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.SHORT_DIALOGUE) {
        bodyText = `"Why is the ${topic.framework || topic.category} pipeline failing under load?"\n\n"The database query paths are locking connection pools."\n\nIt wasn't just the database.\n\n${starStory.action.reasoning}\n\n${starStory.result.outcome}\n\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.PRODUCTION_INCIDENT) {
        bodyText = `INCIDENT POSTMORTEM: ${topic.title}\n\nContext:\n${starStory.situation.context}\n\nFailure Trigger:\n${starStory.situation.trigger}\n\nResolution & Fix:\n${starStory.action.implementation || starStory.action.reasoning}\n\nObserved Metrics:\n${starStory.result.outcome}\n\nSystem Guardrails:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.ARCHITECTURE_EVOLUTION) {
        bodyText = `EVOLUTION OF OUR ${topic.category.toUpperCase()} PIPELINE:\n\nPhase 1 (Legacy):\n${starStory.situation.curiosityTension}\n\nPhase 2 (Architectural Pivot):\n${starStory.action.chosenApproach}\n\nPhase 3 (Production Gains):\n${starStory.result.outcome}\n\nCore Architecture Rule:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.TECHNICAL_MYTH) {
        bodyText = `MYTH: Adding more servers fixes ${topic.title} bottlenecks.\n\nFACT: ${starStory.situation.trigger}\n\nOur Evaluation:\n${starStory.action.reasoning}\n\nWhat Really Worked:\n${starStory.result.outcome}\n\nEngineering Takeaway:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.TRADEOFF_DEBATE) {
        bodyText = `THE HARD ARCHITECTURAL TRADEOFF:\n\nOption A (${starStory.action.approachesConsidered[0] || "Standard approach"}):\n- Fast setup, but high operational risk.\n\nOption B (${starStory.action.chosenApproach}):\n- ${starStory.action.reasoning}\n\nWhy we chose Option B:\n${starStory.result.outcome}\n\nArchitectural Boundary:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.CODE_WALKTHROUGH) {
        bodyText = `CODE ANATOMY: ${topic.title}\n\nThe Bottleneck:\n${starStory.situation.trigger}\n\nThe Refactoring Step:\n${starStory.action.implementation || starStory.action.reasoning}\n\nProduction Impact:\n${starStory.result.outcome}\n\nSenior Developer Rule:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.FAILED_EXPERIMENT) {
        bodyText = `WHAT WENT WRONG ON OUR FIRST 3 ATTEMPTS:\n\nAttempt 1-2:\n${starStory.action.rejectedApproaches?.[0] || starStory.situation.curiosityTension}\n\nAttempt 3 (Final Architecture):\n${starStory.action.chosenApproach}\n\nMeasured Recovery:\n${starStory.result.outcome}\n\nLesson Learned:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.SYSTEM_DESIGN_BREAKDOWN) {
        bodyText = `SYSTEM DESIGN BREAKDOWN: ${topic.title}\n\n1. Input Traffic & Constraints:\n${starStory.situation.context}\n\n2. Core Engineering Challenge:\n${starStory.task.objective}\n\n3. System Design Choice:\n${starStory.action.chosenApproach}\n\n4. Verified Outcome:\n${starStory.result.outcome}\n\n5. Architectural Design Invariant:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.NEW_TECH_PERSONAL_EXPERIMENT) {
        bodyText = `BENCHMARKING ${topic.title.toUpperCase()} IN STAGING:\n\nWhy we tested it:\n${starStory.situation.trigger}\n\nWhat surprised us:\n${starStory.action.reasoning}\n\nStaging Results:\n${starStory.result.outcome}\n\nProduction Verdict:\n${starStory.insight.engineeringLesson}`;
      } else if (selectedFormatStyle === FormatStyle.ENGINEERING_RETROSPECTIVE) {
        bodyText = `6-MONTH RETROSPECTIVE: ${topic.title}\n\nWhat we started with:\n${starStory.situation.context}\n\nWhat we changed:\n${starStory.action.reasoning}\n\nCurrent Production Health:\n${starStory.result.outcome}\n\nWhat we would do differently:\n${starStory.insight.engineeringLesson}`;
      } else {
        bodyText = `${starStory.situation.context}\n\nEngineering Challenge:\n${starStory.task.objective}\n\nArchitectural Fix:\n${starStory.action.reasoning}\n\nProduction Outcome:\n${starStory.result.outcome}\n\nKey Takeaway:\n${starStory.insight.engineeringLesson}`;
      }

      const topicTag = `#${(topic.framework || topic.category || "Tech").replace(/[^a-zA-Z0-9]/g, "")}`;
      const fullText = generatedCta
        ? `${generatedHook}\n\n${bodyText}\n\n${generatedCta}\n\n${topicTag}`
        : `${generatedHook}\n\n${bodyText}\n\n${topicTag}`;

      linkedInPayload = {
        title: topic.title,
        hook: generatedHook,
        story: starStory.situation.context,
        lesson: starStory.insight.engineeringLesson,
        actionableInsight: starStory.result.outcome,
        cta: generatedCta,
        hashtags: [topicTag],
        fullText,
        imageUrl: this.getDynamicImageUrl(topic),
        storyMode: selectedStoryMode,
        formatStyle: selectedFormatStyle,
        starStory,
      };
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
        mainImage: this.getDynamicImageUrl(topic),
        markdownContent: devToMarkdown,
      };
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

import {
  AgentType,
  AgentResult,
  Topic,
  TARGET_AUDIENCES,
} from "@brand-os/shared";

export interface AudienceContext {
  primaryAudience: string;
  secondaryAudience: string;
  whyAudienceCares: string;
  keyPainPoints: string[];
  toneRecommendation: string;
}

export class AudienceResearchAgent {
  public analyzeAudience(topic: Topic, pipelineId?: string): AgentResult<AudienceContext> {
    const startTime = Date.now();
    console.log(`[Audience Research Agent] Analyzing target audience context for: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    const catLower = (topic.category || "").toLowerCase();

    let primaryAudience = "Full Stack Developers & Engineering Managers";
    let secondaryAudience = "Technical Recruiters & Startup Founders";
    let whyAudienceCares = "Shows plain-English product impact alongside hands-on Full Stack engineering decisions.";
    let keyPainPoints = ["Feature delivery speed", "App reliability & scalability", "Clean maintainability"];
    let toneRecommendation = "Accessible in 10 seconds to recruiters while retaining real technical credibility";

    if (titleLower.includes("mcp") || catLower.includes("agent") || catLower.includes("ai") || catLower.includes("rag")) {
      primaryAudience = "AI Engineers";
      secondaryAudience = "Technical Recruiters, Hiring Managers & Startup Founders";
      whyAudienceCares = "Demonstrates practical AI integration, tool calling, and reliable LLM workflows in production apps.";
      keyPainPoints = ["Unreliable AI tool integrations", "High LLM API cost & latency", "Shipping AI features safely"];
      toneRecommendation = "Clear problem-first explanation paired with practical AI full-stack engineering insight";
    } else if (titleLower.includes("system design") || titleLower.includes("microservices") || catLower.includes("system") || catLower.includes("database")) {
      primaryAudience = "Engineering Managers & Technical Recruiters";
      secondaryAudience = "Backend & Full Stack Developers";
      whyAudienceCares = "Highlights practical architecture judgment, cost/reliability trade-offs, and ownership mindset.";
      keyPainPoints = ["Slow API responses", "Database bottlenecks", "Infrastructure reliability"];
      toneRecommendation = "Plain-English trade-off clarity avoiding dense academic jargon";
    } else if (titleLower.includes("react") || titleLower.includes("next") || titleLower.includes("typescript") || catLower.includes("react") || catLower.includes("frontend")) {
      primaryAudience = "Full Stack & Frontend Hiring Managers";
      secondaryAudience = "Technical Recruiters & Developers";
      whyAudienceCares = "Proves modern React, Next.js, TypeScript, and UI performance execution ready for product teams.";
      keyPainPoints = ["Slow UI updates", "Form & state boilerplate", "Frontend maintainability"];
      toneRecommendation = "Hands-on, scannable before-and-after insight accessible to both recruiters and devs";
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 92,
      data: {
        primaryAudience,
        secondaryAudience,
        whyAudienceCares,
        keyPainPoints,
        toneRecommendation,
      },
      validationResult: {
        passed: Boolean(primaryAudience),
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.AUDIENCE_RESEARCH,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

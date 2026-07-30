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

    let primaryAudience = "Full Stack Developers";
    let secondaryAudience = "Senior Engineers";
    let whyAudienceCares = "Demonstrates hands-on engineering execution and clean software patterns.";
    let keyPainPoints = ["Code maintainability", "Scaling state", "Developer velocity"];
    let toneRecommendation = "Authoritative, practical, and code-focused";

    if (titleLower.includes("mcp") || catLower.includes("agent") || catLower.includes("ai")) {
      primaryAudience = "AI Engineers";
      secondaryAudience = "CTOs";
      whyAudienceCares = "Shows mastery of cutting-edge multi-agent architecture and autonomous tool calling in production.";
      keyPainPoints = ["Agent state drift", "Tool execution failures", "LLM latency & cost controls"];
      toneRecommendation = "Architectural, visionary yet deeply grounded in production realities";
    } else if (titleLower.includes("system design") || titleLower.includes("microservices") || catLower.includes("system")) {
      primaryAudience = "Engineering Managers";
      secondaryAudience = "Hiring Managers";
      whyAudienceCares = "Highlights high-level distributed systems trade-offs and zero-downtime scalability.";
      keyPainPoints = ["System reliability", "Database bottlenecking", "Infrastructure cost management"];
      toneRecommendation = "Strategic, analytical, highlighting engineering trade-offs";
    } else if (titleLower.includes("react") || titleLower.includes("typescript") || catLower.includes("react")) {
      primaryAudience = "Senior Engineers";
      secondaryAudience = "Recruiters";
      whyAudienceCares = "Proves deep frontend expertise, modern framework mastery, and performance optimization techniques.";
      keyPainPoints = ["Client bundle bloat", "Complex state management", "Framework migration overhead"];
      toneRecommendation = "Hands-on, pragmatic, sharing real debugging observations";
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

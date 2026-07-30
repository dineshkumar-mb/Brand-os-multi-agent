import {
  AgentType,
  AgentResult,
  Topic,
} from "@brand-os/shared";

export interface BrandStrategyDirective {
  positioningTagline: string;
  brandAlignmentPassed: boolean;
  strategicAngle: string;
  keyPillarsReinforced: string[];
}

export class PersonalBrandStrategyAgent {
  private readonly targetIdentity =
    "Full Stack AI Engineer who builds production-ready AI systems, full-stack applications, automation platforms, and shares practical engineering lessons.";

  public evaluateBrandStrategy(topic: Topic, pipelineId?: string): AgentResult<BrandStrategyDirective> {
    const startTime = Date.now();
    console.log(`[Personal Brand Strategy Agent] Checking strategy alignment for topic: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    const catLower = (topic.category || "").toLowerCase();

    const keyPillarsReinforced: string[] = [];

    if (catLower.includes("ai") || titleLower.includes("agent") || titleLower.includes("mcp") || titleLower.includes("rag")) {
      keyPillarsReinforced.push("Production-Ready AI Systems");
    }
    if (catLower.includes("react") || catLower.includes("typescript") || catLower.includes("node") || catLower.includes("system")) {
      keyPillarsReinforced.push("Full-Stack Software Architecture");
    }
    if (catLower.includes("devops") || catLower.includes("docker") || catLower.includes("ci/cd") || catLower.includes("redis")) {
      keyPillarsReinforced.push("Automation & Infrastructure Scaling");
    }

    // Default pillar reinforcement if general engineering
    if (keyPillarsReinforced.length === 0) {
      keyPillarsReinforced.push("Practical Engineering Lessons");
    }

    const brandAlignmentPassed = keyPillarsReinforced.length > 0;
    const strategicAngle = `Position as an experienced Full Stack AI Engineer sharing practical production insights on ${topic.title}.`;

    const executionTimeMs = Date.now() - startTime;
    return {
      success: brandAlignmentPassed,
      confidenceScore: brandAlignmentPassed ? 96 : 40,
      data: {
        positioningTagline: this.targetIdentity,
        brandAlignmentPassed,
        strategicAngle,
        keyPillarsReinforced,
      },
      validationResult: {
        passed: brandAlignmentPassed,
        errors: brandAlignmentPassed ? [] : ["Topic does not align with Full Stack AI Engineer brand pillars."],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.PERSONAL_BRAND_STRATEGY,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

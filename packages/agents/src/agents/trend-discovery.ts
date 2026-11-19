import {
  AgentType,
  AgentResult,
  Topic,
  ContentOpportunity,
} from "@brand-os/shared";
import { globalIntelligenceEngine } from "@brand-os/intelligence";

export class TrendDiscoveryAgent {
  private mapCategoryFromTags(tags: string[], title: string): string {
    const t = `${title} ${tags.join(" ")}`.toLowerCase();
    // 5-Pillar Strategy for Full Stack & AI Developer Personal Branding
    if (t.includes("career") || t.includes("interview") || t.includes("roadmap") || t.includes("growth")) {
      return "Career & Developer Growth";
    }
    if (t.includes("project showcase") || t.includes("i built") || t.includes("portfolio")) {
      return "Personal Project Showcases";
    }
    if (t.includes("mistake") || t.includes("debug") || t.includes("bottleneck") || t.includes("lessons learned") || t.includes("trade-off")) {
      return "Practical Developer Insights";
    }
    if (t.includes("react") || t.includes("next.js") || t.includes("node") || t.includes("express") || t.includes("mern") || t.includes("mongodb") || t.includes("postgres") || t.includes("api") || t.includes("frontend") || t.includes("backend")) {
      return "Full Stack Engineering";
    }
    if (t.includes("agent") || t.includes("mcp") || t.includes("rag") || t.includes("llm") || t.includes("ai") || t.includes("langgraph") || t.includes("github trending")) {
      return "Trending AI & Open Source";
    }
    return "Full Stack Engineering";
  }

  private extractFramework(tags: string[], title: string): string {
    const t = `${title} ${tags.join(" ")}`.toLowerCase();
    // LLM Providers (live feed data)
    if (t.includes("gpt-4o") || t.includes("gpt-4")) return "GPT-4o";
    if (t.includes("o3-mini") || t.includes("o3")) return "OpenAI o3";
    if (t.includes("o4")) return "OpenAI o4";
    if (t.includes("claude 3.7") || t.includes("claude-3-7") || t.includes("claude 4") || t.includes("claude-4")) return "Claude 3.7 Sonnet";
    if (t.includes("claude 3.5") || t.includes("claude-3-5")) return "Claude 3.5 Sonnet";
    if (t.includes("claude")) return "Claude";
    if (t.includes("gemini 2.5") || t.includes("gemini-2.5")) return "Gemini 2.5 Pro";
    if (t.includes("gemini 2.0") || t.includes("gemini-2.0")) return "Gemini 2.0 Flash";
    if (t.includes("gemini")) return "Gemini";
    if (t.includes("llama 4") || t.includes("llama-4")) return "Llama 4";
    if (t.includes("llama 3.3") || t.includes("llama-3.3")) return "Llama 3.3";
    if (t.includes("llama")) return "Llama";
    if (t.includes("deepseek")) return "DeepSeek";
    if (t.includes("mistral")) return "Mistral";
    if (t.includes("qwen")) return "Qwen";
    if (t.includes("openai")) return "OpenAI";
    // GitHub Trending Frameworks
    if (t.includes("nim")) return "NVIDIA NIM";
    if (t.includes("typescript")) return "TypeScript 5.7";
    if (t.includes("node")) return "Node.js 22 LTS";
    if (t.includes("docker")) return "Docker Buildx";
    if (t.includes("react")) return "React 19";
    if (t.includes("vite")) return "Vite 6";
    if (t.includes("langgraph")) return "LangGraph";
    if (t.includes("biome")) return "Biome JS";
    if (t.includes("trivy")) return "Aqua Trivy";
    if (t.includes("clickhouse")) return "ClickHouse SQL";
    if (t.includes("rust")) return "Rust";
    if (t.includes("go") || t.includes("golang")) return "Go";
    if (t.includes("kubernetes") || t.includes("k8s")) return "Kubernetes";
    if (t.includes("terraform")) return "Terraform";
    return tags[0] || "Architecture";
  }

  public async run(pipelineId?: string): Promise<AgentResult<Topic[]>> {
    const startTime = Date.now();
    console.log("[TREND_SCAN] Executing Multi-Source Intelligence Candidate Scan across 30+ sources...");

    const scanResult = await globalIntelligenceEngine.executeScan("ON_DEMAND");
    const opps = scanResult.opportunitiesGenerated.length > 0
      ? scanResult.opportunitiesGenerated
      : scanResult.approvedOpportunities;

    const topics: Topic[] = opps.map((opp) => {
      const framework = this.extractFramework(opp.whyCare?.whoIsAffected ? [opp.whyCare.whoIsAffected] : [], opp.topic);
      const category = this.mapCategoryFromTags([], opp.topic);
      const supportingTech = opp.experienceEvidence.flatMap((e) => e.technologiesUsed).filter(Boolean);

      return {
        id: opp.id,
        title: opp.topic,
        category,
        framework,
        supportingTech: supportingTech.length > 0 ? supportingTech.slice(0, 4) : ["TypeScript", "System Design"],
        score: opp.overallScore,
        reason: opp.whyCare.whyItMatters,
        trend_velocity: opp.trendVelocityScore / 10,
        difficulty: "ADVANCED",
        competition: "MEDIUM",
        audience: opp.targetAudience.map((a) => a.role).join(" & "),
        keywords: [opp.recommendedAngle, category, framework].filter(Boolean),
        references: opp.evidence.map((e) => e.url || "").filter(Boolean),
        storyAngle: opp.whyCare.personalBuildConnection,
      };
    });

    console.log(`[TREND_SCAN] candidateCount=${topics.length}`);

    const executionTimeMs = Date.now() - startTime;
    return {
      success: topics.length > 0,
      confidenceScore: topics.length > 0 ? 95 : 40,
      data: topics,
      validationResult: {
        passed: topics.length > 0,
        errors: topics.length === 0 ? ["No candidate topics found in trend scan"] : [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.TREND_DISCOVERY,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }

  public async runScanWithOpportunities(pipelineId?: string): Promise<{
    topics: Topic[];
    opportunities: ContentOpportunity[];
    scanResult: any;
  }> {
    const scanResult = await globalIntelligenceEngine.executeScan("ON_DEMAND");
    const res = await this.run(pipelineId);
    return { topics: res.data, opportunities: scanResult.opportunitiesGenerated, scanResult };
  }
}



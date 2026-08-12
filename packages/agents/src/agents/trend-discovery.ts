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
    if (t.includes("reasoning") || t.includes("model release") || t.includes("benchmark")) return "AI Model Benchmarks";
    if (t.includes("agent") || t.includes("swarm") || t.includes("tool calling")) return "Agentic AI System Design";
    if (t.includes("typescript") || t.includes("node") || t.includes("vite")) return "TypeScript Ecosystem";
    if (t.includes("security") || t.includes("vulnerability") || t.includes("mtls")) return "Developer Security";
    if (t.includes("docker") || t.includes("kubernetes") || t.includes("ebpf")) return "DevOps & Cloud Infrastructure";
    if (t.includes("rate limit") || t.includes("queue") || t.includes("latency") || t.includes("clickhouse")) return "System Performance & Databases";
    return "AI Engineering";
  }

  private extractFramework(tags: string[], title: string): string {
    const t = `${title} ${tags.join(" ")}`.toLowerCase();
    if (t.includes("deepseek")) return "DeepSeek-R1";
    if (t.includes("gemini")) return "Gemini 2.0";
    if (t.includes("claude")) return "Claude 3.5";
    if (t.includes("openai") || t.includes("o3-mini")) return "OpenAI o3-mini";
    if (t.includes("llama")) return "Llama 3.3";
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



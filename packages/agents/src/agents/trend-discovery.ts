import {
  AgentType,
  AgentResult,
  Topic,
  ContentOpportunity,
} from "@brand-os/shared";
import { globalIntelligenceEngine } from "@brand-os/intelligence";

export class TrendDiscoveryAgent {
  public async run(pipelineId?: string): Promise<AgentResult<Topic[]>> {
    const startTime = Date.now();
    console.log("[Trend Discovery Agent] Executing Global AI Intelligence Scan across 30+ sources...");

    const scanResult = await globalIntelligenceEngine.executeScan("ON_DEMAND");
    const approvedOpps = scanResult.approvedOpportunities;

    const topics: Topic[] = approvedOpps.map((opp) => ({
      id: opp.id,
      title: opp.topic,
      category: opp.recommendedAngle === "PERFORMANCE_COMPARISON" ? "AI Model Benchmarks" : "Agentic AI System Design",
      framework: "Model Context Protocol (MCP)",
      supportingTech: opp.experienceEvidence.flatMap((e) => e.technologiesUsed).slice(0, 4),
      score: opp.overallScore,
      reason: opp.whyCare.whyItMatters,
      trend_velocity: opp.trendVelocityScore / 10,
      difficulty: "ADVANCED",
      competition: "MEDIUM",
      audience: opp.targetAudience.map((a) => a.role).join(" & "),
      keywords: [opp.recommendedAngle, "MCP", "AI Intelligence"],
      references: opp.evidence.map((e) => e.url || "").filter(Boolean),
      storyAngle: opp.whyCare.personalBuildConnection,
    }));

    const executionTimeMs = Date.now() - startTime;
    return {
      success: topics.length > 0,
      confidenceScore: topics.length > 0 ? 95 : 50,
      data: topics,
      validationResult: {
        passed: topics.length > 0,
        errors: topics.length === 0 ? ["All discovered topics were stopped by the Do-Not-Publish gate"] : [],
        warnings: scanResult.rejectedOpportunities.length > 0
          ? [`${scanResult.rejectedOpportunities.length} hype topics were filtered out by Do-Not-Publish gate.`]
          : [],
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
    const approvedOpps = scanResult.approvedOpportunities;

    const topics: Topic[] = approvedOpps.map((opp) => ({
      id: opp.id,
      title: opp.topic,
      category: opp.recommendedAngle === "PERFORMANCE_COMPARISON" ? "AI Model Benchmarks" : "Agentic AI System Design",
      framework: "MCP",
      supportingTech: opp.experienceEvidence.flatMap((e) => e.technologiesUsed).slice(0, 4),
      score: opp.overallScore,
      reason: opp.whyCare.whyItMatters,
      trend_velocity: opp.trendVelocityScore / 10,
      difficulty: "ADVANCED",
      competition: "MEDIUM",
      audience: opp.targetAudience.map((a) => a.role).join(" & "),
      keywords: [opp.recommendedAngle, "MCP", "AI Intelligence"],
      references: opp.evidence.map((e) => e.url || "").filter(Boolean),
      storyAngle: opp.whyCare.personalBuildConnection,
    }));

    return { topics, opportunities: scanResult.opportunitiesGenerated, scanResult };
  }
}


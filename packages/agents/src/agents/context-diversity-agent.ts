import { AgentType, AgentResult } from "@brand-os/shared";

export interface ContextDiversityReport {
  diversityScore: number;
  sourceCount: number;
  uniqueDomainsCount: number;
  conceptConcentrationRatio: number;
  passed: boolean;
  rejectedTopics: string[];
  rejectionReason?: string;
  recommendedCategories: string[];
}

export class ContextDiversityAgent {
  public evaluateContextDiversity(citations: Array<{ title?: string; url?: string }>, pipelineId?: string): AgentResult<ContextDiversityReport> {
    const startTime = Date.now();
    console.log(`[Context Diversity Agent] Evaluating ${citations.length} retrieved context documents for topic concentration...`);

    const titles = citations.map((c) => (c.title || c.url || "").toLowerCase());
    const conceptsMap: Record<string, number> = {};

    titles.forEach((t) => {
      if (t.includes("mcp")) conceptsMap["mcp"] = (conceptsMap["mcp"] || 0) + 1;
      if (t.includes("rag")) conceptsMap["rag"] = (conceptsMap["rag"] || 0) + 1;
      if (t.includes("redis")) conceptsMap["redis"] = (conceptsMap["redis"] || 0) + 1;
      if (t.includes("agent")) conceptsMap["agent"] = (conceptsMap["agent"] || 0) + 1;
    });

    let maxConceptCount = 0;
    Object.values(conceptsMap).forEach((cnt) => {
      if (cnt > maxConceptCount) maxConceptCount = cnt;
    });

    const concentrationRatio = citations.length > 0 ? maxConceptCount / citations.length : 0;
    const isConcentrated = concentrationRatio > 0.60 && citations.length >= 3;

    const diversityScore = Math.max(0, Math.round((1 - concentrationRatio * 0.7) * 100));
    const passed = !isConcentrated && diversityScore >= 70;

    let rejectionReason: string | undefined;
    if (!passed) {
      rejectionReason = `CONTEXT_CONCENTRATION_REJECTED: Context retrieval concentration ratio is ${(concentrationRatio * 100).toFixed(0)}% (Threshold: <= 60%). Diversity score: ${diversityScore}/100.`;
    }

    const report: ContextDiversityReport = {
      diversityScore,
      sourceCount: citations.length,
      uniqueDomainsCount: Math.min(citations.length, 4),
      conceptConcentrationRatio: concentrationRatio,
      passed,
      rejectedTopics: isConcentrated ? ["MCP", "RAG", "Redis"] : [],
      rejectionReason,
      recommendedCategories: [
        "AI Infrastructure",
        "LLM Serving",
        "Developer Tooling",
        "System Design",
        "Open Source",
        "Security",
      ],
    };

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: passed ? 95 : 30,
      data: report,
      validationResult: {
        passed,
        errors: passed ? [] : [rejectionReason || "Context retrieval rejected by ContextDiversityAgent"],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.CONTENT_GAP,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const contextDiversityAgent = new ContextDiversityAgent();

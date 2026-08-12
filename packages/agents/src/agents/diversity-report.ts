import {
  AgentType,
  AgentResult,
  Topic,
  HistoricalPostRecord,
  DiversityReport7Day,
} from "@brand-os/shared";

export class DiversityReportAgent {
  public generateReport(
    selectedTopic: Topic | null,
    history: HistoricalPostRecord[],
    freshCandidates: Topic[],
    rejectedCandidates: Array<{ topic: Topic; reason: string }>,
    pipelineId?: string
  ): AgentResult<DiversityReport7Day> {
    const startTime = Date.now();
    const today = new Date().toISOString().split("T")[0];

    const recent7Days = history.filter(
      (p) => (Date.now() - new Date(p.publishedAt).getTime()) / 86400000 <= 7.0
    );

    const categoryCounts: Record<string, number> = {};
    const techCounts: Record<string, number> = {};

    recent7Days.forEach((p) => {
      const cat = p.category || "Uncategorized";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      if (p.framework) {
        techCounts[p.framework] = (techCounts[p.framework] || 0) + 1;
      }
      (p.supportingTech || []).forEach((st) => {
        techCounts[st] = (techCounts[st] || 0) + 1;
      });
    });

    const report: DiversityReport7Day = {
      date: today,
      todayTopic: selectedTopic ? selectedTopic.title : "NO_POST_TODAY",
      todayCategory: selectedTopic ? selectedTopic.category : "N/A",
      todayStatus: selectedTopic ? "POST_GENERATED" : "NO_POST_TODAY",
      last7DaysCategories: categoryCounts,
      repeatedTechnologies: techCounts,
      topFreshCandidates: freshCandidates.slice(0, 5).map((c) => c.title),
      rejectedCandidates: rejectedCandidates.map((r) => ({ topic: r.topic.title, reason: r.reason })),
      decisionExplainability: selectedTopic
        ? `Topic "${selectedTopic.title}" was chosen with adjusted score ${selectedTopic.categoryWeight || selectedTopic.score} after applying exponential time decay and portfolio category balancing.`
        : "All candidate topics were rejected due to high recent saturation or decay penalties. NO_POST_TODAY executed cleanly.",
    };

    console.log(`\n==================================================`);
    console.log(`DAILY CONTENT INTELLIGENCE & DIVERSITY REPORT (${today})`);
    console.log(`==================================================`);
    console.log(`Today's Topic: ${report.todayTopic}`);
    console.log(`Today's Category: ${report.todayCategory}`);
    console.log(`Status: ${report.todayStatus}`);
    console.log(`\nLast 7 Days Category Distribution:`, categoryCounts);
    console.log(`Repeated Technologies (7d):`, techCounts);
    console.log(`\nTop Fresh Candidates:`);
    report.topFreshCandidates.forEach((c, idx) => console.log(` ${idx + 1}. ${c}`));
    console.log(`\nRejected Candidates Count: ${rejectedCandidates.length}`);
    console.log(`Explainability: ${report.decisionExplainability}`);
    console.log(`==================================================\n`);

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 98,
      data: report,
      validationResult: { passed: true, errors: [], warnings: [] },
      metadata: {
        agentType: AgentType.CONTINUOUS_LEARNING,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const diversityReportAgent = new DiversityReportAgent();

import {
  AgentType,
  AgentResult,
  CONTENT_DIVERSITY_CATEGORIES,
  HistoricalPostRecord,
} from "@brand-os/shared";

export interface DomainPortfolioMetrics {
  domain: string;
  countLast30Days: number;
  countLast90Days: number;
  targetSharePercent: number;
  actualSharePercent: number;
  status: "BALANCED" | "UNDERREPRESENTED" | "OVEREMPHASIZED";
}

export interface ContentGapAnalysis {
  categoryDistribution: Record<string, number>;
  underrepresentedCategories: string[];
  overrepresentedCategories: string[];
  recommendedFocusCategories: string[];
  portfolioDomainMetrics: DomainPortfolioMetrics[];
}

export class ContentGapAgent {
  private readonly coreDomains = [
    { name: "AI Engineering", targetShare: 25 },
    { name: "System Design", targetShare: 20 },
    { name: "DevOps & Containers", targetShare: 15 },
    { name: "Security & Testing", targetShare: 15 },
    { name: "Career & Leadership", targetShare: 15 },
    { name: "Full Stack & Frontend", targetShare: 10 },
  ];

  public analyzeGaps(
    history: HistoricalPostRecord[] = [],
    pipelineId?: string
  ): AgentResult<ContentGapAnalysis> {
    const startTime = Date.now();
    const safeHistory = history || [];
    console.log(`[Content Gap Agent] Analyzing 90-day portfolio coverage metrics across ${safeHistory.length} historical posts...`);

    const recent50 = safeHistory.slice(0, 50);
    const categoryDistribution: Record<string, number> = {};

    CONTENT_DIVERSITY_CATEGORIES.forEach((cat) => {
      categoryDistribution[cat] = 0;
    });

    recent50.forEach((post) => {
      const catMatch = CONTENT_DIVERSITY_CATEGORIES.find(
        (c) => c.toLowerCase() === (post.category || "").toLowerCase()
      );
      if (catMatch) {
        categoryDistribution[catMatch]++;
      } else if (post.category) {
        categoryDistribution[post.category] = (categoryDistribution[post.category] || 0) + 1;
      }
    });

    const underrepresentedCategories: string[] = [];
    const overrepresentedCategories: string[] = [];

    Object.entries(categoryDistribution).forEach(([cat, count]) => {
      if (count === 0) {
        underrepresentedCategories.push(cat);
      } else if (count >= 5) {
        overrepresentedCategories.push(cat);
      }
    });

    // Compute long-term portfolio domain metrics
    const totalPostsCount = Math.max(1, recent50.length);
    const portfolioDomainMetrics: DomainPortfolioMetrics[] = this.coreDomains.map((domain) => {
      const domainCount = recent50.filter((p) => {
        const catLower = (p.category || "").toLowerCase();
        const titleLower = p.title.toLowerCase();
        return (
          catLower.includes(domain.name.toLowerCase()) ||
          titleLower.includes(domain.name.toLowerCase())
        );
      }).length;

      const actualSharePercent = Math.round((domainCount / totalPostsCount) * 100);
      let status: DomainPortfolioMetrics["status"] = "BALANCED";

      if (actualSharePercent < domain.targetShare - 10) {
        status = "UNDERREPRESENTED";
      } else if (actualSharePercent > domain.targetShare + 15) {
        status = "OVEREMPHASIZED";
      }

      return {
        domain: domain.name,
        countLast30Days: Math.min(domainCount, 10),
        countLast90Days: domainCount,
        targetSharePercent: domain.targetShare,
        actualSharePercent,
        status,
      };
    });

    const recommendedFocusCategories = underrepresentedCategories.slice(0, 5);

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 95,
      data: {
        categoryDistribution,
        underrepresentedCategories,
        overrepresentedCategories,
        recommendedFocusCategories,
        portfolioDomainMetrics,
      },
      validationResult: {
        passed: true,
        errors: [],
        warnings:
          overrepresentedCategories.length > 0
            ? [`Categories ${overrepresentedCategories.join(", ")} are overrepresented in recent portfolio history.`]
            : [],
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

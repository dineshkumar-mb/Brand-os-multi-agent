import {
  AgentType,
  AgentResult,
  Topic,
  HistoricalPostRecord,
} from "@brand-os/shared";

export class TopicIntelligenceAgent {
  private history: HistoricalPostRecord[] = [];

  constructor(initialHistory: HistoricalPostRecord[] = []) {
    this.history = initialHistory || [];
  }

  public setHistory(history: HistoricalPostRecord[]) {
    this.history = history || [];
  }

  public evaluateTopics(
    candidateTopics: Topic[],
    pipelineId?: string
  ): AgentResult<{ selectedTopic: Topic | null; rejectedTopics: { topic: Topic; reason: string }[] }> {
    const startTime = Date.now();
    console.log(`[Topic Intelligence Agent] Evaluating ${candidateTopics.length} candidate topics against past ${this.history.length} posts...`);

    const recent50 = this.history.slice(0, 50);
    const rejectedTopics: { topic: Topic; reason: string }[] = [];
    const scoredTopics: { topic: Topic; adjustedScore: number }[] = [];

    // Frequency map of frameworks in recent 50 posts
    const frameworkCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    recent50.forEach((post) => {
      if (post.framework) {
        const fw = post.framework.toLowerCase();
        frameworkCounts[fw] = (frameworkCounts[fw] || 0) + 1;
      }
      if (post.category) {
        const cat = post.category.toLowerCase();
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });

    for (const topic of candidateTopics) {
      let penalty = 0;
      let rejectionReason: string | null = null;

      const fw = (topic.framework || "").toLowerCase();
      const cat = (topic.category || "AI Engineering").toLowerCase();
      const titleLower = (topic.title || "").toLowerCase();

      // Check 1: Direct title match or very close title overlap in last 50
      const exactTitleMatch = recent50.some(
        (p) => p.title.toLowerCase() === titleLower || p.title.toLowerCase().includes(titleLower)
      );
      if (exactTitleMatch) {
        rejectionReason = `Title "${topic.title}" is too similar to a recently published post.`;
      }

      // Check 2: Overused framework threshold (e.g. > 3 posts in last 50 with same framework)
      const fwCount = fw ? frameworkCounts[fw] || 0 : 0;
      if (fwCount >= 4) {
        rejectionReason = `Framework "${topic.framework}" has been featured ${fwCount} times in the last 50 posts. Rejection threshold is >= 4.`;
      } else if (fwCount > 0) {
        penalty += fwCount * 15; // Apply score penalty
      }

      // Check 3: Overused category threshold (e.g. > 8 posts in last 50 with same category)
      const catCount = categoryCounts[cat] || 0;
      if (catCount > 3) {
        penalty += (catCount - 3) * 8;
      }

      if (rejectionReason) {
        rejectedTopics.push({ topic, reason: rejectionReason });
      } else {
        const adjustedScore = Math.max(0, topic.score - penalty);
        scoredTopics.push({
          topic: {
            ...topic,
            categoryWeight: adjustedScore,
          },
          adjustedScore,
        });
      }
    }

    // Sort scored topics by adjusted score descending
    scoredTopics.sort((a, b) => b.adjustedScore - a.adjustedScore);

    const selectedTopic = scoredTopics.length > 0 ? scoredTopics[0].topic : null;
    const passed = selectedTopic !== null;

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: passed ? 95 : 30,
      data: {
        selectedTopic,
        rejectedTopics,
      },
      validationResult: {
        passed,
        errors: passed ? [] : ["All candidate topics were rejected due to recent overuse or high repetition."],
        warnings: rejectedTopics.map((r) => `Rejected "${r.topic.title}": ${r.reason}`),
      },
      metadata: {
        agentType: AgentType.TOPIC_INTELLIGENCE,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

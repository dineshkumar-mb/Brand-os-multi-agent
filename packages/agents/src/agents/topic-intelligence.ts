import {
  AgentType,
  AgentResult,
  Topic,
  HistoricalPostRecord,
  ContentSaturationScore,
} from "@brand-os/shared";

export class TopicIntelligenceAgent {
  private history: HistoricalPostRecord[] = [];

  constructor(initialHistory: HistoricalPostRecord[] = []) {
    this.history = initialHistory || [];
  }

  public setHistory(history: HistoricalPostRecord[]) {
    this.history = history || [];
  }

  /**
   * Exponential Topic Decay Penalty Calculation
   * 0 days ago -> 100 penalty (0% eligibility)
   * 1 day ago  -> 95 penalty (5% eligibility)
   * 2 days ago -> 90 penalty (10% eligibility)
   * 3 days ago -> 80 penalty (20% eligibility)
   * 4 days ago -> 65 penalty (35% eligibility)
   * 5 days ago -> 50 penalty (50% eligibility)
   * 7 days ago -> 30 penalty (70% eligibility)
   * 14+ days  -> 0 penalty (100% eligibility)
   */
  public calculateDecayPenalty(daysAgo: number): number {
    if (daysAgo <= 0.5) return 100;
    if (daysAgo <= 1.5) return 95;
    if (daysAgo <= 2.5) return 90;
    if (daysAgo <= 3.5) return 80;
    if (daysAgo <= 4.5) return 65;
    if (daysAgo <= 5.5) return 50;
    if (daysAgo <= 7.0) return 30;
    if (daysAgo <= 14.0) return 15;
    return 0;
  }

  private tokenize(text: string): Set<string> {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    return new Set(words);
  }

  private jaccardSimilarity(textA: string, textB: string): number {
    const setA = this.tokenize(textA);
    const setB = this.tokenize(textB);
    if (setA.size === 0 || setB.size === 0) return 0;
    let inter = 0;
    setA.forEach((w) => {
      if (setB.has(w)) inter++;
    });
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : inter / union;
  }

  public calculateSaturationScores(
    topic: Topic,
    recentPosts: HistoricalPostRecord[]
  ): ContentSaturationScore {
    const topicLower = topic.title.toLowerCase();
    const fwLower = (topic.framework || "").toLowerCase();
    const catLower = (topic.category || "").toLowerCase();

    let recentTopicMatches = 0;
    let recentFwMatches = 0;
    let recentCatMatches = 0;
    let minDaysAgoTopic = 999;
    let minDaysAgoFw = 999;

    recentPosts.forEach((post) => {
      const pTitle = post.title.toLowerCase();
      const pFw = (post.framework || "").toLowerCase();
      const pCat = (post.category || "").toLowerCase();
      const pText = post.fullText.toLowerCase();

      const daysAgo = Math.max(0, (Date.now() - new Date(post.publishedAt).getTime()) / 86400000);

      // Check title or semantic similarity
      const titleSim = this.jaccardSimilarity(topicLower, pTitle);
      if (titleSim > 0.45 || (topicLower.length > 5 && pTitle.includes(topicLower))) {
        recentTopicMatches++;
        minDaysAgoTopic = Math.min(minDaysAgoTopic, daysAgo);
      }

      // Check technology / framework similarity
      if (
        (fwLower && pFw && (pFw.includes(fwLower) || fwLower.includes(pFw))) ||
        (fwLower && pText.includes(fwLower))
      ) {
        recentFwMatches++;
        minDaysAgoFw = Math.min(minDaysAgoFw, daysAgo);
      }

      // Check category
      if (catLower && pCat && (pCat.includes(catLower) || catLower.includes(pCat))) {
        recentCatMatches++;
      }
    });

    const topicDecayPenalty = this.calculateDecayPenalty(minDaysAgoTopic);
    const techDecayPenalty = this.calculateDecayPenalty(minDaysAgoFw);

    const topicSaturation = Math.min(100, recentTopicMatches * 45 + topicDecayPenalty * 0.5);
    const technologySaturation = Math.min(100, recentFwMatches * 25 + techDecayPenalty * 0.4);
    const categorySaturation = Math.min(100, recentCatMatches * 20);
    const narrativeSaturation = Math.min(100, recentTopicMatches * 30);
    const visualSaturation = Math.min(100, recentTopicMatches * 25);

    const overallSaturationScore = Math.round(
      topicSaturation * 0.35 +
      technologySaturation * 0.30 +
      categorySaturation * 0.20 +
      narrativeSaturation * 0.15
    );

    let rejected = false;
    let rejectionReason: string | undefined;

    if (minDaysAgoTopic < 2.0 && recentTopicMatches > 0) {
      rejected = true;
      rejectionReason = `RECENT_TOPIC_SATURATION: Topic published ${minDaysAgoTopic.toFixed(1)} days ago. Exponential decay penalty: ${topicDecayPenalty}%.`;
    } else if (recentFwMatches >= 3 && minDaysAgoFw < 3.0) {
      rejected = true;
      rejectionReason = `TECHNOLOGY_DECAY: Technology "${topic.framework}" featured ${recentFwMatches} times in recent posts (${minDaysAgoFw.toFixed(1)} days ago).`;
    } else if (overallSaturationScore >= 80) {
      rejected = true;
      rejectionReason = `HIGH_SATURATION_SCORE: Overall content saturation is ${overallSaturationScore}/100.`;
    }

    return {
      topicSaturation,
      technologySaturation,
      categorySaturation,
      narrativeSaturation,
      visualSaturation,
      overallSaturationScore,
      rejected,
      rejectionReason,
    };
  }

  public evaluateTopics(
    candidateTopics: Topic[],
    pipelineId?: string
  ): AgentResult<{ selectedTopic: Topic | null; rejectedTopics: { topic: Topic; reason: string }[] }> {
    const startTime = Date.now();
    console.log(`[Topic Intelligence Agent] Evaluating ${candidateTopics.length} candidate topics against past ${this.history.length} posts...`);

    const recent50 = this.history.slice(0, 50);
    const rejectedTopics: { topic: Topic; reason: string }[] = [];
    const scoredTopics: { topic: Topic; adjustedScore: number; saturation: ContentSaturationScore }[] = [];

    // Calculate category counts in last 7 days for portfolio balancing
    const recent7Days = this.history.filter(
      (p) => (Date.now() - new Date(p.publishedAt).getTime()) / 86400000 <= 7.0
    );

    const category7DayCounts: Record<string, number> = {};
    recent7Days.forEach((p) => {
      const c = (p.category || "AI Engineering").toLowerCase();
      category7DayCounts[c] = (category7DayCounts[c] || 0) + 1;
    });

    for (const topic of candidateTopics) {
      const saturation = this.calculateSaturationScores(topic, recent50);

      // Check Breaking News Override gate (< 24h, high velocity, Level 1 verified)
      const isBreakingNews =
        topic.trend_velocity >= 8.5 &&
        (topic.score >= 85 || topic.references.length > 0);

      if (saturation.rejected && !isBreakingNews) {
        console.log(`[TOPIC_FILTER] rejected=${topic.title} reason=${saturation.rejectionReason}`);
        rejectedTopics.push({ topic, reason: saturation.rejectionReason || "REJECTED_BY_SATURATION_GATE" });
        continue;
      }

      if (saturation.rejected && isBreakingNews) {
        console.log(`[TOPIC_FILTER] BREAKING_NEWS_OVERRIDE applied for topic=${topic.title}`);
      }

      // Portfolio Balancing Boost for under-represented categories (Security, DevOps, System Performance, Testing)
      const catLower = (topic.category || "").toLowerCase();
      const currentCatCount = category7DayCounts[catLower] || 0;
      let portfolioBalancingBonus = 0;
      if (currentCatCount === 0) {
        portfolioBalancingBonus = 15; // Underrepresented category boost
      } else if (currentCatCount >= 3) {
        portfolioBalancingBonus = -20; // Overrepresented category penalty
      }

      // FinalScore = BaseScore - SaturationPenalty + PortfolioBalancingBonus
      const adjustedScore = Math.max(0, topic.score - saturation.overallSaturationScore * 0.5 + portfolioBalancingBonus);

      scoredTopics.push({
        topic: {
          ...topic,
          categoryWeight: adjustedScore,
        },
        adjustedScore,
        saturation,
      });
    }

    // Sort scored topics descending by adjustedScore
    scoredTopics.sort((a, b) => b.adjustedScore - a.adjustedScore);

    const selectedTopic = scoredTopics.length > 0 ? scoredTopics[0].topic : null;
    const passed = selectedTopic !== null;

    if (selectedTopic) {
      console.log(`[TOPIC_FILTER] accepted=${selectedTopic.title} score=${scoredTopics[0].adjustedScore.toFixed(1)} category=${selectedTopic.category}`);
    } else {
      console.warn(`[TOPIC_FILTER] ALL ${candidateTopics.length} candidate topics rejected by Topic Intelligence. Status: NO_POST_TODAY.`);
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: passed ? 95 : 20,
      data: {
        selectedTopic,
        rejectedTopics,
      },
      validationResult: {
        passed,
        errors: passed ? [] : ["NO_POST_TODAY: All candidate topics were rejected due to recent topic decay or content saturation."],
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


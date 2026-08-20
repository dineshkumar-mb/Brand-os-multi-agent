import {
  AgentType,
  AgentResult,
  Topic,
  HistoricalPostRecord,
  SourceAuthorityLevel,
} from "@brand-os/shared";

export interface SemanticBreakdown {
  technologySimilarity: number;
  subtopicSimilarity: number;
  conceptSimilarity: number;
  problemSimilarity: number;
  angleSimilarity: number;
  storySimilarity: number;
  hookSimilarity: number;
  overallNoveltyScore: number;
  rejected: boolean;
  rejectionReason?: string;
  isBreakingOverride?: boolean;
}

export class TopicNoveltyEngine {
  private history: HistoricalPostRecord[] = [];

  constructor(history: HistoricalPostRecord[] = []) {
    this.history = history || [];
  }

  public setHistory(history: HistoricalPostRecord[]) {
    this.history = history || [];
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
    setA.forEach((w) => { if (setB.has(w)) inter++; });
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : inter / union;
  }

  public evaluateNovelty(
    topic: Topic,
    sourceLevel: SourceAuthorityLevel = SourceAuthorityLevel.LEVEL_2_SECONDARY,
    trendVelocity: number = 7.0,
    pipelineId?: string
  ): AgentResult<SemanticBreakdown> {
    const startTime = Date.now();
    const topicLower = topic.title.toLowerCase();
    const techLower = (topic.framework || topic.category || "").toLowerCase();

    let maxTechSim = 0;
    let maxConceptSim = 0;
    let maxAngleSim = 0;
    let mostSimilarPostTitle = "";
    let minDaysAgoTech = 999;
    let minDaysAgoTopic = 999;

    const now = Date.now();

    for (const post of this.history.slice(0, 50)) {
      const pTitle = post.title.toLowerCase();
      const pText = post.fullText.toLowerCase();
      const daysAgo = Math.max(0, (now - new Date(post.publishedAt).getTime()) / 86400000);

      const titleSim = this.jaccardSimilarity(topicLower, pTitle);
      const textSim = this.jaccardSimilarity(topicLower, pText);
      const overallSim = Math.max(titleSim, textSim);

      if (overallSim > maxConceptSim) {
        maxConceptSim = overallSim;
        mostSimilarPostTitle = post.title;
        minDaysAgoTopic = Math.min(minDaysAgoTopic, daysAgo);
      }

      if (techLower && (pTitle.includes(techLower) || pText.includes(techLower))) {
        maxTechSim = Math.max(maxTechSim, 0.8);
        minDaysAgoTech = Math.min(minDaysAgoTech, daysAgo);
      }
    }

    // Cooldown logic:
    // Exact topic: 90 days
    // Same concept: 21-30 days
    // Same tech: 5-7 days
    let rejected = false;
    let rejectionReason: string | undefined;

    if (minDaysAgoTopic < 7.0 && maxConceptSim > 0.5) {
      rejected = true;
      rejectionReason = `CONCEPT_COOLDOWN: Concept "${topic.title}" was published ${minDaysAgoTopic.toFixed(1)} days ago in "${mostSimilarPostTitle}". Minimum cooldown: 21 days.`;
    } else if (minDaysAgoTech < 3.0 && maxTechSim >= 0.8) {
      rejected = true;
      rejectionReason = `TECHNOLOGY_COOLDOWN: Technology "${topic.framework || topic.category}" featured ${minDaysAgoTech.toFixed(1)} days ago. Minimum tech cooldown: 5-7 days.`;
    }

    // BREAKING_EVENT_OVERRIDE check
    let isBreakingOverride = false;
    if (rejected && sourceLevel === SourceAuthorityLevel.LEVEL_1_PRIMARY && trendVelocity >= 8.5) {
      rejected = false;
      isBreakingOverride = true;
      console.log(`[TopicNoveltyEngine] BREAKING_EVENT_OVERRIDE applied for topic="${topic.title}" (Velocity: ${trendVelocity}, Level 1 Source).`);
    }

    const overallNoveltyScore = Math.max(0, Math.round((1 - maxConceptSim) * 100));

    const breakdown: SemanticBreakdown = {
      technologySimilarity: maxTechSim,
      subtopicSimilarity: maxConceptSim * 0.8,
      conceptSimilarity: maxConceptSim,
      problemSimilarity: maxConceptSim * 0.7,
      angleSimilarity: maxConceptSim * 0.6,
      storySimilarity: maxConceptSim * 0.5,
      hookSimilarity: maxConceptSim * 0.4,
      overallNoveltyScore,
      rejected,
      rejectionReason,
      isBreakingOverride,
    };

    const executionTimeMs = Date.now() - startTime;
    return {
      success: !rejected,
      confidenceScore: !rejected ? 95 : 30,
      data: breakdown,
      validationResult: {
        passed: !rejected,
        errors: rejected ? [rejectionReason || "Topic rejected by Novelty Engine"] : [],
        warnings: isBreakingOverride ? ["Allowed under BREAKING_EVENT_OVERRIDE"] : [],
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

export const topicNoveltyEngine = new TopicNoveltyEngine();

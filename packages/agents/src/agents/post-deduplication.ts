import {
  AgentType,
  AgentResult,
  HistoricalPostRecord,
  Topic,
  LinkedInPostPayload,
  DevToArticlePayload,
  PostDeduplicationResult,
} from "@brand-os/shared";

export class PostHistoryDeduplicationAgent {
  private history: HistoricalPostRecord[] = [];
  private readonly maxAllowedSimilarity = 0.30;
  private readonly frameworkCooldownDays = 5;
  private readonly topicCooldownDays = 14;

  constructor(initialHistory: HistoricalPostRecord[] = []) {
    this.history = initialHistory || [];
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

  private normalizeString(text: string): string {
    return (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  private extractRepoName(urlOrText: string): string | null {
    const match = (urlOrText || "").match(/github\.com\/([a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+)/i);
    return match ? match[1].toLowerCase() : null;
  }

  private jaccardSimilarity(textA: string, textB: string): number {
    const setA = this.tokenize(textA);
    const setB = this.tokenize(textB);

    if (setA.size === 0 || setB.size === 0) return 0;

    let intersectionCount = 0;
    setA.forEach((word) => {
      if (setB.has(word)) intersectionCount++;
    });

    const unionSize = new Set([...setA, ...setB]).size;
    return unionSize === 0 ? 0 : intersectionCount / unionSize;
  }

  private semanticCosineSimilarity(textA: string, textB: string): number {
    const setA = Array.from(this.tokenize(textA));
    const setB = Array.from(this.tokenize(textB));

    const vocab = Array.from(new Set([...setA, ...setB]));
    if (vocab.length === 0) return 0;

    const vecA = vocab.map((term) => (setA.includes(term) ? 1 : 0));
    const vecB = vocab.map((term) => (setB.includes(term) ? 1 : 0));

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vocab.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public evaluatePostDeduplication(
    topic: Topic,
    post: LinkedInPostPayload,
    article?: DevToArticlePayload | null,
    pipelineId?: string
  ): AgentResult<PostDeduplicationResult> {
    const startTime = Date.now();
    console.log(
      `[Post Deduplication Agent] Auditing post duplication against ${this.history.length} past posts (Max Sim: ${this.maxAllowedSimilarity}, Framework Cooldown: ${this.frameworkCooldownDays}d, Topic Cooldown: ${this.topicCooldownDays}d)...`
    );

    const rejectionReasons: string[] = [];
    const cooldownViolations: string[] = [];

    let maxOverallSim = 0;
    let worstTitleSim = 0;
    let worstHookSim = 0;
    let worstBodySim = 0;
    let maxSimilarPostId: string | undefined;
    let maxSimilarPostTitle: string | undefined;

    const nowMs = Date.now();

    // 1. Direct GitHub Repository & Project ID Cooldown (14-day window)
    const currentRepo = (topic.references || []).map((r) => this.extractRepoName(r)).find(Boolean) ||
      this.extractRepoName(post.fullText) ||
      this.extractRepoName(topic.title);

    for (const pastPost of this.history) {
      const publishedAtMs = pastPost.publishedAt ? new Date(pastPost.publishedAt).getTime() : nowMs - 86400000;
      const daysAgo = Math.max(0, (nowMs - publishedAtMs) / (1000 * 60 * 60 * 24));

      // 1a. Repository match check
      if (currentRepo && daysAgo < this.topicCooldownDays) {
        const pastRepo = ((pastPost as any).references || []).map((r: string) => this.extractRepoName(r)).find(Boolean) ||
          this.extractRepoName(pastPost.fullText) ||
          this.extractRepoName(pastPost.title);

        if (pastRepo && pastRepo === currentRepo) {
          const repoMsg = `REPOSITORY_COOLDOWN: GitHub repository '${currentRepo}' was already featured in post "${pastPost.title}" ${daysAgo.toFixed(1)} days ago (Minimum cooldown: ${this.topicCooldownDays} days).`;
          rejectionReasons.push(repoMsg);
          cooldownViolations.push(repoMsg);
          break;
        }
      }

      // 1b. Project ID match check (e.g. fallback topic IDs)
      if (topic.id && pastPost.id && daysAgo < this.topicCooldownDays) {
        if (topic.id === pastPost.id || (topic.id.length > 5 && pastPost.id.includes(topic.id))) {
          const idMsg = `PROJECT_ID_COOLDOWN: Project ID '${topic.id}' was already published ${daysAgo.toFixed(1)} days ago.`;
          rejectionReasons.push(idMsg);
          cooldownViolations.push(idMsg);
          break;
        }
      }
    }

    // 2. Framework & Core Technology Recency Cooldown Check (5 days)
    const targetFramework = (topic.framework || topic.category || "").trim().toLowerCase();
    let frameworkCooldownPassed = true;

    if (targetFramework && targetFramework !== "architecture" && targetFramework !== "system design") {
      for (const pastPost of this.history) {
        const pastFw = (pastPost.framework || pastPost.category || "").trim().toLowerCase();
        if (pastFw && (pastFw === targetFramework || pastFw.includes(targetFramework) || targetFramework.includes(pastFw))) {
          const publishedAtMs = pastPost.publishedAt ? new Date(pastPost.publishedAt).getTime() : nowMs - 86400000;
          const daysAgo = Math.max(0, (nowMs - publishedAtMs) / (1000 * 60 * 60 * 24));

          if (daysAgo < this.frameworkCooldownDays) {
            frameworkCooldownPassed = false;
            const violationMsg = `Framework/Technology Cooldown Violation: '${topic.framework || topic.category}' was used in post "${pastPost.title}" ${daysAgo.toFixed(1)} days ago (Minimum cooldown: ${this.frameworkCooldownDays} days).`;
            cooldownViolations.push(violationMsg);
            rejectionReasons.push(violationMsg);
            break;
          }
        }
      }
    }

    // 3. Comprehensive Post & Topic Similarity Checks vs Past 60 Posts
    const recent60 = this.history.slice(0, 60);
    const normPostTitle = this.normalizeString(post.title);
    const normTopicTitle = this.normalizeString(topic.title);

    for (const pastPost of recent60) {
      const publishedAtMs = pastPost.publishedAt ? new Date(pastPost.publishedAt).getTime() : nowMs - 86400000;
      const daysAgo = Math.max(0, (nowMs - publishedAtMs) / (1000 * 60 * 60 * 24));

      const titleSim = this.jaccardSimilarity(post.title, pastPost.title);
      const hookSim = this.jaccardSimilarity(post.hook, pastPost.hook);
      const bodyJaccard = this.jaccardSimilarity(post.fullText, pastPost.fullText);
      const bodyCosine = this.semanticCosineSimilarity(post.fullText, pastPost.fullText);
      const bodySim = (bodyJaccard + bodyCosine) / 2;

      // Exact or near-exact title match check
      const normPastTitle = this.normalizeString(pastPost.title);
      if (
        normPostTitle === normPastTitle ||
        (normPostTitle.length > 20 && normPastTitle.includes(normPostTitle)) ||
        (normPastTitle.length > 20 && normPostTitle.includes(normPastTitle)) ||
        normTopicTitle === normPastTitle
      ) {
        rejectionReasons.push(`EXACT_TITLE_DUPLICATION: Post title matches historical post "${pastPost.title}".`);
      }

      // Topic similarity check (if titles have >= 0.50 similarity within 14 days)
      if (titleSim >= 0.50 && daysAgo < this.topicCooldownDays) {
        rejectionReasons.push(`TOPIC_SIMILARITY_DUPLICATION: Post title similarity (${Math.round(titleSim * 100)}%) to past post "${pastPost.title}" (${daysAgo.toFixed(1)}d ago) exceeds 50%.`);
      }

      // Hook similarity guard (hooks must not be repeated)
      if (hookSim >= 0.40 && daysAgo < this.topicCooldownDays) {
        rejectionReasons.push(`HOOK_DUPLICATION: Hook similarity (${Math.round(hookSim * 100)}%) to past post "${pastPost.title}" exceeds threshold.`);
      }

      let combinedSim = titleSim * 0.35 + hookSim * 0.35 + bodySim * 0.30;

      if (article && article.markdownContent) {
        const devTitleSim = this.jaccardSimilarity(article.title, pastPost.title);
        const devBodySim = this.semanticCosineSimilarity(article.markdownContent, pastPost.fullText);
        combinedSim = Math.max(combinedSim, devTitleSim * 0.4 + devBodySim * 0.6);
      }

      if (combinedSim > maxOverallSim) {
        maxOverallSim = combinedSim;
        worstTitleSim = titleSim;
        worstHookSim = hookSim;
        worstBodySim = bodySim;
        maxSimilarPostId = pastPost.id;
        maxSimilarPostTitle = pastPost.title;
      }
    }

    const maxSimilarityScore = Math.round(maxOverallSim * 100) / 100;
    const similarityPassed = maxSimilarityScore <= this.maxAllowedSimilarity;

    if (!similarityPassed) {
      rejectionReasons.push(
        `POST_DUPLICATION_THRESHOLD_EXCEEDED: Overall similarity score (${maxSimilarityScore}) exceeds limit of ${this.maxAllowedSimilarity} compared to past post: "${maxSimilarPostTitle}".`
      );
    }

    const passed = similarityPassed && frameworkCooldownPassed && rejectionReasons.length === 0;

    console.log(
      `[POST_DEDUPLICATION] passed=${passed} maxSim=${maxSimilarityScore} frameworkCooldownPassed=${frameworkCooldownPassed} rejections=${rejectionReasons.length} matchingPost="${maxSimilarPostTitle || "None"}"`
    );

    const executionTimeMs = Date.now() - startTime;
    const resultData: PostDeduplicationResult = {
      passed,
      overallSimilarityScore: maxSimilarityScore,
      titleSimilarityScore: Math.round(worstTitleSim * 100) / 100,
      hookSimilarityScore: Math.round(worstHookSim * 100) / 100,
      bodySemanticSimilarity: Math.round(worstBodySim * 100) / 100,
      matchingPostId: maxSimilarPostId,
      matchingPostTitle: maxSimilarPostTitle,
      frameworkCooldownPassed,
      cooldownViolations,
      rejectionReasons,
    };

    return {
      success: passed,
      confidenceScore: passed ? 95 : 20,
      data: resultData,
      validationResult: {
        passed,
        errors: passed ? [] : rejectionReasons,
        warnings: [],
      },
      metadata: {
        agentType: AgentType.POST_HISTORY_DEDUPLICATION,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

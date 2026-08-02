import {
  AgentType,
  AgentResult,
  OriginalityCheckResult,
  HistoricalPostRecord,
  LinkedInPostPayload,
  DevToArticlePayload,
} from "@brand-os/shared";

export class OriginalityAgent {
  private history: HistoricalPostRecord[] = [];
  private readonly maxAllowedSimilarity = 0.35; // Maximum threshold = 0.35

  constructor(initialHistory: HistoricalPostRecord[] = []) {
    this.history = initialHistory || [];
  }

  public setHistory(history: HistoricalPostRecord[]) {
    this.history = history || [];
  }

  // Tokenize text into set of lowercase words
  private tokenize(text: string): Set<string> {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    return new Set(words);
  }

  // Lexical Jaccard similarity coefficient: |A ∩ B| / |A ∪ B|
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

  // Semantic Vector Cosine Similarity approximation over TF-IDF term frequency vectors
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

  public evaluateOriginality(
    post: LinkedInPostPayload,
    devToArticle?: DevToArticlePayload,
    pipelineId?: string
  ): AgentResult<OriginalityCheckResult> {
    const startTime = Date.now();
    console.log(`[Originality Agent] Running Hybrid Semantic & Lexical Originality Check vs past ${this.history.length} posts (Threshold: ${this.maxAllowedSimilarity})...`);

    const recent50 = this.history.slice(0, 50);

    let maxOverallSim = 0;
    let maxSimilarPostId: string | undefined;
    let maxSimilarPostTitle: string | undefined;
    let worstBreakdown = {
      titleSimilarity: 0,
      hookSimilarity: 0,
      technologyOverlap: 0,
      ctaSimilarity: 0,
      structureSimilarity: 0,
      semanticSimilarity: 0,
    };

    const rejectionReasons: string[] = [];

    for (const pastPost of recent50) {
      const titleSim = this.jaccardSimilarity(post.title, pastPost.title);
      const hookSim = this.jaccardSimilarity(post.hook, pastPost.hook);
      const ctaSim = this.jaccardSimilarity(post.cta, pastPost.cta || "");
      const fullTextSim = this.jaccardSimilarity(post.fullText, pastPost.fullText);
      const semanticSim = this.semanticCosineSimilarity(post.fullText, pastPost.fullText);

      // Hybrid similarity for LinkedIn
      const combinedFullTextSim = fullTextSim * 0.5 + semanticSim * 0.5;
      let overallSim = titleSim * 0.25 + hookSim * 0.25 + ctaSim * 0.15 + combinedFullTextSim * 0.35;

      // Also evaluate DEV.to article title & markdown content uniqueness if present
      if (devToArticle) {
        const devTitleSim = this.jaccardSimilarity(devToArticle.title, pastPost.title);
        const devBodySim = devToArticle.markdownContent
          ? this.semanticCosineSimilarity(devToArticle.markdownContent, pastPost.fullText)
          : 0;

        if (devTitleSim > 0.45 || devBodySim > 0.4) {
          overallSim = Math.max(overallSim, devTitleSim * 0.5 + devBodySim * 0.5);
        }
      }

      if (overallSim > maxOverallSim) {
        maxOverallSim = overallSim;
        maxSimilarPostId = pastPost.id;
        maxSimilarPostTitle = pastPost.title;
        worstBreakdown = {
          titleSimilarity: Math.round(titleSim * 100) / 100,
          hookSimilarity: Math.round(hookSim * 100) / 100,
          technologyOverlap: 0,
          ctaSimilarity: Math.round(ctaSim * 100) / 100,
          structureSimilarity: Math.round(fullTextSim * 100) / 100,
          semanticSimilarity: Math.round(semanticSim * 100) / 100,
        };
      }
    }

    const passed = maxOverallSim <= this.maxAllowedSimilarity;
    if (!passed) {
      rejectionReasons.push(
        `Hybrid semantic similarity score (${maxOverallSim.toFixed(2)}) exceeds threshold of ${this.maxAllowedSimilarity} compared to past post: "${maxSimilarPostTitle}"`
      );
    }

    const resultData: OriginalityCheckResult = {
      passed,
      overallSimilarityScore: Math.round(maxOverallSim * 100) / 100,
      semanticEmbeddingSimilarity: worstBreakdown.semanticSimilarity,
      maxSimilarPostId,
      maxSimilarPostTitle,
      breakdown: worstBreakdown,
      rejectionReasons,
    };

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: passed ? 95 : 30,
      data: resultData,
      validationResult: {
        passed,
        errors: passed ? [] : rejectionReasons,
        warnings: [],
      },
      metadata: {
        agentType: AgentType.ORIGINALITY,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
        retryCount: passed ? 0 : 1,
      },
    };
  }
}

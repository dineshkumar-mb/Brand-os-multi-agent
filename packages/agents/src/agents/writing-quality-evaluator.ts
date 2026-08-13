import {
  WritingQualityScore,
  ResearchOutput,
  ExperienceLog,
  HistoricalPostRecord,
  LinkedInPostPayload,
  DevToArticlePayload,
  BoredomScore,
  StoryQualityScore,
  STARStory,
} from "@brand-os/shared";

export class WritingQualityEvaluator {
  private readonly aiCliches: RegExp[] = [
    /in today's fast-paced world/gi,
    /let's dive in/gi,
    /game-changing/gi,
    /game changer/gi,
    /revolutionary/gi,
    /unlock the power/gi,
    /delve into/gi,
    /harness the power/gi,
    /it's important to remember/gi,
    /seamlessly/gi,
    /testament to/gi,
    /in conclusion/gi,
    /at the end of the day/gi,
    /beacon of/gi,
    /paradigm shift/gi,
    /furthermore,/gi,
    /moreover,/gi,
    /rich tapestry/gi,
    /tapestry of/gi,
    /cutting-edge/gi,
    /spearhead/gi,
    /holistic approach/gi,
    /synergy/gi,
    /transformative/gi,
    /supercharge/gi,
    /navigating the landscape/gi,
    /in the realm of/gi,
    /demystify/gi,
    /embark on a journey/gi,
    /as developers, we/gi,
    /technology is evolving rapidly/gi,
    /exciting times ahead/gi,
    /this is a must-have/gi,
    /transform your development workflow/gi,
    /whether you're a beginner or expert/gi,
  ];

  public evaluateBoredomScore(
    post: LinkedInPostPayload,
    historicalPosts: HistoricalPostRecord[] = []
  ): BoredomScore {
    const text = post.fullText || "";

    // 1. Structural Repetition: penalize if post contains rigid emoji headers like "1️⃣ Observation" or STAR labels
    let structuralRepetition = 0;
    if (/1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|Situation:|Task:|Action:|Result:/i.test(text)) {
      structuralRepetition += 80;
    }
    if (/here are \d+ (benefits|reasons|things)/i.test(text)) {
      structuralRepetition += 60;
    }

    // 2. Hook Repetition: check against last 10 historical hooks
    let hookRepetition = 0;
    if (historicalPosts.length > 0 && post.hook) {
      const currentHook = post.hook.toLowerCase().trim();
      const match = historicalPosts.slice(0, 10).some((p) => p.hook && p.hook.toLowerCase().trim() === currentHook);
      if (match) {
        hookRepetition = 100;
      }
    }

    // 3. Vocabulary Repetition
    let vocabularyRepetition = 0;
    for (const pattern of this.aiCliches) {
      if (pattern.test(text)) {
        vocabularyRepetition += 20;
      }
    }
    vocabularyRepetition = Math.min(100, vocabularyRepetition);

    // 4. Topic Repetition
    let topicRepetition = 0;
    if (historicalPosts.length > 0 && post.title) {
      const currentTitle = post.title.toLowerCase();
      const recentMatch = historicalPosts.slice(0, 3).some((p) => p.title && p.title.toLowerCase() === currentTitle);
      if (recentMatch) {
        topicRepetition = 80;
      }
    }

    // 5. CTA Repetition
    let ctaRepetition = 0;
    if (historicalPosts.length > 0 && post.cta) {
      const currentCta = post.cta.toLowerCase().trim();
      const ctaMatch = historicalPosts.slice(0, 7).some((p) => p.cta && p.cta.toLowerCase().trim() === currentCta);
      if (ctaMatch) {
        ctaRepetition = 85;
      }
    }

    // 6. Narrative Predictability & Genericness
    let narrativePredictability = 0;
    if (text.includes("1. ") && text.includes("2. ") && text.includes("3. ")) {
      narrativePredictability += 40;
    }
    let genericness = 0;
    if (!text.toLowerCase().includes("trade") && !text.toLowerCase().includes("bottleneck") && !text.toLowerCase().includes("latency")) {
      genericness += 45;
    }

    const overall = Math.round(
      structuralRepetition * 0.25 +
      hookRepetition * 0.20 +
      vocabularyRepetition * 0.15 +
      topicRepetition * 0.15 +
      ctaRepetition * 0.10 +
      narrativePredictability * 0.10 +
      genericness * 0.05
    );

    return {
      structuralRepetition,
      hookRepetition,
      vocabularyRepetition,
      topicRepetition,
      ctaRepetition,
      narrativePredictability,
      genericness,
      overall,
    };
  }

  public evaluateStoryQualityScore(
    post: LinkedInPostPayload,
    starStory?: STARStory
  ): StoryQualityScore {
    const text = post.fullText || "";

    // 1. Curiosity Hook (0 - 100)
    let curiosity = 80;
    if (post.hook && post.hook.length > 10 && !post.hook.toLowerCase().includes("today i want to talk")) {
      curiosity += 15;
    }

    // 2. Tension (0 - 100)
    let tension = 60;
    if (text.toLowerCase().includes("trade-off") || text.toLowerCase().includes("tradeoff") || text.toLowerCase().includes("instead") || text.toLowerCase().includes("bottleneck") || text.toLowerCase().includes("failed")) {
      tension += 30;
    }

    // 3. Specificity & Technical Depth (0 - 100)
    let specificity = 65;
    if (/\b(p99|latency|concurrency|throughput|backpressure|schema|redis|postgres|docker|typescript|circuit breaker)\b/i.test(text)) {
      specificity += 30;
    }

    // 4. Decision Quality (0 - 100)
    let decisionQuality = 70;
    if (text.toLowerCase().includes("chose") || text.toLowerCase().includes("decid") || text.toLowerCase().includes("pivot") || text.toLowerCase().includes("rejected")) {
      decisionQuality += 25;
    }

    // 5. Technical Depth & Seniority
    let technicalDepth = Math.min(100, specificity + 5);
    let seniority = 75;
    if (text.toLowerCase().includes("when not to use") || text.toLowerCase().includes("maintainability") || text.toLowerCase().includes("boundary")) {
      seniority += 20;
    }

    // 6. Result Strength & Authenticity
    let resultStrength = 75;
    if (/\b\d+(ms|%|x|kb|mb)\b/i.test(text) || text.toLowerCase().includes("observable") || text.toLowerCase().includes("stabilized")) {
      resultStrength += 20;
    }
    let authenticity = 90;

    // 7. STAR Completeness
    let starCompleteness = 90;
    if (starStory) {
      if (starStory.situation && starStory.task && starStory.action && starStory.result && starStory.insight) {
        starCompleteness = 98;
      }
    }

    const overall = Math.round(
      curiosity * 0.12 +
      tension * 0.15 +
      specificity * 0.12 +
      decisionQuality * 0.15 +
      technicalDepth * 0.12 +
      resultStrength * 0.10 +
      authenticity * 0.08 +
      seniority * 0.08 +
      starCompleteness * 0.08
    );

    return {
      curiosity,
      tension,
      specificity,
      decisionQuality,
      technicalDepth,
      resultStrength,
      authenticity,
      seniority,
      starCompleteness,
      overall,
    };
  }

  public evaluate(
    linkedInPost: LinkedInPostPayload,
    devToArticle?: DevToArticlePayload,
    research?: ResearchOutput,
    experience?: ExperienceLog | any,
    historicalPosts: HistoricalPostRecord[] = [],
    starStory?: STARStory
  ): WritingQualityScore {
    const text = (linkedInPost.fullText || "") + " " + (devToArticle?.markdownContent || "");

    // 1. AI Cliché Score (100 = zero cliches)
    let clicheMatches = 0;
    for (const pattern of this.aiCliches) {
      const matches = text.match(pattern);
      if (matches) {
        clicheMatches += matches.length;
      }
    }
    const aiClicheScore = Math.max(0, 100 - clicheMatches * 25);

    // 2. Technical Depth Score (0 - 100)
    let technicalDepth = 60;
    const depthKeywords = [
      "trade-off", "tradeoff", "concurrency", "bottleneck", "bounded context",
      "p99", "latency", "throughput", "backpressure", "circuit breaker",
      "idempotency", "eventual consistency", "schema evolution", "connection pooling",
      "memory pressure", "rate limiting", "horizontal scaling", "failover", "telemetry"
    ];
    let depthMatches = 0;
    for (const kw of depthKeywords) {
      if (text.toLowerCase().includes(kw)) {
        depthMatches++;
      }
    }
    technicalDepth = Math.min(100, 65 + depthMatches * 6);

    if (text.toLowerCase().includes("redis is fast") && !text.toLowerCase().includes("trade")) {
      technicalDepth -= 30;
    }

    // 3. Seniority Score (0 - 100)
    let seniority = 45;
    const seniorMarkers = [
      "trade-off", "tradeoff", "why", "production", "failure mode", "boundary", "cost", "maintainability",
      "evaluat", "decid", "instead", "sacrific", "when not to use", "source of truth", "eventual consistency",
      "invalidation", "telemetry", "architecture", "resilience", "isolation", "bottleneck"
    ];
    let seniorMatches = 0;
    for (const sm of seniorMarkers) {
      if (text.toLowerCase().includes(sm)) {
        seniorMatches++;
      }
    }
    seniority = Math.min(100, 45 + seniorMatches * 10);

    if (seniorMatches === 0) {
      seniority = 40;
    }

    if (
      (text.toLowerCase().includes("how to use") || text.toLowerCase().includes("here is how") || text.includes("1. Enforce")) &&
      !text.toLowerCase().includes("trade-off") &&
      !text.toLowerCase().includes("bottleneck")
    ) {
      seniority -= 15;
    }

    // 4. Authenticity Score (0 - 100)
    let authenticity = 90;
    const hasDirectBuildMatch = experience?.foundMatch || experience?.technologiesUsed?.length > 0;
    const claimsFirstHandBuild = /i (built|deployed|scaled|fixed|configured|wrote)/gi.test(text);

    if (claimsFirstHandBuild && !hasDirectBuildMatch) {
      authenticity -= 35;
    }

    // 5. Evidence Quality Score (0 - 100)
    let evidenceQuality = 90;
    const percentageMatch = text.match(/\b\d+%/g);
    if (percentageMatch && percentageMatch.length > 0) {
      const researchText = JSON.stringify(research || {});
      let verifiedCount = 0;
      for (const pct of percentageMatch) {
        if (researchText.includes(pct)) {
          verifiedCount++;
        }
      }
      if (verifiedCount < percentageMatch.length) {
        const unverifiedCount = percentageMatch.length - verifiedCount;
        evidenceQuality = Math.max(20, evidenceQuality - unverifiedCount * 30);
      }
    }

    // 6. Readability Score (0 - 100)
    let readability = 88;
    const lines = linkedInPost.fullText.split("\n").filter((l) => l.trim().length > 0);
    const hasLongWallsOfText = lines.some((l) => l.split(".").length > 4 && l.length > 300);
    if (hasLongWallsOfText) {
      readability -= 20;
    }

    // 7. Originality Score (0 - 100)
    let originality = 92;
    if (historicalPosts.length > 0) {
      const currentHook = linkedInPost.hook.toLowerCase();
      const recentHookMatch = historicalPosts.slice(0, 10).some((p) => p.hook && p.hook.toLowerCase() === currentHook);
      if (recentHookMatch) {
        originality -= 40;
      }
    }

    // 8. Narrative Quality & Clarity
    const narrativeQuality = 90;
    const clarity = 92;

    // 9. Career Signal & Discussion Potential
    const careerSignal = Math.round((technicalDepth * 0.5 + seniority * 0.5));
    const discussionPotential = linkedInPost.cta && linkedInPost.cta.includes("?") ? 92 : 75;

    // 10. BoredomScore & StoryQualityScore
    const boredomScore = this.evaluateBoredomScore(linkedInPost, historicalPosts);
    const storyQualityScore = this.evaluateStoryQualityScore(linkedInPost, starStory);

    // 11. Overall Score calculation
    const overall = Math.round(
      clarity * 0.08 +
      technicalDepth * 0.15 +
      seniority * 0.18 +
      authenticity * 0.15 +
      originality * 0.10 +
      narrativeQuality * 0.08 +
      evidenceQuality * 0.10 +
      readability * 0.06 +
      careerSignal * 0.05 +
      aiClicheScore * 0.05
    );

    return {
      clarity,
      technicalDepth,
      seniority,
      authenticity,
      originality,
      narrativeQuality,
      evidenceQuality,
      readability,
      careerSignal,
      discussionPotential,
      aiClicheScore,
      overall,
      boredomScore,
      storyQualityScore,
    };
  }
}

export const writingQualityEvaluator = new WritingQualityEvaluator();

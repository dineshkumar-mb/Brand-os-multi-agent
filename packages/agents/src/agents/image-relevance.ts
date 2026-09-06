import {
  AgentType,
  AgentResult,
  Topic,
  LinkedInPostPayload,
  DevToArticlePayload,
  VisualIntelligenceOutput,
  VisualPlanBlueprint,
  ImageRelevanceResult,
} from "@brand-os/shared";

export class ImageRelevanceVerificationAgent {
  private readonly minRelevanceThreshold = 80;

  private extractKeywords(text: string): Set<string> {
    const stopwords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
      "with", "about", "against", "between", "into", "through", "during",
      "before", "after", "above", "below", "from", "up", "down", "of", "off",
      "over", "under", "again", "further", "then", "once", "here", "there",
      "when", "where", "why", "how", "all", "any", "both", "each", "few",
      "more", "most", "other", "some", "such", "no", "nor", "not", "only",
      "own", "same", "so", "than", "too", "very", "can", "will", "just",
      "don", "should", "now", "this", "that", "these", "those", "is", "are",
      "was", "were", "be", "been", "being", "have", "has", "had", "do", "does",
      "did", "doing", "our", "we", "you", "your", "my", "i", "it", "its"
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopwords.has(w));

    return new Set(words);
  }

  private extractSvgTextNodes(svgContent: string): string[] {
    const textNodes: string[] = [];
    const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
    let match;
    while ((match = textRegex.exec(svgContent)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, "").trim();
      if (text.length > 0) {
        textNodes.push(text);
      }
    }
    return textNodes;
  }

  public evaluateImageRelevance(
    topic: Topic,
    post: LinkedInPostPayload,
    article?: DevToArticlePayload | null,
    visualOutput?: VisualIntelligenceOutput | null,
    visualPlan?: VisualPlanBlueprint | null,
    pipelineId?: string
  ): AgentResult<ImageRelevanceResult> {
    const startTime = Date.now();
    console.log(`[Image Relevance Agent] Auditing image/visual relevance for topic: "${topic.title}"...`);

    const rejectionReasons: string[] = [];

    // 1. Gather text content from post draft and topic
    const topicKeywords = new Set([
      ...topic.keywords.map((k) => k.toLowerCase()),
      topic.category.toLowerCase(),
      (topic.framework || "").toLowerCase(),
    ].filter(Boolean));

    const postContent = `${topic.title} ${post.title} ${post.hook} ${post.fullText} ${article?.markdownContent || ""}`;
    const allPostKeywords = this.extractKeywords(postContent);

    // Merge topic keywords into core set
    topicKeywords.forEach((k) => allPostKeywords.add(k));

    // 2. Gather visual nodes/text elements from SVG, visual plan, or visual output prompt
    const visualTextElements: string[] = [];

    // Inspect SVG if available
    let svgContent = visualPlan?.renderedSvg || "";
    if (!svgContent && post.imageUrl && post.imageUrl.startsWith("data:image/svg+xml;utf8,")) {
      svgContent = decodeURIComponent(post.imageUrl.replace("data:image/svg+xml;utf8,", ""));
    }

    if (svgContent) {
      const extractedNodes = this.extractSvgTextNodes(svgContent);
      visualTextElements.push(...extractedNodes);
    }

    // Inspect visual plan diagram spec if available
    if (visualPlan?.diagramSpec) {
      if (visualPlan.diagramSpec.title) visualTextElements.push(visualPlan.diagramSpec.title);
      if (visualPlan.diagramSpec.columns) {
        visualPlan.diagramSpec.columns.forEach((col) => {
          if (col.title) visualTextElements.push(col.title);
          if (col.subtitle) visualTextElements.push(col.subtitle);
          if (col.nodes) {
            col.nodes.forEach((node) => {
              if (node.label) visualTextElements.push(node.label);
              if (node.sublabel) visualTextElements.push(node.sublabel);
            });
          }
        });
      }
    }

    // Inspect visual output structured prompt if available
    if (visualOutput?.structuredPrompt) {
      if (visualOutput.structuredPrompt.subject) visualTextElements.push(visualOutput.structuredPrompt.subject);
      if (visualOutput.structuredPrompt.story) visualTextElements.push(visualOutput.structuredPrompt.story);
      if (visualOutput.structuredPrompt.keyElements) {
        visualTextElements.push(...visualOutput.structuredPrompt.keyElements);
      }
    }

    const visualTextCombined = visualTextElements.join(" ");
    const visualKeywords = this.extractKeywords(visualTextCombined);

    // 3. Keyword Match Rate Calculation
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    topicKeywords.forEach((kw) => {
      let isMatched = false;
      visualKeywords.forEach((vk) => {
        if (vk.includes(kw) || kw.includes(vk)) {
          isMatched = true;
        }
      });
      if (isMatched || visualTextCombined.toLowerCase().includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const keywordMatchRate = topicKeywords.size > 0
      ? Math.round((matchedKeywords.length / topicKeywords.size) * 100)
      : 100;

    // 4. Domain Alignment Check
    // Prevent cross-domain visual mismatches (e.g., eBPF network visual for React UI post)
    let domainAlignmentScore = 100;
    const categoryLower = topic.category.toLowerCase();
    const visualTextLower = visualTextCombined.toLowerCase();

    if (categoryLower.includes("react") || categoryLower.includes("frontend") || categoryLower.includes("ui")) {
      if (visualTextLower.includes("ebpf") || visualTextLower.includes("kernel") || visualTextLower.includes("columnar analytics")) {
        domainAlignmentScore = 30;
        rejectionReasons.push("Domain Mismatch: Image displays low-level kernel/analytics nodes for a Frontend/React topic.");
      }
    } else if (categoryLower.includes("agentic") || categoryLower.includes("ai")) {
      if (visualTextLower.includes("css grid") || visualTextLower.includes("flexbox layout")) {
        domainAlignmentScore = 40;
        rejectionReasons.push("Domain Mismatch: Image displays frontend layout CSS nodes for an AI/LLM topic.");
      }
    }

    // 5. STAR Story Visual Representation Score
    let starStoryVisualAlignmentScore = visualOutput?.visualStoryAlignmentScore || 85;
    if (visualTextElements.length === 0 && !svgContent) {
      starStoryVisualAlignmentScore = 50;
      rejectionReasons.push("Missing Visual Spec: No SVG text nodes or diagram specs found to evaluate image relevance.");
    }

    // 6. Overall Relevance Calculation
    const relevanceScore = Math.round(
      keywordMatchRate * 0.4 + domainAlignmentScore * 0.3 + starStoryVisualAlignmentScore * 0.3
    );

    const passed = relevanceScore >= this.minRelevanceThreshold && domainAlignmentScore >= 70;

    if (!passed && relevanceScore < this.minRelevanceThreshold) {
      rejectionReasons.push(
        `Image relevance score (${relevanceScore}%) is below mandatory threshold of ${this.minRelevanceThreshold}%. Missing key topic concepts in visual: ${missingKeywords.join(", ")}.`
      );
    }

    console.log(
      `[IMAGE_RELEVANCE] passed=${passed} relevanceScore=${relevanceScore} keywordMatchRate=${keywordMatchRate}% domainAlignment=${domainAlignmentScore}`
    );

    const executionTimeMs = Date.now() - startTime;
    const resultData: ImageRelevanceResult = {
      passed,
      relevanceScore,
      keywordMatchRate,
      domainAlignmentScore,
      starStoryVisualAlignmentScore,
      matchedKeywords,
      missingKeywords,
      svgNodesInspected: visualTextElements.length,
      rejectionReasons,
    };

    return {
      success: passed,
      confidenceScore: relevanceScore,
      data: resultData,
      validationResult: {
        passed,
        errors: passed ? [] : rejectionReasons,
        warnings: [],
      },
      metadata: {
        agentType: AgentType.IMAGE_RELEVANCE_CHECK,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

import {
  AgentType,
  AgentResult,
  AgentEvent,
  LinkedInPostPayload,
  LinkedInAlgorithmAuditResult,
} from "@brand-os/shared";

export class LinkedInAlgorithmAuditor {
  private readonly minScoreThreshold = 80;

  public auditPostForAlgorithm(
    post: LinkedInPostPayload,
    pipelineId?: string
  ): AgentResult<LinkedInAlgorithmAuditResult> {
    const startTime = Date.now();
    console.log(`[LinkedIn Algorithm Auditor] Auditing post layout and algorithm compliance for: "${post.title}"...`);

    const rejectionReasons: string[] = [];
    const suggestions: string[] = [];

    const fullText = post.fullText || "";
    const lines = fullText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

    // 1. Mobile See-More Fold Check (First 3 lines / first 210 chars)
    const firstLine = lines[0] || "";
    const firstThreeLines = lines.slice(0, 3).join(" ");
    const firstLineCharCount = firstLine.length;
    const seeMoreFoldPassed = firstLineCharCount <= 210 && firstThreeLines.length <= 320;

    if (!seeMoreFoldPassed) {
      suggestions.push("Mobile See-More Fold Notice: Hook in line 1 is long (>210 chars). LinkedIn will truncate text before user clicks '...see more'.");
    }

    // 2. External Link Reach Penalty Hazard
    const urlRegex = /https?:\/\/[^\s]+/gi;
    const externalUrlsFound = fullText.match(urlRegex) || [];
    const hasLinkPenaltyHazard = externalUrlsFound.length > 0;

    if (hasLinkPenaltyHazard) {
      rejectionReasons.push(`External Link Hazard: Found ${externalUrlsFound.length} inline URL(s) in post body. LinkedIn algorithm penalizes posts containing external links by 40-60% reach reduction.`);
      suggestions.push("Move external links out of post body into comment section or reference footnotes.");
    }

    // 3. Paragraph Readability & Spacing Audit
    // Check for walls of text (any paragraph > 4 consecutive lines without double line breaks)
    const paragraphs = fullText.split(/\n\s*\n/);
    let maxParagraphLines = 0;
    paragraphs.forEach((p) => {
      const pLines = p.split("\n").filter((l) => l.trim().length > 0).length;
      if (pLines > maxParagraphLines) {
        maxParagraphLines = pLines;
      }
    });

    const paragraphSpacingPassed = maxParagraphLines <= 3;
    if (!paragraphSpacingPassed) {
      rejectionReasons.push(`Readability Wall of Text: Detected paragraph with ${maxParagraphLines} consecutive lines. Maximum recommended is 3 lines for mobile feed readability.`);
      suggestions.push("Add double line breaks between paragraphs to improve scannability on mobile feeds.");
    }

    // 4. Hashtag Optimization Check (2 - 4 niche hashtags optimal)
    const hashtagCount = post.hashtags ? post.hashtags.length : (fullText.match(/#[a-z0-9_]+/gi) || []).length;
    const hashtagCountPassed = hashtagCount >= 1 && hashtagCount <= 5;

    if (hashtagCount > 5) {
      rejectionReasons.push(`Excessive Hashtags: Post contains ${hashtagCount} hashtags (Limit is <= 5). Over-hashtagging triggers algorithm spam filters.`);
    } else if (hashtagCount === 0) {
      suggestions.push("Add 2-3 niche technical hashtags (#TypeScript, #SystemDesign) to boost search discovery.");
    }

    // 5. Optimal Post Character Length Check (800 - 2,100 chars sweet spot)
    const characterCount = fullText.length;
    const characterLengthPassed = characterCount >= 300 && characterCount <= 3000;

    if (characterCount < 300) {
      rejectionReasons.push(`Post Length Warning: Post is too short (${characterCount} chars). LinkedIn algorithm prioritizes posts with 800+ chars of engineering value.`);
    } else if (characterCount > 3000) {
      rejectionReasons.push(`Post Length Warning: Post is excessively long (${characterCount} chars). Exceeds 3,000 character limit.`);
    }

    // 6. Score Calculation
    let score = 100;
    if (!seeMoreFoldPassed) score -= 10;
    if (hasLinkPenaltyHazard) score -= 30;
    if (!paragraphSpacingPassed) score -= 15;
    if (!hashtagCountPassed) score -= 15;
    if (!characterLengthPassed) score -= 20;

    const passed = score >= this.minScoreThreshold && !hasLinkPenaltyHazard && rejectionReasons.length === 0;

    console.log(
      `[LINKEDIN_ALGORITHM_AUDITOR] passed=${passed} score=${score} linkHazard=${hasLinkPenaltyHazard} charCount=${characterCount} hashtags=${hashtagCount}`
    );

    const executionTimeMs = Date.now() - startTime;
    const resultData: LinkedInAlgorithmAuditResult = {
      passed,
      score,
      seeMoreFoldPassed,
      firstLineCharCount,
      hasLinkPenaltyHazard,
      externalUrlsFound,
      paragraphSpacingPassed,
      maxParagraphLines,
      hashtagCountPassed,
      hashtagCount,
      characterLengthPassed,
      characterCount,
      rejectionReasons,
      suggestions,
    };

    return {
      success: passed,
      confidenceScore: score,
      data: resultData,
      validationResult: {
        passed,
        errors: passed ? [] : rejectionReasons,
        warnings: suggestions,
      },
      metadata: {
        agentType: AgentType.LINKEDIN_ALGORITHM_AUDITOR,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

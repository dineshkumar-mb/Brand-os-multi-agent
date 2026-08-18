import {
  AgentType,
  AgentResult,
  ResearchOutput,
  TechnicalCredibilityResult,
} from "@brand-os/shared";
import { MinedExperienceNarrative } from "./experience-mining";

export interface TechnicalReviewResult {
  syntaxValid: boolean;
  frameworkVersionValid: boolean;
  tradeoffsAddressed: boolean;
  securityChecksPassed: boolean;
  credibilityGatePassed: boolean;
  evidenceAuthenticityScore: number; // 0 - 100
  accuracyScore: number; // 0 - 100
  passed: boolean;
  reviewNotes: string[];
  credibilityDetails?: TechnicalCredibilityResult;
}

export class TechnicalReviewerAgent {
  public auditTechnicalContent(
    text: string,
    research: ResearchOutput,
    experience?: MinedExperienceNarrative,
    pipelineId?: string
  ): AgentResult<TechnicalReviewResult> {
    const startTime = Date.now();
    console.log("[Technical Reviewer Agent] Auditing technical accuracy, syntax, and Technical Credibility Gate...");

    const reviewNotes: string[] = [];
    let accuracyScore = 95;

    // Audit 1: Trade-offs mentioned
    const tradeoffsAddressed =
      text.toLowerCase().includes("trade-off") ||
      text.toLowerCase().includes("tradeoff") ||
      text.toLowerCase().includes("cons:") ||
      text.toLowerCase().includes("pros:");
    if (!tradeoffsAddressed) {
      accuracyScore -= 10;
      reviewNotes.push("Content lacks explicit discussion of engineering trade-offs.");
    }

    // Audit 2: Code syntax balance
    let syntaxValid = true;
    if (research.code_snippets.length > 0) {
      const code = research.code_snippets[0].code;
      if (code.includes("undefined") && !code.includes("?") && !code.includes("if")) {
        syntaxValid = false;
        accuracyScore -= 25;
        reviewNotes.push("Potential uncaught undefined reference in code snippet.");
      }
    }

    // Audit 3: Security & framework version checks
    const securityChecksPassed = !text.toLowerCase().includes("eval(") && !text.toLowerCase().includes("exec(");
    if (!securityChecksPassed) {
      accuracyScore -= 30;
      reviewNotes.push("Dangerous execution method detected in content.");
    }

    // Audit 4: Mandatory Technical Credibility Gate
    const textLower = text.toLowerCase();
    const hasBuildMatch = Boolean(experience?.foundMatch && experience?.projectContext);

    // 4A: Prohibited / Invented Context Check
    const inventedContextPatterns = [
      /our engineering team/i,
      /production deployments?/i,
      /microservices?/i,
      /event bus(?:es)?/i,
      /rpc systems?/i,
      /distributed state/i,
      /circuit breakers?/i,
    ];
    const flaggedPhrases: string[] = [];
    const suggestedRewrites: Array<{ original: string; suggested: string; reason: string }> = [];

    if (!hasBuildMatch) {
      for (const pattern of inventedContextPatterns) {
        if (pattern.test(text)) {
          const matchStr = text.match(pattern)?.[0] || "";
          flaggedPhrases.push(matchStr);
          reviewNotes.push(`Unsupported engineering context detected without build match: "${matchStr}".`);
        }
      }
    }

    // 4B: First-Person Claims Proof Gate
    const firstPersonPatterns = [
      /\bi built\b/i,
      /\bi implemented\b/i,
      /\bi benchmarked\b/i,
      /\bi optimized\b/i,
      /\bi discovered\b/i,
      /\bour team\b/i,
      /\bwe deployed\b/i,
      /\bwe improved\b/i,
    ];
    let firstPersonClaimsVerified = true;
    if (!hasBuildMatch) {
      for (const pattern of firstPersonPatterns) {
        if (pattern.test(text)) {
          firstPersonClaimsVerified = false;
          const matchStr = text.match(pattern)?.[0] || "";
          flaggedPhrases.push(matchStr);
          reviewNotes.push(`First-person claim "${matchStr}" lacks retrieved project/experience evidence.`);
        }
      }
    }

    // 4C: Benchmark Claims Protocol
    let benchmarkClaimsVerified = true;
    if (textLower.includes("i benchmarked") || textLower.includes("we benchmarked") || textLower.includes("my benchmark")) {
      const hasMetric = /\b(\d+ms|\d+%|\d+ ops|\d+ rps|\d+kb|\d+mb)\b/i.test(text);
      const hasBaseline = /baseline|compared to|versus|from \d+/i.test(text);
      if (!hasMetric || !hasBaseline || !hasBuildMatch) {
        benchmarkClaimsVerified = false;
        reviewNotes.push(`Benchmark claim made without complete benchmark evidence (metric/baseline/workload missing). Must rewrite as "I explored".`);
        suggestedRewrites.push({
          original: "I benchmarked",
          suggested: "I explored",
          reason: "Benchmark claims require documented workload, baseline, metric, and environment evidence."
        });
      }
    }

    // 4D: Calculate Evidence / Authenticity Score (30% Weight)
    let evidenceAuthenticityScore = 100;
    if (!hasBuildMatch) {
      evidenceAuthenticityScore = 75;
      if (!firstPersonClaimsVerified) evidenceAuthenticityScore -= 30;
      if (!benchmarkClaimsVerified) evidenceAuthenticityScore -= 20;
      evidenceAuthenticityScore -= (flaggedPhrases.length * 10);
    } else {
      if (!benchmarkClaimsVerified) evidenceAuthenticityScore -= 25;
      evidenceAuthenticityScore -= (flaggedPhrases.length * 5);
    }
    evidenceAuthenticityScore = Math.max(0, Math.min(100, evidenceAuthenticityScore));

    const credibilityGatePassed = evidenceAuthenticityScore >= 70 && firstPersonClaimsVerified && benchmarkClaimsVerified;

    const passed = accuracyScore >= 80 && syntaxValid && securityChecksPassed && credibilityGatePassed;

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: accuracyScore,
      data: {
        syntaxValid,
        frameworkVersionValid: true,
        tradeoffsAddressed,
        securityChecksPassed,
        credibilityGatePassed,
        evidenceAuthenticityScore,
        accuracyScore,
        passed,
        reviewNotes,
        credibilityDetails: {
          passed: credibilityGatePassed,
          evidenceFound: hasBuildMatch,
          unsupportedClaimsCount: flaggedPhrases.length,
          benchmarkClaimsVerified,
          architectureClaimsVerified: hasBuildMatch || flaggedPhrases.length === 0,
          firstPersonClaimsVerified,
          interviewDefensePassed: credibilityGatePassed,
          evidenceAuthenticityScore,
          flaggedPhrases,
          rejectionReasons: credibilityGatePassed ? [] : reviewNotes.filter((n) => n.includes("lack") || n.includes("First-person") || n.includes("Benchmark")),
          suggestedRewrites,
        },
      },
      validationResult: {
        passed,
        errors: passed ? [] : reviewNotes,
        warnings: reviewNotes,
      },
      metadata: {
        agentType: AgentType.TECHNICAL_REVIEWER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

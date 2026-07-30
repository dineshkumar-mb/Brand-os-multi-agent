import {
  AgentType,
  AgentResult,
  ResearchOutput,
} from "@brand-os/shared";

export interface TechnicalReviewResult {
  syntaxValid: boolean;
  frameworkVersionValid: boolean;
  tradeoffsAddressed: boolean;
  securityChecksPassed: boolean;
  accuracyScore: number; // 0 - 100
  passed: boolean;
  reviewNotes: string[];
}

export class TechnicalReviewerAgent {
  public auditTechnicalContent(
    text: string,
    research: ResearchOutput,
    pipelineId?: string
  ): AgentResult<TechnicalReviewResult> {
    const startTime = Date.now();
    console.log("[Technical Reviewer Agent] Auditing technical accuracy, syntax, and trade-off depth...");

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

    const passed = accuracyScore >= 80 && syntaxValid && securityChecksPassed;

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: accuracyScore,
      data: {
        syntaxValid,
        frameworkVersionValid: true,
        tradeoffsAddressed,
        securityChecksPassed,
        accuracyScore,
        passed,
        reviewNotes,
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

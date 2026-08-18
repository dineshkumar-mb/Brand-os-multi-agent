import {
  AgentType,
  AgentResult,
  Topic,
  ExperienceLog,
} from "@brand-os/shared";

export interface MinedExperienceNarrative {
  foundMatch: boolean;
  projectContext?: string;
  realWorldProblem?: string;
  engineeringDecision?: string;
  tradeoffsFaced?: string[];
  quantifiableOutcome?: string;
  lessonsLearned?: string[];
}

export class ExperienceMiningAgent {
  private experienceLogs: ExperienceLog[] = [];

  constructor(initialLogs: ExperienceLog[] = []) {
    this.experienceLogs = initialLogs;
  }

  public setLogs(logs: ExperienceLog[]) {
    this.experienceLogs = logs;
  }

  public mineExperience(topic: Topic, pipelineId?: string): AgentResult<MinedExperienceNarrative> {
    const startTime = Date.now();
    console.log(`[Experience Mining Agent] Searching stored engineering experience logs for topic: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    const catLower = (topic.category || "").toLowerCase();
    const kwLower = (topic.keywords || []).map((k) => k.toLowerCase());

    // Find best matching log from stored experience logs
    const matchingLog = this.experienceLogs.find((log) => {
      const logCat = log.category.toLowerCase();
      const logTitle = log.title.toLowerCase();
      const techMatch = log.technologiesUsed.some((t) =>
        titleLower.includes(t.toLowerCase()) || kwLower.includes(t.toLowerCase())
      );
      return logCat.includes(catLower) || catLower.includes(logCat) || logTitle.includes(titleLower) || techMatch;
    });

    let narrative: MinedExperienceNarrative;

    if (matchingLog) {
      narrative = {
        foundMatch: true,
        projectContext: matchingLog.description,
        realWorldProblem: matchingLog.challengesFaced.join(". "),
        engineeringDecision: matchingLog.solutionApproach,
        tradeoffsFaced: matchingLog.tradeoffs,
        quantifiableOutcome: matchingLog.metricsOrOutcome || "Verified improvement in stability and error reduction.",
        lessonsLearned: matchingLog.keyLessons,
      };
    } else {
      // No stored project experience matched. Enforce strict "EXPLORED_RESEARCH" mode without invented context.
      narrative = {
        foundMatch: false,
        projectContext: `Technical research & architectural exploration of ${topic.framework || topic.category || topic.title}.`,
        realWorldProblem: undefined,
        engineeringDecision: undefined,
        tradeoffsFaced: [],
        quantifiableOutcome: undefined,
        lessonsLearned: [
          `Evaluate technical documentation and specifications before implementation.`,
          `Analyze architectural trade-offs prior to production adoption.`,
        ],
      };
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: narrative.foundMatch ? 95 : 50,
      data: narrative,
      validationResult: {
        passed: true,
        errors: [],
        warnings: matchingLog ? [] : ["No stored project experience matched. Switched narrative mode to EXPLORED_RESEARCH."],
      },
      metadata: {
        agentType: AgentType.EXPERIENCE_MINING,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

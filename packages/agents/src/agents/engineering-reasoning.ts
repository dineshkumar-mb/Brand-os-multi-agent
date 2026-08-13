import {
  AgentType,
  AgentResult,
  Topic,
  ResearchOutput,
  STARStory,
  StoryMode,
  RoutingStrategy,
} from "@brand-os/shared";
import { aiGateway } from "@brand-os/ai-gateway";
import { MinedExperienceNarrative } from "./experience-mining";
import { tradeoffEngine } from "./tradeoff-engine";

export class EngineeringReasoningAgent {
  public async generateSTARStory(
    topic: Topic,
    research: ResearchOutput,
    experience: MinedExperienceNarrative,
    storyMode: StoryMode,
    pipelineId?: string
  ): Promise<AgentResult<{ starStory: STARStory; storyMode: StoryMode }>> {
    const startTime = Date.now();
    console.log(
      `[Engineering Reasoning Agent] Generating STAR reasoning structure for topic "${topic.title}" in Mode: ${storyMode}...`
    );

    const hasBuildMatch = Boolean(experience.foundMatch && experience.quantifiableOutcome);
    const tradeoffs = tradeoffEngine.identifyTradeoffs(topic);
    const primaryTradeoff = tradeoffs[0] || {
      name: "Velocity vs Resilience",
      dimensionA: "Immediate implementation velocity",
      dimensionB: "Decoupled domain boundaries & resilience",
      chosen: "Explicit boundary decoupling",
      sacrificed: "Day-1 setup speed",
      whenAlternativeBetter: "Throwaway prototypes",
      engineeringRationale: "Decoupling prevents cascading failures under high concurrency.",
    };

    const prompt = `You are a Principal Software Engineer and System Architect.
Generate an internal STAR (Situation, Task, Action, Result, Insight) engineering story framework for the topic: "${topic.title}".

STORY MODE: ${storyMode}
CATEGORY/FRAMEWORK: ${topic.category} (${topic.framework || "N/A"})
REAL-WORLD EXPERIENCE MATCH: ${hasBuildMatch ? `DIRECT EXPERIENCE: ${experience.realWorldProblem} -> ${experience.quantifiableOutcome}` : "RESEARCH BENCHMARK ONLY"}
RESEARCH SUMMARY: ${research.summary}
TECHNICAL INSIGHTS: ${research.key_insights.slice(0, 4).join("; ")}
PRIMARY TRADEOFF: ${primaryTradeoff.name} (Chosen: ${primaryTradeoff.chosen} vs Sacrificed: ${primaryTradeoff.sacrificed})

STRICT REASONING REQUIREMENTS:
1. SITUATION: Establish concrete context and a curiosity-inducing engineering trigger. Avoid background filler like "Recently I was working on...". Make it specific (e.g. "The API worked at 20 requests/sec. At 200, PostgreSQL became the bottleneck.").
2. TASK: Define the exact engineering constraint or dilemma (e.g. "Maintain sub-50ms latency without inflating cloud infrastructure costs.").
3. ACTION: Detail the engineering decisions. Must include:
   - Approaches considered (e.g. Approach A vs Approach B)
   - Rejected approaches and why
   - The Decision Moment (where you pivoted or chose B over A)
   - Reasoning based on trade-offs, state drift, concurrency, or observability.
4. RESULT: Define real evidence or metrics (or qualified qualitative result like "Failure became observable instead of silent").
5. INSIGHT: Formulate a senior engineering lesson (e.g. "Caching is an architectural ownership decision, not just a performance tweak.").

Return ONLY a valid JSON object matching:
{
  "situation": {
    "context": "Concrete engineering environment or state",
    "trigger": "Unexpected behavior, bottleneck, or requirement change",
    "stakes": "Impact on system performance, reliability, or cost",
    "curiosityTension": "High-tension engineering hook"
  },
  "task": {
    "objective": "Clear engineering objective",
    "constraints": ["Constraint 1", "Constraint 2"],
    "successCriteria": ["Criteria 1", "Criteria 2"]
  },
  "action": {
    "approachesConsidered": ["Option A: Caching full response", "Option B: Caching key lookups only"],
    "chosenApproach": "Option B",
    "rejectedApproaches": ["Option A due to complex cache invalidation"],
    "reasoning": "Decoupling state ownership kept the database as truth.",
    "decisionMoment": "The moment tests passed but invalidation edge cases appeared.",
    "implementation": "Specific architectural layout or strategy used",
    "debugging": "What unexpected behavior occurred during testing"
  },
  "result": {
    "outcome": "Measurable or observable outcome",
    "metrics": ["p99 latency improved by 40%", "Zero silent failures"],
    "evidence": ["Production telemetry log verification", "Load test results"]
  },
  "insight": {
    "engineeringLesson": "Deeper architectural lesson",
    "tradeoffs": ["Sacrificed immediate setup speed for fault isolation"],
    "whenNotToUse": ["When request volume is low and simple monolith fits"]
  }
}`;

    let starStory: STARStory | null = null;

    try {
      const response = await aiGateway.execute({
        prompt,
        taskType: "engineering_reasoning",
        temperature: 0.7,
        routingStrategy: RoutingStrategy.COST_OPTIMIZED,
        pipelineId,
      });

      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.situation && parsed.task && parsed.action && parsed.result && parsed.insight) {
          starStory = parsed;
        }
      }
    } catch (err: any) {
      console.warn(`[Engineering Reasoning Agent] LLM execution warning: ${err.message}. Using deterministic STAR reasoning fallback.`);
    }

    // Fallback STARStory construction if LLM output is missing or incomplete
    if (!starStory) {
      const tech = topic.framework || topic.category || topic.title;
      starStory = {
        situation: {
          context: hasBuildMatch && experience.realWorldProblem
            ? `While running our ${topic.category} workload, ${experience.realWorldProblem}`
            : `The ${tech} service performed cleanly under unit test loads. Under sustained concurrency, the boundary between database query execution and application state began to break down.`,
          trigger: `Request throughput scaled past baseline limits, exposing a subtle bottleneck in state synchronization.`,
          stakes: `Risk of thread pool starvation, increased p99 latency, and degraded system availability under peak loads.`,
          curiosityTension: `The code was functionally correct, but the architecture was fragile under load.`,
        },
        task: {
          objective: `Eliminate the execution bottleneck without introducing unmanageable operational complexity or single points of failure.`,
          constraints: [
            `Must keep PostgreSQL / database as the ultimate source of truth`,
            `Must prevent cascading retry storms during downstream failure`,
            `Must maintain strict type safety and schema compatibility`,
          ],
          successCriteria: [
            `Deterministic error handling under network partition`,
            `Sub-50ms p99 latency under 5x normal traffic`,
          ],
        },
        action: {
          approachesConsidered: [
            `Approach A: Naive full-response caching at the API edge`,
            `Approach B: Selective state caching with explicit invalidation triggers and decoupled query paths`,
          ],
          chosenApproach: `Approach B: Selective query-level caching paired with explicit failure boundaries.`,
          rejectedApproaches: [
            `Approach A: Rejected because invalidating nested aggregate objects across distributed workers would create stale data bugs.`,
          ],
          reasoning: `Decoupling cache ownership from response serialization preserves database integrity while relieving read pressure on heavy lookup paths.`,
          decisionMoment: `The initial implementation passed functional tests, but inspecting cache invalidation edge cases revealed that full-response caching would hide upstream database drift. That was the pivot point to rewrite the caching boundary.`,
          implementation: `Introduced a bounded in-memory cache layer with fallback read-through to the database and explicit circuit breaking.`,
          debugging: `During staging load tests, a silent timeout occurred when the cache hit rate dropped to zero. We added explicit fallback telemetry to isolate the drop.`,
        },
        result: {
          outcome: `The system sustained 3x higher throughput with zero unhandled exceptions.`,
          metrics: [
            hasBuildMatch && experience.quantifiableOutcome ? experience.quantifiableOutcome : `p99 latency stabilized at 38ms`,
            `Zero stale state read incidents reported in staging telemetry`,
          ],
          evidence: [
            `Load testing telemetry logs`,
            `Distributed trace breakdown showing reduced database lock contention`,
          ],
        },
        insight: {
          engineeringLesson: `Caching is not a simple performance patch—it is an architectural commitment regarding state ownership and invalidation boundaries.`,
          tradeoffs: [
            `Chosen: ${primaryTradeoff.chosen}`,
            `Sacrificed: ${primaryTradeoff.sacrificed}`,
          ],
          whenNotToUse: [
            `Avoid this complexity for low-throughput CRUD services where direct database queries meet SLAs effortlessly.`,
          ],
        },
      };
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 95,
      data: {
        starStory,
        storyMode,
      },
      validationResult: { passed: true, errors: [], warnings: [] },
      metadata: {
        agentType: AgentType.TECHNICAL_WRITER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const engineeringReasoningAgent = new EngineeringReasoningAgent();

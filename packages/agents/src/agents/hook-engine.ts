import { HookType, Topic, DiscussionCtaType, StoryMode } from "@brand-os/shared";

export class HookEngine {
  /**
   * Shortens long multi-clause topic titles into a concise engineering subject
   * so hooks and CTAs stay readable under LinkedIn's 210-char mobile fold.
   */
  private shortenTitle(title: string, fallback: string): string {
    const stripped = title
      .replace(/^Day \d+:\s*/i, "")
      .replace(/:(.*)$/, "")
      .trim();
    if (stripped.length <= 42) {
      return stripped;
    }
    const parenMatch = stripped.match(/\(([^)]{2,18})\)/);
    if (
      parenMatch &&
      fallback &&
      !stripped.toLowerCase().startsWith(fallback.toLowerCase()) &&
      parenMatch[1].toLowerCase() !== fallback.toLowerCase()
    ) {
      return `${fallback} (${parenMatch[1]})`;
    }
    if (fallback && fallback.length >= 2 && fallback.length <= 28) {
      return fallback;
    }
    return stripped.split(/\s+/).slice(0, 5).join(" ");
  }

  private formatStoryAngleHook(storyAngle: string, quantifiableOutcome?: string): string {
    const cleanAngle = storyAngle.replace(/—/g, ". ").replace(/\s+/g, " ").trim();
    const parts = cleanAngle.split(/[.;]\s+/).filter(Boolean);
    const line1 = parts[0] ? (parts[0].endsWith(".") ? parts[0] : `${parts[0]}.`) : cleanAngle;
    const second = parts.slice(1).join(". ").trim() || (quantifiableOutcome ? `Outcome: ${quantifiableOutcome}` : "");
    return second ? `${line1}\n\n${second}` : line1;
  }

  /**
   * Generates a hook string matching the given HookType and StoryMode
   */
  public generateHook(
    hookType: HookType,
    topic: Topic,
    hasBuildMatch: boolean,
    realWorldProblem?: string,
    storyMode?: StoryMode,
    quantifiableOutcome?: string
  ): string {
    const techName = topic.framework || topic.category || topic.title;
    const cleanTitle = this.shortenTitle(topic.title, techName);
    const storyAngle = (topic as any).storyAngle as string | undefined;

    // When a real portfolio/build storyAngle exists, lead with the concrete build tension
    // instead of generic boilerplate hooks, while keeping each StoryMode distinct.
    if (hasBuildMatch && storyAngle && storyMode) {
      if (
        storyMode === StoryMode.DECISION_STORY ||
        storyMode === StoryMode.BUILD_IN_PUBLIC ||
        storyMode === StoryMode.BEFORE_AFTER ||
        storyMode === StoryMode.ARCHITECTURE_STORY
      ) {
        return this.formatStoryAngleHook(storyAngle, quantifiableOutcome);
      }
      if (storyMode === StoryMode.PERFORMANCE_STORY && quantifiableOutcome) {
        return `What slowed ${cleanTitle} down wasn't syntax.\n\nFixing the execution boundary delivered: ${quantifiableOutcome}`;
      }
      if (storyMode === StoryMode.FAILURE_STORY && realWorldProblem) {
        const prob = realWorldProblem.split(".")[0].trim();
        return `${prob}.\n\nHere is what we changed to keep requests predictable.`;
      }
    }

    // Mode-specific fallback angles when no specific build storyAngle is present
    if (storyMode === StoryMode.FAILURE_STORY) {
      return `The ${cleanTitle} implementation passed unit tests.\n\nProduction concurrency broke it anyway.`;
    }
    if (storyMode === StoryMode.PERFORMANCE_STORY) {
      return `I assumed the database query in ${techName} was the bottleneck.\n\nRequest profiling proved otherwise.`;
    }
    if (storyMode === StoryMode.CONTRARIAN_OBSERVATION) {
      return `Adding extra caching to ${cleanTitle} actually hid the real bug longer.`;
    }
    if (storyMode === StoryMode.TECH_DISCOVERY) {
      return `The real payoff in ${techName} isn't the API syntax.\n\nIt's isolating failures before they cascade.`;
    }
    if (storyMode === StoryMode.DECISION_STORY) {
      return `Keeping ${cleanTitle} inside a single synchronous route looked simpler.\n\nBreaking the boundary saved debugging hours later.`;
    }

    switch (hookType) {
      case HookType.ENGINEERING_OBSERVATION:
        return `I expected ${techName} to be a straightforward integration.\n\nThe actual engineering challenge turned out to be how state transitions are handled across bounded contexts.`;

      case HookType.UNEXPECTED_FAILURE:
        return `Our ${cleanTitle} integration test suite was completely green.\n\nThe workflow still failed under real load.`;

      case HookType.ARCHITECTURE_QUESTION:
        return `When should an engineering architecture for ${cleanTitle} give up on synchronous execution?`;

      case HookType.CONTRARIAN_OBSERVATION:
        return `Most discussions about ${cleanTitle} focus on initial setup speed.\n\nVery few talk about what happens when downstream services fail silently.`;

      case HookType.BUILD_EXPERIENCE:
        if (hasBuildMatch && realWorldProblem) {
          return `While refactoring our ${topic.category} infrastructure, I ran into a state consistency problem I didn't expect.`;
        }
        return `While testing ${cleanTitle} in a staging environment, I ran into a concurrency issue that changed our implementation approach.`;

      case HookType.NEW_TECHNOLOGY:
        return `${cleanTitle} introduced new architecture patterns.\n\nThe headline features are nice, but the underlying operational boundary is what actually matters.`;

      case HookType.DEBUGGING_STORY:
        return `The telemetry logs pointed to network latency.\n\nThe system was actually failing due to thread pool exhaustion under heavy backpressure.`;

      case HookType.TRADEOFF:
        return `There were two technically sound ways to structure ${techName}.\n\nNeither option was free.`;

      case HookType.PERFORMANCE:
        return `The initial feature implementation worked correctly.\n\nIt just didn't work fast enough to meet our p99 latency SLA under peak throughput.`;

      case HookType.ARCHITECTURE_BOUNDARY:
        return `This looked like a minor feature addition in ${techName}.\n\nUnder closer analysis, it required re-evaluating three separate service boundaries.`;

      case HookType.METRIC_BREAKDOWN:
        return `We benchmarked 10M requests through ${cleanTitle}.\n\nThe telemetry results surprised our entire engineering team.`;

      case HookType.HARD_TRUTH:
        return `The hardest part of ${techName} isn't writing clean code.\n\nIt's defending the production trade-offs in front of tech leadership.`;

      case HookType.CURIOSITY_GAP:
        return `Most engineers adopt ${techName} for developer velocity.\n\nThe actual high-value advantage is architectural state isolation.`;

      case HookType.ARCHITECTURAL_PARADOX:
        return `Refactoring our ${cleanTitle} pipeline to synchronous execution counter-intuitively made it 4x faster.`;

      case HookType.BEFORE_AFTER_TRANSFORMATION:
        return `6 months ago, our ${techName} service suffered p99 latency spikes of 1200ms.\n\nHere is what changed after we refactored the execution path.`;

      case HookType.TELEMETRY_TRAP:
        return `Our monitoring dashboards reported CPU usage at 18%.\n\nOur ${techName} background workers were actually starving due to thread pool deadlocks.`;

      default:
        return `I expected one thing from ${techName}. Production telemetry revealed something completely different.`;
    }
  }

  /**
   * Generates a peer-level technical discussion CTA matching the given DiscussionCtaType
   */
  public generateDiscussionCta(
    ctaType: DiscussionCtaType,
    topic: Topic,
    allowNoCta: boolean = false
  ): string {
    if (allowNoCta && Math.random() < 0.25) {
      return ""; // No CTA option for authentic variety
    }

    const tech = topic.framework || topic.category || "this architecture";
    const cleanTitle = this.shortenTitle(topic.title, tech);
    const titleHasTech = cleanTitle.toLowerCase().includes(tech.toLowerCase()) || cleanTitle.toLowerCase() === tech.toLowerCase();
    const secondaryTech = titleHasTech ? "downstream service" : tech;

    switch (ctaType) {
      case DiscussionCtaType.TRADEOFF_CHOICE:
        return titleHasTech
          ? `How does your team handle the ${cleanTitle} trade-off under production load?`
          : `How does your team handle the ${cleanTitle} trade-off when scaling ${tech} under load?`;

      case DiscussionCtaType.BOUNDARY_QUESTION:
        return `Where would your team draw the boundary between async queuing and the ${secondaryTech} source of truth in ${cleanTitle}?`;

      case DiscussionCtaType.PRODUCTION_FAILURE_CHECK:
        return titleHasTech
          ? `How do you handle this ${cleanTitle} failure mode when downstream services stall?`
          : `How do you handle this ${cleanTitle} failure mode in your ${tech} systems when downstream services stall?`;

      case DiscussionCtaType.OPTIMIZATION_PRIORITY:
        return titleHasTech
          ? `At what point in ${cleanTitle} would you move work into a background queue instead of retrying inline?`
          : `At what point in ${cleanTitle} would you introduce a queue instead of synchronous retry loops for ${tech}?`;

      case DiscussionCtaType.DESIGN_CHANGE:
        return titleHasTech
          ? `Would you optimize ${cleanTitle} for lower p95 latency or lower compute cost if request volume doubled?`
          : `Would you optimize ${cleanTitle} for latency or cost here if ${tech} request volume doubled?`;

      case DiscussionCtaType.TEAM_PRACTICE:
        return titleHasTech
          ? `What telemetry would you instrument first before shipping this ${cleanTitle} change to production?`
          : `What telemetry would you instrument before shipping this ${cleanTitle} change for ${tech} to production?`;

      default:
        return titleHasTech
          ? `Would you keep the simpler ${cleanTitle} architecture or isolate it behind explicit service boundaries?`
          : `Would you choose the simpler ${cleanTitle} architecture or the more resilient ${tech} pattern here?`;
    }
  }

  /**
   * Selects the best viral hook formula for a given topic
   */
  public selectBestHook(topic: Topic): { selectedHook: string; hookType: HookType } {
    const formulas = Object.values(HookType);
    const selectedFormula = formulas[Math.floor(Math.random() * formulas.length)] || HookType.ARCHITECTURAL_PARADOX;
    const selectedHook = this.generateHook(selectedFormula, topic, false);
    return { selectedHook, hookType: selectedFormula };
  }
}

export const hookEngine = new HookEngine();

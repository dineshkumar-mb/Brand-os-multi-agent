import { HookType, Topic, DiscussionCtaType, StoryMode } from "@brand-os/shared";

export class HookEngine {
  /**
   * Generates a hook string matching the given HookType and StoryMode
   */
  public generateHook(
    hookType: HookType,
    topic: Topic,
    hasBuildMatch: boolean,
    realWorldProblem?: string,
    storyMode?: StoryMode
  ): string {
    const techName = topic.framework || topic.category || topic.title;
    const cleanTitle = topic.title.replace(/:(.*)$/, "").trim();

    // Mode-specific override options if storyMode is provided
    if (storyMode === StoryMode.FAILURE_STORY) {
      return `The ${cleanTitle} implementation was technically correct.\n\nThe system was still wrong under load.`;
    }
    if (storyMode === StoryMode.PERFORMANCE_STORY) {
      return `I thought our ${techName} query path was slow.\n\nIt wasn't.`;
    }
    if (storyMode === StoryMode.CONTRARIAN_OBSERVATION) {
      return `Adding a cache layer to ${cleanTitle} made the system less reliable.`;
    }
    if (storyMode === StoryMode.TECH_DISCOVERY) {
      return `The most useful part of ${techName} wasn't the headline feature.\n\nIt was the failure handling design.`;
    }
    if (storyMode === StoryMode.DECISION_STORY) {
      return `I could make this ${cleanTitle} architecture simpler.\n\nI deliberately didn't.`;
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
    const cleanTitle = topic.title.replace(/:(.*)$/, "").trim();

    switch (ctaType) {
      case DiscussionCtaType.TRADEOFF_CHOICE:
        return `How does your team handle the ${cleanTitle} trade-off when scaling ${tech} under load?`;

      case DiscussionCtaType.BOUNDARY_QUESTION:
        return `Where would your team draw the boundary between stateful caching and the ${tech} database source of truth in ${cleanTitle}?`;

      case DiscussionCtaType.PRODUCTION_FAILURE_CHECK:
        return `How do you handle this ${cleanTitle} failure mode in your ${tech} systems when downstream services stall?`;

      case DiscussionCtaType.OPTIMIZATION_PRIORITY:
        return `At what point in ${cleanTitle} would you introduce a queue instead of synchronous retry loops for ${tech}?`;

      case DiscussionCtaType.DESIGN_CHANGE:
        return `Would you optimize ${cleanTitle} for latency or cost here if ${tech} request volume doubled?`;

      case DiscussionCtaType.TEAM_PRACTICE:
        return `What telemetry would you instrument before shipping this ${cleanTitle} change for ${tech} to production?`;

      default:
        return `Would you choose the simpler ${cleanTitle} architecture or the more resilient ${tech} pattern here?`;
    }
  }
}

export const hookEngine = new HookEngine();

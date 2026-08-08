import { globalSourceRegistry } from "../sources/registry.js";
import { officialLabsCollector } from "../sources/official/labs.js";
import { modelHubsCollector } from "../sources/model-hubs/hubs.js";
import { gitHubCollector } from "../sources/open-source/github.js";
import { communityDiscussionsCollector } from "../sources/communities/discussions.js";
import { researchCollector } from "../sources/research/arxiv.js";
import { frameworkEcosystemCollector } from "../sources/developer-platforms/frameworks.js";
import { RawIntelligenceSignal } from "../sources/types.js";

export class MultiSourceCollectorEngine {
  public async collectAllSignals(): Promise<RawIntelligenceSignal[]> {
    console.log("[Intelligence Layer] Initiating Multi-Source Global Intelligence Collection...");
    const allSignals: RawIntelligenceSignal[] = [];

    // Official Labs Collection (Level 1)
    try {
      const officialSignals = await officialLabsCollector.collectOfficialSignals();
      allSignals.push(...officialSignals);
      globalSourceRegistry.updateHealth("openai_official", "GREEN");
      globalSourceRegistry.updateHealth("anthropic_official", "GREEN");
    } catch (err: any) {
      console.warn("[CollectorEngine] Official labs warning:", err.message);
      globalSourceRegistry.updateHealth("openai_official", "YELLOW", true);
    }

    // Model Hubs Collection (Level 1)
    try {
      const hubSignals = await modelHubsCollector.collectHubSignals();
      allSignals.push(...hubSignals);
      globalSourceRegistry.updateHealth("huggingface_trending", "GREEN");
      globalSourceRegistry.updateHealth("ollama_library", "GREEN");
    } catch (err: any) {
      console.warn("[CollectorEngine] Model hubs warning:", err.message);
      globalSourceRegistry.updateHealth("huggingface_trending", "YELLOW", true);
    }

    // GitHub Collector (Level 1)
    try {
      const ghResult = await gitHubCollector.collectGitHubSignals();
      allSignals.push(...ghResult.signals);
      globalSourceRegistry.updateHealth("github_trending_daily", "GREEN");
    } catch (err: any) {
      console.warn("[CollectorEngine] GitHub collector warning:", err.message);
      globalSourceRegistry.updateHealth("github_trending_daily", "YELLOW", true);
    }

    // Community Discussions (Level 3)
    try {
      const communitySignals = await communityDiscussionsCollector.collectCommunitySignals();
      allSignals.push(...communitySignals);
      globalSourceRegistry.updateHealth("hackernews_top", "GREEN");
      globalSourceRegistry.updateHealth("reddit_tech_subs", "GREEN");
      globalSourceRegistry.updateHealth("devto_rising", "GREEN");
    } catch (err: any) {
      console.warn("[CollectorEngine] Community discussions warning:", err.message);
      globalSourceRegistry.updateHealth("hackernews_top", "YELLOW", true);
    }

    // Research Publications (Level 2)
    try {
      const researchSignals = await researchCollector.collectResearchSignals();
      allSignals.push(...researchSignals);
      globalSourceRegistry.updateHealth("arxiv_ai_papers", "GREEN");
    } catch (err: any) {
      console.warn("[CollectorEngine] Research collector warning:", err.message);
      globalSourceRegistry.updateHealth("arxiv_ai_papers", "YELLOW", true);
    }

    // Framework Ecosystem (Level 1)
    try {
      const frameworkSignals = await frameworkEcosystemCollector.collectFrameworkSignals();
      allSignals.push(...frameworkSignals);
      globalSourceRegistry.updateHealth("framework_monitors", "GREEN");
    } catch (err: any) {
      console.warn("[CollectorEngine] Framework collector warning:", err.message);
      globalSourceRegistry.updateHealth("framework_monitors", "YELLOW", true);
    }

    console.log(`[Intelligence Layer] Successfully collected ${allSignals.length} raw intelligence signals across global sources.`);
    return allSignals;
  }
}

export const multiSourceCollectorEngine = new MultiSourceCollectorEngine();

import { ScanTriggerMode, ContentOpportunity, SourceHealthSummary } from "@brand-os/shared";
import { globalSourceRegistry } from "./sources/registry.js";
import { llmProviderRegistry } from "./sources/llm-provider-registry.js";
import { modelComparisonEngine } from "./sources/model-comparison.js";
import { multiSourceCollectorEngine } from "./collectors/engine.js";
import { signalNormalizer } from "./normalizers/signal-normalizer.js";
import { canonicalEventEngine } from "./deduplication/canonical-event.js";
import { claimVerifierEngine } from "./verification/claim-verifier.js";
import { contentOpportunityGenerator } from "./ranking/content-opportunity.js";
import { doNotPublishGate } from "./ranking/do-not-publish.js";

export * from "./sources/types.js";
export * from "./sources/registry.js";
export * from "./sources/llm-provider-registry.js";
export * from "./sources/model-comparison.js";
export * from "./collectors/engine.js";
export * from "./normalizers/signal-normalizer.js";
export * from "./deduplication/canonical-event.js";
export * from "./verification/claim-verifier.js";
export * from "./signals/why-care-analyzer.js";
export * from "./knowledge/experience-matcher.js";
export * from "./ranking/topic-scorer.js";
export * from "./ranking/content-opportunity.js";
export * from "./ranking/do-not-publish.js";
export * from "./ranking/fresh-trend-discovery.js";
export * from "./ranking/candidate-competition-engine.js";
export * from "./provenance/evidence-tracker.js";
export * from "./provenance/career-attribution.js";

export interface GlobalIntelligenceScanResult {
  triggerMode: ScanTriggerMode;
  timestamp: string;
  totalSignalsCollected: number;
  canonicalEventsCount: number;
  opportunitiesGenerated: ContentOpportunity[];
  approvedOpportunities: ContentOpportunity[];
  rejectedOpportunities: ContentOpportunity[];
  sourceHealth: SourceHealthSummary;
}

export class GlobalIntelligenceEngine {
  public async executeScan(mode: ScanTriggerMode = "ON_DEMAND"): Promise<GlobalIntelligenceScanResult> {
    console.log(`[Global Intelligence Engine] Starting Scan under trigger mode: ${mode}`);

    // Step 1: Collect Raw Signals across all sources
    const rawSignals = await multiSourceCollectorEngine.collectAllSignals();

    // Step 2: Normalize signals
    const normalizedSignals = signalNormalizer.normalizeBatch(rawSignals);

    // Step 3: Group into Canonical Events
    const canonicalEvents = canonicalEventEngine.createCanonicalEvents(normalizedSignals);

    // Step 4: Verify claims & Generate Content Opportunities
    const opportunities: ContentOpportunity[] = [];
    for (const evt of canonicalEvents) {
      // Verify claims against Level 1/2 sources
      const verification = claimVerifierEngine.verifyCanonicalEvent(evt);
      if (verification.isVerified) {
        const opp = contentOpportunityGenerator.generateFromEvent(evt);
        opportunities.push(opp);
      }
    }

    const approved = opportunities.filter((o) => o.status === "APPROVED");
    const rejected = opportunities.filter((o) => o.status === "REJECTED");
    const sourceHealth = globalSourceRegistry.getHealthSummary();

    console.log(
      `[Global Intelligence Engine] Scan Completed. ${opportunities.length} opportunities created (${approved.length} APPROVED, ${rejected.length} REJECTED/STOPPED).`
    );

    return {
      triggerMode: mode,
      timestamp: new Date().toISOString(),
      totalSignalsCollected: rawSignals.length,
      canonicalEventsCount: canonicalEvents.length,
      opportunitiesGenerated: opportunities,
      approvedOpportunities: approved,
      rejectedOpportunities: rejected,
      sourceHealth,
    };
  }
}

export const globalIntelligenceEngine = new GlobalIntelligenceEngine();

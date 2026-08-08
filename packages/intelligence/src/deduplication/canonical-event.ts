import { SourceAuthorityLevel } from "@brand-os/shared";
import { RawIntelligenceSignal, CanonicalEvent } from "../sources/types.js";

export class CanonicalEventEngine {
  public createCanonicalEvents(signals: RawIntelligenceSignal[]): CanonicalEvent[] {
    const groups: Map<string, RawIntelligenceSignal[]> = new Map();

    // Group by similarity key
    signals.forEach((sig) => {
      let key = "generic";
      const titleLower = sig.title.toLowerCase();
      if (
        titleLower.includes("mcp") ||
        titleLower.includes("model context protocol") ||
        titleLower.includes("modelcontextprotocol")
      ) {
        key = "mcp_protocol";
      } else if (titleLower.includes("deepseek") || titleLower.includes("r1")) {
        key = "deepseek_r1";
      } else if (titleLower.includes("o3-mini") || titleLower.includes("openai")) {
        key = "openai_o3";
      } else if (titleLower.includes("claude") || titleLower.includes("anthropic")) {
        key = "anthropic_claude";
      } else if (titleLower.includes("react 19") || titleLower.includes("server actions")) {
        key = "react19_server_actions";
      } else if (titleLower.includes("redis") || titleLower.includes("bullmq")) {
        key = "redis_bullmq_microservices";
      } else {
        key = sig.title.slice(0, 25).toLowerCase().replace(/\W+/g, "_");
      }

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(sig);
    });

    const canonicalEvents: CanonicalEvent[] = [];

    groups.forEach((groupSignals, groupKey) => {
      const primarySig =
        groupSignals.find((s) => s.authorityLevel === SourceAuthorityLevel.LEVEL_1_PRIMARY) ||
        groupSignals[0];

      const sourcesList = groupSignals.map((s) => ({
        sourceId: s.sourceId,
        sourceName: s.sourceName,
        authorityLevel: s.authorityLevel,
        url: s.url,
      }));

      const allTags = Array.from(new Set(groupSignals.flatMap((s) => s.tags || [])));
      const hasLevel1 = groupSignals.some((s) => s.authorityLevel === SourceAuthorityLevel.LEVEL_1_PRIMARY);
      const confidenceScore = hasLevel1 ? 95 : 75;
      const trendVelocity = Math.min(10, parseFloat((groupSignals.length * 2.5 + 3.0).toFixed(1)));

      canonicalEvents.push({
        eventId: `evt_${groupKey}_${Date.now()}`,
        title: primarySig.title,
        summary: primarySig.content,
        primarySourceUrl: primarySig.url,
        sources: sourcesList,
        claims: [
          {
            claimText: primarySig.content,
            verified: hasLevel1,
            verificationSource: primarySig.sourceName,
          },
        ],
        confidenceScore,
        trendVelocity,
        firstSeenAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        tags: allTags,
      });
    });

    return canonicalEvents;
  }
}

export const canonicalEventEngine = new CanonicalEventEngine();

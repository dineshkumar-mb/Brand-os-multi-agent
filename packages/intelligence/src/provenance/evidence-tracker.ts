import { EvidenceProvenance, SourceAuthorityLevel } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export class EvidenceTrackerEngine {
  public createEvidenceProvenance(event: CanonicalEvent): EvidenceProvenance[] {
    return event.sources.map((src) => ({
      sourceId: src.sourceId,
      sourceName: src.sourceName,
      sourceType: src.authorityLevel === SourceAuthorityLevel.LEVEL_1_PRIMARY ? "OFFICIAL_DOCS" : "COMMUNITY_DISCUSSION",
      url: src.url,
      retrievedAt: new Date().toISOString(),
      authorityLevel: src.authorityLevel,
      claimVerified: src.authorityLevel <= 2,
      citationText: `Verified via ${src.sourceName} (${src.url || "Official Endpoint"})`,
    }));
  }
}

export const evidenceTrackerEngine = new EvidenceTrackerEngine();

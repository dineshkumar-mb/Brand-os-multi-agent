import { SourceAuthorityLevel } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export interface ClaimVerificationReport {
  eventId: string;
  isVerified: boolean;
  confidenceScore: number;
  level1Or2SourcesFound: string[];
  rejectionReasons: string[];
}

export class ClaimVerifierEngine {
  public verifyCanonicalEvent(event: CanonicalEvent): ClaimVerificationReport {
    const level1Or2 = event.sources.filter(
      (s) =>
        s.authorityLevel === SourceAuthorityLevel.LEVEL_1_PRIMARY ||
        s.authorityLevel === SourceAuthorityLevel.LEVEL_2_TECHNICAL
    );

    const isVerified = level1Or2.length > 0;
    const confidenceScore = isVerified ? Math.min(100, 80 + level1Or2.length * 10) : 40;

    const rejectionReasons: string[] = [];
    if (!isVerified) {
      rejectionReasons.push(
        "Claim discovered in Level 3/4 community source, but lacks verification from Level 1 primary or Level 2 technical documentation."
      );
    }

    return {
      eventId: event.eventId,
      isVerified,
      confidenceScore,
      level1Or2SourcesFound: level1Or2.map((s) => s.sourceName),
      rejectionReasons,
    };
  }
}

export const claimVerifierEngine = new ClaimVerifierEngine();

import { ContentOpportunity } from "@brand-os/shared";

export interface RejectionCheckResult {
  shouldReject: boolean;
  rejectionReason?: string;
}

export class DoNotPublishGate {
  public evaluateOpportunity(opportunity: ContentOpportunity): RejectionCheckResult {
    // 1. Personal Experience Gate: Minimum 30% experience match required
    if (opportunity.personalExperienceMatch < 30) {
      return {
        shouldReject: true,
        rejectionReason: "REJECTED (NO_POST_TODAY): No personal build experience matched. System will not produce generic hype content without personal engineering authority.",
      };
    }

    // 2. Career Value Gate: Minimum 60% career relevance required
    if (opportunity.careerRelevanceScore < 60) {
      return {
        shouldReject: true,
        rejectionReason: "REJECTED (NO_POST_TODAY): Low career value and recruiter relevance score.",
      };
    }

    // 3. Source Authority Gate: Minimum 50% source authority score required
    if (opportunity.sourceAuthorityScore < 50) {
      return {
        shouldReject: true,
        rejectionReason: "REJECTED (NO_POST_TODAY): Unverified claim lacking Level 1 primary or Level 2 technical sources.",
      };
    }

    // 4. Overall Quality Score Threshold: Minimum 70 overall score required
    if (opportunity.overallScore < 70) {
      return {
        shouldReject: true,
        rejectionReason: "REJECTED (NO_POST_TODAY): Overall opportunity score below quality threshold (70.0).",
      };
    }

    return {
      shouldReject: false,
    };
  }
}

export const doNotPublishGate = new DoNotPublishGate();

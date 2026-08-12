import { ContentOpportunity } from "@brand-os/shared";

export interface RejectionCheckResult {
  shouldReject: boolean;
  rejectionReason?: string;
}

export class DoNotPublishGate {
  public evaluateOpportunity(opportunity: ContentOpportunity): RejectionCheckResult {
    // 1. Career Value Gate: Minimum 60% career relevance required
    if (opportunity.careerRelevanceScore < 60) {
      return {
        shouldReject: true,
        rejectionReason: "REJECTED (NO_POST_TODAY): Low career value and recruiter relevance score.",
      };
    }

    // 2. Source Authority Gate: Minimum 50% source authority score required
    if (opportunity.sourceAuthorityScore < 50) {
      return {
        shouldReject: true,
        rejectionReason: "REJECTED (NO_POST_TODAY): Unverified claim lacking Level 1 primary or Level 2 technical sources.",
      };
    }

    // 3. Overall Quality Score Threshold: Minimum 65 overall score required
    if (opportunity.overallScore < 65) {
      return {
        shouldReject: true,
        rejectionReason: "REJECTED (NO_POST_TODAY): Overall opportunity score below quality threshold (65.0).",
      };
    }

    return {
      shouldReject: false,
    };
  }
}

export const doNotPublishGate = new DoNotPublishGate();


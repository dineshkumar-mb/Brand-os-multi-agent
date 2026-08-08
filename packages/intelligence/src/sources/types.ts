import {
  SourceAuthorityLevel,
  SourceCategory,
  IntelligenceSource,
  LLMProviderInfo,
} from "@brand-os/shared";

export type {
  SourceAuthorityLevel,
  SourceCategory,
  IntelligenceSource,
  LLMProviderInfo,
};

export interface RawIntelligenceSignal {
  id: string;
  sourceId: string;
  sourceName: string;
  category: SourceCategory;
  authorityLevel: SourceAuthorityLevel;
  title: string;
  content: string;
  url?: string;
  publishedAt: string;
  retrievedAt: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface CanonicalEvent {
  eventId: string;
  title: string;
  summary: string;
  primarySourceUrl?: string;
  sources: Array<{
    sourceId: string;
    sourceName: string;
    authorityLevel: SourceAuthorityLevel;
    url?: string;
  }>;
  claims: Array<{
    claimText: string;
    verified: boolean;
    verificationSource?: string;
  }>;
  confidenceScore: number; // 0 - 100
  trendVelocity: number;   // 0 - 10 scale
  firstSeenAt: string;
  lastUpdatedAt: string;
  tags: string[];
}

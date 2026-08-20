import { SourceAuthorityLevel, EvidenceProvenance } from "@brand-os/shared";

export interface RawCandidateEvent {
  id: string;
  title: string;
  summary: string;
  url: string;
  sourceName: string;
  sourceLevel: SourceAuthorityLevel;
  publishedAt: string;
  discoveredAt: string;
  trendVelocity: number;
  technicalImportance: number;
  developerAdoption: number;
  tags: string[];
}

export class FreshTrendDiscoveryEngine {
  public calculateFreshnessScore(publishedAtStr: string): number {
    const publishedAt = new Date(publishedAtStr).getTime();
    const now = Date.now();
    const hoursAgo = Math.max(0, (now - publishedAt) / 3600000);

    if (hoursAgo < 6) return 100;
    if (hoursAgo <= 24) return 95;
    if (hoursAgo <= 48) return 85;
    if (hoursAgo <= 120) return 70; // 3-5 days
    if (hoursAgo <= 168) return 50; // 6-7 days
    if (hoursAgo <= 336) return 25; // 8-14 days
    return 0; // > 14 days -> strictly rejected
  }

  public evaluateFreshness(
    publishedAtStr: string,
    category: string = "",
    title: string = ""
  ): { freshnessScore: number; rejected: boolean; reason?: string } {
    const freshnessScore = this.calculateFreshnessScore(publishedAtStr);
    if (freshnessScore === 0) {
      return { freshnessScore: 0, rejected: true, reason: "STALE_EVENT: Publication date is older than 14 days." };
    }

    const publishedAt = new Date(publishedAtStr).getTime();
    const now = Date.now();
    const hoursAgo = Math.max(0, (now - publishedAt) / 3600000);
    const text = `${category} ${title}`.toLowerCase();

    // Category Max Age Limits:
    // Official Tech Release <= 48h
    if ((text.includes("release") || text.includes("official") || text.includes("version")) && hoursAgo > 48) {
      return { freshnessScore: 0, rejected: true, reason: "STALE_TECH_RELEASE: Official technology release is older than 48 hours." };
    }

    // GitHub Release <= 72h
    if (text.includes("github") && hoursAgo > 72) {
      return { freshnessScore: 0, rejected: true, reason: "STALE_GITHUB_RELEASE: GitHub release signal is older than 72 hours." };
    }

    // Community Discussion <= 72h
    if ((text.includes("hn:") || text.includes("dev.to") || text.includes("reddit")) && hoursAgo > 72) {
      return { freshnessScore: 0, rejected: true, reason: "STALE_COMMUNITY_DISCUSSION: Discussion signal is older than 72 hours." };
    }

    // Security / Research <= 168h (7 days)
    if ((text.includes("security") || text.includes("vulnerability") || text.includes("paper") || text.includes("arxiv")) && hoursAgo > 168) {
      return { freshnessScore: 0, rejected: true, reason: "STALE_SECURITY_RESEARCH: Research/Security signal is older than 7 days." };
    }

    return { freshnessScore, rejected: false };
  }

  public classifySourceAuthority(sourceName: string, url: string): SourceAuthorityLevel {
    const s = `${sourceName} ${url}`.toLowerCase();
    if (
      s.includes("openai.com") ||
      s.includes("anthropic.com") ||
      s.includes("ai.google") ||
      s.includes("blog.google") ||
      s.includes("ai.meta.com") ||
      s.includes("mistral.ai") ||
      s.includes("github.com/deepseek-ai") ||
      s.includes("official")
    ) {
      return SourceAuthorityLevel.LEVEL_1_PRIMARY;
    }
    if (
      s.includes("arxiv") ||
      s.includes("github.com") ||
      s.includes("huggingface") ||
      s.includes("engineering.") ||
      s.includes("techblog") ||
      s.includes("docker") ||
      s.includes("react") ||
      s.includes("node") ||
      s.includes("ollama")
    ) {
      return SourceAuthorityLevel.LEVEL_2_SECONDARY;
    }
    if (s.includes("news.ycombinator.com") || s.includes("dev.to") || s.includes("reddit.com")) {
      return SourceAuthorityLevel.LEVEL_3_COMMUNITY;
    }
    return SourceAuthorityLevel.LEVEL_2_SECONDARY;
  }

  public createProvenance(evt: RawCandidateEvent): EvidenceProvenance {
    const verified = evt.sourceLevel <= SourceAuthorityLevel.LEVEL_2_SECONDARY;
    return {
      source: evt.sourceName,
      url: evt.url,
      sourceLevel: evt.sourceLevel,
      publicationDate: evt.publishedAt,
      claim: evt.summary.substring(0, 200),
      verificationStatus: verified ? "VERIFIED" : "UNVERIFIED",
    };
  }
}

export const freshTrendDiscoveryEngine = new FreshTrendDiscoveryEngine();

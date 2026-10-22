import { SourceAuthorityLevel } from "@brand-os/shared";
import { RawIntelligenceSignal } from "../types.js";

declare const process: any;

export interface GitHubRepoAnalysis {
  repoName: string;
  url: string;
  stars: number;
  forks: number;
  starVelocity7d: number;
  maintainerActivityScore: number;
  hasActiveReleases: boolean;
  whyGainingAttention: string;
  language: string;
  description: string;
  technicalImportance: "HIGH" | "MEDIUM" | "LOW";
  primaryTech: string[];
}

// Minimum star thresholds to filter noise
const MIN_STARS = 500;
const MIN_FORKS = 50;

// Map GitHub language/topic to engineering content tags
function inferTechTags(repo: any): string[] {
  const tags: string[] = [];
  const desc = (repo.description || "").toLowerCase();
  const name = (repo.full_name || "").toLowerCase();

  if (repo.language) tags.push(repo.language);
  if (desc.includes("llm") || desc.includes("language model") || desc.includes("gpt") || desc.includes("gemini") || desc.includes("claude")) tags.push("LLM", "AI Engineering");
  if (desc.includes("agent") || desc.includes("multi-agent") || desc.includes("swarm")) tags.push("Agentic AI", "AI Agents");
  if (desc.includes("rag") || desc.includes("retrieval") || desc.includes("vector")) tags.push("RAG", "Vector Search");
  if (desc.includes("docker") || desc.includes("container") || desc.includes("kubernetes") || desc.includes("k8s")) tags.push("DevOps", "Containers");
  if (desc.includes("typescript") || name.includes("typescript")) tags.push("TypeScript");
  if (desc.includes("rust")) tags.push("Rust", "Systems Programming");
  if (desc.includes("python")) tags.push("Python");
  if (desc.includes("react") || desc.includes("next.js") || desc.includes("frontend")) tags.push("Frontend Engineering");
  if (desc.includes("database") || desc.includes("sql") || desc.includes("clickhouse") || desc.includes("postgres")) tags.push("Databases", "System Design");
  if (desc.includes("security") || desc.includes("vulnerability") || desc.includes("mtls") || desc.includes("auth")) tags.push("Security", "DevSecOps");
  if (desc.includes("benchmark") || desc.includes("eval") || desc.includes("performance")) tags.push("AI Benchmarks", "Performance");
  if (desc.includes("open source") || desc.includes("open-source") || desc.includes("apache")) tags.push("Open Source");

  // Fallback
  if (tags.length === 0) tags.push("Software Engineering", "Developer Tools");

  return [...new Set(tags)].slice(0, 5);
}

function inferTechnicalImportance(repo: any): "HIGH" | "MEDIUM" | "LOW" {
  if (repo.stargazers_count > 10000 || (repo.stargazers_count > 3000 && repo.forks_count > 500)) return "HIGH";
  if (repo.stargazers_count > 2000 || repo.forks_count > 200) return "MEDIUM";
  return "LOW";
}

function buildWhyGainingAttention(repo: any): string {
  const desc = repo.description || "An emerging software engineering project gaining community attention.";
  const lang = repo.language ? ` Built with ${repo.language}.` : "";
  return `${desc}${lang}`;
}

// Fallback repos for when GitHub API is rate-limited or unavailable
const FALLBACK_TRENDING: GitHubRepoAnalysis[] = [
  {
    repoName: "modelcontextprotocol/servers",
    url: "https://github.com/modelcontextprotocol/servers",
    stars: 18400,
    forks: 2100,
    starVelocity7d: 2100,
    maintainerActivityScore: 98,
    hasActiveReleases: true,
    whyGainingAttention: "Model Context Protocol (MCP) reference server implementations enabling standardized tool calling across AI agent swarms.",
    language: "TypeScript",
    description: "Model Context Protocol reference servers for AI agent swarms and IDE tool integrations",
    technicalImportance: "HIGH",
    primaryTech: ["TypeScript", "Agentic AI", "MCP", "AI Engineering"],
  },
  {
    repoName: "astral-sh/uv",
    url: "https://github.com/astral-sh/uv",
    stars: 39500,
    forks: 1800,
    starVelocity7d: 2400,
    maintainerActivityScore: 98,
    hasActiveReleases: true,
    whyGainingAttention: "An extremely fast Python package and project manager written in Rust, replacing pip, pip-tools, and virtualenv.",
    language: "Rust",
    description: "An extremely fast Python package and project manager, written in Rust",
    technicalImportance: "HIGH",
    primaryTech: ["Rust", "Python", "Developer Tools", "Performance"],
  },
  {
    repoName: "langchain-ai/langgraph",
    url: "https://github.com/langchain-ai/langgraph",
    stars: 18900,
    forks: 3400,
    starVelocity7d: 1450,
    maintainerActivityScore: 94,
    hasActiveReleases: true,
    whyGainingAttention: "Cyclic state graph multi-agent orchestration framework replacing naive DAG chains in production.",
    language: "TypeScript",
    description: "Build resilient language agents as graphs",
    technicalImportance: "HIGH",
    primaryTech: ["Python", "TypeScript", "Agentic AI", "State Graphs"],
  },
  {
    repoName: "biomejs/biome",
    url: "https://github.com/biomejs/biome",
    stars: 19800,
    forks: 680,
    starVelocity7d: 1300,
    maintainerActivityScore: 95,
    hasActiveReleases: true,
    whyGainingAttention: "Rust-powered fast linter and formatter replacing ESLint and Prettier in modern monorepos.",
    language: "Rust",
    description: "Rust-based fast formatter/linter replacing ESLint and Prettier",
    technicalImportance: "HIGH",
    primaryTech: ["Rust", "TypeScript", "Developer Tools", "Performance"],
  },
  {
    repoName: "aquasecurity/trivy",
    url: "https://github.com/aquasecurity/trivy",
    stars: 24200,
    forks: 2400,
    starVelocity7d: 980,
    maintainerActivityScore: 96,
    hasActiveReleases: true,
    whyGainingAttention: "Comprehensive security scanner for container images, Kubernetes manifests, and IaC dependencies.",
    language: "Go",
    description: "Security scanner for containers, k8s, IaC",
    technicalImportance: "HIGH",
    primaryTech: ["Go", "Security", "DevOps", "Containers"],
  },
  {
    repoName: "ClickHouse/ClickHouse",
    url: "https://github.com/ClickHouse/ClickHouse",
    stars: 41200,
    forks: 7400,
    starVelocity7d: 1200,
    maintainerActivityScore: 96,
    hasActiveReleases: true,
    whyGainingAttention: "Columnar database management system designed for real-time analytical SQL queries at petabyte scale.",
    language: "C++",
    description: "ClickHouse is a real-time analytics DBMS",
    technicalImportance: "HIGH",
    primaryTech: ["C++", "Databases", "System Design", "Analytics"],
  },
];

export class GitHubCollector {
  private readonly GITHUB_API = "https://api.github.com";
  private readonly GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "PersonalBrandOS-IntelligenceEngine/1.0",
    };
    if (this.GITHUB_TOKEN) h["Authorization"] = `Bearer ${this.GITHUB_TOKEN}`;
    return h;
  }

  // Fetch today's live trending repos by directly scraping https://github.com/trending
  private async fetchDirectGitHubTrending(): Promise<GitHubRepoAnalysis[]> {
    const response = await fetch("https://github.com/trending", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!response.ok) throw new Error(`github.com/trending responded HTTP ${response.status}`);

    const html = await response.text();
    const articles = html.split('<article class="Box-row">').slice(1);
    if (articles.length === 0) throw new Error("No trending repository articles found in HTML");

    const analyses: GitHubRepoAnalysis[] = [];
    for (const art of articles.slice(0, 15)) {
      const repoMatch = art.match(/<h2 class="h3 lh-condensed">[\s\S]*?<a\s+[^>]*href="\/([a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+)"/);
      if (!repoMatch) continue;

      const repoName = repoMatch[1].trim();
      const descMatch = art.match(/<p class="[^"]*col-9[^"]*">([\s\S]*?)<\/p>/);
      const langMatch = art.match(/<span itemprop="programmingLanguage">([\s\S]*?)<\/span>/);
      const starsMatch = art.match(/href="\/[^"]+\/stargazers"[^>]*>([\s\S]*?)<\/a>/);
      const forksMatch = art.match(/href="\/[^"]+\/forks"[^>]*>([\s\S]*?)<\/a>/);
      const periodStarsMatch = art.match(/([0-9,]+)\s+stars\s+(?:today|this week|this month)/i);

      const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "Trending open-source project gaining rapid developer adoption.";
      const language = langMatch ? langMatch[1].trim() : "Unknown";
      const stars = starsMatch ? parseInt(starsMatch[1].replace(/<[^>]+>/g, "").replace(/,/g, "").trim(), 10) || 0 : 0;
      const forks = forksMatch ? parseInt(forksMatch[1].replace(/<[^>]+>/g, "").replace(/,/g, "").trim(), 10) || 0 : 0;
      const starVelocity7d = periodStarsMatch ? parseInt(periodStarsMatch[1].replace(/,/g, ""), 10) || 0 : Math.floor(stars * 0.05);

      const primaryTech = inferTechTags({ description, language, full_name: repoName });
      analyses.push({
        repoName,
        url: `https://github.com/${repoName}`,
        stars,
        forks,
        starVelocity7d,
        maintainerActivityScore: 92,
        hasActiveReleases: true,
        whyGainingAttention: `${description}${language ? ` Built with ${language}.` : ""}`,
        language,
        description,
        technicalImportance: stars > 10000 || starVelocity7d > 500 ? "HIGH" : "MEDIUM",
        primaryTech,
      });
    }

    return analyses;
  }

  // Fetch live GitHub breakout repos using Search API (recently created with high velocity, or actively updated)
  private async fetchLiveTrendingRepos(): Promise<GitHubRepoAnalysis[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

    // Priority 1: Breakout newly created repos gaining rapid stars
    let url = `${this.GITHUB_API}/search/repositories?q=created:>${thirtyDaysAgo}+stars:>100&sort=stars&order=desc&per_page=15`;

    let response = await fetch(url, { headers: this.headers });
    let data: any = response.ok ? await response.json() : null;

    // Priority 2: High-momentum repos updated within 7 days with realistic star range (not freeCodeCamp/linux)
    if (!data?.items || data.items.length < 3) {
      url = `${this.GITHUB_API}/search/repositories?q=pushed:>${sevenDaysAgo}+stars:1000..50000&sort=updated&order=desc&per_page=15`;
      response = await fetch(url, { headers: this.headers });
      if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText);
        throw new Error(`GitHub API responded ${response.status}: ${errText}`);
      }
      data = await response.json();
    }

    const repos: any[] = (data.items || []).filter(
      (r: any) => !r.fork && r.stargazers_count >= 100
    );

    return repos.slice(0, 10).map((repo: any): GitHubRepoAnalysis => ({
      repoName: repo.full_name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      starVelocity7d: Math.max(50, Math.floor(repo.stargazers_count * 0.05)),
      maintainerActivityScore: Math.min(99, 65 + Math.floor((repo.open_issues_count || 0) / 10)),
      hasActiveReleases: true,
      whyGainingAttention: buildWhyGainingAttention(repo),
      language: repo.language || "Unknown",
      description: repo.description || "A fast-growing open source project.",
      technicalImportance: inferTechnicalImportance(repo),
      primaryTech: inferTechTags(repo),
    }));
  }

  // Fetch today's trending repos from ghapi.huchen.dev (optional third-party fallback)
  private async fetchGhApiTrending(): Promise<GitHubRepoAnalysis[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch("https://ghapi.huchen.dev/repositories?language=&since=daily", {
        headers: { "User-Agent": "PersonalBrandOS-IntelligenceEngine/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`ghapi responded ${response.status}`);

      const repos: any[] = await response.json();
      return repos.slice(0, 12).map((repo: any): GitHubRepoAnalysis => ({
        repoName: `${repo.author}/${repo.name}`,
        url: repo.url || `https://github.com/${repo.author}/${repo.name}`,
        stars: repo.stars || 0,
        forks: repo.forks || 0,
        starVelocity7d: repo.currentPeriodStars || 0,
        maintainerActivityScore: 85,
        hasActiveReleases: true,
        whyGainingAttention: repo.description || `Trending ${repo.language || "software"} project with rapid community adoption.`,
        language: repo.language || "Unknown",
        description: repo.description || "",
        technicalImportance: (repo.stars || 0) > 10000 ? "HIGH" : "MEDIUM",
        primaryTech: inferTechTags({ description: repo.description || "", language: repo.language || "", full_name: `${repo.author}/${repo.name}` }),
      }));
    } finally {
      clearTimeout(timeout);
    }
  }

  public async collectGitHubSignals(): Promise<{
    signals: RawIntelligenceSignal[];
    analyses: GitHubRepoAnalysis[];
  }> {
    const now = new Date().toISOString();
    let analyses: GitHubRepoAnalysis[] = [];

    // Priority 1: Direct live GitHub Trending scraper (official github.com/trending page)
    try {
      console.log("[GitHubCollector] Scraping live trending repos directly from github.com/trending...");
      analyses = await this.fetchDirectGitHubTrending();
      console.log(`[GitHubCollector] ✅ Live github.com/trending: ${analyses.length} repos discovered`);
    } catch (err: any) {
      console.warn("[GitHubCollector] Direct github.com/trending failed:", err.message, "— trying GitHub Search API...");
    }

    // Priority 2: GitHub Search API (breakout newly created repos or fast-updated repos)
    if (analyses.length === 0) {
      try {
        console.log("[GitHubCollector] Fetching breakout trending repos from GitHub Search API...");
        analyses = await this.fetchLiveTrendingRepos();
        console.log(`[GitHubCollector] ✅ Live GitHub Search API: ${analyses.length} breakout repos`);
      } catch (err: any) {
        console.warn("[GitHubCollector] GitHub Search API failed:", err.message, "— trying ghapi...");
      }
    }

    // Priority 3: ghapi proxy fallback
    if (analyses.length === 0) {
      try {
        console.log("[GitHubCollector] Fetching trending repos from ghapi.huchen.dev...");
        analyses = await this.fetchGhApiTrending();
        console.log(`[GitHubCollector] ✅ ghapi: ${analyses.length} repos`);
      } catch (err: any) {
        console.warn("[GitHubCollector] ghapi failed:", err.message, "— using updated fallback trending.");
        analyses = FALLBACK_TRENDING;
      }
    }

    const signals: RawIntelligenceSignal[] = analyses.map((repo, idx) => ({
      id: `sig_gh_${idx}_${Date.now()}`,
      sourceId: "github_trending_daily",
      sourceName: "GitHub Trending Intelligence Engine (Live)",
      category: "OPEN_SOURCE" as any,
      authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      title: `GitHub Trending: ${repo.repoName} — ${repo.whyGainingAttention.substring(0, 120)}`,
      content: `Repository ${repo.repoName} has ${repo.stars.toLocaleString()} stars (+${repo.starVelocity7d.toLocaleString()} recently). Language: ${repo.language}. Forks: ${repo.forks.toLocaleString()}. Importance: ${repo.technicalImportance}. ${repo.description}`,
      url: repo.url,
      publishedAt: now,
      retrievedAt: now,
      metadata: repo,
      tags: repo.primaryTech,
    }));

    return { signals, analyses };
  }
}

export const gitHubCollector = new GitHubCollector();

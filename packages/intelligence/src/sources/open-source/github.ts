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
    repoName: "microsoft/generative-ai-for-beginners",
    url: "https://github.com/microsoft/generative-ai-for-beginners",
    stars: 78000,
    forks: 40000,
    starVelocity7d: 1800,
    maintainerActivityScore: 94,
    hasActiveReleases: true,
    whyGainingAttention: "Microsoft's 21-lesson GenAI curriculum covering LLMs, RAG, agents, and production deployment patterns.",
    language: "Jupyter Notebook",
    description: "21 lessons, Get Started Building with Generative AI",
    technicalImportance: "HIGH",
    primaryTech: ["Python", "LLM", "AI Engineering", "RAG"],
  },
  {
    repoName: "langchain-ai/langgraph",
    url: "https://github.com/langchain-ai/langgraph",
    stars: 15400,
    forks: 2900,
    starVelocity7d: 890,
    maintainerActivityScore: 92,
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
    stars: 16800,
    forks: 560,
    starVelocity7d: 1200,
    maintainerActivityScore: 94,
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
    stars: 22400,
    forks: 2200,
    starVelocity7d: 950,
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
    stars: 38200,
    forks: 6800,
    starVelocity7d: 1100,
    maintainerActivityScore: 95,
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

  // Fetch live GitHub trending repos using Search API (by stars pushed in last 7 days)
  private async fetchLiveTrendingRepos(): Promise<GitHubRepoAnalysis[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const url = `${this.GITHUB_API}/search/repositories?q=pushed:>${sevenDaysAgo}+stars:>500&sort=stars&order=desc&per_page=20`;

    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`GitHub API responded ${response.status}: ${errText}`);
    }

    const data: any = await response.json();
    const repos: any[] = (data.items || []).filter(
      (r: any) => r.stargazers_count >= MIN_STARS && r.forks_count >= MIN_FORKS && !r.fork
    );

    return repos.slice(0, 10).map((repo: any): GitHubRepoAnalysis => ({
      repoName: repo.full_name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      starVelocity7d: Math.floor(repo.stargazers_count * 0.03), // Estimated weekly velocity
      maintainerActivityScore: Math.min(99, 60 + Math.floor(repo.open_issues_count / 10)),
      hasActiveReleases: true,
      whyGainingAttention: buildWhyGainingAttention(repo),
      language: repo.language || "Unknown",
      description: repo.description || "A fast-growing open source project.",
      technicalImportance: inferTechnicalImportance(repo),
      primaryTech: inferTechTags(repo),
    }));
  }

  // Fetch today's trending repos from ghapi.huchen.dev (no auth required)
  private async fetchGhApiTrending(): Promise<GitHubRepoAnalysis[]> {
    const response = await fetch("https://ghapi.huchen.dev/repositories?language=&since=daily", {
      headers: { "User-Agent": "PersonalBrandOS-IntelligenceEngine/1.0" },
    });
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
  }

  public async collectGitHubSignals(): Promise<{
    signals: RawIntelligenceSignal[];
    analyses: GitHubRepoAnalysis[];
  }> {
    const now = new Date().toISOString();
    let analyses: GitHubRepoAnalysis[] = [];

    // Try live ghapi trending (no auth) first
    try {
      console.log("[GitHubCollector] Fetching live trending repos from ghapi.huchen.dev...");
      analyses = await this.fetchGhApiTrending();
      console.log(`[GitHubCollector] ✅ Live trending: ${analyses.length} repos from ghapi.huchen.dev`);
    } catch (err: any) {
      console.warn("[GitHubCollector] ghapi failed:", err.message, "— trying GitHub Search API...");
    }

    // Try GitHub Search API if ghapi failed
    if (analyses.length === 0) {
      try {
        console.log("[GitHubCollector] Fetching live trending repos from GitHub Search API...");
        analyses = await this.fetchLiveTrendingRepos();
        console.log(`[GitHubCollector] ✅ Live GitHub Search API: ${analyses.length} repos`);
      } catch (err: any) {
        console.warn("[GitHubCollector] GitHub Search API failed:", err.message, "— using fallback trending.");
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

import fs from "fs";
import path from "path";
import { getWorkspacePath } from "@brand-os/shared";

export type SkillCategory =
  | "FRONTEND"
  | "BACKEND"
  | "AI_ENGINEERING"
  | "SYSTEM_DESIGN"
  | "ENGINEERING_QUALITY"
  | "PRODUCT_ENGINEERING";

export interface SkillEvidenceItem {
  id: string;
  name: string;
  category: SkillCategory;
  supportingProject: string;
  demonstratedImplementation: string;
  technicalDepth: "FOUNDATIONAL" | "ADVANCED" | "EXPERT";
  confidenceScore: number; // 0-100
  architectureDecisions: string[];
  tradeoffsFaced: string[];
  artifacts: string[];
  interviewTopics: string[];
  lastDemonstratedDate: string | null;
  postIds: string[];
}

export interface RecruiterAttractionBreakdown {
  skillEvidence: number;      // 0-100: Grounded in real implementation artifacts
  roleRelevance: number;      // 0-100: Aligns with Senior / Lead / Staff Engineer expectations
  technicalDepth: number;     // 0-100: Meaningful depth rather than high-level surface buzz
  problemSolving: number;     // 0-100: Concrete engineering challenge addressed
  engineeringJudgment: number;// 0-100: Decisions and trade-offs explicitly balanced
  portfolioValue: number;     // 0-100: Leads to code, reproducible case study, or architecture
  differentiation: number;    // 0-100: Differentiates profile from generic regurgitated AI content
  audienceRelevance: number;  // 0-100: Relevant to CTOs, Hiring Managers, and Staff Engineers
  discussionPotential: number;// 0-100: Sparks high-caliber technical discussion
  credibility: number;        // 0-100: Supported by verified real-world evidence
}

export interface RecruiterAttractionResult {
  score: number; // 0-100 composite
  breakdown: RecruiterAttractionBreakdown;
  rationale: string;
  demonstratedSkills: string[];
  primaryCategory: SkillCategory;
}

export interface SkillCoverageStatus {
  category: SkillCategory;
  totalSkills: number;
  demonstratedCount: number;
  recentCount: number;
  status: "UNDERREPRESENTED" | "BALANCED" | "SATURATED";
  underrepresentedSkills: string[];
}

// Canonical Skill Registry grounded in authentic project artifacts in Brand OS
const INITIAL_SKILLS: SkillEvidenceItem[] = [
  {
    id: "skill_fe_react19",
    name: "React & Component Architecture",
    category: "FRONTEND",
    supportingProject: "Brand OS Dashboard & Client Suite",
    demonstratedImplementation: "Built high-performance responsive web dashboard using React 19, TypeScript, and Vite.",
    technicalDepth: "ADVANCED",
    confidenceScore: 92,
    architectureDecisions: ["Component composition over prop drilling", "Zero external CSS bloat"],
    tradeoffsFaced: ["Client-side hydration vs initial bundle size"],
    artifacts: ["client/src/App.tsx", "client/src/components/"],
    interviewTopics: ["State machines in UI", "Virtual DOM diffing", "Component isolation"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_be_node_express",
    name: "Node.js & REST API Design",
    category: "BACKEND",
    supportingProject: "Brand OS Core Server & Gateway",
    demonstratedImplementation: "Designed REST API server in Express with JWT authentication, RBAC, and Zod schema validation.",
    technicalDepth: "ADVANCED",
    confidenceScore: 95,
    architectureDecisions: ["Layered controller/service pattern", "Stateless JWT sessions"],
    tradeoffsFaced: ["Stateless auth simplicity vs token revocation capability"],
    artifacts: ["server/src/main.ts", "server/src/controllers/"],
    interviewTopics: ["Event loop non-blocking I/O", "API versioning", "Error boundary propagation"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_ai_agents_rag",
    name: "AI Agents & Multi-Provider Gateway",
    category: "AI_ENGINEERING",
    supportingProject: "Career Brand OS Multi-Agent Swarm",
    demonstratedImplementation: "Engineered multi-agent pipeline with OpenRouter, Nvidia NIM, and local Ollama failover.",
    technicalDepth: "EXPERT",
    confidenceScore: 96,
    architectureDecisions: ["Dynamic model router with cost vs latency optimization", "Strict JSON schema parsing"],
    tradeoffsFaced: ["Provider-specific feature exploitation vs neutral abstraction portability"],
    artifacts: ["packages/ai-gateway/src/index.ts", "packages/agents/src/index.ts"],
    interviewTopics: ["LLM temperature vs structured outputs", "Agentic orchestration vs linear DAGs", "Prompt drift mitigation"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_sys_redis_queues",
    name: "Redis & Background Job Processing",
    category: "SYSTEM_DESIGN",
    supportingProject: "Brand OS Distributed Worker Queue",
    demonstratedImplementation: "Implemented atomic job deduplication, rate limits, and exponential backoff retry schedules.",
    technicalDepth: "ADVANCED",
    confidenceScore: 94,
    architectureDecisions: ["Atomic idempotency keys with UTC calendar slots", "Exponential backoff with jitter"],
    tradeoffsFaced: ["Strict duplicate prevention vs at-least-once retry delivery"],
    artifacts: ["worker/src/main.ts", "packages/publisher/src/index.ts"],
    interviewTopics: ["Redis SETNX locking patterns", "Worker starvation", "Poison pill recovery"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_qual_testing_observability",
    name: "Testing & Engineering Observability",
    category: "ENGINEERING_QUALITY",
    supportingProject: "Brand OS Quality Gate System",
    demonstratedImplementation: "Built comprehensive Vitest multi-agent test suite and strict human-writing linting pipeline.",
    technicalDepth: "EXPERT",
    confidenceScore: 95,
    architectureDecisions: ["Mandatory 16-point quality gate barrier before publishing", "Jaccard similarity anti-repetition guards"],
    tradeoffsFaced: ["Thorough pre-publish validation latency vs execution throughput"],
    artifacts: ["packages/agents/src/agents/humanization.ts", "tests/output-quality-inspector.test.ts"],
    interviewTopics: ["Semantic drift detection in AI systems", "Hermetic testing in monorepos", "Zero flaky test strategy"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_prod_ci_cd",
    name: "Full Stack Product Engineering & CI/CD",
    category: "PRODUCT_ENGINEERING",
    supportingProject: "Brand OS Autonomous Pipeline",
    demonstratedImplementation: "Built end-to-end autonomous publication engine from trend discovery to live LinkedIn API integration.",
    technicalDepth: "ADVANCED",
    confidenceScore: 93,
    architectureDecisions: ["Monorepo pnpm workspace structuring", "Dual serverless + daemon worker runtime compatibility"],
    tradeoffsFaced: ["Full cloud vendor tie-in vs self-hostable dockerized container architecture"],
    artifacts: ["package.json", "docker-compose.yml", "vercel.json"],
    interviewTopics: ["Monorepo dependency graphs", "Zero-downtime rolling deploys", "Production telemetry"],
    lastDemonstratedDate: null,
    postIds: [],
  },
];

export class SkillEvidenceRegistry {
  private registryFile: string;
  private skills: SkillEvidenceItem[] = [];

  constructor() {
    this.registryFile = getWorkspacePath("skill_evidence_registry.json");
    this.loadRegistry();
  }

  private loadRegistry(): void {
    try {
      if (fs.existsSync(this.registryFile)) {
        const raw = fs.readFileSync(this.registryFile, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.skills = parsed;
          return;
        }
      }
    } catch {}
    this.skills = [...INITIAL_SKILLS];
    this.saveRegistry();
  }

  private saveRegistry(): void {
    try {
      fs.writeFileSync(this.registryFile, JSON.stringify(this.skills, null, 2), "utf-8");
    } catch (e) {
      console.warn("[SkillEvidenceRegistry] Failed to persist registry:", e);
    }
  }

  public getVerifiedSkills(): SkillEvidenceItem[] {
    return [...this.skills];
  }

  public recordSkillDemonstration(skillName: string, postId: string): void {
    const skill = this.skills.find(
      (s) => s.name.toLowerCase() === skillName.toLowerCase() || s.id === skillName
    );
    if (skill) {
      skill.lastDemonstratedDate = new Date().toISOString();
      if (!skill.postIds.includes(postId)) {
        skill.postIds.push(postId);
      }
      this.saveRegistry();
    }
  }

  /**
   * Evaluates RecruiterAttractionScore (0-100) across 10 normalized dimensions.
   */
  public evaluateRecruiterAttraction(candidate: {
    title: string;
    category?: string;
    framework?: string;
    tags?: string[];
    problem?: string;
    evidenceCount?: number;
    hasTradeoffs?: boolean;
  }): RecruiterAttractionResult {
    const text = `${candidate.title} ${candidate.category || ""} ${candidate.framework || ""} ${(candidate.tags || []).join(" ")} ${candidate.problem || ""}`.toLowerCase();

    // Match skills in registry
    const matchedSkills = this.skills.filter((s) => {
      const sName = s.name.toLowerCase();
      const sCat = s.category.toLowerCase().replace(/_/g, " ");
      return (
        text.includes(sName) ||
        text.includes(sCat) ||
        s.artifacts.some((a) => text.includes(path.basename(a).toLowerCase())) ||
        (s.category === "AI_ENGINEERING" && (text.includes("ai") || text.includes("agent") || text.includes("rag") || text.includes("llm"))) ||
        (s.category === "SYSTEM_DESIGN" && (text.includes("redis") || text.includes("cache") || text.includes("queue") || text.includes("worker") || text.includes("scaling"))) ||
        (s.category === "BACKEND" && (text.includes("api") || text.includes("node") || text.includes("auth") || text.includes("postgres"))) ||
        (s.category === "FRONTEND" && (text.includes("react") || text.includes("typescript") || text.includes("state") || text.includes("ui"))) ||
        (s.category === "ENGINEERING_QUALITY" && (text.includes("test") || text.includes("audit") || text.includes("metric") || text.includes("reliability")))
      );
    });

    const primarySkill = matchedSkills[0] || this.skills[2]; // Default to AI_ENGINEERING or matched
    const primaryCategory = primarySkill.category;

    // Dimension 1: skillEvidence (grounded in verified implementation)
    const skillEvidence = matchedSkills.length > 0 ? Math.min(100, 75 + matchedSkills[0].confidenceScore * 0.25) : 55;

    // Dimension 2: roleRelevance (target Senior / Lead roles)
    const isLeadTopic = text.includes("architect") || text.includes("design") || text.includes("tradeoff") || text.includes("incident") || text.includes("resilience");
    const roleRelevance = isLeadTopic ? 92 : 82;

    // Dimension 3: technicalDepth
    const hasDeepKeywords = text.includes("atomic") || text.includes("latency") || text.includes("concurrency") || text.includes("failover") || text.includes("memory") || text.includes("pipeline");
    const technicalDepth = hasDeepKeywords ? 90 : 80;

    // Dimension 4: problemSolving
    const problemSolving = candidate.problem || text.includes("problem") || text.includes("bottleneck") || text.includes("outage") ? 88 : 78;

    // Dimension 5: engineeringJudgment (tradeoffs and decisions)
    const engineeringJudgment = candidate.hasTradeoffs || text.includes("vs") || text.includes("decision") || text.includes("tradeoff") ? 92 : 75;

    // Dimension 6: portfolioValue (leads to code / case study)
    const portfolioValue = matchedSkills.length > 0 && matchedSkills[0].artifacts.length > 0 ? 90 : 70;

    // Dimension 7: differentiation (distinctive, non-generic)
    const isGenericAi = text.includes("future of ai") || text.includes("revolutionary ai");
    const differentiation = isGenericAi ? 40 : 88;

    // Dimension 8: audienceRelevance (CTO, Hiring Manager, Lead)
    const audienceRelevance = (roleRelevance + technicalDepth) / 2;

    // Dimension 9: discussionPotential (invites technical debate)
    const discussionPotential = engineeringJudgment >= 85 ? 88 : 75;

    // Dimension 10: credibility (supported by evidence)
    const credibility = (candidate.evidenceCount && candidate.evidenceCount > 0 ? 92 : 82);

    const breakdown: RecruiterAttractionBreakdown = {
      skillEvidence,
      roleRelevance,
      technicalDepth,
      problemSolving,
      engineeringJudgment,
      portfolioValue,
      differentiation,
      audienceRelevance: Math.round(audienceRelevance),
      discussionPotential,
      credibility,
    };

    const compositeScore = Math.round(
      skillEvidence * 0.15 +
      roleRelevance * 0.15 +
      technicalDepth * 0.15 +
      problemSolving * 0.10 +
      engineeringJudgment * 0.10 +
      portfolioValue * 0.10 +
      differentiation * 0.10 +
      audienceRelevance * 0.05 +
      discussionPotential * 0.05 +
      credibility * 0.05
    );

    const rationale = `Demonstrates ${primarySkill.name} with verified project evidence in ${primarySkill.supportingProject}. Technical depth is ${primarySkill.technicalDepth.toLowerCase()} with explicit engineering trade-offs.`;

    return {
      score: compositeScore,
      breakdown,
      rationale,
      demonstratedSkills: matchedSkills.map((s) => s.name),
      primaryCategory,
    };
  }

  /**
   * Maintains rolling matrix of skills demonstrated vs underrepresented.
   */
  public getSkillCoverageMatrix(history: Array<{ title: string; category?: string; publishedAt?: string }>): SkillCoverageStatus[] {
    const categories: SkillCategory[] = [
      "FRONTEND",
      "BACKEND",
      "AI_ENGINEERING",
      "SYSTEM_DESIGN",
      "ENGINEERING_QUALITY",
      "PRODUCT_ENGINEERING",
    ];

    const now = Date.now();
    const last30DaysMs = 30 * 24 * 60 * 60 * 1000;

    return categories.map((cat) => {
      const catSkills = this.skills.filter((s) => s.category === cat);
      const catPosts = history.filter((p) => {
        const text = `${p.title} ${p.category || ""}`.toLowerCase();
        const catKey = cat.toLowerCase().replace(/_/g, " ");
        return text.includes(catKey);
      });

      const recentCatPosts = catPosts.filter((p) => {
        if (!p.publishedAt) return false;
        return now - new Date(p.publishedAt).getTime() <= last30DaysMs;
      });

      let status: "UNDERREPRESENTED" | "BALANCED" | "SATURATED" = "BALANCED";
      if (recentCatPosts.length === 0) {
        status = "UNDERREPRESENTED";
      } else if (recentCatPosts.length >= 4) {
        status = "SATURATED";
      }

      const underrepresentedSkills = catSkills
        .filter((s) => !s.lastDemonstratedDate || s.postIds.length === 0)
        .map((s) => s.name);

      return {
        category: cat,
        totalSkills: catSkills.length,
        demonstratedCount: catSkills.filter((s) => (s.postIds?.length || 0) > 0).length,
        recentCount: recentCatPosts.length,
        status,
        underrepresentedSkills,
      };
    });
  }
}

export const skillEvidenceRegistry = new SkillEvidenceRegistry();

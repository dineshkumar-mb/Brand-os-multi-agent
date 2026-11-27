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
  technicalDepth: number;     // 0-100: Meaningful depth rather than surface buzz
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

// Canonical Skill Registry grounded in Dinesh Kumar M B's verified portfolio & work experience
const INITIAL_SKILLS: SkillEvidenceItem[] = [
  {
    id: "skill_fe_react19",
    name: "React & Component Architecture",
    category: "FRONTEND",
    supportingProject: "Neelan Oxysoft Modules & TaskFlow SaaS UI",
    demonstratedImplementation: "Delivered 10+ production React.js, TypeScript, Redux Toolkit, and Tailwind modules at Neelan Oxysoft, cutting component re-renders by 35% and improving load speed by 20%.",
    technicalDepth: "EXPERT",
    confidenceScore: 95,
    architectureDecisions: ["Normalized Redux Toolkit slices for UI state", "Reusable Tailwind component libraries"],
    tradeoffsFaced: ["Upfront component abstraction vs sprint speed"],
    artifacts: ["https://github.com/dineshkumar-mb/taskflow-frontend", "https://dineshkumar-mb-portfolio.vercel.app/"],
    interviewTopics: ["Redux Toolkit state normalization", "React re-render optimization", "Modular UI architecture"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_be_node_express",
    name: "Node.js & REST API Design",
    category: "BACKEND",
    supportingProject: "TaskFlow SaaS & AI Code Reviewer Proxy",
    demonstratedImplementation: "Designed Express REST APIs with JWT/RBAC, multi-tenant isolation, Cashfree payment webhooks, and rate-limited Gemini AI proxies.",
    technicalDepth: "ADVANCED",
    confidenceScore: 95,
    architectureDecisions: ["Rate-limited backend AI proxy", "Tenant-scoped RBAC route guards"],
    tradeoffsFaced: ["Stateless JWT simplicity vs granular permission revocation"],
    artifacts: ["https://github.com/dineshkumar-mb/taskflow-frontend", "https://github.com/dineshkumar-mb/code-ReviewFrontend"],
    interviewTopics: ["Event loop non-blocking I/O", "Webhook idempotency", "API proxy security"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_ai_agents_rag",
    name: "AI Agents & Multi-Provider Gateway",
    category: "AI_ENGINEERING",
    supportingProject: "Career OS (17-Agent Kernel) & Brand OS (12-Agent Swarm)",
    demonstratedImplementation: "Engineered multi-agent platforms with real-time Socket.io execution traces, RiskGate approvals, and OpenRouter/Gemini failover.",
    technicalDepth: "EXPERT",
    confidenceScore: 96,
    architectureDecisions: ["Dynamic multi-provider failover", "Human-in-the-loop RiskGate approval checkpoints"],
    tradeoffsFaced: ["Validation gate latency vs unverified autonomous execution"],
    artifacts: ["https://github.com/dineshkumar-mb/carrier-os-client", "https://github.com/dineshkumar-mb/Brand-os-multi-agent"],
    interviewTopics: ["Multi-agent observability", "LLM failover routing", "Prompt drift mitigation"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_sys_redis_queues",
    name: "Redis & Background Job Processing",
    category: "SYSTEM_DESIGN",
    supportingProject: "TaskFlow SaaS & Brand OS Worker Queues",
    demonstratedImplementation: "Implemented Redis + BullMQ background job queues, atomic deduplication, WebRTC Socket.IO signaling (Streamify), and retry backoff schedules.",
    technicalDepth: "ADVANCED",
    confidenceScore: 94,
    architectureDecisions: ["BullMQ async queues for billing & AI tasks", "Socket.IO offer/answer signaling separated from P2P WebRTC media"],
    tradeoffsFaced: ["P2P WebRTC mesh bandwidth savings vs room participant ceiling"],
    artifacts: ["https://github.com/dineshkumar-mb/Streamify-frontend", "https://github.com/dineshkumar-mb/taskflow-frontend"],
    interviewTopics: ["BullMQ retry/backoff patterns", "WebRTC STUN/TURN signaling", "Idempotency locks"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_qual_testing_observability",
    name: "Testing & Engineering Observability",
    category: "ENGINEERING_QUALITY",
    supportingProject: "AI Code Review & Brand OS Quality Gates",
    demonstratedImplementation: "Engineered sub-2.5s AST/security/Big-O automated code audit workflows paired with Vitest 16-gate AI evaluation suites.",
    technicalDepth: "EXPERT",
    confidenceScore: 95,
    architectureDecisions: ["Automated AST & Big-O verification checks", "Deterministic quality gates before publishing"],
    tradeoffsFaced: ["Thorough validation suites vs quick prototyping"],
    artifacts: ["https://github.com/dineshkumar-mb/code-ReviewFrontend", "https://github.com/dineshkumar-mb/Brand-os-multi-agent"],
    interviewTopics: ["Automated code review pipelines", "Testing AI outputs deterministically", "Monorepo Vitest setups"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_prod_ci_cd",
    name: "Full Stack Product Engineering & CI/CD",
    category: "PRODUCT_ENGINEERING",
    supportingProject: "AI Mock Interview, HRMS & Brand OS CI/CD",
    demonstratedImplementation: "Shipped end-to-end MERN & AI apps (Web Speech API, in-browser Face API HRMS, GitHub Actions CI/CD pipelines, Vercel deployments).",
    technicalDepth: "ADVANCED",
    confidenceScore: 93,
    architectureDecisions: ["Client-side Face API & Web Speech inference to minimize server cost", "Automated GitHub Actions CI/CD"],
    tradeoffsFaced: ["Browser ML startup load vs GPU server hosting cost"],
    artifacts: ["https://github.com/dineshkumar-mb/ai-mock-interview-app-F", "https://github.com/dineshkumar-mb/HRMS"],
    interviewTopics: ["End-to-end product delivery", "Browser-native APIs vs cloud APIs", "GitHub Actions automation"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_be_mern_mongodb",
    name: "MERN Stack & MongoDB Persistence",
    category: "BACKEND",
    supportingProject: "TaskFlow, Streamify & Food Delivery SaaS",
    demonstratedImplementation: "Built production MERN applications with MongoDB/Mongoose schema modeling, multi-tenant data isolation, and Stripe/Cashfree checkout flows.",
    technicalDepth: "ADVANCED",
    confidenceScore: 94,
    architectureDecisions: ["Tenant-scoped MongoDB collections", "Deterministic Node.js business math separated from AI prompts"],
    tradeoffsFaced: ["Flexible document schemas vs relational strictness"],
    artifacts: ["https://github.com/dineshkumar-mb/taskflow-frontend", "https://github.com/dineshkumar-mb/food-del-frontend"],
    interviewTopics: ["MongoDB aggregation & indexing", "Multi-tenant data isolation", "Payment webhook security"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_fe_nextjs_fullstack",
    name: "Next.js, TypeScript & UI Systems",
    category: "FRONTEND",
    supportingProject: "Developer Portfolio & Modern React UI Apps",
    demonstratedImplementation: "Built responsive TypeScript, React, Next.js, Tailwind CSS, and Framer Motion apps with strong Lighthouse performance.",
    technicalDepth: "ADVANCED",
    confidenceScore: 94,
    architectureDecisions: ["Utility-first Tailwind design systems", "Code-split lazy routes for fast initial load"],
    tradeoffsFaced: ["Server-first coupling vs portable SPA bundles"],
    artifacts: ["https://dineshkumar-mb-portfolio.vercel.app/", "https://github.com/dineshkumar-mb/gemini-clone"],
    interviewTopics: ["Bundle splitting & lazy loading", "TypeScript component props", "Tailwind design systems"],
    lastDemonstratedDate: null,
    postIds: [],
  },
  {
    id: "skill_ai_mcp_rag",
    name: "MCP, LangChain & RAG Pipelines",
    category: "AI_ENGINEERING",
    supportingProject: "AI Financial Assistant (OCR + ChromaDB RAG)",
    demonstratedImplementation: "Engineered OCR + ChromaDB vector retrieval pipelines with LangChain and Gemini AI, achieving 70% faster financial query resolution.",
    technicalDepth: "EXPERT",
    confidenceScore: 95,
    architectureDecisions: ["ChromaDB chunking with citation grounding", "Deterministic Node.js EMI math separated from LLM generation"],
    tradeoffsFaced: ["OCR chunking latency vs zero-hallucination cited answers"],
    artifacts: ["https://github.com/dineshkumar-mb/emi-frontend-platform", "https://emi-frontend-platform.vercel.app/"],
    interviewTopics: ["RAG chunking & metadata filtering", "Preventing LLM math hallucinations", "MCP tool schemas"],
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
          const existingIds = new Set(parsed.map((s: any) => s.id));
          const missingDefaults = INITIAL_SKILLS.filter((s) => !existingIds.has(s.id));
          this.skills = [...parsed, ...missingDefaults];
          return;
        }
      }
    } catch {}
    this.skills = [...INITIAL_SKILLS];
    this.saveRegistry();
  }

  private saveRegistry(): void {
    if (process.env.VITEST || process.env.NODE_ENV === "test") {
      return;
    }
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

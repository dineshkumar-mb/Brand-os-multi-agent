import {
  AgentType,
  AgentResult,
  Topic,
  ExperienceLog,
} from "@brand-os/shared";

export interface MinedExperienceNarrative {
  foundMatch: boolean;
  projectContext?: string;
  realWorldProblem?: string;
  engineeringDecision?: string;
  tradeoffsFaced?: string[];
  quantifiableOutcome?: string;
  lessonsLearned?: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// EXPERIENCE LOG DATABASE (Grounded in Dinesh Kumar M B's Portfolio & Work)
// Portfolio: https://dineshkumar-mb-portfolio.vercel.app/
// ─────────────────────────────────────────────────────────────────────────
const DEFAULT_REALISTIC_EXPERIENCE_LOGS: ExperienceLog[] = [
  // ── 1. Neelan Oxysoft: Enterprise React & RBAC Optimization ─────────────
  {
    id: "exp_02_neelan_react_rbac",
    title: "Enterprise React Architecture, Redux Standardization & API RBAC Integration",
    category: "Frontend Engineering",
    description: "Delivered 10+ production web modules at Neelan Oxysoft integrating React.js, TypeScript, Node.js/Express REST APIs, and JWT RBAC.",
    technologiesUsed: ["React.js", "TypeScript", "Redux Toolkit", "Node.js", "Express.js", "REST APIs", "Tailwind CSS"],
    challengesFaced: ["Fragmented component state caused excessive re-renders and inconsistent role-based permission checks across dashboards."],
    solutionApproach: "Standardized Redux Toolkit state slices, reusable Tailwind component libraries, and centralized JWT + RBAC route guards.",
    tradeoffs: ["Upfront component abstraction took extra sprint time before accelerating delivery across 10+ enterprise modules."],
    keyLessons: ["Predictable state slices and reusable UI primitives cut UI regressions and speed up every subsequent module."],
    metricsOrOutcome: "Reduced component re-renders by 35%, improved initial load speed by 20%, and shipped 10+ production modules on schedule.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  // ── 3. TaskFlow: Multi-Tenant SaaS & Redis/BullMQ Queues ────────────────
  {
    id: "exp_03_taskflow_saas",
    title: "TaskFlow — Multi-Tenant SaaS with RBAC, Cashfree Billing & BullMQ",
    category: "Full Stack SaaS",
    description: "Architected Jira-inspired multi-tenant sprint SaaS with MongoDB tenant isolation, Express RBAC, Redis/BullMQ queues, and OpenAI ticket extraction.",
    technologiesUsed: ["React.js", "Node.js", "MongoDB", "Redis", "BullMQ", "OpenAI", "Cashfree"],
    challengesFaced: ["Manual sprint breakdown slowed planning and background billing/notification jobs needed tenant-safe isolation."],
    solutionApproach: "Designed MongoDB tenant scoping, BullMQ Redis queues for async jobs, and natural-language-to-JSON AI ticket parsing.",
    tradeoffs: ["Multi-tenant isolation and webhook idempotency added backend validation complexity over single-tenant CRUD."],
    keyLessons: ["Queueing webhook and AI parsing work with Redis/BullMQ keeps SaaS API endpoints fast and fault-isolated."],
    metricsOrOutcome: "Saved 40% sprint planning time with automated natural-language ticket creation and multi-tenant RBAC.",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  // ── 4. AI Financial Assistant: OCR + ChromaDB RAG Pipeline ──────────────
  {
    id: "exp_04_financial_rag",
    title: "AI Financial Assistant — OCR + ChromaDB RAG for Loan Intelligence",
    category: "AI Engineering",
    description: "Built retrieval-augmented financial loan platform pairing OCR document ingestion, ChromaDB embeddings, Gemini AI, and deterministic Node.js EMI math.",
    technologiesUsed: ["React.js", "Node.js", "Gemini AI", "ChromaDB", "LangChain", "MongoDB"],
    challengesFaced: ["LLMs hallucinated EMI calculations and loan policy clauses when answering complex financial document queries directly."],
    solutionApproach: "Separated deterministic Node.js amortization formulas from Gemini text synthesis and constrained answers strictly to ChromaDB RAG chunks.",
    tradeoffs: ["Document OCR chunking and metadata filtering added ingestion latency in exchange for grounded, zero-hallucination financial answers."],
    keyLessons: ["Never let an LLM compute financial math—combine RAG for policy retrieval with deterministic backend formulas."],
    metricsOrOutcome: "Delivered 70% faster financial query resolution with deterministic EMI math and source-grounded RAG citations.",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  // ── 5. Brand OS: 12-Agent Swarm & Multi-Provider AI Gateway ─────────────
  {
    id: "exp_05_brand_os_gateway",
    title: "Brand OS — 12-Agent AI Swarm & Multi-Provider Gateway Failover",
    category: "AI Engineering",
    description: "Built Brand OS autonomous content platform with multi-provider AI gateway cascade (OpenRouter, Gemini, Nvidia NIM), Prisma, ChromaDB RAG, and BullMQ.",
    technologiesUsed: ["React 19", "TypeScript", "Node.js", "Prisma", "ChromaDB", "BullMQ", "OpenRouter", "Gemini"],
    challengesFaced: ["Single-provider rate limits (429), repetitive LLM wording, and inline-link reach penalties degraded automated publishing."],
    solutionApproach: "Implemented tiered multi-provider failover, Jaccard deduplication gates, humanization sanitization, and first-comment link routing.",
    tradeoffs: ["Multi-gate pre-publish auditing adds validation overhead in exchange for consistent quality and zero duplicate posts."],
    keyLessons: ["Treating external LLM APIs as volatile endpoints with strict output validation gates makes agent workflows dependable."],
    metricsOrOutcome: "Achieved zero-human-intervention scheduled publishing with automated multi-gate quality and deduplication checks.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  // ── 6. Career OS: 17-Agent Runtime Kernel & Socket.io Tracing ───────────
  {
    id: "exp_06_career_os_kernel",
    title: "Career OS — 17-Agent Autonomous Runtime Kernel & Live Execution Traces",
    category: "AI Systems & Architecture",
    description: "Architected 17-agent runtime kernel with real-time Socket.io execution trace streaming, TanStack Query, RiskGate approval center, and ATS validation.",
    technologiesUsed: ["React 19", "TypeScript", "Node.js", "Express", "Socket.io", "TanStack Query"],
    challengesFaced: ["Multi-step agent workflows operated like black boxes without live visibility or human-in-the-loop approval checkpoints."],
    solutionApproach: "Built Socket.io real-time execution trace events paired with a RiskGate human approval queue before external actions run.",
    tradeoffs: ["Streaming granular trace state over WebSockets required careful event throttling so React UI rendering stayed smooth."],
    keyLessons: ["Autonomous agents earn trust in real products when users can inspect live execution steps and approve risky actions."],
    metricsOrOutcome: "Delivered real-time Socket.io trace observability and evidence-grounded ATS re-validation across 17 agents.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  // ── 7. AI Code Review: Express Proxy & AST Security Audits ──────────────
  {
    id: "exp_07_ai_code_reviewer",
    title: "AI Code Review — Rate-Limited Express Proxy & Sub-2.5s AST Audits",
    category: "Developer Tools & AI",
    description: "Engineered automated code review assistant using a rate-limited Express proxy gateway, Google Gemini Flash, and an interactive React diff viewer.",
    technologiesUsed: ["React.js", "Node.js", "Express.js", "Gemini", "Tailwind CSS"],
    challengesFaced: ["Calling LLM APIs directly from the browser leaks keys, while unstructured reviews missed security and Big-O complexity issues."],
    solutionApproach: "Moved inference behind a rate-limited Express proxy and enforced structured JSON schemas for AST, leak, and Big-O diagnostics.",
    tradeoffs: ["Strict JSON output schemas occasionally require fallback parsing when analyzing malformed or incomplete user snippets."],
    keyLessons: ["Always proxy AI calls through a backend rate-limiter and enforce structured response schemas for reliable UI rendering."],
    metricsOrOutcome: "Delivered sub-2.5s automated code analysis with side-by-side React syntax diff visualization.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  // ── 8. Streamify: MERN WebRTC Mesh & Socket.IO Signaling ────────────────
  {
    id: "exp_08_streamify_webrtc",
    title: "Streamify — Real-Time WebRTC Video Mesh & Socket.IO Signaling",
    category: "Real-Time Full Stack Systems",
    description: "Built MERN video, voice, and encrypted messaging platform using peer-to-peer WebRTC mesh connections and Socket.IO STUN/TURN signaling.",
    technologiesUsed: ["React.js", "Node.js", "MongoDB", "WebRTC", "Socket.io", "WebSockets"],
    challengesFaced: ["Real-time multi-participant rooms suffered signaling race conditions and NAT traversal drops across different networks."],
    solutionApproach: "Engineered deterministic Socket.IO offer/answer/ICE signaling handlers with STUN/TURN fallback and responsive video grids.",
    tradeoffs: ["Peer-to-peer WebRTC mesh keeps server media bandwidth at zero but limits room size compared to SFU servers."],
    keyLessons: ["Separating lightweight Socket.IO signaling from peer-to-peer media channels keeps real-time MERN apps responsive."],
    metricsOrOutcome: "Achieved sub-100ms real-time media latency with P2P WebRTC video, audio, and chat.",
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  // ── 9. AI Mock Interview: Web Speech API & Gemini Evaluation ────────────
  {
    id: "exp_09_mock_interview",
    title: "AI Mock Interview App — Browser Web Speech API & Real-Time Evaluation",
    category: "AI Engineering",
    description: "Built voice-driven interview simulator combining browser Web Speech API transcription, Clerk authentication, Express, and Gemini evaluation.",
    technologiesUsed: ["React.js", "Express", "Tailwind CSS", "Gemini", "Clerk"],
    challengesFaced: ["Text-only interview tools felt unrealistic, while cloud speech-to-text APIs added latency and per-minute cost."],
    solutionApproach: "Integrated browser-native Web Speech API for live voice transcription paired with rubric-based Gemini AI scoring.",
    tradeoffs: ["Browser Web Speech API reduces server audio cost to zero but requires graceful text fallback on unsupported browsers."],
    keyLessons: ["Pairing browser-native media APIs with structured AI grading creates interactive full-stack UX with minimal backend cost."],
    metricsOrOutcome: "Delivered real-time voice transcription and structured technical clarity scoring with zero audio-transcoding server load.",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  // ── 10. Face Recognition HRMS: In-Browser Biometrics & Google OAuth ─────
  {
    id: "exp_10_hrms_face_api",
    title: "Face Recognition HRMS — In-Browser Biometric Attendance & OAuth",
    category: "Full Stack & SaaS",
    description: "Built MERN workforce management app with in-browser Face API attendance verification, Google OAuth, and admin dashboards.",
    technologiesUsed: ["React.js", "Node.js", "MongoDB", "Express.js", "OAuth"],
    challengesFaced: ["Dedicated biometric hardware increased deployment cost and storing raw facial images on servers raised privacy concerns."],
    solutionApproach: "Ran Face API facial descriptor matching directly in the browser and secured employee sessions with Google OAuth.",
    tradeoffs: ["Client-side model inference avoids GPU server costs while needing clean loading states on initial browser startup."],
    keyLessons: ["Running lightweight ML inference in the browser lowers infrastructure spend and keeps sensitive biometric frames client-side."],
    metricsOrOutcome: "Enabled zero-hardware biometric attendance tracking inside a standard browser MERN app.",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

export class ExperienceMiningAgent {
  private experienceLogs: ExperienceLog[] = [...DEFAULT_REALISTIC_EXPERIENCE_LOGS];

  constructor(initialLogs: ExperienceLog[] = []) {
    this.experienceLogs = initialLogs.length > 0 ? initialLogs : [...DEFAULT_REALISTIC_EXPERIENCE_LOGS];
  }

  public setLogs(logs: ExperienceLog[]) {
    this.experienceLogs = logs && logs.length > 0 ? logs : [...DEFAULT_REALISTIC_EXPERIENCE_LOGS];
  }

  public mineExperience(topic: Topic, pipelineId?: string): AgentResult<MinedExperienceNarrative> {
    const startTime = Date.now();
    console.log(`[Experience Mining Agent] Searching stored engineering experience logs for topic: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    const catLower = (topic.category || "").toLowerCase();
    const kwLower = (topic.keywords || []).map((k) => k.toLowerCase());

    // Scored matching: evaluate all logs and pick the best match
    const scoredLogs = this.experienceLogs.map((log) => {
      const logCat = log.category.toLowerCase();
      const logTitle = log.title.toLowerCase();
      const logDesc = log.description.toLowerCase();
      const logTechs = log.technologiesUsed.map((t) => t.toLowerCase());

      let score = 0;

      // Category overlap (both directions)
      if (logCat.includes(catLower) || catLower.includes(logCat)) score += 30;

      // Technology match against topic title, keywords, and framework
      const techMatchCount = logTechs.filter((t) =>
        titleLower.includes(t) ||
        kwLower.some((k) => k.includes(t) || t.includes(k)) ||
        (topic.framework && topic.framework.toLowerCase().includes(t))
      ).length;
      score += techMatchCount * 20;

      // Title keyword overlap
      const titleWords = titleLower.split(/\s+/).filter((w) => w.length > 3);
      const titleOverlap = titleWords.filter((w) => logTitle.includes(w) || logDesc.includes(w)).length;
      score += titleOverlap * 10;

      // Keywords in log description
      const kwOverlap = kwLower.filter((k) => logDesc.includes(k) || logTitle.includes(k)).length;
      score += kwOverlap * 5;

      return { log, score };
    });

    const bestMatch = scoredLogs.sort((a, b) => b.score - a.score)[0];
    const matchingLog = bestMatch && bestMatch.score >= 40 ? bestMatch.log : null;

    let narrative: MinedExperienceNarrative;

    if (matchingLog) {
      narrative = {
        foundMatch: true,
        projectContext: matchingLog.description,
        realWorldProblem: matchingLog.challengesFaced.join(". "),
        engineeringDecision: matchingLog.solutionApproach,
        tradeoffsFaced: matchingLog.tradeoffs,
        quantifiableOutcome: matchingLog.metricsOrOutcome || "Verified improvement in stability and error reduction.",
        lessonsLearned: matchingLog.keyLessons,
      };
    } else {
      narrative = {
        foundMatch: false,
        projectContext: `Technical research & architectural exploration of ${topic.framework || topic.category || topic.title}.`,
        realWorldProblem: undefined,
        engineeringDecision: undefined,
        tradeoffsFaced: [],
        quantifiableOutcome: undefined,
        lessonsLearned: [
          `Evaluate technical documentation and specifications before implementation.`,
          `Analyze architectural trade-offs prior to production adoption.`,
        ],
      };
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: narrative.foundMatch ? 95 : 30,
      data: narrative,
      validationResult: {
        passed: true,
        errors: [],
        warnings: matchingLog ? [] : ["No stored project experience matched. Mode: EXPLORED_RESEARCH."],
      },
      metadata: {
        agentType: AgentType.EXPERIENCE_MINING,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const experienceMiningAgent = new ExperienceMiningAgent();

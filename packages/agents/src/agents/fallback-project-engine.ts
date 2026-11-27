import {
  Topic,
  HistoricalPostRecord,
  ExperienceLog,
} from "@brand-os/shared";

export interface FallbackProjectTopicCandidate {
  id: string;
  title: string;
  category: string;
  framework: string;
  supportingTech: string[];
  keywords: string[];
  audience: string;
  reasoning: string;
  storyAngle: string;
  experience: ExperienceLog;
}

export class FallbackProjectEngine {
  private readonly fallbackProjects: FallbackProjectTopicCandidate[] = [
    {
      id: "proj_real_taskflow_saas",
      title: "Building Multi-Tenant Sprint SaaS with MongoDB Isolation, BullMQ & OpenAI",
      category: "Full Stack Engineering",
      framework: "Node.js",
      supportingTech: ["React.js", "Node.js", "MongoDB", "Redis", "BullMQ", "OpenAI", "RBAC"],
      keywords: ["MERN Stack", "Multi-Tenancy", "RBAC", "BullMQ", "Full Stack"],
      audience: "Full Stack Developers, Technical Recruiters, Engineering Managers",
      reasoning: "How TaskFlow pairs MongoDB tenant isolation, Express RBAC, Cashfree webhooks, and AI ticket extraction to save 40% sprint planning time.",
      storyAngle: "Why separating webhook billing and AI parsing into Redis/BullMQ queues kept TaskFlow endpoints responsive under multi-tenant load.",
      experience: {
        id: "exp_03_taskflow_saas",
        title: "TaskFlow — Multi-Tenant SaaS Project Management Platform",
        category: "Full Stack Engineering",
        description: "Architected Jira-inspired multi-tenant sprint SaaS with MongoDB tenant isolation, Cashfree recurring webhooks, and OpenAI ticket extraction.",
        technologiesUsed: ["React.js", "Node.js", "MongoDB", "Redis", "BullMQ", "OpenAI"],
        challengesFaced: ["Manual sprint breakdown slowed planning and billing webhooks plus AI ticket parsing blocked API request threads."],
        solutionApproach: "Designed MongoDB tenant scoping, Redis/BullMQ async workers, and natural-language-to-JSON AI ticket creation.",
        tradeoffs: ["Multi-tenant schema isolation and webhook idempotency added backend verification overhead over basic single-tenant CRUD."],
        keyLessons: ["Offloading AI parsing and payment webhooks to Redis/BullMQ keeps SaaS APIs reliable and predictable."],
        metricsOrOutcome: "Saved 40% sprint planning time across multi-tenant RBAC teams.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_real_financial_rag",
      title: "Separating Deterministic Math from Gemini RAG in Financial Loan Intelligence",
      category: "AI Engineering",
      framework: "Gemini AI",
      supportingTech: ["React.js", "Node.js", "Gemini AI", "ChromaDB", "LangChain", "MongoDB"],
      keywords: ["RAG", "ChromaDB", "Gemini AI", "OCR", "Full Stack"],
      audience: "AI Engineers, Full Stack Hiring Managers, Technical Recruiters",
      reasoning: "Lessons from building AI Financial Assistant: combining OCR, ChromaDB vector retrieval, and Node.js amortization math without LLM hallucinations.",
      storyAngle: "LLMs fail at financial arithmetic—moving EMI math into deterministic Node.js services while constraining Gemini RAG to ChromaDB citations fixed accuracy.",
      experience: {
        id: "exp_04_financial_rag",
        title: "AI Financial Assistant — OCR + ChromaDB RAG",
        category: "AI Engineering",
        description: "Built retrieval-augmented financial loan platform indexing OCR policy documents into ChromaDB with Gemini AI and Node.js amortization math.",
        technologiesUsed: ["React.js", "Node.js", "Gemini AI", "ChromaDB", "LangChain", "MongoDB"],
        challengesFaced: ["LLMs hallucinated EMI calculations and invented loan terms when answering financial policy documents directly."],
        solutionApproach: "Separated deterministic Node.js EMI calculations from Gemini synthesis and constrained answers strictly to retrieved ChromaDB chunks.",
        tradeoffs: ["OCR ingestion and metadata chunking added indexing latency in exchange for grounded, verifiable financial responses."],
        keyLessons: ["Use RAG for document retrieval and deterministic backend code for math—never ask an LLM to guess numbers."],
        metricsOrOutcome: "Delivered 70% faster financial query resolution with source-grounded RAG responses.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_real_mock_interview_voice",
      title: "Browser-Native Voice Interviews Using Web Speech API & Structured Gemini Scoring",
      category: "Full Stack AI Engineering",
      framework: "React.js",
      supportingTech: ["React.js", "Node.js", "Express.js", "Clerk", "Web Speech API", "Gemini AI"],
      keywords: ["Web Speech API", "Gemini AI", "React.js", "Node.js", "Full Stack"],
      audience: "Full Stack Engineers, Engineering Managers, Recruiters",
      reasoning: "Lessons from building AI Mock Interview App: transcribing live browser voice via Web Speech API with rubric-driven Gemini feedback.",
      storyAngle: "Streaming raw audio to paid speech servers adds cost and latency; running Web Speech API transcription directly in the browser kept voice interviews fast.",
      experience: {
        id: "exp_09_mock_interview",
        title: "AI Mock Interview App — Web Speech API + Gemini Evaluation",
        category: "Full Stack AI Engineering",
        description: "Engineered browser voice-to-text technical interviews using Web Speech API, Clerk auth, and structured Express + Gemini AI evaluation.",
        technologiesUsed: ["React.js", "Node.js", "Express.js", "Clerk", "Web Speech API", "Gemini AI"],
        challengesFaced: ["Streaming server-side audio transcription added latency and cost during live technical interview sessions."],
        solutionApproach: "Moved voice transcription into browser-native Web Speech API and paired transcripts with structured Gemini rubric grading.",
        tradeoffs: ["Browser Web Speech API coverage varies across engines compared to server Whisper APIs."],
        keyLessons: ["Using native browser APIs for speech capture leaves backend tokens strictly for rubric evaluation."],
        metricsOrOutcome: "Delivered low-latency live voice interviews with structured AI scoring feedback.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_real_career_os_kernel",
      title: "Giving 17 Autonomous AI Agents Live Socket.io Execution Traces & Human Approval",
      category: "Agentic AI",
      framework: "Node.js",
      supportingTech: ["React 19", "TypeScript", "Node.js", "Express", "Socket.io", "TanStack Query"],
      keywords: ["AI Agents", "Socket.io", "TypeScript", "React 19", "Agentic AI"],
      audience: "AI Product Teams, Full Stack Architects, Technical Recruiters",
      reasoning: "Lessons from Career OS: streaming real-time Socket.io execution traces and enforcing human-in-the-loop RiskGate approvals.",
      storyAngle: "Black-box AI workflows fail user trust; streaming live Socket.io traces with RiskGate approval checkpoints made a 17-agent runtime observable.",
      experience: {
        id: "exp_06_career_os_kernel",
        title: "Career OS — 17-Agent Autonomous Runtime Kernel",
        category: "Agentic AI",
        description: "Architected 17-agent runtime kernel with real-time Socket.io execution traces, RiskGate approval center, and ATS validation.",
        technologiesUsed: ["React 19", "TypeScript", "Node.js", "Express", "Socket.io", "TanStack Query"],
        challengesFaced: ["Multi-agent workflows gave users zero live visibility and risked executing unreviewed external actions."],
        solutionApproach: "Streamed step-level execution telemetry via Socket.io and added a RiskGate human-in-the-loop approval center.",
        tradeoffs: ["Throttling real-time trace broadcasts was required so React UI updates stayed smooth during parallel agent steps."],
        keyLessons: ["Production AI agents need observable execution traces and explicit approval gates before taking external actions."],
        metricsOrOutcome: "Real-time Socket.io execution observability across 17 agents with evidence-grounded validation.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_real_ai_code_reviewer",
      title: "Building a Sub-2.5s AI Code Reviewer Behind a Rate-Limited Express Proxy",
      category: "Full Stack Engineering",
      framework: "Express.js",
      supportingTech: ["React.js", "Node.js", "Express.js", "Gemini API", "Tailwind CSS"],
      keywords: ["Express.js", "Gemini API", "React.js", "Code Review", "Security"],
      audience: "Full Stack Developers, Engineering Leads, Technical Recruiters",
      reasoning: "How separating React syntax diffs from a rate-limited Express Gemini proxy prevents key exposure and enforces structured Big-O & security audits.",
      storyAngle: "Browser LLM calls leak API keys and return messy markdown; an Express proxy with strict JSON review schemas kept audits fast and structured.",
      experience: {
        id: "exp_07_ai_code_reviewer",
        title: "AI Code Review Assistant",
        category: "Full Stack Engineering",
        description: "Built automated pair-programming assistant using a rate-limited Express proxy, Google Gemini Flash, and interactive React diff viewer.",
        technologiesUsed: ["React.js", "Node.js", "Express.js", "Gemini API", "Tailwind CSS"],
        challengesFaced: ["Direct client inference exposed API keys and free-form LLM text broke side-by-side code diff rendering."],
        solutionApproach: "Secured inference behind a rate-limited Express backend and structured Gemini prompts for security, leak, and Big-O output.",
        tradeoffs: ["Strict JSON response validation requires graceful fallback handling on malformed user code snippets."],
        keyLessons: ["Proxy all LLM calls server-side and bind responses to typed JSON contracts before rendering UI diffs."],
        metricsOrOutcome: "Sub-2.5s AST and security code analysis with interactive React diff viewer.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_real_streamify_webrtc",
      title: "Designing Low-Latency WebRTC Video Rooms with Socket.IO Signaling in MERN",
      category: "Full Stack Engineering",
      framework: "WebRTC",
      supportingTech: ["React.js", "Node.js", "MongoDB", "WebRTC", "Socket.IO"],
      keywords: ["WebRTC", "Socket.IO", "MERN Stack", "Real-Time", "MongoDB"],
      audience: "Full Stack Developers, Startup Founders, Technical Recruiters",
      reasoning: "Practical lessons from Streamify: handling offer/answer handshakes, STUN/TURN traversal, and room state sync under 100ms.",
      storyAngle: "Real-time video breaks when signaling races with peer connections; isolating offer/answer state in Socket.IO stabilized P2P WebRTC rooms.",
      experience: {
        id: "exp_08_streamify_webrtc",
        title: "Streamify — Real-Time Video & Voice Collaboration Platform",
        category: "Full Stack Engineering",
        description: "Built MERN video, voice, and encrypted chat platform using WebRTC P2P mesh and Socket.IO STUN/TURN signaling.",
        technologiesUsed: ["React.js", "Node.js", "MongoDB", "WebRTC", "Socket.IO"],
        challengesFaced: ["Multi-participant rooms experienced ICE candidate race conditions and NAT drops across mobile/office networks."],
        solutionApproach: "Engineered deterministic Socket.IO signaling handlers with STUN/TURN fallback and dynamic React grid state.",
        tradeoffs: ["P2P WebRTC mesh eliminates server media transcoding cost while bounding max concurrent room participants."],
        keyLessons: ["Keep Socket.IO focused on clean signaling state and let WebRTC carry encrypted peer media directly."],
        metricsOrOutcome: "Sub-100ms peer-to-peer media latency with encrypted chat and voice rooms.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_gh_mcp_agent_tools",
      title: "Standardizing Tool Calling Across AI Agent Swarms with Model Context Protocol (MCP)",
      category: "Agentic AI",
      framework: "MCP",
      supportingTech: ["TypeScript", "Node.js", "Agentic AI", "AI Agents", "MCP"],
      keywords: ["Model Context Protocol", "MCP", "AI Agents", "Agentic AI", "TypeScript"],
      audience: "AI Engineers, Full Stack Developers, Technical Recruiters",
      reasoning: "How Model Context Protocol provides a clean, decoupled JSON-RPC standard for agent tool integrations without custom SDK lock-in.",
      storyAngle: "Why custom API tool connectors broke agent workflows and how standardizing on MCP servers simplified tool integration.",
      experience: {
        id: "exp_05_brand_os_gateway",
        title: "Standardized Tool Calling & Multi-Provider AI Gateway (Brand OS)",
        category: "Agentic AI",
        description: "Built Brand OS 12-agent pipeline with standardized tool contracts, multi-provider AI failover, and quality validation gates.",
        technologiesUsed: ["TypeScript", "Node.js", "MCP", "Agentic AI"],
        challengesFaced: ["Every third-party tool API required a custom parser and schema wrapper that broke with prompt drift."],
        solutionApproach: "Standardized tool definitions on structured JSON-RPC schemas with strict parameter validation.",
        tradeoffs: ["Slightly higher local IPC validation overhead compared to direct in-memory calls."],
        keyLessons: ["Decoupling agent tool execution from the prompt runner prevents runtime schema hallucination."],
        metricsOrOutcome: "Zero-human scheduled publishing with automated multi-gate validation.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_gh_shadcn_component_primitives",
      title: "Why Copy-Paste UI Primitives Are Replacing Heavy Component Libraries in Modern React",
      category: "Frontend Engineering",
      framework: "React",
      supportingTech: ["React", "Tailwind CSS", "TypeScript", "Frontend Engineering"],
      keywords: ["Shadcn UI", "Tailwind CSS", "React Primitives", "Radix UI", "Frontend"],
      audience: "Frontend Engineers, Full Stack Developers, Technical Recruiters",
      reasoning: "Analysis of why headless component primitives with owned code (Shadcn UI model) outperform black-box NPM design system packages.",
      storyAngle: "Fighting third-party CSS specificity overrides slows UI teams down; owning lightweight React + Tailwind primitives gives total control.",
      experience: {
        id: "exp_02_neelan_react_rbac",
        title: "Modular React & Tailwind Component System",
        category: "Frontend Engineering",
        description: "Standardized reusable React and Tailwind component primitives across 10+ enterprise dashboard modules.",
        technologiesUsed: ["React", "Tailwind CSS", "TypeScript"],
        challengesFaced: ["Heavy third-party UI wrappers inflated bundle size and caused cascading re-renders across client views."],
        solutionApproach: "Adopted composable React primitives styled directly with Tailwind utility classes and normalized state slices.",
        tradeoffs: ["More local UI component files in the repo to maintain when upstream accessibility patterns update."],
        keyLessons: ["Owning lean component primitives removes CSS override hacks and keeps UI performance predictable."],
        metricsOrOutcome: "Cut component re-renders by 35% and improved initial load speed by 20%.",
        createdAt: new Date().toISOString(),
      },
    },
  ];

  public selectFallbackProjectTopic(history: HistoricalPostRecord[] = []): { topic: Topic; experience: ExperienceLog } | null {
    const now = Date.now();
    const candidateStats: Array<{
      candidate: FallbackProjectTopicCandidate;
      occurrences: number;
      lastPublishedDaysAgo: number;
      inCooldown: boolean;
    }> = [];

    for (const candidate of this.fallbackProjects) {
      const normCandTitle = candidate.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      const candKeywords = candidate.keywords.map((k) => k.toLowerCase());

      const matches = history.filter((h) => {
        const hTitle = (h.title || "").toLowerCase();
        const normHTitle = hTitle.replace(/[^a-z0-9]/g, "");

        // 1. Direct title match or containment
        if (normHTitle === normCandTitle || normHTitle.includes(normCandTitle) || normCandTitle.includes(normHTitle)) {
          return true;
        }

        // 2. ID match
        if (h.id === candidate.id || h.id.includes(candidate.id)) {
          return true;
        }

        // 3. Framework & multi-keyword match in past title
        const candFramework = candidate.framework.toLowerCase();
        const keywordMatches = candKeywords.filter((kw) => hTitle.includes(kw)).length;
        if (hTitle.includes(candFramework) && keywordMatches >= 2) {
          return true;
        }

        // 4. Supporting technology & problem space keyword overlap (5-day cooldown)
        const hasTechOverlap = candidate.supportingTech.some((tech) => {
          const t = tech.toLowerCase();
          return (h.framework && h.framework.toLowerCase() === t) ||
                 (h.category && h.category.toLowerCase().includes(t)) ||
                 hTitle.includes(t);
        });
        const hasProblemOverlap = candKeywords.some((kw) => {
          const k = kw.toLowerCase();
          return k.length >= 6 && hTitle.includes(k);
        });
        if (hasTechOverlap && hasProblemOverlap) {
          return true;
        }

        return false;
      });

      const occurrences = matches.length;
      let lastPublishedDaysAgo = 999;
      if (matches.length > 0) {
        const latestTime = Math.max(...matches.map((m) => new Date(m.publishedAt || Date.now()).getTime()));
        lastPublishedDaysAgo = Math.max(0, (now - latestTime) / (1000 * 60 * 60 * 24));
      }

      // 14-day cooldown for repeating any fallback project
      const inCooldown = occurrences > 0 && lastPublishedDaysAgo < 14.0;

      candidateStats.push({
        candidate,
        occurrences,
        lastPublishedDaysAgo,
        inCooldown,
      });
    }

    // Filter to candidates not in active cooldown
    const available = candidateStats.filter((c) => !c.inCooldown);

    if (available.length === 0) {
      console.warn("[FallbackProjectEngine] All fallback developer projects are currently in 14-day cooldown.");
      return null;
    }

    // Pick candidate with fewest occurrences, or oldest publication
    available.sort((a, b) => {
      if (a.occurrences !== b.occurrences) {
        return a.occurrences - b.occurrences;
      }
      return b.lastPublishedDaysAgo - a.lastPublishedDaysAgo;
    });

    const bestCandidate = available[0].candidate;

    // Resolve real GitHub URL for each portfolio / open-source project
    const repoUrlMap: Record<string, string> = {
      proj_real_taskflow_saas: "https://github.com/dineshkumar-mb/taskflow-frontend",
      proj_real_financial_rag: "https://github.com/dineshkumar-mb/emi-frontend-platform",
      proj_real_mock_interview_voice: "https://github.com/dineshkumar-mb/ai-mock-interview-app-F",
      proj_real_career_os_kernel: "https://github.com/dineshkumar-mb/carrier-os-client",
      proj_real_ai_code_reviewer: "https://github.com/dineshkumar-mb/code-ReviewFrontend",
      proj_real_streamify_webrtc: "https://github.com/dineshkumar-mb/Streamify-frontend",
      proj_gh_mcp_agent_tools: "https://github.com/modelcontextprotocol/servers",
      proj_gh_shadcn_component_primitives: "https://github.com/shadcn-ui/ui",
    };
    const ghUrl = repoUrlMap[bestCandidate.id] || "https://dineshkumar-mb-portfolio.vercel.app/";

    const topic: Topic = {
      id: bestCandidate.id,
      title: bestCandidate.title,
      category: bestCandidate.category,
      framework: bestCandidate.framework,
      supportingTech: bestCandidate.supportingTech,
      score: 95,
      reason: bestCandidate.reasoning,
      trend_velocity: 85,
      difficulty: "ADVANCED",
      competition: "MEDIUM",
      audience: bestCandidate.audience,
      keywords: bestCandidate.keywords,
      references: [ghUrl],
      storyAngle: bestCandidate.storyAngle,
    };

    return {
      topic,
      experience: bestCandidate.experience,
    };
  }
}

export const fallbackProjectEngine = new FallbackProjectEngine();

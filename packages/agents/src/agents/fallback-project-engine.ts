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
      id: "proj_01_brand_os_swarm",
      title: "Building Personal Brand OS: Architectural Lessons from a 5-Layer Autonomous Multi-Agent Swarm with 10 Quality Gates",
      category: "AI Engineering & Multi-Agent Swarms",
      framework: "Multi-Agent Architecture",
      supportingTech: ["TypeScript", "Node.js", "Prisma", "PostgreSQL", "Redis", "LLM Gateway", "Telegram Bot API"],
      keywords: ["Multi-Agent Swarm", "Personal Brand OS", "AI Engineering", "Quality Gates", "TypeScript"],
      audience: "AI Engineers, Full-Stack Developers, Engineering Managers",
      reasoning: "Deep-dive into building autonomous multi-agent content pipelines with zero human intervention and automated status notifications.",
      storyAngle: "How I designed a multi-agent AI system that evaluates trend candidates, runs fact-checking, and auto-publishes with quality fallback protection.",
      experience: {
        id: "exp_brand_os_swarm",
        title: "Personal Brand OS 5-Layer Multi-Agent Swarm Architecture",
        category: "AI Engineering & Multi-Agent Swarms",
        description: "Built end-to-end multi-agent orchestration pipeline with 10 strict quality gates, Redis idempotency, and automated status alerts.",
        technologiesUsed: ["TypeScript", "Node.js", "Prisma", "PostgreSQL", "Redis", "Telegram API"],
        challengesFaced: ["LLM outputs vary in quality and require automated fact-checking, brand alignment, and fallback triggers."],
        solutionApproach: "Implemented 5-layer agent competition with candidate evaluation matrices and automatic active project fallbacks.",
        tradeoffs: ["Extra evaluation latency (12s per swarm run) in exchange for zero low-quality or hallucinated posts."],
        keyLessons: ["Autonomous agent systems must have deterministic fallback paths and strict quality gates before posting."],
        metricsOrOutcome: "100% automated post verification, 0 hallucinated posts published, real-time Telegram status alerting.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_02_llm_gateway",
      title: "Architecting a Resilient Multi-Provider LLM Gateway: Dynamic Rate-Limiting, Failover Routing, and Cost Optimization",
      category: "AI Infrastructure & Gateway Routing",
      framework: "LLM Gateway Router",
      supportingTech: ["OpenAI", "Anthropic", "Gemini", "TypeScript", "Redis", "OpenRouter"],
      keywords: ["LLM Gateway", "AI Infrastructure", "Rate Limiting", "Provider Failover", "Cost Optimization"],
      audience: "Backend Engineers, AI Architects, Infrastructure Engineers",
      reasoning: "Practical engineering setup for handling 429 rate limits, provider outages, and token cost optimization across OpenAI, Anthropic, and Gemini.",
      storyAngle: "Why single-provider LLM setups fail in production and how to build a multi-provider fallback gateway with token-bucket rate limiting.",
      experience: {
        id: "exp_llm_gateway",
        title: "Multi-Provider AI Gateway & Unified LLM Fallback Router",
        category: "AI Infrastructure & Gateway Routing",
        description: "Built unified LLM gateway router supporting OpenAI, Anthropic, and Gemini with cost-optimized routing and dynamic failovers.",
        technologiesUsed: ["OpenAI", "Anthropic", "Gemini", "TypeScript", "Redis"],
        challengesFaced: ["Upstream provider rate limits (429) caused complete pipeline stalls during peak hours."],
        solutionApproach: "Implemented dynamic token bucket rate limiting with automatic model failover and cost-optimized routing.",
        tradeoffs: ["Occasional 250ms latency penalty during fallback model switching under burst load."],
        keyLessons: ["Single-provider LLM applications are fragile; decoupled gateway routing is essential for high availability."],
        metricsOrOutcome: "Pipeline execution reliability increased to 99.94%, API cost reduced by 34%.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_03_worker_queue_idempotency",
      title: "Zero Duplicate Side Effects: Implementing Atomic Redis Deduplication & Retries for Distributed Background Worker Queues",
      category: "System Design & Distributed Queues",
      framework: "Distributed Systems",
      supportingTech: ["Redis", "BullMQ", "TypeScript", "PostgreSQL", "Node.js"],
      keywords: ["Distributed Queues", "Redis Idempotency", "System Design", "Node.js", "Background Processing"],
      audience: "Senior Systems Engineers, Backend Leads, DevOps Engineers",
      reasoning: "Concrete guide to eliminating duplicate background executions and side-effects during network timeouts using atomic Redis locks.",
      storyAngle: "How network timeouts caused duplicate API triggers in our background workers and how atomic Redis deduplication solved it completely.",
      experience: {
        id: "exp_worker_queue_dedup",
        title: "Distributed Worker Queue Idempotency & Retry State",
        category: "System Design & Distributed Queues",
        description: "Refactored event processing pipeline for multi-tenant worker swarm under burst traffic.",
        technologiesUsed: ["Redis", "TypeScript", "BullMQ", "Node.js"],
        challengesFaced: ["Workers were executing duplicate background jobs during network timeouts."],
        solutionApproach: "Introduced deterministic job IDs with Redis atomic set-if-not-exists locks and retry exponential backoff state.",
        tradeoffs: ["Added 4ms Redis RTT latency overhead per job in exchange for zero duplicate execution."],
        keyLessons: ["Retries without idempotency keys in distributed queues will cause duplicate side effects."],
        metricsOrOutcome: "Duplicate job execution dropped to 0%, queue throughput increased by 42%.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_04_monorepo_cicd",
      title: "Scaling Monorepo CI/CD Build Times: TypeScript Project References, Incremental Caching, and Hardened OCI Containers",
      category: "Full-Stack Software Architecture & DevOps",
      framework: "DevOps & Monorepo",
      supportingTech: ["TypeScript", "pnpm", "Turborepo", "Docker", "GitHub Actions"],
      keywords: ["TypeScript Monorepo", "CI/CD Pipeline", "Docker Hardening", "Turborepo", "DevOps"],
      audience: "Full Stack Engineers, DevOps Engineers, Technical Leads",
      reasoning: "Proven techniques for shrinking CI pipeline execution times and securing multi-package TypeScript applications.",
      storyAngle: "Slashing monorepo CI build times from 8.5 minutes to 1.8 minutes using TypeScript Project References and Docker Buildx.",
      experience: {
        id: "exp_monorepo_cicd",
        title: "TypeScript Monorepo Build Latency & Container Hardening",
        category: "Full-Stack Software Architecture & DevOps",
        description: "Migrated enterprise monorepo with 12 subpackages to Project References and distroless Docker multi-arch images.",
        technologiesUsed: ["TypeScript", "pnpm", "Turborepo", "Docker"],
        challengesFaced: ["Type checking full monorepo on CI took 8.5 minutes per pull request."],
        solutionApproach: "Configured composite project references with incremental declaration map emission and distroless base images.",
        tradeoffs: ["Required explicit package tsconfig references maintainability overhead."],
        keyLessons: ["Project references allow skipping unchanged subpackages during CI type checking."],
        metricsOrOutcome: "CI type check time reduced from 8.5 minutes to 1.8 minutes (78% speedup).",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_05_autonomous_publishing",
      title: "Zero-Downtime Autonomous Publishing: Managing OAuth Tokens, Rate Limits, and Real-Time Telegram Alerting",
      category: "Production Engineering & Observability",
      framework: "Production Monitoring",
      supportingTech: ["LinkedIn API", "Dev.to API", "Telegram Bot API", "TypeScript", "Docker"],
      keywords: ["Autonomous Publishing", "Telegram Bot", "OAuth Tokens", "Production Observability", "TypeScript"],
      audience: "Software Engineers, System Architects, Automation Engineers",
      reasoning: "Practical architectural blueprint for building automated multi-platform publishers with real-time health notifications.",
      storyAngle: "Lessons learned building an automated social publishing engine with real-time Telegram status updates and self-healing error recovery.",
      experience: {
        id: "exp_autonomous_publishing",
        title: "Autonomous Multi-Platform Publisher & Telegram Alerting System",
        category: "Production Engineering & Observability",
        description: "Built automated social publishing system with real-time Telegram status alerts and dead letter queue error logging.",
        technologiesUsed: ["LinkedIn API", "Dev.to API", "Telegram Bot API", "TypeScript"],
        challengesFaced: ["Platform API token expirations and network glitches could break automated publication silently."],
        solutionApproach: "Integrated automated token validation, retry backoffs, and instant Telegram chat alerts on success or error.",
        tradeoffs: ["Requires secret rotation management for long-lived OAuth tokens."],
        keyLessons: ["Never run background automation without real-time alert channels and dead letter queues for failed requests."],
        metricsOrOutcome: "100% notification delivery for pipeline status, zero silent publication failures.",
        createdAt: new Date().toISOString(),
      },
    }
  ];

  public selectFallbackProjectTopic(history: HistoricalPostRecord[] = []): { topic: Topic; experience: ExperienceLog } {
    let bestCandidate = this.fallbackProjects[0];
    let minOccurrences = 999;
    let maxDaysAgo = -1;

    const now = Date.now();

    for (const candidate of this.fallbackProjects) {
      const matches = history.filter((h) => {
        const hTitle = (h.title || "").toLowerCase();
        const candFramework = candidate.framework.toLowerCase();
        return hTitle.includes(candFramework) || 
               candidate.keywords.some((kw) => hTitle.includes(kw.toLowerCase()));
      });

      const occurrences = matches.length;

      let lastPublishedDaysAgo = 999;
      if (matches.length > 0) {
        const latestTime = Math.max(...matches.map((m) => new Date(m.publishedAt || Date.now()).getTime()));
        lastPublishedDaysAgo = Math.floor((now - latestTime) / (1000 * 60 * 60 * 24));
      }

      if (occurrences < minOccurrences || (occurrences === minOccurrences && lastPublishedDaysAgo > maxDaysAgo)) {
        minOccurrences = occurrences;
        maxDaysAgo = lastPublishedDaysAgo;
        bestCandidate = candidate;
      }
    }

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
      references: [
        "Personal Brand OS Multi-Agent Architecture Docs",
        "Production AI Infrastructure & Multi-Provider LLM Router",
      ],
      storyAngle: bestCandidate.storyAngle,
    };

    return {
      topic,
      experience: bestCandidate.experience,
    };
  }
}

export const fallbackProjectEngine = new FallbackProjectEngine();

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
      id: "proj_gh_nextjs_server_actions",
      title: "Eliminating Form Mutation Boilerplate with Next.js 15 Server Actions and React 19 Compiler",
      category: "Full Stack Engineering",
      framework: "Next.js",
      supportingTech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Full Stack"],
      keywords: ["Next.js 15", "React 19", "Server Actions", "React Compiler", "Frontend Engineering"],
      audience: "Full Stack Developers, Technical Leads, Engineering Managers",
      reasoning: "Practical engineering guide to replacing complex client state management with zero-boilerplate Server Actions in Next.js 15.",
      storyAngle: "How refactoring legacy forms to React 19 Server Actions eliminated 400 lines of reducer boilerplate and sped up form submissions.",
      experience: {
        id: "exp_nextjs_server_actions",
        title: "Full Stack React 19 & Next.js 15 Migration",
        category: "Full Stack Engineering",
        description: "Migrated complex enterprise dashboard forms to React 19 Server Actions and optimistic updates.",
        technologiesUsed: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        challengesFaced: ["Client-side form state and manual mutation hooks introduced synchronization bugs and bundle bloat."],
        solutionApproach: "Adopted React 19 async Server Actions with useOptimistic hook for instant feedback and zero client boilerplate.",
        tradeoffs: ["Required strict error boundary modeling for partial network failures during server action invocations."],
        keyLessons: ["Server Actions shift validation back to the server boundary without degrading client perceived performance."],
        metricsOrOutcome: "Reduced client bundle by 24KB per route, cut form development time by 50%.",
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
      audience: "AI Engineers, Full Stack Developers, Software Architects",
      reasoning: "How Model Context Protocol provides a clean, decoupled JSON-RPC standard for agent tool integrations without custom SDK lock-in.",
      storyAngle: "Why bespoke API tool connectors broke our agent pipeline and how standardizing on MCP reference servers simplified tool registration.",
      experience: {
        id: "exp_mcp_agent_tools",
        title: "Standardized Tool Integration via Model Context Protocol",
        category: "Agentic AI",
        description: "Built modular MCP servers enabling unified tool access across autonomous agent swarms.",
        technologiesUsed: ["TypeScript", "Node.js", "MCP", "Agentic AI"],
        challengesFaced: ["Every third-party tool API required a custom parser and schema wrapper that broke with prompt drift."],
        solutionApproach: "Standardized tool definitions on MCP JSON-RPC schemas with dynamic discovery and strict parameter validation.",
        tradeoffs: ["Slightly higher local IPC latency (8ms) compared to direct in-memory function calling."],
        keyLessons: ["Decoupling agent tool execution from the prompt runner prevents runtime schema hallucination."],
        metricsOrOutcome: "Added 12 tools in 2 days with zero prompt adjustments; eliminated tool argument parsing errors.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_gh_langgraph_cyclic_agents",
      title: "Why Cyclic State Graphs Outperform Naive Linear Chains in Multi-Agent Workflows",
      category: "Agentic AI",
      framework: "LangGraph",
      supportingTech: ["TypeScript", "Agentic AI", "AI Agents", "State Graphs", "Python"],
      keywords: ["LangGraph", "Multi-Agent", "State Graphs", "Agentic AI", "TypeScript"],
      audience: "AI Engineers, Backend Architects, Engineering Leads",
      reasoning: "Architectural comparison of linear DAG agent chains versus cyclic state graphs for self-correcting autonomous workflows.",
      storyAngle: "Linear agent chains failed whenever a step needed a retry or critique. Switching to cyclic state graphs with checkpointing solved it.",
      experience: {
        id: "exp_langgraph_cyclic_agents",
        title: "Cyclic Multi-Agent State Machine Architecture",
        category: "Agentic AI",
        description: "Refactored content evaluation pipeline into a cyclic state graph with verification loops and checkpointed rollback.",
        technologiesUsed: ["TypeScript", "LangGraph", "Agentic AI", "Node.js"],
        challengesFaced: ["Linear agent pipelines could not backtrack or self-correct when quality review failed."],
        solutionApproach: "Implemented cyclic graph with decision gates, conditional routing edges, and persistent state checkpoints.",
        tradeoffs: ["Requires graph loop guards to prevent infinite execution cycles under ambiguous input."],
        keyLessons: ["Production agents need state graphs with deterministic termination conditions, not unconstrained open loops."],
        metricsOrOutcome: "Self-correction recovery rate increased from 18% to 92% across edge cases.",
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
      audience: "Frontend Engineers, Full Stack Developers, UI Designers",
      reasoning: "Analysis of why headless component primitives with owned code (Shadcn UI model) outperform black-box NPM design system packages.",
      storyAngle: "We spent weeks fighting third-party NPM component overrides. Switching to copy-paste primitives with Tailwind gave us total design control.",
      experience: {
        id: "exp_shadcn_component_primitives",
        title: "Design System Architecture with Owned Primitives",
        category: "Frontend Engineering",
        description: "Architected modern SaaS design system using accessible primitives and utility-first styling.",
        technologiesUsed: ["React", "Tailwind CSS", "TypeScript"],
        challengesFaced: ["Monolithic component libraries locked UI customization behind fragile CSS specificity overrides."],
        solutionApproach: "Adopted accessible Radix primitives copied directly into the project with Tailwind CSS variants.",
        tradeoffs: ["More code in the repository to maintain when upstream accessibility updates are released."],
        keyLessons: ["Owning your component code eliminates library abstraction leaks and makes custom interactions trivial."],
        metricsOrOutcome: "Reduced CSS bundle size by 62%, eliminated all styling specificity conflicts.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_gh_hono_fast_apis",
      title: "Building Fast, Lightweight APIs with Hono: Type-Safe Routing Across Node.js and Edge Runtimes",
      category: "Backend Engineering",
      framework: "Node.js",
      supportingTech: ["Node.js", "TypeScript", "Backend Engineering", "REST API", "Full Stack"],
      keywords: ["Hono", "Node.js", "API Design", "TypeScript", "Backend Engineering"],
      audience: "Backend Engineers, Full Stack Developers, Cloud Architects",
      reasoning: "How modern web standards-based frameworks like Hono deliver sub-millisecond API response times with end-to-end RPC type inference.",
      storyAngle: "Moving API routes from bulky Express setups to lightweight Hono handlers reduced cold-start latency from 220ms to under 15ms.",
      experience: {
        id: "exp_hono_fast_apis",
        title: "High-Throughput API Gateway with Modern Web Standards",
        category: "Backend Engineering",
        description: "Designed ultra-low latency microservices using lightweight standards-compliant routing and RPC client types.",
        technologiesUsed: ["Node.js", "TypeScript", "Hono", "REST API"],
        challengesFaced: ["Legacy frameworks had heavy dependency overhead and slow cold starts on serverless environments."],
        solutionApproach: "Rebuilt endpoints using Hono with schema validation and automatic TypeScript client generation.",
        tradeoffs: ["Fewer legacy Express middleware packages compatible without adapters."],
        keyLessons: ["Web standards APIs (Fetch, Request, Response) allow backend code to run portably across Node.js, Bun, and Edge."],
        metricsOrOutcome: "Cold starts dropped from 220ms to 12ms, throughput improved by 3.4x.",
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "proj_gh_prisma_database_layer",
      title: "End-to-End Type Safety in Database Layers: Managing Schema Evolution and Connection Pooling with Prisma",
      category: "Full Stack Engineering",
      framework: "Node.js",
      supportingTech: ["TypeScript", "Node.js", "Prisma", "PostgreSQL", "Full Stack", "Databases"],
      keywords: ["Prisma", "TypeScript", "PostgreSQL", "Database Optimization", "Full Stack"],
      audience: "Full Stack Developers, Database Engineers, Technical Leads",
      reasoning: "Practical techniques for preventing database connection pool exhaustion and ensuring end-to-end type safety in Node.js applications.",
      storyAngle: "How connection pool starvation brought down our API during traffic bursts and how tuning Prisma client pools stabilized it.",
      experience: {
        id: "exp_prisma_database_layer",
        title: "Database Access Layer & Connection Optimization",
        category: "Full Stack Engineering",
        description: "Engineered scalable data access layer with type-safe queries, migration pipelines, and connection pooling.",
        technologiesUsed: ["TypeScript", "Node.js", "Prisma", "PostgreSQL"],
        challengesFaced: ["Concurrent background worker queries exhausted available PostgreSQL connection pools."],
        solutionApproach: "Configured explicit connection pooling limits, batching queries with transaction timeouts.",
        tradeoffs: ["Strict type generation requires running codegen steps on schema changes."],
        keyLessons: ["ORMs make writing queries easy, but connection lifecycle and index strategy remain critical for production scale."],
        metricsOrOutcome: "Zero pool exhaustion incidents under 10x traffic spikes, P99 query latency decreased by 40%.",
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

    // Resolve GitHub URL for the fallback candidate
    const repoUrlMap: Record<string, string> = {
      proj_gh_nextjs_server_actions: "https://github.com/vercel/next.js",
      proj_gh_mcp_agent_tools: "https://github.com/modelcontextprotocol/servers",
      proj_gh_langgraph_cyclic_agents: "https://github.com/langchain-ai/langgraph",
      proj_gh_shadcn_component_primitives: "https://github.com/shadcn-ui/ui",
      proj_gh_hono_fast_apis: "https://github.com/honojs/hono",
      proj_gh_prisma_database_layer: "https://github.com/prisma/prisma",
    };
    const ghUrl = repoUrlMap[bestCandidate.id] || "https://github.com/trending";

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

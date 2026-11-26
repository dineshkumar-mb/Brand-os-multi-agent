import { ExperienceEvidence } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export class ExperienceMatcherEngine {
  public matchExperience(event: CanonicalEvent): {
    matchPercentage: number;
    evidence: ExperienceEvidence[];
  } {
    const textToMatch = `${event.title} ${event.summary} ${event.tags.join(" ")}`.toLowerCase();

    // Real engineering experience & shipped portfolio projects from https://dineshkumar-mb-portfolio.vercel.app/
    // Positioning: Full Stack Developer | MERN Stack | React | Node.js | AI Integration | Agentic AI
    const userExperiences = [
      {
        id: "exp_innoide_real",
        title: "InnoIDE Industrial Automation & Virtual Sensor Simulation (Innotrat Labs)",
        tech: ["React", "React.js", "TypeScript", "Redux Toolkit", "Node.js", "WebSockets", "React Flow", "Full Stack"],
        description: "Owned frontend architecture and virtual sensor simulation at Innotrat Labs for 50+ engineers, cutting validation from hours to minutes.",
      },
      {
        id: "exp_neelan_real",
        title: "Enterprise React, TypeScript & Express RBAC Modules (Neelan Oxysoft)",
        tech: ["React", "React.js", "TypeScript", "Node.js", "Express", "Tailwind CSS", "REST API", "MERN Stack", "Frontend Engineering"],
        description: "Delivered 10+ production modules integrating Node.js/Express JWT RBAC and Redux Toolkit, cutting re-renders by 35%.",
      },
      {
        id: "exp_taskflow_real",
        title: "TaskFlow Multi-Tenant SaaS with MongoDB, Redis/BullMQ & OpenAI",
        tech: ["React", "Node.js", "MongoDB", "MERN Stack", "Redis", "BullMQ", "OpenAI", "Backend Engineering"],
        description: "Built multi-tenant sprint SaaS with MongoDB tenant isolation, Cashfree recurring webhooks, Redis/BullMQ queues, and AI ticket extraction.",
      },
      {
        id: "exp_rag_emi_real",
        title: "AI Financial Assistant — OCR + ChromaDB RAG + Gemini AI",
        tech: ["React", "Node.js", "MongoDB", "RAG", "ChromaDB", "LangChain", "Gemini", "Vector Search", "AI Agents"],
        description: "Engineered OCR document ingestion into ChromaDB vector store, coupling deterministic Node.js EMI math with Gemini RAG.",
      },
      {
        id: "exp_swarms_real",
        title: "Career OS (17-Agent Kernel) & Brand OS (12-Agent Swarm)",
        tech: ["TypeScript", "Node.js", "React", "Express", "Prisma", "Socket.io", "Agentic AI", "AI Agents", "MCP", "LangGraph", "LLM", "Docker"],
        description: "Built autonomous multi-agent platforms with Socket.io live traces, multi-provider AI gateway failover, quality gates, and CI/CD.",
      },
      {
        id: "exp_streamify_review_real",
        title: "Streamify (WebRTC/Socket.IO), AI Code Reviewer & Mock Interview App",
        tech: ["React", "Node.js", "MongoDB", "Express", "WebRTC", "Socket.io", "Gemini", "Tailwind CSS", "Full Stack"],
        description: "Engineered P2P WebRTC video rooms (sub-100ms latency), sub-2.5s Express proxy Gemini code audits, and Web Speech API interview scoring.",
      },
    ];

    const matchedEvidence: ExperienceEvidence[] = [];

    for (const exp of userExperiences) {
      let score = 0;
      const expText = `${exp.title} ${exp.tech.join(" ")} ${exp.description}`.toLowerCase();

      for (const tag of event.tags) {
        if (expText.includes(tag.toLowerCase())) {
          score += 20;
        }
      }

      if (score > 0) {
        matchedEvidence.push({
          experienceId: exp.id,
          title: exp.title,
          relevanceScore: Math.min(100, score),
          overlapDescription: exp.description,
          technologiesUsed: exp.tech,
        });
      }
    }

    matchedEvidence.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topScore = matchedEvidence.length > 0 ? Math.max(30, matchedEvidence[0].relevanceScore) : 30;

    return {
      matchPercentage: topScore,
      evidence: matchedEvidence,
    };
  }

  public findMatchingExperience(category: string, title: string, tags: string[] = []): { found: boolean; matchScore: number } {
    const textToMatch = `${title} ${category} ${tags.join(" ")}`.toLowerCase();
    const eventMatch = this.matchExperience({ title, summary: category, tags } as any);
    const matchScore = eventMatch.matchPercentage / 100;
    return {
      found: eventMatch.evidence.length > 0,
      matchScore,
    };
  }
}

export const experienceMatcherEngine = new ExperienceMatcherEngine();
export const experienceMatcher = experienceMatcherEngine;



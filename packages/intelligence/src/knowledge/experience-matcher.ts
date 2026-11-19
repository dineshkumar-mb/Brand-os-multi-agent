import { ExperienceEvidence } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export class ExperienceMatcherEngine {
  public matchExperience(event: CanonicalEvent): {
    matchPercentage: number;
    evidence: ExperienceEvidence[];
  } {
    const textToMatch = `${event.title} ${event.summary} ${event.tags.join(" ")}`.toLowerCase();

    // Diversified user project experience inventory aligned with:
    // Full Stack Developer | MERN Stack | React | Node.js | AI Integration | Agentic AI
    const userExperiences = [
      {
        id: "exp_1",
        title: "Built Autonomous Multi-Agent Systems & Tool Integrations",
        tech: ["TypeScript", "Node.js", "Agentic AI", "AI Agents", "MCP", "LangGraph", "LLM", "OpenAI", "Anthropic", "Docker"],
        description: "Implemented multi-agent orchestration, tool schemas (MCP), quality decision gates, and event-driven architecture.",
      },
      {
        id: "exp_2",
        title: "High-Throughput Node.js & MERN Backend Microservices",
        tech: ["Node.js", "Express", "MERN Stack", "Backend Engineering", "REST API", "Docker", "MongoDB", "PostgreSQL", "Performance"],
        description: "Built asynchronous queue pipelines managing rate limits, atomic locks, exponential backoffs, and memory bounds.",
      },
      {
        id: "exp_3",
        title: "Enterprise Full-Stack React & Next.js Web Applications",
        tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "MERN Stack", "Full Stack", "Frontend Engineering", "Vite"],
        description: "Refactored UI component hierarchies and async server actions for zero-boilerplate state updates.",
      },
      {
        id: "exp_4",
        title: "Containerized Microservice Hardening & CI/CD Automation",
        tech: ["Docker", "Kubernetes", "Security", "CI/CD", "GitHub Actions", "Developer Tools"],
        description: "Enforced vulnerability scanning, rootless container execution, and automated deployment pipelines.",
      },
      {
        id: "exp_5",
        title: "Data Access Layers, ORMs & RAG Vector Architectures",
        tech: ["TypeScript", "Node.js", "Prisma", "Databases", "MongoDB", "PostgreSQL", "RAG", "Vector Search", "Full Stack"],
        description: "Designed type-safe database schemas, connection pooling, and semantic retrieval pipelines.",
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



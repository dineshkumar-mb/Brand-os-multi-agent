import { ExperienceEvidence } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export class ExperienceMatcherEngine {
  public matchExperience(event: CanonicalEvent): {
    matchPercentage: number;
    evidence: ExperienceEvidence[];
  } {
    const textToMatch = `${event.title} ${event.summary} ${event.tags.join(" ")}`.toLowerCase();

    // Default mock user experience inventory if DB log not present
    const userExperiences = [
      {
        id: "exp_1",
        title: "Built Multi-Agent AI Gateway with Model Context Protocol & Failover",
        tech: ["MCP", "TypeScript", "Node.js", "OpenAI", "Anthropic", "Redis"],
        description: "Implemented standard tool calling contract and multi-provider failover routing.",
      },
      {
        id: "exp_2",
        title: "Decoupled Event-Driven Microservices with Redis Streams & BullMQ",
        tech: ["Redis", "BullMQ", "Node.js", "Docker", "PostgreSQL"],
        description: "Built asynchronous queue processing pipeline managing rate limits and retry exponential backoffs.",
      },
      {
        id: "exp_3",
        title: "React 19 SaaS Migration with Server Actions & Vite",
        tech: ["React 19", "Next.js", "TypeScript", "Vite", "TailwindCSS"],
        description: "Refactored legacy form handling to React 19 Server Actions reducing bundle size by 35%.",
      },
    ];

    const matchedEvidence: ExperienceEvidence[] = [];

    for (const exp of userExperiences) {
      let score = 0;
      const expText = `${exp.title} ${exp.tech.join(" ")} ${exp.description}`.toLowerCase();

      for (const tag of event.tags) {
        if (expText.includes(tag.toLowerCase())) {
          score += 25;
        }
      }

      if (textToMatch.includes("mcp") && expText.includes("mcp")) score += 40;
      if (textToMatch.includes("redis") && expText.includes("redis")) score += 40;
      if (textToMatch.includes("react") && expText.includes("react")) score += 40;

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
    const topScore = matchedEvidence.length > 0 ? matchedEvidence[0].relevanceScore : 20;

    return {
      matchPercentage: topScore,
      evidence: matchedEvidence,
    };
  }
}

export const experienceMatcherEngine = new ExperienceMatcherEngine();

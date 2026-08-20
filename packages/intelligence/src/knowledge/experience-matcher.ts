import { ExperienceEvidence } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export class ExperienceMatcherEngine {
  public matchExperience(event: CanonicalEvent): {
    matchPercentage: number;
    evidence: ExperienceEvidence[];
  } {
    const textToMatch = `${event.title} ${event.summary} ${event.tags.join(" ")}`.toLowerCase();

    // Diversified user project experience inventory across full-stack AI & systems engineering
    const userExperiences = [
      {
        id: "exp_1",
        title: "Built Autonomous Multi-Agent Personal Brand OS",
        tech: ["TypeScript", "Node.js", "OpenAI", "Anthropic", "PostgreSQL", "Docker"],
        description: "Implemented multi-agent orchestration, quality decision gates, and event-driven architecture.",
      },
      {
        id: "exp_2",
        title: "High-Throughput Microservice Distributed Rate Limiting & Queue Processing",
        tech: ["Node.js", "Docker", "PostgreSQL", "System Design", "Performance"],
        description: "Built asynchronous queue pipeline managing rate limits, exponential backoffs, and memory bounds.",
      },
      {
        id: "exp_3",
        title: "Enterprise SaaS Full Stack Refactoring & Compiler Optimization",
        tech: ["React", "TypeScript", "Vite", "Next.js", "TailwindCSS"],
        description: "Refactored legacy forms and state pipelines to modern async server actions reducing client bundle size.",
      },
      {
        id: "exp_4",
        title: "Containerized Microservice Hardening & CI/CD Pipeline Security",
        tech: ["Docker", "Kubernetes", "Security", "CI/CD", "GitHub Actions"],
        description: "Enforced vulnerability scanning, rootless container execution, and zero-trust mTLS authorization.",
      },
      {
        id: "exp_5",
        title: "Columnar Analytics & Real-Time Data Pipeline Architecture",
        tech: ["Databases", "System Design", "Analytics", "SQL", "Performance"],
        description: "Designed high-cardinality analytical aggregation queries with low-latency indexing strategies.",
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



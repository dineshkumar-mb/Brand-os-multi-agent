import { WhyCareContext } from "@brand-os/shared";
import { CanonicalEvent } from "../sources/types.js";

export class WhyCareAnalyzer {
  public analyzeWhyCare(event: CanonicalEvent): WhyCareContext {
    const titleLower = event.title.toLowerCase();

    if (titleLower.includes("mcp") || titleLower.includes("model context protocol")) {
      return {
        whatHappened: "Model Context Protocol (MCP) emerged as the standardized tool calling standard for AI Agent swarms.",
        whyItMatters: "Eliminates custom ad-hoc API integrations by establishing a uniform JSON-RPC client-server contract across tools, databases, and LLMs.",
        whoIsAffected: "AI Engineers, System Architects, Backend Developers, and Tech Leads.",
        whatChangedTechnically: "Standardized tool definition, resource subscription, and prompt templates without state drift.",
        whatCanDevelopersBuild: "Multi-agent automation swarms connecting local CLI tools, Postgres, GitHub, and LLMs.",
        isProductionReady: true,
        isWorthLearning: true,
        careerRelevanceExplanation: "High recruiter and engineering manager demand for scalable multi-agent infrastructure patterns.",
        personalBuildConnection: "Relates directly to personal experience building multi-agent AI routing and MCP tool clients.",
      };
    }

    if (titleLower.includes("deepseek") || titleLower.includes("r1")) {
      return {
        whatHappened: "DeepSeek open-sourced R1 reasoning models achieving top-tier benchmark performance.",
        whyItMatters: "Proves open-weight reinforcement learning can match proprietary closed models at a fraction of inference cost.",
        whoIsAffected: "AI Researchers, Infrastructure Engineers, CTOs, and Product Leaders.",
        whatChangedTechnically: "Pure RL training without supervised fine-tuning data, releasing open GGUF/Ollama weights.",
        whatCanDevelopersBuild: "Self-hosted private reasoning pipelines without API rate limits or recurring SaaS costs.",
        isProductionReady: true,
        isWorthLearning: true,
        careerRelevanceExplanation: "Demonstrates deep knowledge of cost-effective local AI deployment and model evaluation.",
        personalBuildConnection: "Connects with personal projects evaluating local Ollama inference and cost-optimized routing.",
      };
    }

    // Default fallback WhyCare context
    return {
      whatHappened: `Key industry development: ${event.title}.`,
      whyItMatters: "Shift in architecture or engineering practice affecting production web & AI systems.",
      whoIsAffected: "Full Stack Developers, System Leads, and Technical Founders.",
      whatChangedTechnically: "Updated SDK APIs, performance characteristics, or workflow abstractions.",
      whatCanDevelopersBuild: "Production-grade microservices, AI pipelines, and resilient web applications.",
      isProductionReady: event.confidenceScore >= 80,
      isWorthLearning: true,
      careerRelevanceExplanation: "Demonstrates proactive technical leadership and modern stack awareness.",
      personalBuildConnection: "Can be tied to past engineering projects in full-stack AI system design.",
    };
  }
}

export const whyCareAnalyzer = new WhyCareAnalyzer();

import { describe, it, expect } from "vitest";
import { contextDiversityAgent } from "../packages/agents/src/agents/context-diversity-agent";

describe("Context Diversity Agent & Concentration Penalty Tests", () => {
  it("should fail validation and trigger concentration penalty when too many citations belong to the same topic", () => {
    // 5 citations, 4 of which are "mcp" -> 80% concentration (which is > 60%)
    const concentratedCitations = [
      { title: "MCP Specification Basics" },
      { title: "Model Context Protocol for Agents" },
      { title: "Building an MCP Server in Python" },
      { title: "TypeScript MCP Library Overview" },
      { title: "System Design for databases" },
    ];

    const result = contextDiversityAgent.evaluateContextDiversity(concentratedCitations);
    expect(result.success).toBe(false);
    expect(result.data.passed).toBe(false);
    expect(result.data.diversityScore).toBeLessThan(70);
    expect(result.data.rejectionReason).toContain("CONTEXT_CONCENTRATION_REJECTED");
  });

  it("should pass validation when citations represent a diverse set of technologies", () => {
    // Diverse citations
    const diverseCitations = [
      { title: "Model Context Protocol (MCP) basics" },
      { title: "Optimizing PostgreSQL indexing schemas" },
      { title: "Vite 6 environment routing structures" },
      { title: "Docker multi-stage compilation profiles" },
      { title: "Redis pub/sub queueing strategies" },
    ];

    const result = contextDiversityAgent.evaluateContextDiversity(diverseCitations);
    expect(result.success).toBe(true);
    expect(result.data.passed).toBe(true);
    expect(result.data.diversityScore).toBeGreaterThanOrEqual(70);
  });
});

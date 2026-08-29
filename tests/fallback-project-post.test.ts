import { describe, it, expect } from "vitest";
import { agentOrchestrator } from "../packages/agents/src/index";
import { postHistoryTracker } from "../packages/analytics/src/index";
import { Platform } from "../packages/shared/src/index";

describe("Active Project Fallback Post Pipeline", () => {
  it("should generate a fallback post about user's active engineering project when all candidates are disqualified", async () => {
    postHistoryTracker.clearHistory?.();
    
    // Inject history that forces candidate competition engine to disqualify trend topics
    const generalTopics = [
      "Greatness Is Forged by Limitation",
      "Building Adversarial Red-Team Test Suites for LLM Prompt Injection Vulnerabilities",
      "Federating Multi-Environment Build Pipelines Without Full Server-Side Rendering Re-Architectures",
      "My AI Content Journey",
      "Architecting Resilient Multi-Provider LLM Gateway Routing with Cost-Optimized Fallback",
      "Docker Desktop 4.38", "Node.js 22 LTS", "Vite 6", "TypeScript 5.7",
      "Redis Streams for Multi-Agent Workflows", "DeepSeek R1 Model Release",
      "ClickHouse/ClickHouse", "Building Custom MCP Servers",
      "Architecting Enterprise LLM Gateways", "Zero-CVE Container Hardening",
      "Eliminating CI Compilation Bottlenecks", "V8 Memory Leak Profiling",
      "Topological Graph Solvers", "Transitive Dependency Auditing",
      "Designing a Reasoning Ledger Record",
      "Operationalizing Continuous Vulnerability Detection in Production Container Registries",
      "Executable Is a SQLite Database",
      "React 19 & Next.js 15 Server Actions with Zero-Boilerplate Compiler Optimization"
    ];

    generalTopics.forEach((t, i) => {
      postHistoryTracker.addPublishedPost({
        id: `p_sat_${i}`,
        title: t,
        platform: Platform.LINKEDIN,
        category: t,
        framework: t,
        supportingTech: [t],
        keywords: [t],
        hook: "...",
        fullText: `Details about ${t}`,
        publishedAt: new Date().toISOString(),
      });
    });

    const res = await agentOrchestrator.executePipeline({
      autoPublish: false,
      pipelineId: "test_fallback_project_run",
      historicalPosts: postHistoryTracker.getHistory(),
      allowFallbackProject: true,
    });

    expect(res.status).toBe("POST_READY");
    expect(res.topic).toBeDefined();
    expect(res.topic.title).toBeDefined();
    expect(res.linkedInPost).toBeDefined();
    expect(res.linkedInPost.fullText.length).toBeGreaterThan(100);
    expect(res.qualityGateResult?.passed).toBe(true);
  }, 60000);
});

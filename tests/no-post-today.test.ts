import { describe, it, expect } from "vitest";
import { agentOrchestrator } from "../packages/agents/src/index";
import { postHistoryTracker } from "../packages/analytics/src/index";
import { candidateCompetitionEngine } from "../packages/intelligence/src/index";
import { Platform } from "../packages/shared/src/index";

describe("NO_POST_TODAY Policy & Diagnostic Outputs", () => {
  it("should trigger NO_POST_TODAY when recent history has a semantic collision on all candidates", async () => {
    // Fill history with posts matching the current candidates so they all fail the novelty threshold
    postHistoryTracker.clearHistory?.();
    postHistoryTracker.addPublishedPost({
      id: "p_con",
      title: "Hardening Multi-Architecture Container Build Pipelines for Zero-CVE Production Images",
      platform: Platform.LINKEDIN,
      category: "AI Engineering",
      framework: "Docker",
      supportingTech: ["Docker"],
      keywords: ["Docker"],
      hook: "...",
      fullText: "Detailed container hardening process with Trivy CVE checks and distroless multi-stage builds.",
      publishedAt: new Date().toISOString(),
    });

    postHistoryTracker.addPublishedPost({
      id: "p_ts",
      title: "Eliminating CI Type-Check Bottlenecks in Large TypeScript Monorepos",
      platform: Platform.LINKEDIN,
      category: "AI Engineering",
      framework: "TypeScript",
      supportingTech: ["TypeScript"],
      keywords: ["TypeScript"],
      hook: "...",
      fullText: "Optimizing TypeScript project references for CI compilation cache times and build references.",
      publishedAt: new Date().toISOString(),
    });

    postHistoryTracker.addPublishedPost({
      id: "p_node",
      title: "Diagnosing V8 GC Pressure and Memory Leaks in Long-Running Node.js Services",
      platform: Platform.LINKEDIN,
      category: "AI Engineering",
      framework: "Node.js",
      supportingTech: ["Node.js"],
      keywords: ["Node.js"],
      hook: "...",
      fullText: "Tracing Node.js memory leaks using clinic.js and V8 heap snapshot diffs under sustained loads.",
      publishedAt: new Date().toISOString(),
    });

    postHistoryTracker.addPublishedPost({
      id: "p_dag",
      title: "Designing Deterministic Dependency Graph Engines for High-Concurrency Content Resolution",
      platform: Platform.LINKEDIN,
      category: "AI Engineering",
      framework: "System Design",
      supportingTech: ["System Design"],
      keywords: ["System Design"],
      hook: "...",
      fullText: "Using Kahn's algorithm for topological sorting of dependency graphs with cycle guards.",
      publishedAt: new Date().toISOString(),
    });

    postHistoryTracker.addPublishedPost({
      id: "p_rust",
      title: "Auditing Transitive Dependency Supply-Chain Risk in Production Rust Workloads",
      platform: Platform.LINKEDIN,
      category: "AI Engineering",
      framework: "Rust",
      supportingTech: ["Rust"],
      keywords: ["Rust"],
      hook: "...",
      fullText: "CI sandboxing and Cargo audit checking for transitive cargo dependency CVE exploits.",
      publishedAt: new Date().toISOString(),
    });

    // Also populate with all fallback candidates to ensure total topic saturation
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
      "React 19 & Next.js 15 Server Actions with Zero-Boilerplate Compiler Optimization",
      "The most useful part of Build Tools wasn't the headline feature. It was the failure handling..."
    ];

    generalTopics.forEach((t, i) => {
      postHistoryTracker.addPublishedPost({
        id: `p_gen_${i}`,
        title: t,
        platform: Platform.LINKEDIN,
        category: t,
        framework: t,
        supportingTech: [t, "Reasoning", "DeepSeek", "Security", "DevOps", "Database"],
        keywords: [t, "Reasoning", "Ledger", "DeepSeek"],
        hook: "...",
        fullText: `Details about ${t} with tradeoffs, reasoning ledger record, deepseek models, container vulnerability detection, sqlite database, and data metrics in production systems.`,
        publishedAt: new Date().toISOString(),
      });
    });

    // Dynamically collect current candidates and add them to history so total semantic collision occurs
    const compRes = await candidateCompetitionEngine.collectAndRankCandidates(postHistoryTracker.getHistory());
    compRes.allEvaluatedCandidates.forEach((cand, i) => {
      postHistoryTracker.addPublishedPost({
        id: `p_live_${i}`,
        title: cand.title,
        platform: Platform.LINKEDIN,
        category: cand.framework || "AI Engineering",
        framework: cand.framework || "Architecture",
        supportingTech: [cand.framework || "Architecture"],
        keywords: [cand.title],
        hook: "...",
        fullText: `Detailed analysis of ${cand.title} with architecture tradeoffs and code examples.`,
        publishedAt: new Date().toISOString(),
      });
    });

    const res = await agentOrchestrator.executePipeline({
      autoPublish: false,
      pipelineId: "no_post_test_novelty",
      historicalPosts: postHistoryTracker.getHistory(),
    });

    expect(res.status).toBe("NO_POST_TODAY");
    if (res.status === "NO_POST_TODAY") {
      expect(res.reason).toBeDefined();
      expect(res.candidatesEvaluated).toBeGreaterThan(0);
      expect(res.dailyIntelligenceSummary).toBeDefined();
      expect(res.dailyIntelligenceSummary.signalsScanned).toBeGreaterThan(0);
    }
  }, 60000);
});

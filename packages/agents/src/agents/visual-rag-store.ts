import {
  VisualRAGPattern,
  VisualFormat,
  VisualComposition,
  VisualDensity,
  VisualPurpose,
  ColorStyle,
  Topic,
  StoryMode,
} from "@brand-os/shared";

// Seed knowledge base with visual patterns from top technical engineering publications
export const CURATED_VISUAL_RAG_KNOWLEDGE_BASE: VisualRAGPattern[] = [
  {
    id: "rag_pat_01",
    sourcePlatform: "OpenAI Engineering Blog",
    author: "OpenAI Research",
    topic: "LLM Routing & Failover Gateway",
    technicalCategory: "AI Engineering",
    visualType: VisualFormat.ARCHITECTURE_DIAGRAM,
    composition: VisualComposition.LEFT_TO_RIGHT,
    layout: "Ingress Gateway → Circuit Breaker → Active Cluster → Fallback Model",
    informationDensity: VisualDensity.MEDIUM,
    purpose: VisualPurpose.SHOW_ARCHITECTURE,
    style: ColorStyle.LIGHT_TECHNICAL_BLUEPRINT,
    engagementSignal: "VIRAL",
    keyElements: ["Client Ingress", "Gateway Router", "Circuit Breaker", "Primary LLM", "Fallback LLM"],
  },
  {
    id: "rag_pat_02",
    sourcePlatform: "Anthropic Research",
    author: "Anthropic Systems",
    topic: "Model Context Protocol (MCP) Tool Execution",
    technicalCategory: "Agentic AI",
    visualType: VisualFormat.AGENT_WORKFLOW,
    composition: VisualComposition.PIPELINE,
    layout: "Host Application → Protocol Mesh → Tool Sandbox → Telemetry Collector",
    informationDensity: VisualDensity.MEDIUM,
    purpose: VisualPurpose.EXPLAIN,
    style: ColorStyle.NEUTRAL_DOCUMENTATION,
    engagementSignal: "HIGH",
    keyElements: ["Host App", "MCP Client", "Tool Gateway", "Sandbox Execution", "Response Validator"],
  },
  {
    id: "rag_pat_03",
    sourcePlatform: "Netflix Tech Blog",
    author: "Netflix Systems",
    topic: "PostgreSQL B-Tree Index Bloat & Vacuuming",
    technicalCategory: "Database",
    visualType: VisualFormat.BEFORE_AFTER_COMPARISON,
    composition: VisualComposition.BEFORE_AFTER,
    layout: "Bloated Index Pointers vs Compact Reindexed Page Layout",
    informationDensity: VisualDensity.HIGH,
    purpose: VisualPurpose.COMPARE,
    style: ColorStyle.HIGH_CONTRAST_DIAGRAM,
    engagementSignal: "HIGH",
    keyElements: ["Page Header", "Dead Tuples", "Live Pointer Map", "Autovacuum Buffer"],
  },
  {
    id: "rag_pat_04",
    sourcePlatform: "Uber Engineering",
    author: "Uber Infrastructure",
    topic: "p99 Latency Spikes Under Rate Limiting",
    technicalCategory: "Performance",
    visualType: VisualFormat.PERFORMANCE_BENCHMARK,
    composition: VisualComposition.SPLIT_SCREEN,
    layout: "Unbounded Queue p99 Latency Curve vs Leaky Bucket Rate Limiter Curve",
    informationDensity: VisualDensity.MEDIUM,
    purpose: VisualPurpose.SHOW_PERFORMANCE,
    style: ColorStyle.DARK_CONTRAST,
    engagementSignal: "HIGH",
    keyElements: ["Throughput Axis", "p99 Latency Spike", "Rate Limit Ceiling", "Tail Latency Curve"],
  },
  {
    id: "rag_pat_05",
    sourcePlatform: "Google AI Research",
    author: "Google AI",
    topic: "Cache Augmented Generation (CAG) vs RAG",
    technicalCategory: "AI Engineering",
    visualType: VisualFormat.MODEL_COMPARISON,
    composition: VisualComposition.SIDE_BY_SIDE,
    layout: "Retrieval Step Bottleneck vs Pre-loaded Context Cache Pipeline",
    informationDensity: VisualDensity.MEDIUM,
    purpose: VisualPurpose.COMPARE,
    style: ColorStyle.LIGHT_TECHNICAL_BLUEPRINT,
    engagementSignal: "VIRAL",
    keyElements: ["Embedding Vector Search", "KV Cache Prefill", "Latency Delta", "Token Cost Ceiling"],
  },
  {
    id: "rag_pat_06",
    sourcePlatform: "AWS Architecture Center",
    author: "AWS Architects",
    topic: "SQS Message Deduplication & Dead Letter Queue",
    technicalCategory: "System Design",
    visualType: VisualFormat.FAILURE_RECOVERY_MAP,
    composition: VisualComposition.FLOWCHART,
    layout: "FIFO SQS → Consumer Worker → Retry Exhaustion → DLQ Quarantine",
    informationDensity: VisualDensity.MEDIUM,
    purpose: VisualPurpose.EXPOSE_PROBLEM,
    style: ColorStyle.GREEN_TERMINAL,
    engagementSignal: "HIGH",
    keyElements: ["Message Producer", "Deduplication Hash", "Worker Timeout", "DLQ Alert Boundary"],
  },
  {
    id: "rag_pat_07",
    sourcePlatform: "Dev.to Top Weekly",
    author: "Senior Staff Engineer",
    topic: "Docker Buildx Rootless Hardening",
    technicalCategory: "DevOps",
    visualType: VisualFormat.CODE_BLUEPRINT,
    composition: VisualComposition.LAYERED_ARCHITECTURE,
    layout: "Host Kernel Boundary → Unprivileged User Namespace → Container Engine",
    informationDensity: VisualDensity.HIGH,
    purpose: VisualPurpose.DEMONSTRATE,
    style: ColorStyle.DARK_CONTRAST,
    engagementSignal: "HIGH",
    keyElements: ["Kernel Namespace", "UID Mapping", "Seccomp Profile", "Buildx Cache Mount"],
  },
  {
    id: "rag_pat_08",
    sourcePlatform: "Hacker News Technical Frontpage",
    author: "Systems Architect",
    topic: "gRPC Streaming vs REST WebSockets",
    technicalCategory: "Architecture",
    visualType: VisualFormat.DECISION_MATRIX,
    composition: VisualComposition.DECISION_TREE,
    layout: "Multiplexed HTTP/2 Frame Matrix vs HTTP/1.1 Handshake Pipeline",
    informationDensity: VisualDensity.HIGH,
    purpose: VisualPurpose.EXPLAIN,
    style: ColorStyle.MONOCHROME_ARCHITECTURE,
    engagementSignal: "VIRAL",
    keyElements: ["HTTP/2 Streams", "Protobuf Serialization", "JSON Overhead", "Memory Footprint"],
  },
];

export class VisualRAGStore {
  private patterns: VisualRAGPattern[] = CURATED_VISUAL_RAG_KNOWLEDGE_BASE;

  public retrieveVisualPatterns(
    topic: Topic,
    storyMode?: StoryMode | string,
    limit: number = 3
  ): VisualRAGPattern[] {
    const topicText = (topic.title + " " + topic.category + " " + (topic.framework || "")).toLowerCase();

    // Score candidates based on category, technology, keyword, and story mode overlap
    const scored = this.patterns.map((pat) => {
      let score = 0;
      const patText = (pat.topic + " " + pat.technicalCategory + " " + pat.keyElements.join(" ")).toLowerCase();

      if (pat.technicalCategory.toLowerCase() === topic.category.toLowerCase()) score += 40;

      topic.keywords.forEach((kw) => {
        if (patText.includes(kw.toLowerCase())) score += 20;
      });

      if (storyMode) {
        if (storyMode === StoryMode.FAILURE_STORY && pat.visualType === VisualFormat.FAILURE_RECOVERY_MAP) score += 30;
        if (storyMode === StoryMode.PERFORMANCE_STORY && pat.visualType === VisualFormat.PERFORMANCE_BENCHMARK) score += 30;
        if (storyMode === StoryMode.ARCHITECTURE_STORY && pat.visualType === VisualFormat.ARCHITECTURE_DIAGRAM) score += 30;
        if (storyMode === StoryMode.DECISION_STORY && pat.visualType === VisualFormat.DECISION_MATRIX) score += 30;
        if (storyMode === StoryMode.BEFORE_AFTER && pat.visualType === VisualFormat.BEFORE_AFTER_COMPARISON) score += 30;
      }

      if (patText.includes(topicText.substring(0, 10))) score += 15;

      return { pattern: pat, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.pattern);
  }
}

import { Topic } from "@brand-os/shared";

export interface TradeoffPair {
  name: string;
  dimensionA: string;
  dimensionB: string;
  chosen: string;
  sacrificed: string;
  whenAlternativeBetter: string;
  engineeringRationale: string;
}

export class TradeoffEngine {
  public identifyTradeoffs(topic: Topic): TradeoffPair[] {
    const text = (topic.title + " " + (topic.framework || "") + " " + topic.category + " " + topic.keywords.join(" ")).toLowerCase();

    const tradeoffs: TradeoffPair[] = [];

    if (text.includes("llm") || text.includes("agent") || text.includes("ai") || text.includes("mcp") || text.includes("rag")) {
      tradeoffs.push({
        name: "Model Quality vs Inference Cost & Latency",
        dimensionA: "High-parameter frontier model (highest reasoning capability)",
        dimensionB: "Distilled/Quantized local model (sub-100ms latency, zero API cost)",
        chosen: "Tiered routing with fast models for triage and frontier models for complex tool execution",
        sacrificed: "Architectural simplicity (requires routing state machine and fallback handling)",
        whenAlternativeBetter: "When workloads are offline batch processes where latency is secondary to raw reasoning depth",
        engineeringRationale: "In real-time developer platforms, paying 3000ms latency on every simple request degrades user experience; tiering optimizes the p95 cost-latency curve."
      });
      tradeoffs.push({
        name: "Automation vs Deterministic Control",
        dimensionA: "Autonomous agentic loop with self-correction",
        dimensionB: "Strict state-machine workflow with explicit guardrails",
        chosen: "Deterministic decision gates wrapping autonomous LLM generation steps",
        sacrificed: "Unconstrained agent autonomy",
        whenAlternativeBetter: "When exploring open-ended code discovery where failure costs are low",
        engineeringRationale: "Production content platforms cannot tolerate non-deterministic hallucination in published code or claims."
      });
    } else if (text.includes("redis") || text.includes("cache") || text.includes("memory")) {
      tradeoffs.push({
        name: "Caching vs Data Freshness & Consistency",
        dimensionA: "In-memory caching (sub-millisecond reads)",
        dimensionB: "Direct database reads (guaranteed strong consistency)",
        chosen: "Short TTL caching with write-through cache invalidation for hot paths",
        sacrificed: "Immediate strict consistency during cache propagation windows",
        whenAlternativeBetter: "When handling financial transactions where stale data constitutes a severity-1 defect",
        engineeringRationale: "Offloading 90% of read traffic from PostgreSQL protects database connection pools under spike traffic."
      });
    } else if (text.includes("docker") || text.includes("k8s") || text.includes("container") || text.includes("cloud")) {
      tradeoffs.push({
        name: "Serverless Workers vs Long-running Dedicated Nodes",
        dimensionA: "Serverless execution (zero idle cost, autoscaling)",
        dimensionB: "Dedicated worker pool (predictable performance, zero cold starts)",
        chosen: "Dedicated workers for steady-state background queues + serverless bursting for spikes",
        sacrificed: "Single-vendor deployment simplicity",
        whenAlternativeBetter: "When traffic patterns are highly erratic with long zero-traffic intervals",
        engineeringRationale: "Cold starts in heavy container environments impact tail latency for synchronous webhooks."
      });
    } else if (text.includes("react") || text.includes("typescript") || text.includes("frontend")) {
      tradeoffs.push({
        name: "Client-side Flexibility vs Server Component Simplicity",
        dimensionA: "Client-rendered state with rich interactive hooks",
        dimensionB: "Server components & server actions with zero bundle weight",
        chosen: "Server components for data fetching + isolated client islands for interactive UI",
        sacrificed: "Unified client-only state management simplicity",
        whenAlternativeBetter: "When building complex offline-first canvas tools or rich local text editors",
        engineeringRationale: "Reducing JavaScript bundle size shipped over mobile connections directly improves Time to Interactive."
      });
    } else {
      tradeoffs.push({
        name: "Speed of Initial Development vs Long-Term System Maintainability",
        dimensionA: "Monolithic rapid-prototype code",
        dimensionB: "Decoupled domain boundary abstractions",
        chosen: "Decoupled module boundaries with strict TypeScript schemas",
        sacrificed: "Initial day-1 velocity",
        whenAlternativeBetter: "When validating a 24-hour hackathon concept with zero long-term production lifespan",
        engineeringRationale: "Loose coupling prevents refactoring debt when expanding feature scope across microservices."
      });
    }

    return tradeoffs;
  }
}

export const tradeoffEngine = new TradeoffEngine();

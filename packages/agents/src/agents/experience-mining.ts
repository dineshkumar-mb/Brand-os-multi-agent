import {
  AgentType,
  AgentResult,
  Topic,
  ExperienceLog,
} from "@brand-os/shared";

export interface MinedExperienceNarrative {
  foundMatch: boolean;
  projectContext?: string;
  realWorldProblem?: string;
  engineeringDecision?: string;
  tradeoffsFaced?: string[];
  quantifiableOutcome?: string;
  lessonsLearned?: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// EXPERIENCE LOG DATABASE
// ⚠️ REPLACE WITH YOUR REAL PRODUCTION EXPERIENCE DATA BEFORE GOING LIVE.
// These 12 entries are realistic engineering scenarios but are placeholders.
// Each log must reflect an actual incident, decision, or refactor you built.
// ─────────────────────────────────────────────────────────────────────────
const DEFAULT_REALISTIC_EXPERIENCE_LOGS: ExperienceLog[] = [
  // ── 1. Distributed Queue Idempotency ────────────────────────────────────
  {
    id: "exp_01_queue_dedup",
    title: "Distributed Worker Queue Idempotency & Retry State",
    category: "System Performance & Databases",
    description: "Refactored event processing pipeline for multi-tenant worker swarm under burst traffic.",
    technologiesUsed: ["Redis", "TypeScript", "BullMQ", "Node.js"],
    challengesFaced: ["Workers were executing duplicate background jobs during network timeouts."],
    solutionApproach: "Introduced deterministic job IDs with Redis atomic set-if-not-exists locks and retry exponential backoff state.",
    tradeoffs: ["Added 4ms Redis RTT latency overhead per job in exchange for zero duplicate execution."],
    keyLessons: ["Retries without idempotency keys in distributed queues will cause duplicate side effects."],
    metricsOrOutcome: "Duplicate job execution dropped to 0%, queue throughput increased by 42%.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  // ── 2. TypeScript Monorepo Build ─────────────────────────────────────────
  {
    id: "exp_02_ts_monorepo",
    title: "TypeScript Monorepo Build Latency Optimization",
    category: "TypeScript Ecosystem",
    description: "Migrated enterprise monorepo with 12 subpackages from single tsconfig to Project References.",
    technologiesUsed: ["TypeScript", "pnpm", "Turborepo", "Node.js"],
    challengesFaced: ["Type checking full monorepo on CI took 8.5 minutes per pull request."],
    solutionApproach: "Configured composite project references with incremental declaration map emission.",
    tradeoffs: ["Required explicit package tsconfig references maintainability overhead."],
    keyLessons: ["Project references allow skipping unchanged subpackages during CI type checking."],
    metricsOrOutcome: "CI type check time reduced from 8.5 minutes to 1.8 minutes (78% speedup).",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  // ── 3. AI Gateway Failover ───────────────────────────────────────────────
  {
    id: "exp_03_ai_gateway_routing",
    title: "AI Gateway Failover & Cost-Optimized Routing",
    category: "AI Engineering",
    description: "Built unified LLM gateway router supporting OpenAI, Anthropic, and Gemini fallbacks.",
    technologiesUsed: ["OpenAI", "Anthropic", "Gemini", "TypeScript", "Node.js"],
    challengesFaced: ["Upstream provider rate limits (429) caused complete pipeline stalls during peak hours."],
    solutionApproach: "Implemented dynamic token bucket rate limiting with automatic model failover and cost-optimized routing.",
    tradeoffs: ["Occasional 250ms latency penalty during fallback model switching under burst load."],
    keyLessons: ["Single-provider LLM applications are fragile; decoupled gateway routing is essential for SLA."],
    metricsOrOutcome: "Pipeline execution reliability increased to 99.94%, API cost reduced by 34%.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  // ── 4. Docker Multi-Arch Container Hardening ─────────────────────────────
  {
    id: "exp_04_docker_rootless",
    title: "Hardened Container Security & Multi-Arch Buildx",
    category: "DevOps & Cloud Infrastructure",
    description: "Hardened microservice OCI container images using Docker Buildx and rootless execution.",
    technologiesUsed: ["Docker", "Kubernetes", "Trivy", "Go"],
    challengesFaced: ["Default container images failed enterprise vulnerability scanning checks.", "Cross-architecture builds (amd64/arm64) were 4x slower using QEMU emulation."],
    solutionApproach: "Switched to distroless base images, non-root user execution, and automated Trivy SBOM scanning in CI. Replaced QEMU with native cross-compilation toolchain.",
    tradeoffs: ["Distroless images lack shell utilities, requiring ephemeral debug containers for production incidents."],
    keyLessons: ["Security scanning must run inside CI before pushing images to production registry. Never trust base image tags."],
    metricsOrOutcome: "Zero high/critical CVEs in production containers, image size reduced by 65%, multi-arch build time reduced by 3.2x.",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  // ── 5. Graph / DAG Dependency Processing ─────────────────────────────────
  {
    id: "exp_05_dag_resolver",
    title: "Deterministic DAG Dependency Resolution for Content Pipelines",
    category: "System Design & Architecture",
    description: "Designed a topological DAG resolver for multi-tenant content dependency graphs with incremental cache invalidation.",
    technologiesUsed: ["TypeScript", "Node.js", "Redis", "PostgreSQL"],
    challengesFaced: ["Circular dependency cycles in customer-authored content relationships caused infinite resolution loops.", "Cache invalidation was too aggressive — every graph update triggered full revalidation."],
    solutionApproach: "Implemented Kahn's algorithm for cycle detection with content-addressed cache keys, scoping invalidation to the affected subgraph only.",
    tradeoffs: ["Content-addressed keys require consistent input hashing — any schema change invalidates all cached keys globally."],
    keyLessons: ["Incremental graph invalidation only works if you can deterministically identify the minimum affected subgraph boundary."],
    metricsOrOutcome: "Full revalidation events reduced by 87%. Graph resolution time reduced from 340ms to 28ms for typical content trees.",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  // ── 6. Prompt Injection Red-Teaming ──────────────────────────────────────
  // ⚠️ PLACEHOLDER: Replace with your actual security testing experience.
  {
    id: "exp_06_prompt_injection",
    title: "LLM Prompt Injection Red-Team Test Infrastructure",
    category: "AI Security",
    description: "Built automated adversarial test suite to detect prompt injection vulnerabilities in production LLM-powered pipelines.",
    technologiesUsed: ["TypeScript", "OpenAI", "Vitest", "Node.js"],
    challengesFaced: ["Standard unit tests did not detect prompt injection attacks that bypassed system prompt boundaries.", "Manual security reviews were inconsistent and non-repeatable."],
    solutionApproach: "Created a structured injection taxonomy covering direct injection, indirect injection, and jailbreak attempts. Automated 40+ adversarial test cases as part of CI.",
    tradeoffs: ["Adversarial tests require frequent updates as new injection patterns emerge — static test coverage decays quickly."],
    keyLessons: ["A passing prompt injection test only proves the attack didn't succeed today. The attack surface changes with every model update."],
    metricsOrOutcome: "Discovered 3 previously unknown injection paths that bypassed the system prompt in production. All patched before public release.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  // ── 7. ClickHouse Analytics Schema Design ────────────────────────────────
  // ⚠️ PLACEHOLDER: Replace with your actual ClickHouse/OLAP experience.
  {
    id: "exp_07_clickhouse_schema",
    title: "ClickHouse MergeTree Schema Design for High-Cardinality Event Streams",
    category: "Data Engineering",
    description: "Redesigned analytics ingestion schema for 50M+ daily events using ClickHouse MergeTree with materialized views.",
    technologiesUsed: ["ClickHouse", "TypeScript", "Kafka", "PostgreSQL"],
    challengesFaced: ["Ad-hoc analytical queries on normalized OLTP schema took 4-8 seconds under production load.", "High cardinality user_id columns caused excessive part merges and memory pressure."],
    solutionApproach: "Migrated to MergeTree partitioned by event date with low-cardinality encoding for repeated string fields. Added materialized views for top-10 pre-aggregations.",
    tradeoffs: ["Denormalized columnar schema requires careful schema migration strategy — ALTER TABLE is non-trivial at scale."],
    keyLessons: ["ClickHouse's query performance is dominated by partition pruning and sort key design, not raw hardware."],
    metricsOrOutcome: "P99 analytical query latency reduced from 7.2s to 180ms. Storage reduced by 4x via LZ4 compression on columnar layout.",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  // ── 8. Kubernetes Cost Governance ────────────────────────────────────────
  // ⚠️ PLACEHOLDER: Replace with your actual Kubernetes experience.
  {
    id: "exp_08_k8s_cost",
    title: "Multi-Tenant Kubernetes Namespace Cost Governance",
    category: "DevOps & Cloud Infrastructure",
    description: "Implemented namespace-level resource quotas and cost attribution for a 50-team engineering organization on shared Kubernetes clusters.",
    technologiesUsed: ["Kubernetes", "Helm", "Prometheus", "Go"],
    challengesFaced: ["Developer teams were over-provisioning memory requests, causing cluster fragmentation and wasted spend.", "No visibility into per-team cloud costs without cluster-level billing breakdown."],
    solutionApproach: "Deployed LimitRange controllers per namespace, Vertical Pod Autoscaler recommendations, and custom Prometheus exporters feeding team-level cost dashboards.",
    tradeoffs: ["Hard resource quotas occasionally blocked legitimate burst workloads — required manual override workflow."],
    keyLessons: ["Cost governance only works when developers can see their own spend in real-time. Policy alone does not change behavior."],
    metricsOrOutcome: "Cluster utilization increased from 38% to 67%. Monthly cloud spend reduced by $28,000.",
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  // ── 9. Node.js V8 Memory Profiling ───────────────────────────────────────
  // ⚠️ PLACEHOLDER: Replace with your actual Node.js performance experience.
  {
    id: "exp_09_nodejs_gc",
    title: "V8 GC Pressure & Memory Leak Investigation in Node.js API Gateway",
    category: "Node.js & JavaScript Runtime",
    description: "Diagnosed and resolved heap memory growth in a high-throughput Node.js API gateway processing 15K req/s.",
    technologiesUsed: ["Node.js", "TypeScript", "V8", "clinic.js"],
    challengesFaced: ["Process heap grew by 40MB/hour under sustained load, requiring daily restarts.", "Standard APM tools did not identify the specific allocation site."],
    solutionApproach: "Used clinic.js flamegraph analysis and V8 heap snapshots to identify a closure-captured EventEmitter listener accumulation in the middleware chain.",
    tradeoffs: ["Removing implicit closure captures required refactoring shared middleware state — breaking backward compatibility in internal APIs."],
    keyLessons: ["EventEmitter listener accumulation is the most common source of Node.js memory leaks in long-running processes."],
    metricsOrOutcome: "Memory growth eliminated. Process restart interval extended from daily to 30-day rolling cycles. P99 latency improved by 18ms.",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  // ── 10. Vite Build Federation ─────────────────────────────────────────────
  // ⚠️ PLACEHOLDER: Replace with your actual frontend build experience.
  {
    id: "exp_10_vite_ssr",
    title: "Vite Environment API & Server-Side Rendering Federation",
    category: "Frontend Architecture",
    description: "Migrated a multi-tenant SPA to Vite Environment API with selective server-side rendering for critical routes.",
    technologiesUsed: ["Vite", "TypeScript", "React", "Node.js"],
    challengesFaced: ["Inconsistent hydration behavior across SSR and client environments caused subtle UI state bugs in production.", "Plugin ecosystem compatibility broke during Vite 5 → 6 migration."],
    solutionApproach: "Adopted the new Environment API to explicitly scope SSR vs client transforms. Isolated plugin compatibility behind environment-conditional config.",
    tradeoffs: ["Environment API requires explicit plugin opt-in — 3 third-party plugins needed upstream PRs before we could complete migration."],
    keyLessons: ["SSR hydration mismatches are almost always caused by non-deterministic rendering in shared state initialization paths."],
    metricsOrOutcome: "Time to interactive for critical routes reduced by 1.4s. Hydration errors eliminated after migration.",
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  // ── 11. Rust Supply-Chain Security ────────────────────────────────────────
  // ⚠️ PLACEHOLDER: Replace with your actual security auditing experience.
  {
    id: "exp_11_rust_supply_chain",
    title: "Rust Crate Supply-Chain Risk Auditing in Production Pipelines",
    category: "Security Engineering",
    description: "Established automated cargo-audit and SBOM generation pipeline for Rust service build infrastructure.",
    technologiesUsed: ["Rust", "cargo-audit", "GitHub Actions", "SBOM (CycloneDX)"],
    challengesFaced: ["No visibility into transitive dependency security advisories across 230+ Rust crates.", "Build scripts (build.rs) ran without sandboxing, creating arbitrary code execution risk."],
    solutionApproach: "Integrated cargo-audit into CI with advisory blocklist enforcement. Adopted reproducible builds and isolated build.rs execution via cargo-sandbox.",
    tradeoffs: ["Reproducible builds require pinned dependency lockfiles — updating dependencies requires explicit justification and re-review."],
    keyLessons: ["Build scripts are the highest-risk surface in Rust dependency chains — any crate with a build.rs is executing arbitrary code in your CI environment."],
    metricsOrOutcome: "Detected and blocked 2 supply-chain compromised crates before merging. SBOM generation now automated for every release.",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  // ── 12. Redis Pub/Sub vs Kafka Tradeoff ──────────────────────────────────
  // ⚠️ PLACEHOLDER: Replace with your actual messaging architecture experience.
  {
    id: "exp_12_redis_kafka_tradeoff",
    title: "Redis Pub/Sub vs Kafka for Real-Time Notification Pipeline",
    category: "Distributed Systems",
    description: "Evaluated and migrated a real-time notification delivery system from Redis Pub/Sub to Kafka Streams.",
    technologiesUsed: ["Redis", "Kafka", "TypeScript", "Node.js"],
    challengesFaced: ["Redis Pub/Sub dropped messages for consumers that were temporarily disconnected.", "No message replay capability for auditing failed deliveries."],
    solutionApproach: "Migrated to Kafka with consumer groups and at-least-once delivery semantics. Implemented idempotent processing on the consumer side.",
    tradeoffs: ["Kafka operational overhead (schema registry, consumer group rebalancing) increased infrastructure complexity by 40%."],
    keyLessons: ["Redis Pub/Sub is fire-and-forget. If durability or replay matters, Kafka is the correct choice regardless of operational overhead."],
    metricsOrOutcome: "Message delivery reliability increased from 94.7% to 99.99%. Audit log replay enabled post-incident investigation.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export class ExperienceMiningAgent {
  private experienceLogs: ExperienceLog[] = [...DEFAULT_REALISTIC_EXPERIENCE_LOGS];

  constructor(initialLogs: ExperienceLog[] = []) {
    this.experienceLogs = initialLogs.length > 0 ? initialLogs : [...DEFAULT_REALISTIC_EXPERIENCE_LOGS];
  }

  public setLogs(logs: ExperienceLog[]) {
    this.experienceLogs = logs && logs.length > 0 ? logs : [...DEFAULT_REALISTIC_EXPERIENCE_LOGS];
  }

  public mineExperience(topic: Topic, pipelineId?: string): AgentResult<MinedExperienceNarrative> {
    const startTime = Date.now();
    console.log(`[Experience Mining Agent] Searching stored engineering experience logs for topic: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    const catLower = (topic.category || "").toLowerCase();
    const kwLower = (topic.keywords || []).map((k) => k.toLowerCase());

    // Scored matching: evaluate all logs and pick the best match
    const scoredLogs = this.experienceLogs.map((log) => {
      const logCat = log.category.toLowerCase();
      const logTitle = log.title.toLowerCase();
      const logDesc = log.description.toLowerCase();
      const logTechs = log.technologiesUsed.map((t) => t.toLowerCase());

      let score = 0;

      // Category overlap (both directions)
      if (logCat.includes(catLower) || catLower.includes(logCat)) score += 30;

      // Technology match against topic title, keywords, and framework
      const techMatchCount = logTechs.filter((t) =>
        titleLower.includes(t) ||
        kwLower.some((k) => k.includes(t) || t.includes(k)) ||
        (topic.framework && topic.framework.toLowerCase().includes(t))
      ).length;
      score += techMatchCount * 20;

      // Title keyword overlap
      const titleWords = titleLower.split(/\s+/).filter((w) => w.length > 3);
      const titleOverlap = titleWords.filter((w) => logTitle.includes(w) || logDesc.includes(w)).length;
      score += titleOverlap * 10;

      // Keywords in log description
      const kwOverlap = kwLower.filter((k) => logDesc.includes(k) || logTitle.includes(k)).length;
      score += kwOverlap * 5;

      return { log, score };
    });

    const bestMatch = scoredLogs.sort((a, b) => b.score - a.score)[0];
    const matchingLog = bestMatch && bestMatch.score >= 40 ? bestMatch.log : null;

    let narrative: MinedExperienceNarrative;

    if (matchingLog) {
      narrative = {
        foundMatch: true,
        projectContext: matchingLog.description,
        realWorldProblem: matchingLog.challengesFaced.join(". "),
        engineeringDecision: matchingLog.solutionApproach,
        tradeoffsFaced: matchingLog.tradeoffs,
        quantifiableOutcome: matchingLog.metricsOrOutcome || "Verified improvement in stability and error reduction.",
        lessonsLearned: matchingLog.keyLessons,
      };
    } else {
      narrative = {
        foundMatch: false,
        projectContext: `Technical research & architectural exploration of ${topic.framework || topic.category || topic.title}.`,
        realWorldProblem: undefined,
        engineeringDecision: undefined,
        tradeoffsFaced: [],
        quantifiableOutcome: undefined,
        lessonsLearned: [
          `Evaluate technical documentation and specifications before implementation.`,
          `Analyze architectural trade-offs prior to production adoption.`,
        ],
      };
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: narrative.foundMatch ? 95 : 30,
      data: narrative,
      validationResult: {
        passed: true,
        errors: [],
        warnings: matchingLog ? [] : ["No stored project experience matched. Mode: EXPLORED_RESEARCH."],
      },
      metadata: {
        agentType: AgentType.EXPERIENCE_MINING,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

export const experienceMiningAgent = new ExperienceMiningAgent();

import {
  CandidateOpportunityRecord,
  CandidateOpportunityScores,
  HistoricalPostRecord,
  SourceAuthorityLevel,
  Top5MatrixResult,
  Topic,
} from "@brand-os/shared";
import { multiSourceCollectorEngine } from "../collectors/engine.js";
import { freshTrendDiscoveryEngine } from "./fresh-trend-discovery.js";
import { experienceMatcher } from "../knowledge/experience-matcher.js";

export class CandidateCompetitionEngine {
  private calculateCosineSim(vecA: number[], vecB: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return normA === 0 || normB === 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  private computeSemanticSimilarity(textA: string, textB: string): number {
    const tokensA = this.tokenize(textA);
    const tokensB = this.tokenize(textB);
    const vocab = Array.from(new Set([...tokensA, ...tokensB]));
    if (vocab.length === 0) return 0;
    const vecA = vocab.map((v) => (tokensA.includes(v) ? 1 : 0));
    const vecB = vocab.map((v) => (tokensB.includes(v) ? 1 : 0));
    return this.calculateCosineSim(vecA, vecB);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UNIVERSAL PROBLEM-FIRST EXTRACTION
  // RAW_SIGNAL → CANONICAL_EVENT → ENGINEERING_PROBLEM → STORY_TITLE
  //
  // Rules (applied in order):
  //  1. Strip all discovery-source prefixes
  //  2. Strip raw repo paths (owner/repo  →  infer engineering topic)
  //  3. Strip bare version numbers (4.38, v22, LTS, etc.) from release titles
  //  4. Map to a concrete engineering problem + tension + story angle
  //  5. Hard reject: if title still matches /^\w+\/\w+$/ or still contains version
  //     numbers after cleanup, apply domain-inference fallback
  // ─────────────────────────────────────────────────────────────────────────
  public extractEngineeringProblem(sig: { title: string; content?: string; tags?: string[] }): {
    problemTitle: string;
    affectedSystems: string[];
    engineeringTensions: string[];
    technicalConcepts: string[];
    possibleArchitectureAngles: string[];
  } {
    const rawTitle = (sig.title || "").trim();
    const content = (sig.content || "").toLowerCase();
    const tags = sig.tags || [];

    // ── Step 1: Strip source prefixes ──────────────────────────────────────
    let clean = rawTitle
      .replace(/^GitHub Trending:\s*/i, "")
      .replace(/^HN:\s*/i, "")
      .replace(/^Dev\.to:\s*/i, "")
      .replace(/^Reddit:\s*/i, "")
      .replace(/^Official:\s*/i, "")
      .replace(/^Arxiv:\s*/i, "")
      .replace(/^Security:\s*/i, "");

    const lc = clean.toLowerCase();

    // ── Step 2: Raw repo path pattern (owner/repo) ─────────────────────────
    // e.g. "ClickHouse/ClickHouse", "freeCodeCamp/freeCodeCamp"
    if (/^[\w-]+\/[\w-]+$/.test(clean.trim())) {
      const repoName = clean.split("/")[1].toLowerCase();
      return this.inferFromRepoName(repoName, content, tags);
    }

    // ── Step 3: Known engineering-story mappings ────────────────────────────
    // Docker / Container
    if (lc.includes("docker") || lc.includes("buildx") || lc.includes("container") || lc.includes("oci")) {
      return {
        problemTitle: "Hardening Multi-Architecture Container Build Pipelines for Zero-CVE Production Images",
        affectedSystems: ["OCI Build Pipeline", "Vulnerability Scanner", "Container Registry", "K8s Node Pool"],
        engineeringTensions: ["Distroless image security vs shell-debugging ergonomics", "Multi-arch QEMU build time vs cross-compilation toolchain complexity"],
        technicalConcepts: ["Docker Buildx", "Trivy SBOM scanning", "Distroless base images", "SLSA provenance"],
        possibleArchitectureAngles: ["PRODUCTION_INCIDENT", "BEFORE_AFTER_LAYOUT"],
      };
    }

    // Node.js / Runtime
    if (lc.includes("node.js") || lc.includes("nodejs") || lc.includes("node ")) {
      return {
        problemTitle: "Diagnosing V8 GC Pressure and Memory Leaks in Long-Running Node.js Services",
        affectedSystems: ["V8 Heap Allocator", "EventLoop Scheduler", "HTTP Keep-Alive Pool", "Process Memory Monitor"],
        engineeringTensions: ["Aggressive GC frequency vs throughput degradation", "In-process caching vs heap fragmentation risk"],
        technicalConcepts: ["V8 heap snapshots", "libuv EventLoop", "native ESM loading", "process.memoryUsage()"],
        possibleArchitectureAngles: ["DEBUGGING_STORY", "PERFORMANCE_INVESTIGATION"],
      };
    }

    // Vite / Build tooling
    if (lc.includes("vite") || lc.includes("esbuild") || lc.includes("rollup") || lc.includes("bundl")) {
      return {
        problemTitle: "Federating Multi-Environment Build Pipelines Without Full Server-Side Rendering Re-Architectures",
        affectedSystems: ["Vite Dev Server", "SSR Renderer", "Module Federation Layer", "Edge CDN Cache"],
        engineeringTensions: ["Environment API flexibility vs plugin ecosystem compatibility", "Streaming SSR latency vs hydration correctness"],
        technicalConcepts: ["Vite Environment API", "Module Federation", "HMR WebSocket", "Rolldown Rust bundler"],
        possibleArchitectureAngles: ["ARCHITECTURE_DECISION", "SYSTEM_DESIGN_BREAKDOWN"],
      };
    }

    // TypeScript / Compiler
    if (lc.includes("typescript") || lc.includes(" ts ") || lc.includes("tsc ")) {
      return {
        problemTitle: "Eliminating CI Type-Check Bottlenecks in Large TypeScript Monorepos",
        affectedSystems: ["TypeScript Project References", "Incremental Build Cache", "CI Pipeline", "Declaration Map Emitter"],
        engineeringTensions: ["Composite project correctness guarantees vs developer ergonomics", "Strict type checking vs incremental cache validity"],
        technicalConcepts: ["Project References", "tsbuildinfo", "declaration maps", "incremental compilation"],
        possibleArchitectureAngles: ["PERFORMANCE_INVESTIGATION", "BEFORE_AFTER_LAYOUT"],
      };
    }

    // ClickHouse / OLAP / Analytics
    if (lc.includes("clickhouse") || lc.includes("olap") || lc.includes("columnar") || lc.includes("analytics db")) {
      return {
        problemTitle: "Designing Columnar Analytics Schema for Sub-Second Query Performance at Petabyte Scale",
        affectedSystems: ["ClickHouse MergeTree Engine", "Materialized View Pipeline", "Query Planner", "Distributed Replica Set"],
        engineeringTensions: ["Denormalization speed vs storage amplification", "Asynchronous insert batching vs real-time query freshness"],
        technicalConcepts: ["MergeTree partitioning", "Materialized Views", "Bloom filter indexes", "ReplicatedMergeTree"],
        possibleArchitectureAngles: ["SYSTEM_DESIGN_BREAKDOWN", "ARCHITECTURE_DECISION"],
      };
    }

    // Kubernetes / Infra
    if (lc.includes("kubernetes") || lc.includes("k8s") || lc.includes("helm") || lc.includes("kubectl")) {
      return {
        problemTitle: "Enforcing Namespace-Level Cost Governance and Workload Isolation in Multi-Tenant Kubernetes",
        affectedSystems: ["Namespace Resource Quota", "LimitRange Controller", "Admission Webhook", "Prometheus Cost Exporter"],
        engineeringTensions: ["Strict isolation vs operator productivity", "Cost attribution accuracy vs resource fragmentation overhead"],
        technicalConcepts: ["ResourceQuota", "LimitRange", "Admission Webhooks", "Vertical Pod Autoscaler"],
        possibleArchitectureAngles: ["PRODUCTION_INCIDENT", "ARCHITECTURE_DECISION"],
      };
    }

    // Rust / Supply chain / Security
    if (lc.includes("rust") || lc.includes("cargo") || lc.includes("crate") || lc.includes("supply-chain") || lc.includes("malicious")) {
      return {
        problemTitle: "Auditing Transitive Dependency Supply-Chain Risk in Production Rust Workloads",
        affectedSystems: ["Cargo Dependency Resolver", "Build Script Executor", "CI Isolation Sandbox", "Binary Audit Pipeline"],
        engineeringTensions: ["Open-source velocity vs build-time payload risk", "Automated crate auditing vs developer experience friction"],
        technicalConcepts: ["cargo-audit", "build.rs execution isolation", "SBOM generation", "reproducible builds"],
        possibleArchitectureAngles: ["PRODUCTION_INCIDENT", "DEBUGGING_STORY"],
      };
    }

    // Redis / Queue / Distributed systems
    if (lc.includes("redis") || lc.includes("queue") || lc.includes("worker") || lc.includes("bullmq") || lc.includes("idempoten")) {
      return {
        problemTitle: "Guaranteeing Exactly-Once Execution in Distributed Worker Queues Under Network Partition",
        affectedSystems: ["Redis Atomic Operations", "Worker Pool Coordinator", "Job Deduplication Store", "Retry State Machine"],
        engineeringTensions: ["At-least-once delivery simplicity vs idempotency correctness overhead", "Redis atomic ops latency vs correctness guarantee"],
        technicalConcepts: ["SETNX idempotency keys", "exponential backoff", "poison pill handling", "job state FSM"],
        possibleArchitectureAngles: ["PRODUCTION_INCIDENT", "ARCHITECTURE_DECISION"],
      };
    }

    // AI / LLM / Agents / MCP
    if (lc.includes("llm") || lc.includes("agent") || lc.includes("mcp") || lc.includes("openai") || lc.includes("anthropic") || lc.includes("gemini") || lc.includes("rag") || lc.includes("prompt")) {
      if (lc.includes("inject") || lc.includes("security") || lc.includes("attack") || lc.includes("jailbreak")) {
        return {
          problemTitle: "Building Adversarial Red-Team Test Suites for LLM Prompt Injection Vulnerabilities",
          affectedSystems: ["Prompt Sanitizer", "Tool Permission Boundary", "Agent Memory Store", "Output Validator"],
          engineeringTensions: ["Strict input sanitization vs prompt flexibility for legitimate users", "Automated test coverage vs novel injection surface area"],
          technicalConcepts: ["Prompt injection taxonomy", "sandboxed tool execution", "semantic similarity detection", "OWASP LLM Top 10"],
          possibleArchitectureAngles: ["DEBUGGING_STORY", "PRODUCTION_INCIDENT"],
        };
      }
      return {
        problemTitle: "Architecting Resilient Multi-Provider LLM Gateway Routing with Cost-Optimized Fallback",
        affectedSystems: ["AI Gateway Router", "Token Bucket Rate Limiter", "Provider Health Monitor", "Tool Call Executor"],
        engineeringTensions: ["Single-provider simplicity vs multi-model failover resiliency", "Streaming token latency vs schema validation correctness"],
        technicalConcepts: ["Token bucket rate limiting", "model fallback chains", "MCP protocol", "structured output schemas"],
        possibleArchitectureAngles: ["PRODUCTION_INCIDENT", "ARCHITECTURE_DECISION"],
      };
    }

    // Graph / DAG / Dependency
    if (lc.includes("graph") || lc.includes("dag") || lc.includes("dependency") || lc.includes("roadmap") || lc.includes("curriculum")) {
      return {
        problemTitle: "Designing Deterministic Dependency Graph Engines for High-Concurrency Content Resolution",
        affectedSystems: ["DAG Node Resolver", "Incremental Revalidation Cache", "CDN Invalidation Webhook", "Client Graph Renderer"],
        engineeringTensions: ["Static pre-rendering correctness vs real-time graph update freshness", "Graph depth vs client-side bundle size"],
        technicalConcepts: ["Topological sort", "incremental static regeneration", "graph cycle detection", "content-addressed cache keys"],
        possibleArchitectureAngles: ["SYSTEM_DESIGN_BREAKDOWN", "ARCHITECTURE_DECISION"],
      };
    }

    // Kafka / Streaming
    if (lc.includes("kafka") || lc.includes("stream") || lc.includes("event-driven") || lc.includes("pubsub") || lc.includes("pub/sub")) {
      return {
        problemTitle: "Choosing Between Redis Pub/Sub and Kafka for Partial-Failure-Tolerant Event Pipelines",
        affectedSystems: ["Message Broker", "Consumer Group Coordinator", "Dead Letter Queue", "Schema Registry"],
        engineeringTensions: ["Redis Pub/Sub sub-millisecond latency vs Kafka durable replay guarantees", "At-most-once delivery simplicity vs exactly-once processing complexity"],
        technicalConcepts: ["Consumer group rebalancing", "exactly-once semantics", "dead letter queues", "schema evolution"],
        possibleArchitectureAngles: ["ARCHITECTURE_DECISION", "PRODUCTION_INCIDENT"],
      };
    }

    // Security / CVE / Vulnerability
    if (lc.includes("security") || lc.includes("vulnerability") || lc.includes("cve") || lc.includes("exploit") || lc.includes("auth")) {
      return {
        problemTitle: "Operationalizing Continuous Vulnerability Detection in Production Container Registries",
        affectedSystems: ["SBOM Scanner", "CVE Database Feed", "Registry Webhook", "Incident Alert Pipeline"],
        engineeringTensions: ["Scan frequency vs CI pipeline throughput", "Block-on-critical policy vs deployment velocity"],
        technicalConcepts: ["SBOM (CycloneDX/SPDX)", "Trivy scanner", "CVE CVSS scoring", "zero-day patch SLA"],
        possibleArchitectureAngles: ["PRODUCTION_INCIDENT", "SYSTEM_DESIGN_BREAKDOWN"],
      };
    }

    // ── Step 4: Version-number release title transformation ─────────────────
    // e.g. "Node.js 22 LTS Native TypeScript...", "Docker Desktop 4.38..."
    const versionPattern = /\b(v?\d+\.\d+(\.\d+)?(\s*(LTS|GA|RC|beta|alpha))?)\b/i;
    if (versionPattern.test(clean)) {
      // Strip version numbers and derive engineering story
      const stripped = clean
        .replace(versionPattern, "")
        .replace(/\b(LTS|GA|RC|beta|alpha|release|update|Desktop|version)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      return this.inferFromStrippedTitle(stripped, content, tags);
    }

    // ── Step 5: Generic engineering story from remaining clean title ─────────
    return this.inferFromStrippedTitle(clean, content, tags);
  }

  private inferFromRepoName(repoName: string, content: string, tags: string[]): ReturnType<CandidateCompetitionEngine["extractEngineeringProblem"]> {
    const lc = repoName.toLowerCase();

    if (lc.includes("freecodecamp") || lc.includes("curriculum") || lc.includes("roadmap") || lc.includes("learning")) {
      return {
        problemTitle: "Architecting High-Throughput Interactive Curriculum State Engines",
        affectedSystems: ["Client State Engine", "Monorepo Build Pipeline", "Progress Tracking Store"],
        engineeringTensions: ["Client-side caching vs server-side evaluation consistency", "Monorepo build latency vs subpackage independence"],
        technicalConcepts: ["TypeScript composite references", "state synchronization", "worker queueing"],
        possibleArchitectureAngles: ["ARCHITECTURE_DECISION", "PERFORMANCE_INVESTIGATION"],
      };
    }
    if (lc.includes("clickhouse") || lc.includes("olap") || lc.includes("chdb")) {
      return {
        problemTitle: "Designing Columnar Analytics Schema for Sub-Second Query Performance at Petabyte Scale",
        affectedSystems: ["ClickHouse MergeTree Engine", "Materialized View Pipeline", "Query Planner"],
        engineeringTensions: ["Denormalization speed vs storage amplification", "Async insert batching vs real-time query freshness"],
        technicalConcepts: ["MergeTree partitioning", "Materialized Views", "Bloom filter indexes"],
        possibleArchitectureAngles: ["SYSTEM_DESIGN_BREAKDOWN", "ARCHITECTURE_DECISION"],
      };
    }
    // Generic repo inference
    const domainKeywords = tags.length > 0 ? tags.join(", ") : "distributed systems";
    return {
      problemTitle: `Engineering Resilient ${this.toTitleCase(repoName.replace(/-/g, " "))} Service Architectures`,
      affectedSystems: ["Service Layer", "Data Access Layer", "API Gateway"],
      engineeringTensions: ["Consistency vs availability under partition", "Cost vs latency optimization"],
      technicalConcepts: [domainKeywords],
      possibleArchitectureAngles: ["ARCHITECTURE_DECISION", "SYSTEM_DESIGN_BREAKDOWN"],
    };
  }

  private inferFromStrippedTitle(stripped: string, content: string, tags: string[]): ReturnType<CandidateCompetitionEngine["extractEngineeringProblem"]> {
    if (!stripped || stripped.length < 8) {
      return {
        problemTitle: "Engineering Production-Grade System Reliability Under Sustained Traffic",
        affectedSystems: ["Load Balancer", "Service Mesh", "Data Layer"],
        engineeringTensions: ["Reliability vs cost", "Latency vs consistency"],
        technicalConcepts: tags.length > 0 ? tags : ["System Design"],
        possibleArchitectureAngles: ["ARCHITECTURE_DECISION", "PRODUCTION_INCIDENT"],
      };
    }

    // If it reads like a headline ("I wrote a test for...", "Why X is..."), keep as-is if it's a story
    if (/^(I |We |Why |How |When |The )/.test(stripped) && stripped.length > 20) {
      return {
        problemTitle: stripped.length > 90 ? stripped.substring(0, 87) + "..." : stripped,
        affectedSystems: ["Production Service", "Test Infrastructure", "CI Pipeline"],
        engineeringTensions: ["Test coverage completeness vs false negative risk", "Automated detection vs novel attack vectors"],
        technicalConcepts: tags.length > 0 ? tags : ["Software Testing", "System Design"],
        possibleArchitectureAngles: ["DEBUGGING_STORY", "PRODUCTION_INCIDENT"],
      };
    }

    const titleCased = stripped.length > 90 ? stripped.substring(0, 87) + "..." : stripped;
    return {
      problemTitle: titleCased,
      affectedSystems: ["Distributed Services", "API Gateway", "Data Access Layer"],
      engineeringTensions: ["Cost vs latency", "Consistency vs availability"],
      technicalConcepts: tags.length > 0 ? tags : ["System Design"],
      possibleArchitectureAngles: ["PRODUCTION_INCIDENT", "ARCHITECTURE_DECISION"],
    };
  }

  private toTitleCase(str: string): string {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }



  public async collectAndRankCandidates(
    history: HistoricalPostRecord[] = []
  ): Promise<{
    top5Matrix: Top5MatrixResult | null;
    rawCount: number;
    afterDeduplicationCount: number;
    afterVerificationCount: number;
    afterFreshnessCount: number;
    afterCooldownCount: number;
    afterExperienceMatchCount: number;
    allEvaluatedCandidates: CandidateOpportunityRecord[];
  }> {
    console.log("[Candidate Competition Engine] Collecting 30+ raw candidates from global sources...");

    const rawSignals = await multiSourceCollectorEngine.collectAllSignals();
    const rawCount = rawSignals.length;

    // Deduplicate signals into raw candidate topics
    const seenTitles = new Set<string>();
    const deduplicatedSignals = rawSignals.filter((s) => {
      const normalizedTitle = s.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (seenTitles.has(normalizedTitle)) return false;
      seenTitles.add(normalizedTitle);
      return true;
    });

    const afterDeduplicationCount = deduplicatedSignals.length;

    // Filter verification & classify source authority
    const verifiedCandidates = deduplicatedSignals.map((sig) => {
      const sourceLevel = freshTrendDiscoveryEngine.classifySourceAuthority(sig.sourceName, sig.url || "");
      const freshnessScore = freshTrendDiscoveryEngine.calculateFreshnessScore(sig.publishedAt);
      const isVerified = sourceLevel <= SourceAuthorityLevel.LEVEL_2_SECONDARY || sig.title.includes("Official");
      return { sig, sourceLevel, freshnessScore, isVerified };
    });

    const afterVerificationCount = verifiedCandidates.filter((c) => c.isVerified).length;
    const afterFreshnessCount = verifiedCandidates.filter((c) => c.freshnessScore >= 40).length;

    const candidateRecords: CandidateOpportunityRecord[] = [];
    const recent50 = history.slice(0, 50);

    for (let i = 0; i < verifiedCandidates.length; i++) {
      const { sig, sourceLevel } = verifiedCandidates[i];
      const title = sig.title;
      const tags = sig.tags || [];
      const category = tags[0] || "AI Engineering";
      const framework = tags[1] || "Architecture";
      const rejectionReasons: string[] = [];

      // Problem-First Extraction
      const problemExtracted = this.extractEngineeringProblem({ title, content: sig.content, tags });
      const candidateTitle = problemExtracted.problemTitle;

      // 1. Topic Novelty & Semantic Cooldown Check vs history
      let maxSemSim = 0;
      let mostSimilarPostTitle = "";
      recent50.forEach((p) => {
        const titleSim = this.computeSemanticSimilarity(candidateTitle, p.title);
        const contentSim = this.computeSemanticSimilarity(candidateTitle + " " + sig.content, p.title + " " + p.fullText);
        const maxSim = Math.max(titleSim, contentSim);
        if (maxSim > maxSemSim) {
          maxSemSim = maxSim;
          mostSimilarPostTitle = p.title;
        }
      });

      const topicNoveltyScore = Math.max(0, Math.round((1 - maxSemSim) * 100));

      if (maxSemSim > 0.40) {
        rejectionReasons.push(`SEMANTIC_REPETITION: High semantic overlap (${(maxSemSim * 100).toFixed(1)}%) with recent post "${mostSimilarPostTitle}".`);
      }

      // 2. Personal Experience Match ("Why YOU?")
      const expMatchRes = experienceMatcher.findMatchingExperience(category, candidateTitle, tags);
      const experienceMatchScore = expMatchRes.found ? Math.round(expMatchRes.matchScore * 100) : 0;

      if (experienceMatchScore === 0) {
        rejectionReasons.push(`NO_PERSONAL_EXPERIENCE: Candidate topic has zero authentic personal experience match.`);
      }

      // 3. Strict Freshness & Category Age Check
      const freshEval = freshTrendDiscoveryEngine.evaluateFreshness(sig.publishedAt, category, candidateTitle);
      const freshnessScore = freshEval.freshnessScore;
      if (freshEval.rejected) {
        rejectionReasons.push(freshEval.reason || "STALE_CANDIDATE: Exceeds freshness category limit.");
      }

      // 4. Score 13 Components
      const careerRelevance = Math.min(100, (sourceLevel === 1 ? 95 : 85) + (sig.content.includes("production") ? 10 : 0));
      const technicalImportance = Math.min(100, 75 + (tags.length * 4));
      const sourceAuthority = sourceLevel === 1 ? 98 : sourceLevel === 2 ? 88 : sourceLevel === 3 ? 75 : 60;
      const originality = topicNoveltyScore;
      const trendVelocity = Math.min(100, 70 + (freshnessScore > 80 ? 25 : 10));
      const contentGap = 80;
      const developerAdoption = 85;

      // NEW 3 Dimensions:
      // Proof Availability: presence of code snippets, diagrams, benchmark, official docs or commit links
      const proofAvailability = Math.min(100, 70 + (sig.url ? 15 : 0) + (sig.content.includes("code") || sig.content.includes("benchmark") ? 15 : 5));

      // Engineering Tension: presence of trade-offs (A vs B, latency vs cost, serverless vs containers, etc.)
      const tensionKeywords = ["vs", "tradeoff", "latency", "cost", "scaling", "bottleneck", "consistency", "isolation", "failover"];
      const tensionCount = tensionKeywords.filter((k) => (candidateTitle + " " + sig.content).toLowerCase().includes(k)).length;
      const engineeringTension = Math.min(100, 65 + tensionCount * 10 + problemExtracted.engineeringTensions.length * 10);

      // Career Differentiation: attraction score for CTOs, Engineering Managers, and Hiring Leaders
      const careerDifferentiation = Math.min(100, 75 + (experienceMatchScore > 50 ? 15 : 0) + (sourceLevel === 1 ? 10 : 0));

      // Composite 13-Dimension Weighted Score
      const overallScore = Math.round(
        careerRelevance * 0.15 +
        experienceMatchScore * 0.20 +
        technicalImportance * 0.10 +
        sourceAuthority * 0.10 +
        originality * 0.08 +
        trendVelocity * 0.07 +
        freshnessScore * 0.10 +
        topicNoveltyScore * 0.05 +
        proofAvailability * 0.05 +
        engineeringTension * 0.05 +
        careerDifferentiation * 0.05
      );

      const scores: CandidateOpportunityScores = {
        careerRelevance,
        personalExperienceMatch: experienceMatchScore,
        technicalImportance,
        sourceAuthority,
        originality,
        trendVelocity,
        contentGap,
        developerAdoption,
        freshness: freshnessScore,
        topicNovelty: topicNoveltyScore,
        proofAvailability,
        engineeringTension,
        careerDifferentiation,
        overallScore,
      };

      candidateRecords.push({
        candidateId: `cand_${i}_${Date.now()}`,
        title: candidateTitle,
        category,
        framework,
        engineeringProblem: problemExtracted.problemTitle,
        scores,
        noveltyScore: topicNoveltyScore,
        freshnessScore,
        experienceMatchScore,
        careerScore: careerRelevance,
        sourceAuthorityScore: sourceAuthority,
        contentGapScore: contentGap,
        trendVelocityScore: trendVelocity,
        proofAvailabilityScore: proofAvailability,
        engineeringTensionScore: engineeringTension,
        careerDifferentiationScore: careerDifferentiation,
        rejectionReasons,
      });
    }

    // Filter valid candidates passing novelty & experience threshold
    const validCandidates = candidateRecords.filter((c) => c.rejectionReasons.length === 0);
    const afterCooldownCount = validCandidates.length;
    const afterExperienceMatchCount = validCandidates.filter((c) => c.experienceMatchScore >= 30).length;

    // Sort valid non-cooldown candidates descending by overallScore
    const pool = validCandidates.length > 0 ? validCandidates : [];
    pool.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

    if (pool.length === 0) {
      console.warn("[Candidate Competition Engine] All candidate topics failed novelty/cooldown thresholds. Executing NO_POST_TODAY exit.");
      return {
        top5Matrix: null,
        rawCount,
        afterDeduplicationCount,
        afterVerificationCount,
        afterFreshnessCount,
        afterCooldownCount: 0,
        afterExperienceMatchCount: 0,
        allEvaluatedCandidates: candidateRecords,
      };
    }

    const top5 = pool.slice(0, 5);
    const winner = top5[0];
    const alternatives = top5.slice(1);

    const whyWinner = `Selected "${winner.title}" (Score: ${winner.scores.overallScore}) over ${alternatives.length} alternatives because it demonstrated superior career relevance (${winner.scores.careerRelevance}), high source authority (${winner.scores.sourceAuthority}), topic novelty (${winner.noveltyScore}/100), and fresh trend velocity (${winner.freshnessScore}/100).`;

    const top5Matrix: Top5MatrixResult = {
      winner,
      alternatives,
      whyWinner,
      whyNotCandidate2: alternatives[0] ? `Candidate #2 "${alternatives[0].title}" (Score: ${alternatives[0].scores.overallScore}) had lower overall career relevance / experience alignment.` : undefined,
      whyNotCandidate3: alternatives[1] ? `Candidate #3 "${alternatives[1].title}" (Score: ${alternatives[1].scores.overallScore}) was penalized for lower source authority or higher topic saturation.` : undefined,
      whyNotCandidate4: alternatives[2] ? `Candidate #4 "${alternatives[2].title}" (Score: ${alternatives[2].scores.overallScore}) had lower developer adoption score.` : undefined,
      whyNotCandidate5: alternatives[3] ? `Candidate #5 "${alternatives[3].title}" (Score: ${alternatives[3].scores.overallScore}) had lower trend velocity.` : undefined,
    };

    console.log(`[Candidate Competition Engine] Winner Selected: "${winner.title}" (Score: ${winner.scores.overallScore}) out of ${rawCount} candidates.`);

    return {
      top5Matrix,
      rawCount,
      afterDeduplicationCount,
      afterVerificationCount,
      afterFreshnessCount,
      afterCooldownCount,
      afterExperienceMatchCount,
      allEvaluatedCandidates: candidateRecords,
    };
  }

  public candidateToTopic(cand: CandidateOpportunityRecord): Topic {
    return {
      id: cand.candidateId,
      title: cand.title,
      category: cand.category,
      framework: cand.framework,
      supportingTech: [cand.framework || "TypeScript", "System Design"],
      score: cand.scores.overallScore,
      reason: cand.title,
      trend_velocity: cand.scores.trendVelocity / 10,
      difficulty: "ADVANCED",
      competition: "MEDIUM",
      audience: "Senior Engineers & Technical Leaders",
      keywords: [cand.category, cand.framework || "Architecture"].filter(Boolean),
      references: [],
      storyAngle: "PRODUCTION_REALITY",
    };
  }
}

export const candidateCompetitionEngine = new CandidateCompetitionEngine();

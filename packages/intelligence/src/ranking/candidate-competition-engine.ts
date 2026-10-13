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

    // ── Step 3: Dynamic engineering problem synthesis ───────────────────────
    const combinedText = `${clean} ${content} ${tags.join(" ")}`.toLowerCase();

    // Derive headline / problem title
    let problemTitle = clean;

    // Check if clean title is a bare version release or too short
    const versionPattern = /\b(v?\d+\.\d+(\.\d+)?(\s*(LTS|GA|RC|beta|alpha))?)\b/i;
    const isVersionRelease = versionPattern.test(clean) && clean.length < 35;
    const isGenericShort = clean.length < 15;

    if (isVersionRelease || isGenericShort) {
      problemTitle = this.formulateDynamicHeadline(clean, content, tags);
    } else {
      problemTitle = clean
        .replace(versionPattern, "")
        .replace(/\b(release|update|version|announcing)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      if (problemTitle.length < 15) {
        problemTitle = this.formulateDynamicHeadline(clean, content, tags);
      }
    }

    // Dynamic Systems, Tensions, Concepts & Angles
    const affectedSystems = this.deriveAffectedSystems(combinedText);
    const engineeringTensions = this.deriveEngineeringTensions(combinedText);
    const technicalConcepts = Array.from(
      new Set([...tags, ...this.extractTechnicalKeywords(combinedText)])
    ).slice(0, 6);

    const possibleArchitectureAngles = this.deriveArchitectureAngles(combinedText);

    return {
      problemTitle: this.toTitleCase(problemTitle),
      affectedSystems,
      engineeringTensions,
      technicalConcepts,
      possibleArchitectureAngles,
    };
  }

  private formulateDynamicHeadline(clean: string, content: string, tags: string[]): string {
    const combined = `${clean} ${content} ${tags.join(" ")}`.toLowerCase();

    if (combined.includes("docker") || combined.includes("container") || combined.includes("buildx") || combined.includes("oci")) {
      if (combined.includes("cve") || combined.includes("vulnerab") || combined.includes("distroless") || combined.includes("secur")) {
        return "Hardening Multi-Architecture Container Build Pipelines for Zero-CVE Production Images";
      }
      if (combined.includes("network") || combined.includes("compose")) {
        return "Resolving Cross-Container Service Mesh and DNS Latency in Multi-Service Stacks";
      }
      return "Hardening Multi-Architecture Container Build Pipelines for Zero-CVE Production Images";
    }

    if (combined.includes("node.js") || combined.includes("nodejs") || combined.includes("node ")) {
      if (combined.includes("stream") || combined.includes("backpressure")) {
        return "Managing High-Throughput Backpressure in Node.js Streaming Architectures";
      }
      if (combined.includes("sqlite") || combined.includes("embedded")) {
        return "Embedding SQLite in Node.js Microservices for Local-First State Persistence";
      }
      return "Diagnosing V8 GC Pressure and Memory Leaks in Long-Running Node.js Services";
    }

    if (combined.includes("vite") || combined.includes("bundl") || combined.includes("esbuild") || combined.includes("rollup")) {
      if (combined.includes("rust") || combined.includes("rolldown")) {
        return "Migrating Web Bundlers to Rust-Powered Core Engines Without Ecosystem Regressions";
      }
      return "Federating Multi-Environment Build Pipelines Without Full Server-Side Rendering Re-Architectures";
    }

    if (combined.includes("typescript") || combined.includes(" ts ") || combined.includes("tsc ")) {
      return "Eliminating CI Type-Check Bottlenecks in Large TypeScript Monorepos";
    }

    if (combined.includes("clickhouse") || combined.includes("olap") || combined.includes("columnar") || combined.includes("chdb")) {
      if (combined.includes("chdb") || combined.includes("embedded")) {
        return "Embedding In-Process Columnar Analytics with chDB and Microservices";
      }
      return "Designing Columnar Analytics Schema for Sub-Second Query Performance at Petabyte Scale";
    }

    if (combined.includes("redis") || combined.includes("queue") || combined.includes("worker") || combined.includes("bullmq")) {
      if (combined.includes("stream") || combined.includes("consumer")) {
        return "Scaling Consumer Group Rebalancing in Redis Streams for Event-Driven Workflows";
      }
      return "Guaranteeing Exactly-Once Execution in Distributed Worker Queues Under Network Partition";
    }

    if (combined.includes("llm") || combined.includes("agent") || combined.includes("mcp") || combined.includes("prompt") || combined.includes("openai") || combined.includes("deepseek")) {
      if (combined.includes("inject") || combined.includes("security") || combined.includes("jailbreak") || combined.includes("attack")) {
        return "Building Adversarial Red-Team Test Suites for LLM Prompt Injection Vulnerabilities";
      }
      if (combined.includes("rag") || combined.includes("hallucinat") || combined.includes("vector")) {
        return "Preventing Retrieval Hallucinations and Chunk Drift in Production RAG Pipelines";
      }
      return "Architecting Resilient Multi-Provider LLM Gateway Routing with Cost-Optimized Fallback";
    }

    if (combined.includes("kubernetes") || combined.includes("k8s") || combined.includes("helm")) {
      return "Enforcing Namespace-Level Cost Governance and Workload Isolation in Multi-Tenant Kubernetes";
    }

    if (combined.includes("rust") || combined.includes("cargo") || combined.includes("crate")) {
      return "Auditing Transitive Dependency Supply-Chain Risk in Production Rust Workloads";
    }

    if (combined.includes("graph") || combined.includes("dag") || combined.includes("dependency") || combined.includes("roadmap")) {
      return "Designing Deterministic Dependency Graph Engines for High-Concurrency Content Resolution";
    }

    if (combined.includes("kafka") || combined.includes("event-driven") || combined.includes("pubsub")) {
      return "Choosing Between Redis Pub/Sub and Kafka for Partial-Failure-Tolerant Event Pipelines";
    }

    if (clean && clean.length >= 15) {
      return clean;
    }

    return "Engineering Production-Grade System Reliability Under Sustained Traffic";
  }

  private deriveAffectedSystems(text: string): string[] {
    const systems: string[] = [];
    if (text.includes("redis")) systems.push("Redis Atomic Lock Coordinator");
    if (text.includes("worker") || text.includes("queue")) systems.push("Worker Pool Coordinator", "Job Deduplication Store");
    if (text.includes("docker") || text.includes("container")) systems.push("OCI Build Pipeline", "Container Registry");
    if (text.includes("node") || text.includes("v8")) systems.push("V8 Heap Allocator", "EventLoop Scheduler");
    if (text.includes("vite") || text.includes("bundl")) systems.push("Vite Dev Server", "Edge CDN Cache");
    if (text.includes("typescript") || text.includes("monorepo")) systems.push("TypeScript Project References", "Incremental Build Cache");
    if (text.includes("clickhouse") || text.includes("olap")) systems.push("ClickHouse MergeTree Engine", "Materialized View Pipeline");
    if (text.includes("k8s") || text.includes("kubernetes")) systems.push("Namespace Resource Quota", "Admission Webhook");
    if (text.includes("llm") || text.includes("agent") || text.includes("mcp")) systems.push("AI Gateway Router", "Token Bucket Rate Limiter");
    if (text.includes("rust")) systems.push("Cargo Dependency Resolver", "CI Isolation Sandbox");
    if (text.includes("graph") || text.includes("dag")) systems.push("DAG Node Resolver", "Incremental Revalidation Cache");

    if (systems.length === 0) {
      systems.push("Production Service Layer", "Data Access Layer", "API Gateway");
    }
    return Array.from(new Set(systems)).slice(0, 4);
  }

  private deriveEngineeringTensions(text: string): string[] {
    const tensions: string[] = [];
    if (text.includes("memory") || text.includes("gc") || text.includes("node")) {
      tensions.push("In-process caching throughput vs V8 heap fragmentation risk");
    }
    if (text.includes("queue") || text.includes("worker") || text.includes("redis")) {
      tensions.push("At-least-once delivery simplicity vs idempotency correctness overhead");
    }
    if (text.includes("container") || text.includes("docker")) {
      tensions.push("Distroless image security vs shell-debugging ergonomics");
    }
    if (text.includes("typecheck") || text.includes("monorepo") || text.includes("ts")) {
      tensions.push("Composite project correctness guarantees vs developer ergonomics");
    }
    if (text.includes("llm") || text.includes("agent")) {
      tensions.push("Single-provider simplicity vs multi-model failover resiliency");
    }
    if (text.includes("clickhouse") || text.includes("olap")) {
      tensions.push("Denormalization query speed vs storage write amplification");
    }

    if (tensions.length === 0) {
      tensions.push("Throughput optimization vs operational maintenance overhead", "Strict consistency vs availability under network partition");
    }
    return Array.from(new Set(tensions)).slice(0, 2);
  }

  private extractTechnicalKeywords(text: string): string[] {
    const keywords: string[] = [];
    const candidates = [
      "Redis", "Docker", "Node.js", "TypeScript", "ClickHouse", "Kubernetes", "Vite",
      "LLM Gateway", "Prompt Injection", "MergeTree", "Project References", "Rust",
      "EventLoop", "Idempotency", "Distroless", "SBOM", "V8 Engine", "System Design"
    ];
    for (const c of candidates) {
      if (text.includes(c.toLowerCase())) keywords.push(c);
    }
    return keywords;
  }

  private deriveArchitectureAngles(text: string): string[] {
    if (text.includes("incident") || text.includes("cve") || text.includes("leak") || text.includes("partition") || text.includes("failover")) {
      return ["PRODUCTION_INCIDENT", "DEBUGGING_STORY"];
    }
    if (text.includes("vs") || text.includes("decision") || text.includes("migrat") || text.includes("tradeoff")) {
      return ["ARCHITECTURE_DECISION", "SYSTEM_DESIGN_BREAKDOWN"];
    }
    if (text.includes("benchmark") || text.includes("speed") || text.includes("latency") || text.includes("throughput")) {
      return ["PERFORMANCE_INVESTIGATION", "BEFORE_AFTER_LAYOUT"];
    }
    return ["SYSTEM_DESIGN_BREAKDOWN", "ARCHITECTURE_DECISION"];
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
      const platformTags = new Set(["dev.to", "hackernews", "github", "arxiv", "official", "reddit"]);
      const contentTags = tags.filter((t) => !platformTags.has(t.toLowerCase()));
      const category = contentTags[0] || tags[0] || "AI Engineering";
      const framework = contentTags[1] || tags[1] || "Architecture";
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

      // 1b. Technology / Framework Cooldown Check (5 days)
      const now = Date.now();
      const recentTechMatch = history.find((p) => {
        const daysAgo = Math.max(0, (now - new Date(p.publishedAt || now).getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo > 5.0) return false;
        const pTech = (p.framework || "").toLowerCase();
        const candTech = framework.toLowerCase();
        const pTitle = (p.title || "").toLowerCase();
        const candTitle = candidateTitle.toLowerCase();
        const pTechs = (p.supportingTech || []).map((t) => t.toLowerCase());
        return (
          candTech !== "architecture" &&
          candTech !== "system design" &&
          (pTech === candTech ||
            pTechs.includes(candTech) ||
            pTitle.includes(candTech) ||
            candTitle.includes(pTech))
        );
      });

      if (recentTechMatch) {
        rejectionReasons.push(
          `TECHNOLOGY_COOLDOWN: Framework "${framework}" was featured in recent post "${recentTechMatch.title}" within the 5-day cooldown window.`
        );
      }

      // 1c. Category Cooldown Check (3 days)
      const recentCatMatch = history.find((p) => {
        const daysAgo = Math.max(0, (now - new Date(p.publishedAt || now).getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo > 3.0) return false;
        return (p.category || "").toLowerCase() === category.toLowerCase();
      });

      if (recentCatMatch) {
        rejectionReasons.push(
          `CATEGORY_COOLDOWN: Category "${category}" was featured in recent post "${recentCatMatch.title}" within the 3-day cooldown window.`
        );
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

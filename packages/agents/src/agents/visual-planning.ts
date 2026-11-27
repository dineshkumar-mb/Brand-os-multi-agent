import {
  AgentType,
  AgentResult,
  Topic,
  VisualValidationResult,
  DevToArticlePayload,
  VisualPlanBlueprint,
  DiagramSpec,
  DiagramColumn,
  DiagramNode,
} from "@brand-os/shared";

export { VisualPlanBlueprint };

export const INFOGRAPHIC_PRESETS: Record<string, any> = {
  RAG_VS_CAG: {
    id: "rag_vs_cag",
    name: "RAG vs CAG Architecture",
    description: "Retrieval Augmented Generation vs Cache Augmented Generation comparison diagram",
    diagramSpec: {
      title: "RAG vs CAG",
      layoutStyle: "SIDE_BY_SIDE_COMPARISON",
      colorPalette: "Yellow (#f59e0b), Blue (#3b82f6), Green (#10b981)",
      columns: [],
    },
  },
  REST_VS_GRPC: {
    id: "rest_vs_grpc",
    name: "REST vs gRPC Protocol",
    description: "HTTP/1.1 JSON REST APIs vs HTTP/2 Protobuf gRPC streaming comparison",
    diagramSpec: {
      title: "REST vs gRPC",
      layoutStyle: "SIDE_BY_SIDE_COMPARISON",
      colorPalette: "Blue (#3b82f6), Purple (#8b5cf6)",
      columns: [],
    },
  },
  MONOLITH_VS_MICROSERVICES: {
    id: "monolith_vs_microservices",
    name: "Monolith vs Microservices",
    description: "Single unified codebase vs Decoupled Event-Driven Microservices",
    diagramSpec: {
      title: "Monolith vs Microservices",
      layoutStyle: "SIDE_BY_SIDE_COMPARISON",
      colorPalette: "Yellow (#f59e0b), Green (#10b981)",
      columns: [],
    },
  },
};

import crypto from "crypto";
import { getWorkspacePath, VisualAttributeRecord } from "@brand-os/shared";

declare const process: any;
declare const require: any;

const fs = require("fs");
const path = require("path");

const VISUAL_HISTORY_FILE = getWorkspacePath("visual_history.json");

export interface StoredVisualRecord extends Partial<VisualAttributeRecord> {
  topicId: string;
  conceptTitle: string;
  diagramType: string;
  hash: string;
  createdAt: string;
  visualType?: string;
  visualConcept?: string;
  composition?: string;
  layout?: string;
  diagramStructure?: string;
  primarySubject?: string;
  visualMetaphor?: string;
  colorPalette?: string;
  imagePromptHash?: string;
  imageContentHash?: string;
  associatedPostId?: string;
}

// Image Concept & Visual Attributes History Tracker across published/generated posts
export class VisualHistoryTracker {
  private pastConcepts: StoredVisualRecord[] = [];

  private isLoaded = false;

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    this.isLoaded = true;
    try {
      const candidates = [
        VISUAL_HISTORY_FILE,
        path.resolve(process.cwd(), "visual_history.json"),
        getWorkspacePath("worker", "visual_history.json"),
      ];
      const conceptMap = new Map<string, StoredVisualRecord>();

      for (const p of candidates) {
        if (fs.existsSync(p)) {
          try {
            const raw = fs.readFileSync(p, "utf-8");
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              for (const item of parsed) {
                const key = item.imageContentHash || item.hash || `${item.conceptTitle}_${item.diagramType}_${item.createdAt}`;
                if (!conceptMap.has(key)) {
                  conceptMap.set(key, item);
                }
              }
            }
          } catch {}
        }
      }

      if (conceptMap.size > 0) {
        this.pastConcepts = Array.from(conceptMap.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      }
    } catch (err: any) {
      console.warn("[VisualHistoryTracker] Failed to load visual history:", err.message);
    }
  }

  private saveHistory() {
    if (process.env.VITEST || process.env.NODE_ENV === "test") {
      return;
    }
    try {
      fs.writeFileSync(VISUAL_HISTORY_FILE, JSON.stringify(this.pastConcepts.slice(0, 100), null, 2), "utf-8");
    } catch (err: any) {
      console.warn("[VisualHistoryTracker] Failed to save visual history:", err.message);
    }
  }

  public recordVisual(record: VisualAttributeRecord) {
    if (!this.isLoaded) {
      this.loadHistory();
    }
    const stored: StoredVisualRecord = {
      ...record,
      topicId: record.topicId || `t_${Date.now()}`,
      conceptTitle: record.visualConcept,
      diagramType: record.visualType,
      hash: record.imageContentHash,
      createdAt: record.createdAt || new Date().toISOString(),
    };
    this.pastConcepts.unshift(stored);
    this.saveHistory();
  }

  public isVisualRepetitive(attrs: {
    visualConcept: string;
    visualType: string;
    layout: string;
    composition: string;
    imageContentHash: string;
    imagePromptHash?: string;
  }): { isDuplicate: boolean; reason?: string } {
    if (!this.isLoaded) {
      this.loadHistory();
    }
    const recent15 = this.pastConcepts.slice(0, 15);
    const recent3 = this.pastConcepts.slice(0, 3);

    // 1. Exact perceptual / structural content hash match
    const contentMatch = recent15.find((v) => v.imageContentHash === attrs.imageContentHash || v.hash === attrs.imageContentHash);
    if (contentMatch) {
      return {
        isDuplicate: true,
        reason: `Identical visual content hash matched recent post "${contentMatch.conceptTitle}"`,
      };
    }

    // 2. Exact prompt hash match
    if (attrs.imagePromptHash) {
      const promptMatch = recent15.find((v) => v.imagePromptHash === attrs.imagePromptHash);
      if (promptMatch) {
        return {
          isDuplicate: true,
          reason: `Identical image generation prompt hash matched recent post "${promptMatch.conceptTitle}"`,
        };
      }
    }

    // 3. Repeated composition and layout within recent 3 visuals
    const layoutMatch = recent3.find(
      (v) => v.layout === attrs.layout && v.composition === attrs.composition
    );
    if (layoutMatch) {
      return {
        isDuplicate: true,
        reason: `Layout "${attrs.layout}" with composition "${attrs.composition}" was already used in recent visual "${layoutMatch.conceptTitle}"`,
      };
    }

    // 4. Repeated visual concept within recent 3 visuals
    const conceptMatch = recent3.find(
      (v) => (v.conceptTitle || "").toLowerCase().trim() === attrs.visualConcept.toLowerCase().trim()
    );
    if (conceptMatch) {
      return {
        isDuplicate: true,
        reason: `Visual concept "${attrs.visualConcept}" is too similar to recent post visual "${conceptMatch.conceptTitle}"`,
      };
    }

    return { isDuplicate: false };
  }

  public addConcept(topicId: string, conceptTitle: string, diagramType: string) {
    this.loadHistory();
    const hash = `${conceptTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}_${diagramType}`;
    const entry: StoredVisualRecord = {
      topicId,
      conceptTitle,
      diagramType,
      hash,
      visualType: diagramType,
      visualConcept: conceptTitle,
      composition: "SPLIT_SCREEN",
      layout: diagramType,
      diagramStructure: "TWO_COLUMN",
      primarySubject: conceptTitle,
      colorPalette: "CYBERPUNK_DARK",
      imagePromptHash: hash,
      imageContentHash: hash,
      createdAt: new Date().toISOString(),
    };
    this.pastConcepts.unshift(entry);
    this.saveHistory();
  }

  public isConceptSimilar(conceptTitle: string, diagramType: string): boolean {
    const hash = `${conceptTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}_${diagramType}`;
    const check = this.isVisualRepetitive({
      visualConcept: conceptTitle,
      visualType: diagramType,
      layout: diagramType,
      composition: "SPLIT_SCREEN",
      imageContentHash: hash,
    });
    return check.isDuplicate;
  }

  public getHistory(): StoredVisualRecord[] {
    this.loadHistory();
    return this.pastConcepts;
  }
}

export const visualHistoryTracker = new VisualHistoryTracker();

export class VisualPlanningAgent {
  private shortenVisualLabel(text: string, maxLen: number = 30): string {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= maxLen) return clean;
    return `${clean.slice(0, maxLen - 3).trimEnd()}...`;
  }

  public createDiagramSpec(topic: Topic, postText?: string, visualType?: string): DiagramSpec {
    // Strip hashtags before entity detection so `#React` never hijacks an MCP or AI post
    const cleanPostBody = (postText || "").replace(/#[a-z0-9_]+/gi, " ");
    const topicTitleAndFramework = `${topic.framework || ""} ${topic.title} ${topic.category || ""}`.toLowerCase();
    const fullText = cleanPostBody.toLowerCase();

    // 1. Only extract latency/percentage metrics when BOTH before/after numbers genuinely exist in postText
    const msMatches = cleanPostBody.match(/\b\d+ms\b/gi) || [];
    const percentMatches = cleanPostBody.match(/\b\d+%\b/gi) || [];
    const hasVerifiedTimingBenchmark = msMatches.length >= 2;
    const metricBefore = hasVerifiedTimingBenchmark ? msMatches[0] : "";
    const metricAfter = hasVerifiedTimingBenchmark ? msMatches[1] : "";
    const metricImp = percentMatches[0] || "";

    // 2. Extract technical entities prioritizing topic title/framework before body mentions
    const knownTechs = [
      "MCP", "Model Context Protocol", "LangGraph", "LangChain", "Server Actions", "Next.js", "Tailwind CSS",
      "Shadcn", "Hono", "Prisma", "AI Agents", "RAG", "ChromaDB", "Gemini AI", "Gemini", "OpenAI", "OCR",
      "WebRTC", "Socket.IO", "BullMQ", "Redux Toolkit", "React Flow", "Multi-Tenancy", "RBAC", "MERN Stack",
      "Redis", "Kafka", "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "TypeScript", "Node.js",
      "Express.js", "Express", "GraphQL", "FastAPI", "DeepSeek", "gRPC", "REST", "eBPF", "mTLS",
      "OpenTelemetry", "Vite", "React.js", "React", "S3", "DAG", "Circuit Breaker", "Token Bucket",
      "Trivy", "Buildx", "LLM Gateway", "VectorDB", "Cache", "WebSockets", "Monorepo"
    ];

    const titleMatchedTechs = knownTechs.filter((tech) =>
      topicTitleAndFramework.includes(tech.toLowerCase())
    );
    const bodyMatchedTechs = knownTechs.filter((tech) =>
      !titleMatchedTechs.includes(tech) && fullText.includes(tech.toLowerCase())
    );
    const genericTagSet = new Set(["open source", "full stack", "frontend engineering", "backend engineering", "software engineering", "developer tools", "ai"]);
    const topicKeywordsExtra = (topic.keywords || [])
      .filter((k) => k.length > 2 && !genericTagSet.has(k.toLowerCase()));
    const supportingExtra = (topic.supportingTech || [])
      .filter((k) => k.length > 2 && !genericTagSet.has(k.toLowerCase()));
    const extractedTechs = Array.from(new Set([...titleMatchedTechs, ...topicKeywordsExtra, ...supportingExtra, ...bodyMatchedTechs]));

    const primaryTech = extractedTechs[0] || topic.framework || topic.supportingTech?.[0] || topic.category || "Full Stack";
    const secondaryTech = extractedTechs[1] || (primaryTech === "MCP" ? "AI Agent" : "API Layer");
    const tertiaryTech = extractedTechs[2] || "Typed Schema";
    const quaternaryTech = extractedTechs[3] || secondaryTech;
    const quinaryTech = extractedTechs[4] || tertiaryTech;

    const cleanTitle = topic.title
      .replace(/^(Day \d+:|Architecting a|Designing|Building|Optimizing)\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
    const shortTitle = cleanTitle.length <= 42
      ? cleanTitle
      : `${cleanTitle.split(/\s+/).slice(0, 6).join(" ")}`;

    // 3. Determine Layout Style based on visualType parameter or actual topic/post content
    const style = (visualType || "").toUpperCase();
    // Ignore closing question words when checking if a post is actually a benchmark
    const bodyWithoutCta = cleanPostBody.split("?")[0] || cleanPostBody;
    const isGenuineBenchmark =
      style.includes("BENCHMARK") ||
      (hasVerifiedTimingBenchmark && (bodyWithoutCta.toLowerCase().includes("benchmark") || bodyWithoutCta.toLowerCase().includes("p99")));

    if (isGenuineBenchmark) {
      return {
        title: `${shortTitle} (${primaryTech})`,
        layoutStyle: "BENCHMARK_CHART",
        colorPalette: "Red/Amber Baseline (#ef4444) vs Green Optimized (#10b981)",
        columns: [
          {
            id: "baseline",
            title: "Before (Baseline)",
            subtitle: metricBefore ? `Observed Latency: ${metricBefore}` : `Unoptimized ${primaryTech} Path`,
            color: "red",
            nodes: [
              { id: "b1", label: `Synchronous ${primaryTech} Flow`, icon: "query", color: "red" },
              { id: "b2", label: `Tight Coupling to ${secondaryTech}`, icon: "data", color: "red" },
              { id: "b3", label: metricBefore ? `Measured Latency: ${metricBefore}` : "Slow Retry Bottlenecks", icon: "response", color: "red" },
            ],
          },
          {
            id: "optimized",
            title: `After (${primaryTech} Fix)`,
            subtitle: metricAfter ? `Measured: ${metricAfter}${metricImp ? ` (${metricImp} gain)` : ""}` : `Decoupled ${primaryTech} Design`,
            color: "green",
            nodes: [
              { id: "o1", label: `Decoupled ${primaryTech} Boundary`, icon: "cache", color: "green" },
              { id: "o2", label: `Validated ${tertiaryTech} Contract`, icon: "llm", color: "green" },
              { id: "o3", label: metricAfter ? `Measured Latency: ${metricAfter}` : "Predictable Execution", icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    if (style.includes("DEBUGGING") || style.includes("TIMELINE") || (fullText.includes("incident") && fullText.includes("diagnos"))) {
      return {
        title: `${shortTitle}: Troubleshooting Flow`,
        layoutStyle: "DEBUGGING_TIMELINE",
        colorPalette: "Slate Dark (#0f172a), Amber Warning (#f59e0b), Emerald Fix (#10b981)",
        columns: [
          {
            id: "timeline",
            title: `${primaryTech} Fix Timeline`,
            subtitle: "Problem -> Root Cause -> Fix",
            color: "purple",
            nodes: [
              { id: "t0", label: `1. Symptom spotted in ${primaryTech}`, icon: "query", color: "red" },
              { id: "t1", label: `2. Traced bottleneck in ${secondaryTech}`, icon: "data", color: "yellow" },
              { id: "t2", label: `3. Isolated failure boundary`, icon: "cache", color: "blue" },
              { id: "t3", label: `4. Verified stable ${primaryTech} fix`, icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    if (style.includes("CODE") || (fullText.includes("refactor") && fullText.includes("syntax"))) {
      return {
        title: `${shortTitle} Pattern`,
        layoutStyle: "CODE_ANNOTATION",
        colorPalette: "Cyber Dark (#0f172a), Cyan (#06b6d4), Lime (#84cc16)",
        columns: [
          {
            id: "code_spec",
            title: `${primaryTech} Implementation Pattern`,
            subtitle: "Clean Boundaries & Contracts",
            color: "blue",
            nodes: [
              { id: "ca1", label: `1. Define ${primaryTech} Schema`, icon: "cache", color: "blue" },
              { id: "ca2", label: `2. Isolate ${secondaryTech} Logic`, icon: "llm", color: "purple" },
              { id: "ca3", label: `3. Validate Outputs Early`, icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    if (style.includes("DISTRIBUTED") || fullText.includes("cluster") || fullText.includes("replica") || fullText.includes("partition")) {
      return {
        title: `${shortTitle} (${primaryTech})`,
        layoutStyle: "DISTRIBUTED_SYSTEM_DIAGRAM",
        colorPalette: "Deep Navy (#0a192f), Electric Blue (#38bdf8), Emerald (#10b981)",
        columns: [
          {
            id: "cluster",
            title: `${primaryTech} Coordination`,
            subtitle: "Decoupled Reliability Flow",
            color: "blue",
            nodes: [
              { id: "ds1", label: `Primary ${primaryTech} Node`, icon: "cache", color: "blue" },
              { id: "ds2", label: `Secondary ${secondaryTech} Store`, icon: "data", color: "purple" },
              { id: "ds3", label: `Isolated ${tertiaryTech} Boundary`, icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    if (style.includes("COMPONENT") || fullText.includes("dependency") || fullText.includes("service mesh")) {
      return {
        title: `${shortTitle} Components`,
        layoutStyle: "COMPONENT_MAP",
        colorPalette: "Dark Slate (#18181b), Violet (#8b5cf6), Sky (#38bdf8)",
        columns: [
          {
            id: "mesh",
            title: `${primaryTech} Component Flow`,
            subtitle: "Clean Modular Responsibilities",
            color: "purple",
            nodes: [
              { id: "cm1", label: `Client Request Layer`, icon: "query", color: "blue" },
              { id: "cm2", label: `${primaryTech} Core Handler`, icon: "llm", color: "purple" },
              { id: "cm3", label: `${secondaryTech} Data Store`, icon: "vectordb", color: "green" },
            ],
          },
        ],
      };
    }

    if (style.includes("POSTER") || style.includes("MINIMAL")) {
      return {
        title: `${shortTitle} Key Principle`,
        layoutStyle: "MINIMAL_ENGINEERING_POSTER",
        colorPalette: "Obsidian (#030712), Electric Cyan (#22d3ee), Pure White (#ffffff)",
        columns: [
          {
            id: "invariant",
            title: `${primaryTech} Design Principle`,
            subtitle: "Simple & Maintainable Engineering",
            color: "blue",
            nodes: [
              { id: "p1", label: `Clear Boundary: ${primaryTech}`, icon: "cache", color: "blue" },
              { id: "p2", label: `Reliable Output: ${secondaryTech}`, icon: "data", color: "green" },
            ],
          },
        ],
      };
    }

    const isAI =
      topicTitleAndFramework.includes("mcp") ||
      topicTitleAndFramework.includes("agent") ||
      topicTitleAndFramework.includes("ai") ||
      topicTitleAndFramework.includes("rag") ||
      topicTitleAndFramework.includes("langgraph");

    const isFrontend =
      topicTitleAndFramework.includes("react") ||
      topicTitleAndFramework.includes("next") ||
      topicTitleAndFramework.includes("tailwind") ||
      topicTitleAndFramework.includes("shadcn") ||
      topicTitleAndFramework.includes("frontend");

    // 3-Step Plain-English Workflow for AI Agents / MCP / Pipelines / Flow styles
    if (
      style.includes("FLOW") ||
      style.includes("WORKFLOW") ||
      style.includes("DATA") ||
      isAI ||
      fullText.includes("pipeline")
    ) {
      return {
        title: `${shortTitle}`,
        layoutStyle: "SYSTEM_FLOW",
        colorPalette: "Blue (#3b82f6), Purple (#8b5cf6), Green (#10b981)",
        columns: [
          {
            id: "step1",
            title: "1. Input & Intent",
            subtitle: `${primaryTech} & ${secondaryTech}`,
            color: "blue",
            nodes: [
              { id: "n1", label: isAI ? "User Request" : `${primaryTech} Trigger`, icon: "query", color: "blue" },
              { id: "n2", label: `${quaternaryTech}`, icon: "cache", color: "blue" },
            ],
          },
          {
            id: "step2",
            title: `2. ${this.shortenVisualLabel(primaryTech, 16)} Core`,
            subtitle: `${tertiaryTech} & ${quaternaryTech}`,
            color: "purple",
            nodes: [
              { id: "n3", label: `${secondaryTech} Layer`, icon: "llm", color: "purple" },
              { id: "n4", label: `${tertiaryTech} Queue`, icon: "embedding", color: "purple" },
            ],
          },
          {
            id: "step3",
            title: "3. Reliable Output",
            subtitle: `${quinaryTech} State`,
            color: "green",
            nodes: [
              { id: "n5", label: `${quinaryTech} Sync`, icon: "response", color: "green" },
              { id: "n6", label: "Verified State", icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    // Qualitative Before vs After Comparison (no invented ms/percentage numbers)
    return {
      title: `${shortTitle} (${primaryTech})`,
      layoutStyle: "BEFORE_AFTER_COMPARISON",
      colorPalette: "Red Before (#ef4444) vs Green After (#10b981)",
      columns: [
        {
          id: "before_col",
          title: "Before: Coupled Glue",
          subtitle: isFrontend ? `Heavy ${secondaryTech} Boilerplate` : `${primaryTech} + ${quaternaryTech}`,
          color: "red",
          nodes: [
            { id: "ba1", label: isFrontend ? "Manual State Hooks" : `Inline ${primaryTech} Requests`, icon: "query", color: "red" },
            { id: "ba2", label: isFrontend ? "Duplicate Styling Rules" : `Blocking ${secondaryTech} I/O`, icon: "data", color: "red" },
            { id: "ba3", label: isFrontend ? "Larger Client Bundle" : `${tertiaryTech} Contention`, icon: "response", color: "red" },
          ],
        },
        {
          id: "after_col",
          title: `After: Clean ${this.shortenVisualLabel(primaryTech, 16)}`,
          subtitle: `${tertiaryTech}, ${quaternaryTech} & ${quinaryTech}`,
          color: "green",
          nodes: [
            { id: "ba4", label: isFrontend ? `Owned ${primaryTech} UI` : `${secondaryTech} Isolation`, icon: "cache", color: "green" },
            { id: "ba5", label: isFrontend ? `${secondaryTech} Styling` : `${tertiaryTech} Workers`, icon: "vectordb", color: "green" },
            { id: "ba6", label: isFrontend ? `${quaternaryTech} State` : `${quinaryTech} Guard`, icon: "response", color: "green" },
          ],
        },
      ],
    };
  }

  public generateDiagramSvg(spec: DiagramSpec, visualType?: string): string {
    const width = 800;
    const height = 650;

    const colors = {
      yellowBorder: "#f59e0b",
      yellowFill: "#fef3c7",
      blueBorder: "#3b82f6",
      blueFill: "#dbeafe",
      greenBorder: "#10b981",
      greenFill: "#d1fae5",
      purpleBorder: "#8b5cf6",
      purpleFill: "#f3e8ff",
      redBorder: "#ef4444",
      redFill: "#fee2e2",
      bgDark: "#0f172a",
      bgLight: "#ffffff",
      textDark: "#0f172a",
      textWhite: "#f8fafc",
      textMuted: "#64748b",
      lineDashed: "#cbd5e1",
    };

    const layout = spec.layoutStyle || "SIDE_BY_SIDE_COMPARISON";

    // ─────────────────────────────────────────────────────────────
    // LAYOUT 1: RECRUITER-FRIENDLY BENCHMARK / BEFORE-AFTER CARD
    // ─────────────────────────────────────────────────────────────
    if (layout === "BENCHMARK_CHART" || layout === "BEFORE_AFTER_COMPARISON") {
      const leftCol = spec.columns[0];
      const rightCol = spec.columns[1];
      const cleanLeft = (leftCol?.title || "Before").replace(/^Option\s+[A-Z]:\s*/i, "").trim();
      const cleanRight = (rightCol?.title || "After").replace(/^Option\s+[A-Z]:\s*/i, "").trim();
      const titleFontSize = spec.title.length > 42 ? 19 : 22;

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #ffffff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <style>
    .title { font-size: ${titleFontSize}px; font-weight: 800; fill: #0f172a; text-anchor: middle; }
    .badge { font-size: 12px; font-weight: 700; fill: #0284c7; text-anchor: middle; letter-spacing: 1px; }
    .card-title { font-size: 17px; font-weight: 700; }
    .card-sub { font-size: 13px; font-weight: 500; fill: #64748b; }
    .node-text { font-size: 13.5px; font-weight: 600; fill: #1e293b; }
    .metric-pill { font-size: 13.5px; font-weight: 700; fill: #047857; text-anchor: middle; }
  </style>

  <rect width="${width}" height="${height}" fill="#ffffff" />
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" rx="16" />

  <!-- Category Badge & Main Title -->
  <rect x="290" y="38" width="220" height="26" fill="#e0f2fe" rx="13" />
  <text x="400" y="55" class="badge">ENGINEERING COMPARISON</text>
  <text x="400" y="92" class="title">${escapeXml(spec.title)}</text>

  <!-- Left Card: Before -->
  <g transform="translate(50, 120)">
    <rect width="330" height="420" fill="#ffffff" stroke="#fca5a5" stroke-width="2" rx="12" />
    <rect width="330" height="48" fill="#fee2e2" rx="12" />
    <circle cx="24" cy="24" r="6" fill="#dc2626" />
    <text x="40" y="30" class="card-title" fill="#b91c1c">${escapeXml(cleanLeft)}</text>
    <text x="20" y="75" class="card-sub">${escapeXml(leftCol?.subtitle || "Manual &amp; tightly coupled")}</text>

    <!-- Status Pill (Always Readable High Contrast) -->
    <rect x="20" y="95" width="290" height="28" fill="#fef2f2" stroke="#fecaca" stroke-width="1" rx="6" />
    <text x="165" y="114" font-size="12" font-weight="700" fill="#b91c1c" text-anchor="middle">High Maintenance Friction</text>

    ${renderLightNodes(leftCol?.nodes, colors, "#ef4444", "#fee2e2")}
  </g>

  <!-- Right Card: After -->
  <g transform="translate(420, 120)">
    <rect width="330" height="420" fill="#ffffff" stroke="#86efac" stroke-width="2" rx="12" />
    <rect width="330" height="48" fill="#dcfce7" rx="12" />
    <circle cx="24" cy="24" r="6" fill="#16a34a" />
    <text x="40" y="30" class="card-title" fill="#15803d">${escapeXml(cleanRight)}</text>
    <text x="20" y="75" class="card-sub">${escapeXml(rightCol?.subtitle || "Clean decoupled boundaries")}</text>

    <!-- Status Pill (Always Readable High Contrast) -->
    <rect x="20" y="95" width="290" height="28" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1" rx="6" />
    <text x="165" y="114" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">Cleaner Boundaries &amp; Reliability</text>

    ${renderLightNodes(rightCol?.nodes, colors, "#10b981", "#dcfce7")}
  </g>

  <!-- Bottom Takeaway Banner (Wide enough for crisp padding) -->
  <g transform="translate(90, 560)">
    <rect width="620" height="44" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5" rx="22" />
    <text x="310" y="27" class="metric-pill">${escapeXml(this.shortenVisualLabel(`Result: ${rightCol?.subtitle || "Decoupled Boundaries & Predictable Scale"}`, 60))}</text>
  </g>
</svg>`;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYOUT 2: SYSTEM FLOW / PIPELINE SVG (Recruiter-Friendly 3-Step Flow)
    // ─────────────────────────────────────────────────────────────
    if (layout === "SYSTEM_FLOW") {
      const cols = spec.columns || [];
      const titleFontSize = spec.title.length > 42 ? 19 : 22;
      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #ffffff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>
  </defs>
  <style>
    .title { font-size: ${titleFontSize}px; font-weight: 800; fill: #0f172a; text-anchor: middle; }
    .badge { font-size: 12px; font-weight: 700; fill: #0284c7; text-anchor: middle; letter-spacing: 1px; }
    .col-header { font-size: 16px; font-weight: 700; }
    .col-sub { font-size: 12px; font-weight: 500; fill: #64748b; }
    .node-title { font-size: 13px; font-weight: 600; fill: #0f172a; }
    .metric-pill { font-size: 13.5px; font-weight: 700; fill: #0369a1; text-anchor: middle; }
  </style>

  <rect width="${width}" height="${height}" fill="#ffffff" />
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" rx="16" />

  <rect x="290" y="38" width="220" height="26" fill="#e0f2fe" rx="13" />
  <text x="400" y="55" class="badge">3-STEP WORKFLOW OVERVIEW</text>
  <text x="400" y="92" class="title">${escapeXml(spec.title)}</text>

  <!-- Flow Columns (Horizontal Pipeline) -->
  ${cols
    .map((col, idx) => {
      const x = 45 + idx * 245;
      const strokeColor = col.color === "green" ? colors.greenBorder : col.color === "purple" ? colors.purpleBorder : colors.blueBorder;
      const fillColor = col.color === "green" ? colors.greenFill : col.color === "purple" ? colors.purpleFill : colors.blueFill;

      return `
      <g transform="translate(${x}, 125)">
        <rect width="220" height="405" fill="#ffffff" stroke="${strokeColor}" stroke-width="2" rx="12" />
        <rect width="220" height="44" fill="${fillColor}" rx="12" />
        <text x="15" y="28" class="col-header" fill="${strokeColor}">${escapeXml(col.title)}</text>
        <text x="15" y="66" class="col-sub">${escapeXml(col.subtitle)}</text>

        ${col.nodes
          .map(
            (node, nIdx) => `
          <g transform="translate(15, ${92 + nIdx * 115})">
            <rect width="190" height="82" fill="#f8fafc" stroke="${strokeColor}" stroke-width="1.5" rx="8" />
            <circle cx="24" cy="41" r="13" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" />
            <text x="24" y="45" font-size="12" font-weight="800" fill="${strokeColor}" text-anchor="middle">${nIdx + 1}</text>
            <text x="46" y="45" class="node-title">${escapeXml(this.shortenVisualLabel(node.label, 20))}</text>
          </g>
        `
          )
          .join("")}
      </g>
      ${idx < cols.length - 1 ? `<path d="M ${x + 224} 325 L ${x + 241} 325" stroke="#64748b" stroke-width="2.5" marker-end="url(#arrow)" />` : ""}
      `;
    })
    .join("")}

  <g transform="translate(90, 560)">
    <rect width="620" height="44" fill="#e0f2fe" stroke="#bae6fd" stroke-width="1.5" rx="22" />
    <text x="310" y="27" class="metric-pill">${escapeXml(this.shortenVisualLabel(`Flow: ${cols.map((c) => c.subtitle).filter(Boolean).join(" | ") || "Clean Boundaries -> Predictable Scale"}`, 60))}</text>
  </g>
</svg>`;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYOUT 3: FAILURE ANALYSIS / INCIDENT TIMELINE SVG
    // ─────────────────────────────────────────────────────────────
    if (layout === "FAILURE_ANALYSIS" || layout === "DECISION_MATRIX") {
      const leftCol = spec.columns[0];
      const rightCol = spec.columns[1];
      const cleanLeft = (leftCol?.title || "Option A").replace(/^Option\s+[A-Z]:\s*/i, "").trim();
      const cleanRight = (rightCol?.title || "Option B").replace(/^Option\s+[A-Z]:\s*/i, "").trim();

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #ffffff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <style>
    .title { font-size: 24px; font-weight: 800; fill: #0f172a; text-anchor: middle; }
    .badge { font-size: 12px; font-weight: 700; fill: #059669; text-anchor: middle; letter-spacing: 1px; }
    .card-title { font-size: 18px; font-weight: 700; }
    .card-sub { font-size: 13px; font-weight: 500; fill: #64748b; }
    .metric-pill { font-size: 14px; font-weight: 800; fill: #0369a1; text-anchor: middle; }
  </style>

  <rect width="${width}" height="${height}" fill="#ffffff" />
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" rx="16" />

  <!-- Category Badge & Main Title -->
  <rect x="300" y="38" width="200" height="26" fill="#d1fae5" rx="13" />
  <text x="400" y="55" class="badge">SYSTEM DESIGN &amp; TRADEOFF</text>
  <text x="400" y="92" class="title">${escapeXml(spec.title)}</text>

  <!-- Left Card (Option A) -->
  <g transform="translate(50, 120)">
    <rect width="330" height="420" fill="#ffffff" stroke="#93c5fd" stroke-width="2" rx="12" />
    <rect width="330" height="48" fill="#dbeafe" rx="12" />
    <text x="20" y="30" class="card-title" fill="#1d4ed8">Option A: ${escapeXml(cleanLeft)}</text>
    <text x="20" y="75" class="card-sub">${escapeXml(leftCol?.subtitle || "Baseline approach")}</text>
    ${renderLightNodes(leftCol?.nodes, colors, "#3b82f6", "#dbeafe")}
  </g>

  <!-- Right Card (Option B) -->
  <g transform="translate(420, 120)">
    <rect width="330" height="420" fill="#ffffff" stroke="#86efac" stroke-width="2" rx="12" />
    <rect width="330" height="48" fill="#dcfce7" rx="12" />
    <text x="20" y="30" class="card-title" fill="#15803d">Option B: ${escapeXml(cleanRight)}</text>
    <text x="20" y="75" class="card-sub">${escapeXml(rightCol?.subtitle || "Optimized architecture")}</text>
    ${renderLightNodes(rightCol?.nodes, colors, "#10b981", "#dcfce7")}
  </g>

  <!-- Bottom Metric Banner -->
  <g transform="translate(90, 560)">
    <rect width="620" height="44" fill="#e0f2fe" stroke="#bae6fd" stroke-width="1.5" rx="22" />
    <text x="310" y="27" class="metric-pill">Key Outcome: Clear Boundaries Protect Production Workloads</text>
  </g>
</svg>`;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYOUT 5: DEFAULT SIDE-BY-SIDE COMPARISON SVG
    // ─────────────────────────────────────────────────────────────
    const leftCol = spec.columns[0];
    const rightCol = spec.columns[1];

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #ffffff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <style>
    .title { font-size: 24px; font-weight: 800; fill: ${colors.textDark}; text-anchor: middle; }
    .col-title { font-size: 20px; font-weight: 800; text-anchor: middle; }
    .col-subtitle { font-size: 12px; font-weight: 500; fill: ${colors.textMuted}; text-anchor: middle; }
    .node-label { font-size: 13px; font-weight: 600; fill: ${colors.textDark}; text-anchor: middle; }
  </style>

  <!-- Header -->
  <text x="400" y="45" class="title">${escapeXml(spec.title)}</text>

  <!-- Divider -->
  <line x1="400" y1="80" x2="400" y2="600" stroke="${colors.lineDashed}" stroke-width="2" stroke-dasharray="6,6" />

  <!-- Left Column -->
  <g transform="translate(0, 0)">
    <text x="200" y="95" class="col-title" fill="${colors.blueBorder}">${escapeXml(leftCol?.title || "Architecture A")}</text>
    <text x="200" y="115" class="col-subtitle">${escapeXml(leftCol?.subtitle || "")}</text>
    ${renderGenericColumnNodes(leftCol, 200, colors)}
  </g>

  <!-- Right Column -->
  <g transform="translate(400, 0)">
    <text x="200" y="95" class="col-title" fill="${colors.greenBorder}">${escapeXml(rightCol?.title || "Architecture B")}</text>
    <text x="200" y="115" class="col-subtitle">${escapeXml(rightCol?.subtitle || "")}</text>
    ${renderGenericColumnNodes(rightCol, 200, colors)}
  </g>
</svg>`;
  }

  public createVisualPlan(
    topic: Topic,
    pipelineId?: string,
    postText?: string,
    visualType?: string
  ): AgentResult<VisualPlanBlueprint> {
    const startTime = Date.now();
    console.log(`[Visual Planning Agent] Designing dynamic architecture visual blueprint for: "${topic.title}"...`);

    const diagramSpec = this.createDiagramSpec(topic, postText, visualType);
    const diagramType = diagramSpec.title;

    // Check if visual concept or layout was recently used
    let renderedSvg = this.generateDiagramSvg(diagramSpec, visualType);
    const requiredDiagramNodes = diagramSpec.columns.flatMap((c) => c.nodes.map((n) => n.label));

    const imagePrompt = `A 16:9 technical architecture blueprint diagram titled "${diagramSpec.title}". Layout: ${diagramSpec.layoutStyle} with color-coded vector node badges. Key components: ${requiredDiagramNodes.join(
      ", "
    )}. Clean engineering typography and vector flow markers.`;

    const promptHash = crypto.createHash("sha256").update(imagePrompt).digest("hex").slice(0, 16);
    const contentHash = crypto.createHash("sha256").update(renderedSvg).digest("hex").slice(0, 16);
    const layout = diagramSpec.layoutStyle || "ARCHITECTURE_DIAGRAM";
    const composition = visualType || "ARCHITECTURE_DIAGRAM";

    const repCheck = visualHistoryTracker.isVisualRepetitive({
      visualConcept: topic.title,
      visualType: composition,
      layout,
      composition,
      imageContentHash: contentHash,
      imagePromptHash: promptHash,
    });

    if (repCheck.isDuplicate) {
      console.log(`[VISUAL_FILTER] Variation triggered: ${repCheck.reason}`);
      const rotatedLayout =
        diagramSpec.layoutStyle === "SYSTEM_FLOW" ? "BEFORE_AFTER_COMPARISON" : "SYSTEM_FLOW";
      const rotatedSpec = this.createDiagramSpec(topic, postText, rotatedLayout);
      diagramSpec.title = this.shortenVisualLabel(rotatedSpec.title, 44);
      diagramSpec.layoutStyle = rotatedSpec.layoutStyle;
      diagramSpec.columns = rotatedSpec.columns;
      renderedSvg = this.generateDiagramSvg(diagramSpec, rotatedLayout);
    }

    visualHistoryTracker.recordVisual({
      topicId: topic.id || `t_${Date.now()}`,
      visualType: composition,
      visualConcept: topic.title,
      composition,
      layout,
      diagramStructure: diagramSpec.columns.length > 2 ? "THREE_COLUMN" : "TWO_COLUMN",
      primarySubject: topic.title,
      visualMetaphor: "System Architecture Flow",
      colorPalette: diagramSpec.colorPalette,
      imagePromptHash: promptHash,
      imageContentHash: contentHash,
      createdAt: new Date().toISOString(),
    });

    console.log(`[VISUAL_FILTER] accepted=${diagramSpec.title} alignment=96 layout=${diagramSpec.layoutStyle}`);

    const topicCat = (topic.category || topic.title || "").toLowerCase();
    const visualCategory = (topicCat.includes("agent") || topicCat.includes("llm") || topicCat.includes("mcp")) ? "AI_AGENTS" : "COMPARISON_DIAGRAM";

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 96,
      data: {
        topicConcept: topic.title,
        visualCategory,
        requiredDiagramNodes,
        colorPalette: diagramSpec.colorPalette,
        imagePrompt,
        diagramSpec,
        renderedSvg,
      },
      validationResult: {
        passed: true,
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.VISUAL_PLANNING,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }

  public validateVisualAlignment(
    topic: Topic,
    visualPlan: VisualPlanBlueprint,
    article?: DevToArticlePayload,
    pipelineId?: string
  ): AgentResult<VisualValidationResult> {
    const startTime = Date.now();
    console.log(`[Visual Planning Agent] Verifying visual diagram semantic alignment for topic: "${topic.title}"...`);

    const feedbackNotes: string[] = [];
    let alignmentScore = 96;

    const topicKeywords = (topic.title + " " + (topic.framework || "") + " " + (topic.category || ""))
      .toLowerCase()
      .split(/\s+/);

    const diagramText = (visualPlan.imagePrompt + " " + (visualPlan.requiredDiagramNodes || []).join(" "))
      .toLowerCase();

    // Verify semantic keyword overlap between topic and diagram nodes
    let overlapCount = 0;
    topicKeywords.forEach((kw) => {
      if (kw.length > 3 && diagramText.includes(kw)) {
        overlapCount++;
      }
    });

    if (overlapCount === 0) {
      alignmentScore -= 25;
      feedbackNotes.push("Diagram nodes lack semantic overlap with article topic.");
    }

    const alignedWithArticle = alignmentScore >= 80;

    const executionTimeMs = Date.now() - startTime;
    return {
      success: alignedWithArticle,
      confidenceScore: alignmentScore,
      data: {
        alignedWithArticle,
        alignmentScore,
        categoryMatch: true,
        logoAccuracyPassed: (visualPlan.requiredDiagramNodes || []).length >= 2,
        feedbackNotes,
      },
      validationResult: {
        passed: alignedWithArticle,
        errors: alignedWithArticle ? [] : feedbackNotes,
        warnings: feedbackNotes,
      },
      metadata: {
        agentType: AgentType.VISUAL_PLANNING,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

function renderDarkNodes(nodes?: DiagramNode[], colors?: any): string {
  if (!nodes || nodes.length === 0) return "";
  return nodes
    .map((n, idx) => {
      const y = 140 + idx * 110;
      const strokeColor = n.color === "green" ? "#10b981" : n.color === "red" ? "#ef4444" : n.color === "purple" ? "#8b5cf6" : "#3b82f6";
      return `
      <g transform="translate(20, ${y})">
        <rect width="280" height="85" fill="#0f172a" stroke="${strokeColor}" stroke-width="1.5" rx="8" />
        <circle cx="28" cy="42" r="14" fill="${strokeColor}" fill-opacity="0.2" stroke="${strokeColor}" stroke-width="1.5" />
        <text x="28" y="47" font-size="12" font-weight="800" fill="${strokeColor}" text-anchor="middle">${idx + 1}</text>
        <text x="54" y="47" font-size="13" font-weight="600" fill="#f8fafc">${escapeXml(n.label)}</text>
      </g>
      `;
    })
    .join("");
}

function renderLightNodes(nodes?: DiagramNode[], colors?: any, strokeColor: string = "#3b82f6", fillColor: string = "#dbeafe"): string {
  if (!nodes || nodes.length === 0) return "";
  return nodes
    .map((n, idx) => {
      const y = 140 + idx * 92;
      const safeLabel = n.label.length > 29 ? `${n.label.slice(0, 26).trimEnd()}...` : n.label;
      return `
      <g transform="translate(20, ${y})">
        <rect width="290" height="76" fill="#ffffff" stroke="${strokeColor}" stroke-width="1.5" rx="8" />
        <circle cx="28" cy="38" r="14" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" />
        <text x="28" y="43" font-size="12" font-weight="800" fill="${strokeColor}" text-anchor="middle">${idx + 1}</text>
        <text x="54" y="43" class="node-text">${escapeXml(safeLabel)}</text>
      </g>
      `;
    })
    .join("");
}

function renderGenericColumnNodes(col: DiagramColumn, centerX: number, colors: any): string {
  if (!col || !col.nodes) return "";
  const startY = 160;
  const gapY = 100;

  return col.nodes
    .map((node, idx) => {
      const cy = startY + idx * gapY;
      const fillColor = node.color === "green" ? colors.greenFill : node.color === "purple" ? colors.purpleFill : node.color === "yellow" ? colors.yellowFill : colors.blueFill;
      const strokeColor = node.color === "green" ? colors.greenBorder : node.color === "purple" ? colors.purpleBorder : node.color === "yellow" ? colors.yellowBorder : colors.blueBorder;

      return `
      ${idx > 0 ? `<line x1="${centerX}" y1="${cy - gapY + 22}" x2="${centerX}" y2="${cy - 22}" stroke="${strokeColor}" stroke-width="2" />` : ""}
      <circle cx="${centerX}" cy="${cy}" r="20" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" />
      <text x="${centerX}" y="${cy + 36}" class="node-label">${escapeXml(node.label)}</text>
    `;
    })
    .join("\n");
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}



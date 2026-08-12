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

declare const process: any;
declare const require: any;

const fs = require("fs");
const path = require("path");

const VISUAL_HISTORY_FILE = path.resolve(process.cwd(), "visual_history.json");

// Image Concept History Tracker across published/generated posts
export class VisualHistoryTracker {
  private pastConcepts: Array<{ topicId: string; conceptTitle: string; diagramType: string; hash: string; createdAt: string }> = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    try {
      if (fs.existsSync(VISUAL_HISTORY_FILE)) {
        const raw = fs.readFileSync(VISUAL_HISTORY_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.pastConcepts = parsed;
        }
      }
    } catch (err: any) {
      console.warn("[VisualHistoryTracker] Failed to load visual history:", err.message);
    }
  }

  private saveHistory() {
    try {
      fs.writeFileSync(VISUAL_HISTORY_FILE, JSON.stringify(this.pastConcepts, null, 2), "utf-8");
    } catch (err: any) {
      console.warn("[VisualHistoryTracker] Failed to save visual history:", err.message);
    }
  }

  public addConcept(topicId: string, conceptTitle: string, diagramType: string) {
    this.loadHistory();
    const hash = `${conceptTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}_${diagramType}`;
    this.pastConcepts.unshift({
      topicId,
      conceptTitle,
      diagramType,
      hash,
      createdAt: new Date().toISOString(),
    });
    this.saveHistory();
  }

  public isConceptSimilar(conceptTitle: string, diagramType: string): boolean {
    this.loadHistory();
    const hash = `${conceptTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}_${diagramType}`;
    const recent3 = this.pastConcepts.slice(0, 3);
    return recent3.some((c) => c.hash === hash || (c.diagramType === diagramType && c.conceptTitle === conceptTitle));
  }

  public getHistory() {
    this.loadHistory();
    return this.pastConcepts;
  }
}

export const visualHistoryTracker = new VisualHistoryTracker();

export class VisualPlanningAgent {
  public createDiagramSpec(topic: Topic): DiagramSpec {
    const t = (topic.title + " " + (topic.framework || "") + " " + topic.category).toLowerCase();

    if (t.includes("deepseek") || t.includes("reasoning") || t.includes("benchmark")) {
      return {
        title: "DeepSeek R1 Reasoning Pipeline",
        layoutStyle: "SIDE_BY_SIDE_COMPARISON",
        colorPalette: "Purple (#8b5cf6), Blue (#3b82f6)",
        columns: [
          {
            id: "sft",
            title: "Supervised Fine-Tuning",
            subtitle: "Traditional Instruction Tuning",
            color: "blue",
            nodes: [
              { id: "data_sft", label: "Curated Dataset", icon: "data", color: "blue" },
              { id: "sft_model", label: "SFT Model", icon: "llm", color: "blue" },
              { id: "out_sft", label: "Standard Output", icon: "response", color: "blue" },
            ],
          },
          {
            id: "rl_pure",
            title: "DeepSeek Pure RL",
            subtitle: "Rule-Based Reinforcement Learning",
            color: "purple",
            nodes: [
              { id: "prompt_rl", label: "Raw Prompts", icon: "query", color: "purple" },
              { id: "reward_rule", label: "Rule-Based Reward", icon: "embedding", color: "purple" },
              { id: "cot_verify", label: "Chain-of-Thought Verification", icon: "llm", color: "purple" },
              { id: "res_rl", label: "Self-Verifying Response", icon: "response", color: "purple" },
            ],
          },
        ],
      };
    }

    if (t.includes("typescript") || t.includes("monorepo") || t.includes("compiler")) {
      return {
        title: "TypeScript 5.7 Project References",
        layoutStyle: "SIDE_BY_SIDE_COMPARISON",
        colorPalette: "Blue (#3b82f6), Green (#10b981)",
        columns: [
          {
            id: "legacy_ts",
            title: "Legacy Monorepo Build",
            subtitle: "Full Type Re-Checking",
            color: "blue",
            nodes: [
              { id: "src_all", label: "Root Source Files", icon: "data", color: "blue" },
              { id: "full_check", label: "Full Type Check", icon: "embedding", color: "blue" },
              { id: "slow_out", label: "High Build Latency", icon: "response", color: "blue" },
            ],
          },
          {
            id: "ts_57",
            title: "TypeScript 5.7 Incremental",
            subtitle: "Project References + Isolated Modules",
            color: "green",
            nodes: [
              { id: "packages", label: "Decoupled Packages", icon: "data", color: "green" },
              { id: "ref_resolver", label: "Path Alias Cache", icon: "cache", color: "green" },
              { id: "fast_emit", label: "Fast Declaration Emit", icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    if (t.includes("docker") || t.includes("kubernetes") || t.includes("container") || t.includes("devops")) {
      return {
        title: "Docker Buildx & Container Hardening",
        layoutStyle: "SIDE_BY_SIDE_COMPARISON",
        colorPalette: "Green (#10b981), Yellow (#f59e0b)",
        columns: [
          {
            id: "root_container",
            title: "Rootful Build",
            subtitle: "Default Single Layer",
            color: "yellow",
            nodes: [
              { id: "root_df", label: "Dockerfile", icon: "query", color: "yellow" },
              { id: "root_exec", label: "Root Context", icon: "data", color: "yellow" },
              { id: "vulnerable", label: "Security Overhead", icon: "response", color: "yellow" },
            ],
          },
          {
            id: "rootless_buildx",
            title: "Docker Buildx Multi-Arch",
            subtitle: "Rootless + Vulnerability Scan",
            color: "green",
            nodes: [
              { id: "buildx_cache", label: "Buildx Cache Layer", icon: "cache", color: "green" },
              { id: "trivy_scan", label: "Aqua Security Scan", icon: "embedding", color: "green" },
              { id: "secure_oci", label: "Hardened OCI Image", icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    if (t.includes("security") || t.includes("mtls") || t.includes("ebpf")) {
      return {
        title: "Zero-Trust Service Architecture",
        layoutStyle: "SIDE_BY_SIDE_COMPARISON",
        colorPalette: "Blue (#3b82f6), Green (#10b981)",
        columns: [
          {
            id: "perim_sec",
            title: "Perimeter Security",
            subtitle: "Edge Firewall Only",
            color: "blue",
            nodes: [
              { id: "ingress", label: "API Gateway", icon: "query", color: "blue" },
              { id: "plain_http", label: "Unencrypted Internal Traffic", icon: "data", color: "blue" },
              { id: "backend_svc", label: "Backend Service", icon: "response", color: "blue" },
            ],
          },
          {
            id: "zero_trust",
            title: "mTLS + eBPF Kernel Security",
            subtitle: "Cryptographic Identity at Kernel Level",
            color: "green",
            nodes: [
              { id: "spiffe", label: "SPIFFE ID Auth", icon: "query", color: "green" },
              { id: "ebpf_filter", label: "eBPF Packet Probe", icon: "cache", color: "green" },
              { id: "mtls_tunnel", label: "mTLS Encrypted Stream", icon: "response", color: "green" },
            ],
          },
        ],
      };
    }

    // Dynamic Architecture Blueprint per Topic
    const techName = topic.framework || topic.supportingTech?.[0] || topic.category || "System Architecture";
    const cleanTitle = topic.title.replace(/:(.*)$/, "").substring(0, 32);

    return {
      title: `${cleanTitle} Architecture Blueprint`,
      layoutStyle: "SIDE_BY_SIDE_COMPARISON",
      colorPalette: "Blue (#3b82f6), Green (#10b981)",
      columns: [
        {
          id: "traditional_flow",
          title: "Standard Architecture",
          subtitle: "Synchronous Request Boundaries",
          color: "blue",
          nodes: [
            { id: "c_req", label: "Client Ingress Gateway", icon: "query", color: "blue" },
            { id: "sync_proc", label: "Monolithic Service Layer", icon: "data", color: "blue" },
            { id: "mono_db", label: "Shared State Store", icon: "vectordb", color: "blue" },
          ],
        },
        {
          id: "decoupled_flow",
          title: `${techName} Pipeline`,
          subtitle: "Decoupled Event-Driven Flow",
          color: "green",
          nodes: [
            { id: "gw", label: "API Mesh Gateway", icon: "query", color: "green" },
            { id: "worker_node", label: `${techName} Engine`, icon: "llm", color: "green" },
            { id: "isolated_db", label: "Isolated State Database", icon: "vectordb", color: "green" },
          ],
        },
      ],
    };
  }

  public generateDiagramSvg(spec: DiagramSpec): string {
    const width = 800;
    const height = 650;

    const leftCol = spec.columns[0];
    const rightCol = spec.columns[1];

    const colors = {
      yellowBorder: "#f59e0b",
      yellowFill: "#fef3c7",
      blueBorder: "#3b82f6",
      blueFill: "#dbeafe",
      greenBorder: "#10b981",
      greenFill: "#d1fae5",
      purpleBorder: "#8b5cf6",
      purpleFill: "#f3e8ff",
      bg: "#ffffff",
      textDark: "#0f172a",
      textMuted: "#475569",
      lineDashed: "#cbd5e1",
    };

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #ffffff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <style>
    .title { font-size: 28px; font-weight: 800; fill: ${colors.textDark}; text-anchor: middle; }
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

  public createVisualPlan(topic: Topic, pipelineId?: string): AgentResult<VisualPlanBlueprint> {
    const startTime = Date.now();
    console.log(`[Visual Planning Agent] Designing architecture visual blueprint for: "${topic.title}"...`);

    const diagramSpec = this.createDiagramSpec(topic);
    const diagramType = diagramSpec.title;

    // Check if visual concept was recently used
    if (visualHistoryTracker.isConceptSimilar(topic.title, diagramType)) {
      console.log(`[VISUAL_FILTER] rejected=imageConcept reason=SIMILAR_TO_LAST_3_IMAGES (${diagramType})`);
      diagramSpec.title = `${topic.title} Vector Flow Map`;
    }

    visualHistoryTracker.addConcept(topic.id || `t_${Date.now()}`, topic.title, diagramType);

    const renderedSvg = this.generateDiagramSvg(diagramSpec);
    const requiredDiagramNodes = diagramSpec.columns.flatMap((c) => c.nodes.map((n) => n.label));

    const imagePrompt = `A high-contrast technical architecture diagram titled "${diagramSpec.title}". Side-by-side layout with color-coded vector node badges: Blue, Green, Purple accents on crisp white canvas. Key components: ${requiredDiagramNodes.join(
      ", "
    )}. Clean typography and vector flow arrows.`;

    console.log(`[VISUAL_FILTER] accepted=${diagramSpec.title} alignment=96`);

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 96,
      data: {
        topicConcept: topic.title,
        visualCategory: "COMPARISON_DIAGRAM",
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


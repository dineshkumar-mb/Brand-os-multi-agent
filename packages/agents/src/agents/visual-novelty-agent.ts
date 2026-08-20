import { AgentType, AgentResult, Topic, VisualType } from "@brand-os/shared";

export interface VisualRecord {
  id: string;
  postId?: string;
  topicTitle: string;
  visualType: VisualType;
  layout: string;
  subject: string;
  prompt: string;
  visualHash: string;
  createdAt: string;
}

export interface VisualNoveltyEvaluation {
  visualNoveltyScore: number;
  selectedVisualType: VisualType;
  layoutStyle: string;
  colorStrategy: string;
  passed: boolean;
  rejectionReason?: string;
  imagePrompt: string;
  regenerationCount: number;
}

export class VisualNoveltyAgent {
  private history: VisualRecord[] = [];

  constructor(history: VisualRecord[] = []) {
    this.history = history || [];
  }

  public setHistory(history: VisualRecord[]) {
    this.history = history || [];
  }

  private get allVisualTypes(): VisualType[] {
    return [
      VisualType.ARCHITECTURE_DIAGRAM,
      VisualType.SYSTEM_FLOW,
      VisualType.DEBUGGING_TIMELINE,
      VisualType.BENCHMARK_CHART,
      VisualType.CODE_ANNOTATION,
      VisualType.DATA_FLOW,
      VisualType.BEFORE_AFTER_ARCHITECTURE,
      VisualType.DECISION_MATRIX,
      VisualType.FAILURE_ANALYSIS,
      VisualType.TIMELINE,
      VisualType.COMPONENT_MAP,
      VisualType.DISTRIBUTED_SYSTEM_DIAGRAM,
      VisualType.CONCEPTUAL_ILLUSTRATION,
      VisualType.TECHNICAL_COMPARISON,
      VisualType.MINIMAL_ENGINEERING_POSTER,
    ];
  }

  public mapProblemToVisualType(topicTitle: string, category: string = ""): VisualType {
    const text = `${topicTitle} ${category}`.toLowerCase();
    if (text.includes("performance") || text.includes("benchmark") || text.includes("throughput") || text.includes("latency")) {
      return VisualType.BENCHMARK_CHART;
    }
    if (text.includes("incident") || text.includes("bug") || text.includes("debugging") || text.includes("postmortem") || text.includes("failure")) {
      return VisualType.FAILURE_ANALYSIS;
    }
    if (text.includes("architecture") || text.includes("decision") || text.includes("tradeoff") || text.includes("vs")) {
      return VisualType.DECISION_MATRIX;
    }
    if (text.includes("flow") || text.includes("pipeline") || text.includes("queue") || text.includes("stream")) {
      return VisualType.SYSTEM_FLOW;
    }
    if (text.includes("code") || text.includes("typescript") || text.includes("syntax") || text.includes("refactor")) {
      return VisualType.CODE_ANNOTATION;
    }
    if (text.includes("distributed") || text.includes("cluster") || text.includes("node") || text.includes("replica")) {
      return VisualType.DISTRIBUTED_SYSTEM_DIAGRAM;
    }
    return VisualType.ARCHITECTURE_DIAGRAM;
  }

  public selectFreshVisualType(topicTitle: string = "", category: string = ""): VisualType {
    const preferred = this.mapProblemToVisualType(topicTitle, category);
    const recent7Types = this.history.slice(0, 7).map((h) => h.visualType);
    
    // If preferred visual type was not used in last 7 runs, select it!
    if (!recent7Types.includes(preferred)) {
      return preferred;
    }

    // Otherwise select an unused visual type from all 15 formats
    const available = this.allVisualTypes.filter((vt) => !recent7Types.includes(vt));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return this.allVisualTypes[Math.floor(Math.random() * this.allVisualTypes.length)];
  }

  public evaluateAndPlanVisual(
    topic: Topic,
    postText: string = "",
    pipelineId?: string
  ): AgentResult<VisualNoveltyEvaluation> {
    const startTime = Date.now();
    console.log(`[Visual Novelty Agent] Designing post-context visual blueprint for topic: "${topic.title}"...`);

    const selectedVisualType = this.selectFreshVisualType(topic.title, topic.category);
    const recent7 = this.history.slice(0, 7);
    const recent30 = this.history.slice(0, 30);

    const visualHash = `${topic.title.toLowerCase().replace(/[^a-z0-9]/g, "")}_${selectedVisualType}`;

    // Multi-Dimensional Visual Comparison:
    // Compare visualType, subject, layout, visualHash against last 7 & 30
    const typeMatch = recent7.filter((r) => r.visualType === selectedVisualType).length;
    const subjectMatch = recent30.filter((r) => (r.subject || "").toLowerCase() === topic.title.toLowerCase()).length;
    const hashMatch = recent30.some((r) => r.visualHash === visualHash);

    let similarityPenalty = 0.0;
    if (typeMatch > 0) similarityPenalty += 0.25 * typeMatch;
    if (subjectMatch > 0) similarityPenalty += 0.30;
    if (hashMatch) similarityPenalty += 0.40;

    const similarity = Math.min(0.95, similarityPenalty);
    const visualNoveltyScore = Math.max(0, Math.round((1 - similarity) * 100));

    const passed = visualNoveltyScore >= 70;
    let rejectionReason: string | undefined;

    if (!passed) {
      rejectionReason = `VISUAL_REPETITION_REJECTED: Selected visual style "${selectedVisualType}" shares high similarity (${(similarity * 100).toFixed(0)}%) across type, subject, or visual hash. VisualNoveltyScore: ${visualNoveltyScore}/100.`;
    }

    const layoutStyle = selectedVisualType === VisualType.BEFORE_AFTER_ARCHITECTURE ? "SPLIT_SCREEN_COMPARISON" : "DYNAMIC_VECTOR_FLOW";
    const colorStrategy = selectedVisualType === VisualType.DEBUGGING_TIMELINE ? "RED_AMBER_GREEN_TIMELINE" : "BLUE_GREEN_DARK_CANVAS";

    const keyNodes = [topic.title, topic.framework || "Engine", "State Database", "Client Gateway"];
    const imagePrompt = `A 16:9 engineering ${selectedVisualType} diagram for "${topic.title}". Visual layout: ${layoutStyle} with ${colorStrategy}. Key components: ${keyNodes.join(", ")}. Technical typography and clean vector flow arrows.`;

    const record: VisualRecord = {
      id: `vis_${Date.now()}`,
      topicTitle: topic.title,
      visualType: selectedVisualType,
      layout: layoutStyle,
      subject: topic.title,
      prompt: imagePrompt,
      visualHash,
      createdAt: new Date().toISOString(),
    };

    if (passed) {
      this.history.unshift(record);
    }

    const result: VisualNoveltyEvaluation = {
      visualNoveltyScore,
      selectedVisualType,
      layoutStyle,
      colorStrategy,
      passed,
      rejectionReason,
      imagePrompt,
      regenerationCount: 0,
    };

    const executionTimeMs = Date.now() - startTime;
    return {
      success: passed,
      confidenceScore: passed ? 96 : 35,
      data: result,
      validationResult: {
        passed,
        errors: passed ? [] : [rejectionReason || "Visual novelty check failed"],
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
}

export const visualNoveltyAgent = new VisualNoveltyAgent();

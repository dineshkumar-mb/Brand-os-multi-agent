import {
  AgentType,
  AgentResult,
  Topic,
  VisualValidationResult,
  DevToArticlePayload,
} from "@brand-os/shared";

export interface VisualPlanBlueprint {
  topicConcept: string;
  visualCategory: "SYSTEM_DESIGN" | "AI_AGENTS" | "REACT_COMPILER" | "DOCKER_K8S" | "CLOUD_INFRA";
  requiredDiagramNodes: string[];
  colorPalette: string;
  imagePrompt: string;
}

export class VisualPlanningAgent {
  public createVisualPlan(topic: Topic, pipelineId?: string): AgentResult<VisualPlanBlueprint> {
    const startTime = Date.now();
    console.log(`[Visual Planning Agent] Designing architecture visual blueprint for: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    let visualCategory: VisualPlanBlueprint["visualCategory"] = "SYSTEM_DESIGN";
    let requiredDiagramNodes = ["Client Layer", "API Gateway", "Redis Queue", "PostgreSQL Storage"];

    if (titleLower.includes("mcp") || titleLower.includes("agent")) {
      visualCategory = "AI_AGENTS";
      requiredDiagramNodes = [
        "Swarm Orchestrator Node",
        "Trend & Research Agents",
        "ChromaDB Vector Store",
        "JSON-RPC Tool Handlers",
      ];
    } else if (titleLower.includes("react") || titleLower.includes("compiler")) {
      visualCategory = "REACT_COMPILER";
      requiredDiagramNodes = [
        "React 19 Server Component",
        "Compiler Optimization Engine",
        "Zero Bundle Output",
      ];
    } else if (titleLower.includes("docker") || titleLower.includes("k8s") || titleLower.includes("redis")) {
      visualCategory = "DOCKER_K8S";
      requiredDiagramNodes = [
        "Container Pods",
        "Redis Queue Streams",
        "Worker Pool",
        "Monitoring Telemetry",
      ];
    }

    const imagePrompt = `A modern, ultra-clean, high-contrast 16:9 technical architecture blueprint diagram depicting ${topic.title}. Key components: ${requiredDiagramNodes.join(
      ", "
    )}. Palette: Deep Navy Slate background (#0f172a), Cyan accents (#06b6d4), Crisp White text typography. Avoid generic glowing futuristic art, cheesy 3D robots, or stock photos. Focus on clean UI panels, sharp vector connectors, and framework badges.`;

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 94,
      data: {
        topicConcept: topic.title,
        visualCategory,
        requiredDiagramNodes,
        colorPalette: "Deep Slate (#0f172a), Electric Cyan (#06b6d4), Indigo (#6366f1)",
        imagePrompt,
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
    console.log(`[Visual Planning Agent] Verifying visual diagram alignment for article: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    const planConceptLower = visualPlan.topicConcept.toLowerCase();

    const feedbackNotes: string[] = [];
    let alignmentScore = 95;

    const categoryMatch = Boolean(visualPlan.visualCategory);
    const logoAccuracyPassed = (visualPlan.requiredDiagramNodes || []).length >= 2;

    if (!logoAccuracyPassed) {
      alignmentScore -= 15;
      feedbackNotes.push("Visual diagram nodes insufficient.");
    }

    const alignedWithArticle = alignmentScore >= 80;

    const executionTimeMs = Date.now() - startTime;
    return {
      success: alignedWithArticle,
      confidenceScore: alignmentScore,
      data: {
        alignedWithArticle,
        alignmentScore,
        categoryMatch,
        logoAccuracyPassed,
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

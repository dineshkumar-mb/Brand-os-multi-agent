import {
  AgentType,
  AgentResult,
  Topic,
} from "@brand-os/shared";

export interface KnowledgeGraphNode {
  conceptName: string;
  parentConcept?: string;
  relatedConcepts: string[];
  prerequisites: string[];
  nextLogicalTopics: string[];
}

export class KnowledgeGraphAgent {
  public mapConceptGraph(topic: Topic, pipelineId?: string): AgentResult<KnowledgeGraphNode> {
    const startTime = Date.now();
    console.log(`[Knowledge Graph Agent] Mapping concept graph nodes for: "${topic.title}"...`);

    const titleLower = (topic.title || "").toLowerCase();
    const catLower = (topic.category || "").toLowerCase();

    let conceptName = topic.framework || topic.category;
    let parentConcept = "Software Engineering";
    let relatedConcepts: string[] = [];
    let prerequisites: string[] = [];
    let nextLogicalTopics: string[] = [];

    if (titleLower.includes("mcp") || catLower.includes("agent")) {
      conceptName = "Model Context Protocol (MCP)";
      parentConcept = "Agentic AI Systems";
      relatedConcepts = ["Tool Calling", "JSON-RPC Schemas", "LLM Orchestration", "Vector RAG"];
      prerequisites = ["TypeScript", "Async Event Loops", "REST API Gateways"];
      nextLogicalTopics = ["Autonomous Error Recovery", "Multi-Agent State Checkpointing"];
    } else if (titleLower.includes("redis") || titleLower.includes("bullmq") || catLower.includes("system")) {
      conceptName = "Redis Streams & Async Queues";
      parentConcept = "Distributed Systems";
      relatedConcepts = ["Event-Driven Architecture", "Pub/Sub", "Dead-Letter Queues", "Backpressure Handling"];
      prerequisites = ["Node.js Concurrency", "In-Memory Caching", "Docker Containerization"];
      nextLogicalTopics = ["Horizontal Worker Scaling", "Redis Sentinel & Cluster Failover"];
    } else if (titleLower.includes("react") || catLower.includes("react")) {
      conceptName = "React 19 Primitives";
      parentConcept = "Frontend Framework Architecture";
      relatedConcepts = ["React Compiler", "Server Actions", "useActionState", "Optimistic Updates"];
      prerequisites = ["TypeScript", "Virtual DOM Mechanics", "HTTP Mutation Flows"];
      nextLogicalTopics = ["Zero-Bundle Client State", "Server Component Streaming"];
    } else {
      conceptName = topic.title;
      parentConcept = topic.category;
      relatedConcepts = topic.keywords;
      prerequisites = ["TypeScript", "Clean Architecture"];
      nextLogicalTopics = [`Advanced ${topic.category} Optimization`];
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 95,
      data: {
        conceptName,
        parentConcept,
        relatedConcepts,
        prerequisites,
        nextLogicalTopics,
      },
      validationResult: {
        passed: true,
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.KNOWLEDGE_GRAPH,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

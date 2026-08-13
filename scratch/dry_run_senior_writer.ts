import {
  TechnicalWriterAgent,
  TopicIntelligenceAgent,
  AudienceResearchAgent,
  TechnicalResearchAgent,
  ExperienceMiningAgent,
} from "../packages/agents/src/index";
import { Topic, HistoricalPostRecord, Platform } from "../packages/shared/src/index";

async function runDryRun() {
  console.log("=========================================================================");
  console.log("  SENIOR SOFTWARE ENGINEER WRITING AGENT — 5-POST PIPELINE DRY RUN");
  console.log("=========================================================================\n");

  const writerAgent = new TechnicalWriterAgent();
  const audienceAgent = new AudienceResearchAgent();
  const techResearchAgent = new TechnicalResearchAgent();
  const experienceAgent = new ExperienceMiningAgent();

  const testTopics: Topic[] = [
    {
      id: "t_1",
      title: "Model Context Protocol (MCP): Isolation Boundaries & Tool Calling",
      category: "Agentic AI",
      framework: "MCP",
      supportingTech: ["TypeScript", "JSON-RPC", "Node.js"],
      score: 96,
      reason: "Surging architecture trend",
      trend_velocity: 9.8,
      difficulty: "ADVANCED",
      competition: "MEDIUM",
      audience: "AI Engineers & Systems Architects",
      keywords: ["MCP", "Tool Calling", "Isolation Boundaries", "JSON-RPC"],
      references: ["https://modelcontextprotocol.io"],
    },
    {
      id: "t_2",
      title: "Redis Cache Invalidation & Eventual Consistency in Distributed Systems",
      category: "System Design",
      framework: "Redis",
      supportingTech: ["BullMQ", "PostgreSQL", "Node.js"],
      score: 92,
      reason: "Production bottleneck pattern",
      trend_velocity: 8.5,
      difficulty: "ADVANCED",
      competition: "HIGH",
      audience: "Backend Engineers & System Architects",
      keywords: ["Redis", "Caching", "Eventual Consistency", "Write-Through"],
      references: ["https://redis.io/docs"],
    },
    {
      id: "t_3",
      title: "React 19 Compiler Optimization & Server Actions in Enterprise SaaS",
      category: "React",
      framework: "React 19",
      supportingTech: ["Next.js", "TypeScript", "TailwindCSS"],
      score: 90,
      reason: "Major framework paradigm shift",
      trend_velocity: 9.2,
      difficulty: "INTERMEDIATE",
      competition: "HIGH",
      audience: "Full Stack Developers & Frontend Architects",
      keywords: ["React 19", "Compiler", "Server Actions", "Zero Bundle"],
      references: ["https://react.dev/blog/2024/02/15/react-19-plan"],
    },
    {
      id: "t_4",
      title: "eBPF Observability & Kernel-Level Traffic Tracing in Kubernetes",
      category: "DevOps",
      framework: "eBPF",
      supportingTech: ["Cilium", "Linux", "Go"],
      score: 88,
      reason: "High-performance infrastructure trend",
      trend_velocity: 8.0,
      difficulty: "ADVANCED",
      competition: "LOW",
      audience: "DevOps Engineers & Infrastructure Architects",
      keywords: ["eBPF", "Cilium", "Observability", "Kernel Probes"],
      references: ["https://ebpf.io"],
    },
    {
      id: "t_5",
      title: "RAG vs Long-Context LLMs: Latency, Cost, and Retrieval Trade-Offs",
      category: "AI Engineering",
      framework: "LangChain",
      supportingTech: ["Vector DB", "Python", "Gemini 1.5"],
      score: 95,
      reason: "Core AI engineering architectural question",
      trend_velocity: 9.6,
      difficulty: "ADVANCED",
      competition: "HIGH",
      audience: "AI Engineers & Tech Leads",
      keywords: ["RAG", "Vector Search", "Long Context", "Retrieval"],
      references: ["https://arxiv.org/abs/2005.11401"],
    },
  ];

  const generatedPostsHistory: HistoricalPostRecord[] = [];

  for (let i = 0; i < testTopics.length; i++) {
    const topic = testTopics[i];
    console.log(`-------------------------------------------------------------------------`);
    console.log(`POST #${i + 1} GENERATION — TOPIC: "${topic.title}"`);
    console.log(`-------------------------------------------------------------------------`);

    const audience = audienceAgent.analyzeAudience(topic).data;
    const research = (await techResearchAgent.run(topic)).data;
    const experience = experienceAgent.mineExperience(topic).data;

    const result = await writerAgent.generateContent(
      topic,
      research,
      experience,
      audience,
      `dryrun_pl_${i + 1}`,
      generatedPostsHistory
    );

    const post = result.data.linkedInPost;
    const article = result.data.devToArticle;
    const score = result.data.writingQualityScore;

    console.log(`\n📌 PLATFORM 1: LINKEDIN POST`);
    console.log(`Hook Type / Strategy: ${result.data.narrativePattern}`);
    console.log(`HOOK:\n"${post.hook}"\n`);
    console.log(`FULL LINKEDIN POST:\n${post.fullText}\n`);
    console.log(`CTA:\n"${post.cta}"\n`);

    console.log(`📌 PLATFORM 2: DEV.TO ARTICLE`);
    console.log(`Title: ${article.title}`);
    console.log(`Markdown Preview (first 250 chars):\n${article.markdownContent.substring(0, 250)}...\n`);

    console.log(`📊 QUALITY SCORE BREAKDOWN:`);
    console.log(`• Overall: ${score.overall}/100`);
    console.log(`• Technical Depth: ${score.technicalDepth}/100`);
    console.log(`• Seniority: ${score.seniority}/100`);
    console.log(`• Authenticity: ${score.authenticity}/100`);
    console.log(`• Originality: ${score.originality}/100`);
    console.log(`• AI Cliché Score: ${score.aiClicheScore}/100 (Cliches removed: ${100 - score.aiClicheScore})`);
    console.log(`• Career Signal: ${score.careerSignal}/100\n`);

    // Add generated post to history so subsequent iterations test rotation
    generatedPostsHistory.unshift({
      id: `dry_${i + 1}`,
      title: post.title,
      platform: Platform.LINKEDIN,
      category: topic.category,
      framework: topic.framework,
      supportingTech: topic.supportingTech,
      keywords: topic.keywords,
      hook: post.hook,
      fullText: post.fullText,
      publishedAt: new Date().toISOString(),
    });
  }

  console.log("=========================================================================");
  console.log("  DRY RUN SUMMARY: All 5 posts generated with distinct hooks & trade-offs!");
  console.log("=========================================================================");
}

runDryRun().catch(console.error);

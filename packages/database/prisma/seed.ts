import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Personal Brand OS database...");

  // 1. Create Default Admin User
  const user = await prisma.user.upsert({
    where: { email: "engineer@brand-os.ai" },
    update: {},
    create: {
      id: "usr_admin_101",
      email: "engineer@brand-os.ai",
      name: "Staff AI Engineer",
      passwordHash: "$2b$10$e8p2uX0QyK7...placeholder_hash",
      role: "ADMIN",
    },
  });

  // 2. Create User Profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      headline: "Staff AI & Software Engineer | Building Autonomous Agent Platforms",
      bio: "Passionate about Clean Architecture, LangGraph multi-agent swarms, React 19, and enterprise AI Gateways.",
      industry: "AI & Software Engineering",
      careerStage: "Senior / Lead Engineer",
      targetAudience: "Developers, Tech Leads, & System Architects",
      writingTone: "Authoritative, engaging, data-driven, structured bullet points",
      postingFrequency: "DAILY",
      goals: ["Build Thought Leadership", "Grow Tech Following", "Share Architecture Blueprints"],
    },
  });

  // 3. Create User Settings
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      defaultRoutingStrategy: "COST_OPTIMIZED",
      preferredAiModel: "gpt-4o",
      autoPublish: false,
      hitlRequired: true,
      minEvaluationScore: 85.0,
      activeProviders: ["OPENAI", "GEMINI", "ANTHROPIC", "OLLAMA"],
    },
  });

  // 4. Create Initial Topic & Research
  const topic = await prisma.topic.create({
    data: {
      id: "top_seed_1",
      title: "React 19 Actions & Compiler Optimization in Enterprise SaaS",
      category: "React",
      score: 96,
      reason: "Massive discussion surge on GitHub releases & HackerNews.",
      trendVelocity: 9.7,
      difficulty: "INTERMEDIATE",
      competition: "MEDIUM",
      audience: "Full Stack Engineers & Architects",
      keywords: ["React 19", "Compiler", "Server Actions", "TypeScript"],
      references: ["https://github.com/facebook/react", "https://news.ycombinator.com"],
      isResearched: true,
    },
  });

  await prisma.researchData.create({
    data: {
      topicId: topic.id,
      summary: "React 19 replaces manual useMemo/useCallback hooks with a compiler and introduces native Form Actions.",
      keyInsights: [
        "React Compiler eliminates 90% of manual memoization boilerplate.",
        "Form Actions streamline async data mutations.",
        "Server Components shrink client JavaScript bundle sizes.",
      ],
      pros: ["Zero runtime overhead", "Type safety", "High performance"],
      cons: ["Migration effort for legacy hooks"],
      futureOutlook: "Will become the dominant web development paradigm by late 2026.",
      codeSnippets: [
        {
          language: "typescript",
          code: "const [state, formAction, isPending] = useActionState(updateName, null);",
          description: "React 19 Form Action Hook",
        },
      ],
      statistics: ["90% boilerplate reduction", "3.4x faster initial render"],
      citations: [{ title: "React 19 Docs", url: "https://react.dev", source: "Official Docs" }],
      factVerified: true,
      confidenceScore: 94.5,
    },
  });

  // 5. Create Model Benchmarks
  const benchmarks = [
    { provider: "OPENAI", model: "gpt-4o", totalRequests: 140, successfulReqs: 139, failedReqs: 1, avgLatencyMs: 820, avgTokensPerSec: 45, avgCostPer1k: 0.005 },
    { provider: "GEMINI", model: "gemini-1.5-flash", totalRequests: 210, successfulReqs: 210, failedReqs: 0, avgLatencyMs: 290, avgTokensPerSec: 90, avgCostPer1k: 0.0002 },
    { provider: "ANTHROPIC", model: "claude-3-5-sonnet", totalRequests: 85, successfulReqs: 85, failedReqs: 0, avgLatencyMs: 1050, avgTokensPerSec: 38, avgCostPer1k: 0.009 },
  ];

  for (const b of benchmarks) {
    await prisma.modelBenchmark.upsert({
      where: { provider_model: { provider: b.provider as any, model: b.model } },
      update: b,
      create: b as any,
    });
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

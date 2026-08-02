import dotenv from "dotenv";
dotenv.config();

import { agentOrchestrator } from "../packages/agents/src/index";

async function main() {
  console.log("🚀 Running Autonomous Agent Swarm to generate a new DEV.to post...");
  const pipelineId = `devto_gen_${Date.now()}`;

  try {
    const result = await agentOrchestrator.executePipeline({
      autoPublish: true,
      pipelineId,
    });

    console.log("\n=======================================================");
    console.log("✅ AGENT SWARM EXECUTION SUCCESSFUL!");
    console.log("=======================================================");
    console.log(`📌 Base Topic Title: "${result.topic.title}"`);
    console.log(`✨ New Dynamic DEV.to Title: "${result.devToArticle?.title}"`);
    console.log(`🏷️ DEV.to Tags: ${JSON.stringify(result.devToArticle?.tags)}`);
    console.log(`🎯 Quality Gate: ${result.decisionGate?.decision} (Approved: ${result.decisionGate?.approvedForPublishing})`);

    console.log("\n=======================================================");
    console.log("📝 GENERATED DEV.TO MARKDOWN ARTICLE");
    console.log("=======================================================");
    console.log(result.devToArticle?.markdownContent);

    if (result.publishResult) {
      console.log("\n=======================================================");
      console.log("📢 PUBLISHING STATUS");
      console.log("=======================================================");
      console.log(`- Success: ${result.publishResult.success}`);
      console.log(`- Platform: ${result.publishResult.platform}`);
      console.log(`- Mode: ${result.publishResult.mode}`);
      console.log(`- URL: ${result.publishResult.url}`);
      console.log(`- Message: ${result.publishResult.message}`);
    }

  } catch (err: any) {
    console.error("❌ Pipeline execution failed:", err.message);
  }
}

main();

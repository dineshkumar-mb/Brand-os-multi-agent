import { agentOrchestrator } from "../packages/agents/src";
import { publisherService } from "../packages/publisher/src";
import { Platform } from "../packages/shared/src";

// Load environment variables
require("dotenv").config();




async function main() {
  console.log("🚀 Initializing Master Multi-Agent Pipeline to generate post & publish to LinkedIn...");
  try {
    const pipelineId = `run_${Date.now()}`;
    const result = await agentOrchestrator.executePipeline({
      autoPublish: true,
      pipelineId,
    });

    if (result.status === "NO_POST_TODAY") {
      console.log("\n=======================================================");
      console.log("ℹ️ PIPELINE RETURNED NO_POST_TODAY SAFE EXIT");
      console.log("=======================================================");
      console.log(`Reason: ${result.reason}`);
      return;
    }

    console.log("\n=======================================================");
    console.log("✅ AGENT SWARM EXECUTION COMPLETE!");
    console.log("=======================================================");
    console.log(`📌 Topic Title: "${result.topic?.title}"`);
    console.log(`🔥 Selected Hook: "${result.linkedInPost?.hook}"`);
    console.log(`🖼️ Attached Diagram Image URL (First 100 chars): ${result.linkedInPost?.imageUrl?.substring(0, 100)}...`);
    console.log(`🎯 Quality Gate Status: ${result.qualityGateResult?.passed ? "APPROVED" : "REJECTED"} (Quality Score: ${result.qualityGateResult?.overallContentQualityScore}/100)`);

    if (result.publishResult) {
      console.log("\n📢 PUBLISH RESULT:");
      console.log(`- Platform: ${result.publishResult.platform} | Mode: ${result.publishResult.mode} | Success: ${result.publishResult.success}`);
      if (result.publishResult.url) console.log(`  URL: ${result.publishResult.url}`);
      if (result.publishResult.externalId) console.log(`  External Asset/URN: ${result.publishResult.externalId}`);
      if (result.publishResult.message) console.log(`  Details: ${result.publishResult.message}`);
    } else {
      console.log("\n📢 Auto-publishing triggered manually directly via Publisher Service...");
      const pubRes = await publisherService.publish(Platform.LINKEDIN, result.linkedInPost);
      console.log("LinkedIn Publishing Result:", pubRes);
    }

  } catch (err: any) {
    console.error("❌ Agent Pipeline execution failed:", err);
  }
}

main();

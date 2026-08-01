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

    console.log("\n=======================================================");
    console.log("✅ AGENT SWARM EXECUTION COMPLETE!");
    console.log("=======================================================");
    console.log(`📌 Topic Title: "${result.topic.title}"`);
    console.log(`🔥 Selected Hook: "${result.linkedInPost.hook}"`);
    console.log(`🖼️ Attached Diagram Image URL (First 100 chars): ${result.linkedInPost.imageUrl?.substring(0, 100)}...`);
    console.log(`🎯 Decision Gate Status: ${result.decisionGate.decision} (Approved: ${result.decisionGate.approvedForPublishing})`);

    if (result.publishResults && result.publishResults.length > 0) {
      console.log("\n📢 PUBLISH RESULTS:");
      for (const pub of result.publishResults) {
        console.log(`- Platform: ${pub.platform} | Mode: ${pub.mode} | Success: ${pub.success}`);
        if (pub.url) console.log(`  URL: ${pub.url}`);
        if (pub.externalId) console.log(`  External Asset/URN: ${pub.externalId}`);
        if (pub.message) console.log(`  Details: ${pub.message}`);
      }
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

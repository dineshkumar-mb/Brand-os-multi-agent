import "dotenv/config";
import { agentOrchestrator } from "../packages/agents/src";
import { postHistoryTracker } from "../packages/analytics/src";
import { visualHistoryTracker } from "../packages/agents/src/agents/visual-planning";

async function verify() {
  console.log("=== VERIFICATION RUN 1 ===");
  const res1 = await agentOrchestrator.executePipeline({ autoPublish: true });
  console.log("Run 1 Result Status:", res1.status);
  console.log("Run 1 Selected Topic:", res1.topic?.title, "(Category:", res1.topic?.category, ")");
  console.log("Run 1 Hook:", res1.linkedInPost?.hook);
  console.log("Run 1 Image SVG length:", res1.linkedInPost?.imageUrl?.length);
  console.log("History Count after Run 1:", postHistoryTracker.getHistory().length);

  console.log("\n=== VERIFICATION RUN 2 ===");
  const res2 = await agentOrchestrator.executePipeline({ autoPublish: true });
  console.log("Run 2 Result Status:", res2.status);
  console.log("Run 2 Selected Topic:", res2.topic?.title, "(Category:", res2.topic?.category, ")");
  console.log("Run 2 Hook:", res2.linkedInPost?.hook);
  console.log("Run 2 Image SVG length:", res2.linkedInPost?.imageUrl?.length);
  console.log("History Count after Run 2:", postHistoryTracker.getHistory().length);

  if (res1.topic?.title !== res2.topic?.title) {
    console.log("\n✅ SUCCESS: Run 1 and Run 2 generated distinct topics and images!");
  } else {
    console.log("\n❌ WARNING: Run 1 and Run 2 selected the same topic.");
  }
}

verify().catch(console.error);

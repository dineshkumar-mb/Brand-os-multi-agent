import "dotenv/config";
import { agentOrchestrator, TrendDiscoveryAgent } from "@brand-os/agents";

console.log("[Worker Service] Starting Personal Brand OS Background Job Runner...");

async function processQueue() {
  console.log(`[Worker Service] ${new Date().toISOString()} Processing background cron triggers...`);
  
  try {
    console.log("[Worker Service] Executing scheduled Hourly Trend Scan...");
    const trendAgent = new TrendDiscoveryAgent();
    const trendRes = await trendAgent.run();
    const topics = trendRes.data || [];
    console.log(`[Worker Service] Hourly Trend Scan completed. Found ${topics.length} high-velocity topics.`);

    console.log("[Worker Service] Executing Daily Content Swarm Pipeline...");
    const result = await agentOrchestrator.executePipeline();
    console.log("[Worker Service] Daily Content Pipeline completed successfully with score:", result.review.overallScore);
  } catch (err: any) {
    console.error("[Worker Service] Worker execution error:", err.message);
  }
}

// Initial Run
processQueue();

// Run every 60 minutes
setInterval(processQueue, 3600000);

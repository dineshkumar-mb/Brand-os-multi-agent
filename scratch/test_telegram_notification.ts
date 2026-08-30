import "dotenv/config";
import { notificationService } from "../packages/shared/src/notification-service";

async function main() {
  console.log("Sending test Telegram notification with LIVE publish mode & URL...");
  const res = await notificationService.sendAutomationNotification({
    title: "Daily Swarm Pipeline Published Successfully",
    status: "SUCCESS",
    pipelineId: `test_run_${Date.now()}`,
    message: "Content swarm successfully generated, verified, and auto-published post to LinkedIn.",
    topicTitle: "Architecting Resilient Multi-Provider LLM Gateway Routing",
    qualityScore: 94,
    durationSeconds: 12,
    publishMode: "LIVE",
    postUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7499786270202753024",
  });

  console.log("Notification Result:", res);
}

main().catch(console.error);

import "dotenv/config";
import { publisherService } from "../packages/publisher/src/index";
import { Platform } from "../packages/shared/src/index";

async function testPost() {
  console.log("Testing LinkedIn live publish with current token...");
  try {
    const res = await publisherService.publish(Platform.LINKEDIN, {
      title: "Test Post Title",
      fullText: "Test post body content for verifying LinkedIn API access token permissions.",
    }, { mode: "LIVE" as any });
    console.log("Publish Result:", res);
  } catch (err: any) {
    console.error("Publish Failed with Error:", err.message);
  }
}

testPost();

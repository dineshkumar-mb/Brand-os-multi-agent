import "dotenv/config";
import { prisma } from "../packages/database/src/index";

async function main() {
  console.log("Querying PipelineExecution records...");
  const records = await prisma.pipelineExecution.findMany({
    orderBy: { startedAt: "desc" },
    take: 5
  });

  for (const r of records) {
    console.log(`ID: ${r.id}`);
    console.log(`  Started At:  ${r.startedAt}`);
    console.log(`  Status:      ${r.status}`);
    console.log(`  Mode:        ${r.publishMode}`);
    console.log(`  LI Result:   `, r.linkedinResult);
    console.log(`  Error:       `, r.error);
    console.log("-----------------------------------------");
  }
}

main().catch(console.error);

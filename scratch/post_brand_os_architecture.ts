import dotenv from "dotenv";
dotenv.config();

import { publisherService } from "../packages/publisher/src/index";
import { Platform, LinkedInPostPayload } from "../packages/shared/src/index";

async function main() {
  console.log("🚀 Preparing Viral Architectural Post about Personal Brand OS for LinkedIn...");

  const viralHook = `Stop manually writing technical content in 2026. Here is how we built an Autonomous 12-Agent Swarm Platform that posts daily with 0 human intervention. 🚀`;

  const architectureDiagram = `
🏛️ SYSTEM ARCHITECTURE BLUEPRINT:
┌─────────────────────────────────────────────────────────┐
│ 🩵 Client Layer: React 19 + Vite Dashboard (Vercel SaaS)│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 💚 API Gateway: Express + Vercel Serverless Functions  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 💜 Swarm Engine: 12 Autonomous Agents & Quality Gate   │
│  ├─ 1. Multi-Site Trend Scraper (HN, Reddit, Dev.to)   │
│  ├─ 2. RAG Deep Research & Citation Fact-Checker       │
│  ├─ 3. Viral Hook Generator & Content Reviewer (85+)   │
│  └─ 4. Automated Publisher & Redis Event Stream         │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 🧡 AI Gateway: Cost-Optimized Failover Router          │
│  (OpenRouter + NVIDIA NIM + OpenAI + Ollama)            │
└─────────────────────────────────────────────────────────┘`;

  const storyAndTakeaways = `Most engineering leaders spend hours researching trends, writing drafts, and editing posts for developer reach.

We automated the entire lifecycle by decoupling specialized AI agents with strict quality gatekeeping:

⚡ 1. Real-Time Multi-Site Scraper: Aggregates velocity signals from HackerNews, Reddit, Dev.to & GitHub.
🛡️ 2. Fact Verification Gatekeeper: Verifies technical claims against documentation before writing.
🎯 3. Quality Score Threshold: Aborts publishing if quality review score falls below 85/100.
📢 4. Zero Human Intervention: Automated daily crons handle end-to-end publishing.

💻 Open Source Repository:
https://github.com/dineshkumar-mb/Brand-os-multi-agent

🌐 Live Production SaaS:
https://brand-os-multi-agent.vercel.app

What is your team's strategy for automating agentic workflows in 2026? Drop your thoughts below! 👇`;

  const fullText = `${viralHook}\n${architectureDiagram}\n\n${storyAndTakeaways}\n\n#SoftwareEngineering #SystemDesign #React19 #TypeScript #AgenticAI #OpenSource`;

  const payload: LinkedInPostPayload = {
    title: "Building an Autonomous Multi-Agent Personal Brand OS",
    hook: viralHook,
    story: storyAndTakeaways,
    lesson: "Multi-agent swarm architecture with strict quality thresholds enables zero human intervention publishing.",
    actionableInsight: "1. Multi-Site Scraper\n2. Fact Verification Gatekeeper\n3. Dynamic AI Gateway",
    cta: "What is your team's strategy for automating agentic workflows in 2026?",
    hashtags: ["#SoftwareEngineering", "#SystemDesign", "#React19", "#TypeScript", "#AgenticAI", "#OpenSource"],
    fullText,
  };

  console.log("--------------------------------------------------");
  console.log("📢 DISPATCHING VIRAL ARCHITECTURE POST TO LINKEDIN");
  console.log("--------------------------------------------------");
  console.log(fullText);
  console.log("--------------------------------------------------");

  const result = await publisherService.publish(Platform.LINKEDIN, payload);

  console.log("✅ PUBLISHED SUCCESSFULLY TO LINKEDIN!");
  console.log("Response:", JSON.stringify(result, null, 2));
}

main().catch(console.error);

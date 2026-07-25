import { Request, Response } from "express";
import { agentOrchestrator } from "@brand-os/agents";

export class AgentsController {
  public async triggerSwarm(_req: Request, res: Response) {
    try {
      const result = await agentOrchestrator.executePipeline();
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public getStatus(_req: Request, res: Response) {
    res.json({
      activeAgents: 12,
      swarmStatus: "IDLE",
      agents: [
        { name: "Trend Discovery Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Autonomous Research Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Fact Verification Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Writing Style RAG Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "LinkedIn Generator Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Medium Writer Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Reviewer Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Critic Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "SEO Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Publisher Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Analytics Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
        { name: "Learning Loop Agent", status: "ACTIVE", lastRun: new Date().toISOString() },
      ],
    });
  }
}

export const agentsController = new AgentsController();

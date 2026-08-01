import { Request, Response } from "express";
import { agentOrchestrator, VisualPlanningAgent, INFOGRAPHIC_PRESETS } from "@brand-os/agents";

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

  public generateVisualDiagram(req: Request, res: Response) {
    try {
      const { topic = "RAG vs CAG", presetKey } = req.body;
      const agent = new VisualPlanningAgent();

      if (presetKey && INFOGRAPHIC_PRESETS[presetKey]) {
        const preset = INFOGRAPHIC_PRESETS[presetKey];
        const svg = agent.generateDiagramSvg(preset.diagramSpec);
        return res.json({
          success: true,
          preset,
          diagramSpec: preset.diagramSpec,
          renderedSvg: svg,
        });
      }

      const result = agent.createVisualPlan({ id: "custom", title: topic, score: 95 } as any);
      return res.json({
        success: true,
        blueprint: result.data,
        diagramSpec: result.data.diagramSpec,
        renderedSvg: result.data.renderedSvg,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const agentsController = new AgentsController();


import { Request, Response } from "express";
import { DeepResearchAgent } from "@brand-os/agents";

export class ResearchController {
  public async conductResearch(req: Request, res: Response) {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic object required" });
    }
    const researchAgent = new DeepResearchAgent();
    const research = await researchAgent.run(topic);
    return res.json({ success: true, research });
  }
}

export const researchController = new ResearchController();

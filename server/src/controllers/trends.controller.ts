import { Request, Response } from "express";
import { TrendDiscoveryAgent } from "@brand-os/agents";

export class TrendsController {
  public async getTrends(_req: Request, res: Response) {
    const trendAgent = new TrendDiscoveryAgent();
    const topics = await trendAgent.run();
    res.json({ topics });
  }

  public async scanTrends(_req: Request, res: Response) {
    const trendAgent = new TrendDiscoveryAgent();
    const topics = await trendAgent.run();
    res.json({ success: true, count: topics.length, topics });
  }
}

export const trendsController = new TrendsController();

import { Request, Response } from "express";
import { analyticsService } from "@brand-os/analytics";

export class AnalyticsController {
  public getAnalytics(_req: Request, res: Response) {
    res.json(analyticsService.getSummary());
  }

  public async getLinkedInProfile(_req: Request, res: Response) {
    try {
      const profile = await analyticsService.fetchLinkedInProfile();
      res.json(profile);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public getTimeSeries(_req: Request, res: Response) {
    res.json(analyticsService.getTimeSeriesAnalytics());
  }

  public getRecentPosts(_req: Request, res: Response) {
    res.json(analyticsService.getRecentPosts());
  }
}

export const analyticsController = new AnalyticsController();

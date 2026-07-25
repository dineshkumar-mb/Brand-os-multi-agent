import { Request, Response } from "express";
import { analyticsService } from "@brand-os/analytics";

export class AnalyticsController {
  public getAnalytics(_req: Request, res: Response) {
    res.json(analyticsService.getSummary());
  }
}

export const analyticsController = new AnalyticsController();

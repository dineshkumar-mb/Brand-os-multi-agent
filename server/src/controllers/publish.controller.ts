import { Request, Response } from "express";
import { publisherService } from "@brand-os/publisher";
import { taskScheduler } from "@brand-os/scheduler";
import { Platform } from "@brand-os/shared";

export class PublishController {
  public async publishContent(req: Request, res: Response) {
    const { platform, content } = req.body;
    const result = await publisherService.publish(platform || Platform.LINKEDIN, content || {});
    res.json({ result });
  }

  public scheduleContent(req: Request, res: Response) {
    const { postId, scheduledFor } = req.body;
    res.json({ success: true, postId, scheduledFor: scheduledFor || new Date().toISOString() });
  }

  public getJobs(_req: Request, res: Response) {
    res.json({ jobs: taskScheduler.getTasks() });
  }
}

export const publishController = new PublishController();

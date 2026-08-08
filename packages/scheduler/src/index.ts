declare const process: any;

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  lastRun?: string;
  nextRun: string;
  status: "ACTIVE" | "PAUSED" | "RUNNING";
}

export class TaskScheduler {
  private tasks: ScheduledTask[] = [
    {
      id: "cron_0",
      name: "Global AI Intelligence Multi-Source Scan",
      cronExpression: process.env.INTELLIGENCE_SCAN_CRON || "0 * * * *",
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      status: "ACTIVE",
    },
    {
      id: "cron_1",
      name: "Hourly Trend Scan",
      cronExpression: "0 * * * *",
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      status: "ACTIVE",
    },
    {
      id: "cron_2",
      name: "Daily Deep Research Batch",
      cronExpression: "0 8 * * *",
      nextRun: new Date(Date.now() + 86400000).toISOString(),
      status: "ACTIVE",
    },
    {
      id: "cron_3",
      name: "Daily Content Generation & HITL Queueing",
      cronExpression: "0 10 * * *",
      nextRun: new Date(Date.now() + 86400000).toISOString(),
      status: "ACTIVE",
    },
    {
      id: "cron_4",
      name: "Weekly Analytics & Learning Loop Audit",
      cronExpression: "0 0 * * 0",
      nextRun: new Date(Date.now() + 604800000).toISOString(),
      status: "ACTIVE",
    },
  ];

  public getTasks(): ScheduledTask[] {
    return this.tasks;
  }

  public async triggerJob(taskId: string): Promise<{ success: boolean; taskId: string; executedAt: string }> {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.lastRun = new Date().toISOString();
    }
    return {
      success: true,
      taskId,
      executedAt: new Date().toISOString(),
    };
  }
}

export const taskScheduler = new TaskScheduler();

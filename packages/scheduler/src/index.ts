declare const process: any;

export * from "./schedule-config";
import { scheduleConfig } from "./schedule-config";

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  description: string;
  lastRun?: string;
  nextRun: string;
  status: "ACTIVE" | "PAUSED" | "RUNNING";
}

// ============================================================
// TASK SCHEDULER — Career Brand OS
// ============================================================
// This file exports task metadata for the dashboard UI.
// Actual cron execution happens via Vercel Cron → /api/v1/schedule/cron-weekly
// The worker does NOT run the content pipeline on a schedule.
// ============================================================

export class TaskScheduler {
  private tasks: ScheduledTask[] = [
    {
      id: "cron_0",
      name: "Global AI Intelligence Multi-Source Scan",
      description: "Collects raw intelligence signals from 6 source categories (Level 1–4). Runs hourly in the background.",
      cronExpression: process.env.INTELLIGENCE_SCAN_CRON || "0 * * * *",
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      status: "ACTIVE",
    },
    {
      id: "cron_1",
      name: "Twice-Weekly Content Generation",
      description:
        `Runs content generation pipeline on ${scheduleConfig.getConfig().generationDays.join(" + ")} ` +
        `at ${scheduleConfig.getConfig().generationTime} ${scheduleConfig.getConfig().timezone}. ` +
        `Triggered via Vercel Cron → /api/v1/schedule/cron-weekly. ` +
        `Never runs daily, never runs on weekends.`,
      cronExpression: buildTwiceWeeklyCron(),
      nextRun: getNextScheduledRun().toISOString(),
      status: "ACTIVE",
    },
    {
      id: "cron_2",
      name: "Weekly Analytics & Learning Loop Audit",
      description: "Processes analytics data and updates continuous learning parameters weekly.",
      cronExpression: "0 0 * * 0",
      nextRun: new Date(Date.now() + 604800000).toISOString(),
      status: "ACTIVE",
    },
  ];

  public getTasks(): ScheduledTask[] {
    return this.tasks;
  }

  public async triggerJob(
    taskId: string
  ): Promise<{ success: boolean; taskId: string; executedAt: string }> {
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

/**
 * Builds a Vixie-cron expression for Tuesday+Thursday at 03:30 UTC
 * (= 09:00 IST) by default. Reads from env to determine the days.
 *
 * Returns something like: "30 3 * * 2,4"
 */
function buildTwiceWeeklyCron(): string {
  const config = scheduleConfig.getConfig();
  const [hhStr, mmStr] = config.generationTime.split(":");
  let hh = parseInt(hhStr, 10);
  let mm = parseInt(mmStr, 10);

  // Convert configured IST (UTC+5:30) time to UTC
  const tzOffsetMinutes: Record<string, number> = {
    "Asia/Kolkata": 330,    // +5:30
    "UTC": 0,
    "America/New_York": -300,
    "America/Los_Angeles": -480,
    "Europe/London": 0,
    "Europe/Berlin": 60,
  };
  const offsetMin = tzOffsetMinutes[config.timezone] ?? 0;
  const totalMin = (hh * 60 + mm - offsetMin + 1440) % 1440;
  hh = Math.floor(totalMin / 60);
  mm = totalMin % 60;

  // Map weekday names to cron day-of-week numbers (0=Sun)
  const dayMap: Record<string, number> = {
    SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
    THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
  };

  const cronDays = config.generationDays
    .map((d) => dayMap[d])
    .filter((n) => n !== undefined && n >= 1 && n <= 5) // weekdays only
    .sort((a, b) => a - b)
    .join(",");

  return `${mm} ${hh} * * ${cronDays}`;
}

/**
 * Returns the Date of the next scheduled run based on configured days.
 * Used only for UI display purposes.
 */
function getNextScheduledRun(): Date {
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const candidate = new Date(now.getTime() + i * 86400000);
    if (scheduleConfig.isScheduledDay(candidate)) {
      return candidate;
    }
  }
  return new Date(now.getTime() + 7 * 86400000);
}

export const taskScheduler = new TaskScheduler();

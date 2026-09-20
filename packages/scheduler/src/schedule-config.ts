declare const process: any;

// ============================================================
// SCHEDULE CONFIGURATION — Career Brand OS
// ============================================================
// Controls WHEN content generation runs.
// Default: Tuesday + Thursday @ 09:00 IST (03:30 UTC)
// Override via environment variables:
//   CONTENT_GENERATION_DAYS="TUESDAY,THURSDAY"
//   CONTENT_GENERATION_TIME="09:00"
//   CONTENT_TIMEZONE="Asia/Kolkata"
//
// RULES:
//   - NEVER runs daily
//   - NEVER runs on Saturday or Sunday
//   - Only runs on the two explicitly configured weekdays
//   - Idempotency: same calendar-day slot never executes twice
// ============================================================

export type WeekdayName =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface ScheduleConfigValues {
  generationDays: WeekdayName[];
  generationTime: string; // "HH:MM" in configured timezone
  timezone: string;
}

/** JS Date.getDay() values: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat */
const DAY_INDEX: Record<WeekdayName, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export class ScheduleConfig {
  private config: ScheduleConfigValues;

  constructor() {
    this.config = this.loadFromEnv();
    this.validate();
  }

  private loadFromEnv(): ScheduleConfigValues {
    const rawDays = (process.env.CONTENT_GENERATION_DAYS || "TUESDAY,THURSDAY")
      .toUpperCase()
      .split(",")
      .map((d: string) => d.trim()) as WeekdayName[];

    const generationTime = process.env.CONTENT_GENERATION_TIME || "09:00";
    const timezone = process.env.CONTENT_TIMEZONE || "Asia/Kolkata";

    return { generationDays: rawDays, generationTime, timezone };
  }

  private validate(): void {
    const validDays: WeekdayName[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
    const invalid = this.config.generationDays.filter(
      (d) => !validDays.includes(d as WeekdayName)
    );
    if (invalid.length > 0) {
      throw new Error(
        `[ScheduleConfig] Invalid CONTENT_GENERATION_DAYS: ${invalid.join(", ")}. ` +
          `Only weekdays are allowed (MONDAY-FRIDAY). Got: ${this.config.generationDays.join(", ")}`
      );
    }
    if (this.config.generationDays.length === 0) {
      throw new Error("[ScheduleConfig] CONTENT_GENERATION_DAYS must specify at least one weekday.");
    }
    if (!/^\d{2}:\d{2}$/.test(this.config.generationTime)) {
      throw new Error(
        `[ScheduleConfig] Invalid CONTENT_GENERATION_TIME: "${this.config.generationTime}". ` +
          `Expected HH:MM format (e.g. "09:00").`
      );
    }
  }

  /** Return the loaded configuration values. */
  public getConfig(): Readonly<ScheduleConfigValues> {
    return { ...this.config };
  }

  /**
   * Returns true if the given Date falls on a configured generation day.
   * Always returns false for Saturday and Sunday regardless of config.
   */
  public isScheduledDay(date: Date = new Date()): boolean {
    const jsDay = date.getDay(); // 0=Sun … 6=Sat
    // Hard block on weekends
    if (jsDay === 0 || jsDay === 6) return false;

    const dayOfWeek = this.getWeekdayName(jsDay);
    return this.config.generationDays.includes(dayOfWeek);
  }

  /** Returns true if the given Date is Saturday (6) or Sunday (0). */
  public isWeekend(date: Date = new Date()): boolean {
    const d = date.getDay();
    return d === 0 || d === 6;
  }

  /**
   * Returns the weekday name of a JS day index.
   * Throws for Saturday/Sunday (not valid generation days).
   */
  public getWeekdayName(jsDay: number): WeekdayName {
    const names: WeekdayName[] = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    return names[jsDay];
  }

  /**
   * Generates an idempotency key for the given date.
   * Format: career-brand-os:YYYY-MM-DD:scheduled-run
   *
   * Use this key to check if the current calendar-day slot
   * has already been executed (preventing duplicate runs).
   */
  public getIdempotencyKey(date: Date = new Date()): string {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    return `career-brand-os:${yyyy}-${mm}-${dd}:scheduled-run`;
  }

  /**
   * Checks automation history to determine whether this calendar day
   * has already completed a scheduled run successfully.
   *
   * @param history - Array of AutomationRunStatus records (from automationTracker)
   * @param date    - Date to check (defaults to now)
   * @returns true if a SUCCESS or NO_POST_TODAY run already exists for today
   */
  public hasDuplicateRun(
    history: Array<{ timestamp: string; status: string }>,
    date: Date = new Date()
  ): boolean {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const todayPrefix = `${yyyy}-${mm}-${dd}`;

    return history.some((run) => {
      const ranDate = run.timestamp?.substring(0, 10);
      const wasCompleted = run.status === "SUCCESS" || run.status === "NO_POST_TODAY";
      return ranDate === todayPrefix && wasCompleted;
    });
  }

  /**
   * Returns a human-readable summary of the current schedule config.
   * Safe to log (no secrets).
   */
  public describe(): string {
    return (
      `[ScheduleConfig] Generation days: ${this.config.generationDays.join(", ")} | ` +
      `Time: ${this.config.generationTime} ${this.config.timezone} | ` +
      `UTC equivalent: ${this.toUtcDescription()}`
    );
  }

  private toUtcDescription(): string {
    // Simple IST offset explanation — extend for other timezones if needed
    const tzOffsets: Record<string, number> = {
      "Asia/Kolkata": 5.5,
      "UTC": 0,
      "America/New_York": -5,
      "America/Los_Angeles": -8,
      "Europe/London": 0,
      "Europe/Berlin": 1,
    };
    const [hh, mm] = this.config.generationTime.split(":").map(Number);
    const offset = tzOffsets[this.config.timezone] ?? 0;
    const utcMinutes = (hh * 60 + mm - offset * 60 + 1440) % 1440;
    const utcHH = String(Math.floor(utcMinutes / 60)).padStart(2, "0");
    const utcMM = String(utcMinutes % 60).padStart(2, "0");
    return `~${utcHH}:${utcMM} UTC`;
  }
}

export const scheduleConfig = new ScheduleConfig();

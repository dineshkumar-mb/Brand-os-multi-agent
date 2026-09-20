import { describe, it, expect, beforeEach } from "vitest";
import { ScheduleConfig } from "../packages/scheduler/src/schedule-config";

// ============================================================
// SCHEDULER TWICE-WEEKLY TESTS
// Career Brand OS — Schedule Enforcement
// ============================================================
// Validates that the schedule configuration:
//   1. Correctly identifies scheduled days (Tue + Thu by default)
//   2. Blocks weekends unconditionally
//   3. Blocks non-configured weekdays (Mon, Wed, Fri)
//   4. Generates correct idempotency keys
//   5. Detects duplicate runs
//   6. Validates env configuration

// Helper: Create a Date for a specific weekday
function dateForDay(dayName: string, hoursOffset = 0): Date {
  const dayMap: Record<string, number> = {
    SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
    THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
  };
  const target = dayMap[dayName.toUpperCase()];
  const now = new Date();
  const current = now.getDay();
  const diff = (target - current + 7) % 7;
  const d = new Date(now);
  d.setDate(d.getDate() + diff + (diff === 0 ? 7 : 0));
  d.setHours(hoursOffset, 0, 0, 0);
  return d;
}

// Helper: Create a Date for absolute day-of-week (forces it)
function makeDateWithDay(jsDay: number): Date {
  const d = new Date("2026-01-01T10:00:00Z"); // Known Thursday
  // 2026-01-01 is Thursday (day 4)
  const diff = (jsDay - 4 + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

describe("ScheduleConfig — Default Configuration (Tue + Thu)", () => {
  let config: ScheduleConfig;

  beforeEach(() => {
    // Reset env to defaults
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
    process.env.CONTENT_GENERATION_TIME = "09:00";
    process.env.CONTENT_TIMEZONE = "Asia/Kolkata";
    config = new ScheduleConfig();
  });

  it("should load default configuration correctly", () => {
    const cfg = config.getConfig();
    expect(cfg.generationDays).toEqual(["TUESDAY", "THURSDAY"]);
    expect(cfg.generationTime).toBe("09:00");
    expect(cfg.timezone).toBe("Asia/Kolkata");
  });

  it("should identify Tuesday as a scheduled day", () => {
    const tuesday = makeDateWithDay(2); // 2 = Tuesday
    expect(tuesday.getDay()).toBe(2);
    expect(config.isScheduledDay(tuesday)).toBe(true);
  });

  it("should identify Thursday as a scheduled day", () => {
    const thursday = makeDateWithDay(4); // 4 = Thursday
    expect(thursday.getDay()).toBe(4);
    expect(config.isScheduledDay(thursday)).toBe(true);
  });

  it("should NOT identify Monday as a scheduled day", () => {
    const monday = makeDateWithDay(1);
    expect(config.isScheduledDay(monday)).toBe(false);
  });

  it("should NOT identify Wednesday as a scheduled day", () => {
    const wednesday = makeDateWithDay(3);
    expect(config.isScheduledDay(wednesday)).toBe(false);
  });

  it("should NOT identify Friday as a scheduled day", () => {
    const friday = makeDateWithDay(5);
    expect(config.isScheduledDay(friday)).toBe(false);
  });

  it("should NOT identify Saturday as a scheduled day (weekend block)", () => {
    const saturday = makeDateWithDay(6);
    expect(config.isScheduledDay(saturday)).toBe(false);
    expect(config.isWeekend(saturday)).toBe(true);
  });

  it("should NOT identify Sunday as a scheduled day (weekend block)", () => {
    const sunday = makeDateWithDay(0);
    expect(config.isScheduledDay(sunday)).toBe(false);
    expect(config.isWeekend(sunday)).toBe(true);
  });

  it("isWeekend() should return true for Saturday and Sunday only", () => {
    expect(config.isWeekend(makeDateWithDay(0))).toBe(true);  // Sunday
    expect(config.isWeekend(makeDateWithDay(1))).toBe(false); // Monday
    expect(config.isWeekend(makeDateWithDay(2))).toBe(false); // Tuesday
    expect(config.isWeekend(makeDateWithDay(3))).toBe(false); // Wednesday
    expect(config.isWeekend(makeDateWithDay(4))).toBe(false); // Thursday
    expect(config.isWeekend(makeDateWithDay(5))).toBe(false); // Friday
    expect(config.isWeekend(makeDateWithDay(6))).toBe(true);  // Saturday
  });
});

describe("ScheduleConfig — Idempotency Key", () => {
  let config: ScheduleConfig;

  beforeEach(() => {
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
    process.env.CONTENT_GENERATION_TIME = "09:00";
    process.env.CONTENT_TIMEZONE = "Asia/Kolkata";
    config = new ScheduleConfig();
  });

  it("should generate idempotency key in format career-brand-os:YYYY-MM-DD:scheduled-run", () => {
    const date = new Date("2026-09-23T10:00:00Z"); // Tuesday
    const key = config.getIdempotencyKey(date);
    expect(key).toMatch(/^career-brand-os:\d{4}-\d{2}-\d{2}:scheduled-run$/);
    expect(key).toBe("career-brand-os:2026-09-23:scheduled-run");
  });

  it("should generate different keys for different dates", () => {
    const tuesday = new Date("2026-09-22T10:00:00Z");
    const thursday = new Date("2026-09-24T10:00:00Z");
    expect(config.getIdempotencyKey(tuesday)).not.toBe(config.getIdempotencyKey(thursday));
  });

  it("should generate the same key for the same date regardless of time", () => {
    // Both times are on 2026-09-22 (UTC) — same date → same key
    const morning = new Date("2026-09-22T08:00:00Z");
    const evening = new Date("2026-09-22T20:00:00Z");
    const morningKey = config.getIdempotencyKey(morning);
    const eveningKey = config.getIdempotencyKey(evening);
    expect(morningKey).toBe(eveningKey);
    expect(morningKey).toBe("career-brand-os:2026-09-22:scheduled-run");
  });
});

describe("ScheduleConfig — Duplicate Run Detection", () => {
  let config: ScheduleConfig;

  beforeEach(() => {
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
    process.env.CONTENT_GENERATION_TIME = "09:00";
    process.env.CONTENT_TIMEZONE = "Asia/Kolkata";
    config = new ScheduleConfig();
  });

  it("should detect a duplicate SUCCESS run on the same day", () => {
    const today = new Date("2026-09-22T10:00:00Z");
    const history = [
      { timestamp: "2026-09-22T09:35:12.000Z", status: "SUCCESS" },
    ];
    expect(config.hasDuplicateRun(history, today)).toBe(true);
  });

  it("should detect a duplicate NO_POST_TODAY run on the same day", () => {
    const today = new Date("2026-09-22T10:00:00Z");
    const history = [
      { timestamp: "2026-09-22T09:35:12.000Z", status: "NO_POST_TODAY" },
    ];
    expect(config.hasDuplicateRun(history, today)).toBe(true);
  });

  it("should NOT block a run if only ERROR status exists for today", () => {
    const today = new Date("2026-09-22T10:00:00Z");
    const history = [
      { timestamp: "2026-09-22T09:35:12.000Z", status: "ERROR" },
    ];
    // ERROR does not count as completed — allow retry
    expect(config.hasDuplicateRun(history, today)).toBe(false);
  });

  it("should NOT block a run if last success was on a different day", () => {
    const today = new Date("2026-09-25T10:00:00Z"); // Thursday
    const history = [
      { timestamp: "2026-09-22T09:35:12.000Z", status: "SUCCESS" }, // Tuesday
    ];
    expect(config.hasDuplicateRun(history, today)).toBe(false);
  });

  it("should NOT block a run with an empty history", () => {
    const today = new Date("2026-09-22T10:00:00Z");
    expect(config.hasDuplicateRun([], today)).toBe(false);
  });
});

describe("ScheduleConfig — Custom Configuration", () => {
  it("should support custom days (Monday + Wednesday)", () => {
    process.env.CONTENT_GENERATION_DAYS = "MONDAY,WEDNESDAY";
    process.env.CONTENT_GENERATION_TIME = "09:00";
    process.env.CONTENT_TIMEZONE = "Asia/Kolkata";
    const config = new ScheduleConfig();

    expect(config.isScheduledDay(makeDateWithDay(1))).toBe(true);  // Monday
    expect(config.isScheduledDay(makeDateWithDay(3))).toBe(true);  // Wednesday
    expect(config.isScheduledDay(makeDateWithDay(2))).toBe(false); // Tuesday
    expect(config.isScheduledDay(makeDateWithDay(4))).toBe(false); // Thursday

    // Reset
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
  });

  it("should throw if SATURDAY or SUNDAY is specified in days", () => {
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,SATURDAY";
    expect(() => new ScheduleConfig()).toThrow();
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
  });

  it("should throw if time format is invalid", () => {
    process.env.CONTENT_GENERATION_TIME = "9am";
    expect(() => new ScheduleConfig()).toThrow();
    process.env.CONTENT_GENERATION_TIME = "09:00";
  });

  it("should always block weekend regardless of custom config", () => {
    process.env.CONTENT_GENERATION_DAYS = "MONDAY,WEDNESDAY";
    const config = new ScheduleConfig();
    // Even with custom config, Saturday and Sunday must always be blocked
    expect(config.isWeekend(makeDateWithDay(0))).toBe(true);
    expect(config.isWeekend(makeDateWithDay(6))).toBe(true);
    expect(config.isScheduledDay(makeDateWithDay(0))).toBe(false); // Sunday — hard block
    expect(config.isScheduledDay(makeDateWithDay(6))).toBe(false); // Saturday — hard block
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
  });
});

describe("ScheduleConfig — getWeekdayName()", () => {
  let config: ScheduleConfig;

  beforeEach(() => {
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
    process.env.CONTENT_GENERATION_TIME = "09:00";
    config = new ScheduleConfig();
  });

  it("should return correct weekday names for all JS day indices", () => {
    expect(config.getWeekdayName(0)).toBe("SUNDAY");
    expect(config.getWeekdayName(1)).toBe("MONDAY");
    expect(config.getWeekdayName(2)).toBe("TUESDAY");
    expect(config.getWeekdayName(3)).toBe("WEDNESDAY");
    expect(config.getWeekdayName(4)).toBe("THURSDAY");
    expect(config.getWeekdayName(5)).toBe("FRIDAY");
    expect(config.getWeekdayName(6)).toBe("SATURDAY");
  });
});

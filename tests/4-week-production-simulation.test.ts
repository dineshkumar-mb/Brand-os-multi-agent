import { describe, it, expect, beforeEach } from "vitest";
import { ScheduleConfig } from "../packages/scheduler/src/schedule-config";

// ============================================================
// 4-WEEK PRODUCTION SIMULATION — Career Brand OS
// ============================================================
// Simulates 28 consecutive days of scheduled cron calls,
// verifying exactly 8 runs happen (Tue+Thu × 4 weeks),
// no weekend runs, no Monday/Wednesday/Friday runs,
// and no duplicate runs per calendar day.
//
// This is the "scheduler audit" required by the system spec.
// ============================================================

interface SimulatedRunRecord {
  date: Date;
  dayName: string;
  jsDay: number;
  accepted: boolean;
  rejectionReason?: string;
}

interface SimulationReport {
  scheduledRuns: number;
  actualRuns: number;
  duplicateRuns: number;
  weekendRuns: number;
  mondayRuns: number;
  wednesdayRuns: number;
  fridayRuns: number;
  tuesdayRuns: number;
  thursdayRuns: number;
  allAcceptedDays: string[];
  rejectedDays: { day: string; reason: string }[];
}

function runSimulation(
  startDate: Date,
  days: number,
  configuredDays: string[] = ["TUESDAY", "THURSDAY"],
  callsPerDay: number = 1
): SimulationReport {
  process.env.CONTENT_GENERATION_DAYS = configuredDays.join(",");
  process.env.CONTENT_GENERATION_TIME = "09:00";
  process.env.CONTENT_TIMEZONE = "Asia/Kolkata";

  const config = new ScheduleConfig();
  const runHistory: Array<{ timestamp: string; status: string }> = [];
  const allRecords: SimulatedRunRecord[] = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayOffset);
    currentDate.setHours(9, 30, 0, 0); // 09:30 AM

    const dayName = config.getWeekdayName(currentDate.getDay());

    // Simulate multiple calls per day (testing idempotency)
    for (let call = 0; call < callsPerDay; call++) {
      // Simulate the /cron-weekly endpoint logic
      let accepted = false;
      let rejectionReason: string | undefined;

      if (config.isWeekend(currentDate)) {
        rejectionReason = "WEEKEND_BLOCKED";
      } else if (!config.isScheduledDay(currentDate)) {
        rejectionReason = "NOT_SCHEDULED_DAY";
      } else if (config.hasDuplicateRun(runHistory, currentDate)) {
        rejectionReason = "DUPLICATE_RUN_SKIPPED";
      } else {
        // Accepted — simulate a SUCCESS
        accepted = true;
        runHistory.push({
          timestamp: currentDate.toISOString(),
          status: "SUCCESS",
        });
      }

      allRecords.push({
        date: new Date(currentDate),
        dayName,
        jsDay: currentDate.getDay(),
        accepted,
        rejectionReason,
      });
    }
  }

  // Build the report
  const acceptedRecords = allRecords.filter((r) => r.accepted);
  const rejectedRecords = allRecords.filter((r) => !r.accepted);

  const duplicateRecords = rejectedRecords.filter(
    (r) => r.rejectionReason === "DUPLICATE_RUN_SKIPPED"
  );
  const weekendRecords = rejectedRecords.filter(
    (r) => r.rejectionReason === "WEEKEND_BLOCKED"
  );

  return {
    scheduledRuns: 8, // Expected: Tue + Thu × 4 weeks
    actualRuns: acceptedRecords.length,
    duplicateRuns: duplicateRecords.length,
    weekendRuns: weekendRecords.length,
    mondayRuns: acceptedRecords.filter((r) => r.jsDay === 1).length,
    wednesdayRuns: acceptedRecords.filter((r) => r.jsDay === 3).length,
    fridayRuns: acceptedRecords.filter((r) => r.jsDay === 5).length,
    tuesdayRuns: acceptedRecords.filter((r) => r.jsDay === 2).length,
    thursdayRuns: acceptedRecords.filter((r) => r.jsDay === 4).length,
    allAcceptedDays: acceptedRecords.map(
      (r) => `${r.date.toISOString().substring(0, 10)} (${r.dayName})`
    ),
    rejectedDays: rejectedRecords.map((r) => ({
      day: `${r.date.toISOString().substring(0, 10)} (${r.dayName})`,
      reason: r.rejectionReason || "UNKNOWN",
    })),
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("4-Week Production Simulation — Twice-Weekly Schedule (Tue + Thu)", () => {
  // Start from a known Monday so the simulation covers clean weeks
  // 2026-09-21 is a Monday (confirmed by calculation)
  const START_DATE = new Date("2026-09-21T00:00:00Z");
  let report: SimulationReport;

  beforeEach(() => {
    process.env.CONTENT_GENERATION_DAYS = "TUESDAY,THURSDAY";
    process.env.CONTENT_GENERATION_TIME = "09:00";
    process.env.CONTENT_TIMEZONE = "Asia/Kolkata";
    report = runSimulation(START_DATE, 28); // 4 weeks
  });

  it("should execute exactly 8 runs across 28 days (2 per week × 4 weeks)", () => {
    expect(report.actualRuns).toBe(8);
    console.log(`\n[4-Week Simulation] Accepted runs: ${report.actualRuns}`);
    console.log(`[4-Week Simulation] Accepted days:\n  ${report.allAcceptedDays.join("\n  ")}`);
  });

  it("should execute exactly 4 Tuesday runs", () => {
    expect(report.tuesdayRuns).toBe(4);
  });

  it("should execute exactly 4 Thursday runs", () => {
    expect(report.thursdayRuns).toBe(4);
  });

  it("should NEVER execute on Monday", () => {
    expect(report.mondayRuns).toBe(0);
  });

  it("should NEVER execute on Wednesday", () => {
    expect(report.wednesdayRuns).toBe(0);
  });

  it("should NEVER execute on Friday", () => {
    expect(report.fridayRuns).toBe(0);
  });

  it("should NEVER execute on Saturday or Sunday (weekend block)", () => {
    // weekendRuns in the report = number of weekend calls that were BLOCKED (not accepted)
    // This should be 8 (4 weeks × 2 weekend days per week = 8 correctly blocked)
    // The key assertion is: no weekend calls were ACCEPTED (acceptedRuns is only Tue+Thu)
    expect(report.weekendRuns).toBe(8); // 8 weekend blocks is correct — all blocked
    expect(report.tuesdayRuns + report.thursdayRuns).toBe(report.actualRuns); // only Tue+Thu accepted
  });

  it("should have zero duplicate runs (idempotency)", () => {
    expect(report.duplicateRuns).toBe(0);
  });
});

describe("4-Week Simulation — Idempotency Under Double-Call", () => {
  // Simulate 2 cron calls per day (e.g., Vercel fires twice due to retry)
  const START_DATE = new Date("2026-09-21T00:00:00Z");

  it("should still execute exactly 8 runs even if cron fires twice per day", () => {
    const report = runSimulation(START_DATE, 28, ["TUESDAY", "THURSDAY"], 2);
    expect(report.actualRuns).toBe(8);
    expect(report.duplicateRuns).toBe(8); // 8 duplicate blocks (one per scheduled day)
  });

  it("should produce 16 total call attempts but only 8 accepted", () => {
    // 2 calls × 2 configured days × 4 weeks = 16 attempts on scheduled days
    // Only the first call each day should be accepted
    const report = runSimulation(START_DATE, 28, ["TUESDAY", "THURSDAY"], 2);
    expect(report.actualRuns).toBe(8);
    expect(report.duplicateRuns).toBe(8);
    // Weekend blocks exist (8 per-day blocked) but no weekend runs were ACCEPTED
    expect(report.tuesdayRuns + report.thursdayRuns).toBe(report.actualRuns);
  });
});

describe("4-Week Simulation — Weekend Boundary Test", () => {
  const START_DATE = new Date("2026-09-21T00:00:00Z");

  it("should reject exactly 8 Saturday+Sunday days across 4 weeks (2 weekends × 4 weeks)", () => {
    // 4 weeks × 2 weekend days = 8 weekend blocks
    // (The report.weekendRuns are runs that TRIED and were blocked — but our simulation only calls on weekdays by design)
    // Actually in a realistic scenario where Vercel calls every day, we'd see weekend blocks.
    // Let's simulate that: 1 call per day for all 28 days
    const report = runSimulation(START_DATE, 28, ["TUESDAY", "THURSDAY"], 1);
    const weekendDays = report.rejectedDays.filter((r) => r.reason === "WEEKEND_BLOCKED");
    // 4 weeks × 2 weekend days = 8
    expect(weekendDays.length).toBe(8);
  });
});

describe("4-Week Simulation — Custom 3-Day Config Validation", () => {
  it("should execute 12 runs if configured for Mon+Wed+Fri (3 days × 4 weeks)", () => {
    const START_DATE = new Date("2026-09-21T00:00:00Z");
    const report = runSimulation(START_DATE, 28, ["MONDAY", "WEDNESDAY", "FRIDAY"], 1);
    expect(report.actualRuns).toBe(12);
    // weekendRuns = correctly blocked weekend days (8), not accepted
    expect(report.mondayRuns + report.wednesdayRuns + report.fridayRuns).toBe(report.actualRuns);
  });
});

describe("4-Week Simulation — Final Report Generation", () => {
  const START_DATE = new Date("2026-09-21T00:00:00Z");

  it("should generate a valid final audit report", () => {
    const report = runSimulation(START_DATE, 28, ["TUESDAY", "THURSDAY"], 1);

    // PASS when: 8 runs happened, 0 duplicates, 0 accepted weekend runs
    const acceptedOnWeekend = report.allAcceptedDays.filter((d) =>
      d.includes("SATURDAY") || d.includes("SUNDAY")
    ).length;

    const auditReport = `
==================================================
CAREER BRAND OS — 4 WEEK SCHEDULER AUDIT
==================================================

Scheduled Runs:         ${report.scheduledRuns}
Actual Runs:            ${report.actualRuns}
Duplicate Runs:         ${report.duplicateRuns}
Weekend Blocks:         ${report.weekendRuns} (correctly blocked)
Monday Runs:            ${report.mondayRuns}
Wednesday Runs:         ${report.wednesdayRuns}
Friday Runs:            ${report.fridayRuns}
Tuesday Runs:           ${report.tuesdayRuns}
Thursday Runs:          ${report.thursdayRuns}

Accepted Days:
${report.allAcceptedDays.map((d) => `  ✅ ${d}`).join("\n")}

==================================================
RESULT: ${report.actualRuns === 8 && report.duplicateRuns === 0 && acceptedOnWeekend === 0 ? "✅ PASS" : "❌ FAIL"}
==================================================
`.trim();

    console.log("\n" + auditReport + "\n");

    // Final assertions
    expect(report.actualRuns).toBe(8);
    expect(report.duplicateRuns).toBe(0);
    // weekendRuns = number of correctly BLOCKED weekend attempts (8 = correct)
    expect(report.weekendRuns).toBe(8);
    expect(report.mondayRuns).toBe(0);
    expect(report.wednesdayRuns).toBe(0);
    expect(report.fridayRuns).toBe(0);
    expect(report.tuesdayRuns).toBe(4);
    expect(report.thursdayRuns).toBe(4);
    expect(report.allAcceptedDays).toHaveLength(8);
  });
});

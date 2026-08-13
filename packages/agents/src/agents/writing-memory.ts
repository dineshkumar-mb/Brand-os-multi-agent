import {
  HookType,
  DiscussionCtaType,
  NarrativePattern,
  WritingMemoryEntry,
  WritingQualityScore,
  ContentAngle,
  StoryMode,
  FormatStyle,
} from "@brand-os/shared";

declare const process: any;
declare const require: any;

const fs = require("fs");
const path = require("path");

const WRITING_MEMORY_FILE = path.resolve(process.cwd(), "writing_memory.json");

export class WritingMemoryTracker {
  private memory: WritingMemoryEntry[] = [];

  constructor() {
    this.loadMemory();
  }

  private loadMemory() {
    if (this.memory.length > 0) return;
    try {
      if (fs.existsSync(WRITING_MEMORY_FILE)) {
        const raw = fs.readFileSync(WRITING_MEMORY_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.memory = parsed;
          return;
        }
      }
    } catch (err: any) {
      console.warn("[WritingMemoryTracker] Failed to load writing memory from disk:", err.message);
    }
    this.memory = [];
  }

  private saveMemory() {
    try {
      fs.writeFileSync(WRITING_MEMORY_FILE, JSON.stringify(this.memory, null, 2), "utf-8");
    } catch (err: any) {
      console.warn("[WritingMemoryTracker] Failed to save writing memory to disk:", err.message);
    }
  }

  public getHistory(limit: number = 30): WritingMemoryEntry[] {
    this.loadMemory();
    return this.memory.slice(0, limit);
  }

  public recordEntry(entry: Omit<WritingMemoryEntry, "id" | "timestamp">): WritingMemoryEntry {
    this.loadMemory();
    const fullEntry: WritingMemoryEntry = {
      ...entry,
      id: `wm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    this.memory.unshift(fullEntry);
    this.saveMemory();
    return fullEntry;
  }

  /**
   * Select a StoryMode that was NOT used in recent 7 posts (enforcing rotation)
   */
  public selectFreshStoryMode(preferredMode?: StoryMode): StoryMode {
    const allModes = Object.values(StoryMode);
    const recentModes = this.getHistory(7)
      .map((m) => m.storyMode)
      .filter((m): m is StoryMode => Boolean(m));

    if (preferredMode && !recentModes.includes(preferredMode)) {
      return preferredMode;
    }

    const available = allModes.filter((m) => !recentModes.includes(m));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    // Fallback: choose least recently used
    const lastUsed = recentModes[0];
    const alternative = allModes.find((m) => m !== lastUsed);
    return alternative || StoryMode.FAILURE_STORY;
  }

  /**
   * Select a FormatStyle layout that was NOT used in recent 7 posts
   */
  public selectFreshFormatStyle(preferredStyle?: FormatStyle): FormatStyle {
    const allStyles = Object.values(FormatStyle);
    const recentStyles = this.getHistory(7)
      .map((m) => m.formatStyle)
      .filter((s): s is FormatStyle => Boolean(s));

    if (preferredStyle && !recentStyles.includes(preferredStyle)) {
      return preferredStyle;
    }

    const available = allStyles.filter((s) => !recentStyles.includes(s));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    const lastUsed = recentStyles[0];
    const alternative = allStyles.find((s) => s !== lastUsed);
    return alternative || FormatStyle.NARRATIVE_PARAGRAPHS;
  }

  /**
   * Select a hook structure that was NOT used in recent 7 posts
   */
  public selectFreshHookType(preferredType?: HookType): HookType {
    const allHooks = Object.values(HookType);
    const recentHooks = this.getHistory(7).map((m) => m.hookType);

    if (preferredType && !recentHooks.includes(preferredType)) {
      return preferredType;
    }

    const available = allHooks.filter((h) => !recentHooks.includes(h));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    const lastUsed = recentHooks[0];
    const alternative = allHooks.find((h) => h !== lastUsed);
    return alternative || HookType.ENGINEERING_OBSERVATION;
  }

  /**
   * Select a CTA pattern that was NOT used in recent 7 posts
   */
  public selectFreshCtaType(preferredType?: DiscussionCtaType): DiscussionCtaType {
    const allCtas = Object.values(DiscussionCtaType);
    const recentCtas = this.getHistory(7).map((m) => m.ctaType);

    if (preferredType && !recentCtas.includes(preferredType)) {
      return preferredType;
    }

    const available = allCtas.filter((c) => !recentCtas.includes(c));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    const lastUsed = recentCtas[0];
    const alternative = allCtas.find((c) => c !== lastUsed);
    return alternative || DiscussionCtaType.TRADEOFF_CHOICE;
  }

  /**
   * Select a NarrativePattern that was NOT used in recent 7 posts
   */
  public selectFreshNarrativePattern(topicTitle?: string): NarrativePattern {
    const patterns: NarrativePattern[] = [
      "ENGINEERING_DISCOVERY",
      "UNEXPECTED_PROBLEM",
      "TECHNICAL_TRADEOFF",
      "PRODUCTION_FAILURE",
      "CONTRARIAN_OBSERVATION",
      "NEW_TECHNOLOGY_ANALYSIS",
      "BUILD_IN_PUBLIC",
      "ARCHITECTURE_LESSON",
    ];
    const recentPatterns = this.getHistory(7).map((m) => m.narrativePattern);

    const available = patterns.filter((p) => !recentPatterns.includes(p));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    return "ENGINEERING_DISCOVERY";
  }
}

export const writingMemoryTracker = new WritingMemoryTracker();

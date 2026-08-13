import {
  RecentVisualMemoryEntry,
  VisualFormat,
  VisualComposition,
  ColorStyle,
} from "@brand-os/shared";

declare const process: any;
declare const require: any;

const fs = require("fs");
const path = require("path");

const VISUAL_MEMORY_FILE = path.resolve(process.cwd(), "visual_memory.json");

export class RecentVisualMemoryStore {
  private history: RecentVisualMemoryEntry[] = [];

  constructor() {
    this.loadMemory();
  }

  private loadMemory() {
    if (this.history.length > 0) return;
    try {
      if (fs.existsSync(VISUAL_MEMORY_FILE)) {
        const raw = fs.readFileSync(VISUAL_MEMORY_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.history = parsed;
        }
      }
    } catch (err: any) {
      console.warn("[RecentVisualMemoryStore] Failed to load visual memory from disk:", err.message);
    }
  }

  public clearMemory() {
    this.history = [];
    try {
      if (fs.existsSync(VISUAL_MEMORY_FILE)) {
        fs.unlinkSync(VISUAL_MEMORY_FILE);
      }
    } catch (err: any) {}
  }

  private saveMemory() {
    try {
      fs.writeFileSync(VISUAL_MEMORY_FILE, JSON.stringify(this.history, null, 2), "utf-8");
    } catch (err: any) {
      console.warn("[RecentVisualMemoryStore] Failed to save visual memory to disk:", err.message);
    }
  }

  public recordEntry(entry: RecentVisualMemoryEntry) {
    this.loadMemory();
    this.history.unshift(entry);
    if (this.history.length > 30) {
      this.history = this.history.slice(0, 30);
    }
    this.saveMemory();
  }

  public getHistory(days: number = 14): RecentVisualMemoryEntry[] {
    this.loadMemory();
    const cutoff = Date.now() - days * 86400000;
    return this.history.filter((entry) => new Date(entry.date).getTime() >= cutoff);
  }

  public calculateRepetitionScore(
    candidate: {
      visualFormat: VisualFormat;
      composition: VisualComposition;
      colorStyle: ColorStyle;
      promptHash: string;
      topic: string;
    },
    daysLookback: number = 14
  ): { repetitionScore: number; reason?: string } {
    const recentEntries = this.getHistory(daysLookback);
    if (recentEntries.length === 0) return { repetitionScore: 0 };

    let highestRepetitionScore = 0;
    let mainReason = "";

    const candidatePrompt = candidate.promptHash.toLowerCase();

    for (let i = 0; i < recentEntries.length; i++) {
      const entry = recentEntries[i];
      let entryScore = 0;

      // Format repetition (e.g. 3 consecutive architecture diagrams)
      if (entry.visualFormat === candidate.visualFormat) {
        entryScore += i < 3 ? 45 : 25;
      }

      // Composition repetition
      if (entry.composition === candidate.composition) {
        entryScore += i < 3 ? 25 : 15;
      }

      // Color style repetition
      if (entry.colorStyle === candidate.colorStyle) {
        entryScore += i < 3 ? 20 : 10;
      }

      // Prompt hash exact match
      if (entry.promptHash.toLowerCase() === candidatePrompt) {
        entryScore += 50;
      }

      // Topic similarity
      if (entry.topic.toLowerCase() === candidate.topic.toLowerCase()) {
        entryScore += 30;
      }

      if (entryScore > highestRepetitionScore) {
        highestRepetitionScore = entryScore;
        mainReason = `Similar to post from ${entry.date} (${entry.topic}) - Format: ${entry.visualFormat}, Color: ${entry.colorStyle}`;
      }
    }

    const finalScore = Math.min(100, highestRepetitionScore);
    return {
      repetitionScore: finalScore,
      reason: finalScore > 35 ? mainReason : undefined,
    };
  }
}

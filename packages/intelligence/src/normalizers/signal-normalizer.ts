import { RawIntelligenceSignal } from "../sources/types.js";

export class SignalNormalizer {
  public normalizeSignal(raw: RawIntelligenceSignal): RawIntelligenceSignal {
    const cleanTitle = (raw.title || "")
      .replace(/^\[.*?\]\s*/, "")
      .replace(/\s*\(Score:\s*\d+\)/gi, "")
      .replace(/\s*\(Upvotes:\s*\d+\)/gi, "")
      .trim();

    return {
      ...raw,
      title: cleanTitle || "Technical Intelligence Signal",
      content: (raw.content || "").trim(),
      tags: Array.from(new Set(raw.tags || [])).map((t) => t.trim()),
    };
  }

  public normalizeBatch(rawSignals: RawIntelligenceSignal[]): RawIntelligenceSignal[] {
    return rawSignals.map((s) => this.normalizeSignal(s));
  }
}

export const signalNormalizer = new SignalNormalizer();

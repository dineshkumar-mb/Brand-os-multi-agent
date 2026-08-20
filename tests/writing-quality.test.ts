import { describe, it, expect } from "vitest";
import { writingQualityEvaluator } from "../packages/agents/src/agents/writing-quality-evaluator";
import { LinkedInPostPayload, Platform } from "../packages/shared/src/index";

describe("Writing Quality Evaluator Tests", () => {
  it("should penalize AI cliché score when blocklisted phrases are present in the text", () => {
    const post: LinkedInPostPayload = {
      title: "Optimizing database queries",
      hook: "Let's dive in to explore system performance.",
      story: "In today's fast-paced world, building systems is a game-changing endeavor.",
      lesson: "This is a testament to our synergy.",
      actionableInsight: "Embark on a journey to transform your workflow.",
      cta: "What is your approach?",
      hashtags: ["SystemDesign"],
      fullText: "Let's dive in. In today's fast-paced world, this is a game-changing synergy.",
    };

    const res = writingQualityEvaluator.evaluate(post);
    expect(res.aiClicheScore).toBeLessThan(100);
  });

  it("should penalize structural repetition score if rigid headers are present in the fullText", () => {
    const post: LinkedInPostPayload = {
      title: "Debugging memory leaks",
      hook: "Valid hook",
      story: "Some story",
      lesson: "Some lesson",
      actionableInsight: "Insight",
      cta: "CTA",
      hashtags: [],
      fullText: "Situation: We had a leak. Task: Find it. Action: Analyzed heap. Result: Found it.",
    };

    const res = writingQualityEvaluator.evaluate(post);
    expect(res.boredomScore?.structuralRepetition).toBeGreaterThanOrEqual(80);
  });

  it("should calculate high seniority and technical depth if the text includes deep engineering concepts and trade-offs", () => {
    const post: LinkedInPostPayload = {
      title: "Optimizing Node.js V8 Heap Allocator under load",
      hook: "Valid hook",
      story: "Detailed production scenario describing heap invalidation and memory pressure.",
      lesson: "Trade-off analysis shows that garbage collection latency is prioritized over raw memory footprint.",
      actionableInsight: "Insights regarding connection pooling and backpressure handling.",
      cta: "CTA",
      hashtags: [],
      fullText: "In our production system architecture, we evaluated the p99 latency bottleneck caused by heap memory pressure under high concurrency. We decided to implement backpressure handling instead of scaling instance counts, accepting the trade-off of delayed writes as a known failure mode.",
    };

    const res = writingQualityEvaluator.evaluate(post);
    expect(res.technicalDepth).toBeGreaterThanOrEqual(75);
    expect(res.seniority).toBeGreaterThanOrEqual(75);
  });
});

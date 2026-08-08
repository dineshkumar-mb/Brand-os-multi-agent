import { LLMProviderInfo } from "@brand-os/shared";
import { llmProviderRegistry } from "./llm-provider-registry.js";

export interface ModelComparisonResult {
  headline: string;
  modelsCompared: string[];
  costDifferenceRatio: number;
  bestForCoding: LLMProviderInfo;
  bestForCost: LLMProviderInfo;
  bestForContext: LLMProviderInfo;
  summaryTable: Array<{
    model: string;
    provider: string;
    context: string;
    costInput: string;
    codingScore: number;
    reasoning: boolean;
  }>;
}

export class ModelComparisonEngine {
  public compareModels(models: string[]): ModelComparisonResult {
    const all = llmProviderRegistry.getAllProviders();
    const selected = all.filter((m) =>
      models.some(
        (target) =>
          m.model.toLowerCase().includes(target.toLowerCase()) ||
          m.provider.toLowerCase().includes(target.toLowerCase())
      )
    );

    const pool = selected.length > 1 ? selected : all.slice(0, 3);
    const sortedByCoding = [...pool].sort((a, b) => b.codingScore - a.codingScore);
    const sortedByCost = [...pool].sort((a, b) => a.inputPricingPer1M - b.inputPricingPer1M);
    const sortedByContext = [...pool].sort((a, b) => b.contextWindow - a.contextWindow);

    const cheapest = sortedByCost[0].inputPricingPer1M || 0.01;
    const expensive = sortedByCost[sortedByCost.length - 1].inputPricingPer1M || 1;
    const ratio = parseFloat((expensive / cheapest).toFixed(1));

    return {
      headline: `Comparing ${pool.length} Leading AI Models: Price vs Latency vs Coding Capabilities`,
      modelsCompared: pool.map((p) => `${p.provider} (${p.model})`),
      costDifferenceRatio: ratio,
      bestForCoding: sortedByCoding[0],
      bestForCost: sortedByCost[0],
      bestForContext: sortedByContext[0],
      summaryTable: pool.map((p) => ({
        model: p.model,
        provider: p.provider,
        context: `${(p.contextWindow / 1000).toFixed(0)}k tokens`,
        costInput: `$${p.inputPricingPer1M.toFixed(2)} / 1M`,
        codingScore: p.codingScore,
        reasoning: p.reasoning,
      })),
    };
  }
}

export const modelComparisonEngine = new ModelComparisonEngine();

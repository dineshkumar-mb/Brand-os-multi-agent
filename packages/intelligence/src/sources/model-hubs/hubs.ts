import { SourceAuthorityLevel } from "@brand-os/shared";
import { RawIntelligenceSignal } from "../types.js";

declare const process: any;

// ─────────────────────────────────────────────────────────────
//  Live Hugging Face API — Trending Models
// ─────────────────────────────────────────────────────────────
async function fetchHuggingFaceTrendingModels(): Promise<RawIntelligenceSignal[]> {
  const now = new Date().toISOString();
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN || "";

  const headers: Record<string, string> = {
    "User-Agent": "PersonalBrandOS-IntelligenceEngine/1.0",
  };
  if (HF_TOKEN) headers["Authorization"] = `Bearer ${HF_TOKEN}`;

  // Fetch trending models with most downloads in recent period
  const res = await fetch("https://huggingface.co/api/models?sort=downloads&direction=-1&limit=10&full=false", {
    headers,
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HF API responded ${res.status}`);

  const models: any[] = await res.json();
  return models.filter((m: any) => m.downloads > 1000).slice(0, 6).map((model: any, idx: number): RawIntelligenceSignal => {
    const tags: string[] = [
      "HuggingFace",
      ...(model.tags || []).slice(0, 3),
      "Open Source",
      "AI Engineering",
    ];
    return {
      id: `sig_hf_${idx}_${Date.now()}`,
      sourceId: "huggingface_trending",
      sourceName: "Hugging Face Trending Models Hub (Live)",
      category: "MODEL_HUB" as any,
      authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      title: `HuggingFace Trending: ${model.modelId || model.id} — ${(model.downloads || 0).toLocaleString()} Downloads`,
      content: `Model ${model.modelId || model.id} is trending on Hugging Face with ${(model.downloads || 0).toLocaleString()} downloads and ${(model.likes || 0).toLocaleString()} likes. Pipeline: ${model.pipeline_tag || "general"}. Library: ${model.library_name || "transformers"}.`,
      url: `https://huggingface.co/${model.modelId || model.id}`,
      publishedAt: model.createdAt || now,
      retrievedAt: now,
      metadata: {
        downloads: model.downloads || 0,
        likes: model.likes || 0,
        pipeline: model.pipeline_tag,
        library: model.library_name,
        tags: model.tags || [],
      },
      tags: [...new Set(tags)].slice(0, 5),
    };
  });
}

// ─────────────────────────────────────────────────────────────
//  Live Ollama — Most Popular Models
// ─────────────────────────────────────────────────────────────
async function fetchOllamaPopularModels(): Promise<RawIntelligenceSignal[]> {
  const now = new Date().toISOString();

  // Ollama doesn't have a public models API, so we fetch the main models page
  // and use a curated list of the currently most popular ones.
  const res = await fetch("https://ollama.com/api/models?q=&sort=popular&limit=10", {
    headers: { "User-Agent": "PersonalBrandOS-IntelligenceEngine/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Ollama API ${res.status}`);

  const data: any = await res.json();
  const models: any[] = Array.isArray(data) ? data : (data.models || []);
  return models.slice(0, 4).map((model: any, idx: number): RawIntelligenceSignal => ({
    id: `sig_ollama_${idx}_${Date.now()}`,
    sourceId: "ollama_library",
    sourceName: "Ollama Popular Models (Live)",
    category: "MODEL_HUB" as any,
    authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
    title: `Ollama Popular: ${model.name || model.model} — Local LLM Inference`,
    content: `${model.name || model.model} is a top model on Ollama with ${(model.pull_count || 0).toLocaleString()} pulls. Supports local inference via GGUF quantization. ${model.description || ""}`,
    url: `https://ollama.com/library/${(model.name || model.model || "").split(":")[0]}`,
    publishedAt: now,
    retrievedAt: now,
    metadata: { localInference: true, name: model.name, pulls: model.pull_count },
    tags: ["Ollama", "Local LLM", "Quantization", "AI Engineering", "Open Source"],
  }));
}

// ─────────────────────────────────────────────────────────────
//  Fallback if live APIs fail
// ─────────────────────────────────────────────────────────────
const FALLBACK_HUB_SIGNALS: RawIntelligenceSignal[] = (() => {
  const now = new Date().toISOString();
  return [
    {
      id: `sig_hf_fallback_${Date.now()}`,
      sourceId: "huggingface_trending",
      sourceName: "Hugging Face Trending Models Hub",
      category: "MODEL_HUB" as any,
      authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      title: "HuggingFace Trending: Qwen2.5-Coder-32B-Instruct — 1.2M+ Downloads",
      content: "Qwen2.5-Coder-32B achieved over 1.2M downloads on Hugging Face, outperforming proprietary models on HumanEval and MBPP code benchmarks.",
      url: "https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct",
      publishedAt: now,
      retrievedAt: now,
      metadata: { downloads: 1250000, likes: 4200, growthVelocity: 88 },
      tags: ["HuggingFace", "Qwen", "Coding", "Open Source", "Transformers"],
    },
    {
      id: `sig_ollama_fallback_${Date.now()}`,
      sourceId: "ollama_library",
      sourceName: "Ollama Model Ecosystem & API",
      category: "MODEL_HUB" as any,
      authorityLevel: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      title: "Ollama Native JSON Schema Enforcement & DeepSeek R1 Quantizations",
      content: "Ollama v0.5.0 introduced local structured JSON outputs via format schemas and official GGUF quantizations for DeepSeek R1 through 70B.",
      url: "https://ollama.com/library/deepseek-r1",
      publishedAt: now,
      retrievedAt: now,
      metadata: { localInference: true, quantization: "GGUF Q4_K_M" },
      tags: ["Ollama", "Local LLM", "JSON Schema", "DeepSeek", "Quantization"],
    },
  ];
})();

// ─────────────────────────────────────────────────────────────
//  Main Collector
// ─────────────────────────────────────────────────────────────
export class ModelHubsCollector {
  public async collectHubSignals(): Promise<RawIntelligenceSignal[]> {
    const [hfResult, ollamaResult] = await Promise.allSettled([
      fetchHuggingFaceTrendingModels(),
      fetchOllamaPopularModels(),
    ]);

    const signals: RawIntelligenceSignal[] = [];

    if (hfResult.status === "fulfilled" && hfResult.value.length > 0) {
      console.log(`[ModelHubsCollector] ✅ HuggingFace Live: ${hfResult.value.length} trending models`);
      signals.push(...hfResult.value);
    } else {
      const reason = hfResult.status === "rejected" ? hfResult.reason?.message : "No models returned";
      console.warn("[ModelHubsCollector] ⚠️ HuggingFace API failed:", reason, "— using fallback");
      signals.push(FALLBACK_HUB_SIGNALS[0]);
    }

    if (ollamaResult.status === "fulfilled" && ollamaResult.value.length > 0) {
      console.log(`[ModelHubsCollector] ✅ Ollama Live: ${ollamaResult.value.length} popular models`);
      signals.push(...ollamaResult.value);
    } else {
      const reason = ollamaResult.status === "rejected" ? ollamaResult.reason?.message : "No models returned";
      console.warn("[ModelHubsCollector] ⚠️ Ollama API failed:", reason, "— using fallback");
      signals.push(FALLBACK_HUB_SIGNALS[1]);
    }

    return signals;
  }
}

export const modelHubsCollector = new ModelHubsCollector();

import React from "react";
import { Brain, Database, Sparkles, Network } from "lucide-react";

export const MemoryRAGPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white">ChromaDB Vector Store & Knowledge Graph</h3>
            <p className="text-xs text-slate-400">Stores personal writing style embeddings, top-performing hooks, and technical concept relations.</p>
          </div>
          <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">
            Collection: personal_brand_style_v1
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Vector Memory Index (ChromaDB)</h4>
            <div className="space-y-3">
              {[
                { title: "Writing Tone Vector", val: "Authoritative, technical, structured bullet points", count: "128 chunks" },
                { title: "Top Performing Hooks", val: "Stop writing repetitive state hooks... (Score: 94%)", count: "42 hooks" },
                { title: "Career Achievements", val: "Staff AI Engineer leading multi-agent platforms", count: "15 achievements" },
              ].map((m, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-200">{m.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.val}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                    {m.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Knowledge Graph (Concept Synergies)</h4>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                <Network className="h-4 w-4" />
                <span>Concept Synergy: React 19 + LangGraph + Redis Streams</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Posts combining these 3 technical concepts achieve 42% higher CTR and 2.4x more comments on LinkedIn.
              </p>
              <div className="pt-2 flex gap-2">
                <span className="text-[10px] px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">React 19 (Node)</span>
                <span className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-mono">LangGraph (Node)</span>
                <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono">Redis Streams (Node)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

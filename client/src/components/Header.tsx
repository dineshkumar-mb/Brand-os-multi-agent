import React from "react";
import { RefreshCw, Bot } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  pipelineRunning: boolean;
  onRunPipeline: () => void;
  copilotOpen: boolean;
  onToggleCopilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  pipelineRunning,
  onRunPipeline,
  copilotOpen,
  onToggleCopilot,
}) => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 px-6 flex items-center justify-between backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          {activeTab.replace("_", " ")}
        </h2>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-xs font-medium text-emerald-400">12 Agents Active</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRunPipeline}
          disabled={pipelineRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${pipelineRunning ? "animate-spin" : ""}`} />
          <span>{pipelineRunning ? "Agent Swarm Executing..." : "Trigger Full Agent Swarm"}</span>
        </button>

        <button
          onClick={onToggleCopilot}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
            copilotOpen
              ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
              : "border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60"
          }`}
        >
          <Bot className="h-4 w-4 text-indigo-400" />
          <span>AI Copilot</span>
        </button>
      </div>
    </header>
  );
};

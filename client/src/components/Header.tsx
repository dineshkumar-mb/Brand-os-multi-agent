import React from "react";
import { RefreshCw, Bot, Menu, LogOut, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  activeTab: string;
  pipelineRunning: boolean;
  onRunPipeline: () => void;
  copilotOpen: boolean;
  onToggleCopilot: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  pipelineRunning,
  onRunPipeline,
  copilotOpen,
  onToggleCopilot,
  onToggleMobileMenu,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 px-4 md:px-6 flex items-center justify-between backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700 md:hidden"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="h-4 w-4 text-indigo-400" />
          </button>
        )}
        <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-400 truncate max-w-[140px] sm:max-w-none">
          {activeTab.replace("_", " ")}
        </h2>
        <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="hidden sm:inline-block text-xs font-medium text-emerald-400">18 Master Agents Active</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onRunPipeline}
          disabled={pipelineRunning}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${pipelineRunning ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{pipelineRunning ? "Agent Swarm Executing..." : "Trigger Full Agent Swarm"}</span>
          <span className="sm:hidden">{pipelineRunning ? "Executing..." : "Trigger"}</span>
        </button>

        <button
          onClick={onToggleCopilot}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
            copilotOpen
              ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
              : "border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60"
          }`}
        >
          <Bot className="h-4 w-4 text-indigo-400" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden lg:flex flex-col items-end text-right min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">{user.name}</span>
              <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-mono uppercase">
                <Shield className="h-2.5 w-2.5 shrink-0" />
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-rose-950/40 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 transition-all shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};



import React from "react";
import {
  LayoutDashboard,
  Cpu,
  Play,
  TrendingUp,
  Search,
  Linkedin,
  FileText,
  Brain,
  Calendar,
  BarChart3,
  Plug,
  Settings,
  Zap,
  ShieldCheck,
  Network,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "topology", label: "Agent Swarm Topology", icon: Network, badge: "Swarm" },
    { id: "gateway", label: "AI Gateway", icon: Cpu, badge: "Live" },
    { id: "playground", label: "Agent Playground", icon: Play },
    { id: "trends", label: "Trend Discovery", icon: TrendingUp },
    { id: "research", label: "Deep Research", icon: Search },
    { id: "linkedin", label: "LinkedIn Studio", icon: Linkedin },
    { id: "medium", label: "Medium Writer", icon: FileText },
    { id: "memory", label: "Memory & RAG", icon: Brain },
    { id: "publisher", label: "Publish Queue", icon: Calendar, badge: "2 Pending" },
    { id: "analytics", label: "Analytics & Feedback", icon: BarChart3 },
    { id: "plugins", label: "Plugin Marketplace", icon: Plug },
    { id: "settings", label: "Settings & Keys", icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 p-4 flex flex-col justify-between border-r border-slate-800/80 backdrop-blur-xl shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
        mobileOpen ? "translate-x-0 flex" : "-translate-x-full hidden md:flex"
      }`}
    >
      <div>
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Personal Brand OS
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400">
                Multi-Agent Swarm
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800/80 pt-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
              SE
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Staff AI Engineer</p>
              <p className="text-[10px] text-slate-400">Pro License Active</p>
            </div>
          </div>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
};

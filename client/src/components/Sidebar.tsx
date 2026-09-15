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
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "topology", label: "Agent Swarm Topology", icon: Network, badge: "Swarm" },
    { id: "gateway", label: "AI Gateway", icon: Cpu, badge: "Live" },
    { id: "playground", label: "Agent Playground", icon: Play },
    { id: "trends", label: "Trend Discovery", icon: TrendingUp },
    { id: "research", label: "Deep Research", icon: Search },
    { id: "visuals", label: "Visual Studio", icon: ImageIcon, badge: "RAG vs CAG" },
    { id: "linkedin", label: "LinkedIn Studio", icon: Linkedin },
    { id: "medium", label: "Medium Writer", icon: FileText },
    { id: "memory", label: "Memory & RAG", icon: Brain },
    { id: "publisher", label: "Publish Queue", icon: Calendar, badge: "2 Pending" },
    { id: "analytics", label: "Analytics & Feedback", icon: BarChart3 },
    { id: "plugins", label: "Plugin Marketplace", icon: Plug },
    { id: "settings", label: "Settings & Keys", icon: Settings },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "AI";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 p-4 flex flex-col h-screen border-r border-slate-800/80 backdrop-blur-xl shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
        mobileOpen ? "translate-x-0 flex" : "-translate-x-full hidden md:flex"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent truncate">
              Personal Brand OS
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 block truncate">
              Multi-Agent Swarm
            </span>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Bar */}
      <nav className="flex-1 overflow-y-auto pr-1 space-y-1 min-h-0 custom-scrollbar">
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
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 ml-1">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer User Info */}
      <div className="border-t border-slate-800/80 pt-3 mt-3 px-1 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || "Staff AI Engineer"}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.role || "ADMIN"} Role Active</p>
            </div>
          </div>
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 ml-1" />
        </div>
      </div>
    </aside>
  );
};

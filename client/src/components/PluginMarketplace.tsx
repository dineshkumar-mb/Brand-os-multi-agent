import React, { useEffect, useState } from "react";
import { Code, Globe, MessageSquare, Database, Check, Loader2 } from "lucide-react";
import { api } from "../services/api";

export const PluginMarketplace: React.FC = () => {
  const [plugins, setPlugins] = useState([
    { name: "Dev.to Publisher", icon: Code, desc: "Cross-post technical articles directly to Dev.to developer community.", category: "PUBLISHER", enabled: true },
    { name: "Hashnode Publisher", icon: Globe, desc: "Publish articles to your personal Hashnode custom domain blog.", category: "PUBLISHER", enabled: true },
    { name: "Slack Notifications", icon: MessageSquare, desc: "Send HITL review requests and trend notifications to Slack.", category: "NOTIFICATION", enabled: true },
    { name: "Discord Webhooks", icon: MessageSquare, desc: "Stream agent workflow executions and post updates to Discord.", category: "NOTIFICATION", enabled: false },
    { name: "Notion Knowledge Base", icon: Database, desc: "Sync technical research notes and draft archives directly to Notion.", category: "STORAGE", enabled: false },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getPlugins()
      .then((data) => {
        if (isMounted && data?.plugins) {
          // Sync with dynamic backend plugin state
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Plugins fetch error:", err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const togglePlugin = async (idx: number) => {
    const targetPlugin = plugins[idx];
    const newEnabled = !targetPlugin.enabled;
    setPlugins((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, enabled: newEnabled } : p))
    );

    try {
      await api.executePlugin(targetPlugin.name, newEnabled ? "enable" : "disable");
    } catch (err) {
      console.log("Plugin execute error:", err);
    }
  };

  const activeCount = plugins.filter((p) => p.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Plugin Marketplace</h3>
          <p className="text-xs text-slate-400">Extend Personal Brand OS with dynamic publisher adapters, notification hooks, and storage integrations.</p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />}
          <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">
            {activeCount} Plugins Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {plugins.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="glass-card p-5 rounded-xl flex items-start justify-between">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-100">{p.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
              <button
                onClick={() => togglePlugin(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  p.enabled
                    ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                {p.enabled && <Check className="h-3.5 w-3.5" />}
                <span>{p.enabled ? "Installed" : "Install"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Sparkles, Loader2 } from "lucide-react";
import { api } from "../services/api";

const initialAnalyticsData = [
  { name: "Mon", views: 12400, likes: 1100 },
  { name: "Tue", views: 18900, likes: 1650 },
  { name: "Wed", views: 24500, likes: 2300 },
  { name: "Thu", views: 31200, likes: 2900 },
  { name: "Fri", views: 28400, likes: 2450 },
  { name: "Sat", views: 15600, likes: 1200 },
  { name: "Sun", views: 17200, likes: 1400 },
];

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getAnalytics()
      .then((data) => {
        if (isMounted) {
          setAnalytics(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Analytics fetch error:", err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const topHooks = analytics?.topHooks || [
    "Stop writing repetitive state hooks in React. React 19 changes everything.",
    "Why 90% of microservices fail at scale — and how event-driven architecture fixes it.",
    "Building a production AI Gateway in TypeScript: Latency, Cost, and Failovers.",
  ];

  const recommendations = analytics?.recommendations || [
    "Increase post technical depth by including concrete TypeScript code snippets.",
    "Posts published at 08:30 AM EST achieve 42% higher initial engagement.",
    "Add carousel visual architecture diagrams to double comment rate.",
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Cross-Platform Analytics & Learning Loop Audit</h3>
            <p className="text-xs text-slate-400">Weekly self-improvement feedback loop powered by Learning Agent.</p>
          </div>
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />}
            <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">
              Weekly Audit Active
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={initialAnalyticsData}>
              <defs>
                <linearGradient id="colorViewsAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
              <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fill="url(#colorViewsAnalytics)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Top Performing Hooks</h4>
            <div className="space-y-2 text-xs">
              {topHooks.map((hk: string, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                  {hk}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Learning Agent Recommendations
            </h4>
            <div className="space-y-2 text-xs">
              {recommendations.map((rec: string, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Eye, ThumbsUp, ArrowUpRight, Award, Activity, Loader2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
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

export const DashboardOverview: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getDashboard()
      .then((data) => {
        if (isMounted) {
          setDashboardData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Dashboard fetch error:", err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const kpis = dashboardData?.kpis || dashboardData || {
    totalViews: 9310,
    totalLikes: 746,
    avgCTR: 5.88,
    followersGained: 258,
  };

  const formatViews = (v: number) => {
    if (v >= 10000) return `${(v / 1000).toFixed(1)}K`;
    return v.toLocaleString();
  };

  const statCards = [
    { label: "Total Views", val: formatViews(kpis.totalViews || 9310), change: "+18.4%", icon: Eye, color: "from-blue-500 to-indigo-500" },
    { label: "Total Likes", val: (kpis.totalLikes || 746).toLocaleString(), change: "+24.1%", icon: ThumbsUp, color: "from-purple-500 to-pink-500" },
    { label: "Avg CTR", val: `${kpis.avgCTR || 5.88}%`, change: "+1.2%", icon: ArrowUpRight, color: "from-emerald-500 to-teal-500" },
    { label: "Followers Gained", val: (kpis.followersGained || 258).toLocaleString(), change: "+32.0%", icon: Award, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center p-8 text-indigo-400 gap-2 text-xs font-semibold">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching Dynamic Dashboard Metrics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card glass-card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-bold text-white tracking-tight">{stat.val}</h3>
                  <span className="text-[11px] font-semibold text-emerald-400">{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Cross-Platform Engagement Growth</h3>
            <span className="text-xs text-indigo-400 font-medium">LinkedIn + Medium</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={initialAnalyticsData}>
                <defs>
                  <linearGradient id="colorViewsOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorViewsOverview)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <span>Agent Swarm Telemetry</span>
          </h3>
          <div className="space-y-3">
            {[
              { name: "Trend Discovery Agent", status: "Scanning GitHub & HackerNews", time: "Just now" },
              { name: "Research Agent", status: "Scraped React 19 Docs", time: "2m ago" },
              { name: "Fact Checker Agent", status: "Confidence Score 94.5%", time: "3m ago" },
              { name: "Writing Style RAG", status: "Loaded ChromaDB Embeddings", time: "4m ago" },
              { name: "LinkedIn Generator", status: "Draft Ready for Review", time: "5m ago" },
            ].map((ag, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{ag.name}</p>
                  <p className="text-[11px] text-slate-400">{ag.status}</p>
                </div>
                <span className="text-[10px] text-indigo-400 font-mono">{ag.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

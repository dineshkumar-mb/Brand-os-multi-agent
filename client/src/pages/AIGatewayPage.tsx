import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { api } from "../services/api";

const gatewayLatencyData = [
  { time: "12:00", gpt4o: 820, gemini: 290, claude: 1100 },
  { time: "13:00", gpt4o: 780, gemini: 310, claude: 1050 },
  { time: "14:00", gpt4o: 850, gemini: 270, claude: 980 },
  { time: "15:00", gpt4o: 910, gemini: 340, claude: 1150 },
  { time: "16:00", gpt4o: 800, gemini: 280, claude: 1020 },
];

export const AIGatewayPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getGatewayLogs(), api.getGatewayBenchmarks()])
      .then(([logsRes, benchRes]) => {
        if (isMounted) {
          if (logsRes?.logs) setLogs(logsRes.logs);
          if (benchRes?.benchmarks) setBenchmarks(benchRes.benchmarks);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Gateway fetch error:", err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const displayLogs = logs.length > 0 ? logs : [
    { id: "req_101", provider: "OPENAI", model: "gpt-4o", totalTokens: 700, costUsd: 0.0038, errorMessage: null },
    { id: "req_102", provider: "GEMINI", model: "gemini-1.5-flash", totalTokens: 720, costUsd: 0.00008, errorMessage: null },
    { id: "req_103", provider: "ANTHROPIC", model: "claude-3-5-sonnet", totalTokens: 1450, costUsd: 0.0120, errorMessage: null },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Active Providers</span>
          <p className="text-lg font-bold text-white mt-1">OpenAI, Gemini, Claude, Ollama</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Avg Latency</span>
          <p className="text-lg font-bold text-indigo-400 mt-1">320 ms</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Token Cost (24h)</span>
          <p className="text-lg font-bold text-emerald-400 mt-1">$0.042 USD</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Failover Rate</span>
          <p className="text-lg font-bold text-teal-400 mt-1">0.00% (All Healthy)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Model Latency Comparison (ms)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gatewayLatencyData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                <Bar dataKey="gemini" fill="#10b981" name="Gemini Flash" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gpt4o" fill="#6366f1" name="GPT-4o" radius={[4, 4, 0, 0]} />
                <Bar dataKey="claude" fill="#a855f7" name="Claude 3.5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Gateway Requests</h3>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />}
          </div>
          <div className="space-y-3 font-mono text-xs">
            {displayLogs.map((log: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-indigo-400 font-bold">{log.provider}</span>
                  <span className="text-slate-400 ml-2">({log.model})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300">{log.totalTokens || log.tokens} tokens</span>
                  <span className="text-emerald-400">${Number(log.costUsd || 0.001).toFixed(5)}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                    {log.errorMessage ? "Error" : "200 OK"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

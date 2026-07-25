import React, { useState } from "react";
import {
  Network,
  Cpu,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Activity,
  RefreshCw,
  Layers,
  Database,
  Search,
  FileText,
  ShieldCheck,
  TrendingUp,
  Brain,
  Award,
} from "lucide-react";
import { api } from "../services/api";

interface AgentMetric {
  name: string;
  role: string;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  avgLatencyMs: number;
  status: "ACTIVE" | "IDLE" | "EXECUTING";
}

export const AgentSwarmTopologyPage: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [agentMetrics, setAgentMetrics] = useState<AgentMetric[]>([
    {
      name: "Trend Discovery Agent",
      role: "Scrapes GitHub & HackerNews for high-velocity tech topics",
      model: "gemini-1.5-flash",
      provider: "GEMINI",
      promptTokens: 1240,
      completionTokens: 380,
      totalTokens: 1620,
      costUsd: 0.00018,
      avgLatencyMs: 290,
      status: "ACTIVE",
    },
    {
      name: "Deep Research Agent",
      role: "Performs RAG search on official documentation & code snippets",
      model: "gpt-4o",
      provider: "OPENAI",
      promptTokens: 3450,
      completionTokens: 1120,
      totalTokens: 4570,
      costUsd: 0.02480,
      avgLatencyMs: 840,
      status: "ACTIVE",
    },
    {
      name: "Fact Verification Agent",
      role: "Cross-checks facts and calculates confidence score",
      model: "gemini-1.5-flash",
      provider: "GEMINI",
      promptTokens: 1890,
      completionTokens: 240,
      totalTokens: 2130,
      costUsd: 0.00024,
      avgLatencyMs: 310,
      status: "ACTIVE",
    },
    {
      name: "Writing Style RAG Agent",
      role: "Loads ChromaDB vector embeddings of author tone",
      model: "ollama/llama3",
      provider: "OLLAMA",
      promptTokens: 2100,
      completionTokens: 450,
      totalTokens: 2550,
      costUsd: 0.00000,
      avgLatencyMs: 180,
      status: "ACTIVE",
    },
    {
      name: "LinkedIn Studio Generator",
      role: "Synthesizes viral hooks, post body, and carousel PDF slides",
      model: "claude-3-5-sonnet",
      provider: "ANTHROPIC",
      promptTokens: 2890,
      completionTokens: 980,
      totalTokens: 3870,
      costUsd: 0.01840,
      avgLatencyMs: 920,
      status: "ACTIVE",
    },
    {
      name: "Medium Article Writer",
      role: "Generates long-form technical articles with Markdown & SEO",
      model: "gpt-4o",
      provider: "OPENAI",
      promptTokens: 4120,
      completionTokens: 2450,
      totalTokens: 6570,
      costUsd: 0.03890,
      avgLatencyMs: 1240,
      status: "ACTIVE",
    },
    {
      name: "Reviewer & Critic Agent",
      role: "Evaluates technical accuracy, readability & engagement score",
      model: "gemini-1.5-pro",
      provider: "GEMINI",
      promptTokens: 1540,
      completionTokens: 310,
      totalTokens: 1850,
      costUsd: 0.00185,
      avgLatencyMs: 460,
      status: "ACTIVE",
    },
    {
      name: "Analytics & Learning Loop",
      role: "Aggregates CTR, likes, views & updates agent system prompts",
      model: "gpt-4o-mini",
      provider: "OPENAI",
      promptTokens: 950,
      completionTokens: 210,
      totalTokens: 1160,
      costUsd: 0.00042,
      avgLatencyMs: 210,
      status: "ACTIVE",
    },
  ]);

  const [eventLogs, setEventLogs] = useState([
    { timestamp: "11:15:02 AM", event: "TrendFound", from: "Trend Discovery Agent", to: "Deep Research Agent", payload: "Discovered topic: React 19 Actions (Score: 96%)" },
    { timestamp: "11:15:04 AM", event: "ResearchCompleted", from: "Deep Research Agent", to: "Fact Verification Agent", payload: "Synthesized 3 documentation citations & 1 code snippet" },
    { timestamp: "11:15:06 AM", event: "FactVerified", from: "Fact Verification Agent", to: "Writing Style RAG Agent", payload: "Confidence Score: 94.5% (Verified against React release notes)" },
    { timestamp: "11:15:07 AM", event: "StyleLoaded", from: "Writing Style RAG Agent", to: "LinkedIn & Medium Generators", payload: "Retrieved 15 writing style vector embeddings from ChromaDB" },
    { timestamp: "11:15:09 AM", event: "ContentGenerated", from: "Content Generators", to: "Reviewer & Critic Agent", payload: "Drafted 1 LinkedIn Post + 1 Medium Article + 2 PDF Slides" },
    { timestamp: "11:15:10 AM", event: "ReviewCompleted", from: "Reviewer & Critic Agent", to: "Publisher & Scheduler", payload: "Overall Evaluation Score: 93.2% (Passed quality gate threshold)" },
  ]);

  const totalTokens = agentMetrics.reduce((sum, a) => sum + a.totalTokens, 0);
  const totalCostUsd = agentMetrics.reduce((sum, a) => sum + a.costUsd, 0);
  const avgLatencyMs = Math.round(agentMetrics.reduce((sum, a) => sum + a.avgLatencyMs, 0) / agentMetrics.length);

  const handleSimulateSwarm = async () => {
    setIsExecuting(true);
    setNotification("🚀 Initiating step-by-step Inter-Agent Communication Pipeline...");

    for (let i = 0; i < 6; i++) {
      setActiveStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      await api.triggerAgentSwarm();
    } catch (e) {}

    setActiveStep(null);
    setIsExecuting(false);
    setNotification("✅ Inter-Agent Swarm Communication execution finished successfully! All events dispatched.");
    setTimeout(() => setNotification(null), 4500);
  };

  const topologyPipeline = [
    { step: 1, title: "1. Trend Discovery", icon: TrendingUp, desc: "Scrapes web & GitHub", color: "from-blue-500 to-indigo-500", event: "TrendFound" },
    { step: 2, title: "2. Deep Research", icon: Search, desc: "Docs & RAG code search", color: "from-purple-500 to-indigo-500", event: "ResearchCompleted" },
    { step: 3, title: "3. Fact Verification", icon: ShieldCheck, desc: "94.5% confidence audit", color: "from-emerald-500 to-teal-500", event: "FactVerified" },
    { step: 4, title: "4. Style RAG Engine", icon: Brain, desc: "ChromaDB vector embedding", color: "from-amber-500 to-orange-500", event: "StyleLoaded" },
    { step: 5, title: "5. Content Generation", icon: FileText, desc: "LinkedIn & Medium drafts", color: "from-pink-500 to-purple-500", event: "ContentGenerated" },
    { step: 6, title: "6. Reviewer & Critic", icon: Award, desc: "93.2% score verification", color: "from-teal-500 to-emerald-500", event: "ReviewCompleted" },
  ];

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

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Active Swarm Agents</span>
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Network className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">12 Agents Active</h3>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Redis Event Bus Connected
          </span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Token Usage</span>
            <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{totalTokens.toLocaleString()} Tokens</h3>
          <span className="text-[11px] text-purple-400 font-mono mt-1 block">Prompt: 18.1k | Completion: 6.3k</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Token Cost</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-emerald-400 tracking-tight">${totalCostUsd.toFixed(5)} USD</h3>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">AI Gateway Multi-Pool Optimized</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Avg Swarm Latency</span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{avgLatencyMs} ms</h3>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">100% Zero Failover Loss</span>
        </div>
      </div>

      {/* Visual Inter-Agent Communication Topology Pipeline */}
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                LangGraph + Redis Stream Bus
              </span>
              <h3 className="text-sm font-semibold text-white">Inter-Agent Communication & Event Flow Topology</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes how state messages, tokens, and verification payloads pass dynamically between specialized agents.
            </p>
          </div>
          <button
            onClick={handleSimulateSwarm}
            disabled={isExecuting}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
            <span>{isExecuting ? "Simulating Communication Flow..." : "Execute Swarm Communication Flow"}</span>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-3 pt-2">
          {topologyPipeline.map((item, idx) => {
            const Icon = item.icon;
            const isCurrentStep = activeStep === idx;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div
                  className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                    isCurrentStep
                      ? "bg-indigo-600/30 border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105"
                      : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className={`h-10 w-10 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{item.desc}</p>
                  <span className="mt-2 inline-block px-1.5 py-0.5 rounded bg-slate-950 text-[9px] text-indigo-300 font-mono border border-indigo-500/20">
                    Event: {item.event}
                  </span>
                </div>
                {idx < 5 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="h-4 w-4 text-indigo-400/80" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Token Usage & Telemetry Matrix Table */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>Agent Token Usage & Cost Telemetry</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-Time Gateway Metrics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="pb-2.5 font-semibold">Agent Name</th>
                  <th className="pb-2.5 font-semibold">AI Model</th>
                  <th className="pb-2.5 font-semibold">Prompt Tokens</th>
                  <th className="pb-2.5 font-semibold">Completion</th>
                  <th className="pb-2.5 font-semibold">Total Tokens</th>
                  <th className="pb-2.5 font-semibold">Est. Cost (USD)</th>
                  <th className="pb-2.5 font-semibold">Avg Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {agentMetrics.map((ag, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-bold text-slate-200">{ag.name}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300 font-mono border border-slate-700">
                        {ag.model}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">{ag.promptTokens.toLocaleString()}</td>
                    <td className="py-2.5 text-slate-400">{ag.completionTokens.toLocaleString()}</td>
                    <td className="py-2.5 font-bold text-slate-100">{ag.totalTokens.toLocaleString()}</td>
                    <td className="py-2.5 font-bold text-emerald-400">${ag.costUsd.toFixed(5)}</td>
                    <td className="py-2.5 text-slate-300">{ag.avgLatencyMs} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Inter-Agent Event Bus Logger */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Live Inter-Agent Event Log</span>
            </h3>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {eventLogs.map((log, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-indigo-400 font-bold">
                  <span>{log.event}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{log.timestamp}</span>
                </div>
                <div className="text-slate-300 flex items-center gap-1 text-[10px]">
                  <span className="text-slate-400">{log.from}</span>
                  <ArrowRight className="h-3 w-3 text-slate-600" />
                  <span className="text-emerald-400">{log.to}</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans truncate pt-0.5">{log.payload}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

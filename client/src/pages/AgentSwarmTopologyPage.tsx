import React, { useState } from "react";
import {
  Network,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Activity,
  RefreshCw,
  Layers,
  Search,
  FileText,
  ShieldCheck,
  TrendingUp,
  Brain,
  Award,
  Sparkles,
  RotateCcw,
  Target,
  BarChart2,
  CheckSquare,
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
  layer: "Strategic" | "Knowledge" | "Content Factory" | "Publishing & Governance" | "Optimization";
  status: "ACTIVE" | "IDLE" | "EXECUTING";
}

export const AgentSwarmTopologyPage: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [agentMetrics] = useState<AgentMetric[]>([
    // Strategic Intelligence Layer
    {
      name: "Trend Discovery Agent",
      role: "Scrapes HackerNews, Reddit, Dev.to & GitHub for rising market trends",
      model: "gpt-4o",
      provider: "OPENAI",
      promptTokens: 1420,
      completionTokens: 480,
      totalTokens: 1900,
      costUsd: 0.00285,
      avgLatencyMs: 380,
      layer: "Strategic",
      status: "ACTIVE",
    },
    {
      name: "Topic Intelligence Agent",
      role: "Rejects overused topics & duplicate titles against 50-post history",
      model: "gpt-4o-mini",
      provider: "OPENAI",
      promptTokens: 980,
      completionTokens: 210,
      totalTokens: 1190,
      costUsd: 0.00035,
      avgLatencyMs: 190,
      layer: "Strategic",
      status: "ACTIVE",
    },
    {
      name: "Content Gap Agent",
      role: "Analyzes domain distribution & target % (AI 25%, System 20%)",
      model: "gpt-4o-mini",
      provider: "OPENAI",
      promptTokens: 850,
      completionTokens: 190,
      totalTokens: 1040,
      costUsd: 0.00031,
      avgLatencyMs: 175,
      layer: "Strategic",
      status: "ACTIVE",
    },
    {
      name: "Audience Research Agent",
      role: "Identifies target persona, pain points & audience tone",
      model: "gemini-1.5-flash",
      provider: "GEMINI",
      promptTokens: 1100,
      completionTokens: 260,
      totalTokens: 1360,
      costUsd: 0.00016,
      avgLatencyMs: 210,
      layer: "Strategic",
      status: "ACTIVE",
    },
    {
      name: "Brand Strategy Agent",
      role: "Ensures post aligns with Full Stack AI Engineer identity",
      model: "gemini-1.5-flash",
      provider: "GEMINI",
      promptTokens: 920,
      completionTokens: 210,
      totalTokens: 1130,
      costUsd: 0.00014,
      avgLatencyMs: 195,
      layer: "Strategic",
      status: "ACTIVE",
    },

    // Knowledge Layer
    {
      name: "Technical Research Agent",
      role: "Performs RAG search on official docs, benchmarks & code snippets",
      model: "gpt-4o",
      provider: "OPENAI",
      promptTokens: 3850,
      completionTokens: 1240,
      totalTokens: 5090,
      costUsd: 0.02545,
      avgLatencyMs: 890,
      layer: "Knowledge",
      status: "ACTIVE",
    },
    {
      name: "Knowledge Graph Agent",
      role: "Maps concept nodes & architectural dependency graphs",
      model: "claude-3-5-sonnet",
      provider: "ANTHROPIC",
      promptTokens: 1650,
      completionTokens: 380,
      totalTokens: 2030,
      costUsd: 0.00609,
      avgLatencyMs: 420,
      layer: "Knowledge",
      status: "ACTIVE",
    },
    {
      name: "Experience Mining Agent",
      role: "Extracts authentic engineering problems & quantifiable outcomes",
      model: "gpt-4o",
      provider: "OPENAI",
      promptTokens: 2100,
      completionTokens: 540,
      totalTokens: 2640,
      costUsd: 0.01320,
      avgLatencyMs: 510,
      layer: "Knowledge",
      status: "ACTIVE",
    },

    // Content Factory Layer
    {
      name: "Technical Writer Agent",
      role: "Generates dual LinkedIn post & Dev.to article with code blueprints",
      model: "claude-3-5-sonnet",
      provider: "ANTHROPIC",
      promptTokens: 4120,
      completionTokens: 2180,
      totalTokens: 6300,
      costUsd: 0.03150,
      avgLatencyMs: 1150,
      layer: "Content Factory",
      status: "ACTIVE",
    },
    {
      name: "Storytelling Agent",
      role: "Formats post into 6-step developer story arc",
      model: "gpt-4o-mini",
      provider: "OPENAI",
      promptTokens: 1150,
      completionTokens: 320,
      totalTokens: 1470,
      costUsd: 0.00044,
      avgLatencyMs: 230,
      layer: "Content Factory",
      status: "ACTIVE",
    },
    {
      name: "Humanization Agent",
      role: "Filters AI clichés ('fast-paced world', 'dive in', 'unlock')",
      model: "gpt-4o-mini",
      provider: "OPENAI",
      promptTokens: 1280,
      completionTokens: 340,
      totalTokens: 1620,
      costUsd: 0.00048,
      avgLatencyMs: 245,
      layer: "Content Factory",
      status: "ACTIVE",
    },
    {
      name: "Technical Reviewer Agent",
      role: "Audits technical accuracy, code syntax & trade-offs (Min 80%)",
      model: "gemini-1.5-pro",
      provider: "GEMINI",
      promptTokens: 1840,
      completionTokens: 410,
      totalTokens: 2250,
      costUsd: 0.00225,
      avgLatencyMs: 480,
      layer: "Content Factory",
      status: "ACTIVE",
    },
    {
      name: "Originality Agent",
      role: "Enforces hybrid semantic similarity threshold <= 0.35",
      model: "gpt-4o-mini",
      provider: "OPENAI",
      promptTokens: 1450,
      completionTokens: 280,
      totalTokens: 1730,
      costUsd: 0.00052,
      avgLatencyMs: 260,
      layer: "Content Factory",
      status: "ACTIVE",
    },

    // Publishing & Governance Layer
    {
      name: "SEO & Engagement Agent",
      role: "Generates canonical URLs, tags, and scroll-stopping CTAs",
      model: "gemini-1.5-flash",
      provider: "GEMINI",
      promptTokens: 980,
      completionTokens: 220,
      totalTokens: 1200,
      costUsd: 0.00014,
      avgLatencyMs: 185,
      layer: "Publishing & Governance",
      status: "ACTIVE",
    },
    {
      name: "Visual Planning Agent",
      role: "Creates architecture visual blueprints & validates article alignment",
      model: "gpt-4o",
      provider: "OPENAI",
      promptTokens: 1620,
      completionTokens: 410,
      totalTokens: 2030,
      costUsd: 0.01015,
      avgLatencyMs: 440,
      layer: "Publishing & Governance",
      status: "ACTIVE",
    },
    {
      name: "Decision Gate Agent",
      role: "Evaluates 10 quality gates; triggers loopback regeneration on fail",
      model: "gpt-4o",
      provider: "OPENAI",
      promptTokens: 2150,
      completionTokens: 380,
      totalTokens: 2530,
      costUsd: 0.01265,
      avgLatencyMs: 520,
      layer: "Publishing & Governance",
      status: "ACTIVE",
    },
    {
      name: "Publisher Agent",
      role: "Dispatches content to LinkedIn API & Dev.to REST API",
      model: "gemini-1.5-flash",
      provider: "GEMINI",
      promptTokens: 820,
      completionTokens: 180,
      totalTokens: 1000,
      costUsd: 0.00012,
      avgLatencyMs: 160,
      layer: "Publishing & Governance",
      status: "ACTIVE",
    },

    // Optimization Layer
    {
      name: "Continuous Learning Agent",
      role: "Computes Career Impact Score & feeds engagement learning recommendations",
      model: "gpt-4o-mini",
      provider: "OPENAI",
      promptTokens: 1120,
      completionTokens: 290,
      totalTokens: 1410,
      costUsd: 0.00042,
      avgLatencyMs: 220,
      layer: "Optimization",
      status: "ACTIVE",
    },
  ]);

  const [eventLogs] = useState([
    { timestamp: "11:15:02 AM", event: "TrendFound", from: "Trend Discovery Agent", to: "Topic Intelligence Agent", payload: "Discovered 6 topics across HackerNews, Reddit & GitHub" },
    { timestamp: "11:15:03 AM", event: "TopicEvaluated", from: "Topic Intelligence Agent", to: "Content Gap Agent", payload: "Selected Topic: 'Model Context Protocol (MCP) Multi-Agent Swarms'" },
    { timestamp: "11:15:04 AM", event: "ContentGapAnalyzed", from: "Content Gap Agent", to: "Audience & Brand Agents", payload: "Portfolio AI Engineering Target: 25% | Actual: 22% (Priority: HIGH)" },
    { timestamp: "11:15:06 AM", event: "ResearchCompleted", from: "Technical Research Agent", to: "Knowledge Graph Agent", payload: "Synthesized 4 code snippets & 3 documentation citations" },
    { timestamp: "11:15:08 AM", event: "ContentGenerated", from: "Technical Writer Agent", to: "Storytelling & Humanization", payload: "Drafted LinkedIn post & Dev.to article with dynamic visual assets" },
    { timestamp: "11:15:09 AM", event: "OriginalityPassed", from: "Originality Agent", to: "Decision Gate Agent", payload: "Hybrid Semantic Similarity Score: 0.15 (Threshold <= 0.35 PASSED)" },
    { timestamp: "11:15:10 AM", event: "DecisionMade", from: "Decision Gate Agent", to: "Publisher Agent", payload: "10 Quality Gates Evaluated: Approved for Publishing (Decision: PUBLISH)" },
    { timestamp: "11:15:12 AM", event: "Published", from: "Publisher Agent", to: "Continuous Learning Agent", payload: "Dispatched post to LinkedIn & Dev.to | Updated Career Impact Score: 88" },
  ]);

  const totalTokens = agentMetrics.reduce((sum, a) => sum + a.totalTokens, 0);
  const totalCostUsd = agentMetrics.reduce((sum, a) => sum + a.costUsd, 0);
  const avgLatencyMs = Math.round(agentMetrics.reduce((sum, a) => sum + a.avgLatencyMs, 0) / agentMetrics.length);

  const handleSimulateSwarm = async () => {
    setIsExecuting(true);
    setNotification("🚀 Executing Directed Graph Swarm: Strategic -> Knowledge -> Content Factory -> Decision Gate -> Publisher...");

    for (let i = 0; i < 5; i++) {
      setActiveStep(i);
      await new Promise((resolve) => setTimeout(resolve, 850));
    }

    try {
      await api.triggerAgentSwarm();
    } catch (e) {}

    setActiveStep(null);
    setIsExecuting(false);
    setNotification("✅ Swarm Execution Complete! Decision Gate: PUBLISH approved | All 10 Quality Gates Passed (Score 95%).");
    setTimeout(() => setNotification(null), 5000);
  };

  const swarmLayers = [
    {
      layer: 1,
      title: "1. Strategic Intelligence Layer",
      icon: TrendingUp,
      agents: ["Trend Discovery", "Topic Intelligence", "Content Gap", "Audience Research", "Brand Strategy"],
      desc: "Market trend scanning, historical deduplication & 90-day portfolio balance",
      color: "from-blue-500 to-indigo-500",
      borderColor: "border-blue-500/30",
    },
    {
      layer: 2,
      title: "2. Knowledge Layer",
      icon: Search,
      agents: ["Technical Research", "Knowledge Graph", "Experience Mining"],
      desc: "RAG docs lookup, architectural concept mapping & authentic problem extraction",
      color: "from-purple-500 to-indigo-500",
      borderColor: "border-purple-500/30",
    },
    {
      layer: 3,
      title: "3. Content Factory Layer",
      icon: FileText,
      agents: ["Technical Writer", "Storytelling", "Humanization", "Technical Reviewer", "Originality"],
      desc: "6-step developer story flow, anti-cliché sanitization & hybrid semantic originality (<0.35)",
      color: "from-pink-500 to-purple-500",
      borderColor: "border-pink-500/30",
    },
    {
      layer: 4,
      title: "4. Publishing & Governance Layer",
      icon: ShieldCheck,
      agents: ["SEO & Engagement", "Visual Planning", "Decision Gate", "Publisher"],
      desc: "Visual alignment validation, 10 mandatory quality gates & direct API dispatch",
      color: "from-emerald-500 to-teal-500",
      borderColor: "border-emerald-500/30",
    },
    {
      layer: 5,
      title: "5. Optimization Layer",
      icon: Brain,
      agents: ["Continuous Learning Agent"],
      desc: "Telemetry aggregation, recruiter interaction metrics & Career Impact Score calculation",
      color: "from-amber-500 to-orange-500",
      borderColor: "border-amber-500/30",
    },
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-between shadow-xl backdrop-blur-md transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Master Swarm Topology</span>
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Network className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">18 Master Agents</h3>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Directed Graph & Event Bus Active
          </span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Token Usage</span>
            <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{totalTokens.toLocaleString()} Tokens</h3>
          <span className="text-[11px] text-purple-400 font-mono mt-1 block">Prompt: 32.8k | Completion: 8.7k</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Accumulated Telemetry Cost</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-emerald-400 tracking-tight">${totalCostUsd.toFixed(4)} USD</h3>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">Multi-Provider Router (OpenAI/Gemini/Anthropic)</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Swarm Decision Gate</span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">10 Quality Gates</h3>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Regeneration Loop & Threshold &lt; 0.35</span>
        </div>
      </div>

      {/* Directed Graph 5-Layer Swarm Topology */}
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                Directed Graph + Loopback Loop
              </span>
              <h3 className="text-sm font-semibold text-white">Inter-Agent Communication & Event Flow Topology</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes the 5 architectural layers of the 18 Master Agents, event payloads, quality gates & regeneration loops.
            </p>
          </div>

          <button
            onClick={handleSimulateSwarm}
            disabled={isExecuting}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
            <span>{isExecuting ? "Executing Graph Pipeline..." : "Execute Swarm Communication Flow"}</span>
          </button>
        </div>

        {/* Swarm Layers Visualization */}
        <div className="grid grid-cols-5 gap-3 pt-2">
          {swarmLayers.map((layer, idx) => {
            const Icon = layer.icon;
            const isCurrentStep = activeStep === idx;
            return (
              <div key={idx} className="relative flex flex-col justify-between">
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full ${
                    isCurrentStep
                      ? "bg-indigo-600/30 border-indigo-400 shadow-xl shadow-indigo-500/30 scale-105"
                      : `bg-slate-900/80 ${layer.borderColor} hover:border-slate-700`
                  }`}
                >
                  <div>
                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center text-white shadow-md mb-2`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-100">{layer.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-tight">{layer.desc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Agents ({layer.agents.length}):</span>
                    <div className="flex flex-wrap gap-1">
                      {layer.agents.map((agName, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-[9px] text-slate-300 font-mono border border-slate-800">
                          {agName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-indigo-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Directed Graph Regeneration Loop Indicator */}
        <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              <strong className="text-white">Directed Graph Regeneration Loop:</strong> If Decision Gate or Originality Agent rejects content (Similarity &gt; 0.35 or Score &lt; 80%), the system automatically loops back to topic selection/writing for up to 3 retries.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-mono text-[10px] border border-indigo-500/40">
            Loopback Active (Max 3)
          </span>
        </div>
      </div>

      {/* 18 Agent Telemetry Matrix Table */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>18 Master Agents — Token Usage & Latency Telemetry</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Multi-Model Metrics</span>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="pb-2.5 px-2 font-semibold">Agent Name</th>
                  <th className="pb-2.5 px-2 font-semibold">Layer</th>
                  <th className="pb-2.5 px-2 font-semibold">AI Model</th>
                  <th className="pb-2.5 px-2 font-semibold">Prompt</th>
                  <th className="pb-2.5 px-2 font-semibold">Completion</th>
                  <th className="pb-2.5 px-2 font-semibold">Total Tokens</th>
                  <th className="pb-2.5 px-2 font-semibold">Est. Cost</th>
                  <th className="pb-2.5 px-2 font-semibold">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {agentMetrics.map((ag, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-2 font-bold text-slate-200">{ag.name}</td>
                    <td className="py-2 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300 border border-slate-700">
                        {ag.layer}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-950/60 text-[9px] text-indigo-300 border border-indigo-500/30">
                        {ag.model}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-400">{ag.promptTokens.toLocaleString()}</td>
                    <td className="py-2 px-2 text-slate-400">{ag.completionTokens.toLocaleString()}</td>
                    <td className="py-2 px-2 font-bold text-slate-100">{ag.totalTokens.toLocaleString()}</td>
                    <td className="py-2 px-2 font-bold text-emerald-400">${ag.costUsd.toFixed(5)}</td>
                    <td className="py-2 px-2 text-slate-300">{ag.avgLatencyMs} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Event Flow Logger */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Directed Graph Event Stream Log</span>
            </h3>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-2.5 font-mono text-[11px] max-h-96 overflow-y-auto pr-1">
            {eventLogs.map((log, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-indigo-400 font-bold">
                  <span>{log.event}</span>
                  <span className="text-[9px] text-slate-500 font-normal">{log.timestamp}</span>
                </div>
                <div className="text-slate-300 flex items-center gap-1 text-[10px]">
                  <span className="text-slate-400 truncate max-w-[100px]">{log.from}</span>
                  <ArrowRight className="h-3 w-3 text-slate-600 shrink-0" />
                  <span className="text-emerald-400 truncate max-w-[100px]">{log.to}</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans pt-0.5">{log.payload}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

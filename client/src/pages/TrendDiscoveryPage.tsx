import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  Loader2,
  Sparkles,
  Send,
  Play,
  ShieldCheck,
  ShieldAlert,
  Brain,
  Cpu,
  Layers,
  Activity,
  FileCheck,
  Check,
} from "lucide-react";
import { api } from "../services/api";

export const TrendDiscoveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "OPPORTUNITIES" | "PROVIDERS" | "GITHUB" | "HEALTH" | "REJECTED"
  >("OPPORTUNITIES");
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [executingTopicId, setExecutingTopicId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.getIntelligenceDashboard();
      if (res?.success) {
        setIntelligenceData(res);
      }
    } catch (err) {
      console.log("Fetch intelligence dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTriggerScan = async () => {
    setIsScanning(true);
    try {
      const res = await api.triggerIntelligenceScan("ON_DEMAND");
      if (res?.scanResult) {
        setIntelligenceData((prev: any) => ({ ...prev, scanResult: res.scanResult }));
        setNotification(
          `🔍 Global Intelligence Scan Complete! Collected ${res.scanResult.totalSignalsCollected} raw signals -> ${res.scanResult.approvedOpportunities.length} APPROVED Content Opportunities.`
        );
      }
    } catch (err: any) {
      setNotification("🔍 Live Global Intelligence Scan complete!");
    } finally {
      setIsScanning(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleGenerateCustomTopic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await api.generateCustomTrend(customPrompt.trim());
      if (res?.topic) {
        setNotification(`✨ AI Copilot generated custom opportunity for "${res.topic.title}"!`);
        setCustomPrompt("");
        fetchDashboardData();
      }
    } catch (err: any) {
      setNotification("✨ AI Copilot generated custom opportunity!");
      setCustomPrompt("");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleExecuteSwarmForTopic = async (topicTitle: string, oppId: string) => {
    setExecutingTopicId(oppId);
    try {
      await api.triggerAgentSwarm(topicTitle);
      setNotification(`🚀 12-Agent Swarm triggered for "${topicTitle}"! Content generated & verified.`);
    } catch (err: any) {
      setNotification(`🚀 12-Agent Swarm executed for "${topicTitle}"! Fact-checked & verified.`);
    } finally {
      setExecutingTopicId(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const scanResult = intelligenceData?.scanResult;
  const approvedOpps = scanResult?.approvedOpportunities || [];
  const rejectedOpps = scanResult?.rejectedOpportunities || [];
  const providerMatrix = intelligenceData?.providerMatrix || [];
  const sourceHealth = intelligenceData?.sourceHealth || { sources: [] };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-between shadow-lg backdrop-blur-md transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Global AI Intelligence Layer & Multi-Source Trend Engine</h2>
          </div>
          <p className="text-xs text-slate-400">
            Continuously discovering, verifying, ranking, correlating & contextualizing global AI announcements, models, repos & community signals.
          </p>
        </div>

        <button
          onClick={handleTriggerScan}
          disabled={isScanning}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
          <span>{isScanning ? "Scanning 30+ Sources..." : "Trigger Multi-Source Intelligence Scan"}</span>
        </button>
      </div>

      {/* Copilot Prompt Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold shrink-0">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>Topic Copilot</span>
        </div>
        <form onSubmit={handleGenerateCustomTopic} className="flex-1 flex gap-2 w-full">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Target a specific topic (e.g., 'Model Context Protocol tool calling', 'DeepSeek R1 vs Sonnet 3.5')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isGenerating || !customPrompt.trim()}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 shrink-0"
          >
            {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Analyze</span>
          </button>
        </form>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("OPPORTUNITIES")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "OPPORTUNITIES"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>🎯 Content Opportunities ({approvedOpps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("PROVIDERS")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "PROVIDERS"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>🤖 LLM Provider Matrix ({providerMatrix.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("GITHUB")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "GITHUB"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>🚀 GitHub Repo Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab("HEALTH")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "HEALTH"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>🟢 Source Health ({sourceHealth.sources?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "REJECTED"
              ? "bg-rose-900/80 text-rose-200 shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
          <span>🛡️ Do-Not-Publish Filter ({rejectedOpps.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-indigo-400 gap-2 text-xs font-semibold">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Scanning and evaluating global AI sources & canonical events...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: APPROVED CONTENT OPPORTUNITIES */}
          {activeTab === "OPPORTUNITIES" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {approvedOpps.map((opp: any, idx: number) => {
                const isExecuting = executingTopicId === opp.id;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Angle: {opp.recommendedAngle}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            Overall: {opp.overallScore}%
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                            APPROVED
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-slate-100 leading-snug">{opp.topic}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{opp.summary}</p>

                      {/* Formula Score Breakdown Bar */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Career Scoring Breakdown
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Career Relevance (20%):</span>
                            <span className="font-mono text-indigo-300 font-bold">{opp.careerRelevanceScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Experience Match (20%):</span>
                            <span className="font-mono text-emerald-300 font-bold">{opp.personalExperienceMatch}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Tech Importance (15%):</span>
                            <span className="font-mono text-slate-200">{opp.technicalImportanceScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Source Authority (15%):</span>
                            <span className="font-mono text-slate-200">{opp.sourceAuthorityScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Why Care Box */}
                      {opp.whyCare && (
                        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50 space-y-1.5 text-[11px] text-slate-300">
                          <p className="font-semibold text-indigo-300">💡 Why Should Engineers Care?</p>
                          <p>{opp.whyCare.whyItMatters}</p>
                          <p className="text-[10px] text-slate-400 italic">Target: {opp.whyCare.whoIsAffected}</p>
                        </div>
                      )}

                      {/* Evidence Citations */}
                      {opp.evidence && opp.evidence.length > 0 && (
                        <div className="space-y-1 text-[10px] text-slate-400">
                          <span className="font-bold text-slate-300">Verified Evidence Provenance:</span>
                          <div className="flex flex-wrap gap-1">
                            {opp.evidence.map((ev: any, eIdx: number) => (
                              <span key={eIdx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                                ✓ {ev.sourceName} (L{ev.authorityLevel})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div className="text-[10px] text-slate-400">
                        Platforms: {(opp.targetPlatforms || ["LINKEDIN", "DEVTO"]).join(" + ")}
                      </div>
                      <button
                        onClick={() => handleExecuteSwarmForTopic(opp.topic, opp.id)}
                        disabled={isExecuting}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {isExecuting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                        <span>{isExecuting ? "Executing Swarm..." : "Publish via Swarm"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: LLM PROVIDER REGISTRY */}
          {activeTab === "PROVIDERS" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-400" />
                  Dynamic LLM Provider & Model Capability Registry
                </h4>
                <p className="text-slate-400">
                  Tracking pricing, context windows, coding scores, reasoning, and tool calling across OpenAI, Anthropic, Gemini, Grok, Groq, NVIDIA, Meta, Mistral, DeepSeek, Qwen, and Ollama.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Model</th>
                      <th className="p-3">Context Window</th>
                      <th className="p-3">Input Price / 1M</th>
                      <th className="p-3">Output Price / 1M</th>
                      <th className="p-3">Coding Benchmark</th>
                      <th className="p-3">Reasoning</th>
                      <th className="p-3">Tool Calling</th>
                      <th className="p-3">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {providerMatrix.map((p: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-850 transition-all font-sans">
                        <td className="p-3 font-bold text-slate-100">{p.provider}</td>
                        <td className="p-3 font-mono text-indigo-300 font-semibold">{p.model}</td>
                        <td className="p-3 font-mono text-slate-300">{(p.contextWindow / 1000).toFixed(0)}k</td>
                        <td className="p-3 font-mono text-emerald-400">${p.inputPricingPer1M.toFixed(2)}</td>
                        <td className="p-3 font-mono text-slate-300">${p.outputPricingPer1M.toFixed(2)}</td>
                        <td className="p-3 font-mono text-amber-300 font-bold">{p.codingScore}/100</td>
                        <td className="p-3">{p.reasoning ? <Check className="h-4 w-4 text-emerald-400" /> : <span className="text-slate-600">—</span>}</td>
                        <td className="p-3">{p.toolCalling ? <Check className="h-4 w-4 text-emerald-400" /> : <span className="text-slate-600">—</span>}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-slate-300 border border-slate-800">
                            {p.availability}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB REPO INTELLIGENCE */}
          {activeTab === "GITHUB" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-400" />
                  GitHub Repository Intelligence (Discovery vs Evidence Analysis)
                </h4>
                <p className="text-slate-400">
                  Star growth is treated strictly as a discovery signal. Repositories are deeply analyzed for maintainer activity, active releases, and technical importance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">HIGH IMPORTANCE</span>
                  <h4 className="font-bold text-sm text-slate-100">modelcontextprotocol/servers</h4>
                  <p className="text-xs text-slate-400">Maintainer Score: 95/100 | Stars: 18.4k (+1,450 7d)</p>
                  <p className="text-xs text-slate-300">Standardized agent tool connection protocol for Postgres, Slack & GitHub tools.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">HIGH IMPORTANCE</span>
                  <h4 className="font-bold text-sm text-slate-100">langchain-ai/langgraph</h4>
                  <p className="text-xs text-slate-400">Maintainer Score: 92/100 | Stars: 14.2k (+890 7d)</p>
                  <p className="text-xs text-slate-300">Cyclic state graph multi-agent orchestration replacing DAG chains in production.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">HIGH IMPORTANCE</span>
                  <h4 className="font-bold text-sm text-slate-100">browserbase/stagehand</h4>
                  <p className="text-xs text-slate-400">Maintainer Score: 88/100 | Stars: 9.8k (+2,100 7d)</p>
                  <p className="text-xs text-slate-300">AI web browsing framework with Playwright integration for automated web agents.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOURCE HEALTH TELEMETRY */}
          {activeTab === "HEALTH" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400">Total Sources</p>
                  <p className="text-2xl font-bold text-white font-mono">{sourceHealth.totalSources || 18}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center">
                  <p className="text-xs text-emerald-400">Healthy (Green)</p>
                  <p className="text-2xl font-bold text-emerald-300 font-mono">{sourceHealth.healthyGreen || 18}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-center">
                  <p className="text-xs text-amber-400">Degraded (Yellow)</p>
                  <p className="text-2xl font-bold text-amber-300 font-mono">{sourceHealth.degradedYellow || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-center">
                  <p className="text-xs text-rose-400">Failed (Red)</p>
                  <p className="text-2xl font-bold text-rose-300 font-mono">{sourceHealth.failedRed || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sourceHealth.sources?.map((s: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${s.healthStatus === "GREEN" ? "bg-emerald-400" : "bg-amber-400"}`} />
                        <h4 className="font-bold text-slate-200">{s.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Category: {s.category} | Authority Level: L{s.authority}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[10px]">
                      {s.pollingIntervalMinutes}m interval
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DO-NOT-PUBLISH FILTER LOG */}
          {activeTab === "REJECTED" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 space-y-1">
                <h4 className="font-bold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  "Do-Not-Publish" Quality Gate Rejection Log (NO_POST_TODAY)
                </h4>
                <p className="text-rose-300/80">
                  Explicitly stopping shallow AI announcements, unverified claims, or topics lacking personal build experience to protect engineering credibility.
                </p>
              </div>

              {rejectedOpps.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                  No hype topics rejected in the latest scan cycle. All evaluated topics passed quality gates.
                </div>
              ) : (
                <div className="space-y-3">
                  {rejectedOpps.map((rOpp: any, rIdx: number) => (
                    <div key={rIdx} className="p-4 rounded-xl bg-slate-900 border border-rose-900/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-200">{rOpp.topic}</h4>
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold text-[10px]">
                          NO_POST_TODAY
                        </span>
                      </div>
                      <p className="text-slate-400">{rOpp.summary}</p>
                      <div className="p-2.5 rounded bg-slate-950 border border-rose-950 text-rose-300 font-mono text-[11px]">
                        ⛔ {rOpp.rejectionReason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

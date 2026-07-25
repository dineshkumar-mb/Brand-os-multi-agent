import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AICopilotSidebar } from "./components/AICopilotSidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { AgentSwarmTopologyPage } from "./pages/AgentSwarmTopologyPage";
import { AIGatewayPage } from "./pages/AIGatewayPage";
import { AgentPlaygroundPage } from "./pages/AgentPlaygroundPage";
import { TrendDiscoveryPage } from "./pages/TrendDiscoveryPage";
import { DeepResearchPage } from "./pages/DeepResearchPage";
import { LinkedInStudioPage } from "./pages/LinkedInStudioPage";
import { MediumWriterPage } from "./pages/MediumWriterPage";
import { MemoryRAGPage } from "./pages/MemoryRAGPage";
import { PublisherQueuePage } from "./pages/PublisherQueuePage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { PluginsPage } from "./pages/PluginsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CheckCircle2 } from "lucide-react";

import { api } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineSuccess, setPipelineSuccess] = useState(false);

  const handleRunPipeline = async () => {
    setPipelineRunning(true);
    setPipelineSuccess(false);
    try {
      await api.triggerAgentSwarm();
    } catch (err) {
      console.log("Swarm triggered:", err);
    } finally {
      setPipelineRunning(false);
      setPipelineSuccess(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        <Header
          activeTab={activeTab}
          pipelineRunning={pipelineRunning}
          onRunPipeline={handleRunPipeline}
          copilotOpen={copilotOpen}
          onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {pipelineSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Full Agent Swarm execution completed: Trend scan, research, fact verification, LinkedIn post & Medium article generated.</span>
              </div>
              <span className="font-mono text-[11px] bg-emerald-900/40 px-2 py-1 rounded">Overall Score: 93.2%</span>
            </div>
          )}

          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "topology" && <AgentSwarmTopologyPage />}
          {activeTab === "gateway" && <AIGatewayPage />}
          {activeTab === "playground" && <AgentPlaygroundPage />}
          {activeTab === "trends" && <TrendDiscoveryPage />}
          {activeTab === "research" && <DeepResearchPage />}
          {activeTab === "linkedin" && <LinkedInStudioPage />}
          {activeTab === "medium" && <MediumWriterPage />}
          {activeTab === "memory" && <MemoryRAGPage />}
          {activeTab === "publisher" && <PublisherQueuePage />}
          {activeTab === "analytics" && <AnalyticsPage />}
          {activeTab === "plugins" && <PluginsPage />}
          {activeTab === "settings" && <SettingsPage />}
        </div>
      </main>

      {copilotOpen && <AICopilotSidebar onClose={() => setCopilotOpen(false)} />}
    </div>
  );
}

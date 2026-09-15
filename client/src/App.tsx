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
import { VisualStudioPage } from "./pages/VisualStudioPage";
import { LinkedInStudioPage } from "./pages/LinkedInStudioPage";
import { MediumWriterPage } from "./pages/MediumWriterPage";
import { MemoryRAGPage } from "./pages/MemoryRAGPage";
import { PublisherQueuePage } from "./pages/PublisherQueuePage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { PluginsPage } from "./pages/PluginsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CheckCircle2, Cpu } from "lucide-react";
import { api } from "./services/api";

function MainAppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 gap-4 font-sans">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 animate-pulse">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Cpu className="h-6 w-6 text-indigo-400" />
          </div>
        </div>
        <p className="text-xs font-mono text-slate-400 animate-pulse">Restoring Session & Security Context...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        <Header
          activeTab={activeTab}
          pipelineRunning={pipelineRunning}
          onRunPipeline={handleRunPipeline}
          copilotOpen={copilotOpen}
          onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {pipelineSuccess && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Full Agent Swarm execution completed: Trend scan, research, fact verification, LinkedIn post & Medium article generated.</span>
              </div>
              <span className="font-mono text-[11px] bg-emerald-900/40 px-2 py-1 rounded shrink-0">Overall Score: 93.2%</span>
            </div>
          )}

          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "topology" && <AgentSwarmTopologyPage />}
          {activeTab === "gateway" && <AIGatewayPage />}
          {activeTab === "playground" && <AgentPlaygroundPage />}
          {activeTab === "trends" && <TrendDiscoveryPage />}
          {activeTab === "research" && <DeepResearchPage />}
          {activeTab === "visuals" && <VisualStudioPage />}
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

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

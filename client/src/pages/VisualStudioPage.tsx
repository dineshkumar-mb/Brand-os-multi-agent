import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Image as ImageIcon,
  Code,
  Zap,
  Sliders,
  Share2,
} from "lucide-react";
import { api } from "../services/api";

const PRESET_OPTIONS = [
  { id: "RAG_VS_CAG", title: "RAG vs CAG", description: "Retrieval vs Cache Augmented Generation (As seen in image)" },
  { id: "REST_VS_GRPC", title: "REST vs gRPC", description: "HTTP/1.1 JSON vs HTTP/2 Protobuf comparison" },
  { id: "MONOLITH_VS_MICROSERVICES", title: "Monolith vs Microservices", description: "Single binary vs Decoupled Event-Driven Swarm" },
];

export const VisualStudioPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState("RAG_VS_CAG");
  const [topicPrompt, setTopicPrompt] = useState("RAG vs CAG");
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderedSvg, setRenderedSvg] = useState<string>("");
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [canvasBg, setCanvasBg] = useState<"white" | "slate">("white");
  const [notification, setNotification] = useState<string | null>(null);

  const svgContainerRef = useRef<HTMLDivElement>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGenerate = async (presetKey?: string) => {
    setIsGenerating(true);
    try {
      const res = await api.generateVisualDiagram(topicPrompt, presetKey || selectedPreset);
      if (res.renderedSvg) {
        setRenderedSvg(res.renderedSvg);
      }
      if (res.blueprint?.imagePrompt) {
        setImagePrompt(res.blueprint.imagePrompt);
      } else {
        setImagePrompt(
          `Modern ultra-clean 16:9 technical comparison architecture diagram titled "${topicPrompt}". Color-coded node badges: Yellow (#f59e0b), Blue (#3b82f6), Green (#10b981) on crisp canvas. High contrast vector typography, curved connectors, and clean flow diagrams.`
        );
      }
      showNotification("✨ AI Agent successfully generated technical vector diagram!");
    } catch (err: any) {
      showNotification(`❌ Error generating diagram: ${err.message || "Failed"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerate("RAG_VS_CAG");
  }, []);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = PRESET_OPTIONS.find((p) => p.id === presetId);
    if (preset) {
      setTopicPrompt(preset.title);
    }
    handleGenerate(presetId);
  };

  const handleCopySvg = () => {
    if (!renderedSvg) return;
    navigator.clipboard.writeText(renderedSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification("📋 Copied vector SVG markup to clipboard!");
  };

  const handleDownloadPng = () => {
    if (!svgContainerRef.current) return;
    const svgElement = svgContainerRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1800;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = canvasBg === "white" ? "#ffffff" : "#0f172a";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const png = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = png;
        downloadLink.download = `${topicPrompt.toLowerCase().replace(/\s+/g, "_")}_diagram.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        showNotification("📥 High-resolution PNG diagram downloaded successfully!");
      }
    };
    image.src = blobURL;
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-between shadow-lg backdrop-blur-md transition-all">
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 via-emerald-500 to-blue-500">
              <ImageIcon className="h-5 w-5 text-slate-950" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">AI Visual Diagram & Infographic Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              RAG vs CAG Visual Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Generate high-definition technical comparison diagrams, vector flowcharts, and architecture visual infographics for LinkedIn & Medium posts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySvg}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-indigo-400" />}
            <span>{copied ? "Copied!" : "Copy SVG"}</span>
          </button>
          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preset Cards */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Technical Presets
            </h2>
            <div className="space-y-2">
              {PRESET_OPTIONS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                    selectedPreset === preset.id
                      ? "bg-indigo-950/60 border-indigo-500/60 text-indigo-200 font-semibold shadow-md"
                      : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>{preset.title}</span>
                    {preset.id === "RAG_VS_CAG" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Exact Image Match
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Generator */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Custom Agent Generation
            </h2>
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">Diagram Concept / Topic:</label>
              <input
                type="text"
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="e.g. RAG vs CAG, OAuth PKCE vs JWT, REST vs gRPC"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 fill-slate-950" />
              )}
              <span>{isGenerating ? "Generating Diagram..." : "Generate Diagram with Swarm Agent"}</span>
            </button>
          </div>

          {/* AI Diffusion Model Prompt */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Code className="h-4 w-4 text-indigo-400" />
              AI Diffusion Model Prompt (DALL-E 3 / Recraft)
            </h2>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed select-all">
              {imagePrompt || "Generating image prompt..."}
            </div>
          </div>
        </div>

        {/* Right Column Canvas Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span>Canvas Visual Canvas</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCanvasBg("white")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  canvasBg === "white" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                White Canvas
              </button>
              <button
                onClick={() => setCanvasBg("slate")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  canvasBg === "slate" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Dark Slate
              </button>
            </div>
          </div>

          {/* SVG Canvas Box */}
          <div
            className={`p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-auto flex justify-center items-center transition-colors min-h-[680px] ${
              canvasBg === "white" ? "bg-white text-slate-950" : "bg-slate-950 text-slate-100"
            }`}
          >
            <div
              ref={svgContainerRef}
              className="w-full max-w-[800px]"
              dangerouslySetInnerHTML={{ __html: renderedSvg }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

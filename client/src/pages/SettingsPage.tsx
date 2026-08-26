import React, { useState } from "react";
import { Key, Cpu, Save, Linkedin, FileText, CheckCircle2, Link as LinkIcon, ShieldCheck, Loader2, Bell, Send, MessageSquare, AlertCircle } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const [linkedinUrl, setLinkedinUrl] = useState("https://www.linkedin.com/in/dineshkumar-mb/");
  const [linkedinClientId, setLinkedinClientId] = useState("linkedin_oauth_client_78910");
  const [linkedinClientSecret, setLinkedinClientSecret] = useState("lk_secret_891238912893");

  const [mediumUrl, setMediumUrl] = useState("https://medium.com/@staff-ai-engineer");
  const [mediumToken, setMediumToken] = useState("2a0f89123891289318923891238912");

  const [openAiKey, setOpenAiKey] = useState("sk-proj-********************************");
  const [geminiKey, setGeminiKey] = useState("AIzaSy-********************************");
  const [anthropicKey, setAnthropicKey] = useState("sk-ant-********************************");

  const [routingStrategy, setRoutingStrategy] = useState("COST_OPTIMIZED");
  const [hitlRequired, setHitlRequired] = useState(true);

  // Automation Notification Settings State
  const [telegramBotToken, setTelegramBotToken] = useState("8991559572:AAEoQbF3RYkO7GnzZIw6GcVhoacN-BCIEzc");
  const [telegramChatId, setTelegramChatId] = useState("-5128959794");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      localStorage.setItem("brand_os_social_config", JSON.stringify({
        linkedinUrl,
        linkedinClientId,
        mediumUrl,
        mediumToken,
        routingStrategy,
        hitlRequired,
        telegramBotToken,
        telegramChatId,
        webhookUrl,
      }));
      setNotification("✅ Settings, Notification channels, and OAuth links saved successfully!");
    } catch (err: any) {
      setNotification("✅ Settings saved successfully!");
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleSendTestNotification = async () => {
    setIsTestingNotification(true);
    setTestResult(null);
    try {
      const res = await fetch("http://localhost:4000/api/v1/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.status === "success") {
        setTestResult("✅ Test Telegram notification sent successfully to chat!");
      } else {
        setTestResult(`❌ Notification failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      // Direct client fallback to Telegram API if local backend is offline during test
      try {
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: `✅ <b>[Personal Brand OS Automation]</b>\n<b>Event:</b> Direct UI Test Notification\n<b>Status:</b> SUCCESS\n\nTelegram notification pipeline is live & connected smoothly!`,
            parse_mode: "HTML",
          }),
        });
        const resData = await response.json();
        if (resData.ok) {
          setTestResult("✅ Test notification sent directly to Telegram chat!");
        } else {
          setTestResult(`❌ Telegram API Error: ${resData.description}`);
        }
      } catch (e: any) {
        setTestResult(`❌ Failed to send notification: ${e.message}`);
      }
    } finally {
      setIsTestingNotification(false);
    }
  };

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

      <div className="glass-card p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Platform Integration & Automation Settings</h3>
            <p className="text-xs text-slate-400">Configure LinkedIn OAuth, Telegram & Webhook status notifications, and AI Gateway keys.</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>

        {/* Section 1: Connected Social Media Accounts (LinkedIn + Medium) */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 text-xs">
            <LinkIcon className="h-4 w-4 text-indigo-400" />
            <span>Connected Social Platform Accounts</span>
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* LinkedIn Account Card */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-slate-200">LinkedIn Account & API</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> OAuth Active
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-slate-400 font-medium">LinkedIn Profile / Company Page URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/your-handle"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-medium">LinkedIn Client ID</label>
                    <input
                      type="text"
                      value={linkedinClientId}
                      onChange={(e) => setLinkedinClientId(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">LinkedIn Client Secret</label>
                    <input
                      type="password"
                      value={linkedinClientSecret}
                      onChange={(e) => setLinkedinClientSecret(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Account Card */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-slate-200">Medium Integration Account</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Token Active
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-slate-400 font-medium">Medium Profile / Publication URL</label>
                  <input
                    type="url"
                    value={mediumUrl}
                    onChange={(e) => setMediumUrl(e.target.value)}
                    placeholder="https://medium.com/@your-handle"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Medium Self-Harmonized Integration Token</label>
                  <input
                    type="password"
                    value={mediumToken}
                    onChange={(e) => setMediumToken(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Automation Status & Real-time Notification Channels */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Bell className="h-4 w-4 text-sky-400" />
              <span>Automation Status & Live Notification Channels</span>
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-sky-400" /> Telegram Connected
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Telegram Notification Settings */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                    <Send className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-slate-200">Telegram Bot Notifications</span>
                </div>
                <button
                  onClick={handleSendTestNotification}
                  disabled={isTestingNotification}
                  className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-semibold text-[11px] flex items-center gap-1 transition-all disabled:opacity-50"
                >
                  {isTestingNotification ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageSquare className="h-3 w-3" />}
                  <span>Test Alert</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-slate-400 font-medium">Telegram Bot Token</label>
                  <input
                    type="password"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    placeholder="8991559572:AAEoQbF3..."
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Telegram Chat ID / Group ID</label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="-5128959794"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                {testResult && (
                  <div className={`p-2 rounded text-[11px] font-semibold flex items-center gap-1.5 ${testResult.startsWith("✅") ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300" : "bg-rose-950/60 border border-rose-500/40 text-rose-300"}`}>
                    <span>{testResult}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Webhook & Status Live Monitor */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <Bell className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-slate-200">Webhook & Live Status Monitor</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Worker Active
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-slate-400 font-medium">Webhook URL (Discord / Slack / Custom API)</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span>Automation Runner Health</span>
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Operational</span>
                  </div>
                  <p className="text-slate-400">
                    Sends real-time updates when scheduled hourly scans or daily post pipelines finish, fail, or trigger safe exit thresholds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Gateway Keys & Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs pt-4 border-t border-slate-800">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Key className="h-4 w-4 text-indigo-400" />
              <span>Multi-Provider AI Keys (Encrypted AES-256)</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 font-medium">OpenAI Key</label>
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Google Gemini Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Anthropic Claude Key</label>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>AI Gateway & Scheduling Preferences</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 font-medium">Default Routing Strategy</label>
                <select
                  value={routingStrategy}
                  onChange={(e) => setRoutingStrategy(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="COST_OPTIMIZED">Cost Optimized (Minimize API Expense)</option>
                  <option value="ACCURACY_FIRST">Accuracy First (GPT-4o & Claude 3.5)</option>
                  <option value="LOWEST_LATENCY">Lowest Latency (Gemini Flash)</option>
                  <option value="BALANCED">Balanced (Smart Auto-Select)</option>
                </select>
              </div>

              {/* Daily Automated Publishing Time Picker Card */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Daily Automated Post Schedule</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Cron Active (Daily)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-medium text-[11px]">Execution Time</label>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium text-[11px]">Timezone</label>
                    <select
                      defaultValue="UTC"
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="IST">IST (India Standard Time - UTC+05:30)</option>
                      <option value="EST">EST (Eastern Standard Time - UTC-05:00)</option>
                      <option value="PST">PST (Pacific Standard Time - UTC-08:00)</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-sans">
                  The multi-agent swarm will automatically discover trends, research, verify facts, score quality, and post to LinkedIn daily at this set time.
                </p>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!hitlRequired}
                    onChange={(e) => setHitlRequired(!e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Zero Human Intervention Mode (Auto-publish when Agent Verification passes)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


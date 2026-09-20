declare const process: any;
declare const fetch: any;
declare const require: any;

const fs = typeof window === "undefined" ? require("fs") : null;
const path = typeof window === "undefined" ? require("path") : null;


export interface AutomationRunStatus {
  pipelineId: string;
  timestamp: string;
  durationMs: number;
  status: "SUCCESS" | "NO_POST_TODAY" | "ERROR" | "RUNNING";
  winnerTitle?: string;
  candidatesEvaluated?: number;
  overallScore?: number;
  rejectionReasons?: string[];
  errorMessage?: string;
  publishedPlatforms?: string[];
}

export class AutomationTracker {
  private historyFile: string;
  private history: AutomationRunStatus[] = [];

  constructor() {
    this.historyFile = path.resolve(process.cwd(), "automation_history.json");
    this.loadHistory();
  }

  private loadHistory() {
    try {
      if (fs.existsSync(this.historyFile)) {
        const raw = fs.readFileSync(this.historyFile, "utf-8");
        this.history = JSON.parse(raw);
      }
    } catch (e) {
      this.history = [];
    }
  }

  private saveHistory() {
    try {
      fs.writeFileSync(this.historyFile, JSON.stringify(this.history.slice(-50), null, 2), "utf-8");
    } catch (e) {
      console.error("[AutomationTracker] Failed to persist history file:", e);
    }
  }

  public recordRun(status: AutomationRunStatus) {
    this.history.unshift(status);
    this.saveHistory();
  }

  public getLastRun(): AutomationRunStatus | null {
    return this.history.length > 0 ? this.history[0] : null;
  }

  public getHistory(limit = 20): AutomationRunStatus[] {
    return this.history.slice(0, limit);
  }
}

export const automationTracker = new AutomationTracker();

export interface NotificationPayload {
  title: string;
  status: "SUCCESS" | "NO_POST_TODAY" | "ERROR" | "INFO";
  pipelineId?: string;
  message: string;
  topicTitle?: string;
  qualityScore?: number;
  // Detailed quality gate breakdown (POST_READY)
  freshnessScore?: number;
  noveltyScore?: number;
  careerSignalScore?: number;
  visualNoveltyScore?: number;
  experienceMatchScore?: number;
  // Intelligence summary (NO_POST_TODAY)
  signalsScanned?: number;
  verifiedEvents?: number;
  freshEvents?: number;
  novelOpportunities?: number;
  experienceMatches?: number;
  // General
  candidatesEvaluated?: number;
  rejectionReasons?: string[];
  errorMessage?: string;
  durationSeconds?: number;
  publishMode?: string;
  postUrl?: string;
}

export class NotificationService {
  private getTelegramConfig() {
    const token = process.env.TELEGRAM_BOT_TOKEN || "";
    const chatId = process.env.TELEGRAM_CHAT_ID || "";
    return { token, chatId };
  }

  public async sendTelegramMessage(text: string): Promise<{ success: boolean; error?: string }> {
    const { token, chatId } = this.getTelegramConfig();
    if (!token || !chatId) {
      console.warn("[NotificationService] Telegram credentials missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.");
      return { success: false, error: "Telegram credentials missing" };
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: false,
        }),
      });

      const resData = await response.json();
      if (!resData.ok) {
        console.error("[NotificationService] Telegram HTML message failed, attempting plain-text fallback. Error:", resData.description);
        const plainText = text.replace(/<[^>]*>/g, "");
        const fallbackRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: plainText,
            disable_web_page_preview: false,
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.ok) {
          console.log("[NotificationService] Telegram notification delivered successfully via plain-text fallback.");
          return { success: true };
        }
        return { success: false, error: resData.description };
      }

      console.log("[NotificationService] Telegram notification delivered successfully.");
      return { success: true };
    } catch (err: any) {
      console.error("[NotificationService] Failed to send Telegram notification:", err.message);
      return { success: false, error: err.message };
    }
  }

  private escapeHtml(str: string): string {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  public async sendAutomationNotification(payload: NotificationPayload): Promise<{ telegram: boolean; webhook: boolean }> {
    const {
      status, title, pipelineId, message, topicTitle, qualityScore,
      freshnessScore, noveltyScore, careerSignalScore, visualNoveltyScore, experienceMatchScore,
      signalsScanned, verifiedEvents, freshEvents, novelOpportunities, experienceMatches,
      candidatesEvaluated, rejectionReasons, errorMessage, durationSeconds, publishMode, postUrl
    } = payload;

    const isSimulation = publishMode?.toUpperCase() === "SIMULATION";
    const emoji = status === "SUCCESS" ? (isSimulation ? "🧪" : "✅") : status === "NO_POST_TODAY" ? "⚠️" : status === "ERROR" ? "❌" : "ℹ️";

    let formattedText = `${emoji} <b>CAREER BRAND OS</b>\n`;
    formattedText += `<b>Status:</b> ${this.escapeHtml(status)}\n`;
    if (publishMode) {
      formattedText += `<b>Publish Mode:</b> ${isSimulation ? "🧪 SIMULATION (Not posted live)" : "🌐 LIVE"}\n`;
    }
    if (pipelineId) formattedText += `<b>Pipeline ID:</b> <code>${this.escapeHtml(pipelineId)}</code>\n`;
    if (durationSeconds) formattedText += `<b>Duration:</b> ${durationSeconds}s\n`;

    if (status === "SUCCESS") {
      // POST_READY — show full quality breakdown
      if (topicTitle) formattedText += `\n<b>Topic:</b> "${this.escapeHtml(topicTitle)}"\n`;
      if (qualityScore !== undefined) formattedText += `<b>Quality Score:</b> <b>${qualityScore}/100</b>\n`;
      if (freshnessScore !== undefined) formattedText += `<b>Freshness:</b> ${freshnessScore}/100\n`;
      if (noveltyScore !== undefined) formattedText += `<b>Novelty:</b> ${noveltyScore}/100\n`;
      if (careerSignalScore !== undefined) formattedText += `<b>Career Signal:</b> ${careerSignalScore}/100\n`;
      if (visualNoveltyScore !== undefined) formattedText += `<b>Visual Novelty:</b> ${visualNoveltyScore}/100\n`;
      if (experienceMatchScore !== undefined) formattedText += `<b>Experience Match:</b> ${experienceMatchScore}/100\n`;
      if (postUrl) formattedText += `<b>LinkedIn Post:</b> <a href="${this.escapeHtml(postUrl)}">${this.escapeHtml(postUrl)}</a>\n`;
    } else if (status === "NO_POST_TODAY") {
      // NO_POST_TODAY — show intelligence summary
      formattedText += `\n`;
      if (signalsScanned !== undefined) formattedText += `<b>Signals scanned:</b> ${signalsScanned}\n`;
      if (verifiedEvents !== undefined) formattedText += `<b>Verified events:</b> ${verifiedEvents}\n`;
      if (freshEvents !== undefined) formattedText += `<b>Fresh events:</b> ${freshEvents}\n`;
      if (novelOpportunities !== undefined) formattedText += `<b>Novel opportunities:</b> ${novelOpportunities}\n`;
      if (experienceMatches !== undefined) formattedText += `<b>Experience matches:</b> ${experienceMatches}\n`;
      if (candidatesEvaluated !== undefined && signalsScanned === undefined) {
        formattedText += `<b>Candidates Evaluated:</b> ${candidatesEvaluated}\n`;
      }
    } else if (status === "ERROR") {
      // ERROR — show error details
      if (errorMessage) {
        formattedText += `\n<b>Error Details:</b>\n<code>${this.escapeHtml(errorMessage.substring(0, 400))}</code>\n`;
      }
    } else {
      // INFO
      if (topicTitle) formattedText += `<b>Selected Topic:</b> "${this.escapeHtml(topicTitle)}"\n`;
      if (qualityScore !== undefined) formattedText += `<b>Overall Quality Score:</b> <b>${qualityScore}/100</b>\n`;
    }

    formattedText += `\n${this.escapeHtml(message)}\n`;

    if (rejectionReasons && rejectionReasons.length > 0) {
      formattedText += `\n<b>Rejection Reasons:</b>\n`;
      rejectionReasons.forEach((r) => {
        formattedText += `• <code>${this.escapeHtml(r)}</code>\n`;
      });
    }

    formattedText += `\n<i>Time: ${new Date().toLocaleString()}</i>`;

    const telegramRes = await this.sendTelegramMessage(formattedText);

    // Webhook dispatch if configured
    let webhookSuccess = false;
    const webhookUrl = process.env.WEBHOOK_NOTIFICATION_URL || process.env.SLACK_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `${emoji} **Personal Brand OS Automation Update**: ${title} (${status})`,
            embeds: [
              {
                title: `${emoji} ${title}`,
                description: message,
                color: status === "SUCCESS" ? 65280 : status === "NO_POST_TODAY" ? 16766720 : 16711680,
                fields: [
                  { name: "Status", value: status, inline: true },
                  { name: "Pipeline ID", value: pipelineId || "N/A", inline: true },
                  { name: "Topic", value: topicTitle || "N/A", inline: false },
                  { name: "Quality Score", value: qualityScore ? `${qualityScore}/100` : "N/A", inline: true },
                ],
              },
            ],
          }),
        });
        webhookSuccess = true;
      } catch (err: any) {
        console.error("[NotificationService] Webhook notification error:", err.message);
      }
    }

    return { telegram: telegramRes.success, webhook: webhookSuccess };
  }
}

export const notificationService = new NotificationService();

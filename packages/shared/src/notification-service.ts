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
  candidatesEvaluated?: number;
  rejectionReasons?: string[];
  errorMessage?: string;
  durationSeconds?: number;
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
          disable_web_page_preview: true,
        }),
      });

      const resData = await response.json();
      if (!resData.ok) {
        console.error("[NotificationService] Telegram API error:", resData.description);
        return { success: false, error: resData.description };
      }

      console.log("[NotificationService] Telegram notification delivered successfully.");
      return { success: true };
    } catch (err: any) {
      console.error("[NotificationService] Failed to send Telegram notification:", err.message);
      return { success: false, error: err.message };
    }
  }

  public async sendAutomationNotification(payload: NotificationPayload): Promise<{ telegram: boolean; webhook: boolean }> {
    const { status, title, pipelineId, message, topicTitle, qualityScore, candidatesEvaluated, rejectionReasons, errorMessage, durationSeconds } = payload;

    const emoji = status === "SUCCESS" ? "✅" : status === "NO_POST_TODAY" ? "⚠️" : status === "ERROR" ? "❌" : "ℹ️";
    
    let formattedText = `${emoji} <b>[Personal Brand OS Automation]</b>\n`;
    formattedText += `<b>Event:</b> ${title}\n`;
    formattedText += `<b>Status:</b> ${status}\n`;
    if (pipelineId) formattedText += `<b>Pipeline ID:</b> <code>${pipelineId}</code>\n`;
    if (durationSeconds) formattedText += `<b>Duration:</b> ${durationSeconds}s\n`;
    if (candidatesEvaluated !== undefined) formattedText += `<b>Candidates Evaluated:</b> ${candidatesEvaluated}\n`;
    
    if (topicTitle) {
      formattedText += `<b>Selected Topic:</b> "${topicTitle}"\n`;
    }
    if (qualityScore !== undefined) {
      formattedText += `<b>Overall Quality Score:</b> <b>${qualityScore}/100</b>\n`;
    }

    formattedText += `\n${message}\n`;

    if (rejectionReasons && rejectionReasons.length > 0) {
      formattedText += `\n<b>Quality Rejection Reasons:</b>\n`;
      rejectionReasons.forEach((r) => {
        formattedText += `• <code>${r}</code>\n`;
      });
    }

    if (errorMessage) {
      formattedText += `\n<b>Error Details:</b>\n<code>${errorMessage.substring(0, 300)}</code>\n`;
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

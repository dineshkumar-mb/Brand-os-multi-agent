import { Resend } from "resend";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export class EmailService {
  private getResendInstance(): Resend | null {
    const possibleEnvPaths = [
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), "../.env"),
      path.resolve(__dirname, "../../.env"),
      path.resolve(__dirname, "../../../.env"),
    ];

    for (const envPath of possibleEnvPaths) {
      if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath, override: true });
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey.trim() !== "" && apiKey !== "re_123456789_placeholder") {
      return new Resend(apiKey.trim());
    }
    return null;
  }

  private getFromEmail(): string {
    return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  }

  private getAppUrl(): string {
    return process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://brand-os-multi-agent.vercel.app");
  }

  /**
   * Send a password reset email with secure token link via Resend API
   */
  public async sendPasswordResetEmail(toEmail: string, resetToken: string, name?: string): Promise<boolean> {
    const userName = name || "User";
    const appUrl = this.getAppUrl();
    const resetUrl = `${appUrl}?resetToken=${encodeURIComponent(resetToken)}`;
    const fromEmail = this.getFromEmail();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 30px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .logo { font-size: 20px; font-weight: 700; color: #818cf8; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
          h1 { font-size: 22px; color: #ffffff; margin-bottom: 16px; }
          p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 14px; text-align: center; }
          .token-box { background: #020617; border: 1px dashed #334155; padding: 12px; border-radius: 8px; font-family: monospace; color: #a5b4fc; font-size: 13px; word-break: break-all; margin: 20px 0; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ Personal Brand OS</div>
          <h1>Password Reset Request</h1>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for your Personal Brand OS account. Click the button below to reset it. This link is valid for <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" class="btn">Reset Your Password</a>
          </div>
          <p>Or copy and paste your reset token directly in the app:</p>
          <div class="token-box">${resetToken}</div>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <div class="footer">
            Personal Brand OS — Autonomous Multi-Agent AI Platform
          </div>
        </div>
      </body>
      </html>
    `;

    const resend = this.getResendInstance();

    if (resend) {
      try {
        console.log(`[Email Service] Attempting to dispatch email via Resend to ${toEmail} from ${fromEmail}...`);
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          subject: "Reset your Personal Brand OS password",
          html: htmlContent,
        });

        if (error) {
          console.error(`[Email Service Error] Resend returned API error:`, error);
          return false;
        }

        console.log(`[Email Service Success] Password reset email sent via Resend to ${toEmail} (ID: ${data?.id})`);
        return true;
      } catch (error: any) {
        console.error(`[Email Service Exception] Exception sending email via Resend:`, error?.message || error);
        return false;
      }
    } else {
      console.warn(`[Email Service Notice] RESEND_API_KEY is not set in environment.`);
      console.log(`\n================== [DEMO EMAIL DISPATCH LOG] ==================`);
      console.log(`TO: ${toEmail}`);
      console.log(`SUBJECT: Reset your Personal Brand OS password`);
      console.log(`RESET TOKEN: ${resetToken}`);
      console.log(`RESET URL: ${resetUrl}`);
      console.log(`===============================================================\n`);
      return true;
    }
  }

  /**
   * Send welcome email upon registration via Resend API
   */
  public async sendWelcomeEmail(toEmail: string, name: string): Promise<boolean> {
    const resend = this.getResendInstance();
    if (!resend) return true;

    const fromEmail = this.getFromEmail();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 30px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
          .logo { font-size: 20px; font-weight: 700; color: #818cf8; margin-bottom: 24px; text-transform: uppercase; }
          h1 { font-size: 22px; color: #ffffff; }
          p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ Personal Brand OS</div>
          <h1>Welcome to Personal Brand OS!</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your account has been created successfully. You now have full access to our 18-Agent Swarm Topology, AI Gateway, Trend Discovery, and RAG Knowledge Memory.</p>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: "Welcome to Personal Brand OS",
        html: htmlContent,
      });

      if (error) {
        console.error(`[Email Service Error] Welcome email API error:`, error);
        return false;
      }
      console.log(`[Email Service Success] Welcome email sent to ${toEmail} (ID: ${data?.id})`);
      return true;
    } catch (err: any) {
      console.error(`[Email Service Exception]`, err?.message);
      return false;
    }
  }
}

export const emailService = new EmailService();

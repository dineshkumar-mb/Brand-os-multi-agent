import { loadConfig, Config } from "@brand-os/config";
import { prisma } from "@brand-os/database";
import { createClient } from "redis";
import fs from "fs";
import path from "path";

export interface HealthCheckResult {
  success: boolean;
  component: string;
  message: string;
  error?: string;
}

export class PreflightService {
  public async run(): Promise<HealthCheckResult[]> {
    console.log("[Preflight Service] Starting production environment and platform audits...");
    const results: HealthCheckResult[] = [];

    // 1. Environment Variables Validation
    let config: Config;
    try {
      config = loadConfig();
      results.push({
        success: true,
        component: "Environment",
        message: "Environment variables successfully parsed and validated.",
      });
    } catch (err: any) {
      results.push({
        success: false,
        component: "Environment",
        message: "Environment configuration validation failed.",
        error: err.message,
      });
      console.error("[Preflight Service] ❌ Environment check failed:", err.message);
      throw err; // Fail immediately
    }

    // 2. Database Connection Check
    try {
      await prisma.$queryRaw`SELECT 1`;
      results.push({
        success: true,
        component: "Database",
        message: "Database connection established and responding to queries.",
      });
    } catch (err: any) {
      results.push({
        success: false,
        component: "Database",
        message: "Failed to query the database.",
        error: err.message,
      });
      console.error("[Preflight Service] ❌ Database check failed:", err.message);
    }

    // 3. Redis Connection Check
    if (config.REDIS_URL) {
      try {
        const client = createClient({ url: config.REDIS_URL });
        // Set short connection timeout for health checks
        client.on("error", () => {});
        await Promise.race([
          client.connect(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Redis connection timeout")), 3000))
        ]);
        await client.ping();
        await client.disconnect();
        results.push({
          success: true,
          component: "Redis",
          message: "Redis connection established and responding to PING.",
        });
      } catch (err: any) {
        results.push({
          success: false,
          component: "Redis",
          message: `Failed to connect to Redis at ${config.REDIS_URL}`,
          error: err.message,
        });
        console.error("[Preflight Service] ❌ Redis check failed:", err.message);
      }
    }

    // 4. Filesystem Audits
    try {
      const testDir = path.join(process.cwd(), "scratch", ".preflight_test");
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      const testFile = path.join(testDir, "write_test.json");
      fs.writeFileSync(testFile, JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
      fs.readFileSync(testFile, "utf-8");
      fs.unlinkSync(testFile);
      fs.rmdirSync(testDir);
      results.push({
        success: true,
        component: "Filesystem",
        message: "Read and write permissions verified on scratch space.",
      });
    } catch (err: any) {
      results.push({
        success: false,
        component: "Filesystem",
        message: "Filesystem read/write operations failed.",
        error: err.message,
      });
      console.error("[Preflight Service] ❌ Filesystem check failed:", err.message);
    }

    // 5. AI Providers Check
    const hasOpenRouter = config.OPENROUTER_API_KEY && !config.OPENROUTER_API_KEY.includes("placeholder");
    const hasNvidia = config.NVIDIA_NIM_API_KEY && !config.NVIDIA_NIM_API_KEY.includes("placeholder");

    if (hasOpenRouter) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/models", {
          method: "GET",
          headers: { Authorization: `Bearer ${config.OPENROUTER_API_KEY}` },
        });
        if (res.ok) {
          results.push({
            success: true,
            component: "AI Providers (OpenRouter)",
            message: "OpenRouter API is accessible and authenticated.",
          });
        } else {
          throw new Error(`OpenRouter API returned HTTP ${res.status}`);
        }
      } catch (err: any) {
        results.push({
          success: false,
          component: "AI Providers (OpenRouter)",
          message: "Failed to connect or authenticate with OpenRouter API.",
          error: err.message,
        });
        console.warn("[Preflight Service] ⚠️ OpenRouter check failed:", err.message);
      }
    }

    if (hasNvidia) {
      try {
        const res = await fetch("https://integrate.api.nvidia.com/v1/models", {
          method: "GET",
          headers: { Authorization: `Bearer ${config.NVIDIA_NIM_API_KEY}` },
        });
        if (res.ok) {
          results.push({
            success: true,
            component: "AI Providers (NVIDIA NIM)",
            message: "NVIDIA NIM API is accessible and authenticated.",
          });
        } else {
          throw new Error(`NVIDIA NIM API returned HTTP ${res.status}`);
        }
      } catch (err: any) {
        results.push({
          success: false,
          component: "AI Providers (NVIDIA NIM)",
          message: "Failed to connect or authenticate with NVIDIA NIM API.",
          error: err.message,
        });
        console.warn("[Preflight Service] ⚠️ NVIDIA NIM check failed:", err.message);
      }
    }

    // 6. LinkedIn API Connection Check
    if (config.LINKEDIN_ACCESS_TOKEN) {
      try {
        // Quick syntax check: OAuth access tokens should have a minimum length or format.
        if (config.LINKEDIN_ACCESS_TOKEN.length < 20) {
          throw new Error("LinkedIn Access Token is too short to be valid.");
        }
        results.push({
          success: true,
          component: "LinkedIn",
          message: "LinkedIn Access Token syntax verified.",
        });
      } catch (err: any) {
        results.push({
          success: false,
          component: "LinkedIn",
          message: "LinkedIn token validation failed.",
          error: err.message,
        });
        console.error("[Preflight Service] ❌ LinkedIn check failed:", err.message);
      }
    }

    // 7. Medium API Connection Check
    if (config.MEDIUM_INTEGRATION_TOKEN && !config.MEDIUM_INTEGRATION_TOKEN.includes("placeholder")) {
      try {
        if (config.MEDIUM_INTEGRATION_TOKEN.length < 10) {
          throw new Error("Medium Integration Token is too short.");
        }
        results.push({
          success: true,
          component: "Medium",
          message: "Medium token syntax verified.",
        });
      } catch (err: any) {
        results.push({
          success: false,
          component: "Medium",
          message: "Medium token validation failed.",
          error: err.message,
        });
        console.warn("[Preflight Service] ⚠️ Medium check failed:", err.message);
      }
    }

    // Process overall failure if critical components fail
    const criticalFailures = results.filter((r) => {
      if (r.success) return false;
      if (r.component === "Environment" || r.component === "Filesystem") return true;
      if (r.component === "Database" || r.component === "Redis") {
        // Database and Redis are critical in production, but warnings in development/test
        return config.NODE_ENV === "production";
      }
      return false;
    });
    
    // In production, also require at least one successful AI provider and LinkedIn token validation
    if (config.NODE_ENV === "production") {
      const hasWorkingAI = results.some((r) => r.success && r.component.startsWith("AI Providers"));
      if (!hasWorkingAI) {
        criticalFailures.push({
          success: false,
          component: "AI Providers",
          message: "No working AI providers detected in production mode.",
        });
      }
      
      const linkedinSuccess = results.find((r) => r.component === "LinkedIn");
      if (!linkedinSuccess || !linkedinSuccess.success) {
        criticalFailures.push({
          success: false,
          component: "LinkedIn",
          message: "LinkedIn publisher verification failed in production mode.",
        });
      }
    }

    if (criticalFailures.length > 0) {
      const summary = criticalFailures.map((f) => `- ${f.component}: ${f.message} (${f.error || "no err details"})`).join("\n");
      throw new Error(`[Preflight Failure] Critical checks failed:\n${summary}`);
    }

    console.log("[Preflight Service] All checks passed successfully ✅");
    return results;
  }
}

export const preflightService = new PreflightService();
export default preflightService;

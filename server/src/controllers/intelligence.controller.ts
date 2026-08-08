import { Request, Response } from "express";
import {
  globalIntelligenceEngine,
  llmProviderRegistry,
  modelComparisonEngine,
  globalSourceRegistry,
} from "@brand-os/intelligence";

export class IntelligenceController {
  public async getDashboard(_req: Request, res: Response): Promise<void> {
    try {
      const scanResult = await globalIntelligenceEngine.executeScan("ON_DEMAND");
      const providerMatrix = llmProviderRegistry.getAllProviders();
      const comparison = modelComparisonEngine.compareModels(["gpt-4o", "claude-3-5-sonnet", "deepseek-r1"]);
      const sourceHealth = globalSourceRegistry.getHealthSummary();

      res.json({
        success: true,
        scanResult,
        providerMatrix,
        comparison,
        sourceHealth,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async triggerScan(req: Request, res: Response): Promise<void> {
    try {
      const mode = req.body.mode || "ON_DEMAND";
      const scanResult = await globalIntelligenceEngine.executeScan(mode);
      res.json({ success: true, scanResult });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getLLMProviders(_req: Request, res: Response): Promise<void> {
    try {
      const providers = llmProviderRegistry.getAllProviders();
      const comparison = modelComparisonEngine.compareModels(["gpt-4o", "claude-3-5-sonnet", "gemini-1.5-pro", "deepseek-r1"]);
      res.json({ success: true, providers, comparison });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getSourceHealth(_req: Request, res: Response): Promise<void> {
    try {
      const health = globalSourceRegistry.getHealthSummary();
      res.json({ success: true, health });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const intelligenceController = new IntelligenceController();

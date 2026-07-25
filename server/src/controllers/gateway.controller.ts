import { Request, Response } from "express";
import { aiGateway } from "@brand-os/ai-gateway";

export class GatewayController {
  public getBenchmarks(_req: Request, res: Response) {
    res.json({ benchmarks: aiGateway.getBenchmarks() });
  }

  public getLogs(_req: Request, res: Response) {
    res.json({
      logs: [
        {
          id: "req_9812",
          provider: "OPENAI",
          model: "gpt-4o",
          taskType: "linkedin_writer",
          promptTokens: 420,
          completionTokens: 280,
          totalTokens: 700,
          costUsd: 0.00385,
          latencyMs: 840,
          routingDecision: "Balanced default choice",
          wasFailover: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "req_9813",
          provider: "GEMINI",
          model: "gemini-1.5-flash",
          taskType: "fact_verification",
          promptTokens: 610,
          completionTokens: 110,
          totalTokens: 720,
          costUsd: 0.00008,
          latencyMs: 290,
          routingDecision: "Cost-optimized fast model",
          wasFailover: false,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }

  public async executePrompt(req: Request, res: Response) {
    const { prompt, taskType, routingStrategy } = req.body;
    try {
      const response = await aiGateway.execute({
        prompt: prompt || "Generate technical hook",
        taskType: taskType || "general",
        temperature: 0.7,
        routingStrategy: routingStrategy || ("COST_OPTIMIZED" as any),
      });
      res.json({ response });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const gatewayController = new GatewayController();

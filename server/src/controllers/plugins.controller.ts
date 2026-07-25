import { Request, Response } from "express";
import { pluginRegistry } from "@brand-os/plugins";

export class PluginsController {
  public getPlugins(_req: Request, res: Response) {
    res.json({ plugins: pluginRegistry.getPlugins() });
  }

  public async executePlugin(req: Request, res: Response) {
    const { name, action, payload } = req.body;
    try {
      const result = await pluginRegistry.runPlugin(name, action, payload);
      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const pluginsController = new PluginsController();

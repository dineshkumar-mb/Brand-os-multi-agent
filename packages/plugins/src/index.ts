export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  category: "PUBLISHER" | "NOTIFICATION" | "STORAGE" | "WORKFLOW";
  author: string;
  icon: string;
}

export interface IPlugin {
  manifest: PluginManifest;
  execute(action: string, payload: any): Promise<{ success: boolean; data?: any; error?: string }>;
}

export class DevToPlugin implements IPlugin {
  manifest: PluginManifest = {
    name: "Dev.to Publisher",
    version: "1.0.0",
    description: "Cross-post technical articles directly to Dev.to developer community.",
    category: "PUBLISHER",
    author: "Personal Brand OS Team",
    icon: "Code",
  };

  async execute(action: string, payload: any) {
    return {
      success: true,
      data: { articleUrl: `https://dev.to/tech_lead/published-${Date.now()}`, devToId: 104291 },
    };
  }
}

export class HashnodePlugin implements IPlugin {
  manifest: PluginManifest = {
    name: "Hashnode Publisher",
    version: "1.0.0",
    description: "Publish articles to your personal Hashnode custom domain blog.",
    category: "PUBLISHER",
    author: "Personal Brand OS Team",
    icon: "Globe",
  };

  async execute(action: string, payload: any) {
    return {
      success: true,
      data: { postUrl: `https://blog.techlead.dev/published-${Date.now()}` },
    };
  }
}

export class SlackNotificationPlugin implements IPlugin {
  manifest: PluginManifest = {
    name: "Slack Notifications",
    version: "1.1.0",
    description: "Send Human-in-the-Loop review requests and trend notifications to Slack channels.",
    category: "NOTIFICATION",
    author: "Personal Brand OS Team",
    icon: "MessageSquare",
  };

  async execute(action: string, payload: any) {
    return {
      success: true,
      data: { deliveredToChannel: "#brand-approvals", messageTs: `${Date.now()}` },
    };
  }
}

export class PluginRegistry {
  private plugins: Map<string, IPlugin> = new Map();

  constructor() {
    this.register(new DevToPlugin());
    this.register(new HashnodePlugin());
    this.register(new SlackNotificationPlugin());
  }

  public register(plugin: IPlugin) {
    this.plugins.set(plugin.manifest.name, plugin);
  }

  public getPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values()).map((p) => p.manifest);
  }

  public async runPlugin(pluginName: string, action: string, payload: any) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' is not installed.`);
    }
    return await plugin.execute(action, payload);
  }
}

export const pluginRegistry = new PluginRegistry();

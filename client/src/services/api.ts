const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "/api/v1";
    }
  }
  return "http://localhost:4000/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

export class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("brand_os_token");
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Network response error" }));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  public async getDashboard() {
    return this.request("/dashboard");
  }

  public async getTrends() {
    return this.request("/trends");
  }

  public async triggerTrendScan() {
    return this.request("/trends/scan", { method: "POST" });
  }

  public async conductResearch(topic: string) {
    return this.request("/research", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
  }

  public async triggerAgentSwarm(topic?: string) {
    return this.request("/agents/trigger", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
  }

  public async getGatewayLogs() {
    return this.request("/gateway/logs");
  }

  public async getGatewayBenchmarks() {
    return this.request("/gateway/benchmarks");
  }

  public async executeGatewayPrompt(prompt: string, taskType = "general") {
    return this.request("/gateway/execute", {
      method: "POST",
      body: JSON.stringify({ prompt, taskType }),
    });
  }

  public async getPosts() {
    return this.request("/posts");
  }

  public async getArticles() {
    return this.request("/articles");
  }

  public async publishPost(platform: string, content: any) {
    return this.request("/publish", {
      method: "POST",
      body: JSON.stringify({ platform, content }),
    });
  }

  public async getJobs() {
    return this.request("/jobs");
  }

  public async getAnalytics() {
    return this.request("/analytics");
  }

  public async getPlugins() {
    return this.request("/plugins");
  }

  public async executePlugin(name: string, action: string, payload: any = {}) {
    return this.request("/plugins/execute", {
      method: "POST",
      body: JSON.stringify({ name, action, payload }),
    });
  }
}

export const api = new ApiClient();

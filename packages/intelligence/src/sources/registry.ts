import {
  IntelligenceSource,
  SourceAuthorityLevel,
  SourceHealthSummary,
} from "@brand-os/shared";

export class GlobalSourceRegistry {
  private sources: IntelligenceSource[] = [
    // Level 1: Primary Official Sources
    {
      id: "openai_official",
      name: "OpenAI Official Releases & Engineering",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      rss: "https://openai.com/news/rss.xml",
      endpoint: "https://openai.com/news/",
      enabled: true,
      pollingIntervalMinutes: 30,
      capabilities: ["releases", "models", "api_updates", "engineering"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "anthropic_official",
      name: "Anthropic Engineering & News",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://www.anthropic.com/news",
      enabled: true,
      pollingIntervalMinutes: 30,
      capabilities: ["claude", "mcp", "api_updates", "research"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "google_gemini_official",
      name: "Google AI & Gemini Releases",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://blog.google/technology/ai/",
      enabled: true,
      pollingIntervalMinutes: 30,
      capabilities: ["gemini", "ai_studio", "vertex", "android_ai"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "xai_grok_official",
      name: "xAI & Grok Announcements",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://x.ai/blog",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["grok", "api", "reasoning"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "groq_official",
      name: "Groq Inference Hardware & Cloud",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://groq.com/news/",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["lpu", "inference_speed", "models"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "nvidia_official",
      name: "NVIDIA NIM & AI Infrastructure",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://developer.nvidia.com/blog/category/generative-ai/",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["nim", "cuda", "inference_optimization"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "meta_llama_official",
      name: "Meta AI & Llama Ecosystem",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://ai.meta.com/blog/",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["llama", "open_weights", "infrastructure"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "mistral_official",
      name: "Mistral AI Releases",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://mistral.ai/news/",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["models", "api", "coding_models"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "deepseek_official",
      name: "DeepSeek Reasoning & Open Models",
      category: "OFFICIAL_LAB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://github.com/deepseek-ai",
      enabled: true,
      pollingIntervalMinutes: 30,
      capabilities: ["r1", "v3", "benchmarks", "reasoning"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },

    // Level 1: Model Hubs
    {
      id: "huggingface_trending",
      name: "Hugging Face Model Hub & Trending",
      category: "MODEL_HUB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      api: "https://huggingface.co/api/models?sort=downloads&direction=-1&limit=30",
      enabled: true,
      pollingIntervalMinutes: 30,
      capabilities: ["models", "downloads", "likes", "trending", "datasets"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "ollama_library",
      name: "Ollama Model Ecosystem & API",
      category: "MODEL_HUB",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      api: "https://ollama.com/library",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["local_inference", "model_listings", "quantizations"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },

    // Level 1: Open Source & GitHub
    {
      id: "github_trending_daily",
      name: "GitHub Trending Repositories",
      category: "OPEN_SOURCE",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://github.com/trending",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["star_velocity", "repos", "languages", "maintainers"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },

    // Level 2: Research
    {
      id: "arxiv_ai_papers",
      name: "arXiv AI & Machine Learning Papers",
      category: "RESEARCH",
      authority: SourceAuthorityLevel.LEVEL_2_TECHNICAL,
      api: "http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.CL&max_results=15",
      enabled: true,
      pollingIntervalMinutes: 120,
      capabilities: ["papers", "architectures", "benchmarks", "rag", "agents"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },

    // Level 3: Developer Communities
    {
      id: "hackernews_top",
      name: "Hacker News Technical Discussions",
      category: "COMMUNITY",
      authority: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      api: "https://hacker-news.firebaseio.com/v0/topstories.json",
      enabled: true,
      pollingIntervalMinutes: 15,
      capabilities: ["community_discussions", "tech_sentiment", "rising_topics"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "reddit_tech_subs",
      name: "Reddit Tech Communities (r/LocalLLaMA, r/MachineLearning, r/reactjs)",
      category: "COMMUNITY",
      authority: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      endpoint: "https://www.reddit.com/r/LocalLLaMA/hot.json",
      enabled: true,
      pollingIntervalMinutes: 30,
      capabilities: ["pain_points", "developer_faqs", "implementation_issues"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "devto_rising",
      name: "Dev.to Technical Engineering Feed",
      category: "COMMUNITY",
      authority: SourceAuthorityLevel.LEVEL_3_COMMUNITY,
      api: "https://dev.to/api/articles?state=rising&per_page=15",
      enabled: true,
      pollingIntervalMinutes: 30,
      capabilities: ["article_trends", "tutorials", "architecture"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
    {
      id: "producthunt_ai",
      name: "Product Hunt AI & DevTools Signal",
      category: "COMMUNITY",
      authority: SourceAuthorityLevel.LEVEL_4_DISCOVERY,
      endpoint: "https://www.producthunt.com/topics/artificial-intelligence",
      enabled: true,
      pollingIntervalMinutes: 120,
      capabilities: ["product_launches", "dev_tools", "automation"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },

    // Level 1: Framework Ecosystem Monitors
    {
      id: "framework_monitors",
      name: "React, Next.js, LangChain, MCP, Docker, Postgres Releases",
      category: "DEVELOPER_PLATFORM",
      authority: SourceAuthorityLevel.LEVEL_1_PRIMARY,
      endpoint: "https://github.com/facebook/react/releases",
      enabled: true,
      pollingIntervalMinutes: 60,
      capabilities: ["framework_releases", "breaking_changes", "sdks"],
      healthStatus: "GREEN",
      lastVerifiedAt: new Date().toISOString(),
      errorCount: 0,
    },
  ];

  public getSources(): IntelligenceSource[] {
    return this.sources;
  }

  public getSourceById(id: string): IntelligenceSource | undefined {
    return this.sources.find((s) => s.id === id);
  }

  public getHealthSummary(): SourceHealthSummary {
    const total = this.sources.length;
    const green = this.sources.filter((s) => s.healthStatus === "GREEN").length;
    const yellow = this.sources.filter((s) => s.healthStatus === "YELLOW").length;
    const red = this.sources.filter((s) => s.healthStatus === "RED").length;
    return {
      totalSources: total,
      healthyGreen: green,
      degradedYellow: yellow,
      failedRed: red,
      sources: this.sources,
    };
  }

  public updateHealth(id: string, status: "GREEN" | "YELLOW" | "RED", isError = false): void {
    const src = this.getSourceById(id);
    if (src) {
      src.healthStatus = status;
      src.lastVerifiedAt = new Date().toISOString();
      if (isError) {
        src.errorCount += 1;
      }
    }
  }
}

export const globalSourceRegistry = new GlobalSourceRegistry();

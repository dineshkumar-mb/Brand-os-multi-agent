import { z } from "zod";

// ==========================================
// ENUMS & CONSTANTS
// ==========================================

export enum Platform {
  LINKEDIN = "LINKEDIN",
  MEDIUM = "MEDIUM",
  DEVTO = "DEVTO",
  HASHNODE = "HASHNODE",
  X_TWITTER = "X_TWITTER",
}

export enum PublishMode {
  LIVE = "LIVE",
  SIMULATION = "SIMULATION",
  AUTO = "AUTO",
}

export enum ModelProvider {
  OPENAI = "OPENAI",
  GEMINI = "GEMINI",
  ANTHROPIC = "ANTHROPIC",
  OPENROUTER = "OPENROUTER",
  NVIDIA_NIM = "NVIDIA_NIM",
  OLLAMA = "OLLAMA",
}

export enum AgentType {
  TREND_DISCOVERY = "TREND_DISCOVERY",
  RESEARCH = "RESEARCH",
  FACT_VERIFICATION = "FACT_VERIFICATION",
  WRITING_STYLE = "WRITING_STYLE",
  CONTENT_STRATEGY = "CONTENT_STRATEGY",
  LINKEDIN_GENERATOR = "LINKEDIN_GENERATOR",
  MEDIUM_WRITER = "MEDIUM_WRITER",
  REVIEWER = "REVIEWER",
  CRITIC = "CRITIC",
  SEO = "SEO",
  IMAGE_GENERATOR = "IMAGE_GENERATOR",
  HASHTAG_GENERATOR = "HASHTAG_GENERATOR",
  PUBLISHER = "PUBLISHER",
  ANALYTICS = "ANALYTICS",
  LEARNING = "LEARNING",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  SCHEDULED = "SCHEDULED",
  PUBLISHING = "PUBLISHING",
  PUBLISHED = "PUBLISHED",
  FAILED = "FAILED",
  REJECTED = "REJECTED",
}

export enum RoutingStrategy {
  COST_OPTIMIZED = "COST_OPTIMIZED",
  LOWEST_LATENCY = "LOWEST_LATENCY",
  ACCURACY_FIRST = "ACCURACY_FIRST",
  BALANCED = "BALANCED",
}

export enum AgentEvent {
  TREND_FOUND = "TrendFound",
  RESEARCH_COMPLETED = "ResearchCompleted",
  FACT_VERIFIED = "FactVerified",
  CONTENT_GENERATED = "ContentGenerated",
  REVIEW_COMPLETED = "ReviewCompleted",
  APPROVED = "Approved",
  PUBLISHED = "Published",
  ANALYTICS_UPDATED = "AnalyticsUpdated",
  LEARNING_UPDATED = "LearningUpdated",
}

// ==========================================
// ZOD SCHEMAS & INTERFACES
// ==========================================

export const TopicSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  category: z.string(),
  score: z.number().min(0).max(100),
  reason: z.string(),
  trend_velocity: z.number(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  competition: z.enum(["LOW", "MEDIUM", "HIGH"]),
  audience: z.string(),
  keywords: z.array(z.string()),
  references: z.array(z.string()),
});
export type Topic = z.infer<typeof TopicSchema>;

export const ResearchOutputSchema = z.object({
  topicId: z.string(),
  summary: z.string(),
  key_insights: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  future_outlook: z.string(),
  code_snippets: z.array(z.object({
    language: z.string(),
    code: z.string(),
    description: z.string(),
  })),
  statistics: z.array(z.string()),
  citations: z.array(z.object({
    title: z.string(),
    url: z.string(),
    source: z.string(),
  })),
});
export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;

export const FactVerificationSchema = z.object({
  factCheckPassed: z.boolean(),
  confidenceScore: z.number().min(0).max(100),
  verifiedClaims: z.array(z.string()),
  rejectedClaims: z.array(z.string()),
  rejectionReasons: z.array(z.string()),
  sourcesUsed: z.array(z.string()),
});
export type FactVerification = z.infer<typeof FactVerificationSchema>;

export const ContentEvaluationSchema = z.object({
  readabilityScore: z.number().min(0).max(100),
  seoScore: z.number().min(0).max(100),
  engagementScore: z.number().min(0).max(100),
  noveltyScore: z.number().min(0).max(100),
  grammarScore: z.number().min(0).max(100),
  technicalAccuracyScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  passedThreshold: z.boolean(),
  feedbackNotes: z.array(z.string()),
});
export type ContentEvaluation = z.infer<typeof ContentEvaluationSchema>;

export const LinkedInPostPayloadSchema = z.object({
  title: z.string(),
  hook: z.string(),
  story: z.string(),
  lesson: z.string(),
  actionableInsight: z.string(),
  cta: z.string(),
  hashtags: z.array(z.string()),
  fullText: z.string(),
  carouselSlides: z.array(z.object({
    slideNumber: z.number(),
    title: z.string(),
    body: z.string(),
  })).optional(),
  imageUrl: z.string().optional(),
});
export type LinkedInPostPayload = z.infer<typeof LinkedInPostPayloadSchema>;

export const MediumArticlePayloadSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  metaDescription: z.string(),
  seoKeywords: z.array(z.string()),
  readingTimeMinutes: z.number(),
  tableOfContents: z.array(z.string()),
  introduction: z.string(),
  problemStatement: z.string(),
  deepExplanation: z.string(),
  architectureSection: z.string(),
  codeSnippets: z.array(z.object({
    filename: z.string().optional(),
    language: z.string(),
    code: z.string(),
    explanation: z.string(),
  })),
  bestPractices: z.array(z.string()),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  conclusion: z.string(),
  fullMarkdown: z.string(),
  imageUrl: z.string().optional(),
});
export type MediumArticlePayload = z.infer<typeof MediumArticlePayloadSchema>;

export const AIGatewayRequestSchema = z.object({
  prompt: z.string(),
  systemPrompt: z.string().optional(),
  taskType: z.string().default("general"),
  preferredProvider: z.nativeEnum(ModelProvider).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().optional(),
  routingStrategy: z.nativeEnum(RoutingStrategy).default(RoutingStrategy.COST_OPTIMIZED),
  responseSchema: z.any().optional(),
});
export type AIGatewayRequest = z.infer<typeof AIGatewayRequestSchema>;

export interface AIGatewayResponse<T = any> {
  id: string;
  provider: ModelProvider;
  model: string;
  text: string;
  structuredOutput?: T;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  timeToFirstTokenMs?: number;
  routingDecision: string;
  wasFailover: boolean;
}

export interface PromptTemplateDefinition {
  id: string;
  name: string;
  agentType: AgentType;
  version: number;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
  isActive: boolean;
}

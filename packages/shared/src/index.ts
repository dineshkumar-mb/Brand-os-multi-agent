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
  // Master Personal Brand Intelligence Agents
  TREND_DISCOVERY = "TREND_DISCOVERY",
  TOPIC_INTELLIGENCE = "TOPIC_INTELLIGENCE",
  CONTENT_GAP = "CONTENT_GAP",
  AUDIENCE_RESEARCH = "AUDIENCE_RESEARCH",
  PERSONAL_BRAND_STRATEGY = "PERSONAL_BRAND_STRATEGY",
  TECHNICAL_RESEARCH = "TECHNICAL_RESEARCH",
  KNOWLEDGE_GRAPH = "KNOWLEDGE_GRAPH",
  EXPERIENCE_MINING = "EXPERIENCE_MINING",
  TECHNICAL_WRITER = "TECHNICAL_WRITER",
  STORYTELLING = "STORYTELLING",
  HUMANIZATION = "HUMANIZATION",
  TECHNICAL_REVIEWER = "TECHNICAL_REVIEWER",
  ORIGINALITY = "ORIGINALITY",
  SEO_AND_ENGAGEMENT = "SEO_AND_ENGAGEMENT",
  VISUAL_PLANNING = "VISUAL_PLANNING",
  PUBLISHER = "PUBLISHER",
  CONTINUOUS_LEARNING = "CONTINUOUS_LEARNING",
  DECISION_GATE = "DECISION_GATE",

  // Backward compatibility aliases
  RESEARCH = "RESEARCH",
  SOURCE_VERIFICATION = "SOURCE_VERIFICATION",
  KNOWLEDGE_EXTRACTION = "KNOWLEDGE_EXTRACTION",
  FACT_VERIFICATION = "FACT_VERIFICATION",
  WRITING_STYLE = "WRITING_STYLE",
  CONTENT_STRATEGY = "CONTENT_STRATEGY",
  LINKEDIN_GENERATOR = "LINKEDIN_GENERATOR",
  MEDIUM_WRITER = "MEDIUM_WRITER",
  DEVTO_WRITER = "DEVTO_WRITER",
  REVIEWER = "REVIEWER",
  CRITIC = "CRITIC",
  IMAGE_PROMPT_ENGINEERING = "IMAGE_PROMPT_ENGINEERING",
  SEO = "SEO",
  IMAGE_GENERATOR = "IMAGE_GENERATOR",
  HASHTAG_GENERATOR = "HASHTAG_GENERATOR",
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
  TOPIC_EVALUATED = "TopicEvaluated",
  CONTENT_GAP_ANALYZED = "ContentGapAnalyzed",
  AUDIENCE_TARGETED = "AudienceTargeted",
  RESEARCH_COMPLETED = "ResearchCompleted",
  KNOWLEDGE_MAPPED = "KnowledgeMapped",
  EXPERIENCE_MINED = "ExperienceMined",
  FACT_VERIFIED = "FactVerified",
  CONTENT_GENERATED = "ContentGenerated",
  HUMANIZED = "Humanized",
  REVIEW_COMPLETED = "ReviewCompleted",
  ORIGINALITY_PASSED = "OriginalityPassed",
  APPROVED = "Approved",
  PUBLISHED = "Published",
  ANALYTICS_UPDATED = "AnalyticsUpdated",
  LEARNING_UPDATED = "LearningUpdated",
  DECISION_MADE = "DecisionMade",
}

export const CONTENT_DIVERSITY_CATEGORIES = [
  "AI Engineering",
  "Agentic AI",
  "MCP",
  "RAG",
  "LLMs",
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "NestJS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "GitHub Actions",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "System Design",
  "Distributed Systems",
  "DevOps",
  "Authentication",
  "Security",
  "Performance",
  "Testing",
  "Cloud",
  "Architecture",
  "Career Growth",
  "Engineering Leadership",
  "Open Source",
  "Debugging",
  "Productivity",
  "Project Walkthroughs",
  "Engineering Lessons",
] as const;

export type ContentCategory = (typeof CONTENT_DIVERSITY_CATEGORIES)[number] | string;

export const TARGET_AUDIENCES = [
  "Recruiters",
  "Hiring Managers",
  "CTOs",
  "Engineering Managers",
  "Founders",
  "Senior Engineers",
  "AI Engineers",
  "Full Stack Developers",
] as const;

export type TargetAudience = (typeof TARGET_AUDIENCES)[number] | string;

// ==========================================
// UNIFIED AGENT TELEMETRY & OUTPUT INTERFACE
// ==========================================

export interface AgentMetadata {
  agentType: AgentType;
  timestamp: string;
  executionTimeMs: number;
  modelUsed?: string;
  tokensUsed?: number;
  pipelineId?: string;
  retryCount?: number;
  errorDetails?: string[];
}

export interface AgentValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export interface AgentResult<T> {
  success: boolean;
  confidenceScore: number; // 0 - 100
  data: T;
  validationResult: AgentValidationResult;
  metadata: AgentMetadata;
}

// ==========================================
// ZOD SCHEMAS & TYPES
// ==========================================

export const TopicSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  category: z.string(),
  framework: z.string().optional(),
  supportingTech: z.array(z.string()).default([]),
  score: z.number().min(0).max(100),
  reason: z.string(),
  trend_velocity: z.number(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  competition: z.enum(["LOW", "MEDIUM", "HIGH"]),
  audience: z.string(),
  keywords: z.array(z.string()),
  references: z.array(z.string()),
  storyAngle: z.string().optional(),
  categoryWeight: z.number().optional(),
});
export type Topic = z.infer<typeof TopicSchema>;

export const HistoricalPostRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  platform: z.nativeEnum(Platform),
  category: z.string(),
  framework: z.string().optional(),
  supportingTech: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  hook: z.string(),
  writingStyle: z.string().optional(),
  storyAngle: z.string().optional(),
  audience: z.string().optional(),
  cta: z.string().optional(),
  fullText: z.string(),
  publishedAt: z.string(),
  engagementMetrics: z
    .object({
      impressions: z.number().default(0),
      reactions: z.number().default(0),
      comments: z.number().default(0),
      shares: z.number().default(0),
      saves: z.number().default(0),
      profileVisits: z.number().default(0),
      followersGained: z.number().default(0),
    })
    .optional(),
});
export type HistoricalPostRecord = z.infer<typeof HistoricalPostRecordSchema>;

export const ExperienceLogSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  technologiesUsed: z.array(z.string()),
  challengesFaced: z.array(z.string()),
  solutionApproach: z.string(),
  tradeoffs: z.array(z.string()),
  keyLessons: z.array(z.string()),
  metricsOrOutcome: z.string().optional(),
  createdAt: z.string().optional(),
});
export type ExperienceLog = z.infer<typeof ExperienceLogSchema>;

export const OriginalityCheckResultSchema = z.object({
  passed: z.boolean(),
  overallSimilarityScore: z.number(), // 0.0 - 1.0 (threshold <= 0.35)
  semanticEmbeddingSimilarity: z.number().optional(), // 0.0 - 1.0 semantic embedding vector score
  maxSimilarPostId: z.string().optional(),
  maxSimilarPostTitle: z.string().optional(),
  breakdown: z.object({
    titleSimilarity: z.number(),
    hookSimilarity: z.number(),
    technologyOverlap: z.number(),
    ctaSimilarity: z.number(),
    structureSimilarity: z.number(),
    semanticSimilarity: z.number().optional(),
  }),
  rejectionReasons: z.array(z.string()),
});
export type OriginalityCheckResult = z.infer<typeof OriginalityCheckResultSchema>;

export const VisualValidationResultSchema = z.object({
  alignedWithArticle: z.boolean(),
  alignmentScore: z.number(), // 0 - 100
  categoryMatch: z.boolean(),
  logoAccuracyPassed: z.boolean(),
  feedbackNotes: z.array(z.string()),
});
export type VisualValidationResult = z.infer<typeof VisualValidationResultSchema>;

export const DecisionGateResultSchema = z.object({
  approvedForPublishing: z.boolean(),
  decision: z.enum(["PUBLISH", "REGENERATE", "REJECT"]),
  gateCheckResults: z.object({
    topicFreshnessPassed: z.boolean(),
    technicalAccuracyPassed: z.boolean(),
    originalityPassed: z.boolean(),
    humanTonePassed: z.boolean(),
    audienceRelevancePassed: z.boolean(),
    brandStrategyPassed: z.boolean(),
    discussionPotentialPassed: z.boolean(),
    platformOptimizationPassed: z.boolean(),
    visualValidationPassed: z.boolean(),
    seoCompletenessPassed: z.boolean(),
  }),
  rejectionReasons: z.array(z.string()),
  actionRequired: z.string().optional(),
});
export type DecisionGateResult = z.infer<typeof DecisionGateResultSchema>;

export const ResearchOutputSchema = z.object({
  topicId: z.string(),
  summary: z.string(),
  key_insights: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  future_outlook: z.string(),
  code_snippets: z.array(
    z.object({
      language: z.string(),
      code: z.string(),
      description: z.string(),
    })
  ),
  statistics: z.array(z.string()),
  citations: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      source: z.string(),
    })
  ),
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
  carouselSlides: z
    .array(
      z.object({
        slideNumber: z.number(),
        title: z.string(),
        body: z.string(),
      })
    )
    .optional(),
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
  codeSnippets: z.array(
    z.object({
      filename: z.string().optional(),
      language: z.string(),
      code: z.string(),
      explanation: z.string(),
    })
  ),
  bestPractices: z.array(z.string()),
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  conclusion: z.string(),
  fullMarkdown: z.string(),
  imageUrl: z.string().optional(),
});
export type MediumArticlePayload = z.infer<typeof MediumArticlePayloadSchema>;

export const DevToArticlePayloadSchema = z.object({
  title: z.string(),
  published: z.boolean().default(false),
  tags: z.array(z.string()),
  series: z.string().optional(),
  canonicalUrl: z.string().optional(),
  description: z.string(),
  mainImage: z.string().optional(),
  markdownContent: z.string(),
});
export type DevToArticlePayload = z.infer<typeof DevToArticlePayloadSchema>;

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
  pipelineId: z.string().optional(),
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

// ==========================================
// ADDITIONAL ENTERPRISE GOVERNANCE TYPES
// ==========================================

export interface ExecutionTelemetry {
  agentName: string;
  agentType: AgentType;
  executionTimeMs: number;
  tokensUsed: number;
  retryCount: number;
  confidenceScore: number;
  status: "SUCCESS" | "FAILED" | "RETRY";
  modelUsed?: string;
  errors?: string[];
  timestamp: string;
}

export interface PortfolioCategoryMetric {
  category: string;
  count: number;
  percentage: number;
  targetPercentage: number;
  deviation: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface PortfolioMetrics {
  totalPostsAnalyzed: number;
  portfolioDomainMetrics: PortfolioCategoryMetric[];
  underrepresentedDomains: string[];
  overrepresentedDomains: string[];
  recommendedCategory: string;
}

export interface ContentScore {
  technicalAccuracyScore: number;
  originalityScore: number;
  humanToneScore: number;
  audienceRelevanceScore: number;
  brandAlignmentScore: number;
  visualAlignmentScore: number;
  seoScore: number;
  overallScore: number;
}

export type PublishingDecision = "PUBLISH" | "REGENERATE" | "REJECT";

export interface DecisionResult {
  decision: PublishingDecision;
  approvedForPublishing: boolean;
  score: ContentScore;
  rejectionReasons: string[];
  actionRequired?: string;
}

export interface QualityGateResult {
  gateName: string;
  passed: boolean;
  score: number;
  threshold: number;
  details?: string;
}

// ==========================================
// TECHNICAL DIAGRAM & INFOGRAPHIC TYPES
// ==========================================

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: "query" | "data" | "embedding" | "vector" | "vectordb" | "context" | "llm" | "response" | "cache" | "custom";
  color?: "yellow" | "blue" | "green" | "purple" | "slate";
}

export interface DiagramColumn {
  id: string;
  title: string;
  subtitle: string;
  color: "blue" | "green" | "yellow" | "purple";
  nodes: DiagramNode[];
  flowConnections?: Array<{ from: string; to: string; label?: string }>;
}

export interface DiagramSpec {
  title: string;
  columns: DiagramColumn[];
  layoutStyle: "SIDE_BY_SIDE_COMPARISON" | "SINGLE_FLOWCHART" | "SYSTEM_DESIGN";
  colorPalette: string;
}

export interface InfographicPreset {
  id: string;
  name: string;
  description: string;
  diagramSpec: DiagramSpec;
}

export interface VisualPlanBlueprint {
  topicConcept: string;
  visualCategory: "SYSTEM_DESIGN" | "AI_AGENTS" | "REACT_COMPILER" | "DOCKER_K8S" | "CLOUD_INFRA" | "COMPARISON_DIAGRAM";
  requiredDiagramNodes: string[];
  colorPalette: string;
  imagePrompt: string;
  diagramSpec?: DiagramSpec;
  renderedSvg?: string;
}

// ==========================================
// GLOBAL AI INTELLIGENCE LAYER CONTRACTS
// ==========================================

export enum SourceAuthorityLevel {
  LEVEL_1_PRIMARY = 1,     // Official docs, API refs, release posts, official repos, official blogs
  LEVEL_2_TECHNICAL = 2,   // Research papers, maintainer discussions, benchmarks, engineering blogs
  LEVEL_3_COMMUNITY = 3,   // Hacker News, Reddit, Dev.to, GitHub discussions
  LEVEL_4_DISCOVERY = 4,   // Social media, aggregators, third-party blogs
}

export type SourceCategory =
  | "OFFICIAL_LAB"
  | "MODEL_HUB"
  | "OPEN_SOURCE"
  | "COMMUNITY"
  | "RESEARCH"
  | "DEVELOPER_PLATFORM";

export interface IntelligenceSource {
  id: string;
  name: string;
  category: SourceCategory;
  authority: SourceAuthorityLevel;
  endpoint?: string;
  rss?: string;
  api?: string;
  scraper?: string;
  enabled: boolean;
  pollingIntervalMinutes: number;
  capabilities: string[];
  healthStatus: "GREEN" | "YELLOW" | "RED";
  lastVerifiedAt?: string;
  errorCount: number;
}

export interface LLMProviderInfo {
  provider: string;
  model: string;
  releaseDate: string;
  contextWindow: number;
  inputPricingPer1M: number;
  outputPricingPer1M: number;
  modalities: string[];
  reasoning: boolean;
  toolCalling: boolean;
  structuredOutput: boolean;
  vision: boolean;
  audio: boolean;
  codingScore: number; // 0 - 100 benchmark score
  availability: "PUBLIC_API" | "OPEN_WEIGHTS" | "LOCAL_ONLY" | "PREVIEW";
  status: "ACTIVE" | "DEPRECATED" | "BETA";
  officialSource: string;
  lastVerified: string;
}

export interface WhyCareContext {
  whatHappened: string;
  whyItMatters: string;
  whoIsAffected: string;
  whatChangedTechnically: string;
  whatCanDevelopersBuild: string;
  isProductionReady: boolean;
  isWorthLearning: boolean;
  careerRelevanceExplanation: string;
  personalBuildConnection: string;
}

export interface ExperienceEvidence {
  experienceId: string;
  title: string;
  relevanceScore: number;
  overlapDescription: string;
  technologiesUsed: string[];
}

export interface AudiencePersona {
  role: string;
  relevanceReason: string;
}

export type ContentAngle =
  | "ANNOUNCEMENT"
  | "ARCHITECTURE_ANALYSIS"
  | "DEVELOPER_IMPACT"
  | "PRODUCTION_TRADEOFF"
  | "PERFORMANCE_COMPARISON"
  | "IMPLEMENTATION_TUTORIAL"
  | "MIGRATION_GUIDE"
  | "COST_ANALYSIS"
  | "SECURITY_IMPLICATIONS"
  | "PERSONAL_EXPERIMENT";

export interface EvidenceProvenance {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  url?: string;
  retrievedAt: string;
  authorityLevel: SourceAuthorityLevel;
  claimVerified: boolean;
  citationText: string;
}

export interface ContentOpportunity {
  id: string;
  canonicalEventId: string;
  topic: string;
  summary: string;
  careerRelevanceScore: number;
  personalExperienceMatch: number;
  technicalImportanceScore: number;
  sourceAuthorityScore: number;
  originalityOpportunityScore: number;
  trendVelocityScore: number;
  contentGapScore: number;
  developerAdoptionScore: number;
  overallScore: number;
  whyCare: WhyCareContext;
  experienceEvidence: ExperienceEvidence[];
  recommendedAngle: ContentAngle;
  targetAudience: AudiencePersona[];
  targetPlatforms: Platform[];
  evidence: EvidenceProvenance[];
  status: "CANDIDATE" | "APPROVED" | "REJECTED" | "EXPIRED" | "PUBLISHED";
  rejectionReason?: string;
  expiresAt: string;
}

export type ScanTriggerMode = "MANUAL" | "SCHEDULED" | "ON_DEMAND" | "EVENT_TRIGGERED";

export interface SourceHealthSummary {
  totalSources: number;
  healthyGreen: number;
  degradedYellow: number;
  failedRed: number;
  sources: IntelligenceSource[];
}

export interface ScoringWeightsConfig {
  trendFreshness: number;         // default 0.18
  trendVelocity: number;          // default 0.15
  technicalImportance: number;    // default 0.14
  careerRelevance: number;        // default 0.14
  personalExperience: number;     // default 0.10
  contentGap: number;             // default 0.10
  originality: number;            // default 0.08
  audienceInterest: number;       // default 0.06
  sourceAuthority: number;        // default 0.05
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeightsConfig = {
  trendFreshness: 0.18,
  trendVelocity: 0.15,
  technicalImportance: 0.14,
  careerRelevance: 0.14,
  personalExperience: 0.10,
  contentGap: 0.10,
  originality: 0.08,
  audienceInterest: 0.06,
  sourceAuthority: 0.05,
};

export interface TopicDecayProfile {
  daysAgo: number;
  decayPenalty: number;
  eligibilityPercent: number;
}

export interface ContentSaturationScore {
  topicSaturation: number;       // 0 - 100
  technologySaturation: number;  // 0 - 100
  categorySaturation: number;    // 0 - 100
  narrativeSaturation: number;   // 0 - 100
  visualSaturation: number;      // 0 - 100
  overallSaturationScore: number;
  rejected: boolean;
  rejectionReason?: string;
}

export type NarrativePattern =
  | "ENGINEERING_DISCOVERY"
  | "UNEXPECTED_PROBLEM"
  | "TECHNICAL_TRADEOFF"
  | "PRODUCTION_FAILURE"
  | "CONTRARIAN_OBSERVATION"
  | "NEW_TECHNOLOGY_ANALYSIS"
  | "BUILD_IN_PUBLIC"
  | "ARCHITECTURE_LESSON";

export interface VisualBrief {
  topic: string;
  technicalConcept: string;
  primaryObjects: string[];
  architectureLayers: string[];
  relationships: string[];
  labels: string[];
  visualStyle: string;
  platform: Platform;
  aspectRatio: string;
  diagramType: string;
  prohibitedElements: string[];
  conceptHash?: string;
}

export interface DailyContentMemory {
  date: string;
  topic: string;
  category: string;
  framework?: string;
  technologies: string[];
  angle: string;
  hook: string;
  cta: string;
  narrativePattern: NarrativePattern;
  visualConcept: string;
  imageHash: string;
  sourceEvents: string[];
}

export interface DiversityReport7Day {
  date: string;
  todayTopic: string;
  todayCategory: string;
  todayStatus: "POST_GENERATED" | "NO_POST_TODAY";
  last7DaysCategories: Record<string, number>;
  repeatedTechnologies: Record<string, number>;
  topFreshCandidates: string[];
  rejectedCandidates: Array<{ topic: string; reason: string }>;
  decisionExplainability: string;
  visualAlignmentScore?: number;
  originalityScore?: number;
}







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

export enum ModelProvider {
  OPENAI = "OPENAI",
  GEMINI = "GEMINI",
  ANTHROPIC = "ANTHROPIC",
  OPENROUTER = "OPENROUTER",
  NVIDIA_NIM = "NVIDIA_NIM",
  OLLAMA = "OLLAMA",
}

export enum SourceAuthorityLevel {
  LEVEL_1_ADVANCED = 1, // Advanced Level: Official company labs, primary repository, official documentation
  LEVEL_1_PRIMARY = 1, // Primary Level alias
  LEVEL_2_SECONDARY = 2, // Technical publication, peer-reviewed paper, engineering blog
  LEVEL_2_TECHNICAL = 2, // Legacy alias for secondary technical sources
  LEVEL_3_COMMUNITY = 3, // Hacker News, Dev.to, Reddit engineering subs
  LEVEL_4_DISCOVERY = 4, // Aggregators, social feeds, discovery signals
}

export enum VisualType {
  ARCHITECTURE_DIAGRAM = "ARCHITECTURE_DIAGRAM",
  SYSTEM_FLOW = "SYSTEM_FLOW",
  DEBUGGING_TIMELINE = "DEBUGGING_TIMELINE",
  BENCHMARK_CHART = "BENCHMARK_CHART",
  CODE_ANNOTATION = "CODE_ANNOTATION",
  DATA_FLOW = "DATA_FLOW",
  BEFORE_AFTER_ARCHITECTURE = "BEFORE_AFTER_ARCHITECTURE",
  DECISION_MATRIX = "DECISION_MATRIX",
  FAILURE_ANALYSIS = "FAILURE_ANALYSIS",
  TIMELINE = "TIMELINE",
  COMPONENT_MAP = "COMPONENT_MAP",
  DISTRIBUTED_SYSTEM_DIAGRAM = "DISTRIBUTED_SYSTEM_DIAGRAM",
  CONCEPTUAL_ILLUSTRATION = "CONCEPTUAL_ILLUSTRATION",
  TECHNICAL_COMPARISON = "TECHNICAL_COMPARISON",
  MINIMAL_ENGINEERING_POSTER = "MINIMAL_ENGINEERING_POSTER",
}

export enum FormatStyle {
  PRODUCTION_INCIDENT = "PRODUCTION_INCIDENT",
  DEBUGGING_STORY = "DEBUGGING_STORY",
  ARCHITECTURE_DECISION = "ARCHITECTURE_DECISION",
  BEFORE_AFTER_LAYOUT = "BEFORE_AFTER_LAYOUT",
  PERFORMANCE_INVESTIGATION = "PERFORMANCE_INVESTIGATION",
  FAILED_EXPERIMENT = "FAILED_EXPERIMENT",
  TRADEOFF_DEBATE = "TRADEOFF_DEBATE",
  BUILD_IN_PUBLIC = "BUILD_IN_PUBLIC",
  SYSTEM_DESIGN_BREAKDOWN = "SYSTEM_DESIGN_BREAKDOWN",
  TECHNICAL_MYTH = "TECHNICAL_MYTH",
  CODE_WALKTHROUGH = "CODE_WALKTHROUGH",
  ENGINEERING_RETROSPECTIVE = "ENGINEERING_RETROSPECTIVE",
  NEW_TECH_PERSONAL_EXPERIMENT = "NEW_TECH_PERSONAL_EXPERIMENT",
  BENCHMARK_ANALYSIS = "BENCHMARK_ANALYSIS",
  ARCHITECTURE_EVOLUTION = "ARCHITECTURE_EVOLUTION",

  // Legacy fallback aliases
  NARRATIVE_PARAGRAPHS = "NARRATIVE_PARAGRAPHS",
  MINIMAL_BULLETS = "MINIMAL_BULLETS",
  SHORT_DIALOGUE = "SHORT_DIALOGUE",
  TECHNICAL_NOTE = "TECHNICAL_NOTE",
  STORY_FIRST = "STORY_FIRST",
  ARCHITECTURE_FIRST = "ARCHITECTURE_FIRST",
}

export enum RoutingStrategy {
  COST_OPTIMIZED = "COST_OPTIMIZED",
  LOWEST_LATENCY = "LOWEST_LATENCY",
  ACCURACY_FIRST = "ACCURACY_FIRST",
  BALANCED = "BALANCED",
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
  VISUAL_INTELLIGENCE = "VISUAL_INTELLIGENCE",
  VISUAL_REVIEWER = "VISUAL_REVIEWER",
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

export interface EvidenceProvenance {
  source?: string;
  sourceId?: string;
  sourceName?: string;
  sourceType?: string;
  url?: string;
  sourceLevel?: SourceAuthorityLevel;
  authorityLevel?: SourceAuthorityLevel;
  publicationDate?: string;
  retrievedAt?: string;
  claim?: string;
  claimVerified?: boolean;
  citationText?: string;
  verificationStatus?: "VERIFIED" | "UNVERIFIED" | "REJECTED";
}

export interface CandidateOpportunityScores {
  careerRelevance: number;
  personalExperienceMatch: number;
  technicalImportance: number;
  sourceAuthority: number;
  originality: number;
  trendVelocity: number;
  contentGap: number;
  developerAdoption: number;
  freshness: number;
  topicNovelty: number;
  proofAvailability: number;
  engineeringTension: number;
  careerDifferentiation: number;
  overallScore: number;
}



export interface EngineeringProblem {
  problem: string;
  affectedSystems: string[];
  engineeringTensions: string[];
  technicalConcepts: string[];
  possibleArchitectureAngles: string[];
}

export interface WhyYouContext {
  industryEvent: string;
  personalExperience: ExperienceEvidence[];
  architectureDecision?: string;
  technicalInterpretation: string;
  proof: EvidenceProvenance[];
  careerSignal: string;
}

export interface WritingContext {
  event: any;
  engineeringProblem: string;
  personalExperience: ExperienceEvidence[];
  architectureDecision: {
    options: string[];
    chosen: string;
    rejected: string[];
    reason: string;
  };
  evidence: EvidenceProvenance[];
  result?: {
    metric: string;
    before?: string;
    after?: string;
  };
  audience: AudiencePersona;
  format: FormatStyle;
  previousFormats: FormatStyle[];
  previousHooks: string[];
  previousVisualTypes: VisualType[];
}

export interface MultiDimensionalVisualRecord {
  id: string;
  topicTitle: string;
  visualType: VisualType;
  visualConcept: string;
  composition: string;
  layout: string;
  subject: string;
  metaphor: string;
  diagramStructure: string;
  colorStructure: string;
  visualHash: string;
  createdAt: string;
}

export interface DailyIntelligenceSummary {
  signalsScanned: number;
  verifiedEvents: number;
  freshEvents: number;
  novelOpportunities: number;
  experienceMatches: number;
  careerQualified: number;
  winnerTitle?: string;
  scores?: CandidateOpportunityScores;
  whyWinner?: string;
}

export interface CandidateOpportunityRecord {
  candidateId: string;
  title: string;
  category: string;
  framework?: string;
  engineeringProblem?: string;
  scores: CandidateOpportunityScores;
  noveltyScore: number;
  freshnessScore: number;
  experienceMatchScore: number;
  careerScore: number;
  sourceAuthorityScore: number;
  contentGapScore: number;
  trendVelocityScore: number;
  proofAvailabilityScore: number;
  engineeringTensionScore: number;
  careerDifferentiationScore: number;
  rejectionReasons: string[];
}

export interface Top5MatrixResult {
  winner: CandidateOpportunityRecord;
  alternatives: CandidateOpportunityRecord[];
  whyWinner: string;
  whyNotCandidate2?: string;
  whyNotCandidate3?: string;
  whyNotCandidate4?: string;
  whyNotCandidate5?: string;
}

export interface QualityGateResult {
  gateName?: string;
  passed: boolean;
  score?: number;
  threshold?: number;
  details?: string;
  topicNovelty?: number;
  trendFreshness?: number;
  humanWriting?: number;
  technicalDepth?: number;
  careerSignal?: number;
  sourceAuthority?: number;
  visualNovelty?: number;
  originality?: number;
  experienceMatch?: number;
  contextDiversity?: number;
  proofAvailability?: number;
  engineeringTension?: number;
  careerDifferentiation?: number;
  overallContentQualityScore?: number;
  rejectionReasons?: string[];
}

export interface PipelineExecutionTrace {
  runId: string;
  timestamp: string;
  candidatesCollected: number;
  candidatePipeline: {
    afterDeduplication: number;
    afterVerification: number;
    afterFreshness: number;
    afterCooldown: number;
    afterExperienceMatch: number;
    topFive: number;
  };
  winner: {
    title: string;
    score: number;
  };
  alternatives: CandidateOpportunityRecord[];
  whyWinner: string;
  writing: {
    format: string;
    hookType: string;
    starStructure: boolean;
  };
  visual: {
    type: string;
    noveltyScore: number;
  };
  quality: QualityGateResult;
  decision: "PUBLISH" | "NO_POST_TODAY";
}

export type VisualPlan = VisualPlanBlueprint;

export type DailyGenerationResult =
  | {
      status: "POST_READY";
      pipelineId: string;
      topic: Topic;
      writingContext: WritingContext;
      linkedInPost: LinkedInPostPayload;
      devToArticle: DevToArticlePayload;
      visualPlan: VisualPlan;
      qualityGateResult?: QualityGateResult;
      executionTrace: PipelineExecutionTrace;
      dailyIntelligenceSummary: DailyIntelligenceSummary;
      review?: any;
      publishResult?: any;
      originality?: any;
      techReview?: any;
      factCheck?: any;
      decisionGate?: any;
    }
  | {
      status: "NO_POST_TODAY";
      pipelineId: string;
      reason: string;
      candidatesEvaluated: number;
      strongestCandidate?: CandidateOpportunityRecord;
      missingSignals: string[];
      dailyIntelligenceSummary: DailyIntelligenceSummary;
      topic?: Topic | null;
      linkedInPost?: null;
      devToArticle?: null;
      qualityGateResult?: QualityGateResult;
      executionTrace?: PipelineExecutionTrace;
      review?: any;
      decisionGate?: any;
      factCheck?: any;
    };

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

export interface TechnicalCredibilityResult {
  passed: boolean;
  evidenceFound: boolean;
  unsupportedClaimsCount: number;
  benchmarkClaimsVerified: boolean;
  architectureClaimsVerified: boolean;
  firstPersonClaimsVerified: boolean;
  interviewDefensePassed: boolean;
  evidenceAuthenticityScore: number; // 0 - 100
  flaggedPhrases: string[];
  rejectionReasons: string[];
  suggestedRewrites: Array<{ original: string; suggested: string; reason: string }>;
}

export const DecisionGateResultSchema = z.object({
  approvedForPublishing: z.boolean(),
  decision: z.enum(["PUBLISH", "REGENERATE", "REJECT"]),
  gateCheckResults: z.object({
    topicFreshnessPassed: z.boolean(),
    technicalAccuracyPassed: z.boolean(),
    credibilityGatePassed: z.boolean().optional(),
    evidenceAuthenticityPassed: z.boolean().optional(),
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
  weightedScores: z.object({
    evidenceAuthenticity: z.number(), // 30%
    technicalAccuracy: z.number(),     // 20%
    personalExperience: z.number(),   // 15%
    engineeringDepth: z.number(),     // 15%
    storytelling: z.number(),         // 10%
    recruiterValue: z.number(),       // 5%
    engagementPotential: z.number(),  // 5%
    totalScore: z.number(),
  }).optional(),
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

export enum StoryMode {
  FAILURE_STORY = "FAILURE_STORY",
  DECISION_STORY = "DECISION_STORY",
  DEBUGGING_STORY = "DEBUGGING_STORY",
  PERFORMANCE_STORY = "PERFORMANCE_STORY",
  ARCHITECTURE_STORY = "ARCHITECTURE_STORY",
  BUILD_IN_PUBLIC = "BUILD_IN_PUBLIC",
  TECH_DISCOVERY = "TECH_DISCOVERY",
  CONTRARIAN_OBSERVATION = "CONTRARIAN_OBSERVATION",
  BEFORE_AFTER = "BEFORE_AFTER",
  PRODUCTION_REALITY = "PRODUCTION_REALITY",
}

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
  writingQualityScore: z.lazy(() => WritingQualityScoreSchema.optional()),
  storyMode: z.nativeEnum(StoryMode).optional(),
  formatStyle: z.nativeEnum(FormatStyle).optional(),
  starStory: z.lazy(() => STARStorySchema.optional()),
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
  evidenceAuthenticityScore?: number; // 30%
  technicalAccuracyScore: number;     // 20%
  personalExperienceScore?: number;   // 15%
  engineeringDepthScore?: number;     // 15%
  storytellingScore?: number;         // 10%
  recruiterValueScore?: number;       // 5%
  engagementPotentialScore?: number;  // 5%
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
  problem?: string;
  context?: string;
  action?: string;
  decision?: string;
  result?: string;
  evidence?: string[];
  technologies?: string[];
}

export interface AudiencePersona {
  role: string;
  relevanceReason: string;
  targetPainPoints?: string[];
  keyMotivations?: string[];
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

// ==========================================
// SENIOR SOFTWARE ENGINEER WRITING AGENT TYPES
// ==========================================

export enum HookType {
  ENGINEERING_OBSERVATION = "ENGINEERING_OBSERVATION",
  UNEXPECTED_FAILURE = "UNEXPECTED_FAILURE",
  ARCHITECTURE_QUESTION = "ARCHITECTURE_QUESTION",
  CONTRARIAN_OBSERVATION = "CONTRARIAN_OBSERVATION",
  BUILD_EXPERIENCE = "BUILD_EXPERIENCE",
  NEW_TECHNOLOGY = "NEW_TECHNOLOGY",
  DEBUGGING_STORY = "DEBUGGING_STORY",
  TRADEOFF = "TRADEOFF",
  PERFORMANCE = "PERFORMANCE",
  ARCHITECTURE_BOUNDARY = "ARCHITECTURE_BOUNDARY",
}

export enum DiscussionCtaType {
  TRADEOFF_CHOICE = "TRADEOFF_CHOICE",
  BOUNDARY_QUESTION = "BOUNDARY_QUESTION",
  PRODUCTION_FAILURE_CHECK = "PRODUCTION_FAILURE_CHECK",
  OPTIMIZATION_PRIORITY = "OPTIMIZATION_PRIORITY",
  DESIGN_CHANGE = "DESIGN_CHANGE",
  TEAM_PRACTICE = "TEAM_PRACTICE",
}

export const STARStorySchema = z.object({
  situation: z.object({
    context: z.string(),
    trigger: z.string(),
    stakes: z.string().optional(),
    curiosityTension: z.string().optional(),
  }),
  task: z.object({
    objective: z.string(),
    constraints: z.array(z.string()),
    successCriteria: z.array(z.string()).optional(),
  }),
  action: z.object({
    approachesConsidered: z.array(z.string()),
    chosenApproach: z.string(),
    rejectedApproaches: z.array(z.string()).optional(),
    reasoning: z.string(),
    decisionMoment: z.string().optional(),
    implementation: z.string().optional(),
    debugging: z.string().optional(),
  }),
  result: z.object({
    outcome: z.string(),
    metrics: z.array(z.string()).optional(),
    evidence: z.array(z.string()),
  }),
  insight: z.object({
    engineeringLesson: z.string(),
    tradeoffs: z.array(z.string()),
    whenNotToUse: z.array(z.string()).optional(),
  }),
});
export type STARStory = z.infer<typeof STARStorySchema>;

export const BoredomScoreSchema = z.object({
  structuralRepetition: z.number().min(0).max(100),
  hookRepetition: z.number().min(0).max(100),
  vocabularyRepetition: z.number().min(0).max(100),
  topicRepetition: z.number().min(0).max(100),
  ctaRepetition: z.number().min(0).max(100),
  narrativePredictability: z.number().min(0).max(100),
  genericness: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
});
export type BoredomScore = z.infer<typeof BoredomScoreSchema>;

export const StoryQualityScoreSchema = z.object({
  curiosity: z.number().min(0).max(100),
  tension: z.number().min(0).max(100),
  specificity: z.number().min(0).max(100),
  decisionQuality: z.number().min(0).max(100),
  technicalDepth: z.number().min(0).max(100),
  resultStrength: z.number().min(0).max(100),
  authenticity: z.number().min(0).max(100),
  seniority: z.number().min(0).max(100),
  starCompleteness: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
});
export type StoryQualityScore = z.infer<typeof StoryQualityScoreSchema>;

export const WritingQualityScoreSchema = z.object({
  clarity: z.number().min(0).max(100),
  technicalDepth: z.number().min(0).max(100),
  seniority: z.number().min(0).max(100),
  authenticity: z.number().min(0).max(100),
  originality: z.number().min(0).max(100),
  narrativeQuality: z.number().min(0).max(100),
  evidenceQuality: z.number().min(0).max(100),
  readability: z.number().min(0).max(100),
  careerSignal: z.number().min(0).max(100),
  discussionPotential: z.number().min(0).max(100),
  aiClicheScore: z.number().min(0).max(100),
  evidenceAuthenticityScore: z.number().min(0).max(100).optional(),
  personalExperienceScore: z.number().min(0).max(100).optional(),
  engineeringDepthScore: z.number().min(0).max(100).optional(),
  storytellingScore: z.number().min(0).max(100).optional(),
  recruiterValueScore: z.number().min(0).max(100).optional(),
  engagementPotentialScore: z.number().min(0).max(100).optional(),
  weightedTotalScore: z.number().min(0).max(100).optional(),
  overall: z.number().min(0).max(100),
  boredomScore: BoredomScoreSchema.optional(),
  storyQualityScore: StoryQualityScoreSchema.optional(),
});
export type WritingQualityScore = z.infer<typeof WritingQualityScoreSchema>;

export const VisualNarrativeSchema = z.object({
  coreConcept: z.string(),
  primaryFlow: z.string(),
  importantComponents: z.array(z.string()),
  relationships: z.array(z.string()),
  keyLabels: z.array(z.string()),
  visualType: z.string(),
});
export type VisualNarrative = z.infer<typeof VisualNarrativeSchema>;

export const SeniorEngineeringPostSchema = z.object({
  platform: z.nativeEnum(Platform).default(Platform.LINKEDIN),
  title: z.string(),
  hook: z.string(),
  hookType: z.string(),
  body: z.string(),
  storyAngle: z.string(),
  engineeringProblem: z.string(),
  technicalInsight: z.string(),
  tradeoffs: z.array(z.string()),
  evidence: z.array(z.string()),
  personalExperience: z.string(),
  discussionAngle: z.string(),
  hashtags: z.array(z.string()),
  sourceReferences: z.array(z.string()),
  fullText: z.string(),
  visualNarrative: VisualNarrativeSchema.optional(),
  writingQualityScore: WritingQualityScoreSchema.optional(),
  storyMode: z.nativeEnum(StoryMode).optional(),
  formatStyle: z.nativeEnum(FormatStyle).optional(),
  starStory: STARStorySchema.optional(),
});
export type SeniorEngineeringPost = z.infer<typeof SeniorEngineeringPostSchema>;

export const SeniorEngineeringArticleSchema = z.object({
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  canonicalUrl: z.string().optional(),
  architecture: z.string(),
  mermaidDiagram: z.string().optional(),
  codeExamples: z.array(
    z.object({
      language: z.string(),
      code: z.string(),
      explanation: z.string(),
    })
  ),
  tradeoffs: z.array(z.string()),
  sources: z.array(z.string()),
  markdownContent: z.string(),
  writingQualityScore: WritingQualityScoreSchema.optional(),
});
export type SeniorEngineeringArticle = z.infer<typeof SeniorEngineeringArticleSchema>;

export interface WritingMemoryEntry {
  id: string;
  timestamp: string;
  topic: string;
  category: string;
  framework?: string;
  hook: string;
  hookType: HookType | string;
  storyAngle: ContentAngle | string;
  narrativePattern: NarrativePattern;
  ctaType: DiscussionCtaType | string;
  ctaText: string;
  vocabulary: string[];
  writingQualityScore: WritingQualityScore;
  storyMode?: StoryMode | string;
  formatStyle?: FormatStyle | string;
  openingStyle?: string;
  starStory?: STARStory;
  boredomScore?: BoredomScore;
}

// ==========================================
// VISUAL INTELLIGENCE & RAG TYPES
// ==========================================

export enum VisualFormat {
  ARCHITECTURE_DIAGRAM = "ARCHITECTURE_DIAGRAM",
  BEFORE_AFTER_COMPARISON = "BEFORE_AFTER_COMPARISON",
  DEBUGGING_TIMELINE = "DEBUGGING_TIMELINE",
  DECISION_MATRIX = "DECISION_MATRIX",
  PERFORMANCE_BENCHMARK = "PERFORMANCE_BENCHMARK",
  SYSTEM_FLOW = "SYSTEM_FLOW",
  SEQUENCE_DIAGRAM = "SEQUENCE_DIAGRAM",
  INCIDENT_TIMELINE = "INCIDENT_TIMELINE",
  CONCEPT_MAP = "CONCEPT_MAP",
  CODE_BLUEPRINT = "CODE_BLUEPRINT",
  TECHNICAL_ILLUSTRATION = "TECHNICAL_ILLUSTRATION",
  SYSTEM_COMPARISON = "SYSTEM_COMPARISON",
  MINIMAL_TYPOGRAPHY = "MINIMAL_TYPOGRAPHY",
  BUILD_PROGRESS = "BUILD_PROGRESS",
  INFRASTRUCTURE_MAP = "INFRASTRUCTURE_MAP",
  DATA_FLOW = "DATA_FLOW",
  AGENT_WORKFLOW = "AGENT_WORKFLOW",
  MODEL_COMPARISON = "MODEL_COMPARISON",
  FAILURE_RECOVERY_MAP = "FAILURE_RECOVERY_MAP",
  TELEMETRY_DASHBOARD = "TELEMETRY_DASHBOARD",
}

export enum VisualComposition {
  CENTERED = "CENTERED",
  SPLIT_SCREEN = "SPLIT_SCREEN",
  LEFT_TO_RIGHT = "LEFT_TO_RIGHT",
  TOP_TO_BOTTOM = "TOP_TO_BOTTOM",
  PIPELINE = "PIPELINE",
  LAYERED_ARCHITECTURE = "LAYERED_ARCHITECTURE",
  SIDE_BY_SIDE = "SIDE_BY_SIDE",
  TIMELINE = "TIMELINE",
  BEFORE_AFTER = "BEFORE_AFTER",
  DECISION_TREE = "DECISION_TREE",
  FLOWCHART = "FLOWCHART",
}

export enum VisualDensity {
  MINIMAL = "MINIMAL",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum VisualPurpose {
  EXPLAIN = "EXPLAIN",
  COMPARE = "COMPARE",
  DEMONSTRATE = "DEMONSTRATE",
  TELL_STORY = "TELL_STORY",
  EXPOSE_PROBLEM = "EXPOSE_PROBLEM",
  SHOW_ARCHITECTURE = "SHOW_ARCHITECTURE",
  SHOW_PERFORMANCE = "SHOW_PERFORMANCE",
  SUMMARIZE_RESEARCH = "SUMMARIZE_RESEARCH",
}

export enum ColorStyle {
  LIGHT_TECHNICAL_BLUEPRINT = "LIGHT_TECHNICAL_BLUEPRINT",
  DARK_CONTRAST = "DARK_CONTRAST",
  MONOCHROME_ARCHITECTURE = "MONOCHROME_ARCHITECTURE",
  NEUTRAL_DOCUMENTATION = "NEUTRAL_DOCUMENTATION",
  GREEN_TERMINAL = "GREEN_TERMINAL",
  WARM_EDITORIAL = "WARM_EDITORIAL",
  HIGH_CONTRAST_DIAGRAM = "HIGH_CONTRAST_DIAGRAM",
}

export const VisualRAGPatternSchema = z.object({
  id: z.string(),
  sourcePlatform: z.string(),
  author: z.string().optional(),
  topic: z.string(),
  technicalCategory: z.string(),
  visualType: z.nativeEnum(VisualFormat),
  composition: z.nativeEnum(VisualComposition),
  layout: z.string(),
  informationDensity: z.nativeEnum(VisualDensity),
  purpose: z.nativeEnum(VisualPurpose),
  style: z.nativeEnum(ColorStyle),
  engagementSignal: z.enum(["HIGH", "MEDIUM", "VIRAL"]),
  keyElements: z.array(z.string()),
});
export type VisualRAGPattern = z.infer<typeof VisualRAGPatternSchema>;

export const RecentVisualMemoryEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  topic: z.string(),
  category: z.string(),
  visualFormat: z.nativeEnum(VisualFormat),
  composition: z.nativeEnum(VisualComposition),
  layout: z.string(),
  colorStyle: z.nativeEnum(ColorStyle),
  promptHash: z.string(),
  imageHash: z.string(),
  visualRepetitionScore: z.number().min(0).max(100),
  visualStoryAlignmentScore: z.number().min(0).max(100),
});
export type RecentVisualMemoryEntry = z.infer<typeof RecentVisualMemoryEntrySchema>;

export const VisualQualityScoreSchema = z.object({
  storyAlignment: z.number().min(0).max(100),
  technicalClarity: z.number().min(0).max(100),
  readability: z.number().min(0).max(100),
  clutterLevel: z.number().min(0).max(100),
  genericnessScore: z.number().min(0).max(100),
  repetitionScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  passed: z.boolean(),
  rejectionReasons: z.array(z.string()),
});
export type VisualQualityScore = z.infer<typeof VisualQualityScoreSchema>;

export const StructuredImagePromptSchema = z.object({
  subject: z.string(),
  story: z.string(),
  visualFormat: z.nativeEnum(VisualFormat),
  composition: z.nativeEnum(VisualComposition),
  keyElements: z.array(z.string()),
  style: z.nativeEnum(ColorStyle),
  purpose: z.nativeEnum(VisualPurpose),
  negativePrompt: z.string(),
});
export type StructuredImagePrompt = z.infer<typeof StructuredImagePromptSchema>;

export const VisualIntelligenceOutputSchema = z.object({
  topicTitle: z.string(),
  visualFormat: z.nativeEnum(VisualFormat),
  composition: z.nativeEnum(VisualComposition),
  density: z.nativeEnum(VisualDensity),
  purpose: z.nativeEnum(VisualPurpose),
  colorStyle: z.nativeEnum(ColorStyle),
  structuredPrompt: StructuredImagePromptSchema,
  linkedInImageBlueprint: z.any(),
  devToImageBlueprint: z.any(),
  visualStoryAlignmentScore: z.number().min(0).max(100),
  visualRepetitionScore: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  ragReferences: z.array(z.string()),
});
export type VisualIntelligenceOutput = z.infer<typeof VisualIntelligenceOutputSchema>;

export * from "./notification-service";

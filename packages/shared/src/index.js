"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualIntelligenceOutputSchema = exports.StructuredImagePromptSchema = exports.VisualQualityScoreSchema = exports.RecentVisualMemoryEntrySchema = exports.VisualRAGPatternSchema = exports.ColorStyle = exports.VisualPurpose = exports.VisualDensity = exports.VisualComposition = exports.VisualFormat = exports.SeniorEngineeringArticleSchema = exports.SeniorEngineeringPostSchema = exports.VisualNarrativeSchema = exports.WritingQualityScoreSchema = exports.StoryQualityScoreSchema = exports.BoredomScoreSchema = exports.STARStorySchema = exports.DiscussionCtaType = exports.HookType = exports.DEFAULT_SCORING_WEIGHTS = exports.AIGatewayRequestSchema = exports.DevToArticlePayloadSchema = exports.MediumArticlePayloadSchema = exports.LinkedInPostPayloadSchema = exports.StoryMode = exports.ContentEvaluationSchema = exports.FactVerificationSchema = exports.ResearchOutputSchema = exports.DecisionGateResultSchema = exports.VisualValidationResultSchema = exports.OriginalityCheckResultSchema = exports.ExperienceLogSchema = exports.HistoricalPostRecordSchema = exports.TopicSchema = exports.TARGET_AUDIENCES = exports.CONTENT_DIVERSITY_CATEGORIES = exports.AgentEvent = exports.AgentType = exports.RoutingStrategy = exports.FormatStyle = exports.VisualType = exports.SourceAuthorityLevel = exports.ModelProvider = exports.PostStatus = exports.PublishMode = exports.Platform = void 0;
const zod_1 = require("zod");
__exportStar(require("./notification-service"), exports);
// ==========================================
// ENUMS & CONSTANTS
// ==========================================
var Platform;
(function (Platform) {
    Platform["LINKEDIN"] = "LINKEDIN";
    Platform["MEDIUM"] = "MEDIUM";
    Platform["DEVTO"] = "DEVTO";
    Platform["HASHNODE"] = "HASHNODE";
    Platform["X_TWITTER"] = "X_TWITTER";
})(Platform || (exports.Platform = Platform = {}));
var PublishMode;
(function (PublishMode) {
    PublishMode["LIVE"] = "LIVE";
    PublishMode["SIMULATION"] = "SIMULATION";
    PublishMode["AUTO"] = "AUTO";
})(PublishMode || (exports.PublishMode = PublishMode = {}));
var PostStatus;
(function (PostStatus) {
    PostStatus["DRAFT"] = "DRAFT";
    PostStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    PostStatus["APPROVED"] = "APPROVED";
    PostStatus["SCHEDULED"] = "SCHEDULED";
    PostStatus["PUBLISHING"] = "PUBLISHING";
    PostStatus["PUBLISHED"] = "PUBLISHED";
    PostStatus["FAILED"] = "FAILED";
    PostStatus["REJECTED"] = "REJECTED";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
var ModelProvider;
(function (ModelProvider) {
    ModelProvider["OPENAI"] = "OPENAI";
    ModelProvider["GEMINI"] = "GEMINI";
    ModelProvider["ANTHROPIC"] = "ANTHROPIC";
    ModelProvider["OPENROUTER"] = "OPENROUTER";
    ModelProvider["NVIDIA_NIM"] = "NVIDIA_NIM";
    ModelProvider["OLLAMA"] = "OLLAMA";
})(ModelProvider || (exports.ModelProvider = ModelProvider = {}));
var SourceAuthorityLevel;
(function (SourceAuthorityLevel) {
    SourceAuthorityLevel[SourceAuthorityLevel["LEVEL_1_ADVANCED"] = 1] = "LEVEL_1_ADVANCED";
    SourceAuthorityLevel[SourceAuthorityLevel["LEVEL_1_PRIMARY"] = 1] = "LEVEL_1_PRIMARY";
    SourceAuthorityLevel[SourceAuthorityLevel["LEVEL_2_SECONDARY"] = 2] = "LEVEL_2_SECONDARY";
    SourceAuthorityLevel[SourceAuthorityLevel["LEVEL_2_TECHNICAL"] = 2] = "LEVEL_2_TECHNICAL";
    SourceAuthorityLevel[SourceAuthorityLevel["LEVEL_3_COMMUNITY"] = 3] = "LEVEL_3_COMMUNITY";
    SourceAuthorityLevel[SourceAuthorityLevel["LEVEL_4_DISCOVERY"] = 4] = "LEVEL_4_DISCOVERY";
})(SourceAuthorityLevel || (exports.SourceAuthorityLevel = SourceAuthorityLevel = {}));
var VisualType;
(function (VisualType) {
    VisualType["ARCHITECTURE_DIAGRAM"] = "ARCHITECTURE_DIAGRAM";
    VisualType["SYSTEM_FLOW"] = "SYSTEM_FLOW";
    VisualType["DEBUGGING_TIMELINE"] = "DEBUGGING_TIMELINE";
    VisualType["BENCHMARK_CHART"] = "BENCHMARK_CHART";
    VisualType["CODE_ANNOTATION"] = "CODE_ANNOTATION";
    VisualType["DATA_FLOW"] = "DATA_FLOW";
    VisualType["BEFORE_AFTER_ARCHITECTURE"] = "BEFORE_AFTER_ARCHITECTURE";
    VisualType["DECISION_MATRIX"] = "DECISION_MATRIX";
    VisualType["FAILURE_ANALYSIS"] = "FAILURE_ANALYSIS";
    VisualType["TIMELINE"] = "TIMELINE";
    VisualType["COMPONENT_MAP"] = "COMPONENT_MAP";
    VisualType["DISTRIBUTED_SYSTEM_DIAGRAM"] = "DISTRIBUTED_SYSTEM_DIAGRAM";
    VisualType["CONCEPTUAL_ILLUSTRATION"] = "CONCEPTUAL_ILLUSTRATION";
    VisualType["TECHNICAL_COMPARISON"] = "TECHNICAL_COMPARISON";
    VisualType["MINIMAL_ENGINEERING_POSTER"] = "MINIMAL_ENGINEERING_POSTER";
})(VisualType || (exports.VisualType = VisualType = {}));
var FormatStyle;
(function (FormatStyle) {
    FormatStyle["PRODUCTION_INCIDENT"] = "PRODUCTION_INCIDENT";
    FormatStyle["DEBUGGING_STORY"] = "DEBUGGING_STORY";
    FormatStyle["ARCHITECTURE_DECISION"] = "ARCHITECTURE_DECISION";
    FormatStyle["BEFORE_AFTER_LAYOUT"] = "BEFORE_AFTER_LAYOUT";
    FormatStyle["PERFORMANCE_INVESTIGATION"] = "PERFORMANCE_INVESTIGATION";
    FormatStyle["FAILED_EXPERIMENT"] = "FAILED_EXPERIMENT";
    FormatStyle["TRADEOFF_DEBATE"] = "TRADEOFF_DEBATE";
    FormatStyle["BUILD_IN_PUBLIC"] = "BUILD_IN_PUBLIC";
    FormatStyle["SYSTEM_DESIGN_BREAKDOWN"] = "SYSTEM_DESIGN_BREAKDOWN";
    FormatStyle["TECHNICAL_MYTH"] = "TECHNICAL_MYTH";
    FormatStyle["CODE_WALKTHROUGH"] = "CODE_WALKTHROUGH";
    FormatStyle["ENGINEERING_RETROSPECTIVE"] = "ENGINEERING_RETROSPECTIVE";
    FormatStyle["NEW_TECH_PERSONAL_EXPERIMENT"] = "NEW_TECH_PERSONAL_EXPERIMENT";
    FormatStyle["BENCHMARK_ANALYSIS"] = "BENCHMARK_ANALYSIS";
    FormatStyle["ARCHITECTURE_EVOLUTION"] = "ARCHITECTURE_EVOLUTION";
    // Legacy fallback aliases
    FormatStyle["NARRATIVE_PARAGRAPHS"] = "NARRATIVE_PARAGRAPHS";
    FormatStyle["MINIMAL_BULLETS"] = "MINIMAL_BULLETS";
    FormatStyle["SHORT_DIALOGUE"] = "SHORT_DIALOGUE";
    FormatStyle["TECHNICAL_NOTE"] = "TECHNICAL_NOTE";
    FormatStyle["STORY_FIRST"] = "STORY_FIRST";
    FormatStyle["ARCHITECTURE_FIRST"] = "ARCHITECTURE_FIRST";
})(FormatStyle || (exports.FormatStyle = FormatStyle = {}));
var RoutingStrategy;
(function (RoutingStrategy) {
    RoutingStrategy["COST_OPTIMIZED"] = "COST_OPTIMIZED";
    RoutingStrategy["LOWEST_LATENCY"] = "LOWEST_LATENCY";
    RoutingStrategy["ACCURACY_FIRST"] = "ACCURACY_FIRST";
    RoutingStrategy["BALANCED"] = "BALANCED";
})(RoutingStrategy || (exports.RoutingStrategy = RoutingStrategy = {}));
var AgentType;
(function (AgentType) {
    // Master Personal Brand Intelligence Agents
    AgentType["TREND_DISCOVERY"] = "TREND_DISCOVERY";
    AgentType["TOPIC_INTELLIGENCE"] = "TOPIC_INTELLIGENCE";
    AgentType["CONTENT_GAP"] = "CONTENT_GAP";
    AgentType["AUDIENCE_RESEARCH"] = "AUDIENCE_RESEARCH";
    AgentType["PERSONAL_BRAND_STRATEGY"] = "PERSONAL_BRAND_STRATEGY";
    AgentType["TECHNICAL_RESEARCH"] = "TECHNICAL_RESEARCH";
    AgentType["KNOWLEDGE_GRAPH"] = "KNOWLEDGE_GRAPH";
    AgentType["EXPERIENCE_MINING"] = "EXPERIENCE_MINING";
    AgentType["TECHNICAL_WRITER"] = "TECHNICAL_WRITER";
    AgentType["STORYTELLING"] = "STORYTELLING";
    AgentType["HUMANIZATION"] = "HUMANIZATION";
    AgentType["TECHNICAL_REVIEWER"] = "TECHNICAL_REVIEWER";
    AgentType["ORIGINALITY"] = "ORIGINALITY";
    AgentType["SEO_AND_ENGAGEMENT"] = "SEO_AND_ENGAGEMENT";
    AgentType["VISUAL_PLANNING"] = "VISUAL_PLANNING";
    AgentType["VISUAL_INTELLIGENCE"] = "VISUAL_INTELLIGENCE";
    AgentType["VISUAL_REVIEWER"] = "VISUAL_REVIEWER";
    AgentType["IMAGE_RELEVANCE_CHECK"] = "IMAGE_RELEVANCE_CHECK";
    AgentType["POST_HISTORY_DEDUPLICATION"] = "POST_HISTORY_DEDUPLICATION";
    AgentType["LINKEDIN_ALGORITHM_AUDITOR"] = "LINKEDIN_ALGORITHM_AUDITOR";
    AgentType["LINKEDIN_COMMENT_DRAFTER"] = "LINKEDIN_COMMENT_DRAFTER";
    AgentType["PUBLISHER"] = "PUBLISHER";
    AgentType["CONTINUOUS_LEARNING"] = "CONTINUOUS_LEARNING";
    AgentType["DECISION_GATE"] = "DECISION_GATE";
    // Backward compatibility aliases
    AgentType["RESEARCH"] = "RESEARCH";
    AgentType["SOURCE_VERIFICATION"] = "SOURCE_VERIFICATION";
    AgentType["KNOWLEDGE_EXTRACTION"] = "KNOWLEDGE_EXTRACTION";
    AgentType["FACT_VERIFICATION"] = "FACT_VERIFICATION";
    AgentType["WRITING_STYLE"] = "WRITING_STYLE";
    AgentType["CONTENT_STRATEGY"] = "CONTENT_STRATEGY";
    AgentType["LINKEDIN_GENERATOR"] = "LINKEDIN_GENERATOR";
    AgentType["MEDIUM_WRITER"] = "MEDIUM_WRITER";
    AgentType["DEVTO_WRITER"] = "DEVTO_WRITER";
    AgentType["REVIEWER"] = "REVIEWER";
    AgentType["CRITIC"] = "CRITIC";
    AgentType["IMAGE_PROMPT_ENGINEERING"] = "IMAGE_PROMPT_ENGINEERING";
    AgentType["SEO"] = "SEO";
    AgentType["IMAGE_GENERATOR"] = "IMAGE_GENERATOR";
    AgentType["HASHTAG_GENERATOR"] = "HASHTAG_GENERATOR";
    AgentType["ANALYTICS"] = "ANALYTICS";
    AgentType["LEARNING"] = "LEARNING";
})(AgentType || (exports.AgentType = AgentType = {}));
var AgentEvent;
(function (AgentEvent) {
    AgentEvent["TREND_FOUND"] = "TrendFound";
    AgentEvent["TOPIC_EVALUATED"] = "TopicEvaluated";
    AgentEvent["CONTENT_GAP_ANALYZED"] = "ContentGapAnalyzed";
    AgentEvent["AUDIENCE_TARGETED"] = "AudienceTargeted";
    AgentEvent["RESEARCH_COMPLETED"] = "ResearchCompleted";
    AgentEvent["KNOWLEDGE_MAPPED"] = "KnowledgeMapped";
    AgentEvent["EXPERIENCE_MINED"] = "ExperienceMined";
    AgentEvent["FACT_VERIFIED"] = "FactVerified";
    AgentEvent["CONTENT_GENERATED"] = "ContentGenerated";
    AgentEvent["HUMANIZED"] = "Humanized";
    AgentEvent["REVIEW_COMPLETED"] = "ReviewCompleted";
    AgentEvent["ORIGINALITY_PASSED"] = "OriginalityPassed";
    AgentEvent["IMAGE_RELEVANCE_VERIFIED"] = "ImageRelevanceVerified";
    AgentEvent["POST_DEDUPLICATION_PASSED"] = "PostDeduplicationPassed";
    AgentEvent["LINKEDIN_ALGORITHM_AUDITED"] = "LinkedInAlgorithmAudited";
    AgentEvent["LINKEDIN_COMMENT_DRAFTED"] = "LinkedInCommentDrafted";
    AgentEvent["APPROVED"] = "Approved";
    AgentEvent["PUBLISHED"] = "Published";
    AgentEvent["ANALYTICS_UPDATED"] = "AnalyticsUpdated";
    AgentEvent["LEARNING_UPDATED"] = "LearningUpdated";
    AgentEvent["DECISION_MADE"] = "DecisionMade";
})(AgentEvent || (exports.AgentEvent = AgentEvent = {}));
exports.CONTENT_DIVERSITY_CATEGORIES = [
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
];
exports.TARGET_AUDIENCES = [
    "Recruiters",
    "Hiring Managers",
    "CTOs",
    "Engineering Managers",
    "Founders",
    "Senior Engineers",
    "AI Engineers",
    "Full Stack Developers",
];
// ==========================================
// ZOD SCHEMAS & TYPES
// ==========================================
exports.TopicSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    title: zod_1.z.string().min(3),
    category: zod_1.z.string(),
    framework: zod_1.z.string().optional(),
    supportingTech: zod_1.z.array(zod_1.z.string()).default([]),
    score: zod_1.z.number().min(0).max(100),
    reason: zod_1.z.string(),
    trend_velocity: zod_1.z.number(),
    difficulty: zod_1.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    competition: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]),
    audience: zod_1.z.string(),
    keywords: zod_1.z.array(zod_1.z.string()),
    references: zod_1.z.array(zod_1.z.string()),
    storyAngle: zod_1.z.string().optional(),
    categoryWeight: zod_1.z.number().optional(),
});
exports.HistoricalPostRecordSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    platform: zod_1.z.nativeEnum(Platform),
    category: zod_1.z.string(),
    framework: zod_1.z.string().optional(),
    supportingTech: zod_1.z.array(zod_1.z.string()).default([]),
    keywords: zod_1.z.array(zod_1.z.string()).default([]),
    hook: zod_1.z.string(),
    writingStyle: zod_1.z.string().optional(),
    storyAngle: zod_1.z.string().optional(),
    audience: zod_1.z.string().optional(),
    cta: zod_1.z.string().optional(),
    fullText: zod_1.z.string(),
    publishedAt: zod_1.z.string(),
    engagementMetrics: zod_1.z
        .object({
        impressions: zod_1.z.number().default(0),
        reactions: zod_1.z.number().default(0),
        comments: zod_1.z.number().default(0),
        shares: zod_1.z.number().default(0),
        saves: zod_1.z.number().default(0),
        profileVisits: zod_1.z.number().default(0),
        followersGained: zod_1.z.number().default(0),
    })
        .optional(),
});
exports.ExperienceLogSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    title: zod_1.z.string(),
    category: zod_1.z.string(),
    description: zod_1.z.string(),
    technologiesUsed: zod_1.z.array(zod_1.z.string()),
    challengesFaced: zod_1.z.array(zod_1.z.string()),
    solutionApproach: zod_1.z.string(),
    tradeoffs: zod_1.z.array(zod_1.z.string()),
    keyLessons: zod_1.z.array(zod_1.z.string()),
    metricsOrOutcome: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().optional(),
});
exports.OriginalityCheckResultSchema = zod_1.z.object({
    passed: zod_1.z.boolean(),
    overallSimilarityScore: zod_1.z.number(), // 0.0 - 1.0 (threshold <= 0.35)
    semanticEmbeddingSimilarity: zod_1.z.number().optional(), // 0.0 - 1.0 semantic embedding vector score
    maxSimilarPostId: zod_1.z.string().optional(),
    maxSimilarPostTitle: zod_1.z.string().optional(),
    breakdown: zod_1.z.object({
        titleSimilarity: zod_1.z.number(),
        hookSimilarity: zod_1.z.number(),
        technologyOverlap: zod_1.z.number(),
        ctaSimilarity: zod_1.z.number(),
        structureSimilarity: zod_1.z.number(),
        semanticSimilarity: zod_1.z.number().optional(),
    }),
    rejectionReasons: zod_1.z.array(zod_1.z.string()),
});
exports.VisualValidationResultSchema = zod_1.z.object({
    alignedWithArticle: zod_1.z.boolean(),
    alignmentScore: zod_1.z.number(), // 0 - 100
    categoryMatch: zod_1.z.boolean(),
    logoAccuracyPassed: zod_1.z.boolean(),
    feedbackNotes: zod_1.z.array(zod_1.z.string()),
});
exports.DecisionGateResultSchema = zod_1.z.object({
    approvedForPublishing: zod_1.z.boolean(),
    decision: zod_1.z.enum(["PUBLISH", "REGENERATE", "REJECT"]),
    gateCheckResults: zod_1.z.object({
        topicFreshnessPassed: zod_1.z.boolean(),
        technicalAccuracyPassed: zod_1.z.boolean(),
        credibilityGatePassed: zod_1.z.boolean().optional(),
        evidenceAuthenticityPassed: zod_1.z.boolean().optional(),
        originalityPassed: zod_1.z.boolean(),
        humanTonePassed: zod_1.z.boolean(),
        audienceRelevancePassed: zod_1.z.boolean(),
        brandStrategyPassed: zod_1.z.boolean(),
        discussionPotentialPassed: zod_1.z.boolean(),
        platformOptimizationPassed: zod_1.z.boolean(),
        visualValidationPassed: zod_1.z.boolean(),
        imageRelevancePassed: zod_1.z.boolean().optional(),
        postDeduplicationPassed: zod_1.z.boolean().optional(),
        linkedinAlgorithmPassed: zod_1.z.boolean().optional(),
        seoCompletenessPassed: zod_1.z.boolean(),
    }),
    rejectionReasons: zod_1.z.array(zod_1.z.string()),
    weightedScores: zod_1.z.object({
        evidenceAuthenticity: zod_1.z.number(), // 30%
        technicalAccuracy: zod_1.z.number(), // 20%
        personalExperience: zod_1.z.number(), // 15%
        engineeringDepth: zod_1.z.number(), // 15%
        storytelling: zod_1.z.number(), // 10%
        recruiterValue: zod_1.z.number(), // 5%
        engagementPotential: zod_1.z.number(), // 5%
        totalScore: zod_1.z.number(),
    }).optional(),
    actionRequired: zod_1.z.string().optional(),
});
exports.ResearchOutputSchema = zod_1.z.object({
    topicId: zod_1.z.string(),
    summary: zod_1.z.string(),
    key_insights: zod_1.z.array(zod_1.z.string()),
    pros: zod_1.z.array(zod_1.z.string()),
    cons: zod_1.z.array(zod_1.z.string()),
    future_outlook: zod_1.z.string(),
    code_snippets: zod_1.z.array(zod_1.z.object({
        language: zod_1.z.string(),
        code: zod_1.z.string(),
        description: zod_1.z.string(),
    })),
    statistics: zod_1.z.array(zod_1.z.string()),
    citations: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        url: zod_1.z.string(),
        source: zod_1.z.string(),
    })),
});
exports.FactVerificationSchema = zod_1.z.object({
    factCheckPassed: zod_1.z.boolean(),
    confidenceScore: zod_1.z.number().min(0).max(100),
    verifiedClaims: zod_1.z.array(zod_1.z.string()),
    rejectedClaims: zod_1.z.array(zod_1.z.string()),
    rejectionReasons: zod_1.z.array(zod_1.z.string()),
    sourcesUsed: zod_1.z.array(zod_1.z.string()),
});
exports.ContentEvaluationSchema = zod_1.z.object({
    readabilityScore: zod_1.z.number().min(0).max(100),
    seoScore: zod_1.z.number().min(0).max(100),
    engagementScore: zod_1.z.number().min(0).max(100),
    noveltyScore: zod_1.z.number().min(0).max(100),
    grammarScore: zod_1.z.number().min(0).max(100),
    technicalAccuracyScore: zod_1.z.number().min(0).max(100),
    overallScore: zod_1.z.number().min(0).max(100),
    passedThreshold: zod_1.z.boolean(),
    feedbackNotes: zod_1.z.array(zod_1.z.string()),
});
var StoryMode;
(function (StoryMode) {
    StoryMode["FAILURE_STORY"] = "FAILURE_STORY";
    StoryMode["DECISION_STORY"] = "DECISION_STORY";
    StoryMode["DEBUGGING_STORY"] = "DEBUGGING_STORY";
    StoryMode["PERFORMANCE_STORY"] = "PERFORMANCE_STORY";
    StoryMode["ARCHITECTURE_STORY"] = "ARCHITECTURE_STORY";
    StoryMode["BUILD_IN_PUBLIC"] = "BUILD_IN_PUBLIC";
    StoryMode["TECH_DISCOVERY"] = "TECH_DISCOVERY";
    StoryMode["CONTRARIAN_OBSERVATION"] = "CONTRARIAN_OBSERVATION";
    StoryMode["BEFORE_AFTER"] = "BEFORE_AFTER";
    StoryMode["PRODUCTION_REALITY"] = "PRODUCTION_REALITY";
})(StoryMode || (exports.StoryMode = StoryMode = {}));
exports.LinkedInPostPayloadSchema = zod_1.z.object({
    title: zod_1.z.string(),
    hook: zod_1.z.string(),
    story: zod_1.z.string(),
    lesson: zod_1.z.string(),
    actionableInsight: zod_1.z.string(),
    cta: zod_1.z.string(),
    hashtags: zod_1.z.array(zod_1.z.string()),
    fullText: zod_1.z.string(),
    carouselSlides: zod_1.z
        .array(zod_1.z.object({
        slideNumber: zod_1.z.number(),
        title: zod_1.z.string(),
        body: zod_1.z.string(),
    }))
        .optional(),
    imageUrl: zod_1.z.string().optional(),
    writingQualityScore: zod_1.z.lazy(() => exports.WritingQualityScoreSchema.optional()),
    storyMode: zod_1.z.nativeEnum(StoryMode).optional(),
    formatStyle: zod_1.z.nativeEnum(FormatStyle).optional(),
    starStory: zod_1.z.lazy(() => exports.STARStorySchema.optional()),
});
exports.MediumArticlePayloadSchema = zod_1.z.object({
    title: zod_1.z.string(),
    subtitle: zod_1.z.string(),
    metaDescription: zod_1.z.string(),
    seoKeywords: zod_1.z.array(zod_1.z.string()),
    readingTimeMinutes: zod_1.z.number(),
    tableOfContents: zod_1.z.array(zod_1.z.string()),
    introduction: zod_1.z.string(),
    problemStatement: zod_1.z.string(),
    deepExplanation: zod_1.z.string(),
    architectureSection: zod_1.z.string(),
    codeSnippets: zod_1.z.array(zod_1.z.object({
        filename: zod_1.z.string().optional(),
        language: zod_1.z.string(),
        code: zod_1.z.string(),
        explanation: zod_1.z.string(),
    })),
    bestPractices: zod_1.z.array(zod_1.z.string()),
    faq: zod_1.z.array(zod_1.z.object({
        question: zod_1.z.string(),
        answer: zod_1.z.string(),
    })),
    conclusion: zod_1.z.string(),
    fullMarkdown: zod_1.z.string(),
    imageUrl: zod_1.z.string().optional(),
});
exports.DevToArticlePayloadSchema = zod_1.z.object({
    title: zod_1.z.string(),
    published: zod_1.z.boolean().default(false),
    tags: zod_1.z.array(zod_1.z.string()),
    series: zod_1.z.string().optional(),
    canonicalUrl: zod_1.z.string().optional(),
    description: zod_1.z.string(),
    mainImage: zod_1.z.string().optional(),
    markdownContent: zod_1.z.string(),
});
exports.AIGatewayRequestSchema = zod_1.z.object({
    prompt: zod_1.z.string(),
    systemPrompt: zod_1.z.string().optional(),
    taskType: zod_1.z.string().default("general"),
    preferredProvider: zod_1.z.nativeEnum(ModelProvider).optional(),
    model: zod_1.z.string().optional(),
    temperature: zod_1.z.number().min(0).max(2).default(0.7),
    maxTokens: zod_1.z.number().optional(),
    routingStrategy: zod_1.z.nativeEnum(RoutingStrategy).default(RoutingStrategy.COST_OPTIMIZED),
    responseSchema: zod_1.z.any().optional(),
    pipelineId: zod_1.z.string().optional(),
});
exports.DEFAULT_SCORING_WEIGHTS = {
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
// ==========================================
// SENIOR SOFTWARE ENGINEER WRITING AGENT TYPES
// ==========================================
var HookType;
(function (HookType) {
    HookType["ENGINEERING_OBSERVATION"] = "ENGINEERING_OBSERVATION";
    HookType["UNEXPECTED_FAILURE"] = "UNEXPECTED_FAILURE";
    HookType["ARCHITECTURE_QUESTION"] = "ARCHITECTURE_QUESTION";
    HookType["CONTRARIAN_OBSERVATION"] = "CONTRARIAN_OBSERVATION";
    HookType["BUILD_EXPERIENCE"] = "BUILD_EXPERIENCE";
    HookType["NEW_TECHNOLOGY"] = "NEW_TECHNOLOGY";
    HookType["DEBUGGING_STORY"] = "DEBUGGING_STORY";
    HookType["TRADEOFF"] = "TRADEOFF";
    HookType["PERFORMANCE"] = "PERFORMANCE";
    HookType["ARCHITECTURE_BOUNDARY"] = "ARCHITECTURE_BOUNDARY";
    HookType["METRIC_BREAKDOWN"] = "METRIC_BREAKDOWN";
    HookType["HARD_TRUTH"] = "HARD_TRUTH";
    HookType["CURIOSITY_GAP"] = "CURIOSITY_GAP";
    HookType["ARCHITECTURAL_PARADOX"] = "ARCHITECTURAL_PARADOX";
    HookType["BEFORE_AFTER_TRANSFORMATION"] = "BEFORE_AFTER_TRANSFORMATION";
    HookType["TELEMETRY_TRAP"] = "TELEMETRY_TRAP";
})(HookType || (exports.HookType = HookType = {}));
var DiscussionCtaType;
(function (DiscussionCtaType) {
    DiscussionCtaType["TRADEOFF_CHOICE"] = "TRADEOFF_CHOICE";
    DiscussionCtaType["BOUNDARY_QUESTION"] = "BOUNDARY_QUESTION";
    DiscussionCtaType["PRODUCTION_FAILURE_CHECK"] = "PRODUCTION_FAILURE_CHECK";
    DiscussionCtaType["OPTIMIZATION_PRIORITY"] = "OPTIMIZATION_PRIORITY";
    DiscussionCtaType["DESIGN_CHANGE"] = "DESIGN_CHANGE";
    DiscussionCtaType["TEAM_PRACTICE"] = "TEAM_PRACTICE";
})(DiscussionCtaType || (exports.DiscussionCtaType = DiscussionCtaType = {}));
exports.STARStorySchema = zod_1.z.object({
    situation: zod_1.z.object({
        context: zod_1.z.string(),
        trigger: zod_1.z.string(),
        stakes: zod_1.z.string().optional(),
        curiosityTension: zod_1.z.string().optional(),
    }),
    task: zod_1.z.object({
        objective: zod_1.z.string(),
        constraints: zod_1.z.array(zod_1.z.string()),
        successCriteria: zod_1.z.array(zod_1.z.string()).optional(),
    }),
    action: zod_1.z.object({
        approachesConsidered: zod_1.z.array(zod_1.z.string()),
        chosenApproach: zod_1.z.string(),
        rejectedApproaches: zod_1.z.array(zod_1.z.string()).optional(),
        reasoning: zod_1.z.string(),
        decisionMoment: zod_1.z.string().optional(),
        implementation: zod_1.z.string().optional(),
        debugging: zod_1.z.string().optional(),
    }),
    result: zod_1.z.object({
        outcome: zod_1.z.string(),
        metrics: zod_1.z.array(zod_1.z.string()).optional(),
        evidence: zod_1.z.array(zod_1.z.string()),
    }),
    insight: zod_1.z.object({
        engineeringLesson: zod_1.z.string(),
        tradeoffs: zod_1.z.array(zod_1.z.string()),
        whenNotToUse: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.BoredomScoreSchema = zod_1.z.object({
    structuralRepetition: zod_1.z.number().min(0).max(100),
    hookRepetition: zod_1.z.number().min(0).max(100),
    vocabularyRepetition: zod_1.z.number().min(0).max(100),
    topicRepetition: zod_1.z.number().min(0).max(100),
    ctaRepetition: zod_1.z.number().min(0).max(100),
    narrativePredictability: zod_1.z.number().min(0).max(100),
    genericness: zod_1.z.number().min(0).max(100),
    overall: zod_1.z.number().min(0).max(100),
});
exports.StoryQualityScoreSchema = zod_1.z.object({
    curiosity: zod_1.z.number().min(0).max(100),
    tension: zod_1.z.number().min(0).max(100),
    specificity: zod_1.z.number().min(0).max(100),
    decisionQuality: zod_1.z.number().min(0).max(100),
    technicalDepth: zod_1.z.number().min(0).max(100),
    resultStrength: zod_1.z.number().min(0).max(100),
    authenticity: zod_1.z.number().min(0).max(100),
    seniority: zod_1.z.number().min(0).max(100),
    starCompleteness: zod_1.z.number().min(0).max(100),
    overall: zod_1.z.number().min(0).max(100),
});
exports.WritingQualityScoreSchema = zod_1.z.object({
    clarity: zod_1.z.number().min(0).max(100),
    technicalDepth: zod_1.z.number().min(0).max(100),
    seniority: zod_1.z.number().min(0).max(100),
    authenticity: zod_1.z.number().min(0).max(100),
    originality: zod_1.z.number().min(0).max(100),
    narrativeQuality: zod_1.z.number().min(0).max(100),
    evidenceQuality: zod_1.z.number().min(0).max(100),
    readability: zod_1.z.number().min(0).max(100),
    careerSignal: zod_1.z.number().min(0).max(100),
    discussionPotential: zod_1.z.number().min(0).max(100),
    aiClicheScore: zod_1.z.number().min(0).max(100),
    evidenceAuthenticityScore: zod_1.z.number().min(0).max(100).optional(),
    personalExperienceScore: zod_1.z.number().min(0).max(100).optional(),
    engineeringDepthScore: zod_1.z.number().min(0).max(100).optional(),
    storytellingScore: zod_1.z.number().min(0).max(100).optional(),
    recruiterValueScore: zod_1.z.number().min(0).max(100).optional(),
    engagementPotentialScore: zod_1.z.number().min(0).max(100).optional(),
    weightedTotalScore: zod_1.z.number().min(0).max(100).optional(),
    overall: zod_1.z.number().min(0).max(100),
    boredomScore: exports.BoredomScoreSchema.optional(),
    storyQualityScore: exports.StoryQualityScoreSchema.optional(),
});
exports.VisualNarrativeSchema = zod_1.z.object({
    coreConcept: zod_1.z.string(),
    primaryFlow: zod_1.z.string(),
    importantComponents: zod_1.z.array(zod_1.z.string()),
    relationships: zod_1.z.array(zod_1.z.string()),
    keyLabels: zod_1.z.array(zod_1.z.string()),
    visualType: zod_1.z.string(),
});
exports.SeniorEngineeringPostSchema = zod_1.z.object({
    platform: zod_1.z.nativeEnum(Platform).default(Platform.LINKEDIN),
    title: zod_1.z.string(),
    hook: zod_1.z.string(),
    hookType: zod_1.z.string(),
    body: zod_1.z.string(),
    storyAngle: zod_1.z.string(),
    engineeringProblem: zod_1.z.string(),
    technicalInsight: zod_1.z.string(),
    tradeoffs: zod_1.z.array(zod_1.z.string()),
    evidence: zod_1.z.array(zod_1.z.string()),
    personalExperience: zod_1.z.string(),
    discussionAngle: zod_1.z.string(),
    hashtags: zod_1.z.array(zod_1.z.string()),
    sourceReferences: zod_1.z.array(zod_1.z.string()),
    fullText: zod_1.z.string(),
    visualNarrative: exports.VisualNarrativeSchema.optional(),
    writingQualityScore: exports.WritingQualityScoreSchema.optional(),
    storyMode: zod_1.z.nativeEnum(StoryMode).optional(),
    formatStyle: zod_1.z.nativeEnum(FormatStyle).optional(),
    starStory: exports.STARStorySchema.optional(),
});
exports.SeniorEngineeringArticleSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    body: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
    canonicalUrl: zod_1.z.string().optional(),
    architecture: zod_1.z.string(),
    mermaidDiagram: zod_1.z.string().optional(),
    codeExamples: zod_1.z.array(zod_1.z.object({
        language: zod_1.z.string(),
        code: zod_1.z.string(),
        explanation: zod_1.z.string(),
    })),
    tradeoffs: zod_1.z.array(zod_1.z.string()),
    sources: zod_1.z.array(zod_1.z.string()),
    markdownContent: zod_1.z.string(),
    writingQualityScore: exports.WritingQualityScoreSchema.optional(),
});
// ==========================================
// VISUAL INTELLIGENCE & RAG TYPES
// ==========================================
var VisualFormat;
(function (VisualFormat) {
    VisualFormat["ARCHITECTURE_DIAGRAM"] = "ARCHITECTURE_DIAGRAM";
    VisualFormat["BEFORE_AFTER_COMPARISON"] = "BEFORE_AFTER_COMPARISON";
    VisualFormat["DEBUGGING_TIMELINE"] = "DEBUGGING_TIMELINE";
    VisualFormat["DECISION_MATRIX"] = "DECISION_MATRIX";
    VisualFormat["PERFORMANCE_BENCHMARK"] = "PERFORMANCE_BENCHMARK";
    VisualFormat["SYSTEM_FLOW"] = "SYSTEM_FLOW";
    VisualFormat["SEQUENCE_DIAGRAM"] = "SEQUENCE_DIAGRAM";
    VisualFormat["INCIDENT_TIMELINE"] = "INCIDENT_TIMELINE";
    VisualFormat["CONCEPT_MAP"] = "CONCEPT_MAP";
    VisualFormat["CODE_BLUEPRINT"] = "CODE_BLUEPRINT";
    VisualFormat["TECHNICAL_ILLUSTRATION"] = "TECHNICAL_ILLUSTRATION";
    VisualFormat["SYSTEM_COMPARISON"] = "SYSTEM_COMPARISON";
    VisualFormat["MINIMAL_TYPOGRAPHY"] = "MINIMAL_TYPOGRAPHY";
    VisualFormat["BUILD_PROGRESS"] = "BUILD_PROGRESS";
    VisualFormat["INFRASTRUCTURE_MAP"] = "INFRASTRUCTURE_MAP";
    VisualFormat["DATA_FLOW"] = "DATA_FLOW";
    VisualFormat["AGENT_WORKFLOW"] = "AGENT_WORKFLOW";
    VisualFormat["MODEL_COMPARISON"] = "MODEL_COMPARISON";
    VisualFormat["FAILURE_RECOVERY_MAP"] = "FAILURE_RECOVERY_MAP";
    VisualFormat["TELEMETRY_DASHBOARD"] = "TELEMETRY_DASHBOARD";
})(VisualFormat || (exports.VisualFormat = VisualFormat = {}));
var VisualComposition;
(function (VisualComposition) {
    VisualComposition["CENTERED"] = "CENTERED";
    VisualComposition["SPLIT_SCREEN"] = "SPLIT_SCREEN";
    VisualComposition["LEFT_TO_RIGHT"] = "LEFT_TO_RIGHT";
    VisualComposition["TOP_TO_BOTTOM"] = "TOP_TO_BOTTOM";
    VisualComposition["PIPELINE"] = "PIPELINE";
    VisualComposition["LAYERED_ARCHITECTURE"] = "LAYERED_ARCHITECTURE";
    VisualComposition["SIDE_BY_SIDE"] = "SIDE_BY_SIDE";
    VisualComposition["TIMELINE"] = "TIMELINE";
    VisualComposition["BEFORE_AFTER"] = "BEFORE_AFTER";
    VisualComposition["DECISION_TREE"] = "DECISION_TREE";
    VisualComposition["FLOWCHART"] = "FLOWCHART";
})(VisualComposition || (exports.VisualComposition = VisualComposition = {}));
var VisualDensity;
(function (VisualDensity) {
    VisualDensity["MINIMAL"] = "MINIMAL";
    VisualDensity["MEDIUM"] = "MEDIUM";
    VisualDensity["HIGH"] = "HIGH";
})(VisualDensity || (exports.VisualDensity = VisualDensity = {}));
var VisualPurpose;
(function (VisualPurpose) {
    VisualPurpose["EXPLAIN"] = "EXPLAIN";
    VisualPurpose["COMPARE"] = "COMPARE";
    VisualPurpose["DEMONSTRATE"] = "DEMONSTRATE";
    VisualPurpose["TELL_STORY"] = "TELL_STORY";
    VisualPurpose["EXPOSE_PROBLEM"] = "EXPOSE_PROBLEM";
    VisualPurpose["SHOW_ARCHITECTURE"] = "SHOW_ARCHITECTURE";
    VisualPurpose["SHOW_PERFORMANCE"] = "SHOW_PERFORMANCE";
    VisualPurpose["SUMMARIZE_RESEARCH"] = "SUMMARIZE_RESEARCH";
})(VisualPurpose || (exports.VisualPurpose = VisualPurpose = {}));
var ColorStyle;
(function (ColorStyle) {
    ColorStyle["LIGHT_TECHNICAL_BLUEPRINT"] = "LIGHT_TECHNICAL_BLUEPRINT";
    ColorStyle["DARK_CONTRAST"] = "DARK_CONTRAST";
    ColorStyle["MONOCHROME_ARCHITECTURE"] = "MONOCHROME_ARCHITECTURE";
    ColorStyle["NEUTRAL_DOCUMENTATION"] = "NEUTRAL_DOCUMENTATION";
    ColorStyle["GREEN_TERMINAL"] = "GREEN_TERMINAL";
    ColorStyle["WARM_EDITORIAL"] = "WARM_EDITORIAL";
    ColorStyle["HIGH_CONTRAST_DIAGRAM"] = "HIGH_CONTRAST_DIAGRAM";
})(ColorStyle || (exports.ColorStyle = ColorStyle = {}));
exports.VisualRAGPatternSchema = zod_1.z.object({
    id: zod_1.z.string(),
    sourcePlatform: zod_1.z.string(),
    author: zod_1.z.string().optional(),
    topic: zod_1.z.string(),
    technicalCategory: zod_1.z.string(),
    visualType: zod_1.z.nativeEnum(VisualFormat),
    composition: zod_1.z.nativeEnum(VisualComposition),
    layout: zod_1.z.string(),
    informationDensity: zod_1.z.nativeEnum(VisualDensity),
    purpose: zod_1.z.nativeEnum(VisualPurpose),
    style: zod_1.z.nativeEnum(ColorStyle),
    engagementSignal: zod_1.z.enum(["HIGH", "MEDIUM", "VIRAL"]),
    keyElements: zod_1.z.array(zod_1.z.string()),
});
exports.RecentVisualMemoryEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    date: zod_1.z.string(),
    topic: zod_1.z.string(),
    category: zod_1.z.string(),
    visualFormat: zod_1.z.nativeEnum(VisualFormat),
    composition: zod_1.z.nativeEnum(VisualComposition),
    layout: zod_1.z.string(),
    colorStyle: zod_1.z.nativeEnum(ColorStyle),
    promptHash: zod_1.z.string(),
    imageHash: zod_1.z.string(),
    visualRepetitionScore: zod_1.z.number().min(0).max(100),
    visualStoryAlignmentScore: zod_1.z.number().min(0).max(100),
});
exports.VisualQualityScoreSchema = zod_1.z.object({
    storyAlignment: zod_1.z.number().min(0).max(100),
    technicalClarity: zod_1.z.number().min(0).max(100),
    readability: zod_1.z.number().min(0).max(100),
    clutterLevel: zod_1.z.number().min(0).max(100),
    genericnessScore: zod_1.z.number().min(0).max(100),
    repetitionScore: zod_1.z.number().min(0).max(100),
    overallScore: zod_1.z.number().min(0).max(100),
    passed: zod_1.z.boolean(),
    rejectionReasons: zod_1.z.array(zod_1.z.string()),
});
exports.StructuredImagePromptSchema = zod_1.z.object({
    subject: zod_1.z.string(),
    story: zod_1.z.string(),
    visualFormat: zod_1.z.nativeEnum(VisualFormat),
    composition: zod_1.z.nativeEnum(VisualComposition),
    keyElements: zod_1.z.array(zod_1.z.string()),
    style: zod_1.z.nativeEnum(ColorStyle),
    purpose: zod_1.z.nativeEnum(VisualPurpose),
    negativePrompt: zod_1.z.string(),
});
exports.VisualIntelligenceOutputSchema = zod_1.z.object({
    topicTitle: zod_1.z.string(),
    visualFormat: zod_1.z.nativeEnum(VisualFormat),
    composition: zod_1.z.nativeEnum(VisualComposition),
    density: zod_1.z.nativeEnum(VisualDensity),
    purpose: zod_1.z.nativeEnum(VisualPurpose),
    colorStyle: zod_1.z.nativeEnum(ColorStyle),
    structuredPrompt: exports.StructuredImagePromptSchema,
    linkedInImageBlueprint: zod_1.z.any(),
    devToImageBlueprint: zod_1.z.any(),
    visualStoryAlignmentScore: zod_1.z.number().min(0).max(100),
    visualRepetitionScore: zod_1.z.number().min(0).max(100),
    opportunityScore: zod_1.z.number().min(0).max(100),
    ragReferences: zod_1.z.array(zod_1.z.string()),
});
__exportStar(require("./notification-service"), exports);
//# sourceMappingURL=index.js.map
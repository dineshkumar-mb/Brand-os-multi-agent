"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIGatewayRequestSchema = exports.MediumArticlePayloadSchema = exports.LinkedInPostPayloadSchema = exports.ContentEvaluationSchema = exports.FactVerificationSchema = exports.ResearchOutputSchema = exports.TopicSchema = exports.AgentEvent = exports.RoutingStrategy = exports.PostStatus = exports.AgentType = exports.ModelProvider = exports.Platform = void 0;
const zod_1 = require("zod");
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
var ModelProvider;
(function (ModelProvider) {
    ModelProvider["OPENAI"] = "OPENAI";
    ModelProvider["GEMINI"] = "GEMINI";
    ModelProvider["ANTHROPIC"] = "ANTHROPIC";
    ModelProvider["OPENROUTER"] = "OPENROUTER";
    ModelProvider["NVIDIA_NIM"] = "NVIDIA_NIM";
    ModelProvider["OLLAMA"] = "OLLAMA";
})(ModelProvider || (exports.ModelProvider = ModelProvider = {}));
var AgentType;
(function (AgentType) {
    AgentType["TREND_DISCOVERY"] = "TREND_DISCOVERY";
    AgentType["RESEARCH"] = "RESEARCH";
    AgentType["FACT_VERIFICATION"] = "FACT_VERIFICATION";
    AgentType["WRITING_STYLE"] = "WRITING_STYLE";
    AgentType["CONTENT_STRATEGY"] = "CONTENT_STRATEGY";
    AgentType["LINKEDIN_GENERATOR"] = "LINKEDIN_GENERATOR";
    AgentType["MEDIUM_WRITER"] = "MEDIUM_WRITER";
    AgentType["REVIEWER"] = "REVIEWER";
    AgentType["CRITIC"] = "CRITIC";
    AgentType["SEO"] = "SEO";
    AgentType["IMAGE_GENERATOR"] = "IMAGE_GENERATOR";
    AgentType["HASHTAG_GENERATOR"] = "HASHTAG_GENERATOR";
    AgentType["PUBLISHER"] = "PUBLISHER";
    AgentType["ANALYTICS"] = "ANALYTICS";
    AgentType["LEARNING"] = "LEARNING";
})(AgentType || (exports.AgentType = AgentType = {}));
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
var RoutingStrategy;
(function (RoutingStrategy) {
    RoutingStrategy["COST_OPTIMIZED"] = "COST_OPTIMIZED";
    RoutingStrategy["LOWEST_LATENCY"] = "LOWEST_LATENCY";
    RoutingStrategy["ACCURACY_FIRST"] = "ACCURACY_FIRST";
    RoutingStrategy["BALANCED"] = "BALANCED";
})(RoutingStrategy || (exports.RoutingStrategy = RoutingStrategy = {}));
var AgentEvent;
(function (AgentEvent) {
    AgentEvent["TREND_FOUND"] = "TrendFound";
    AgentEvent["RESEARCH_COMPLETED"] = "ResearchCompleted";
    AgentEvent["FACT_VERIFIED"] = "FactVerified";
    AgentEvent["CONTENT_GENERATED"] = "ContentGenerated";
    AgentEvent["REVIEW_COMPLETED"] = "ReviewCompleted";
    AgentEvent["APPROVED"] = "Approved";
    AgentEvent["PUBLISHED"] = "Published";
    AgentEvent["ANALYTICS_UPDATED"] = "AnalyticsUpdated";
    AgentEvent["LEARNING_UPDATED"] = "LearningUpdated";
})(AgentEvent || (exports.AgentEvent = AgentEvent = {}));
// ==========================================
// ZOD SCHEMAS & INTERFACES
// ==========================================
exports.TopicSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    title: zod_1.z.string().min(3),
    category: zod_1.z.string(),
    score: zod_1.z.number().min(0).max(100),
    reason: zod_1.z.string(),
    trend_velocity: zod_1.z.number(),
    difficulty: zod_1.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    competition: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]),
    audience: zod_1.z.string(),
    keywords: zod_1.z.array(zod_1.z.string()),
    references: zod_1.z.array(zod_1.z.string()),
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
exports.LinkedInPostPayloadSchema = zod_1.z.object({
    title: zod_1.z.string(),
    hook: zod_1.z.string(),
    story: zod_1.z.string(),
    lesson: zod_1.z.string(),
    actionableInsight: zod_1.z.string(),
    cta: zod_1.z.string(),
    hashtags: zod_1.z.array(zod_1.z.string()),
    fullText: zod_1.z.string(),
    carouselSlides: zod_1.z.array(zod_1.z.object({
        slideNumber: zod_1.z.number(),
        title: zod_1.z.string(),
        body: zod_1.z.string(),
    })).optional(),
    imageUrl: zod_1.z.string().optional(),
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
});
//# sourceMappingURL=index.js.map
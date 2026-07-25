import { z } from "zod";
export declare enum Platform {
    LINKEDIN = "LINKEDIN",
    MEDIUM = "MEDIUM",
    DEVTO = "DEVTO",
    HASHNODE = "HASHNODE",
    X_TWITTER = "X_TWITTER"
}
export declare enum ModelProvider {
    OPENAI = "OPENAI",
    GEMINI = "GEMINI",
    ANTHROPIC = "ANTHROPIC",
    OPENROUTER = "OPENROUTER",
    NVIDIA_NIM = "NVIDIA_NIM",
    OLLAMA = "OLLAMA"
}
export declare enum AgentType {
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
    LEARNING = "LEARNING"
}
export declare enum PostStatus {
    DRAFT = "DRAFT",
    PENDING_REVIEW = "PENDING_REVIEW",
    APPROVED = "APPROVED",
    SCHEDULED = "SCHEDULED",
    PUBLISHING = "PUBLISHING",
    PUBLISHED = "PUBLISHED",
    FAILED = "FAILED",
    REJECTED = "REJECTED"
}
export declare enum RoutingStrategy {
    COST_OPTIMIZED = "COST_OPTIMIZED",
    LOWEST_LATENCY = "LOWEST_LATENCY",
    ACCURACY_FIRST = "ACCURACY_FIRST",
    BALANCED = "BALANCED"
}
export declare enum AgentEvent {
    TREND_FOUND = "TrendFound",
    RESEARCH_COMPLETED = "ResearchCompleted",
    FACT_VERIFIED = "FactVerified",
    CONTENT_GENERATED = "ContentGenerated",
    REVIEW_COMPLETED = "ReviewCompleted",
    APPROVED = "Approved",
    PUBLISHED = "Published",
    ANALYTICS_UPDATED = "AnalyticsUpdated",
    LEARNING_UPDATED = "LearningUpdated"
}
export declare const TopicSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    category: z.ZodString;
    score: z.ZodNumber;
    reason: z.ZodString;
    trend_velocity: z.ZodNumber;
    difficulty: z.ZodEnum<["BEGINNER", "INTERMEDIATE", "ADVANCED"]>;
    competition: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    audience: z.ZodString;
    keywords: z.ZodArray<z.ZodString, "many">;
    references: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    category: string;
    score: number;
    reason: string;
    trend_velocity: number;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    competition: "MEDIUM" | "LOW" | "HIGH";
    audience: string;
    keywords: string[];
    references: string[];
    id?: string | undefined;
}, {
    title: string;
    category: string;
    score: number;
    reason: string;
    trend_velocity: number;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    competition: "MEDIUM" | "LOW" | "HIGH";
    audience: string;
    keywords: string[];
    references: string[];
    id?: string | undefined;
}>;
export type Topic = z.infer<typeof TopicSchema>;
export declare const ResearchOutputSchema: z.ZodObject<{
    topicId: z.ZodString;
    summary: z.ZodString;
    key_insights: z.ZodArray<z.ZodString, "many">;
    pros: z.ZodArray<z.ZodString, "many">;
    cons: z.ZodArray<z.ZodString, "many">;
    future_outlook: z.ZodString;
    code_snippets: z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        code: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        language: string;
        description: string;
    }, {
        code: string;
        language: string;
        description: string;
    }>, "many">;
    statistics: z.ZodArray<z.ZodString, "many">;
    citations: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        source: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
        source: string;
    }, {
        title: string;
        url: string;
        source: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    topicId: string;
    summary: string;
    key_insights: string[];
    pros: string[];
    cons: string[];
    future_outlook: string;
    code_snippets: {
        code: string;
        language: string;
        description: string;
    }[];
    statistics: string[];
    citations: {
        title: string;
        url: string;
        source: string;
    }[];
}, {
    topicId: string;
    summary: string;
    key_insights: string[];
    pros: string[];
    cons: string[];
    future_outlook: string;
    code_snippets: {
        code: string;
        language: string;
        description: string;
    }[];
    statistics: string[];
    citations: {
        title: string;
        url: string;
        source: string;
    }[];
}>;
export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;
export declare const FactVerificationSchema: z.ZodObject<{
    factCheckPassed: z.ZodBoolean;
    confidenceScore: z.ZodNumber;
    verifiedClaims: z.ZodArray<z.ZodString, "many">;
    rejectedClaims: z.ZodArray<z.ZodString, "many">;
    rejectionReasons: z.ZodArray<z.ZodString, "many">;
    sourcesUsed: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    factCheckPassed: boolean;
    confidenceScore: number;
    verifiedClaims: string[];
    rejectedClaims: string[];
    rejectionReasons: string[];
    sourcesUsed: string[];
}, {
    factCheckPassed: boolean;
    confidenceScore: number;
    verifiedClaims: string[];
    rejectedClaims: string[];
    rejectionReasons: string[];
    sourcesUsed: string[];
}>;
export type FactVerification = z.infer<typeof FactVerificationSchema>;
export declare const ContentEvaluationSchema: z.ZodObject<{
    readabilityScore: z.ZodNumber;
    seoScore: z.ZodNumber;
    engagementScore: z.ZodNumber;
    noveltyScore: z.ZodNumber;
    grammarScore: z.ZodNumber;
    technicalAccuracyScore: z.ZodNumber;
    overallScore: z.ZodNumber;
    passedThreshold: z.ZodBoolean;
    feedbackNotes: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    readabilityScore: number;
    seoScore: number;
    engagementScore: number;
    noveltyScore: number;
    grammarScore: number;
    technicalAccuracyScore: number;
    overallScore: number;
    passedThreshold: boolean;
    feedbackNotes: string[];
}, {
    readabilityScore: number;
    seoScore: number;
    engagementScore: number;
    noveltyScore: number;
    grammarScore: number;
    technicalAccuracyScore: number;
    overallScore: number;
    passedThreshold: boolean;
    feedbackNotes: string[];
}>;
export type ContentEvaluation = z.infer<typeof ContentEvaluationSchema>;
export declare const LinkedInPostPayloadSchema: z.ZodObject<{
    title: z.ZodString;
    hook: z.ZodString;
    story: z.ZodString;
    lesson: z.ZodString;
    actionableInsight: z.ZodString;
    cta: z.ZodString;
    hashtags: z.ZodArray<z.ZodString, "many">;
    fullText: z.ZodString;
    carouselSlides: z.ZodOptional<z.ZodArray<z.ZodObject<{
        slideNumber: z.ZodNumber;
        title: z.ZodString;
        body: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        slideNumber: number;
        body: string;
    }, {
        title: string;
        slideNumber: number;
        body: string;
    }>, "many">>;
    imageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    hook: string;
    story: string;
    lesson: string;
    actionableInsight: string;
    cta: string;
    hashtags: string[];
    fullText: string;
    carouselSlides?: {
        title: string;
        slideNumber: number;
        body: string;
    }[] | undefined;
    imageUrl?: string | undefined;
}, {
    title: string;
    hook: string;
    story: string;
    lesson: string;
    actionableInsight: string;
    cta: string;
    hashtags: string[];
    fullText: string;
    carouselSlides?: {
        title: string;
        slideNumber: number;
        body: string;
    }[] | undefined;
    imageUrl?: string | undefined;
}>;
export type LinkedInPostPayload = z.infer<typeof LinkedInPostPayloadSchema>;
export declare const MediumArticlePayloadSchema: z.ZodObject<{
    title: z.ZodString;
    subtitle: z.ZodString;
    metaDescription: z.ZodString;
    seoKeywords: z.ZodArray<z.ZodString, "many">;
    readingTimeMinutes: z.ZodNumber;
    tableOfContents: z.ZodArray<z.ZodString, "many">;
    introduction: z.ZodString;
    problemStatement: z.ZodString;
    deepExplanation: z.ZodString;
    architectureSection: z.ZodString;
    codeSnippets: z.ZodArray<z.ZodObject<{
        filename: z.ZodOptional<z.ZodString>;
        language: z.ZodString;
        code: z.ZodString;
        explanation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        language: string;
        explanation: string;
        filename?: string | undefined;
    }, {
        code: string;
        language: string;
        explanation: string;
        filename?: string | undefined;
    }>, "many">;
    bestPractices: z.ZodArray<z.ZodString, "many">;
    faq: z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        answer: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        question: string;
        answer: string;
    }, {
        question: string;
        answer: string;
    }>, "many">;
    conclusion: z.ZodString;
    fullMarkdown: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    subtitle: string;
    metaDescription: string;
    seoKeywords: string[];
    readingTimeMinutes: number;
    tableOfContents: string[];
    introduction: string;
    problemStatement: string;
    deepExplanation: string;
    architectureSection: string;
    codeSnippets: {
        code: string;
        language: string;
        explanation: string;
        filename?: string | undefined;
    }[];
    bestPractices: string[];
    faq: {
        question: string;
        answer: string;
    }[];
    conclusion: string;
    fullMarkdown: string;
}, {
    title: string;
    subtitle: string;
    metaDescription: string;
    seoKeywords: string[];
    readingTimeMinutes: number;
    tableOfContents: string[];
    introduction: string;
    problemStatement: string;
    deepExplanation: string;
    architectureSection: string;
    codeSnippets: {
        code: string;
        language: string;
        explanation: string;
        filename?: string | undefined;
    }[];
    bestPractices: string[];
    faq: {
        question: string;
        answer: string;
    }[];
    conclusion: string;
    fullMarkdown: string;
}>;
export type MediumArticlePayload = z.infer<typeof MediumArticlePayloadSchema>;
export declare const AIGatewayRequestSchema: z.ZodObject<{
    prompt: z.ZodString;
    systemPrompt: z.ZodOptional<z.ZodString>;
    taskType: z.ZodDefault<z.ZodString>;
    preferredProvider: z.ZodOptional<z.ZodNativeEnum<typeof ModelProvider>>;
    model: z.ZodOptional<z.ZodString>;
    temperature: z.ZodDefault<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    routingStrategy: z.ZodDefault<z.ZodNativeEnum<typeof RoutingStrategy>>;
    responseSchema: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    taskType: string;
    temperature: number;
    routingStrategy: RoutingStrategy;
    systemPrompt?: string | undefined;
    preferredProvider?: ModelProvider | undefined;
    model?: string | undefined;
    maxTokens?: number | undefined;
    responseSchema?: any;
}, {
    prompt: string;
    systemPrompt?: string | undefined;
    taskType?: string | undefined;
    preferredProvider?: ModelProvider | undefined;
    model?: string | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    routingStrategy?: RoutingStrategy | undefined;
    responseSchema?: any;
}>;
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
//# sourceMappingURL=index.d.ts.map
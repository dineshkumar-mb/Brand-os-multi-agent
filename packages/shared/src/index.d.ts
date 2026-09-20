import { z } from "zod";
export * from "./notification-service";
export declare enum Platform {
    LINKEDIN = "LINKEDIN",
    MEDIUM = "MEDIUM",
    DEVTO = "DEVTO",
    HASHNODE = "HASHNODE",
    X_TWITTER = "X_TWITTER"
}
export declare enum PublishMode {
    LIVE = "LIVE",
    SIMULATION = "SIMULATION",
    AUTO = "AUTO"
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
export declare enum ModelProvider {
    OPENAI = "OPENAI",
    GEMINI = "GEMINI",
    ANTHROPIC = "ANTHROPIC",
    OPENROUTER = "OPENROUTER",
    NVIDIA_NIM = "NVIDIA_NIM",
    OLLAMA = "OLLAMA"
}
export declare enum SourceAuthorityLevel {
    LEVEL_1_ADVANCED = 1,// Advanced Level: Official company labs, primary repository, official documentation
    LEVEL_1_PRIMARY = 1,// Primary Level alias
    LEVEL_2_SECONDARY = 2,// Technical publication, peer-reviewed paper, engineering blog
    LEVEL_2_TECHNICAL = 2,// Legacy alias for secondary technical sources
    LEVEL_3_COMMUNITY = 3,// Hacker News, Dev.to, Reddit engineering subs
    LEVEL_4_DISCOVERY = 4
}
export declare enum VisualType {
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
    MINIMAL_ENGINEERING_POSTER = "MINIMAL_ENGINEERING_POSTER"
}
export declare enum FormatStyle {
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
    NARRATIVE_PARAGRAPHS = "NARRATIVE_PARAGRAPHS",
    MINIMAL_BULLETS = "MINIMAL_BULLETS",
    SHORT_DIALOGUE = "SHORT_DIALOGUE",
    TECHNICAL_NOTE = "TECHNICAL_NOTE",
    STORY_FIRST = "STORY_FIRST",
    ARCHITECTURE_FIRST = "ARCHITECTURE_FIRST"
}
export declare enum RoutingStrategy {
    COST_OPTIMIZED = "COST_OPTIMIZED",
    LOWEST_LATENCY = "LOWEST_LATENCY",
    ACCURACY_FIRST = "ACCURACY_FIRST",
    BALANCED = "BALANCED"
}
export declare enum AgentType {
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
    IMAGE_RELEVANCE_CHECK = "IMAGE_RELEVANCE_CHECK",
    POST_HISTORY_DEDUPLICATION = "POST_HISTORY_DEDUPLICATION",
    LINKEDIN_ALGORITHM_AUDITOR = "LINKEDIN_ALGORITHM_AUDITOR",
    LINKEDIN_COMMENT_DRAFTER = "LINKEDIN_COMMENT_DRAFTER",
    PUBLISHER = "PUBLISHER",
    CONTINUOUS_LEARNING = "CONTINUOUS_LEARNING",
    DECISION_GATE = "DECISION_GATE",
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
    LEARNING = "LEARNING"
}
export declare enum AgentEvent {
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
    IMAGE_RELEVANCE_VERIFIED = "ImageRelevanceVerified",
    POST_DEDUPLICATION_PASSED = "PostDeduplicationPassed",
    LINKEDIN_ALGORITHM_AUDITED = "LinkedInAlgorithmAudited",
    LINKEDIN_COMMENT_DRAFTED = "LinkedInCommentDrafted",
    APPROVED = "Approved",
    PUBLISHED = "Published",
    ANALYTICS_UPDATED = "AnalyticsUpdated",
    LEARNING_UPDATED = "LearningUpdated",
    DECISION_MADE = "DecisionMade"
}
export declare const CONTENT_DIVERSITY_CATEGORIES: readonly ["AI Engineering", "Agentic AI", "MCP", "RAG", "LLMs", "React", "TypeScript", "JavaScript", "Node.js", "Express", "NestJS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "PostgreSQL", "MongoDB", "Redis", "System Design", "Distributed Systems", "DevOps", "Authentication", "Security", "Performance", "Testing", "Cloud", "Architecture", "Career Growth", "Engineering Leadership", "Open Source", "Debugging", "Productivity", "Project Walkthroughs", "Engineering Lessons"];
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
export interface ImageRelevanceResult {
    passed: boolean;
    relevanceScore: number;
    keywordMatchRate: number;
    domainAlignmentScore: number;
    starStoryVisualAlignmentScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    svgNodesInspected: number;
    rejectionReasons: string[];
}
export interface PostDeduplicationResult {
    passed: boolean;
    overallSimilarityScore: number;
    titleSimilarityScore: number;
    hookSimilarityScore: number;
    bodySemanticSimilarity: number;
    matchingPostId?: string;
    matchingPostTitle?: string;
    frameworkCooldownPassed: boolean;
    cooldownViolations: string[];
    rejectionReasons: string[];
}
export interface LinkedInAlgorithmAuditResult {
    passed: boolean;
    score: number;
    seeMoreFoldPassed: boolean;
    firstLineCharCount: number;
    hasLinkPenaltyHazard: boolean;
    externalUrlsFound: string[];
    paragraphSpacingPassed: boolean;
    maxParagraphLines: number;
    hashtagCountPassed: boolean;
    hashtagCount: number;
    characterLengthPassed: boolean;
    characterCount: number;
    rejectionReasons: string[];
    suggestions: string[];
}
export interface LinkedInCommentDraftResult {
    commentText: string;
    angle: "TECHNICAL_COUNTEREXAMPLE" | "TELEMETRY_INSIGHT" | "TRADEOFF_QUESTION" | "REINFORCE_EXPERIENCE";
    targetAudienceRole: string;
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
    imageRelevance?: number;
    postDeduplication?: number;
    linkedinAlgorithm?: number;
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
export type DailyGenerationResult = {
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
} | {
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
export declare const TARGET_AUDIENCES: readonly ["Recruiters", "Hiring Managers", "CTOs", "Engineering Managers", "Founders", "Senior Engineers", "AI Engineers", "Full Stack Developers"];
export type TargetAudience = (typeof TARGET_AUDIENCES)[number] | string;
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
    confidenceScore: number;
    data: T;
    validationResult: AgentValidationResult;
    metadata: AgentMetadata;
}
export declare const TopicSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    category: z.ZodString;
    framework: z.ZodOptional<z.ZodString>;
    supportingTech: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    score: z.ZodNumber;
    reason: z.ZodString;
    trend_velocity: z.ZodNumber;
    difficulty: z.ZodEnum<["BEGINNER", "INTERMEDIATE", "ADVANCED"]>;
    competition: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    audience: z.ZodString;
    keywords: z.ZodArray<z.ZodString, "many">;
    references: z.ZodArray<z.ZodString, "many">;
    storyAngle: z.ZodOptional<z.ZodString>;
    categoryWeight: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    category: string;
    supportingTech: string[];
    score: number;
    reason: string;
    trend_velocity: number;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    competition: "MEDIUM" | "LOW" | "HIGH";
    audience: string;
    keywords: string[];
    references: string[];
    id?: string | undefined;
    framework?: string | undefined;
    storyAngle?: string | undefined;
    categoryWeight?: number | undefined;
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
    framework?: string | undefined;
    supportingTech?: string[] | undefined;
    storyAngle?: string | undefined;
    categoryWeight?: number | undefined;
}>;
export type Topic = z.infer<typeof TopicSchema>;
export declare const HistoricalPostRecordSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    platform: z.ZodNativeEnum<typeof Platform>;
    category: z.ZodString;
    framework: z.ZodOptional<z.ZodString>;
    supportingTech: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    hook: z.ZodString;
    writingStyle: z.ZodOptional<z.ZodString>;
    storyAngle: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodString>;
    cta: z.ZodOptional<z.ZodString>;
    fullText: z.ZodString;
    publishedAt: z.ZodString;
    engagementMetrics: z.ZodOptional<z.ZodObject<{
        impressions: z.ZodDefault<z.ZodNumber>;
        reactions: z.ZodDefault<z.ZodNumber>;
        comments: z.ZodDefault<z.ZodNumber>;
        shares: z.ZodDefault<z.ZodNumber>;
        saves: z.ZodDefault<z.ZodNumber>;
        profileVisits: z.ZodDefault<z.ZodNumber>;
        followersGained: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        impressions: number;
        reactions: number;
        comments: number;
        shares: number;
        saves: number;
        profileVisits: number;
        followersGained: number;
    }, {
        impressions?: number | undefined;
        reactions?: number | undefined;
        comments?: number | undefined;
        shares?: number | undefined;
        saves?: number | undefined;
        profileVisits?: number | undefined;
        followersGained?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    id: string;
    category: string;
    supportingTech: string[];
    keywords: string[];
    hook: string;
    fullText: string;
    platform: Platform;
    publishedAt: string;
    framework?: string | undefined;
    audience?: string | undefined;
    storyAngle?: string | undefined;
    cta?: string | undefined;
    writingStyle?: string | undefined;
    engagementMetrics?: {
        impressions: number;
        reactions: number;
        comments: number;
        shares: number;
        saves: number;
        profileVisits: number;
        followersGained: number;
    } | undefined;
}, {
    title: string;
    id: string;
    category: string;
    hook: string;
    fullText: string;
    platform: Platform;
    publishedAt: string;
    framework?: string | undefined;
    supportingTech?: string[] | undefined;
    audience?: string | undefined;
    keywords?: string[] | undefined;
    storyAngle?: string | undefined;
    cta?: string | undefined;
    writingStyle?: string | undefined;
    engagementMetrics?: {
        impressions?: number | undefined;
        reactions?: number | undefined;
        comments?: number | undefined;
        shares?: number | undefined;
        saves?: number | undefined;
        profileVisits?: number | undefined;
        followersGained?: number | undefined;
    } | undefined;
}>;
export type HistoricalPostRecord = z.infer<typeof HistoricalPostRecordSchema>;
export declare const ExperienceLogSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    technologiesUsed: z.ZodArray<z.ZodString, "many">;
    challengesFaced: z.ZodArray<z.ZodString, "many">;
    solutionApproach: z.ZodString;
    tradeoffs: z.ZodArray<z.ZodString, "many">;
    keyLessons: z.ZodArray<z.ZodString, "many">;
    metricsOrOutcome: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    category: string;
    tradeoffs: string[];
    description: string;
    technologiesUsed: string[];
    challengesFaced: string[];
    solutionApproach: string;
    keyLessons: string[];
    id?: string | undefined;
    metricsOrOutcome?: string | undefined;
    createdAt?: string | undefined;
}, {
    title: string;
    category: string;
    tradeoffs: string[];
    description: string;
    technologiesUsed: string[];
    challengesFaced: string[];
    solutionApproach: string;
    keyLessons: string[];
    id?: string | undefined;
    metricsOrOutcome?: string | undefined;
    createdAt?: string | undefined;
}>;
export type ExperienceLog = z.infer<typeof ExperienceLogSchema>;
export declare const OriginalityCheckResultSchema: z.ZodObject<{
    passed: z.ZodBoolean;
    overallSimilarityScore: z.ZodNumber;
    semanticEmbeddingSimilarity: z.ZodOptional<z.ZodNumber>;
    maxSimilarPostId: z.ZodOptional<z.ZodString>;
    maxSimilarPostTitle: z.ZodOptional<z.ZodString>;
    breakdown: z.ZodObject<{
        titleSimilarity: z.ZodNumber;
        hookSimilarity: z.ZodNumber;
        technologyOverlap: z.ZodNumber;
        ctaSimilarity: z.ZodNumber;
        structureSimilarity: z.ZodNumber;
        semanticSimilarity: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        titleSimilarity: number;
        hookSimilarity: number;
        technologyOverlap: number;
        ctaSimilarity: number;
        structureSimilarity: number;
        semanticSimilarity?: number | undefined;
    }, {
        titleSimilarity: number;
        hookSimilarity: number;
        technologyOverlap: number;
        ctaSimilarity: number;
        structureSimilarity: number;
        semanticSimilarity?: number | undefined;
    }>;
    rejectionReasons: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    rejectionReasons: string[];
    passed: boolean;
    overallSimilarityScore: number;
    breakdown: {
        titleSimilarity: number;
        hookSimilarity: number;
        technologyOverlap: number;
        ctaSimilarity: number;
        structureSimilarity: number;
        semanticSimilarity?: number | undefined;
    };
    semanticEmbeddingSimilarity?: number | undefined;
    maxSimilarPostId?: string | undefined;
    maxSimilarPostTitle?: string | undefined;
}, {
    rejectionReasons: string[];
    passed: boolean;
    overallSimilarityScore: number;
    breakdown: {
        titleSimilarity: number;
        hookSimilarity: number;
        technologyOverlap: number;
        ctaSimilarity: number;
        structureSimilarity: number;
        semanticSimilarity?: number | undefined;
    };
    semanticEmbeddingSimilarity?: number | undefined;
    maxSimilarPostId?: string | undefined;
    maxSimilarPostTitle?: string | undefined;
}>;
export type OriginalityCheckResult = z.infer<typeof OriginalityCheckResultSchema>;
export declare const VisualValidationResultSchema: z.ZodObject<{
    alignedWithArticle: z.ZodBoolean;
    alignmentScore: z.ZodNumber;
    categoryMatch: z.ZodBoolean;
    logoAccuracyPassed: z.ZodBoolean;
    feedbackNotes: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    alignedWithArticle: boolean;
    alignmentScore: number;
    categoryMatch: boolean;
    logoAccuracyPassed: boolean;
    feedbackNotes: string[];
}, {
    alignedWithArticle: boolean;
    alignmentScore: number;
    categoryMatch: boolean;
    logoAccuracyPassed: boolean;
    feedbackNotes: string[];
}>;
export type VisualValidationResult = z.infer<typeof VisualValidationResultSchema>;
export interface TechnicalCredibilityResult {
    passed: boolean;
    evidenceFound: boolean;
    unsupportedClaimsCount: number;
    benchmarkClaimsVerified: boolean;
    architectureClaimsVerified: boolean;
    firstPersonClaimsVerified: boolean;
    interviewDefensePassed: boolean;
    evidenceAuthenticityScore: number;
    flaggedPhrases: string[];
    rejectionReasons: string[];
    suggestedRewrites: Array<{
        original: string;
        suggested: string;
        reason: string;
    }>;
}
export declare const DecisionGateResultSchema: z.ZodObject<{
    approvedForPublishing: z.ZodBoolean;
    decision: z.ZodEnum<["PUBLISH", "REGENERATE", "REJECT"]>;
    gateCheckResults: z.ZodObject<{
        topicFreshnessPassed: z.ZodBoolean;
        technicalAccuracyPassed: z.ZodBoolean;
        credibilityGatePassed: z.ZodOptional<z.ZodBoolean>;
        evidenceAuthenticityPassed: z.ZodOptional<z.ZodBoolean>;
        originalityPassed: z.ZodBoolean;
        humanTonePassed: z.ZodBoolean;
        audienceRelevancePassed: z.ZodBoolean;
        brandStrategyPassed: z.ZodBoolean;
        discussionPotentialPassed: z.ZodBoolean;
        platformOptimizationPassed: z.ZodBoolean;
        visualValidationPassed: z.ZodBoolean;
        imageRelevancePassed: z.ZodOptional<z.ZodBoolean>;
        postDeduplicationPassed: z.ZodOptional<z.ZodBoolean>;
        linkedinAlgorithmPassed: z.ZodOptional<z.ZodBoolean>;
        seoCompletenessPassed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        topicFreshnessPassed: boolean;
        technicalAccuracyPassed: boolean;
        originalityPassed: boolean;
        humanTonePassed: boolean;
        audienceRelevancePassed: boolean;
        brandStrategyPassed: boolean;
        discussionPotentialPassed: boolean;
        platformOptimizationPassed: boolean;
        visualValidationPassed: boolean;
        seoCompletenessPassed: boolean;
        credibilityGatePassed?: boolean | undefined;
        evidenceAuthenticityPassed?: boolean | undefined;
        imageRelevancePassed?: boolean | undefined;
        postDeduplicationPassed?: boolean | undefined;
        linkedinAlgorithmPassed?: boolean | undefined;
    }, {
        topicFreshnessPassed: boolean;
        technicalAccuracyPassed: boolean;
        originalityPassed: boolean;
        humanTonePassed: boolean;
        audienceRelevancePassed: boolean;
        brandStrategyPassed: boolean;
        discussionPotentialPassed: boolean;
        platformOptimizationPassed: boolean;
        visualValidationPassed: boolean;
        seoCompletenessPassed: boolean;
        credibilityGatePassed?: boolean | undefined;
        evidenceAuthenticityPassed?: boolean | undefined;
        imageRelevancePassed?: boolean | undefined;
        postDeduplicationPassed?: boolean | undefined;
        linkedinAlgorithmPassed?: boolean | undefined;
    }>;
    rejectionReasons: z.ZodArray<z.ZodString, "many">;
    weightedScores: z.ZodOptional<z.ZodObject<{
        evidenceAuthenticity: z.ZodNumber;
        technicalAccuracy: z.ZodNumber;
        personalExperience: z.ZodNumber;
        engineeringDepth: z.ZodNumber;
        storytelling: z.ZodNumber;
        recruiterValue: z.ZodNumber;
        engagementPotential: z.ZodNumber;
        totalScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        evidenceAuthenticity: number;
        technicalAccuracy: number;
        personalExperience: number;
        engineeringDepth: number;
        storytelling: number;
        recruiterValue: number;
        engagementPotential: number;
        totalScore: number;
    }, {
        evidenceAuthenticity: number;
        technicalAccuracy: number;
        personalExperience: number;
        engineeringDepth: number;
        storytelling: number;
        recruiterValue: number;
        engagementPotential: number;
        totalScore: number;
    }>>;
    actionRequired: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rejectionReasons: string[];
    approvedForPublishing: boolean;
    decision: "PUBLISH" | "REGENERATE" | "REJECT";
    gateCheckResults: {
        topicFreshnessPassed: boolean;
        technicalAccuracyPassed: boolean;
        originalityPassed: boolean;
        humanTonePassed: boolean;
        audienceRelevancePassed: boolean;
        brandStrategyPassed: boolean;
        discussionPotentialPassed: boolean;
        platformOptimizationPassed: boolean;
        visualValidationPassed: boolean;
        seoCompletenessPassed: boolean;
        credibilityGatePassed?: boolean | undefined;
        evidenceAuthenticityPassed?: boolean | undefined;
        imageRelevancePassed?: boolean | undefined;
        postDeduplicationPassed?: boolean | undefined;
        linkedinAlgorithmPassed?: boolean | undefined;
    };
    weightedScores?: {
        evidenceAuthenticity: number;
        technicalAccuracy: number;
        personalExperience: number;
        engineeringDepth: number;
        storytelling: number;
        recruiterValue: number;
        engagementPotential: number;
        totalScore: number;
    } | undefined;
    actionRequired?: string | undefined;
}, {
    rejectionReasons: string[];
    approvedForPublishing: boolean;
    decision: "PUBLISH" | "REGENERATE" | "REJECT";
    gateCheckResults: {
        topicFreshnessPassed: boolean;
        technicalAccuracyPassed: boolean;
        originalityPassed: boolean;
        humanTonePassed: boolean;
        audienceRelevancePassed: boolean;
        brandStrategyPassed: boolean;
        discussionPotentialPassed: boolean;
        platformOptimizationPassed: boolean;
        visualValidationPassed: boolean;
        seoCompletenessPassed: boolean;
        credibilityGatePassed?: boolean | undefined;
        evidenceAuthenticityPassed?: boolean | undefined;
        imageRelevancePassed?: boolean | undefined;
        postDeduplicationPassed?: boolean | undefined;
        linkedinAlgorithmPassed?: boolean | undefined;
    };
    weightedScores?: {
        evidenceAuthenticity: number;
        technicalAccuracy: number;
        personalExperience: number;
        engineeringDepth: number;
        storytelling: number;
        recruiterValue: number;
        engagementPotential: number;
        totalScore: number;
    } | undefined;
    actionRequired?: string | undefined;
}>;
export type DecisionGateResult = z.infer<typeof DecisionGateResultSchema>;
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
        description: string;
        language: string;
    }, {
        code: string;
        description: string;
        language: string;
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
        description: string;
        language: string;
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
        description: string;
        language: string;
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
    rejectionReasons: string[];
    factCheckPassed: boolean;
    confidenceScore: number;
    verifiedClaims: string[];
    rejectedClaims: string[];
    sourcesUsed: string[];
}, {
    rejectionReasons: string[];
    factCheckPassed: boolean;
    confidenceScore: number;
    verifiedClaims: string[];
    rejectedClaims: string[];
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
    noveltyScore: number;
    feedbackNotes: string[];
    readabilityScore: number;
    seoScore: number;
    engagementScore: number;
    grammarScore: number;
    technicalAccuracyScore: number;
    overallScore: number;
    passedThreshold: boolean;
}, {
    noveltyScore: number;
    feedbackNotes: string[];
    readabilityScore: number;
    seoScore: number;
    engagementScore: number;
    grammarScore: number;
    technicalAccuracyScore: number;
    overallScore: number;
    passedThreshold: boolean;
}>;
export type ContentEvaluation = z.infer<typeof ContentEvaluationSchema>;
export declare enum StoryMode {
    FAILURE_STORY = "FAILURE_STORY",
    DECISION_STORY = "DECISION_STORY",
    DEBUGGING_STORY = "DEBUGGING_STORY",
    PERFORMANCE_STORY = "PERFORMANCE_STORY",
    ARCHITECTURE_STORY = "ARCHITECTURE_STORY",
    BUILD_IN_PUBLIC = "BUILD_IN_PUBLIC",
    TECH_DISCOVERY = "TECH_DISCOVERY",
    CONTRARIAN_OBSERVATION = "CONTRARIAN_OBSERVATION",
    BEFORE_AFTER = "BEFORE_AFTER",
    PRODUCTION_REALITY = "PRODUCTION_REALITY"
}
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
    writingQualityScore: z.ZodLazy<z.ZodOptional<z.ZodObject<{
        clarity: z.ZodNumber;
        technicalDepth: z.ZodNumber;
        seniority: z.ZodNumber;
        authenticity: z.ZodNumber;
        originality: z.ZodNumber;
        narrativeQuality: z.ZodNumber;
        evidenceQuality: z.ZodNumber;
        readability: z.ZodNumber;
        careerSignal: z.ZodNumber;
        discussionPotential: z.ZodNumber;
        aiClicheScore: z.ZodNumber;
        evidenceAuthenticityScore: z.ZodOptional<z.ZodNumber>;
        personalExperienceScore: z.ZodOptional<z.ZodNumber>;
        engineeringDepthScore: z.ZodOptional<z.ZodNumber>;
        storytellingScore: z.ZodOptional<z.ZodNumber>;
        recruiterValueScore: z.ZodOptional<z.ZodNumber>;
        engagementPotentialScore: z.ZodOptional<z.ZodNumber>;
        weightedTotalScore: z.ZodOptional<z.ZodNumber>;
        overall: z.ZodNumber;
        boredomScore: z.ZodOptional<z.ZodObject<{
            structuralRepetition: z.ZodNumber;
            hookRepetition: z.ZodNumber;
            vocabularyRepetition: z.ZodNumber;
            topicRepetition: z.ZodNumber;
            ctaRepetition: z.ZodNumber;
            narrativePredictability: z.ZodNumber;
            genericness: z.ZodNumber;
            overall: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        }, {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        }>>;
        storyQualityScore: z.ZodOptional<z.ZodObject<{
            curiosity: z.ZodNumber;
            tension: z.ZodNumber;
            specificity: z.ZodNumber;
            decisionQuality: z.ZodNumber;
            technicalDepth: z.ZodNumber;
            resultStrength: z.ZodNumber;
            authenticity: z.ZodNumber;
            seniority: z.ZodNumber;
            starCompleteness: z.ZodNumber;
            overall: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        }, {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    }, {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    }>>>;
    storyMode: z.ZodOptional<z.ZodNativeEnum<typeof StoryMode>>;
    formatStyle: z.ZodOptional<z.ZodNativeEnum<typeof FormatStyle>>;
    starStory: z.ZodLazy<z.ZodOptional<z.ZodObject<{
        situation: z.ZodObject<{
            context: z.ZodString;
            trigger: z.ZodString;
            stakes: z.ZodOptional<z.ZodString>;
            curiosityTension: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        }, {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        }>;
        task: z.ZodObject<{
            objective: z.ZodString;
            constraints: z.ZodArray<z.ZodString, "many">;
            successCriteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        }, {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        }>;
        action: z.ZodObject<{
            approachesConsidered: z.ZodArray<z.ZodString, "many">;
            chosenApproach: z.ZodString;
            rejectedApproaches: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            reasoning: z.ZodString;
            decisionMoment: z.ZodOptional<z.ZodString>;
            implementation: z.ZodOptional<z.ZodString>;
            debugging: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        }, {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        }>;
        result: z.ZodObject<{
            outcome: z.ZodString;
            metrics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            evidence: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        }, {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        }>;
        insight: z.ZodObject<{
            engineeringLesson: z.ZodString;
            tradeoffs: z.ZodArray<z.ZodString, "many">;
            whenNotToUse: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        }, {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    }, {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    }>>>;
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
    writingQualityScore?: {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    } | undefined;
    storyMode?: StoryMode | undefined;
    formatStyle?: FormatStyle | undefined;
    starStory?: {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    } | undefined;
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
    writingQualityScore?: {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    } | undefined;
    storyMode?: StoryMode | undefined;
    formatStyle?: FormatStyle | undefined;
    starStory?: {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    } | undefined;
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
    imageUrl: z.ZodOptional<z.ZodString>;
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
    imageUrl?: string | undefined;
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
    imageUrl?: string | undefined;
}>;
export type MediumArticlePayload = z.infer<typeof MediumArticlePayloadSchema>;
export declare const DevToArticlePayloadSchema: z.ZodObject<{
    title: z.ZodString;
    published: z.ZodDefault<z.ZodBoolean>;
    tags: z.ZodArray<z.ZodString, "many">;
    series: z.ZodOptional<z.ZodString>;
    canonicalUrl: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    mainImage: z.ZodOptional<z.ZodString>;
    markdownContent: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    published: boolean;
    tags: string[];
    description: string;
    markdownContent: string;
    series?: string | undefined;
    canonicalUrl?: string | undefined;
    mainImage?: string | undefined;
}, {
    title: string;
    tags: string[];
    description: string;
    markdownContent: string;
    published?: boolean | undefined;
    series?: string | undefined;
    canonicalUrl?: string | undefined;
    mainImage?: string | undefined;
}>;
export type DevToArticlePayload = z.infer<typeof DevToArticlePayloadSchema>;
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
    pipelineId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    taskType: string;
    temperature: number;
    routingStrategy: RoutingStrategy;
    pipelineId?: string | undefined;
    systemPrompt?: string | undefined;
    preferredProvider?: ModelProvider | undefined;
    model?: string | undefined;
    maxTokens?: number | undefined;
    responseSchema?: any;
}, {
    prompt: string;
    pipelineId?: string | undefined;
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
    evidenceAuthenticityScore?: number;
    technicalAccuracyScore: number;
    personalExperienceScore?: number;
    engineeringDepthScore?: number;
    storytellingScore?: number;
    recruiterValueScore?: number;
    engagementPotentialScore?: number;
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
export interface DiagramNode {
    id: string;
    label: string;
    sublabel?: string;
    icon?: "query" | "data" | "embedding" | "vector" | "vectordb" | "context" | "llm" | "response" | "cache" | "custom";
    color?: "yellow" | "blue" | "green" | "purple" | "slate" | "red" | string;
}
export interface DiagramColumn {
    id: string;
    title: string;
    subtitle: string;
    color: "blue" | "green" | "yellow" | "purple" | "red" | string;
    nodes: DiagramNode[];
    flowConnections?: Array<{
        from: string;
        to: string;
        label?: string;
    }>;
}
export interface DiagramSpec {
    title: string;
    columns: DiagramColumn[];
    layoutStyle: "SIDE_BY_SIDE_COMPARISON" | "SINGLE_FLOWCHART" | "SYSTEM_DESIGN" | "BENCHMARK_CHART" | "SYSTEM_FLOW" | "FAILURE_ANALYSIS" | "DECISION_MATRIX" | string;
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
export type SourceCategory = "OFFICIAL_LAB" | "MODEL_HUB" | "OPEN_SOURCE" | "COMMUNITY" | "RESEARCH" | "DEVELOPER_PLATFORM";
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
    codingScore: number;
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
export type ContentAngle = "ANNOUNCEMENT" | "ARCHITECTURE_ANALYSIS" | "DEVELOPER_IMPACT" | "PRODUCTION_TRADEOFF" | "PERFORMANCE_COMPARISON" | "IMPLEMENTATION_TUTORIAL" | "MIGRATION_GUIDE" | "COST_ANALYSIS" | "SECURITY_IMPLICATIONS" | "PERSONAL_EXPERIMENT";
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
    trendFreshness: number;
    trendVelocity: number;
    technicalImportance: number;
    careerRelevance: number;
    personalExperience: number;
    contentGap: number;
    originality: number;
    audienceInterest: number;
    sourceAuthority: number;
}
export declare const DEFAULT_SCORING_WEIGHTS: ScoringWeightsConfig;
export interface TopicDecayProfile {
    daysAgo: number;
    decayPenalty: number;
    eligibilityPercent: number;
}
export interface ContentSaturationScore {
    topicSaturation: number;
    technologySaturation: number;
    categorySaturation: number;
    narrativeSaturation: number;
    visualSaturation: number;
    overallSaturationScore: number;
    rejected: boolean;
    rejectionReason?: string;
}
export type NarrativePattern = "ENGINEERING_DISCOVERY" | "UNEXPECTED_PROBLEM" | "TECHNICAL_TRADEOFF" | "PRODUCTION_FAILURE" | "CONTRARIAN_OBSERVATION" | "NEW_TECHNOLOGY_ANALYSIS" | "BUILD_IN_PUBLIC" | "ARCHITECTURE_LESSON";
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
    rejectedCandidates: Array<{
        topic: string;
        reason: string;
    }>;
    decisionExplainability: string;
    visualAlignmentScore?: number;
    originalityScore?: number;
}
export declare enum HookType {
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
    METRIC_BREAKDOWN = "METRIC_BREAKDOWN",
    HARD_TRUTH = "HARD_TRUTH",
    CURIOSITY_GAP = "CURIOSITY_GAP",
    ARCHITECTURAL_PARADOX = "ARCHITECTURAL_PARADOX",
    BEFORE_AFTER_TRANSFORMATION = "BEFORE_AFTER_TRANSFORMATION",
    TELEMETRY_TRAP = "TELEMETRY_TRAP"
}
export declare enum DiscussionCtaType {
    TRADEOFF_CHOICE = "TRADEOFF_CHOICE",
    BOUNDARY_QUESTION = "BOUNDARY_QUESTION",
    PRODUCTION_FAILURE_CHECK = "PRODUCTION_FAILURE_CHECK",
    OPTIMIZATION_PRIORITY = "OPTIMIZATION_PRIORITY",
    DESIGN_CHANGE = "DESIGN_CHANGE",
    TEAM_PRACTICE = "TEAM_PRACTICE"
}
export declare const STARStorySchema: z.ZodObject<{
    situation: z.ZodObject<{
        context: z.ZodString;
        trigger: z.ZodString;
        stakes: z.ZodOptional<z.ZodString>;
        curiosityTension: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        context: string;
        trigger: string;
        stakes?: string | undefined;
        curiosityTension?: string | undefined;
    }, {
        context: string;
        trigger: string;
        stakes?: string | undefined;
        curiosityTension?: string | undefined;
    }>;
    task: z.ZodObject<{
        objective: z.ZodString;
        constraints: z.ZodArray<z.ZodString, "many">;
        successCriteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        objective: string;
        constraints: string[];
        successCriteria?: string[] | undefined;
    }, {
        objective: string;
        constraints: string[];
        successCriteria?: string[] | undefined;
    }>;
    action: z.ZodObject<{
        approachesConsidered: z.ZodArray<z.ZodString, "many">;
        chosenApproach: z.ZodString;
        rejectedApproaches: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        reasoning: z.ZodString;
        decisionMoment: z.ZodOptional<z.ZodString>;
        implementation: z.ZodOptional<z.ZodString>;
        debugging: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        approachesConsidered: string[];
        chosenApproach: string;
        reasoning: string;
        rejectedApproaches?: string[] | undefined;
        decisionMoment?: string | undefined;
        implementation?: string | undefined;
        debugging?: string | undefined;
    }, {
        approachesConsidered: string[];
        chosenApproach: string;
        reasoning: string;
        rejectedApproaches?: string[] | undefined;
        decisionMoment?: string | undefined;
        implementation?: string | undefined;
        debugging?: string | undefined;
    }>;
    result: z.ZodObject<{
        outcome: z.ZodString;
        metrics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        evidence: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        outcome: string;
        evidence: string[];
        metrics?: string[] | undefined;
    }, {
        outcome: string;
        evidence: string[];
        metrics?: string[] | undefined;
    }>;
    insight: z.ZodObject<{
        engineeringLesson: z.ZodString;
        tradeoffs: z.ZodArray<z.ZodString, "many">;
        whenNotToUse: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        engineeringLesson: string;
        tradeoffs: string[];
        whenNotToUse?: string[] | undefined;
    }, {
        engineeringLesson: string;
        tradeoffs: string[];
        whenNotToUse?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    situation: {
        context: string;
        trigger: string;
        stakes?: string | undefined;
        curiosityTension?: string | undefined;
    };
    task: {
        objective: string;
        constraints: string[];
        successCriteria?: string[] | undefined;
    };
    action: {
        approachesConsidered: string[];
        chosenApproach: string;
        reasoning: string;
        rejectedApproaches?: string[] | undefined;
        decisionMoment?: string | undefined;
        implementation?: string | undefined;
        debugging?: string | undefined;
    };
    result: {
        outcome: string;
        evidence: string[];
        metrics?: string[] | undefined;
    };
    insight: {
        engineeringLesson: string;
        tradeoffs: string[];
        whenNotToUse?: string[] | undefined;
    };
}, {
    situation: {
        context: string;
        trigger: string;
        stakes?: string | undefined;
        curiosityTension?: string | undefined;
    };
    task: {
        objective: string;
        constraints: string[];
        successCriteria?: string[] | undefined;
    };
    action: {
        approachesConsidered: string[];
        chosenApproach: string;
        reasoning: string;
        rejectedApproaches?: string[] | undefined;
        decisionMoment?: string | undefined;
        implementation?: string | undefined;
        debugging?: string | undefined;
    };
    result: {
        outcome: string;
        evidence: string[];
        metrics?: string[] | undefined;
    };
    insight: {
        engineeringLesson: string;
        tradeoffs: string[];
        whenNotToUse?: string[] | undefined;
    };
}>;
export type STARStory = z.infer<typeof STARStorySchema>;
export declare const BoredomScoreSchema: z.ZodObject<{
    structuralRepetition: z.ZodNumber;
    hookRepetition: z.ZodNumber;
    vocabularyRepetition: z.ZodNumber;
    topicRepetition: z.ZodNumber;
    ctaRepetition: z.ZodNumber;
    narrativePredictability: z.ZodNumber;
    genericness: z.ZodNumber;
    overall: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    overall: number;
    structuralRepetition: number;
    hookRepetition: number;
    vocabularyRepetition: number;
    topicRepetition: number;
    ctaRepetition: number;
    narrativePredictability: number;
    genericness: number;
}, {
    overall: number;
    structuralRepetition: number;
    hookRepetition: number;
    vocabularyRepetition: number;
    topicRepetition: number;
    ctaRepetition: number;
    narrativePredictability: number;
    genericness: number;
}>;
export type BoredomScore = z.infer<typeof BoredomScoreSchema>;
export declare const StoryQualityScoreSchema: z.ZodObject<{
    curiosity: z.ZodNumber;
    tension: z.ZodNumber;
    specificity: z.ZodNumber;
    decisionQuality: z.ZodNumber;
    technicalDepth: z.ZodNumber;
    resultStrength: z.ZodNumber;
    authenticity: z.ZodNumber;
    seniority: z.ZodNumber;
    starCompleteness: z.ZodNumber;
    overall: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    technicalDepth: number;
    seniority: number;
    authenticity: number;
    overall: number;
    curiosity: number;
    tension: number;
    specificity: number;
    decisionQuality: number;
    resultStrength: number;
    starCompleteness: number;
}, {
    technicalDepth: number;
    seniority: number;
    authenticity: number;
    overall: number;
    curiosity: number;
    tension: number;
    specificity: number;
    decisionQuality: number;
    resultStrength: number;
    starCompleteness: number;
}>;
export type StoryQualityScore = z.infer<typeof StoryQualityScoreSchema>;
export declare const WritingQualityScoreSchema: z.ZodObject<{
    clarity: z.ZodNumber;
    technicalDepth: z.ZodNumber;
    seniority: z.ZodNumber;
    authenticity: z.ZodNumber;
    originality: z.ZodNumber;
    narrativeQuality: z.ZodNumber;
    evidenceQuality: z.ZodNumber;
    readability: z.ZodNumber;
    careerSignal: z.ZodNumber;
    discussionPotential: z.ZodNumber;
    aiClicheScore: z.ZodNumber;
    evidenceAuthenticityScore: z.ZodOptional<z.ZodNumber>;
    personalExperienceScore: z.ZodOptional<z.ZodNumber>;
    engineeringDepthScore: z.ZodOptional<z.ZodNumber>;
    storytellingScore: z.ZodOptional<z.ZodNumber>;
    recruiterValueScore: z.ZodOptional<z.ZodNumber>;
    engagementPotentialScore: z.ZodOptional<z.ZodNumber>;
    weightedTotalScore: z.ZodOptional<z.ZodNumber>;
    overall: z.ZodNumber;
    boredomScore: z.ZodOptional<z.ZodObject<{
        structuralRepetition: z.ZodNumber;
        hookRepetition: z.ZodNumber;
        vocabularyRepetition: z.ZodNumber;
        topicRepetition: z.ZodNumber;
        ctaRepetition: z.ZodNumber;
        narrativePredictability: z.ZodNumber;
        genericness: z.ZodNumber;
        overall: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        overall: number;
        structuralRepetition: number;
        hookRepetition: number;
        vocabularyRepetition: number;
        topicRepetition: number;
        ctaRepetition: number;
        narrativePredictability: number;
        genericness: number;
    }, {
        overall: number;
        structuralRepetition: number;
        hookRepetition: number;
        vocabularyRepetition: number;
        topicRepetition: number;
        ctaRepetition: number;
        narrativePredictability: number;
        genericness: number;
    }>>;
    storyQualityScore: z.ZodOptional<z.ZodObject<{
        curiosity: z.ZodNumber;
        tension: z.ZodNumber;
        specificity: z.ZodNumber;
        decisionQuality: z.ZodNumber;
        technicalDepth: z.ZodNumber;
        resultStrength: z.ZodNumber;
        authenticity: z.ZodNumber;
        seniority: z.ZodNumber;
        starCompleteness: z.ZodNumber;
        overall: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        overall: number;
        curiosity: number;
        tension: number;
        specificity: number;
        decisionQuality: number;
        resultStrength: number;
        starCompleteness: number;
    }, {
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        overall: number;
        curiosity: number;
        tension: number;
        specificity: number;
        decisionQuality: number;
        resultStrength: number;
        starCompleteness: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    clarity: number;
    technicalDepth: number;
    seniority: number;
    authenticity: number;
    originality: number;
    narrativeQuality: number;
    evidenceQuality: number;
    readability: number;
    careerSignal: number;
    discussionPotential: number;
    aiClicheScore: number;
    overall: number;
    evidenceAuthenticityScore?: number | undefined;
    personalExperienceScore?: number | undefined;
    engineeringDepthScore?: number | undefined;
    storytellingScore?: number | undefined;
    recruiterValueScore?: number | undefined;
    engagementPotentialScore?: number | undefined;
    weightedTotalScore?: number | undefined;
    boredomScore?: {
        overall: number;
        structuralRepetition: number;
        hookRepetition: number;
        vocabularyRepetition: number;
        topicRepetition: number;
        ctaRepetition: number;
        narrativePredictability: number;
        genericness: number;
    } | undefined;
    storyQualityScore?: {
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        overall: number;
        curiosity: number;
        tension: number;
        specificity: number;
        decisionQuality: number;
        resultStrength: number;
        starCompleteness: number;
    } | undefined;
}, {
    clarity: number;
    technicalDepth: number;
    seniority: number;
    authenticity: number;
    originality: number;
    narrativeQuality: number;
    evidenceQuality: number;
    readability: number;
    careerSignal: number;
    discussionPotential: number;
    aiClicheScore: number;
    overall: number;
    evidenceAuthenticityScore?: number | undefined;
    personalExperienceScore?: number | undefined;
    engineeringDepthScore?: number | undefined;
    storytellingScore?: number | undefined;
    recruiterValueScore?: number | undefined;
    engagementPotentialScore?: number | undefined;
    weightedTotalScore?: number | undefined;
    boredomScore?: {
        overall: number;
        structuralRepetition: number;
        hookRepetition: number;
        vocabularyRepetition: number;
        topicRepetition: number;
        ctaRepetition: number;
        narrativePredictability: number;
        genericness: number;
    } | undefined;
    storyQualityScore?: {
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        overall: number;
        curiosity: number;
        tension: number;
        specificity: number;
        decisionQuality: number;
        resultStrength: number;
        starCompleteness: number;
    } | undefined;
}>;
export type WritingQualityScore = z.infer<typeof WritingQualityScoreSchema>;
export declare const VisualNarrativeSchema: z.ZodObject<{
    coreConcept: z.ZodString;
    primaryFlow: z.ZodString;
    importantComponents: z.ZodArray<z.ZodString, "many">;
    relationships: z.ZodArray<z.ZodString, "many">;
    keyLabels: z.ZodArray<z.ZodString, "many">;
    visualType: z.ZodString;
}, "strip", z.ZodTypeAny, {
    coreConcept: string;
    primaryFlow: string;
    importantComponents: string[];
    relationships: string[];
    keyLabels: string[];
    visualType: string;
}, {
    coreConcept: string;
    primaryFlow: string;
    importantComponents: string[];
    relationships: string[];
    keyLabels: string[];
    visualType: string;
}>;
export type VisualNarrative = z.infer<typeof VisualNarrativeSchema>;
export declare const SeniorEngineeringPostSchema: z.ZodObject<{
    platform: z.ZodDefault<z.ZodNativeEnum<typeof Platform>>;
    title: z.ZodString;
    hook: z.ZodString;
    hookType: z.ZodString;
    body: z.ZodString;
    storyAngle: z.ZodString;
    engineeringProblem: z.ZodString;
    technicalInsight: z.ZodString;
    tradeoffs: z.ZodArray<z.ZodString, "many">;
    evidence: z.ZodArray<z.ZodString, "many">;
    personalExperience: z.ZodString;
    discussionAngle: z.ZodString;
    hashtags: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodString, "many">;
    fullText: z.ZodString;
    visualNarrative: z.ZodOptional<z.ZodObject<{
        coreConcept: z.ZodString;
        primaryFlow: z.ZodString;
        importantComponents: z.ZodArray<z.ZodString, "many">;
        relationships: z.ZodArray<z.ZodString, "many">;
        keyLabels: z.ZodArray<z.ZodString, "many">;
        visualType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        coreConcept: string;
        primaryFlow: string;
        importantComponents: string[];
        relationships: string[];
        keyLabels: string[];
        visualType: string;
    }, {
        coreConcept: string;
        primaryFlow: string;
        importantComponents: string[];
        relationships: string[];
        keyLabels: string[];
        visualType: string;
    }>>;
    writingQualityScore: z.ZodOptional<z.ZodObject<{
        clarity: z.ZodNumber;
        technicalDepth: z.ZodNumber;
        seniority: z.ZodNumber;
        authenticity: z.ZodNumber;
        originality: z.ZodNumber;
        narrativeQuality: z.ZodNumber;
        evidenceQuality: z.ZodNumber;
        readability: z.ZodNumber;
        careerSignal: z.ZodNumber;
        discussionPotential: z.ZodNumber;
        aiClicheScore: z.ZodNumber;
        evidenceAuthenticityScore: z.ZodOptional<z.ZodNumber>;
        personalExperienceScore: z.ZodOptional<z.ZodNumber>;
        engineeringDepthScore: z.ZodOptional<z.ZodNumber>;
        storytellingScore: z.ZodOptional<z.ZodNumber>;
        recruiterValueScore: z.ZodOptional<z.ZodNumber>;
        engagementPotentialScore: z.ZodOptional<z.ZodNumber>;
        weightedTotalScore: z.ZodOptional<z.ZodNumber>;
        overall: z.ZodNumber;
        boredomScore: z.ZodOptional<z.ZodObject<{
            structuralRepetition: z.ZodNumber;
            hookRepetition: z.ZodNumber;
            vocabularyRepetition: z.ZodNumber;
            topicRepetition: z.ZodNumber;
            ctaRepetition: z.ZodNumber;
            narrativePredictability: z.ZodNumber;
            genericness: z.ZodNumber;
            overall: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        }, {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        }>>;
        storyQualityScore: z.ZodOptional<z.ZodObject<{
            curiosity: z.ZodNumber;
            tension: z.ZodNumber;
            specificity: z.ZodNumber;
            decisionQuality: z.ZodNumber;
            technicalDepth: z.ZodNumber;
            resultStrength: z.ZodNumber;
            authenticity: z.ZodNumber;
            seniority: z.ZodNumber;
            starCompleteness: z.ZodNumber;
            overall: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        }, {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    }, {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    }>>;
    storyMode: z.ZodOptional<z.ZodNativeEnum<typeof StoryMode>>;
    formatStyle: z.ZodOptional<z.ZodNativeEnum<typeof FormatStyle>>;
    starStory: z.ZodOptional<z.ZodObject<{
        situation: z.ZodObject<{
            context: z.ZodString;
            trigger: z.ZodString;
            stakes: z.ZodOptional<z.ZodString>;
            curiosityTension: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        }, {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        }>;
        task: z.ZodObject<{
            objective: z.ZodString;
            constraints: z.ZodArray<z.ZodString, "many">;
            successCriteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        }, {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        }>;
        action: z.ZodObject<{
            approachesConsidered: z.ZodArray<z.ZodString, "many">;
            chosenApproach: z.ZodString;
            rejectedApproaches: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            reasoning: z.ZodString;
            decisionMoment: z.ZodOptional<z.ZodString>;
            implementation: z.ZodOptional<z.ZodString>;
            debugging: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        }, {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        }>;
        result: z.ZodObject<{
            outcome: z.ZodString;
            metrics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            evidence: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        }, {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        }>;
        insight: z.ZodObject<{
            engineeringLesson: z.ZodString;
            tradeoffs: z.ZodArray<z.ZodString, "many">;
            whenNotToUse: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        }, {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    }, {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    storyAngle: string;
    hook: string;
    hashtags: string[];
    fullText: string;
    body: string;
    evidence: string[];
    tradeoffs: string[];
    platform: Platform;
    personalExperience: string;
    hookType: string;
    engineeringProblem: string;
    technicalInsight: string;
    discussionAngle: string;
    sourceReferences: string[];
    writingQualityScore?: {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    } | undefined;
    storyMode?: StoryMode | undefined;
    formatStyle?: FormatStyle | undefined;
    starStory?: {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    } | undefined;
    visualNarrative?: {
        coreConcept: string;
        primaryFlow: string;
        importantComponents: string[];
        relationships: string[];
        keyLabels: string[];
        visualType: string;
    } | undefined;
}, {
    title: string;
    storyAngle: string;
    hook: string;
    hashtags: string[];
    fullText: string;
    body: string;
    evidence: string[];
    tradeoffs: string[];
    personalExperience: string;
    hookType: string;
    engineeringProblem: string;
    technicalInsight: string;
    discussionAngle: string;
    sourceReferences: string[];
    writingQualityScore?: {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    } | undefined;
    storyMode?: StoryMode | undefined;
    formatStyle?: FormatStyle | undefined;
    starStory?: {
        situation: {
            context: string;
            trigger: string;
            stakes?: string | undefined;
            curiosityTension?: string | undefined;
        };
        task: {
            objective: string;
            constraints: string[];
            successCriteria?: string[] | undefined;
        };
        action: {
            approachesConsidered: string[];
            chosenApproach: string;
            reasoning: string;
            rejectedApproaches?: string[] | undefined;
            decisionMoment?: string | undefined;
            implementation?: string | undefined;
            debugging?: string | undefined;
        };
        result: {
            outcome: string;
            evidence: string[];
            metrics?: string[] | undefined;
        };
        insight: {
            engineeringLesson: string;
            tradeoffs: string[];
            whenNotToUse?: string[] | undefined;
        };
    } | undefined;
    platform?: Platform | undefined;
    visualNarrative?: {
        coreConcept: string;
        primaryFlow: string;
        importantComponents: string[];
        relationships: string[];
        keyLabels: string[];
        visualType: string;
    } | undefined;
}>;
export type SeniorEngineeringPost = z.infer<typeof SeniorEngineeringPostSchema>;
export declare const SeniorEngineeringArticleSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    body: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    canonicalUrl: z.ZodOptional<z.ZodString>;
    architecture: z.ZodString;
    mermaidDiagram: z.ZodOptional<z.ZodString>;
    codeExamples: z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        code: z.ZodString;
        explanation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        language: string;
        explanation: string;
    }, {
        code: string;
        language: string;
        explanation: string;
    }>, "many">;
    tradeoffs: z.ZodArray<z.ZodString, "many">;
    sources: z.ZodArray<z.ZodString, "many">;
    markdownContent: z.ZodString;
    writingQualityScore: z.ZodOptional<z.ZodObject<{
        clarity: z.ZodNumber;
        technicalDepth: z.ZodNumber;
        seniority: z.ZodNumber;
        authenticity: z.ZodNumber;
        originality: z.ZodNumber;
        narrativeQuality: z.ZodNumber;
        evidenceQuality: z.ZodNumber;
        readability: z.ZodNumber;
        careerSignal: z.ZodNumber;
        discussionPotential: z.ZodNumber;
        aiClicheScore: z.ZodNumber;
        evidenceAuthenticityScore: z.ZodOptional<z.ZodNumber>;
        personalExperienceScore: z.ZodOptional<z.ZodNumber>;
        engineeringDepthScore: z.ZodOptional<z.ZodNumber>;
        storytellingScore: z.ZodOptional<z.ZodNumber>;
        recruiterValueScore: z.ZodOptional<z.ZodNumber>;
        engagementPotentialScore: z.ZodOptional<z.ZodNumber>;
        weightedTotalScore: z.ZodOptional<z.ZodNumber>;
        overall: z.ZodNumber;
        boredomScore: z.ZodOptional<z.ZodObject<{
            structuralRepetition: z.ZodNumber;
            hookRepetition: z.ZodNumber;
            vocabularyRepetition: z.ZodNumber;
            topicRepetition: z.ZodNumber;
            ctaRepetition: z.ZodNumber;
            narrativePredictability: z.ZodNumber;
            genericness: z.ZodNumber;
            overall: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        }, {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        }>>;
        storyQualityScore: z.ZodOptional<z.ZodObject<{
            curiosity: z.ZodNumber;
            tension: z.ZodNumber;
            specificity: z.ZodNumber;
            decisionQuality: z.ZodNumber;
            technicalDepth: z.ZodNumber;
            resultStrength: z.ZodNumber;
            authenticity: z.ZodNumber;
            seniority: z.ZodNumber;
            starCompleteness: z.ZodNumber;
            overall: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        }, {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    }, {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    body: string;
    tradeoffs: string[];
    tags: string[];
    description: string;
    markdownContent: string;
    architecture: string;
    codeExamples: {
        code: string;
        language: string;
        explanation: string;
    }[];
    sources: string[];
    writingQualityScore?: {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    } | undefined;
    canonicalUrl?: string | undefined;
    mermaidDiagram?: string | undefined;
}, {
    title: string;
    body: string;
    tradeoffs: string[];
    tags: string[];
    description: string;
    markdownContent: string;
    architecture: string;
    codeExamples: {
        code: string;
        language: string;
        explanation: string;
    }[];
    sources: string[];
    writingQualityScore?: {
        clarity: number;
        technicalDepth: number;
        seniority: number;
        authenticity: number;
        originality: number;
        narrativeQuality: number;
        evidenceQuality: number;
        readability: number;
        careerSignal: number;
        discussionPotential: number;
        aiClicheScore: number;
        overall: number;
        evidenceAuthenticityScore?: number | undefined;
        personalExperienceScore?: number | undefined;
        engineeringDepthScore?: number | undefined;
        storytellingScore?: number | undefined;
        recruiterValueScore?: number | undefined;
        engagementPotentialScore?: number | undefined;
        weightedTotalScore?: number | undefined;
        boredomScore?: {
            overall: number;
            structuralRepetition: number;
            hookRepetition: number;
            vocabularyRepetition: number;
            topicRepetition: number;
            ctaRepetition: number;
            narrativePredictability: number;
            genericness: number;
        } | undefined;
        storyQualityScore?: {
            technicalDepth: number;
            seniority: number;
            authenticity: number;
            overall: number;
            curiosity: number;
            tension: number;
            specificity: number;
            decisionQuality: number;
            resultStrength: number;
            starCompleteness: number;
        } | undefined;
    } | undefined;
    canonicalUrl?: string | undefined;
    mermaidDiagram?: string | undefined;
}>;
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
export declare enum VisualFormat {
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
    TELEMETRY_DASHBOARD = "TELEMETRY_DASHBOARD"
}
export declare enum VisualComposition {
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
    FLOWCHART = "FLOWCHART"
}
export declare enum VisualDensity {
    MINIMAL = "MINIMAL",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export declare enum VisualPurpose {
    EXPLAIN = "EXPLAIN",
    COMPARE = "COMPARE",
    DEMONSTRATE = "DEMONSTRATE",
    TELL_STORY = "TELL_STORY",
    EXPOSE_PROBLEM = "EXPOSE_PROBLEM",
    SHOW_ARCHITECTURE = "SHOW_ARCHITECTURE",
    SHOW_PERFORMANCE = "SHOW_PERFORMANCE",
    SUMMARIZE_RESEARCH = "SUMMARIZE_RESEARCH"
}
export declare enum ColorStyle {
    LIGHT_TECHNICAL_BLUEPRINT = "LIGHT_TECHNICAL_BLUEPRINT",
    DARK_CONTRAST = "DARK_CONTRAST",
    MONOCHROME_ARCHITECTURE = "MONOCHROME_ARCHITECTURE",
    NEUTRAL_DOCUMENTATION = "NEUTRAL_DOCUMENTATION",
    GREEN_TERMINAL = "GREEN_TERMINAL",
    WARM_EDITORIAL = "WARM_EDITORIAL",
    HIGH_CONTRAST_DIAGRAM = "HIGH_CONTRAST_DIAGRAM"
}
export declare const VisualRAGPatternSchema: z.ZodObject<{
    id: z.ZodString;
    sourcePlatform: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    topic: z.ZodString;
    technicalCategory: z.ZodString;
    visualType: z.ZodNativeEnum<typeof VisualFormat>;
    composition: z.ZodNativeEnum<typeof VisualComposition>;
    layout: z.ZodString;
    informationDensity: z.ZodNativeEnum<typeof VisualDensity>;
    purpose: z.ZodNativeEnum<typeof VisualPurpose>;
    style: z.ZodNativeEnum<typeof ColorStyle>;
    engagementSignal: z.ZodEnum<["HIGH", "MEDIUM", "VIRAL"]>;
    keyElements: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    visualType: VisualFormat;
    sourcePlatform: string;
    topic: string;
    technicalCategory: string;
    composition: VisualComposition;
    layout: string;
    informationDensity: VisualDensity;
    purpose: VisualPurpose;
    style: ColorStyle;
    engagementSignal: "MEDIUM" | "HIGH" | "VIRAL";
    keyElements: string[];
    author?: string | undefined;
}, {
    id: string;
    visualType: VisualFormat;
    sourcePlatform: string;
    topic: string;
    technicalCategory: string;
    composition: VisualComposition;
    layout: string;
    informationDensity: VisualDensity;
    purpose: VisualPurpose;
    style: ColorStyle;
    engagementSignal: "MEDIUM" | "HIGH" | "VIRAL";
    keyElements: string[];
    author?: string | undefined;
}>;
export type VisualRAGPattern = z.infer<typeof VisualRAGPatternSchema>;
export declare const RecentVisualMemoryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    date: z.ZodString;
    topic: z.ZodString;
    category: z.ZodString;
    visualFormat: z.ZodNativeEnum<typeof VisualFormat>;
    composition: z.ZodNativeEnum<typeof VisualComposition>;
    layout: z.ZodString;
    colorStyle: z.ZodNativeEnum<typeof ColorStyle>;
    promptHash: z.ZodString;
    imageHash: z.ZodString;
    visualRepetitionScore: z.ZodNumber;
    visualStoryAlignmentScore: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: string;
    date: string;
    topic: string;
    composition: VisualComposition;
    layout: string;
    visualFormat: VisualFormat;
    colorStyle: ColorStyle;
    promptHash: string;
    imageHash: string;
    visualRepetitionScore: number;
    visualStoryAlignmentScore: number;
}, {
    id: string;
    category: string;
    date: string;
    topic: string;
    composition: VisualComposition;
    layout: string;
    visualFormat: VisualFormat;
    colorStyle: ColorStyle;
    promptHash: string;
    imageHash: string;
    visualRepetitionScore: number;
    visualStoryAlignmentScore: number;
}>;
export type RecentVisualMemoryEntry = z.infer<typeof RecentVisualMemoryEntrySchema>;
export declare const VisualQualityScoreSchema: z.ZodObject<{
    storyAlignment: z.ZodNumber;
    technicalClarity: z.ZodNumber;
    readability: z.ZodNumber;
    clutterLevel: z.ZodNumber;
    genericnessScore: z.ZodNumber;
    repetitionScore: z.ZodNumber;
    overallScore: z.ZodNumber;
    passed: z.ZodBoolean;
    rejectionReasons: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    rejectionReasons: string[];
    readability: number;
    passed: boolean;
    overallScore: number;
    storyAlignment: number;
    technicalClarity: number;
    clutterLevel: number;
    genericnessScore: number;
    repetitionScore: number;
}, {
    rejectionReasons: string[];
    readability: number;
    passed: boolean;
    overallScore: number;
    storyAlignment: number;
    technicalClarity: number;
    clutterLevel: number;
    genericnessScore: number;
    repetitionScore: number;
}>;
export type VisualQualityScore = z.infer<typeof VisualQualityScoreSchema>;
export declare const StructuredImagePromptSchema: z.ZodObject<{
    subject: z.ZodString;
    story: z.ZodString;
    visualFormat: z.ZodNativeEnum<typeof VisualFormat>;
    composition: z.ZodNativeEnum<typeof VisualComposition>;
    keyElements: z.ZodArray<z.ZodString, "many">;
    style: z.ZodNativeEnum<typeof ColorStyle>;
    purpose: z.ZodNativeEnum<typeof VisualPurpose>;
    negativePrompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    story: string;
    composition: VisualComposition;
    purpose: VisualPurpose;
    style: ColorStyle;
    keyElements: string[];
    visualFormat: VisualFormat;
    subject: string;
    negativePrompt: string;
}, {
    story: string;
    composition: VisualComposition;
    purpose: VisualPurpose;
    style: ColorStyle;
    keyElements: string[];
    visualFormat: VisualFormat;
    subject: string;
    negativePrompt: string;
}>;
export type StructuredImagePrompt = z.infer<typeof StructuredImagePromptSchema>;
export declare const VisualIntelligenceOutputSchema: z.ZodObject<{
    topicTitle: z.ZodString;
    visualFormat: z.ZodNativeEnum<typeof VisualFormat>;
    composition: z.ZodNativeEnum<typeof VisualComposition>;
    density: z.ZodNativeEnum<typeof VisualDensity>;
    purpose: z.ZodNativeEnum<typeof VisualPurpose>;
    colorStyle: z.ZodNativeEnum<typeof ColorStyle>;
    structuredPrompt: z.ZodObject<{
        subject: z.ZodString;
        story: z.ZodString;
        visualFormat: z.ZodNativeEnum<typeof VisualFormat>;
        composition: z.ZodNativeEnum<typeof VisualComposition>;
        keyElements: z.ZodArray<z.ZodString, "many">;
        style: z.ZodNativeEnum<typeof ColorStyle>;
        purpose: z.ZodNativeEnum<typeof VisualPurpose>;
        negativePrompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        story: string;
        composition: VisualComposition;
        purpose: VisualPurpose;
        style: ColorStyle;
        keyElements: string[];
        visualFormat: VisualFormat;
        subject: string;
        negativePrompt: string;
    }, {
        story: string;
        composition: VisualComposition;
        purpose: VisualPurpose;
        style: ColorStyle;
        keyElements: string[];
        visualFormat: VisualFormat;
        subject: string;
        negativePrompt: string;
    }>;
    linkedInImageBlueprint: z.ZodAny;
    devToImageBlueprint: z.ZodAny;
    visualStoryAlignmentScore: z.ZodNumber;
    visualRepetitionScore: z.ZodNumber;
    opportunityScore: z.ZodNumber;
    ragReferences: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    topicTitle: string;
    composition: VisualComposition;
    purpose: VisualPurpose;
    visualFormat: VisualFormat;
    colorStyle: ColorStyle;
    visualRepetitionScore: number;
    visualStoryAlignmentScore: number;
    density: VisualDensity;
    structuredPrompt: {
        story: string;
        composition: VisualComposition;
        purpose: VisualPurpose;
        style: ColorStyle;
        keyElements: string[];
        visualFormat: VisualFormat;
        subject: string;
        negativePrompt: string;
    };
    opportunityScore: number;
    ragReferences: string[];
    linkedInImageBlueprint?: any;
    devToImageBlueprint?: any;
}, {
    topicTitle: string;
    composition: VisualComposition;
    purpose: VisualPurpose;
    visualFormat: VisualFormat;
    colorStyle: ColorStyle;
    visualRepetitionScore: number;
    visualStoryAlignmentScore: number;
    density: VisualDensity;
    structuredPrompt: {
        story: string;
        composition: VisualComposition;
        purpose: VisualPurpose;
        style: ColorStyle;
        keyElements: string[];
        visualFormat: VisualFormat;
        subject: string;
        negativePrompt: string;
    };
    opportunityScore: number;
    ragReferences: string[];
    linkedInImageBlueprint?: any;
    devToImageBlueprint?: any;
}>;
export type VisualIntelligenceOutput = z.infer<typeof VisualIntelligenceOutputSchema>;
export interface LinkedInPostAnalyticsData {
    postId: string;
    postUrl?: string | null;
    publishedAt: string;
    text: string;
    title: string;
    hook?: string | null;
    topic: string;
    subtopic?: string | null;
    technology?: string | null;
    engineeringProblem?: string | null;
    category: string;
    format: string;
    storyFormat?: string | null;
    ctaType?: string | null;
    visualType?: string | null;
    visualConcept?: string | null;
    hashtags?: string[];
    wordCount?: number | null;
    impressions?: number | null;
    reach?: number | null;
    likes?: number | null;
    comments?: number | null;
    reposts?: number | null;
    shares?: number | null;
    saves?: number | null;
    clicks?: number | null;
    profileViews?: number | null;
    followersGained?: number | null;
    connectionRequests?: number | null;
    connectionAcceptance?: number | null;
    dms?: number | null;
    recruiterInteractions?: number | null;
    hiringManagerInteractions?: number | null;
    interviewInquiries?: number | null;
    portfolioClicks?: number | null;
    githubClicks?: number | null;
    externalLinkClicks?: number | null;
}
export interface NormalizedAnalyticsMetrics {
    engagementRate: number | null;
    commentRate: number | null;
    shareRate: number | null;
    saveRate: number | null;
    profileVisitRate: number | null;
    followerConversionRate: number | null;
    connectionConversionRate: number | null;
    careerOpportunityRate: number | null;
    technicalDiscussionRate: number | null;
    clickThroughRate: number | null;
    weightedCareerScore: number;
}
export interface WeightedCareerOutcomeWeights {
    careerInterviewSignal: number;
    recruiterHiringSignal: number;
    profileConversion: number;
    technicalDiscussion: number;
    connectionGrowth: number;
    portfolioGithubInterest: number;
    followerGrowth: number;
    qualityEngagement: number;
}
export interface ContentCategoryPerformance {
    category: string;
    postsCount: number;
    avgImpressions: number | null;
    medianImpressions: number | null;
    avgEngagementRate: number | null;
    commentRate: number | null;
    saveRate: number | null;
    shareRate: number | null;
    profileVisitRate: number | null;
    followerConversionRate: number | null;
    careerOpportunityRate: number | null;
    weightedCareerScore: number;
    signalStrength: "STRONG" | "MODERATE" | "WEAK" | "FATIGUED";
}
export interface TopicPerformanceReport {
    topicKey: string;
    technology: string;
    engineeringProblem: string;
    angle: string;
    format: string;
    postsCount: number;
    avgImpressions: number | null;
    careerOpportunityRate: number | null;
    technicalDiscussionRate: number | null;
    weightedCareerScore: number;
    lastUsedAt: string;
    semanticRepetitionScore: number;
}
export interface HookPerformanceReport {
    hookCategory: string;
    postsCount: number;
    avgProfileVisitRate: number | null;
    avgCommentRate: number | null;
    avgShareRate: number | null;
    avgCareerScore: number;
    repetitionWarning: boolean;
}
export interface StoryFormatPerformanceReport {
    storyFormat: string;
    postsCount: number;
    avgTechnicalDiscussionRate: number | null;
    avgProfileVisitRate: number | null;
    avgCareerOpportunityRate: number | null;
    avgFollowerConversionRate: number | null;
    weightedCareerScore: number;
}
export interface VisualPerformanceReport {
    visualType: string;
    postsCount: number;
    avgShareRate: number | null;
    avgSaveRate: number | null;
    avgCommentRate: number | null;
    avgProfileVisitRate: number | null;
    avgTechnicalDiscussionRate: number | null;
    weightedCareerScore: number;
    visualFatigueWarning: boolean;
}
export interface PostingTimePerformanceReport {
    timeWindow: string;
    sampleSize: number;
    medianImpressions: number | null;
    medianCareerScore: number | null;
    confidence: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_DATA";
    recommendationReason: string;
}
export interface AudienceQualityReport {
    audienceSegment: string;
    impressionSharePercent: number;
    relevantConversionPercent: number;
    audienceRelevanceRating: "HIGH" | "MEDIUM" | "LOW";
}
export interface ContentFatigueReport {
    technologyFatigue: number;
    topicFatigue: number;
    hookFatigue: number;
    visualFatigue: number;
    formatFatigue: number;
    explanations: string[];
}
export interface ContentExperimentReport {
    experimentId: string;
    variant: string;
    postsCount: number;
    metrics: NormalizedAnalyticsMetrics;
    careerOutcomesCount: number;
    statisticallySignificant: boolean;
}
export interface ContentGapInsight {
    category: string;
    opportunityType: string;
    reason: string;
    suggestedAction: string;
    evidence: string[];
}
export interface ContentStrategyDecision {
    action: "INCREASE" | "MAINTAIN" | "REDUCE" | "TEST" | "PAUSE" | "ROTATE_VISUAL" | "CHANGE_HOOK_STYLE" | "CHANGE_CTA" | "CHANGE_POSTING_WINDOW";
    target: string;
    reason: string;
    evidence: string[];
    confidence: number;
    sampleSize: number;
    timeWindowDays?: number;
}
export interface StrategyExperiment {
    postIndex: number;
    suggestedTopic: string;
    suggestedCategory: string;
    suggestedFormat: string;
    suggestedVisualType: string;
    rationale: string;
}
export interface AnalyticsInsight {
    id: string;
    type: "TOPIC_OUTPERFORM" | "TOPIC_FATIGUE" | "HOOK_CONVERSION" | "VISUAL_ENGAGEMENT" | "CAREER_SIGNAL" | "AUDIENCE_MISMATCH" | "POSTING_WINDOW";
    title: string;
    description: string;
    impactScore: number;
    evidence: string[];
}
export interface LinkedInAnalyticsDecision {
    analysisId: string;
    period: {
        start: string;
        end: string;
    };
    sampleSize: number;
    performanceSummary: {
        impressions: number | null;
        engagementRate: number | null;
        profileVisitRate: number | null;
        followerConversionRate: number | null;
        careerOpportunityRate: number | null;
    };
    insights: AnalyticsInsight[];
    fatigue: ContentFatigueReport;
    contentGaps: ContentGapInsight[];
    strategyDecisions: ContentStrategyDecision[];
    next3Posts: StrategyExperiment[];
    next5Posts: StrategyExperiment[];
    confidence: number;
    dataQuality: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT";
    generatedAt: string;
    topicWeightAdjustments?: Record<string, number>;
    topicPenalties?: Record<string, number>;
    cooldownExtensionDays?: Record<string, number>;
}
export * from "./notification-service";
//# sourceMappingURL=index.d.ts.map
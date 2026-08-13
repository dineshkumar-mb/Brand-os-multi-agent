import {
  AgentType,
  AgentResult,
  Topic,
  STARStory,
  StoryMode,
  VisualFormat,
  VisualComposition,
  VisualDensity,
  VisualPurpose,
  ColorStyle,
  VisualIntelligenceOutput,
  StructuredImagePrompt,
} from "@brand-os/shared";
import { VisualRAGStore } from "./visual-rag-store";
import { RecentVisualMemoryStore } from "./visual-memory";
import { VisualPatternExtractor } from "./visual-pattern-extractor";
import { VisualPlanningAgent, VisualPlanBlueprint } from "./visual-planning";

export class VisualIntelligenceAgent {
  private ragStore = new VisualRAGStore();
  private memoryStore = new RecentVisualMemoryStore();
  private patternExtractor = new VisualPatternExtractor();
  private visualPlanner = new VisualPlanningAgent();

  /**
   * Evaluates Visual + STAR Story Alignment Score (0 - 100)
   */
  public calculateStoryAlignmentScore(
    topic: Topic,
    starStory?: STARStory,
    visualFormat?: VisualFormat
  ): { alignmentScore: number; details: Record<string, number> } {
    let situationScore = 80;
    let taskScore = 80;
    let actionScore = 80;
    let resultScore = 80;

    if (starStory) {
      if (starStory.situation?.context) situationScore = 95;
      if (starStory.task?.objective) taskScore = 95;
      if (starStory.action?.chosenApproach) actionScore = 95;
      if (starStory.result?.outcome) resultScore = 95;
    }

    // Format alignment boost
    if (visualFormat) {
      if (visualFormat === VisualFormat.ARCHITECTURE_DIAGRAM || visualFormat === VisualFormat.SYSTEM_FLOW) actionScore = Math.min(100, actionScore + 5);
      if (visualFormat === VisualFormat.PERFORMANCE_BENCHMARK) resultScore = Math.min(100, resultScore + 5);
      if (visualFormat === VisualFormat.FAILURE_RECOVERY_MAP) taskScore = Math.min(100, taskScore + 5);
    }

    const alignmentScore = Math.round(
      situationScore * 0.25 + taskScore * 0.25 + actionScore * 0.3 + resultScore * 0.2
    );

    return {
      alignmentScore,
      details: { situationScore, taskScore, actionScore, resultScore },
    };
  }

  /**
   * Main Visual Intelligence Execution Pipeline
   */
  public generateVisualBlueprint(
    topic: Topic,
    starStory?: STARStory,
    storyMode?: StoryMode | string,
    pipelineId?: string
  ): AgentResult<VisualIntelligenceOutput> {
    const startTime = Date.now();
    console.log(`[Visual Intelligence Agent] Generating story-aware visual blueprint for topic: "${topic.title}"...`);

    // 1. RAG Retrieval of visual patterns
    const ragPatterns = this.ragStore.retrieveVisualPatterns(topic, storyMode, 3);
    const ragReferences = ragPatterns.map((p) => `${p.sourcePlatform}: ${p.topic} (${p.visualType})`);

    // 2. Query 14-day Visual Memory for recent color styles and formats
    const recentHistory = this.memoryStore.getHistory(14);
    const recentColorStyles = recentHistory.map((h) => h.colorStyle);

    // 3. Extract Pattern (Format, Composition, Density, Purpose, Color)
    let extracted = this.patternExtractor.extractPattern(
      topic,
      starStory,
      storyMode,
      ragPatterns,
      recentColorStyles
    );

    // 4. Calculate Visual Repetition Score against 14-day memory
    const promptHashSeed = `${topic.title}_${extracted.visualFormat}_${extracted.composition}`;
    let repetitionResult = this.memoryStore.calculateRepetitionScore({
      visualFormat: extracted.visualFormat,
      composition: extracted.composition,
      colorStyle: extracted.colorStyle,
      promptHash: promptHashSeed,
      topic: topic.title,
    });

    // If repetition score > 35, trigger automatic visual format & color rotation
    if (repetitionResult.repetitionScore > 35) {
      console.log(`[VISUAL_FILTER] High visual repetition detected (${repetitionResult.repetitionScore}/100: ${repetitionResult.reason}). Rotating visual format and color strategy...`);

      const alternativeFormats = Object.values(VisualFormat).filter(
        (f) => f !== extracted.visualFormat && !recentHistory.slice(0, 5).some((h) => h.visualFormat === f)
      );

      if (alternativeFormats.length > 0) {
        extracted.visualFormat = alternativeFormats[Math.floor(Math.random() * alternativeFormats.length)];
      }

      const alternativeColors = Object.values(ColorStyle).filter(
        (c) => c !== extracted.colorStyle && !recentHistory.slice(0, 3).some((h) => h.colorStyle === c)
      );

      if (alternativeColors.length > 0) {
        extracted.colorStyle = alternativeColors[Math.floor(Math.random() * alternativeColors.length)];
      }

      // Recalculate repetition score post-rotation
      repetitionResult = this.memoryStore.calculateRepetitionScore({
        visualFormat: extracted.visualFormat,
        composition: extracted.composition,
        colorStyle: extracted.colorStyle,
        promptHash: `${topic.title}_${extracted.visualFormat}_rotated`,
        topic: topic.title,
      });
    }

    // 5. Evaluate Visual + STAR Story Alignment Score
    const alignment = this.calculateStoryAlignmentScore(topic, starStory, extracted.visualFormat);

    // 6. Calculate Visual Opportunity Score (30% relevance, 25% story alignment, 15% trend velocity, 15% originality, 10% readability, 5% history)
    const trendVelocityScore = Math.min(100, topic.trend_velocity * 10);
    const originalityScore = Math.max(0, 100 - repetitionResult.repetitionScore);
    const opportunityScore = Math.round(
      95 * 0.3 +
      alignment.alignmentScore * 0.25 +
      trendVelocityScore * 0.15 +
      originalityScore * 0.15 +
      90 * 0.1 +
      85 * 0.05
    );

    // 7. Generate Structured Image Prompt
    const structuredPrompt: StructuredImagePrompt = {
      subject: `${topic.title} (${topic.framework || topic.category}) System Blueprint`,
      story: starStory?.situation?.context || `Technical architecture story for ${topic.title}`,
      visualFormat: extracted.visualFormat,
      composition: extracted.composition,
      keyElements: extracted.keyElements,
      style: extracted.colorStyle,
      purpose: extracted.purpose,
      negativePrompt: "No generic AI robots, no futuristic cities, no humanoids, no generic stock art, no cluttered text, no floating glowing brains",
    };

    // 8. Generate Platform-Differentiated Blueprints (LinkedIn vs Dev.to)
    const basePlan = this.visualPlanner.createVisualPlan(topic, pipelineId);
    const linkedInImageBlueprint: VisualPlanBlueprint = {
      ...basePlan.data,
      topicConcept: `${topic.title} (Mobile Ingress)`,
      imagePrompt: `A 16:9 high-readability mobile-optimized technical visual titled "${topic.title}". Style: ${extracted.colorStyle}. Composition: ${extracted.composition}. Key elements: ${extracted.keyElements.slice(0, 3).join(", ")}.`,
    };

    const devToImageBlueprint: VisualPlanBlueprint = {
      ...basePlan.data,
      topicConcept: `${topic.title} (Deep Architecture Blueprint)`,
      imagePrompt: `A 16:9 comprehensive technical documentation blueprint titled "${topic.title}". Style: ${extracted.colorStyle}. Composition: ${extracted.composition}. Key elements: ${extracted.keyElements.join(", ")}. Clean engineering typography and vector flow markers.`,
    };

    // 9. Record Memory Entry
    const memoryId = `vmem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.memoryStore.recordEntry({
      id: memoryId,
      date: new Date().toISOString(),
      topic: topic.title,
      category: topic.category,
      visualFormat: extracted.visualFormat,
      composition: extracted.composition,
      layout: `${extracted.composition}_${extracted.density}`,
      colorStyle: extracted.colorStyle,
      promptHash: promptHashSeed,
      imageHash: memoryId,
      visualRepetitionScore: repetitionResult.repetitionScore,
      visualStoryAlignmentScore: alignment.alignmentScore,
    });

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: Math.min(100, opportunityScore),
      data: {
        topicTitle: topic.title,
        visualFormat: extracted.visualFormat,
        composition: extracted.composition,
        density: extracted.density,
        purpose: extracted.purpose,
        colorStyle: extracted.colorStyle,
        structuredPrompt,
        linkedInImageBlueprint,
        devToImageBlueprint,
        visualStoryAlignmentScore: alignment.alignmentScore,
        visualRepetitionScore: repetitionResult.repetitionScore,
        opportunityScore,
        ragReferences,
      },
      validationResult: {
        passed: alignment.alignmentScore >= 80 && repetitionResult.repetitionScore <= 35,
        errors: [],
        warnings: repetitionResult.repetitionScore > 30 ? ["Repetition score near threshold"] : [],
      },
      metadata: {
        agentType: AgentType.VISUAL_INTELLIGENCE,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}

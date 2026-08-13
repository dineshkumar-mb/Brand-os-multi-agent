import {
  Topic,
  STARStory,
  StoryMode,
  VisualFormat,
  VisualComposition,
  VisualDensity,
  VisualPurpose,
  ColorStyle,
  VisualRAGPattern,
} from "@brand-os/shared";

export interface PatternExtractionResult {
  visualFormat: VisualFormat;
  composition: VisualComposition;
  density: VisualDensity;
  purpose: VisualPurpose;
  colorStyle: ColorStyle;
  keyElements: string[];
}

export class VisualPatternExtractor {
  public extractPattern(
    topic: Topic,
    starStory?: STARStory,
    storyMode?: StoryMode | string,
    ragPatterns: VisualRAGPattern[] = [],
    recentColorStyles: ColorStyle[] = []
  ): PatternExtractionResult {
    const topicText = (topic.title + " " + topic.category + " " + (topic.framework || "")).toLowerCase();

    // 1. Map StoryMode to VisualFormat & Purpose
    let visualFormat = VisualFormat.ARCHITECTURE_DIAGRAM;
    let purpose = VisualPurpose.SHOW_ARCHITECTURE;
    let composition = VisualComposition.LEFT_TO_RIGHT;

    if (storyMode === StoryMode.FAILURE_STORY || storyMode === StoryMode.DEBUGGING_STORY) {
      visualFormat = VisualFormat.FAILURE_RECOVERY_MAP;
      purpose = VisualPurpose.EXPOSE_PROBLEM;
      composition = VisualComposition.FLOWCHART;
    } else if (storyMode === StoryMode.PERFORMANCE_STORY) {
      visualFormat = VisualFormat.PERFORMANCE_BENCHMARK;
      purpose = VisualPurpose.SHOW_PERFORMANCE;
      composition = VisualComposition.SPLIT_SCREEN;
    } else if (storyMode === StoryMode.DECISION_STORY || storyMode === StoryMode.CONTRARIAN_OBSERVATION) {
      visualFormat = VisualFormat.DECISION_MATRIX;
      purpose = VisualPurpose.COMPARE;
      composition = VisualComposition.DECISION_TREE;
    } else if (storyMode === StoryMode.BEFORE_AFTER) {
      visualFormat = VisualFormat.BEFORE_AFTER_COMPARISON;
      purpose = VisualPurpose.COMPARE;
      composition = VisualComposition.BEFORE_AFTER;
    } else if (storyMode === StoryMode.BUILD_IN_PUBLIC) {
      visualFormat = VisualFormat.BUILD_PROGRESS;
      purpose = VisualPurpose.DEMONSTRATE;
      composition = VisualComposition.PIPELINE;
    } else if (topicText.includes("agent") || topicText.includes("mcp") || topicText.includes("multi-agent")) {
      visualFormat = VisualFormat.AGENT_WORKFLOW;
      purpose = VisualPurpose.EXPLAIN;
      composition = VisualComposition.PIPELINE;
    } else if (topicText.includes("postgres") || topicText.includes("redis") || topicText.includes("db") || topicText.includes("database")) {
      visualFormat = VisualFormat.DATA_FLOW;
      purpose = VisualPurpose.SHOW_ARCHITECTURE;
      composition = VisualComposition.LAYERED_ARCHITECTURE;
    }

    // 2. Information Density
    let density = VisualDensity.MEDIUM;
    if (topicText.includes("deepseek") || topicText.includes("b-tree") || topicText.includes("kernel") || topicText.includes("grpc")) {
      density = VisualDensity.HIGH;
    } else if (storyMode === StoryMode.CONTRARIAN_OBSERVATION) {
      density = VisualDensity.MINIMAL;
    }

    // 3. Color Style Rotation (Avoid matching recent post color styles)
    const availableColors = [
      ColorStyle.LIGHT_TECHNICAL_BLUEPRINT,
      ColorStyle.DARK_CONTRAST,
      ColorStyle.HIGH_CONTRAST_DIAGRAM,
      ColorStyle.NEUTRAL_DOCUMENTATION,
      ColorStyle.GREEN_TERMINAL,
      ColorStyle.WARM_EDITORIAL,
      ColorStyle.MONOCHROME_ARCHITECTURE,
    ];

    const freshColors = availableColors.filter((c) => !recentColorStyles.includes(c));
    const colorStyle = freshColors.length > 0
      ? freshColors[Math.floor(Math.random() * freshColors.length)]
      : availableColors[0];

    // 4. Extract Key Elements from STAR Story or RAG Patterns
    const keyElements: string[] = [];
    if (starStory) {
      if (starStory.task?.objective) keyElements.push(starStory.task.objective.substring(0, 30));
      if (starStory.action?.chosenApproach) keyElements.push(starStory.action.chosenApproach.substring(0, 30));
      if (starStory.result?.outcome) keyElements.push(starStory.result.outcome.substring(0, 30));
    }

    if (keyElements.length < 3 && ragPatterns.length > 0) {
      ragPatterns.forEach((p) => {
        p.keyElements.forEach((ke) => {
          if (!keyElements.includes(ke) && keyElements.length < 5) keyElements.push(ke);
        });
      });
    }

    if (keyElements.length === 0) {
      keyElements.push("Ingress Gateway", "Processing Core", "State Database", "Telemetry Observer");
    }

    return {
      visualFormat,
      composition,
      density,
      purpose,
      colorStyle,
      keyElements,
    };
  }
}

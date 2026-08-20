# Audit: Visual Generation Flow

## Visual Blueprint & Image Generation Pipeline

1. **Visual Blueprint Generation**:
   - `VisualPlanningAgent.createVisualPlan(topic)` checks topic title keywords ("deepseek", "typescript", "docker", "security").
   - If a keyword matches, a static `DiagramSpec` is generated with 2 columns.
   - If no keyword matches, a dynamic default 2-column blueprint is created.

2. **SVG Rendering**:
   - `VisualPlanningAgent.generateDiagramSvg(spec)` builds an SVG XML string with node circles, headers, and colored vector borders.
   - The SVG string is converted to a Data URL (`data:image/svg+xml;utf8,...`) and attached to `linkedInPost.imageUrl` and `devToArticle.mainImage`.

3. **Visual Quality & Memory Check**:
   - `VisualReviewAgent` checks logo presence and color contrast.
   - `VisualHistoryTracker` saves the concept hash (`topicTitle_diagramType`) to `visual_history.json`.
   - Checks if the exact hash matches any of the last 3 concepts.

4. **Identified Bottlenecks**:
   - Only 4 static keyword templates exist.
   - History window is limited to 3 items.
   - Image prompt generation is derived from topic title rather than final post engineering context.
   - No vector embedding comparison for image similarity or rotation across 15 visual styles.

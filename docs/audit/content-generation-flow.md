# Audit: Content Generation Flow

## Detailed Content Generation Pipeline

1. **Trend & Candidate Ingestion**:
   - `MultiSourceCollectorEngine` collects raw signals from Official Labs, GitHub Trending, Model Hubs, Communities, ArXiv, and Framework Monitors.
   - `SignalNormalizer` converts signals into `NormalizedSignal`.
   - `CanonicalEventEngine` groups signals into `CanonicalEvent`.
   - `ContentOpportunityGenerator` creates raw `ContentOpportunity` candidates.

2. **Topic Evaluation & Selection**:
   - `TopicIntelligenceAgent` evaluates candidates against post history using Jaccard word-matching.
   - The first passing candidate is selected (`selectedTopic`).

3. **Context & Experience Mining**:
   - `TechnicalResearchAgent` synthesizes technical insights and code snippets.
   - `ExperienceMiningAgent` searches stored `ExperienceLog` entries (or falls back to research mode).
   - `AudienceResearchAgent` and `PersonalBrandStrategyAgent` map persona and brand pillars.

4. **Prose Generation & Refinement**:
   - `EngineeringReasoningAgent` creates an internal STAR framework (`STARStory`).
   - `TechnicalWriterAgent` generates LinkedIn post payload and Dev.to article payload.
   - `StorytellingAgent` formats narrative flow.
   - `HumanizationAgent` removes AI cliché phrases.

5. **Quality Review & Decision Gate**:
   - `TechnicalReviewerAgent` audits code snippets and technical claims.
   - `OriginalityAgent` checks hybrid similarity against post history.
   - `DecisionGateAgent` checks passing conditions and triggers publishing via `PublisherAgent` or aborts.

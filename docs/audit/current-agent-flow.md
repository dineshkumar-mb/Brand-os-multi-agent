# Audit: Current Agent Flow

## Agent Execution Chain Overview

The current orchestration pipeline in `packages/agents/src/index.ts` (`AgentOrchestrator`) executes as follows:

```
[TrendDiscoveryAgent]
       ↓ (returns single batch of topics)
[TopicIntelligenceAgent]
       ↓ (evaluates decay penalty using Jaccard word-matching)
[ContentGapAgent]
       ↓ (tracks portfolio domains)
[AudienceResearchAgent]
       ↓ (determines audience personas)
[PersonalBrandStrategyAgent]
       ↓ (identifies brand pillars)
[TechnicalResearchAgent]
       ↓ (fetches key insights)
[KnowledgeGraphAgent]
       ↓ (maps concept nodes)
[ExperienceMiningAgent]
       ↓ (mines stored experience logs)
[TechnicalWriterAgent]
       ↓ (generates LinkedIn & Dev.to prose)
[StorytellingAgent]
       ↓ (applies developer story flow)
[HumanizationAgent]
       ↓ (strips AI clichés)
[TechnicalReviewerAgent & OriginalityAgent Loop]
       ↓ (audits technical accuracy and similarity)
[SeoAndEngagementAgent]
       ↓ (optimizes SEO metadata)
[VisualPlanningAgent & VisualIntelligenceAgent & VisualReviewAgent]
       ↓ (generates visual plan blueprint & SVG)
[DecisionGateAgent]
       ↓ (approves/rejects publishing)
[PublisherAgent]
       ↓ (publishes content if approved)
[ContinuousLearningAgent & DiversityReportAgent]
```

## Architectural Gaps Identified in Current Flow
1. **Single Candidate Selection Bias**: `TopicIntelligenceAgent` takes the list from `TrendDiscoveryAgent` and selects the first candidate that passes basic Jaccard filtering (`scoredTopics[0]`). There is **no Candidate Competition Engine** evaluating alternative topics side-by-side or ranking top 5 opportunities.
2. **Missing Input Memory Injection**: `ExperienceMiningAgent` is invoked without loading stored `ExperienceLog` entries from the database or disk in the main orchestrator, causing default fallback to generic non-matching experience templates.
3. **Linear Pipeline without Early Competitor Rejection**: If the selected topic turns out to have low personal experience match or weak technical depth, the orchestrator does not fall back to Candidate #2, Candidate #3, or `NO_POST_TODAY`.

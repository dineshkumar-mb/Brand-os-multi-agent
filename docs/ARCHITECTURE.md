# System Architecture Specifications

## 1. Clean Monorepo Layering

Personal Brand OS enforces Clean Architecture with unidirectional dependency flows:

```
[apps/web] ---> [apps/api] ---> [packages/agents] ---> [packages/ai-gateway]
                                        |                       |
                                        v                       v
                              [packages/mcp-client]   [Provider APIs]
                                        |
                                        v
                              [packages/database]
```

## 2. Event-Driven Asynchronous Processing
Instead of direct synchronous function chaining, agent communication is mediated by an event bus (`packages/agents/src/index.ts` -> `AgentEventBus`):
- `TrendFound`: Emitted when Trend Discovery Agent identifies high-velocity topics.
- `ResearchCompleted`: Emitted when Deep Research Agent finishes context scraping.
- `FactVerified`: Emitted when Fact Verification Agent approves claims with >85% confidence score.
- `ContentGenerated`: Emitted when Writer Agent produces LinkedIn post & Medium draft.
- `ReviewCompleted`: Emitted when Reviewer & Critic Agents score content readability & SEO.
- `Approved`: Emitted when Human-in-the-Loop user approves scheduled post.
- `Published`: Emitted when Publisher Adapter completes social media API post.

## 3. Storage Tiering
- **PostgreSQL**: Transactional storage for Users, Profiles, Posts, Articles, Schedules, Gateway Logs, and Benchmarks.
- **Redis**: Pub/Sub event bus and BullMQ job queue management.
- **ChromaDB**: High-dimensional vector store holding personal writing style embeddings, top-performing hooks, and user career achievements.
- **Neo4j**: Entity knowledge graph linking `Topic -> Post -> Engagement -> Learning Agent` to track technical concept synergies.

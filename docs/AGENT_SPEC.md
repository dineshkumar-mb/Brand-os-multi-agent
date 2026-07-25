# Autonomous Multi-Agent Specifications

Personal Brand OS features 12 specialized autonomous agents:

1. **Trend Discovery Agent**: Collects trending technical topics from GitHub, Reddit, RSS, and Hacker News.
2. **Autonomous Deep Research Agent**: Performs multi-step research (Search -> Collect -> Summarize -> Fact Check -> Compare -> Extract Insights).
3. **Fact Verification Agent**: Verifies claims against official documentation and rejects unsupported statements.
4. **Writing Style RAG Agent**: Manages user tone embeddings in ChromaDB.
5. **Content Strategy Agent**: Optimizes posting release windows and target platforms.
6. **LinkedIn Generator Agent**: Crafts viral LinkedIn hooks, storytelling posts, and carousel slides.
7. **Medium Writer Agent**: Generates 1,500 - 3,000 word technical articles with architecture diagrams and FAQ.
8. **Reviewer Agent**: Scores readability, engagement, SEO, and novelty (threshold >= 85%).
9. **Critic Agent**: Challenges technical assumptions and prevents hallucinations.
10. **SEO Agent**: Optimizes meta descriptions, tags, and table of contents.
11. **Publisher Agent**: Schedules and posts content via LinkedIn and Medium adapters.
12. **Learning Agent**: Weekly self-improving feedback loop updating style vector embeddings based on post analytics.

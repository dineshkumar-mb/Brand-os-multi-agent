# Audit: Repetition Root Cause

## Diagnostic Analysis of Content & Topic Repetition

### 1. Jaccard-Only Word Token Similarity Matching
In `packages/agents/src/agents/topic-intelligence.ts` and `packages/agents/src/agents/originality.ts`, similarity calculation relied on string tokenization and Jaccard set intersection.
- **Symptom**: Slight rephrasings of the same core concept (e.g., "Redis Streams in Multi-Agent Swarms" vs "Why Redis Streams are Perfect for Tool Calling Queues") had a Jaccard token similarity score < 0.45.
- **Root Cause**: Title-only lexical token matching ignores semantic equivalence, vector embedding similarity, technology overlap, problem context, and engineering narrative angle.

### 2. Flat Cooldown vs Hierarchical Cooldown
The prior system lacked a multi-tier cooldown hierarchy (`Technology` -> `Subtopic` -> `Concept` -> `Problem` -> `Engineering Angle` -> `Story` -> `Hook`).
- **Symptom**: The system either allowed the same technology (e.g., Redis, MCP) every day or completely banned a keyword.
- **Root Cause**: Absence of semantic entity breakdown prevented the system from distinguishing distinct technical angles on the same technology versus repetitive concept loops.

### 3. Static Keyword Visual Template Mapping
In `packages/agents/src/agents/visual-planning.ts`:
- **Symptom**: Visuals for DeepSeek, Docker, and TypeScript repeatedly rendered nearly identical SVG structures.
- **Root Cause**: The agent used deterministic keyword matching (`if title.includes("deepseek") return staticSpec`) and tracked visual memory using a short 3-item string hash list without vector image embedding comparison or 15-style visual rotation.

### 4. Lack of Candidate Competition
- **Symptom**: The system generated posts on whichever topic was picked first, even if that topic scored poorly on experience match or freshness.
- **Root Cause**: No Candidate Competition Engine evaluated a pool of 30+ candidates to select the top 5 opportunities and compare them side-by-side.

# Personal Brand OS

> **Autonomous Multi-Agent AI Platform for Personal Brand Growth (LinkedIn + Medium)**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=for-the-badge&logo=vercel)](https://brand-os-multi-agent.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/dineshkumar-mb/Brand-os-multi-agent)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-cyan?style=for-the-badge&logo=react)](https://react.dev/)

Personal Brand OS is an enterprise-grade autonomous multi-agent platform designed for Staff Engineers, Tech Leaders, and Content Creators. It automatically discovers trending technical topics across GitHub, Reddit, and RSS feeds, performs deep research with fact-verification, learns the user's style via vector RAG, generates viral LinkedIn posts and Medium technical articles, schedules content, tracks engagement analytics, and automatically feeds performance data back into a self-improving agentic feedback loop.

---

## 📐 System Architecture Diagram

```mermaid
flowchart TB
    %% Multi-Color Class Styling Definitions
    classDef clientStyle fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef apiStyle fill:#059669,stroke:#34d399,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef swarmStyle fill:#6366f1,stroke:#818cf8,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef aiStyle fill:#d97706,stroke:#fbbf24,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef dataStyle fill:#e11d48,stroke:#fb7185,stroke-width:2px,color:#ffffff,font-weight:bold;

    subgraph ClientLayer ["🩵 Client Layer (React 19 Frontend UI)"]
        UI["📱 React 19 + Vite Dashboard UI\n(https://brand-os-multi-agent.vercel.app)"]:::clientStyle
        ApiClient["⚡ Dynamic API Client\n(Adapts Local vs Vercel Serverless)"]:::clientStyle
        UI -.->|User Actions| ApiClient
    end

    subgraph APIBackend ["💚 API Gateway & Routing Layer"]
        ServerlessAPI["☁️ Vercel Serverless Express API\n(/api/v1/*)"]:::apiStyle
        LocalAPI["💻 Local Express Server\n(http://localhost:4000/api/v1/*)"]:::apiStyle
        ApiClient == Production ==> ServerlessAPI
        ApiClient == Local Dev ==> LocalAPI
    end

    subgraph SwarmOrchestration ["💜 Autonomous 12-Agent Swarm Engine"]
        Orchestrator["👑 Agent Swarm Orchestrator"]:::swarmStyle
        TrendAgent["🔍 1. Multi-Site Trend Discovery Agent"]:::swarmStyle
        ResearchAgent["📚 2. Deep Technical Research Agent"]:::swarmStyle
        FactAgent["🛡️ 3. Fact Verification Agent"]:::swarmStyle
        WriterAgent["✍️ 4. Viral LinkedIn & Medium Writer Agents"]:::swarmStyle
        ReviewerAgent["🎯 5. Quality Gatekeeper Reviewer Agent"]:::swarmStyle
        PublisherAgent["📢 6. Social Media Publisher Agent"]:::swarmStyle

        Orchestrator -.-> TrendAgent
        TrendAgent -.-> ResearchAgent
        ResearchAgent -.-> FactAgent
        FactAgent -.-> WriterAgent
        WriterAgent -.-> ReviewerAgent
        ReviewerAgent -.-> PublisherAgent
    end

    subgraph AIGateway ["🧡 Multi-Provider AI Gateway"]
        Router["🔀 AI Router & Cascade Failover"]:::aiStyle
        OpenRouter["✨ OpenRouter API\n(google/gemini-2.0-flash-lite-001)"]:::aiStyle
        NVIDIA["🚀 NVIDIA NIM API\n(meta/llama-3.1-405b-instruct)"]:::aiStyle
        OpenAI["🤖 OpenAI API (gpt-4o / gpt-4o-mini)"]:::aiStyle
        Ollama["🦙 Ollama Local (llama3)"]:::aiStyle

        Router --> OpenRouter
        Router --> NVIDIA
        Router --> OpenAI
        Router --> Ollama
    end

    subgraph DataIntegrations ["🩷 External Integrations & Databases"]
        LinkedIn["🔗 LinkedIn REST API v2\n(ugcPosts & OAuth 2.0)"]:::dataStyle
        Medium["📝 Medium Publishing API"]:::dataStyle
        Postgres["🐘 PostgreSQL / Prisma ORM"]:::dataStyle
        Chroma["🗂️ ChromaDB Vector Store (RAG Memory)"]:::dataStyle
        Redis["⚡ Redis Streams Event Bus"]:::dataStyle
    end

    ServerlessAPI ==>|Trigger Request| Orchestrator
    LocalAPI ==>|Trigger Request| Orchestrator
    ResearchAgent -.->|Fetch LLM Synthesis| Router
    WriterAgent -.->|Generate Viral Post| Router
    PublisherAgent ==>|Post Live Content| LinkedIn
    PublisherAgent ==>|Publish Draft| Medium
    Orchestrator --- Postgres
    Orchestrator --- Chroma
    Orchestrator --- Redis

    linkStyle default stroke:#818cf8,stroke-width:2px,stroke-dasharray: 4 4;
```

---

## 🌐 Dynamic API Endpoints Reference

The platform features **dynamic dual-environment API routing**:
- **Production (Vercel):** `https://brand-os-multi-agent.vercel.app/api/v1`
- **Local Development:** `http://localhost:4000/api/v1`

### 🔑 Authentication & Profile Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue JWT token |
| `GET` | `/api/v1/auth/me` | Fetch active user profile and permissions |

### 🤖 Multi-Agent Swarm & Research Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/agents/status` | Get real-time status of all 12 autonomous swarm agents |
| `POST` | `/api/v1/agents/trigger` | Trigger full end-to-end multi-agent execution pipeline |
| `GET` | `/api/v1/trends` | Fetch latest discovered technical topics and trend velocity scores |
| `POST` | `/api/v1/trends/scan` | Trigger live scan across GitHub, Reddit, and RSS feeds |
| `POST` | `/api/v1/research` | Conduct deep technical research on a given topic |

### 🧠 Multi-Provider AI Gateway Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/gateway/benchmarks` | Retrieve model performance, token usage, latency, and costs |
| `GET` | `/api/v1/gateway/logs` | Fetch AI Gateway execution and failover logs |
| `POST` | `/api/v1/gateway/execute` | Execute custom prompt with auto-routing (OpenRouter, NVIDIA NIM, OpenAI) |
| `POST` | `/api/v1/chat` | Server-Sent Events (SSE) stream for AI Copilot chat assistant |

### 📄 Content Generation & Social Media Publishing Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/posts` | List generated LinkedIn post payloads, hooks, and slide outlines |
| `GET` | `/api/v1/articles` | List generated Medium technical article markdown drafts |
| `POST` | `/api/v1/publish` | Dispatch post payload to LinkedIn REST API or Medium API |
| `POST` | `/api/v1/schedule` | Schedule post for future publication via BullMQ queue |
| `GET` | `/api/v1/jobs` | Monitor status of background publishing jobs |

### 📊 Analytics, Plugins & System Health
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard` | Summary dashboard KPIs (views, CTR, follower growth, active agents) |
| `GET` | `/api/v1/analytics` | Deep post performance metrics and learning feedback loop telemetry |
| `GET` | `/api/v1/plugins` | List available marketplace plugins (Dev.to, Hashnode, Slack) |
| `POST` | `/api/v1/plugins/execute` | Execute third-party marketplace plugin action |
| `GET` | `/health` | System health check endpoint |
| `GET` | `/metrics` | Prometheus metrics telemetry export |

---

## 🏛️ Enterprise Monorepo Folder Structure

```text
personal-brand-os/
├── api/                        # Vercel Serverless Function API Entry Point
│   └── index.ts
│
├── client/                     # React 19 + Vite Frontend SaaS Application
│   ├── src/                    # Components, Pages, and REST/SSE Services
│   ├── index.html
│   └── vite.config.ts
│
├── server/                     # Express API Server Gateway
│   ├── src/                    # Controllers, Middleware, Routes, SSE Engine
│   └── package.json
│
├── worker/                     # Background Service Job Processor & Swarm Loop
│   └── src/main.ts
│
├── packages/                   # Core Shared Domain Libraries
│   ├── shared/                 # Zod Validation Schemas, Enums, TypeScript Types
│   ├── database/               # Prisma Schema, Database Client, and Seeding Script
│   ├── ai-gateway/             # Multi-Provider Router (OpenRouter, NVIDIA NIM, OpenAI)
│   ├── mcp-client/             # MCP Tool Bindings (GitHub, Reddit, RSS, Search, Browser)
│   ├── plugins/                # Plugin Marketplace Registry (Dev.to, Hashnode, Slack)
│   ├── agents/                 # Autonomous Multi-Agent Swarm & Redis Event Bus
│   ├── publisher/              # Social Media Adapters (LinkedIn REST API, Medium API)
│   ├── scheduler/              # BullMQ Cron Job Scheduler
│   └── analytics/              # Metric Aggregator & Learning Loop Feedback
│
├── docker/                     # Production Container Configurations
├── docs/                       # Architecture Specs & Setup Guides
├── vercel.json                 # Vercel Deployment & Serverless Rewrite Config
└── package.json                # Root Workspace Scripts
```

---

## 🚀 Quick Start — How to Run Locally

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `pnpm` (recommended) or `npm`
- **Docker Desktop**: Optional (required if using local PostgreSQL, Redis, ChromaDB)

### 2. Install Workspace Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Fill in your credentials in `.env` (e.g. `OPENROUTER_API_KEY`, `NVIDIA_NIM_API_KEY`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_ACCESS_TOKEN`).

### 4. Start Local Infrastructure Services (Optional)
To launch PostgreSQL, Redis, ChromaDB, and Neo4j containers locally via Docker:
```bash
npm run docker:up
```

### 5. Initialize & Seed Database
Generate Prisma Client, push schema, and populate demo data:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 6. Start Development Servers
Runs the Web Dashboard (`http://localhost:3000`), Backend API (`http://localhost:4000`), and Background Worker concurrently:
```bash
npm run dev
```

---

## 🛠️ Workspace CLI Commands Reference

All workspace scripts can be run from the root directory using `npm run <command>` or `pnpm <command>`:

| Category | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Runs **Web UI**, **API Gateway**, and **Worker** concurrently |
| **Development** | `npm run dev:web` | Starts only the **React 19 + Vite Frontend** (`http://localhost:3000`) |
| **Development** | `npm run dev:api` | Starts only the **Express Backend API** (`http://localhost:4000`) |
| **Development** | `npm run dev:worker` | Starts only the **Background Worker** swarm service |
| **Build & Quality**| `npm run build` | Builds production bundles for all workspace applications & packages |
| **Build & Quality**| `npm run typecheck` | Runs TypeScript type checking across all workspace packages |
| **Build & Quality**| `npm run test` | Runs unit & integration test suites using Vitest |
| **Database** | `npm run db:generate` | Generates Prisma Client types from database schema |
| **Database** | `npm run db:push` | Pushes Prisma schema changes directly to the PostgreSQL database |
| **Database** | `npm run db:seed` | Seeds the database with baseline admin, swarm agents, and benchmark data |
| **Docker** | `npm run docker:up` | Starts local database and queue containers (`docker-compose up -d`) |
| **Docker** | `npm run docker:down` | Stops local database and queue containers (`docker-compose down`) |

---

## 🐳 Running via Docker Compose (Full Container Stack)

To run the entire platform as fully containerized microservices without needing local Node.js:

```bash
# 1. Build and launch containers in background
docker-compose up --build -d

# 2. Access Web Dashboard UI
# Open: http://localhost:3000

# 3. Access Backend API Gateway Health Check
# Open: http://localhost:4000/health
```

---

## 📚 Complete Documentation Links
- [Local Setup & Running Guide](docs/LOCAL_SETUP.md)
- [Architecture Specifications](docs/ARCHITECTURE.md)
- [AI Gateway Documentation](docs/AI_GATEWAY.md)
- [MCP Integration Specs](docs/MCP_INTEGRATION.md)
- [Agent Specifications](docs/AGENT_SPEC.md)


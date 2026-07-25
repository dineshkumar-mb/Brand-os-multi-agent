# Personal Brand OS — Local Setup & Development Guide

This guide details how to run the enterprise multi-agent platform locally according to industry standards.

---

## 📂 Industrial Monorepo Folder Structure

```text
personal-brand-os/
├── client/                     # React 19 + Vite Frontend SaaS Application (formerly apps/web)
│   ├── src/                    # UI Components, Pages, and REST/SSE Services
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Express / NestJS Backend API Gateway (formerly apps/api)
│   ├── src/                    # Route Controllers, Middleware, SSE Stream Engine
│   └── package.json
│
├── worker/                     # Background Service Job Processor (formerly workers)
│   └── src/main.ts             # Background Cron & Swarm Execution Loop
│
├── gateway/                    # OmniRoute AI Gateway Integration
│
├── packages/                   # Core Shared Domain Libraries
│   ├── shared/                 # Zod Validation Schemas, Enums, TypeScript Types
│   ├── database/               # Prisma Schema, Database Client, and Seeding Script
│   ├── ai-gateway/             # Multi-Provider Router, Failover, Token & Cost Calculator
│   ├── mcp-client/             # MCP Tool Bindings (GitHub, Reddit, RSS, Search, Browser)
│   ├── plugins/                # Plugin Marketplace Registry (Dev.to, Hashnode, Slack)
│   ├── agents/                 # LangGraph Multi-Agent Swarm & Redis Event Bus
│   ├── publisher/              # Social Media Adapters (LinkedIn, Medium)
│   ├── scheduler/              # BullMQ Cron Job Scheduler
│   └── analytics/              # Metric Aggregator & Learning Loop Feedback
│
├── docker/                     # Production Container Configurations
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── Dockerfile.worker
│
├── docs/                       # Architecture Specs & Guides
│   ├── ARCHITECTURE.md
│   ├── AI_GATEWAY.md
│   ├── MCP_INTEGRATION.md
│   ├── AGENT_SPEC.md
│   └── LOCAL_SETUP.md
│
├── docker-compose.yml          # Local Stack (PostgreSQL, Redis, ChromaDB, Neo4j)
├── .env.example                # Environment Variable Template
├── pnpm-workspace.yaml         # Monorepo Workspace Definition
└── package.json                # Root Workspace Scripts
```

---

## 🛠️ Step-by-Step Local Running Guide

### Option A: Run via Monorepo Development Server (Recommended)

#### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm` / `npx` / `pnpm`
- **Docker Desktop**: Running locally (for Postgres, Redis, ChromaDB)

#### 2. Install Dependencies
```bash
npx pnpm install
```

#### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: Insert your OpenAI, Gemini, or Anthropic API keys into `.env`)*

#### 4. Start Infrastructure Containers
Launch PostgreSQL, Redis, ChromaDB, and Neo4j in the background:
```bash
npm run docker:up
```

#### 5. Initialize & Seed Database
Generate Prisma Client, push schema to Postgres, and seed demo admin data:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

#### 6. Start All Services in Development Mode
Runs Web Frontend (`http://localhost:3000`), Backend API (`http://localhost:4000`), and Background Worker concurrently:
```bash
npm run dev
```

---

### Option B: Run via Docker Compose (Full Containerized Stack)

To run the entire containerized production stack with zero local Node dependencies:

```bash
# 1. Build and start all containers
docker-compose up --build -d

# 2. Access Web Dashboard
open http://localhost:3000

# 3. Access Backend API
open http://localhost:4000/health
```

---

## 🧪 Verification & Testing Endpoints

- **Web Dashboard**: `http://localhost:3000`
- **API Health Check**: `http://localhost:4000/health`
- **Prometheus Metrics**: `http://localhost:4000/metrics`
- **Trigger Agent Swarm API**: `POST http://localhost:4000/api/v1/agents/trigger`
- **AI Gateway Telemetry API**: `GET http://localhost:4000/api/v1/gateway/benchmarks`

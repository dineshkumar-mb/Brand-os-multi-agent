# Personal Brand OS

> **Autonomous Multi-Agent AI Platform for Personal Brand Growth (LinkedIn + Medium)**

Personal Brand OS is an enterprise-grade autonomous multi-agent platform designed for Staff Engineers, Tech Leaders, and Developers. It automatically discovers trending technical topics, performs deep research with fact-verification, learns the user's writing style via RAG (ChromaDB), generates LinkedIn posts and Medium technical articles, generates visual graphics/carousels, schedules content, tracks engagement analytics, and automatically feeds performance data back into a self-improving agentic feedback loop.

---

## 🏛️ Enterprise Monorepo Folder Structure

```text
personal-brand-os/
├── client/                     # React 19 + Vite Frontend SaaS Application
│   ├── src/                    # Components, Pages, and REST/SSE Services
│   ├── index.html
│   └── vite.config.ts
│
├── server/                     # Express / NestJS Backend API Gateway Server
│   ├── src/                    # Controllers, Middleware, Routes, SSE Engine
│   └── package.json
│
├── worker/                     # Background Service Job Processor & Swarm Loop
│   └── src/main.ts
│
├── gateway/                    # OmniRoute AI Gateway Proxy Integration
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
├── docs/                       # Architecture Specs & Setup Guides
├── docker-compose.yml          # Local Stack (PostgreSQL, Redis, ChromaDB, Neo4j)
└── package.json                # Root Workspace Scripts
```

---

## 🚀 Quick Start — How to Run Locally

### 1. Install Workspace Dependencies
```bash
npx pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Start Local Infrastructure Databases
```bash
npm run docker:up
```

### 4. Initialize Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start Development Server
Runs Web Dashboard (`http://localhost:3000`), Backend API (`http://localhost:4000`), and Background Worker concurrently:
```bash
npm run dev
```

---

## 📚 Complete Documentation Links
- [Local Setup & Running Guide](docs/LOCAL_SETUP.md)
- [Architecture Specifications](docs/ARCHITECTURE.md)
- [AI Gateway Documentation](docs/AI_GATEWAY.md)
- [MCP Integration Specs](docs/MCP_INTEGRATION.md)
- [Agent Specifications](docs/AGENT_SPEC.md)

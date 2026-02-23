# Food Bot 2

A multi-agent food ordering platform with AI-powered chat, search, cart, orders, and workflows. Built with **React** (Vite) frontends, **NestJS** backends, **Temporal** workflows, and optional **Claude/OpenAI/Gemini** LLM providers.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Implementation Details](#implementation-details)
- [Test Cases](#test-cases)
- [Current Gaps & Todos](#current-gaps--todos)
- [Local Setup](#local-setup)
- [Production Setup](#production-setup)
- [Docker & Infrastructure](#docker--infrastructure)
- [Running in a VM](#running-in-a-vm)
- [Scripts Reference](#scripts-reference)
- [Documentation Links](#documentation-links)

---

## Features

### Customer-facing

- **Chat** – Submit prompts; job polling; rich messages (cards, CTAs, text).
- **Order** – Search restaurants and dishes (gateway stub/search service), cart, address selection, checkout, order list, cancel.
- **Party planner** – Placeholder flow wired to Temporal party-planner workflow.
- **Diet planner** – Placeholder flow for weekly diet plans.
- **Auth** – Login (stub JWT via gateway), logout, token in `localStorage`; protected routes.

### Restaurant-facing

- **Auth** – Login (stub JWT), logout.
- **Dashboard** – Orders today, revenue, pending orders (stub data).
- **Menu** – CRUD items, categories, availability (stub table; backend API ready).
- **Orders** – List and status (stub table; backend API ready).
- **Onboarding** – Multi-step flow (backend onboarding API).
- **Analytics / Marketing / AI insights** – Placeholder UIs.

### Backend & platform

- **API Gateway** – `/v1` prefix, JWT auth, rate limiting, CORS, Swagger at `/api`. Proxies: chat → workflow, order-proxy → order-service, search (stub + optional search-service).
- **Services** – Customer (profile, addresses), Restaurant (onboarding, menu), Order (cart, checkout, payment, orders), Search (Elasticsearch + Kafka consumer), LLM (intent + vector cache), MCP (routing to Swiggy/Zomato/ONDC mocks), Workflow (job lifecycle), Personalization (preference graph).
- **Temporal** – Order, party-planner, diet-planner workflows; worker in `temporal/`.
- **Chrome extension** – Workflow poll and client execution (Temporal).
- **Infrastructure** – Postgres, Redis, Neo4j, Qdrant, Elasticsearch, Kafka, Zookeeper, Temporal (Docker Compose).

---

## Architecture

### High-level

```
┌─────────────────┐     ┌─────────────────┐  
│  Customer App   │     │ Restaurant App  │ 
│  (Vite :5173)   │     │ (Vite :5174)    │ 
└────────┬────────┘     └────────┬────────┘  
         │                       │          
         └───────────┬───────────┘
    ┌──────────────────────────────────────────┐
    │           API Gateway (:3000)            │
    │  /v1/auth, /v1/chat, /v1/jobs, /v1/me,   │
    │  /v1/search/*, /v1/order-proxy/*, /v1/   │
    │  restaurants, /v1/orders, Swagger /api   │
    └─────────────────────┬────────────────────┘
                          │
         ┌────────────────┼─────────────────────────────────────────────────────────────────┐
         │                              │                               │                   │
         ▼                              ▼                               ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│ Customer Svc    │  │ Restaurant Svc  │  │ Order Service   │  │ Workflow Service │  │ Search (gateway │
│ :3001           │  │ :3002           │  │ :3003           │  │ :3004            │  │ stub / service  │
│ profile,        │  │ onboarding,     │  │ cart, checkout, │  │ jobs, steps,     │  │ :3005)          │
│ addresses       │  │ menu            │  │ orders, payment │  │ messages         │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └────────┬─────────┘  └─────────────────┘
                                                                        │
         ┌──────────────────────────────────────────────────────────────┼───────────────────┐
         │                      │                    │                  │                   │
         ▼                      ▼                    ▼                  ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ LLM Service     │  │ MCP Service     │  │ Personalization │  │ Temporal        │  │ Infra           │
│ :3006           │  │ :3007           │  │ :3008           │  │ (worker +       │  │ Postgres, Redis,│
│ intent, vector  │  │ Swiggy/Zomato/  │  │ preferences,    │  │ server :7233)   │  │ Neo4j, Qdrant,  │
│ cache           │  │ ONDC routing    │  │ session cache   │  │                 │  │ ES, Kafka       │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Repo layout

| Path | Description |
|------|-------------|
| `apps/customer-app` | React + Vite customer UI (Chat, Order, Party, Diet, Login). |
| `apps/restaurant-app` | React + Vite restaurant UI (Dashboard, Menu, Orders, Login). |
| `apps/chrome-extension` | Chrome extension for workflow poll & execution. |
| `backend/api-gateway` | NestJS gateway: auth, chat, jobs, search, order-proxy, Swagger. |
| `backend/customer-service` | Profile & addresses API. |
| `backend/restaurant-service` | Onboarding & menu CRUD API. |
| `backend/order-service` | Cart, checkout, payment, orders API. |
| `backend/search-service` | Elasticsearch index + search APIs; Kafka consumer. |
| `backend/workflow-service` | Job lifecycle, step status, messages. |
| `backend/llm-service` | Intent + workflow JSON; vector cache (Qdrant). |
| `backend/mcp-service` | MCP routing to Swiggy/Zomato/ONDC (mocks or real). |
| `backend/personalization-service` | Preference graph (Neo4j), session cache (Redis). |
| `temporal/` | Temporal workflows (order, party-planner, diet-planner) and worker. |
| `packages/types` | Shared TypeScript types and DTOs. |
| `packages/ui-kit` | Shared UI components. |
| `packages/mcp-client` | MCP client used by backend. |
| `mocks/` | Mock MCP servers (Swiggy, Zomato, ONDC). |
| `infrastructure/` | Docker Compose for Postgres, Redis, Neo4j, Qdrant, Elasticsearch, Kafka, Temporal. |

### Port summary

| Service | Default port |
|---------|--------------|
| API Gateway | 3000 |
| Customer Service | 3001 |
| Restaurant Service | 3002 |
| Order Service | 3003 |
| Workflow Service | 3004 |
| Search Service | 3005 |
| LLM Service | 3006 |
| MCP Service | 3007 |
| Personalization Service | 3008 |
| Customer App (Vite) | 5173 |
| Restaurant App (Vite) | 5174 |
| Temporal | 7233 |
| Postgres | 5432 |
| Redis | 6379 |
| Neo4j | 7474 (HTTP), 7687 (Bolt) |
| Qdrant | 6333 |
| Elasticsearch | 9200, 9300 |
| Kafka | 9092 |

---

## Implementation Details

- **Monorepo** – npm workspaces; Turbo for build/test/dev. Node ≥20.
- **Gateway** – JWT via `JwtStrategy` + `JwtAuthGuard`; `@Public()` for login/search/order-proxy (order-proxy still verifies JWT for user id). Throttler (short/medium). Order-proxy forwards to order-service with `x-user-id`, timeout 15s, proper HTTP status mapping.
- **Order flow** – Customer app → gateway `/v1/order-proxy/*` → order-service (cart, checkout, orders). Order-service uses in-memory stores (no DB yet).
- **Chat flow** – Customer app → gateway `/v1/chat/prompt` → workflow-service (create job) → Temporal workflow; frontend polls `/v1/jobs/:id/status`.
- **Search** – Gateway exposes stub search (in-memory lists) at `/v1/search/restaurants` and `/v1/search/dishes`; search-service can be used for Elasticsearch-backed search.
- **LLM** – Configurable Claude/OpenAI/Gemini; intent + vector cache in llm-service.
- **MCP** – Mock servers in `mocks/`; mcp-service routes tool calls with circuit breaker.

---

## Test Cases

- **Backend (Jest)** – Unit/integration tests per service in `*.spec.ts` files. Controllers, services, config, and key flows are covered (e.g. api-gateway: app, search, restaurants, orders, chat; order-service: order.service, app; customer-service: profile; etc.).
- **Frontend (Vitest)** – Customer app: App, Layout, Chat, Order, PartyPlanner, DietPlanner, MessageCard, CTAButton. Restaurant app: App, Login.
- **Packages** – `packages/types`: pagination and type tests.

**Run all tests (from repo root):**

```bash
npm run build   # required by turbo test dependency
npm test
```

**Run tests for a single package:**

```bash
cd apps/customer-app && npm test
cd backend/api-gateway && npm test
```

E2E tests for critical paths are planned; current coverage is unit + integration per service and app.

---

## Current Gaps & Todos

- **E2E tests** – No full browser E2E suite yet; add Playwright/Cypress for login → chat → order flows.
- **ESLint 9** – Some workspaces still need `eslint.config.js` (flat config); `turbo run lint` may fail until migrated.
- **Seed data** – `scripts/seed-data.sh` is a placeholder; no seed endpoints or migrations called yet.
- **Persistence** – Order, customer, restaurant, and search services use in-memory storage; production will need Postgres/Elasticsearch wiring.
- **Payment** – Order service has payment initiate/status stubs; no real payment provider integration.
- **Restaurant app** – Menu/Orders/Onboarding UIs use stub data; backend APIs exist and can be wired.
- **Production hardening** – TLS, secrets management, and health checks for reverse proxy/load balancer to be added per environment.

---

## Local Setup

### Prerequisites

- **Node.js** ≥ 20 and npm 10
- **Docker** and **Docker Compose** (for infra)
- (Optional) Git

### 1. Clone and install

```bash
git clone <repo-url>
cd food-bot-2
npm install
```

### 2. Environment

```bash
cp .env.example .env
# Edit .env: set JWT_SECRET, add API keys for LLM/MCP if needed.
# For local dev, defaults for POSTGRES_*, REDIS_URL, NEO4J_*, etc. match docker-compose.
```

### 3. Start infrastructure (Docker)

From repo root:

```bash
npm run infra:up
# or
./scripts/setup-infra.sh
```

Wait until healthchecks pass (~30–60 s). Services: Postgres (5432), Redis (6379), Neo4j (7474/7687), Qdrant (6333), Elasticsearch (9200), Kafka (9092), Temporal (7233).

### 4. Build

```bash
npm run build
```

### 5. Run backend services

In separate terminals (or use a process manager), from repo root:

```bash
# Terminal 1 – API Gateway
cd backend/api-gateway && npm run start:dev

# Terminal 2 – Customer Service
cd backend/customer-service && npm run start:dev

# Terminal 3 – Restaurant Service
cd backend/restaurant-service && npm run start:dev

# Terminal 4 – Order Service
cd backend/order-service && npm run start:dev

# Terminal 5 – Workflow Service
cd backend/workflow-service && npm run start:dev

# Terminal 6 – Search Service (optional if using gateway stub only)
cd backend/search-service && npm run start:dev

# Terminal 7 – LLM Service (optional for chat intent)
cd backend/llm-service && npm run start:dev

# Terminal 8 – MCP Service (optional for MCP tools)
cd backend/mcp-service && npm run start:dev

# Terminal 9 – Personalization Service (optional)
cd backend/personalization-service && npm run start:dev
```

Or run all backend dev servers with Turbo (from repo root):

```bash
npm run dev
# This runs dev for all workspaces; for only gateway + apps:
npm run dev:apps
```

### 6. Run Temporal worker (optional, for chat workflows)

```bash
cd temporal
npm run build
npm run worker
```

### 7. Run frontend apps

```bash
# Customer app – http://localhost:5173
cd apps/customer-app && npm run dev

# Restaurant app – http://localhost:5174
cd apps/restaurant-app && npm run dev
```

### 8. Quick sanity check

- **Gateway:** http://localhost:3000/api (Swagger)
- **Customer app:** http://localhost:5173 → Login (any email) → Chat, Order tabs
- **Restaurant app:** http://localhost:5174 → Login → Dashboard, Menu, Orders

Set `VITE_API_URL=http://localhost:3000` in `.env` (or in app `.env`) if the apps run against the gateway on 3000.

---

## Production Setup

1. **Environment** – Use production values in `.env` (or your secrets manager):
   - Strong `JWT_SECRET`, unique DB passwords, Redis/Neo4j/Qdrant/Elasticsearch/Kafka URLs.
   - LLM/MCP API keys and URLs as required.
   - Set all `*_SERVICE_URL` and `API_GATEWAY_PORT` for the deployment topology.

2. **Build** – From repo root:
   ```bash
   npm ci
   npm run build
   ```

3. **Infrastructure** – Run Postgres, Redis, Neo4j, Qdrant, Elasticsearch, Kafka, Temporal in your production environment (VMs, Kubernetes, or managed services). Use the same variables as in `.env.example` for connection strings.

4. **Process management** – Run each backend service and the Temporal worker under a process manager (e.g. systemd, PM2, or Kubernetes). Example with PM2:
   ```bash
   cd backend/api-gateway && pm2 start dist/main.js --name api-gateway
   cd backend/order-service && pm2 start dist/main.js --name order-service
   # ... repeat for other services
   cd temporal && pm2 start dist/src/worker.js --name temporal-worker
   ```

5. **Frontend** – Build and serve static assets:
   ```bash
   cd apps/customer-app && npm run build
   cd apps/restaurant-app && npm run build
   ```
   Serve `apps/customer-app/dist` and `apps/restaurant-app/dist` via Nginx/Apache/CDN. Set `VITE_API_URL` at build time to your public API gateway URL.

6. **Reverse proxy** – Put the API Gateway behind TLS (e.g. Nginx/Caddy) and restrict CORS/origins to your app domains.

---

## Docker & Infrastructure

- **Application images** – The repo does not ship Dockerfiles for the Node apps today. You can add Dockerfiles per service and build images for production or VM deployment.

- **Infrastructure only (current)** – Docker Compose in `infrastructure/` runs only the backing services:

  | Service       | Port(s)   | Purpose              |
  |---------------|-----------|----------------------|
  | Postgres      | 5432      | DB; Temporal         |
  | Redis         | 6379      | Cache, session       |
  | Neo4j         | 7474, 7687| Preference graph     |
  | Qdrant        | 6333      | Vector cache         |
  | Elasticsearch | 9200, 9300| Search index         |
  | Zookeeper     | 2181      | Kafka                |
  | Kafka         | 9092, 29092 | Events            |
  | Temporal      | 7233      | Workflow engine      |

  **Start (from repo root):**
  ```bash
  npm run infra:up
  # or: cd infrastructure && docker-compose up -d
  ```

  **Stop:**
  ```bash
  npm run infra:down
  # or: cd infrastructure && docker-compose down
  ```

  **Dev overrides** (e.g. lower Elasticsearch memory, explicit host ports):
  ```bash
  cd infrastructure
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
  ```

  Ensure a `.env` file exists at repo root (copy from `.env.example`). Infrastructure Compose files use defaults for credentials when vars are unset.

---

## Running in a VM

1. **Provision** – Ubuntu 22.04 or similar; install Node ≥20, Docker, Docker Compose.
2. **Clone and install** – Same as [Local Setup](#local-setup): `npm install`, `cp .env.example .env`, configure `.env`.
3. **Infrastructure** – On the VM:
   ```bash
   cd /path/to/food-bot-2
   npm run infra:up
   ```
4. **Build** – `npm run build`.
5. **Run services** – Use systemd or PM2 to run each backend service and the Temporal worker. Run the two Vite builds and serve them with Nginx (or run `npm run dev` for dev only).
6. **Firewall** – Open 3000 (gateway), 5173/5174 if you serve dev servers, and 80/443 for your reverse proxy.

For a single-VM “all-in-one” dev setup, you can run `npm run dev` and the Temporal worker, then access the apps and Swagger as in local setup.

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build` | Build all workspaces (Turbo). |
| `npm run dev` | Run dev for all workspaces (Turbo). |
| `npm run dev:apps` | Run dev only for customer-app, restaurant-app, api-gateway. |
| `npm test` | Run all tests (Turbo; depends on build). |
| `npm run lint` | Lint all workspaces. |
| `npm run format` | Prettier format. |
| `npm run format:check` | Prettier check. |
| `npm run infra:up` | Start Docker Compose stack in `infrastructure/`. |
| `npm run infra:down` | Stop Docker Compose stack. |
| `npm run setup-infra` | Same as `./scripts/setup-infra.sh` (start infra). |
| `npm run seed-data` | Placeholder seed script (`scripts/seed-data.sh`). |
| `./scripts/orchestrate.sh` | Prints agent/orchestration phases (for Claude Code). |

---

## Documentation Links

- **Task board** – `.claude/project-management/TASK-BOARD.json`
- **Task breakdown** – `.claude/project-management/TASK-BREAKDOWN.md`
- **Agent process** – `.claude/project-management/AGENT-SDLC-PROCESS.md`
- **Infrastructure** – `infrastructure/README.md`
- **API docs (runtime)** – http://localhost:3000/api when the gateway is running

---

## License

Private / internal use unless otherwise specified.

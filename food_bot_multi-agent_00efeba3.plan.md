---
name: Food Bot Multi-Agent
overview: Set up a Claude Code multi-agent development environment that orchestrates parallel and sequential agent teams to build a full-stack food ordering platform (Capacitor+React frontends, NestJS backend) with LLM-powered workflow execution, MCP integrations (internal, Swiggy, Zomato, ONDC), and advanced features like party/diet planning.
todos:
  - id: scaffold
    content: 'Create monorepo scaffold: root package.json with npm workspaces, turbo.json, tsconfig.base.json, .env.example, .gitignore, and all subdirectory package.json stubs'
    status: completed
  - id: claude-md
    content: Create CLAUDE.md master orchestration file with agent team config, routing rules (parallel/sequential), file ownership maps, environment variables, and execution phase definitions
    status: completed
  - id: agent-defs
    content: Create .claude/agents/ directory with all 9 agent definition files (team lead, requirements, architect, frontend, backend, workflow, devops, test, review, security) with detailed roles and task templates
    status: in_progress
  - id: project-mgmt
    content: Create .claude/project-management/ skeleton with ARCHITECTURE.md, REQUIREMENTS.md, TASK-BREAKDOWN.md, TEST-PLAN.md and per-domain subdirectories
    status: pending
  - id: docker-infra
    content: Create infrastructure/docker-compose.yml with Postgres, Redis, Neo4j, Qdrant, Elasticsearch, Kafka+Zookeeper, Temporal server
    status: pending
  - id: backend-scaffold
    content: Scaffold all NestJS backend services (api-gateway, customer-service, restaurant-service, order-service, workflow-service, search-service, llm-service, mcp-service, personalization-service, shared) with base configs and module structure
    status: pending
  - id: frontend-scaffold
    content: Scaffold customer-app and restaurant-app with Vite + React + Capacitor + TailwindCSS base setup, plus chrome-extension stub
    status: pending
  - id: packages-scaffold
    content: 'Scaffold shared packages: types, ui-kit, mcp-client with base TypeScript configs'
    status: pending
  - id: mock-mcp
    content: Create mock MCP servers for Swiggy, Zomato, and ONDC with realistic API responses for testing
    status: pending
  - id: temporal-scaffold
    content: Scaffold Temporal workflow definitions and activity stubs for order, party-planner, diet-planner, and MCP-execution workflows
    status: pending
  - id: orchestrate-script
    content: Create scripts/orchestrate.sh to launch Claude agent teams with proper phase sequencing (parallel phases 1-4, sequential phase 5)
    status: pending
  - id: readme
    content: Create comprehensive README.md with project overview, architecture diagram, setup instructions, and links to all .claude/project-management/ docs
    status: pending
isProject: false
---

# Food Bot 2 - Claude Multi-Agent Development Platform

## 1. Project Structure (Monorepo with npm workspaces)

```
food-bot-2/
├── CLAUDE.md                          # Master orchestration instructions
├── .claude/
│   ├── settings.json                  # Claude Code settings
│   ├── project-management/            # All requirements, architecture, task docs
│   │   ├── ARCHITECTURE.md
│   │   ├── REQUIREMENTS.md
│   │   ├── TASK-BREAKDOWN.md
│   │   ├── TEST-PLAN.md
│   │   ├── customer-app/
│   │   ├── restaurant-app/
│   │   ├── backend/
│   │   ├── workflow-engine/
│   │   ├── mcp-layer/
│   │   └── infrastructure/
│   └── agents/                        # Agent team definitions
│       ├── AGENT-TEAM.md              # Team structure & coordination rules
│       ├── architect-agent.md
│       ├── requirements-agent.md
│       ├── frontend-agent.md
│       ├── backend-agent.md
│       ├── workflow-agent.md
│       ├── test-agent.md
│       ├── review-agent.md
│       ├── security-agent.md
│       └── devops-agent.md
├── apps/
│   ├── customer-app/                  # Capacitor + React (Vite)
│   ├── restaurant-app/                # Capacitor + React (Vite)
│   └── chrome-extension/              # Browser-based workflow executor
├── backend/
│   ├── api-gateway/                   # NestJS - API gateway + auth
│   ├── customer-service/              # NestJS - Customer domain
│   ├── restaurant-service/            # NestJS - Restaurant domain
│   ├── order-service/                 # NestJS - Order management
│   ├── workflow-service/              # NestJS - Workflow orchestration
│   ├── search-service/                # NestJS - Elasticsearch integration
│   ├── llm-service/                   # NestJS - LLM abstraction (Claude/OpenAI/Gemini)
│   ├── mcp-service/                   # NestJS - MCP aggregation layer
│   ├── personalization-service/       # NestJS - Redis/GraphDB user context
│   └── shared/                        # Shared DTOs, interfaces, utils
├── packages/
│   ├── types/                         # Shared TypeScript types
│   ├── ui-kit/                        # Shared React component library
│   └── mcp-client/                    # MCP client SDK
├── temporal/
│   ├── workflows/                     # Temporal workflow definitions
│   └── activities/                    # Temporal activity implementations
├── mocks/
│   ├── swiggy-mcp/                    # Mock Swiggy MCP server
│   ├── zomato-mcp/                    # Mock Zomato MCP server
│   └── ondc-mcp/                      # Mock ONDC MCP server
├── infrastructure/
│   ├── docker-compose.yml             # Full stack: Postgres, Redis, ES, Kafka, Temporal, Neo4j, Qdrant
│   ├── docker-compose.dev.yml
│   └── k8s/                           # Optional K8s manifests
├── scripts/
│   ├── orchestrate.sh                 # Launch Claude agent teams
│   ├── setup-infra.sh                 # Start Docker infrastructure
│   └── seed-data.sh                   # Seed test data
├── package.json                       # Root workspace config
├── turbo.json                         # Turborepo pipeline config
├── tsconfig.base.json
├── .env.example
└── README.md
```

## 2. Claude Multi-Agent Orchestration Architecture

### Agent Team Structure

```mermaid
graph TB
    Lead["Team Lead Agent"]

    subgraph parallel1 ["Phase 1 - Parallel: Requirements & Architecture"]
        ReqAgent["Requirements Agent"]
        ArchAgent["Architect Agent"]
    end

    subgraph parallel2 ["Phase 2 - Parallel: Development"]
        FEAgent["Frontend Agent"]
        BEAgent["Backend Agent"]
        WFAgent["Workflow Agent"]
        DevOpsAgent["DevOps Agent"]
    end

    subgraph parallel3 ["Phase 3 - Parallel: Quality"]
        TestAgent["Test Agent"]
        ReviewAgent["Code Review Agent"]
        SecAgent["Security Agent"]
    end

    subgraph sequential ["Phase 4 - Sequential: Fix & Verify"]
        FixAgent["Fix Agent"]
        VerifyAgent["Verify Agent"]
    end

    Lead --> parallel1
    parallel1 --> parallel2
    parallel2 --> parallel3
    parallel3 --> sequential
    sequential --> Lead
```

### Agent Definitions

| Agent | Role | Parallel Group | Key Responsibilities |

|-------|------|---------------|---------------------|

| **Team Lead** | Orchestrator | - | Coordinate all agents, manage task list, resolve conflicts |

| **Requirements Agent** | Analyst | Phase 1 | Expand high-level requirements into detailed specs per domain |

| **Architect Agent** | Design | Phase 1 | System architecture, data models, API contracts, tech decisions |

| **Frontend Agent** | Developer | Phase 2 | Both customer-app and restaurant-app with rich chatbot UI |

| **Backend Agent** | Developer | Phase 2 | All NestJS microservices, DB schemas, API implementations |

| **Workflow Agent** | Developer | Phase 2 | Temporal workflows, MCP integrations, browser executor, agent SDK integrations |

| **DevOps Agent** | Infra | Phase 2 | Docker, CI/CD, infrastructure configs, mock MCP servers |

| **Test Agent** | QA | Phase 3 | Generate & run unit/integration/e2e tests |

| **Review Agent** | Quality | Phase 3 | Code review, static analysis, code quality checks |

| **Security Agent** | Security | Phase 3 | SAST/DAST, dependency audit, secrets scanning, auth review |

### CLAUDE.md Orchestration Rules

The master `CLAUDE.md` will define:

- **Environment variables**: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- **Routing rules**: Which tasks go parallel vs sequential
- **File ownership**: Each agent owns specific directories (no file conflicts)
- **Shared task list format**: JSON-based task board with status tracking
- **Dependency graph**: Task prerequisites and handoff protocols
- **LLM config**: Which model (Claude/OpenAI/Gemini) to use where, with on/off toggles via `.env`

## 3. Application Architecture

### Data Flow

```mermaid
sequenceDiagram
    participant CApp as Customer App
    participant GW as API Gateway
    participant CS as Customer Service
    participant LLM as LLM Service
    participant PS as Personalization Svc
    participant VDB as Vector DB
    participant WS as Workflow Service
    participant TMP as Temporal
    participant MCP as MCP Service
    participant SS as Search Service
    participant ES as Elasticsearch

    CApp->>GW: POST /chat {prompt, userId}
    GW->>CS: Create async job
    CS-->>CApp: {jobId}
    CS->>PS: Get user context (Redis/Neo4j)
    PS-->>CS: Personalization data
    CS->>VDB: Check cached intent
    alt Cache hit
        VDB-->>CS: Cached intent+workflow
    else Cache miss
        CS->>LLM: Enriched prompt -> intent+workflow
        LLM-->>CS: {intent, workflow JSON}
        CS->>VDB: Cache intent mapping
    end
    CS->>WS: Save & execute workflow
    WS->>TMP: Start Temporal workflow
    TMP->>MCP: Execute steps (internal/Swiggy/Zomato)
    MCP->>SS: Search queries
    SS->>ES: Elasticsearch query
    ES-->>SS: Results
    SS-->>MCP: Search results
    MCP-->>TMP: Step results
    TMP-->>WS: Update job status
    CApp->>GW: GET /jobs/{jobId}/status (polling)
    GW-->>CApp: {status, messages, data}
```

### Key Technology Choices

- **Frontend**: React 18 + Vite + Capacitor v8 + TailwindCSS + Framer Motion
- **UI Kit**: Custom rich chat components (cards with image+text+attributes, CTA buttons, input fields, calendars, filters, weekly editable plan)
- **Backend**: NestJS v10 + TypeORM + class-validator
- **Databases**: PostgreSQL (primary), Redis (cache + sessions), Neo4j (user preference graph), Qdrant (vector DB), Elasticsearch (search)
- **Messaging**: Kafka (event streaming, ES indexing pipeline)
- **Workflow**: Temporal (primary), with fallback to agent SDK (Claude/OpenAI/Gemini) and browser-based execution
- **MCP Layer**: Internal restaurant MCP + Swiggy MCP (`https://mcp.swiggy.com/food`) + Zomato MCP (`https://mcp-server.zomato.com/mcp`) + Mock servers for Swiggy, Zomato, ONDC
- **LLM**: Claude API (primary reasoning), OpenAI (embeddings + fallback), Gemini (multimodal + browser DOM analysis)

### LLM Configuration Model

```typescript
// config/llm.config.ts
interface LLMConfig {
  claude: {
    enabled: boolean;
    apiKey: string;
    model: string;
    usages: ['intent', 'workflow', 'reasoning'];
  };
  openai: { enabled: boolean; apiKey: string; model: string; usages: ['embeddings', 'fallback'] };
  gemini: {
    enabled: boolean;
    apiKey: string;
    model: string;
    usages: ['multimodal', 'dom-analysis'];
  };
}
```

### MCP Integration Model

```typescript
// config/mcp.config.ts
interface MCPConfig {
  internal: { enabled: boolean; url: string };
  swiggy: { enabled: boolean; url: string; mock: boolean };
  zomato: { enabled: boolean; url: string; mock: boolean };
  ondc: { enabled: boolean; url: string; mock: boolean };
}
```

### Workflow Execution Strategy

The system selects execution engine based on capability:

- **Backend API available** (internal/ONDC with API keys) -> Temporal workflow calls APIs directly
- **MCP available** (Swiggy/Zomato MCP endpoints) -> Agent SDK (Claude/OpenAI/Gemini with MCP client) executes via MCP
- **No API/MCP** (need browser interaction) -> Chrome extension or OpenClaw-like browser automation polls workflow JSON from backend and executes client-side, using a small bundled model (Gemini Nano) for DOM analysis

### User Preference Graph (Neo4j)

```
User -> DayOfWeek -> HourOfDay -> Category -> SubCategory -> Restaurant -> Dish
```

Each edge has a weight/score based on order history, recency, frequency.

## 4. Key Feature Modules

### Customer App Features

- Rich chatbot UI with message types: text, card (image+text+attrs), carousel, CTA buttons, input fields, date pickers, address selector, cart summary, order tracker, calendar planner
- Job polling with progressive status updates
- Party planner flow (budget, headcount, veg/non-veg, multi-restaurant, future scheduling)
- Diet planner flow (weekly calendar, meal slots, health goals, skip/edit per meal, multi-address)
- Standard ordering: search, filter, cart, checkout, payment, tracking, feedback
- Customer login & signup flow

### Restaurant App Features

- Restaurant onboarding wizard (Name, Contact, Photo, Type, Address with lat long, KYC, FASSAI, Contract with commercial, digital signature, Approval flow, Menu Upload)
- Menu management (CRUD, availability toggle, smart suggestions)
- Order list with status updates
- Analytics dashboard (revenue, popular items, ratings)
- Marketing campaign management, user segment selection or creation, content creation using llm, smart scheduling, campaign on / off, campaign performance
- AI-powered insights via natural language queries

### Backend Services

- **api-gateway**: Auth (JWT), rate limiting, request routing
- **customer-service**: Chat/job management, user profiles, addresses, feedback
- **restaurant-service**: Onboarding, menu CRUD, restaurant profiles
- **order-service**: Cart, checkout, payment, order lifecycle, tracking
- **workflow-service**: Workflow storage, Temporal integration, status updates
- **search-service**: ES indexing via Kafka, search/filter APIs
- **llm-service**: Multi-LLM abstraction with circuit breaker, token optimization
- **mcp-service**: MCP routing (internal/Swiggy/Zomato/ONDC) based on config
- **personalization-service**: User preference graph (Neo4j), context enrichment (Redis)

## 5. Execution Plan for Claude Agent Teams

### Phase 1: Requirements & Architecture (Parallel)

- **Requirements Agent**: Expand each domain (customer, restaurant, order, workflow, MCP, search, LLM, personalization) into detailed functional requirements with acceptance criteria. Output to `.claude/project-management/REQUIREMENTS.md` and per-domain docs.
- **Architect Agent**: Create system architecture, data models (ERD, graph schema, ES mappings), API contracts (OpenAPI specs), sequence diagrams, deployment architecture. Output to `.claude/project-management/ARCHITECTURE.md`.

### Phase 2: Task Planning & Test Cases (Parallel after Phase 1)

- **Requirements Agent**: Break requirements into granular dev tasks with estimates, dependencies, and agent assignments. Output to `.claude/project-management/TASK-BREAKDOWN.md`.
- **Test Agent**: Generate test cases (unit, integration, e2e) from requirements. Output to `.claude/project-management/TEST-PLAN.md`.

### Phase 3: Development (Parallel, 4 agents)

- **Frontend Agent**: Build customer-app and restaurant-app with all UI components, pages, state management (Zustand), API clients, Capacitor plugins.
- **Backend Agent**: Build all NestJS microservices, database migrations, API implementations, Kafka producers/consumers.
- **Workflow Agent**: Build Temporal workflows, MCP client integrations, agent SDK wrappers, chrome extension for browser-based execution, mock MCP servers.
- **DevOps Agent**: Docker Compose, CI pipelines, env configs, seed scripts, infrastructure setup.

### Phase 4: Quality Assurance (Parallel, 3 agents)

- **Test Agent**: Execute all test suites, report failures.
- **Review Agent**: Code review all generated code, check patterns, lint, static analysis (sonar).
- **Security Agent**: Run SAST (ESLint security plugins, Snyk), check auth flows, input validation, secrets management, dependency vulnerabilities.

### Phase 5: Fix & Verify (Sequential)

- Fix all test failures, code review issues, security vulnerabilities.
- Re-run all tests and audits.
- Update documentation.

### Phase 6: Finalize

- Update `README.md` with project overview and links to all docs in `.claude/project-management/`.
- Final integration test pass.

## 6. What Gets Created in This Initial Setup

When the plan is confirmed, I will create:

1. **`CLAUDE.md`** - Master orchestration file with agent team instructions, routing rules, file ownership, and execution phases
2. **`.claude/agents/*.md`** - All 9 agent definition files with detailed roles, capabilities, file ownership, and task templates
3. **`.claude/project-management/`** - Initial skeleton docs that agents will expand
4. **Project scaffold** - `package.json` (workspaces), `turbo.json`, `tsconfig.base.json`, `.env.example`, all app/service directory stubs with their own `package.json` files
5. **`infrastructure/docker-compose.yml`** - Full infra stack (Postgres, Redis, Neo4j, Qdrant, Elasticsearch, Kafka, Temporal)
6. **`scripts/orchestrate.sh`** - Script to launch the Claude agent team pipeline
7. **`mocks/`** - Mock MCP server stubs for Swiggy, Zomato, ONDC
8. **`README.md`** - Project overview with links to all documentation

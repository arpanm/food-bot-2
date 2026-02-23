# Food Bot 2 – Requirements (Master)

> Production-grade requirements. Each requirement area is implemented via **tasks** in [TASK-BREAKDOWN.md](TASK-BREAKDOWN.md); task status is tracked in [TASK-BOARD.json](TASK-BOARD.json). Each task follows [AGENT-SDLC-PROCESS.md](AGENT-SDLC-PROCESS.md).

## 1. High-Level Summary

- **Customer**: Chat-based food ordering with **production-grade** rich UI (cards with image+text+attributes, CTAs, varied input fields); async jobs with jobId and status polling; full order flow (search, cart, checkout, payment, tracking, feedback); party planner; diet planner.
- **Restaurant**: Onboarding (multi-step, KYC, FSSAI, contract), menu CRUD, order management, analytics, marketing campaigns, AI insights.
- **Backend**: API gateway (auth, versioning, rate limiting); customer/restaurant/order/workflow/search/LLM/MCP/personalization services; PostgreSQL, Redis, Neo4j, Qdrant, Elasticsearch, Kafka.
- **Workflow**: Temporal workflows; MCP layer (internal, Swiggy, Zomato, ONDC); resiliency (retry, circuit breaker, bulkhead); browser-based execution via Chrome extension when needed.
- **LLM**: Claude, OpenAI, Gemini with on/off and API key config; intent and workflow JSON; vector cache (Qdrant) to reduce tokens.

## 2. Domain Requirements & Task Traceability

| Domain             | Requirements doc                                                   | Example tasks                                                            |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Customer App**   | [customer-app/REQUIREMENTS.md](customer-app/REQUIREMENTS.md)       | T025–T032 (auth, chat, job polling, search, cart, orders, party, diet)   |
| **Restaurant App** | [restaurant-app/REQUIREMENTS.md](restaurant-app/REQUIREMENTS.md)   | T033–T039 (auth, onboarding, menu, orders, analytics, marketing, AI)     |
| **Backend**        | [backend/REQUIREMENTS.md](backend/REQUIREMENTS.md)                 | T004–T018, T022, T024, T041 (config, gateway, services, MCP, resiliency) |
| **Workflow**       | [workflow-engine/REQUIREMENTS.md](workflow-engine/REQUIREMENTS.md) | T019–T021, T040 (Temporal, Chrome extension)                             |
| **MCP**            | [mcp-layer/REQUIREMENTS.md](mcp-layer/REQUIREMENTS.md)             | T005, T022, T023                                                         |
| **Infrastructure** | [infrastructure/REQUIREMENTS.md](infrastructure/REQUIREMENTS.md)   | T002, T003, T023                                                         |

## 3. Cross-Cutting

- **Auth**: JWT, rate limiting, API versioning (tasks T007, T025, T033).
- **Config**: LLM and MCP enable/disable and API keys via environment only (T004, T005).
- **Resiliency**: Retry, circuit breaker, bulkhead, fallback execution (T024).
- **Quality**: Per-task code review, tests, code analysis, security analysis (AGENT-SDLC-PROCESS.md).

---

_Requirements Agent: expand per-domain REQUIREMENTS.md with detailed acceptance criteria; link to task IDs in TASK-BREAKDOWN.md._

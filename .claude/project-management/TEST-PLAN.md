# Food Bot 2 – Test Plan (Comprehensive)

Traceable to the full high-level requirement: multi-agent dev, spec-based development, Capacitor+React frontend, Node+Nest backend, LLM (Claude/OpenAI/Gemini) with on/off and API keys, chatbot UI with cards/CTAs/inputs, async job + jobId + polling, personalization (Redis/graph), vector cache, intent/workflow from LLM, workflow engines (Temporal, agent SDK, browser/Chrome), MCP (Swiggy/Zomato/ONDC), restaurant app (onboarding, menu, orders, analytics), customer flows (search, cart, checkout, payment, party planner, diet planner), and quality/security gates.

**Status:** Passed | Failed | Skipped | Not implemented

---

## 1. Multi-agent & orchestration

| ID  | Test case                                                       | Area                       | Suite     | Status          |
| --- | --------------------------------------------------------------- | -------------------------- | --------- | --------------- |
| M1  | Agent team definitions exist and reference common task list     | .claude/agents             | N/A (doc) | Not implemented |
| M2  | Orchestration script runs and outputs phase instructions        | scripts/orchestrate.sh     | N/A       | Not implemented |
| M3  | Parallel vs sequential task ordering is respected in task board | .claude/project-management | N/A       | Not implemented |

---

## 2. Configuration (LLM & MCP)

| ID  | Test case                                                          | Area                | Suite       | Status        |
| --- | ------------------------------------------------------------------ | ------------------- | ----------- | ------------- |
| C1  | LLM provider (Claude/OpenAI/Gemini) on/off flags are read from env | backend/llm-service | llm-service | Passed (T004) |
| C2  | LLM API keys are loaded from env and not logged                    | backend/llm-service | llm-service | Passed (T004) |
| C3  | Swiggy MCP enable/disable is read from config                      | backend/mcp-service | mcp-service | Passed (T005) |
| C4  | Zomato MCP enable/disable is read from config                      | backend/mcp-service | mcp-service | Passed (T005) |
| C5  | Mock MCP layer enable/disable is read from config                  | backend/mcp-service | mcp-service | Passed (T005) |

---

## 3. API Gateway

| ID  | Test case                                                         | Area    | Suite       | Status                   |
| --- | ----------------------------------------------------------------- | ------- | ----------- | ------------------------ |
| G1  | GET /health returns status and service name                       | Backend | api-gateway | Passed                   |
| G2  | POST /chat/prompt accepts prompt and returns jobId                | Backend | api-gateway | Passed                   |
| G3  | GET /jobs/:id/status returns pending then completed with messages | Backend | api-gateway | Passed                   |
| G4  | GET /jobs/:id/status returns 404 for unknown jobId                | Backend | api-gateway | Passed                   |
| G5  | GET /restaurants returns list with id, name, cuisine, rating      | Backend | api-gateway | Passed                   |
| G6  | GET /orders returns list with id, restaurantName, status, total   | Backend | api-gateway | Passed                   |
| G7  | Swagger/OpenAPI doc is exposed at /api                            | Backend | api-gateway | Not implemented (manual) |
| G8  | JWT guard: protected route returns 401 without/invalid token      | Backend | api-gateway | Passed (T007)            |
| G9  | Rate limiting returns 429 when over limit                         | Backend | api-gateway | Implemented (Throttler)  |

---

## 4. Customer app – Chat & job polling

| ID  | Test case                                                    | Area     | Suite        | Status             |
| --- | ------------------------------------------------------------ | -------- | ------------ | ------------------ |
| A1  | App renders with layout and nav (Chat, Order, Party, Diet)   | Frontend | customer-app | Passed             |
| A2  | Chat tab shows input and Send button                         | Frontend | customer-app | Passed             |
| A3  | Sending a message adds user message to list                  | Frontend | customer-app | Passed             |
| A4  | submitPrompt calls POST /chat/prompt with prompt body        | Frontend | customer-app | Passed             |
| A5  | getJobStatus calls GET /jobs/:id/status                      | Frontend | customer-app | Passed             |
| A6  | After job completion assistant message appears in chat       | Frontend | customer-app | Passed             |
| A7  | Order tab: search, cart, orders                              | Frontend | customer-app | Passed             |
| A8  | Rich UI: cards with image + text + attributes                | Frontend | customer-app | Passed (T026)      |
| A9  | Rich UI: CTA buttons; RichMessage parses card/cta            | Frontend | customer-app | Passed (T026)      |
| A10 | Search restaurants/dishes; cart; checkout; order list/cancel | Frontend | customer-app | Passed (T028–T030) |

---

## 5. Backend – Personalization & vector cache

| ID  | Test case                                                                               | Area    | Suite                   | Status          |
| --- | --------------------------------------------------------------------------------------- | ------- | ----------------------- | --------------- |
| P1  | Customer personalization data is read from Redis (when enabled)                         | Backend | personalization-service | Not implemented |
| P2  | User preference graph (day/hour/category/subcategory/restaurants/dishes) is stored/read | Backend | personalization-service | Not implemented |
| P3  | Prompt-to-intent/workflow is cached in vector DB to reduce LLM calls                    | Backend | llm-service             | Not implemented |
| P4  | LLM returns intent and workflow JSON                                                    | Backend | llm-service             | Not implemented |

---

## 6. Workflow engine & execution

| ID  | Test case                                                                   | Area                  | Suite                      | Status          |
| --- | --------------------------------------------------------------------------- | --------------------- | -------------------------- | --------------- |
| W1  | Workflow is saved in workflow DB                                            | Backend               | workflow-service           | Not implemented |
| W2  | Temporal workflow executes and updates job status                           | Backend               | workflow-service, temporal | Not implemented |
| W3  | Workflow step calls MCP/API/browser action                                  | Backend               | mcp-service                | Not implemented |
| W4  | Error handling and retry in workflow execution                              | Backend               | workflow-service           | Not implemented |
| W5  | Circuit breaking / bulkhead / alternative plan (future)                     | Backend               | workflow-service           | Not implemented |
| W6  | Browser/Chrome plugin polls workflow JSON and executes client-side (future) | apps/chrome-extension | N/A                        | Not implemented |

---

## 7. Restaurant app & backend

| ID  | Test case                                                           | Area     | Suite              | Status          |
| --- | ------------------------------------------------------------------- | -------- | ------------------ | --------------- |
| R1  | Restaurant app renders with Dashboard, Menu, Orders, Analytics tabs | Frontend | restaurant-app     | Passed          |
| R2  | Dashboard shows summary cards (orders, revenue, pending)            | Frontend | restaurant-app     | Passed          |
| R3  | Menu tab shows list with name, category, price, available           | Frontend | restaurant-app     | Passed          |
| R4  | Orders tab shows list with id, items, status, time                  | Frontend | restaurant-app     | Passed          |
| R5  | Analytics tab shows placeholder/chart                               | Frontend | restaurant-app     | Passed          |
| R5a | Restaurant login (JWT, logout)                                      | Frontend | restaurant-app     | Passed (T033)   |
| R6  | Restaurant onboarding API (future)                                  | Backend  | restaurant-service | Not implemented |
| R7  | Menu CRUD API (future)                                              | Backend  | restaurant-service | Not implemented |
| R8  | Order list and update status API (future)                           | Backend  | order-service      | Not implemented |
| R9  | Restaurant analytics layer (future)                                 | Backend  | restaurant-service | Not implemented |

---

## 8. Search & Elasticsearch

| ID  | Test case                                      | Area    | Suite          | Status          |
| --- | ---------------------------------------------- | ------- | -------------- | --------------- |
| S1  | Search restaurants by name/type/dish (API)     | Backend | search-service | Not implemented |
| S2  | Search dish by name/type/restaurant (API)      | Backend | search-service | Not implemented |
| S3  | Get filter details and apply filters (API)     | Backend | search-service | Not implemented |
| S4  | Elasticsearch index updated via Kafka (future) | Backend | search-service | Not implemented |

---

## 9. Customer flows (order, cart, address, payment, feedback)

| ID  | Test case                                                                | Area               | Suite                   | Status          |
| --- | ------------------------------------------------------------------------ | ------------------ | ----------------------- | --------------- |
| F1  | Get restaurant details with dishes, price, availability (API)            | Backend            | order-service / search  | Not implemented |
| F2  | Get dish details with price and availability (API)                       | Backend            | search-service          | Not implemented |
| F3  | Recommendations for dishes/restaurants (API)                             | Backend            | personalization-service | Not implemented |
| F4  | Add to cart / get cart (API)                                             | Backend            | order-service           | Not implemented |
| F5  | Address list, add/edit, select for cart (API)                            | Backend            | customer-service        | Not implemented |
| F6  | Checkout, payment initiate, status, order details (API)                  | Backend            | order-service           | Not implemented |
| F7  | Order list, order tracking, cancel (API)                                 | Backend            | order-service           | Not implemented |
| F8  | Feedback against order/restaurant/dish (API)                             | Backend            | order-service           | Not implemented |
| F9  | Party planner: budget, veg/non-veg, multi-restaurant, schedule (future)  | Frontend + Backend | customer-app            | Not implemented |
| F10 | Diet planner: weekly calendar, skip/edit meals, schedule orders (future) | Frontend + Backend | customer-app            | Not implemented |

---

## 10. MCP layer (Swiggy, Zomato, ONDC)

| ID   | Test case                                                   | Area    | Suite           | Status          |
| ---- | ----------------------------------------------------------- | ------- | --------------- | --------------- |
| MCP1 | Mock Swiggy MCP server exposes /health, /tools, /tools/call | Mocks   | mock-swiggy-mcp | Not run         |
| MCP2 | Mock Zomato MCP server exposes /health, /tools, /tools/call | Mocks   | mock-zomato-mcp | Not run         |
| MCP3 | Mock ONDC MCP server exposes /health, /tools, /tools/call   | Mocks   | mock-ondc-mcp   | Not run         |
| MCP4 | MCP service routes to Swiggy/Zomato/ONDC based on config    | Backend | mcp-service     | Not implemented |
| MCP5 | Integration with real Swiggy MCP manifest (future)          | Backend | mcp-service     | Not implemented |
| MCP6 | Integration with real Zomato MCP manifest (future)          | Backend | mcp-service     | Not implemented |

---

## 11. Other backend services (health)

| ID  | Test case                               | Area    | Suite                   | Status |
| --- | --------------------------------------- | ------- | ----------------------- | ------ |
| H1  | Customer service health endpoint        | Backend | customer-service        | Passed |
| H2  | Restaurant service health endpoint      | Backend | restaurant-service      | Passed |
| H3  | Order service health endpoint           | Backend | order-service           | Passed |
| H4  | Workflow service health endpoint        | Backend | workflow-service        | Passed |
| H5  | Search service health endpoint          | Backend | search-service          | Passed |
| H6  | LLM service health endpoint             | Backend | llm-service             | Passed |
| H7  | MCP service health endpoint             | Backend | mcp-service             | Passed |
| H8  | Personalization service health endpoint | Backend | personalization-service | Passed |

---

## 12. Code review, analysis, security

| ID  | Test case                                                   | Area     | Suite | Status          |
| --- | ----------------------------------------------------------- | -------- | ----- | --------------- |
| Q1  | Lint passes for all packages                                | Root     | lint  | Not run in test |
| Q2  | No hardcoded secrets in source                              | Security | N/A   | Not implemented |
| Q3  | Dependencies have no known critical vulnerabilities (audit) | Root     | N/A   | Not implemented |

---

## How tests are run

- **Backend (NestJS):** `jest` in each `backend/*` package; `*.spec.ts` next to source or in `test/`.
- **Apps (React):** `vitest run` in `apps/customer-app` and `apps/restaurant-app`; `*.test.tsx` / `*.test.ts`.
- **Root:** `npm run test` runs `npx turbo run test` (all workspaces with `test` script; depends on `build`).
- **Report:** `npm run test:report` runs backend + app tests with JSON output and writes `test-results/TEST-REPORT.md` with summary, per-package results, and functionality coverage from FUNCTIONALITY-CHECKLIST.md.

---

## Traceability

- Requirements: `.claude/project-management/REQUIREMENTS.md` and per-domain `REQUIREMENTS.md`.
- Tasks: `.claude/project-management/TASK-BREAKDOWN.md`.
- Functionality coverage: `.claude/project-management/FUNCTIONALITY-CHECKLIST.md` (used by test report).

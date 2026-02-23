# Food Bot 2 – Task Breakdown (Production-Grade)

Tasks are granular work items. Each task goes through the full **agent SDLC process**: define requirement → generate test cases → generate code → code review → fix review issues → E2E test → fix test bugs → code analysis & quality → fix issues → security analysis → fix security issues → update task status.

**Status:** `pending` | `in_progress` | `complete` (tracked in [TASK-BOARD.json](TASK-BOARD.json)).

---

## Phase 0 – Foundation

| ID   | Title                        | Agent     | Depends on | Deliverable                                                                                              | Est |
| ---- | ---------------------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------- | --- |
| T001 | Shared types & API contracts | Architect | —          | `packages/types` with DTOs; OpenAPI schema fragments; shared error/auth types                            | M   |
| T002 | Infrastructure as code       | DevOps    | —          | Docker Compose (Postgres, Redis, Neo4j, Qdrant, ES, Kafka, Temporal); `.env.example`; setup/seed scripts | M   |
| T003 | CI/lint/format baseline      | DevOps    | —          | ESLint, Prettier config; npm lint/format scripts; pre-commit or CI run                                   | S   |

---

## Phase 1 – Configuration & API Gateway

| ID   | Title                                   | Agent   | Depends on | Deliverable                                                                                      | Est |
| ---- | --------------------------------------- | ------- | ---------- | ------------------------------------------------------------------------------------------------ | --- |
| T004 | LLM provider configuration              | Backend | T001       | Env-based on/off and API keys for Claude, OpenAI, Gemini; no keys in code; validation at startup | M   |
| T005 | MCP provider configuration              | Backend | T001       | Env-based enable/disable for Swiggy, Zomato, ONDC, mock MCP; URL/config per provider             | S   |
| T006 | API Gateway – routing, CORS, versioning | Backend | T001, T002 | NestJS gateway; route to services; CORS; `/v1` (or similar) versioning                           | M   |
| T007 | API Gateway – JWT auth & rate limiting  | Backend | T006       | JWT guard; rate limiting middleware; 401/429 handling; Swagger secured                           | M   |

---

## Phase 2 – Backend Core Services

| ID   | Title                                                     | Agent   | Depends on                   | Deliverable                                                                                               | Est |
| ---- | --------------------------------------------------------- | ------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- | --- |
| T008 | Customer service – profile & addresses API                | Backend | T001, T002, T006             | REST: get/update profile; list/add/edit/delete addresses; select address for cart; tests                  | M   |
| T009 | Restaurant service – onboarding API                       | Backend | T001, T002, T006             | REST: create restaurant; upload docs (KYC, FSSAI); contract/signature; approval state; tests              | L   |
| T010 | Restaurant service – menu CRUD API                        | Backend | T001, T002, T006, T009       | REST: CRUD menu items; categories; availability toggle; tests                                             | M   |
| T011 | Order service – cart, checkout, payment, order lifecycle  | Backend | T001, T002, T006, T008, T010 | REST: add/update cart; get cart; checkout; payment initiate/status; order create/list/track/cancel; tests | L   |
| T012 | Search service – Elasticsearch index & search/filter APIs | Backend | T001, T002, T006             | Index: restaurants, dishes (name, type, price, availability); search by name/type; filter APIs; tests     | L   |
| T013 | Search service – Kafka consumer for index updates         | Backend | T002, T012                   | Kafka consumer; on restaurant/menu/order events update ES index; idempotent                               | M   |

---

## Phase 3 – Personalization & LLM

| ID   | Title                                                    | Agent   | Depends on       | Deliverable                                                                                                          | Est |
| ---- | -------------------------------------------------------- | ------- | ---------------- | -------------------------------------------------------------------------------------------------------------------- | --- |
| T014 | Personalization service – Redis & Neo4j preference graph | Backend | T001, T002, T006 | Redis: session/cache; Neo4j: tree (dayOfWeek→hourOfDay→category→subcategory→restaurant→dish); read/write APIs; tests | L   |
| T015 | Vector cache (Qdrant) – prompt to intent/workflow cache  | Backend | T001, T002, T006 | Embed prompt; lookup cached intent/workflow; store on cache miss; reduce LLM calls; tests                            | M   |
| T016 | LLM service – multi-provider intent & workflow JSON      | Backend | T001, T004, T006 | Claude/OpenAI/Gemini; input: prompt + context; output: intent + workflow JSON; provider selection by config; tests   | L   |
| T017 | LLM service – integrate vector cache                     | Backend | T015, T016       | Before LLM call check cache; on miss call LLM and store; tests                                                       | M   |

---

## Phase 4 – Workflow & MCP

| ID   | Title                                                  | Agent            | Depends on       | Deliverable                                                                           | Est |
| ---- | ------------------------------------------------------ | ---------------- | ---------------- | ------------------------------------------------------------------------------------- | --- |
| T018 | Workflow service – job lifecycle & step status         | Backend          | T001, T006       | Create job; store workflow JSON; update step statuses; get job status; tests          | M   |
| T019 | Temporal – order workflow                              | Workflow         | T002, T011, T018 | Workflow: validate→place→confirm→track; activities call order/MCP; retry; tests       | M   |
| T020 | Temporal – party planner workflow                      | Workflow         | T002, T011, T018 | Workflow: multi-restaurant, schedule orders for future date; activities; tests        | L   |
| T021 | Temporal – diet planner workflow                       | Workflow         | T002, T011, T018 | Workflow: weekly plan, schedule orders per meal/date/address; activities; tests       | L   |
| T022 | MCP service – routing to Swiggy/Zomato/ONDC            | Backend          | T005, T006, T018 | Call internal/Swiggy/Zomato/ONDC tools by config; tool registry; tests                | L   |
| T023 | Mock MCP servers – Swiggy, Zomato, ONDC                | DevOps           | T005             | HTTP servers: /health, /tools, /tools/call; stub responses; used in E2E               | M   |
| T024 | Workflow resiliency – retry, circuit breaker, bulkhead | Backend/Workflow | T018, T022       | Retry policy; circuit breaker for MCP/LLM; bulkhead; fallback/alternative plan; tests | M   |

---

## Phase 5 – Customer App (Production UI)

| ID   | Title                                                                    | Agent    | Depends on       | Deliverable                                                                                          | Est |
| ---- | ------------------------------------------------------------------------ | -------- | ---------------- | ---------------------------------------------------------------------------------------------------- | --- |
| T025 | Customer app – auth (login, JWT, logout)                                 | Frontend | T007             | Login screen; JWT in storage/header; logout; protected routes                                        | M   |
| T026 | Customer app – rich chat UI (cards, CTAs, inputs)                        | Frontend | T006, T018       | Chat with message list; cards (image+text+attributes); CTAs; different input fields; rich components | L   |
| T027 | Customer app – job polling (prompt + userId, status/messages)            | Frontend | T018, T026       | Submit prompt with userId; get jobId; poll until done; show status and user-facing messages          | M   |
| T028 | Customer app – search, filters, restaurant/dish details, recommendations | Frontend | T012, T014       | Search restaurants/dishes; filters; detail pages; recommendations from personalization               | L   |
| T029 | Customer app – cart, addresses, checkout, payment UI                     | Frontend | T008, T011, T025 | Cart; address list/select; checkout flow; payment option; success/error                              | L   |
| T030 | Customer app – order list, tracking, cancel, feedback                    | Frontend | T011, T025       | Order list; tracking; cancel; feedback (order/restaurant/dish)                                       | M   |
| T031 | Customer app – party planner flow                                        | Frontend | T020, T026       | Budget, headcount, veg/non-veg; multi-restaurant menu; schedule for future date; place orders        | L   |
| T032 | Customer app – diet planner flow                                         | Frontend | T021, T026       | Weekly calendar; breakfast/lunch/snacks/dinner; skip/edit; schedule orders per meal/date/address     | L   |

---

## Phase 6 – Restaurant App (Production UI)

| ID   | Title                                                 | Agent    | Depends on       | Deliverable                                                                     | Est |
| ---- | ----------------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------- | --- |
| T033 | Restaurant app – auth                                 | Frontend | T007             | Login; JWT; protected routes                                                    | M   |
| T034 | Restaurant app – onboarding (multi-step)              | Frontend | T009, T033       | Multi-step: name, contact, photo, type, address, KYC, FSSAI, contract, approval | L   |
| T035 | Restaurant app – menu management (CRUD, availability) | Frontend | T010, T033       | List menu; add/edit/delete; toggle available; smart suggestions                 | M   |
| T036 | Restaurant app – order management (list, status)      | Frontend | T011, T033       | Order list; update status (placed→preparing→out_for_delivery→delivered)         | M   |
| T037 | Restaurant app – analytics                            | Frontend | T009, T011, T033 | Revenue, popular items, ratings; charts/tables                                  | M   |
| T038 | Restaurant app – marketing (campaigns, segments)      | Frontend | T016, T033       | Campaigns; segments; LLM content; scheduling; performance                       | L   |
| T039 | Restaurant app – AI insights (NL queries)             | Frontend | T016, T037, T033 | Natural language queries over analytics; LLM-backed                             | M   |

---

## Phase 7 – Browser Extension & API Docs

| ID   | Title                                               | Agent    | Depends on | Deliverable                                                                                | Est |
| ---- | --------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------ | --- |
| T040 | Chrome extension – workflow poll & client execution | Workflow | T018, T024 | Extension polls job workflow JSON; executes in browser; DOM parsing (optional small model) | L   |
| T041 | Gateway – aggregated OpenAPI docs                   | Backend  | T006       | Single Swagger/OpenAPI at gateway aggregating all service specs; try-it-out                | M   |

---

## Phase 8 – Quality & Security

| ID   | Title                                       | Agent     | Depends on             | Deliverable                                                                  | Est |
| ---- | ------------------------------------------- | --------- | ---------------------- | ---------------------------------------------------------------------------- | --- |
| T042 | E2E tests – critical paths                  | Test      | T029, T030, T034, T036 | E2E: customer order flow; restaurant order status update; runnable in CI     | L   |
| T043 | Code analysis & quality – fix all issues    | Review    | All                    | Static/dynamic analysis; fix lint, complexity, coverage gaps; document rules | M   |
| T044 | Security – SAST, dependency audit, secrets  | Security  | All                    | SAST run; npm audit; no hardcoded secrets; fix findings; SECURITY-AUDIT.md   | M   |
| T045 | Documentation – README, runbooks, API links | Team Lead | All                    | README with setup, run, test, links to requirements/tasks/API docs; runbooks | S   |

---

## Dependency Graph (Summary)

- **T001, T002, T003** → no deps (start here).
- **T004, T005** → T001.
- **T006** → T001, T002; **T007** → T006.
- **T008–T013** → T001, T002, T006 (+ T009 for T010, T008/T010 for T011).
- **T014–T017** → T001, T002, T006 (+ T004 for T016, T015 for T017).
- **T018** → T001, T006; **T019–T021** → T002, T011, T018; **T022** → T005, T006, T018; **T023** → T005; **T024** → T018, T022.
- **T025** → T007; **T026** → T006, T018; **T027** → T018, T026; **T028** → T012, T014; **T029** → T008, T011, T025; **T030** → T011, T025; **T031** → T020, T026; **T032** → T021, T026.
- **T033** → T007; **T034** → T009, T033; **T035** → T010, T033; **T036** → T011, T033; **T037** → T009, T011, T033; **T038** → T016, T033; **T039** → T016, T037, T033.
- **T040** → T018, T024; **T041** → T006.
- **T042** → T029, T030, T034, T036; **T043, T044** → All; **T045** → All.

---

## Estimation Legend

- **S** = Small (e.g. 1–2 days)
- **M** = Medium (e.g. 3–5 days)
- **L** = Large (e.g. 1–2 weeks)

---

_For each task: run the process in [AGENT-SDLC-PROCESS.md](AGENT-SDLC-PROCESS.md); update status in [TASK-BOARD.json](TASK-BOARD.json)._

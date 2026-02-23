# Food Bot 2 – Claude Multi-Agent Orchestration

This project uses **Claude Code Agent Teams** for spec-based development. Set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in your environment before running orchestration.

---

## 1. Agent Team Structure

| Agent            | Role         | Phase | File Ownership                                                                                               |
| ---------------- | ------------ | ----- | ------------------------------------------------------------------------------------------------------------ |
| **Team Lead**    | Orchestrator | All   | `.claude/`, root `README.md`, `CLAUDE.md`, `scripts/orchestrate.sh`                                          |
| **Requirements** | Analyst      | 1, 2  | `.claude/project-management/REQUIREMENTS.md`, `**/customer-app/`, `**/backend/`, etc. (docs only)            |
| **Architect**    | Design       | 1     | `.claude/project-management/ARCHITECTURE.md`, API contracts, data models                                     |
| **Frontend**     | Developer    | 3     | `apps/customer-app/`, `apps/restaurant-app/`, `packages/ui-kit/`                                             |
| **Backend**      | Developer    | 3     | `backend/*` (all NestJS services except workflow-service worker code)                                        |
| **Workflow**     | Developer    | 3     | `temporal/`, `backend/workflow-service/` (Temporal client), `apps/chrome-extension/`, `packages/mcp-client/` |
| **DevOps**       | Infra        | 3     | `infrastructure/`, `mocks/`, Dockerfiles, CI configs, `.env.example`                                         |
| **Test**         | QA           | 2, 4  | `.claude/project-management/TEST-PLAN.md`, all `**/*.spec.ts`, `**/*.test.ts`, e2e                           |
| **Review**       | Quality      | 4     | No ownership; read-only review of all code, outputs to `.claude/project-management/REVIEW.md`                |
| **Security**     | Security     | 4     | No ownership; audits all code, outputs to `.claude/project-management/SECURITY-AUDIT.md`                     |

---

## 2. Execution Phases

### Phase 1 – Requirements & Architecture (Parallel)

- **Requirements Agent**: Expand high-level requirements into detailed specs. Update `.claude/project-management/REQUIREMENTS.md` and per-domain docs under `.claude/project-management/`.
- **Architect Agent**: Produce system architecture, data models, API contracts. Update `.claude/project-management/ARCHITECTURE.md`.
- **Routing**: Parallel; no shared file writes between these two agents.

### Phase 2 – Task Planning & Test Cases (Sequential after Phase 1)

- **Requirements Agent**: Break requirements into granular tasks. Update `.claude/project-management/TASK-BREAKDOWN.md` with dependencies and agent assignments.
- **Test Agent**: Generate test cases from requirements. Update `.claude/project-management/TEST-PLAN.md`.
- **Routing**: Sequential; Test Agent runs after TASK-BREAKDOWN is updated.

### Phase 3 – Development (Parallel)

- **Frontend Agent**: Implements `apps/customer-app/`, `apps/restaurant-app/`, `packages/ui-kit/` (rich chat UI, Capacitor, state).
- **Backend Agent**: Implements all `backend/*` NestJS services (excluding Temporal workflow/activity code).
- **Workflow Agent**: Implements `temporal/`, workflow-service integration, `apps/chrome-extension/`, `packages/mcp-client/`.
- **DevOps Agent**: Implements `infrastructure/`, `mocks/*`, CI, seed scripts.
- **Routing**: Parallel; strict file ownership to avoid conflicts.

### Phase 4 – Quality Assurance (Parallel)

- **Test Agent**: Run all test suites; report failures in `.claude/project-management/TEST-RESULTS.md`.
- **Review Agent**: Code review; output to `.claude/project-management/REVIEW.md`.
- **Security Agent**: SAST, dependency audit, auth/secrets review; output to `.claude/project-management/SECURITY-AUDIT.md`.
- **Routing**: Parallel.

### Phase 5 – Fix & Verify (Sequential)

- **Team Lead or designated Fix Agent**: Address all test failures, review findings, and security issues.
- Re-run tests and security checks.
- **Routing**: Sequential; single agent to avoid merge conflicts.

### Phase 6 – Finalize

- **Team Lead**: Update root `README.md` with links to all `.claude/project-management/` docs. Run final integration test pass.

---

## 3. Routing Rules

- **Parallel**: Use when tasks have no shared writable files and no ordering requirement (Phases 1, 3, 4).
- **Sequential**: Use when one task’s output is input to another (Phase 2 after Phase 1, Phase 5 after Phase 4, Phase 6 last).
- **Background**: Use for non-blocking work (e.g. research, docs); agent can run with Ctrl+B and report later.

---

## 4. Shared Task List Format

Agents coordinate via a shared task board. Location: `.claude/project-management/TASK-BOARD.json`. Tasks (T001–T045) are defined in `.claude/project-management/TASK-BREAKDOWN.md` with dependencies and deliverables.

**Per-task process:** For each task, agents follow `.claude/project-management/AGENT-SDLC-PROCESS.md`: define requirement → generate test cases → generate code → code review → fix review issues → E2E test → fix test bugs → code analysis → fix issues → security analysis → fix security issues → update task status.

Task status: `pending` | `in_progress` | `complete`. Agents claim a task (dependencies complete) by setting `status` to `in_progress`; when the full SDLC process is done, set `status` to `complete`.

---

## 5. File Ownership (Conflict Avoidance)

| Owner             | Paths                                                                                                                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend          | `apps/customer-app/**`, `apps/restaurant-app/**`, `packages/ui-kit/**`                                                                                                                                                                                           |
| Backend           | `backend/api-gateway/**`, `backend/customer-service/**`, `backend/restaurant-service/**`, `backend/order-service/**`, `backend/search-service/**`, `backend/llm-service/**`, `backend/mcp-service/**`, `backend/personalization-service/**`, `backend/shared/**` |
| Workflow          | `temporal/**`, `backend/workflow-service/**`, `apps/chrome-extension/**`, `packages/mcp-client/**`                                                                                                                                                               |
| DevOps            | `infrastructure/**`, `mocks/**`, `.env.example`, `.github/**`                                                                                                                                                                                                    |
| Requirements      | `.claude/project-management/REQUIREMENTS.md`, `.claude/project-management/*/REQUIREMENTS.md`                                                                                                                                                                     |
| Architect         | `.claude/project-management/ARCHITECTURE.md`, `.claude/project-management/*/ARCHITECTURE.md`                                                                                                                                                                     |
| Test              | `.claude/project-management/TEST-PLAN.md`, `**/*.spec.ts`, `**/*.test.ts`, e2e configs                                                                                                                                                                           |
| Review / Security | Read-only; write only to their report files under `.claude/project-management/`                                                                                                                                                                                  |

No agent should edit files outside its ownership unless explicitly handoff (e.g. Team Lead updating README).

---

## 6. Environment Variables

- **Agent teams**: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- **LLM usage**: Configure via `.env` – `CLAUDE_*`, `OPENAI_*`, `GEMINI_*` (see `.env.example`).
- **MCP**: `MCP_SWIGGY_*`, `MCP_ZOMATO_*`, `MCP_ONDC_*`, `MCP_INTERNAL_*` for enable/disable and mock mode.

---

## 7. Dependency Graph (Handoffs)

1. **Phase 1** → REQUIREMENTS.md, ARCHITECTURE.md.
2. **Phase 2** → TASK-BREAKDOWN.md (depends on REQUIREMENTS), TEST-PLAN.md (depends on REQUIREMENTS).
3. **Phase 3** → All implementation (depends on TASK-BREAKDOWN and ARCHITECTURE).
4. **Phase 4** → TEST-RESULTS.md, REVIEW.md, SECURITY-AUDIT.md (depend on Phase 3 code).
5. **Phase 5** → Code and config fixes (depend on Phase 4 outputs).
6. **Phase 6** → README.md and final docs (depends on Phase 5).

---

## 8. Agent Definition Files

Each agent has a detailed definition under `.claude/agents/`:

- `AGENT-TEAM.md` – Team structure and coordination rules.
- `requirements-agent.md` – Requirements expansion and task breakdown.
- `architect-agent.md` – Architecture and API contracts.
- `frontend-agent.md` – Customer & restaurant apps, UI kit.
- `backend-agent.md` – NestJS microservices.
- `workflow-agent.md` – Temporal, MCP, chrome extension.
- `devops-agent.md` – Infrastructure and mocks.
- `test-agent.md` – Test plan and execution.
- `review-agent.md` – Code review process.
- `security-agent.md` – Security audit process.

Reference the appropriate agent file when invoking or briefing each agent.

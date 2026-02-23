# Food Bot 2 – Agent Team Structure & Coordination

## Team Overview

The Food Bot 2 project uses a multi-agent team to perform spec-based development. One session acts as **Team Lead**; other agents run in parallel or sequence as defined in `CLAUDE.md`.

## Agent Roster

| Agent            | Primary Responsibility                                              | Phases | Coordination                                            |
| ---------------- | ------------------------------------------------------------------- | ------ | ------------------------------------------------------- |
| **Team Lead**    | Orchestrate phases, resolve conflicts, update README and task board | All    | Assigns work; merges handoffs                           |
| **Requirements** | Expand requirements; produce TASK-BREAKDOWN                         | 1, 2   | Writes REQUIREMENTS.md, TASK-BREAKDOWN.md               |
| **Architect**    | System design; API contracts; data models                           | 1      | Writes ARCHITECTURE.md                                  |
| **Frontend**     | Customer app, Restaurant app, UI kit                                | 3      | Owns apps/\* (except chrome-extension), packages/ui-kit |
| **Backend**      | All NestJS services (except Temporal worker code)                   | 3      | Owns backend/\* per CLAUDE.md                           |
| **Workflow**     | Temporal, MCP client, chrome extension                              | 3      | Owns temporal/, chrome-extension, mcp-client            |
| **DevOps**       | Infrastructure, mocks, CI, env                                      | 3      | Owns infrastructure/, mocks/                            |
| **Test**         | Test plan; test execution; result reporting                         | 2, 4   | Writes TEST-PLAN.md, TEST-RESULTS.md                    |
| **Review**       | Code review; quality report                                         | 4      | Writes REVIEW.md (read-only on code)                    |
| **Security**     | Security audit; SAST; dependency audit                              | 4      | Writes SECURITY-AUDIT.md (read-only on code)            |

## Coordination Rules

1. **Claim before edit**: Before editing shared docs (e.g. TASK-BOARD.json), check current phase and task status.
2. **File ownership**: Do not edit files outside your ownership (see CLAUDE.md) unless handoff is explicit.
3. **Handoffs**: Phase 2 starts after Phase 1 deliverables exist; Phase 3 after TASK-BREAKDOWN and TEST-PLAN; Phase 4 after Phase 3 code; Phase 5 after Phase 4 reports.
4. **Parallel safety**: In Phase 3, Frontend, Backend, Workflow, and DevOps run in parallel with no overlapping file ownership.
5. **Single writer for fixes**: Phase 5 (fixes) is done by one agent (Team Lead or designated Fix Agent) to avoid merge conflicts.

## Task Board

Location: `.claude/project-management/TASK-BOARD.json`. Update task status when starting (`in_progress`) and when done (`done`) or blocked (`blocked`).

## Invoking Agents

When starting a phase, reference the specific agent file (e.g. "Act as the Frontend Agent per .claude/agents/frontend-agent.md") and the current phase so the agent knows its scope and ownership.

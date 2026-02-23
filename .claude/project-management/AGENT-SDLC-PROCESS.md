# Agent SDLC Process – Per-Task Workflow

This document defines the **production-grade process** applied to **each task** in [TASK-BREAKDOWN.md](TASK-BREAKDOWN.md). The agent team runs these steps in order (sequential within a task); multiple tasks can run in **parallel** when dependencies allow, with **sequential** ordering where one task depends on another.

---

## 1. Pick a task

- **Source:** [TASK-BOARD.json](TASK-BOARD.json) and [TASK-BREAKDOWN.md](TASK-BREAKDOWN.md).
- Only pick a task whose dependencies (Depends on) are **complete**.
- Set the task status to **`in_progress`** in TASK-BOARD.json.
- One task at a time per agent (or per “slot”) unless explicitly running parallel agents on independent tasks.

---

## 2. Define requirement (for this task)

- **Owner:** Requirements Agent (or the agent doing the task, if no dedicated Requirements Agent).
- **Actions:**
  - Ensure the task has a clear **deliverable** and **acceptance criteria** (in TASK-BREAKDOWN or in the relevant `REQUIREMENTS.md`).
  - If missing, write a short requirement note: what must be built, inputs/outputs, and “done” criteria.
  - Reference the requirement in the task (e.g. “REQ-CUST-001” or section in `customer-app/REQUIREMENTS.md`).
- **Output:** Requirement is documented and traceable to the task.

---

## 3. Generate test cases

- **Owner:** Test Agent (or the implementing agent).
- **Actions:**
  - Add/update test cases in [TEST-PLAN.md](TEST-PLAN.md) for this task (with test case IDs).
  - Add unit/integration (and E2E if applicable) tests in the codebase (`*.spec.ts`, `*.test.tsx`, etc.).
  - Tests must be **runnable** via `npm run test` (or the relevant package test script).
- **Output:** Test cases documented; automated tests written and passing for the **existing** code (may be minimal until step 5).

---

## 4. Generate code

- **Owner:** Agent assigned in TASK-BREAKDOWN (Frontend, Backend, Workflow, DevOps, etc.).
- **Actions:**
  - Implement the deliverable for the task (APIs, UI, workflows, config, etc.).
  - Follow [ARCHITECTURE.md](ARCHITECTURE.md) and shared types/contracts from T001.
  - Use production-grade patterns: error handling, validation, logging, no hardcoded secrets.
- **Output:** Code merged/committed; build passes (`npm run build`).

---

## 5. Code review

- **Owner:** Review Agent (or designated reviewer).
- **Actions:**
  - Review the code for: correctness, readability, alignment with architecture, error handling, logging.
  - Record findings in `.claude/project-management/REVIEW.md` (or a task-specific review note) with task ID.
  - List required changes (must-fix) and suggestions (optional).
- **Output:** Review document with list of issues.

---

## 6. Fix code review issues

- **Owner:** Agent that wrote the code (or Team Lead).
- **Actions:**
  - Address every **must-fix** from the review.
  - Optionally address suggestions.
  - Re-run build and tests.
- **Output:** All must-fix items resolved; tests still pass.

---

## 7. Test end-to-end

- **Owner:** Test Agent (or implementing agent).
- **Actions:**
  - Run the full test suite for the affected area: `npm run test` (and `npm run test:report` if available).
  - For UI/flow tasks: manually or via E2E run the critical path (e.g. submit prompt → job done → order placed).
  - Record any failure (assertion, regression, missing case).
- **Output:** Test run result (pass/fail) and list of failures if any.

---

## 8. Fix testing bugs

- **Owner:** Agent that wrote the code.
- **Actions:**
  - Fix all failures from step 7 (logic bugs, missing cases, flaky tests).
  - Re-run tests until they pass.
- **Output:** All relevant tests passing.

---

## 9. Code analysis and code quality

- **Owner:** Review Agent or DevOps.
- **Actions:**
  - Run static/dynamic analysis (e.g. ESLint, TypeScript strict, any Sonar/custom rules).
  - Check complexity, duplication, coverage (if configured).
  - Document and fix issues (or create follow-up tasks for non-blocking items).
- **Output:** No blocking issues; known technical debt recorded if needed.

---

## 10. Security analysis

- **Owner:** Security Agent (or designated security reviewer).
- **Actions:**
  - Run SAST (if available); run `npm audit`; check for hardcoded secrets, unsafe dependencies, auth/input validation.
  - Record findings in `.claude/project-management/SECURITY-AUDIT.md` (or task-specific) with task ID.
- **Output:** Security findings list (or “no findings”).

---

## 11. Fix security issues

- **Owner:** Agent that wrote the code or Security Agent.
- **Actions:**
  - Fix all **must-fix** security issues (secrets, critical/high vulnerabilities, auth flaws).
  - Re-run tests and security checks.
- **Output:** Must-fix security issues resolved.

---

## 12. Update task status

- **Owner:** Any agent (typically Team Lead or the one who completed the task).
- **Actions:**
  - Set the task status to **`complete`** in [TASK-BOARD.json](TASK-BOARD.json).
  - Optionally add a short note (e.g. “PR #X”, “E2E green”).
  - Update [FUNCTIONALITY-CHECKLIST.md](FUNCTIONALITY-CHECKLIST.md) if this task maps to a row there.
- **Output:** TASK-BOARD.json and checklist reflect completion.

---

## Parallel vs sequential

- **Between tasks:** Run tasks in **parallel** when they have no dependency on each other and no shared writable files (respect agent file ownership in [CLAUDE.md](../CLAUDE.md)).
- **Within a task:** Run steps 1–12 **sequentially** (define requirement → tests → code → review → fix → E2E → fix → analysis → fix → security → fix → status).
- **Phases:** Prefer finishing Phase N (or a dependency set) before starting tasks that depend on it.

---

## Checklist (per task)

- [ ] Task picked; dependencies complete; status = `in_progress`
- [ ] Requirement defined and referenced
- [ ] Test cases added/updated; tests run and pass
- [ ] Code implemented; build passes
- [ ] Code review done; must-fix issues listed
- [ ] Review issues fixed; tests pass
- [ ] E2E / full test run done; failures recorded
- [ ] Test failures fixed; tests pass
- [ ] Code analysis run; blocking issues fixed
- [ ] Security analysis run; findings recorded
- [ ] Security issues fixed
- [ ] Task status = `complete`; board and checklist updated

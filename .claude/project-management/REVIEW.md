# Code Review Log

Findings from Review Agent per [AGENT-SDLC-PROCESS.md](AGENT-SDLC-PROCESS.md). Must-fix items must be addressed before marking the task complete.

---

## Phase 0

### T001 – Shared types & API contracts

- **Review:** Types are clear and exported; `createPaginationResult` is pure and testable. OpenAPI fragments re-export from job/error/auth/pagination.
- **Must-fix:** None.
- **Suggestions:** Consider exporting `HttpStatus` as const object in openapi-fragments for backend DTOs. Optional.

### T002 – Infrastructure as code

- **Review:** docker-compose.yml has all services and healthchecks; .env.example is complete; setup-infra.sh and seed-data.sh exist; infrastructure/README.md documents ports and usage.
- **Must-fix:** None.
- **Suggestions:** When backend has seed endpoints, extend seed-data.sh to call them.

### T003 – CI/lint/format baseline

- **Review:** Prettier config and format/format:check scripts added at root. Lint remains per-workspace (turbo run lint). No root ESLint flat config (delegates to workspaces).
- **Must-fix:** None.
- **Suggestions:** Run `npm run format` periodically or in CI to keep code formatted.

---

### T004 – LLM provider configuration

- **Review:** getLlmConfig/validateLlmConfig read env; no keys logged; startup validation logs warnings.
- **Must-fix:** None.

### T005 – MCP provider configuration

- **Review:** getMcpConfig reads enable/disable and URL per provider; tests cover env parsing.
- **Must-fix:** None.

### T006 – API Gateway routing, CORS, versioning

- **Review:** setGlobalPrefix('v1'); CORS already enabled; customer-app api.ts updated to /v1.
- **Must-fix:** None.

---

_Next: T007 (JWT auth & rate limiting), then Phase 2._

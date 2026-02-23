# Phase 0 – Requirement Notes (T001, T002, T003)

Traceability: [TASK-BREAKDOWN.md](TASK-BREAKDOWN.md) Phase 0.

---

## T001 – Shared types & API contracts (REQ-T001)

**Deliverable:** `packages/types` with DTOs; OpenAPI schema fragments; shared error/auth types.

**Acceptance criteria:**

- Export JobStatus, WorkflowStep, IntentWorkflow (existing).
- Export shared **API error** type (e.g. code, message, statusCode) for gateway/services.
- Export **auth** types: UserId, JwtPayload (sub, exp, iat, optional roles).
- Export **pagination** type: PaginationResult&lt;T&gt; (items, total, page, pageSize).
- OpenAPI-friendly: types usable by @nestjs/swagger or OpenAPI generators (no runtime dependency on Nest); document in package README or schema fragment.
- Build passes; types consumable by backend and apps.

**Done when:** All above exported from `packages/types`; build and tests pass.

---

## T002 – Infrastructure as code (REQ-T002)

**Deliverable:** Docker Compose (Postgres, Redis, Neo4j, Qdrant, ES, Kafka, Temporal); `.env.example`; setup/seed scripts.

**Acceptance criteria:**

- `infrastructure/docker-compose.yml`: Postgres, Redis, Neo4j, Qdrant, Elasticsearch, Zookeeper, Kafka, Temporal; healthchecks; volumes.
- `.env.example`: All required env vars documented (DB, Redis, Neo4j, Qdrant, ES, Kafka, Temporal, gateway, service URLs, LLM/MCP config).
- `scripts/setup-infra.sh`: Starts infra from repo root; checks Docker; prints next steps.
- `scripts/seed-data.sh`: Placeholder or minimal seed; documented for future backend seed endpoints.
- `infrastructure/README.md`: How to run (docker-compose up), required env, ports, stop/down.

**Done when:** Infra starts with `./scripts/setup-infra.sh` (with Docker running); README and scripts in place.

---

## T003 – CI/lint/format baseline (REQ-T003)

**Deliverable:** ESLint, Prettier config; npm lint/format scripts; pre-commit or CI run.

**Acceptance criteria:**

- Root **ESLint** config (flat config preferred for ESLint 9) applicable to apps, backend, packages (or delegates to workspace configs).
- Root **Prettier** config (e.g. .prettierrc, .prettierignore) for consistent formatting.
- Root `package.json`: `lint` (existing turbo run lint), `format` (prettier --write), `format:check` (prettier --check).
- Prettier as devDependency at root (or in workspaces that need it).
- No blocking lint/format errors on existing code (or documented exceptions).

**Done when:** `npm run lint` and `npm run format:check` run without error (or with allowed exceptions documented).

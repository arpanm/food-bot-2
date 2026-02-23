# Food Bot 2 – Architecture (Master)

> This document is produced by the **Architect Agent** in Phase 1. Below is a placeholder; agents will add system design, data models, and API contracts.

## 1. System Overview

- **Frontends**: Customer app, Restaurant app (Capacitor + React); Chrome extension for browser-based workflow execution.
- **Gateway**: NestJS API gateway (auth, routing).
- **Services**: Customer, Restaurant, Order, Workflow, Search, LLM, MCP, Personalization (NestJS).
- **Workflow**: Temporal (primary); agent SDK / browser when needed.
- **Data**: PostgreSQL, Redis, Neo4j (preference graph), Qdrant (vector), Elasticsearch (search), Kafka (events).

## 2. Data Flow (To Be Detailed)

- Chat → jobId → personalization → LLM (intent/workflow) → workflow service → Temporal/MCP → status updates → polling.

## 3. Data Models (To Be Detailed)

- **ERD**: Users, Restaurants, Menus, Orders, Jobs, Workflows, etc.
- **Neo4j**: User → DayOfWeek → HourOfDay → Category → … → Dish.
- **Elasticsearch**: Restaurants, dishes, filters; Kafka-based indexing.
- **Qdrant**: Intent/workflow cache keyed by prompt embedding.

## 4. API Contracts (To Be Detailed)

- Per-service OpenAPI or endpoint list; auth and error formats.

## 5. Deployment

- Docker Compose: all backing services; optional K8s.

---

_Architect Agent: replace with full architecture, diagrams (mermaid), and references to REQUIREMENTS.md._

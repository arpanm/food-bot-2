# Food Bot 2 – Infrastructure (T002)

Docker Compose stack for local development. All services use healthchecks and persistent volumes.

## Services and ports

| Service       | Port(s)     | Purpose                 |
| ------------- | ----------- | ----------------------- |
| Postgres      | 5432        | Primary DB; Temporal DB |
| Redis         | 6379        | Cache, session          |
| Neo4j         | 7474, 7687  | Preference graph        |
| Qdrant        | 6333        | Vector cache            |
| Elasticsearch | 9200, 9300  | Search index            |
| Zookeeper     | 2181        | Kafka coordination      |
| Kafka         | 9092, 29092 | Events, index updates   |
| Temporal      | 7233        | Workflow engine         |

## Prerequisites

- Docker and Docker Compose
- Copy `.env.example` to `.env` at repo root and set passwords/keys as needed

## Start

From **repo root**:

```bash
./scripts/setup-infra.sh
# or
npm run infra:up
```

Or from this directory:

```bash
docker-compose up -d
```

Wait for healthchecks (about 30–60 seconds). Check:

```bash
docker-compose ps
docker-compose logs -f
```

## Stop

From repo root: `npm run infra:down`  
Or: `docker-compose -f infrastructure/docker-compose.yml down`

## Seed data

From repo root: `./scripts/seed-data.sh`  
When backend seed endpoints or migrations exist, the script will call them. Until then it is a documented placeholder.

## Environment

See `.env.example` at repo root for:

- `POSTGRES_*`, `REDIS_URL`, `NEO4J_*`, `QDRANT_*`, `ELASTICSEARCH_NODE`, `KAFKA_BROKERS`, `TEMPORAL_*`
- Service URLs and API Gateway port
- LLM and MCP configuration

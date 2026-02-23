#!/usr/bin/env bash
# Start Food Bot 2 infrastructure (Docker Compose)
# Usage: from repo root, ./scripts/setup-infra.sh
# Requires: Docker, docker-compose

set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ ! -f "infrastructure/docker-compose.yml" ]; then
  echo "Missing infrastructure/docker-compose.yml"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not running. Please start Docker Desktop (or your Docker daemon) and try again."
  exit 1
fi

echo "Starting infrastructure..."
cd infrastructure
docker-compose up -d

echo "Waiting for services to be healthy..."
sleep 10
echo "Postgres (5432), Redis (6379), Neo4j (7474/7687), Qdrant (6333), Elasticsearch (9200), Kafka (9092), Temporal (7233)"
echo "Run: docker-compose -f infrastructure/docker-compose.yml logs -f"
echo "Stop: docker-compose -f infrastructure/docker-compose.yml down"

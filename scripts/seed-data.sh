#!/usr/bin/env bash
# Seed test data for Food Bot 2
# Usage: from repo root, ./scripts/seed-data.sh
# Requires: infrastructure running (or env pointing to existing DBs)
# Optional: backend services running with seed endpoints; or run SQL/Neo4j scripts here

set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Seed data script - placeholder"
echo "When backend seed endpoints or migrations exist, call them here."
echo "Example: curl -X POST http://localhost:3001/seed"
exit 0

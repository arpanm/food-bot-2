#!/usr/bin/env bash
# Food Bot 2 - Launch Claude agent teams with phase sequencing
# Set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 before running Claude Code
# This script prints instructions for each phase; actual agent invocation is manual or via your automation.

set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "=== Food Bot 2 - Agent Orchestration ==="
echo "Ensure CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 is set."
echo ""

echo "Phase 1 (Parallel): Requirements & Architecture"
echo "  - Requirements Agent: Expand REQUIREMENTS.md and per-domain docs in .claude/project-management/"
echo "  - Architect Agent: Produce ARCHITECTURE.md with system design, data models, API contracts"
echo "  Run both in parallel (e.g. two Claude sessions)."
echo ""

echo "Phase 2 (Sequential): Task Planning & Test Cases"
echo "  - Requirements Agent: Update TASK-BREAKDOWN.md from REQUIREMENTS.md"
echo "  - Test Agent: Update TEST-PLAN.md from REQUIREMENTS.md"
echo "  Run after Phase 1 deliverables exist."
echo ""

echo "Phase 3 (Parallel): Development"
echo "  - Frontend Agent: apps/customer-app, apps/restaurant-app, packages/ui-kit"
echo "  - Backend Agent: backend/* (all NestJS services)"
echo "  - Workflow Agent: temporal/, apps/chrome-extension, packages/mcp-client"
echo "  - DevOps Agent: infrastructure/, mocks/, CI, seed scripts"
echo "  Run all four in parallel; respect file ownership in CLAUDE.md."
echo ""

echo "Phase 4 (Parallel): Quality Assurance"
echo "  - Test Agent: Execute all test suites; write TEST-RESULTS.md"
echo "  - Review Agent: Code review; write REVIEW.md"
echo "  - Security Agent: SAST, dependency audit; write SECURITY-AUDIT.md"
echo ""

echo "Phase 5 (Sequential): Fix & Verify"
echo "  - Fix Agent / Team Lead: Address test failures, review issues, security findings"
echo "  - Re-run tests and audits"
echo ""

echo "Phase 6: Finalize"
echo "  - Team Lead: Update README.md with links to .claude/project-management/ docs"
echo "  - Final integration test pass"
echo ""

echo "Task board: .claude/project-management/TASK-BOARD.json"
echo "Agent definitions: .claude/agents/"
echo "Done."

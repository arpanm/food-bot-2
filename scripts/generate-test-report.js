#!/usr/bin/env node
/**
 * Runs all tests with JSON output, then generates TEST-REPORT.md with:
 * - Summary (passed/failed/skipped totals)
 * - Per-package results (which tests ran, pass/fail)
 * - Functionality coverage (from FUNCTIONALITY-CHECKLIST.md)
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESULTS_DIR = path.join(ROOT, 'test-results');
const CHECKLIST_PATH = path.join(ROOT, '.claude/project-management/FUNCTIONALITY-CHECKLIST.md');
const REPORT_PATH = path.join(ROOT, 'test-results/TEST-REPORT.md');

const BACKEND_PACKAGES = [
  'api-gateway',
  'customer-service',
  'restaurant-service',
  'order-service',
  'workflow-service',
  'search-service',
  'llm-service',
  'mcp-service',
  'personalization-service',
];
const APP_PACKAGES = ['customer-app', 'restaurant-app'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function runJest(pkg) {
  const cwd = path.join(ROOT, 'backend', pkg);
  const outFile = path.join(RESULTS_DIR, `backend-${pkg}.json`);
  const relPath = path.relative(cwd, outFile);
  const result = spawnSync(
    'npx',
    ['jest', '--json', '--outputFile', relPath, '--passWithNoTests', '--silent'],
    {
      cwd,
      encoding: 'utf8',
      timeout: 60000,
    }
  );
  return { pkg: `backend/${pkg}`, success: result.status === 0, outFile };
}

function runVitest(pkg) {
  const cwd = path.join(ROOT, 'apps', pkg);
  const outFile = path.join(RESULTS_DIR, `app-${pkg}.json`);
  const relPath = path.relative(cwd, outFile);
  const result = spawnSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${relPath}`], {
    cwd,
    encoding: 'utf8',
    timeout: 60000,
  });
  return { pkg: `apps/${pkg}`, success: result.status === 0, outFile };
}

function parseJestJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    const tests = [];
    (data.testResults || []).forEach((file) => {
      (file.assertionResults || []).forEach((a) => {
        tests.push({
          name: a.fullName || a.title,
          status: a.status, // passed | failed | skipped | pending
        });
      });
    });
    return {
      passed: data.numPassedTests || 0,
      failed: data.numFailedTests || 0,
      skipped: data.numPendingTests || 0,
      total: (data.numPassedTests || 0) + (data.numFailedTests || 0) + (data.numPendingTests || 0),
      tests,
      success: data.numFailedTests === 0,
    };
  } catch (e) {
    return { passed: 0, failed: 0, skipped: 0, total: 0, tests: [], success: false };
  }
}

function parseVitestJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    const files = Array.isArray(data) ? data : data.testResults || data.files || [];
    const tests = [];
    let passed = 0,
      failed = 0;
    files.forEach((file) => {
      const assertions = file.assertionResults || file.tasks || [];
      assertions.forEach((a) => {
        const status =
          a.status || (a.state === 'pass' ? 'passed' : a.state === 'fail' ? 'failed' : 'skipped');
        tests.push({ name: a.title || a.name || a.fullName || 'test', status });
        if (status === 'passed') passed++;
        else if (status === 'failed') failed++;
      });
    });
    return {
      passed,
      failed,
      skipped: 0,
      total: passed + failed,
      tests,
      success: failed === 0,
    };
  } catch (e) {
    return { passed: 0, failed: 0, skipped: 0, total: 0, tests: [], success: false };
  }
}

function main() {
  ensureDir(RESULTS_DIR);
  const allResults = {};
  let totalPassed = 0,
    totalFailed = 0,
    totalSkipped = 0;

  console.log('Running backend tests (Jest)...');
  BACKEND_PACKAGES.forEach((pkg) => {
    const { pkg: key, outFile } = runJest(pkg);
    const result = parseJestJson(outFile);
    allResults[key] = result;
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalSkipped += result.skipped;
  });

  console.log('Running app tests (Vitest)...');
  APP_PACKAGES.forEach((pkg) => {
    const { pkg: key, outFile } = runVitest(pkg);
    const result = parseVitestJson(outFile);
    allResults[key] = result;
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalSkipped += result.skipped;
  });

  const resultsBySuite = {};
  Object.entries(allResults).forEach(([k, v]) => {
    resultsBySuite[k] = v;
  });

  let checklistContent = '';
  if (fs.existsSync(CHECKLIST_PATH)) {
    checklistContent = fs.readFileSync(CHECKLIST_PATH, 'utf8');
  }

  const reportLines = [
    '# Test Report',
    '',
    `**Generated:** ${new Date().toISOString()}`,
    '',
    '---',
    '',
    '## 1. Executive Summary',
    '',
    '| Metric | Count |',
    '|--------|-------|',
    `| **Passed** | ${totalPassed} |`,
    `| **Failed** | ${totalFailed} |`,
    `| **Skipped** | ${totalSkipped} |`,
    `| **Total** | ${totalPassed + totalFailed + totalSkipped} |`,
    '',
    totalFailed > 0 ? '**Result:** ❌ Some tests failed.' : '**Result:** ✅ All run tests passed.',
    '',
    '---',
    '',
    '## 2. Per-Package Results',
    '',
  ];

  Object.entries(allResults).forEach(([pkg, r]) => {
    const icon = r.failed > 0 ? '❌' : r.total > 0 ? '✅' : '⚪';
    reportLines.push(`### ${icon} ${pkg}`);
    reportLines.push('');
    reportLines.push(`| Passed | Failed | Skipped | Total |`);
    reportLines.push(`|--------|--------|---------|-------|`);
    reportLines.push(`| ${r.passed} | ${r.failed} | ${r.skipped} | ${r.total} |`);
    reportLines.push('');
    if (r.tests.length > 0) {
      reportLines.push('| Test | Status |');
      reportLines.push('|------|--------|');
      r.tests.forEach((t) => {
        const s =
          t.status === 'passed' ? '✅ Passed' : t.status === 'failed' ? '❌ Failed' : '⏭️ Skipped';
        reportLines.push(`| ${t.name} | ${s} |`);
      });
      reportLines.push('');
    } else {
      reportLines.push('*No test cases in this package (or suite has passWithNoTests).*');
      reportLines.push('');
    }
  });

  reportLines.push('---');
  reportLines.push('');
  reportLines.push('## 3. Functionality Coverage');
  reportLines.push('');
  reportLines.push(
    'Based on [FUNCTIONALITY-CHECKLIST.md](.claude/project-management/FUNCTIONALITY-CHECKLIST.md).'
  );
  reportLines.push('');
  reportLines.push('| # | Functionality | Area | Test Suite | Status |');
  reportLines.push('|---|---------------|------|------------|--------|');

  const statusBySuite = {};
  Object.entries(allResults).forEach(([suite, r]) => {
    const key = suite.replace('backend/', '').replace('apps/', '');
    statusBySuite[key] = r.failed > 0 ? 'Failed' : r.total > 0 ? 'Passed' : 'Not run';
  });

  const tableMatch = checklistContent.match(/\|\s*#\s*\|[\s\S]*?\n(?=\s*---|\s*\*\*|$)/);
  if (tableMatch) {
    const table = tableMatch[0];
    const dataRows = table.split('\n').filter((l) => /^\|\s*\d+\s*\|/.test(l));
    dataRows.forEach((row) => {
      const cells = row
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);
      if (cells.length >= 5) {
        const num = cells[0];
        const func = cells[1];
        const area = cells[2];
        const suite = cells[3];
        const originalStatus = (cells[4] || 'Not run').trim();
        const status =
          originalStatus === 'Not implemented'
            ? 'Not implemented'
            : statusBySuite[suite] || originalStatus || 'Not run';
        reportLines.push(`| ${num} | ${func} | ${area} | ${suite} | ${status} |`);
      }
    });
  }

  reportLines.push('');
  reportLines.push('---');
  reportLines.push('');
  reportLines.push('## 4. Not Yet Implemented / Not Covered');
  reportLines.push('');
  reportLines.push(
    '- Functionalities marked **Not implemented** in the checklist have no implementation or tests yet.'
  );
  reportLines.push(
    '- **Not run** means the test suite ran but had no test cases (e.g. passWithNoTests).'
  );
  reportLines.push(
    '- Add tests in the corresponding package and re-run `npm run test:report` to update this report.'
  );
  reportLines.push('');

  fs.writeFileSync(REPORT_PATH, reportLines.join('\n'), 'utf8');
  console.log(`\nReport written to ${REPORT_PATH}`);
}

main();

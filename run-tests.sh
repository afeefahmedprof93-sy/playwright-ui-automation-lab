#!/usr/bin/env bash
# run-tests.sh — for macOS / Linux users
set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Colour

echo ""
echo "============================================================"
echo "  Automation Exercise - Playwright Test Runner"
echo "============================================================"
echo ""

# ─── Step 1: Check Node.js ───────────────────────────────────────────────────
echo "[1/5] Checking Node.js..."
if ! command -v node &>/dev/null; then
    echo -e "${RED}  ERROR: Node.js is not installed or not in PATH."
    echo -e "  Install from https://nodejs.org (v18 or higher)${NC}"
    exit 1
fi
echo -e "${GREEN}  Node.js found: $(node -v)${NC}"

# ─── Step 2: Install npm dependencies ───────────────────────────────────────
echo ""
echo "[2/5] Installing npm dependencies..."
if [ -d "node_modules" ]; then
    echo "  node_modules exists — checking for updates..."
    npm install --silent
else
    echo "  node_modules not found — running npm install..."
    npm install
fi
echo -e "${GREEN}  Dependencies ready.${NC}"

# ─── Step 3: Install Playwright browsers ────────────────────────────────────
echo ""
echo "[3/5] Checking Playwright browsers..."
if npx playwright install --dry-run chromium 2>&1 | grep -q "browser is up to date"; then
    echo "  Chromium already installed — skipping."
else
    echo "  Installing Chromium + system dependencies..."
    npx playwright install chromium --with-deps
fi
echo -e "${GREEN}  Browsers ready.${NC}"

# ─── Step 4: Type-check ──────────────────────────────────────────────────────
echo ""
echo "[4/5] Type-checking TypeScript..."
if npx tsc --noEmit; then
    echo -e "${GREEN}  No type errors.${NC}"
else
    echo -e "${YELLOW}  WARNING: TypeScript type errors found. Tests will still run.${NC}"
fi

# ─── Step 5: Run tests ───────────────────────────────────────────────────────
echo ""
echo "[5/5] Running all Playwright tests..."
echo "  (HTML report opens automatically when tests finish)"
echo ""

set +e
npx playwright test
TEST_EXIT=$?
set -e

echo ""
echo "============================================================"
if [ $TEST_EXIT -eq 0 ]; then
    echo -e "${GREEN}  All tests PASSED!${NC}"
else
    echo -e "${RED}  Some tests FAILED — check the report for details.${NC}"
fi
echo "============================================================"
echo ""
echo "  Report: $(pwd)/playwright-report/index.html"
echo "  To re-open manually: npx playwright show-report"
echo ""

exit $TEST_EXIT

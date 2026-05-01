@echo off
setlocal EnableDelayedExpansion

echo.
echo ============================================================
echo   Automation Exercise - Playwright Test Runner
echo ============================================================
echo.

:: ─── Step 1: Check Node.js ───────────────────────────────────────────────────
echo [1/5] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: Node.js is not installed or not in PATH.
    echo  Please install Node.js from https://nodejs.org  (v18 or higher^)
    echo  Then re-run this script.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo  Node.js found: %NODE_VERSION%

:: ─── Step 2: Install npm dependencies ───────────────────────────────────────
echo.
echo [2/5] Installing npm dependencies...

if exist "node_modules" (
    echo  node_modules already exists - checking for updates...
    call npm install --silent
) else (
    echo  node_modules not found - running npm install...
    call npm install
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: npm install failed. Check your internet connection and try again.
    pause
    exit /b 1
)
echo  Dependencies ready.

:: ─── Step 3: Install Playwright browsers ────────────────────────────────────
echo.
echo [3/5] Checking Playwright browsers...

:: Check if chromium is already installed by looking for its executable
set BROWSERS_PATH=%USERPROFILE%\AppData\Local\ms-playwright
if exist "%BROWSERS_PATH%\chromium-*\chrome-win\chrome.exe" (
    echo  Chromium already installed - skipping browser install.
) else (
    echo  Installing Playwright browsers (Chromium + dependencies^)...
    call npx playwright install chromium --with-deps
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo  ERROR: Playwright browser installation failed.
        pause
        exit /b 1
    )
    echo  Browsers installed successfully.
)

:: ─── Step 4: Build / type-check ─────────────────────────────────────────────
echo.
echo [4/5] Type-checking TypeScript...
call npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  WARNING: TypeScript type errors found (see above^).
    echo  Tests will still run - type errors do not prevent execution.
    echo.
)

:: ─── Step 5: Run tests ───────────────────────────────────────────────────────
echo.
echo [5/5] Running all Playwright tests...
echo  (The HTML report will open automatically when tests finish^)
echo.

call npx playwright test

set TEST_EXIT=%ERRORLEVEL%

echo.
echo ============================================================
if %TEST_EXIT% EQU 0 (
    echo   All tests PASSED!
) else (
    echo   Some tests FAILED - check the report for details.
)
echo ============================================================
echo.

:: Report opens automatically via playwright.config.ts open:'always'
:: but if it didn't (e.g. no browser default), open it manually
if not exist "playwright-report\index.html" goto :end
echo  Report saved at: %CD%\playwright-report\index.html
echo  If the report did not open automatically, run:
echo    npx playwright show-report

:end
echo.
pause
exit /b %TEST_EXIT%

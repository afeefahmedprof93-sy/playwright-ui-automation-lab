# Playwright UI Automation Lab

A professional end-to-end test automation framework built with **Playwright** and **TypeScript** for [automationexercise.com](https://automationexercise.com). Covers all 26 official test cases using the Page Object Model, parallel execution, automatic retries, and CI/CD via GitHub Actions.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Understanding the Reports](#understanding-the-reports)
- [CI/CD Pipeline](#cicd-pipeline)
- [Key Design Decisions](#key-design-decisions)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.43.0 | Browser automation & test runner |
| [TypeScript](https://www.typescriptlang.org) | ^5.4.5 | Type-safe test code |
| [Node.js](https://nodejs.org) | 18+ | Runtime environment |
| [dotenv](https://github.com/motdotla/dotenv) | ^16.6.1 | Environment variable management |
| [ESLint](https://eslint.org) | ^8.57.0 | Code linting |
| [Prettier](https://prettier.io) | ^3.2.5 | Code formatting |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |

---

## Project Structure

```
playwright-ui-automation-framework/
│
├── config/
│   └── env.ts                      # Loads .env and exports typed config (baseURL etc.)
│
├── src/
│   ├── pages/                      # Page Object Model classes
│   │   ├── BasePage.ts             # Abstract base: shared nav, ad handling, assertions
│   │   ├── HomePage.ts             # Home page: hero, subscription, scroll, recommended
│   │   ├── AuthPage.ts             # Login, signup, account info, register flow
│   │   ├── ProductsPage.ts         # All products, search, categories, brands, reviews
│   │   ├── CartPage.ts             # Cart table, add/remove, modal, subscription
│   │   ├── CheckoutPage.ts         # Checkout address, payment, invoice download
│   │   ├── ContactPage.ts          # Contact Us form, file upload, success assertion
│   │   └── index.ts                # Barrel export — import all pages from one place
│   │
│   ├── utils/
│   │   └── fixtures.ts             # Custom Playwright fixtures that inject page objects
│   │
│   └── data/
│       └── testData.ts             # User data, payment data, search terms, email factory
│
├── tests/
│   ├── auth/
│   │   └── auth.spec.ts            # TC1–TC5:  Register, Login, Logout, Duplicate email
│   ├── products/
│   │   └── products.spec.ts        # TC8–TC9, TC18–TC19, TC21: Products, Search, Brands
│   ├── cart/
│   │   └── cart.spec.ts            # TC10–TC13, TC17, TC20, TC22: Cart operations
│   ├── checkout/
│   │   └── checkout.spec.ts        # TC14–TC16, TC23–TC24: Orders, Address, Invoice
│   ├── contact/
│   │   └── contact.spec.ts         # TC6–TC7:  Contact form, Test Cases page
│   ├── navigation/
│   │   └── navigation.spec.ts      # TC25–TC26: Scroll up/down behaviour
│   └── fixtures/
│       └── sample-upload.txt       # File attachment used in TC6 (Contact Us)
│
├── playwright-report/              # Generated HTML reports (timestamped, gitignored)
├── test-results/                   # Screenshots, videos, traces on failure (gitignored)
│
├── .env                            # Local environment variables (never commit secrets)
├── .gitignore
├── package.json
├── playwright.config.ts            # Central Playwright configuration
├── playwright.yml                  # GitHub Actions CI workflow
├── run-tests.bat                   # One-click runner for Windows
├── run-tests.sh                    # One-click runner for macOS / Linux
└── tsconfig.json                   # TypeScript compiler configuration
```

---

## Architecture Overview

### Page Object Model (POM)

Every page of the application has a dedicated class. Tests never write raw CSS selectors — all locators live in the page class that owns them. This means that if the site changes a selector, you update it in exactly one place.

```
BasePage  (abstract)
├── shared navigation bar locators  (navHome, navCart, navLogout …)
├── dismissAdIfPresent()            (handles Google Ad overlays automatically)
├── safeClick()                     (dismisses ads before any click)
└── shared assertion helpers        (assertLoggedIn, assertUrl, assertVisible)
     │
     ├── HomePage        – hero, footer subscription, scroll-up arrow, recommended items
     ├── AuthPage        – login form, signup form, account details form, success states
     ├── ProductsPage    – product list, search, detail view, categories, brands, reviews
     ├── CartPage        – cart table, add/remove items, modal, subscribe in cart
     ├── CheckoutPage    – delivery address, payment form, order confirmation, invoice
     └── ContactPage     – contact form, file upload, dialog handling, success message
```

### Custom Fixtures

`src/utils/fixtures.ts` wraps Playwright's `test` object to automatically inject every page object into every test. This removes boilerplate — you never write `new AuthPage(page)` in a test file.

```typescript
// Every spec imports from fixtures instead of @playwright/test
import { test, expect } from '../../src/utils/fixtures';

// Page objects are automatically available as named parameters
test('my test', async ({ homePage, authPage, cartPage }) => {
  await homePage.open();
  // ...
});
```

### Test Data Factory

`src/data/testData.ts` centralises all test data. The `generateEmail()` function appends a `Date.now()` timestamp to every email address, ensuring that parallel tests registering accounts at the same time never collide with each other.

```typescript
// Every test gets a unique email — safe to run in parallel
const makeUser = () => ({ ...DEFAULT_USER, email: generateEmail() });
```

---

## Test Coverage

All 26 official test cases from automationexercise.com are implemented.

| # | Test Case | Spec File | Description |
|---|---|---|---|
| TC1 | Register User | auth/auth.spec.ts | Full registration flow, verify logged in, delete account |
| TC2 | Login with correct credentials | auth/auth.spec.ts | Register, logout, login, verify username in navbar |
| TC3 | Login with incorrect credentials | auth/auth.spec.ts | Enter wrong email/password, verify error message |
| TC4 | Logout User | auth/auth.spec.ts | Login, click logout, verify redirect to login page |
| TC5 | Register with existing email | auth/auth.spec.ts | Try to register duplicate email, verify error shown |
| TC6 | Contact Us Form | contact/contact.spec.ts | Fill form with file attachment, submit, verify success |
| TC7 | Verify Test Cases Page | contact/contact.spec.ts | Navigate to test cases page, verify it loads |
| TC8 | All Products & detail page | products/products.spec.ts | Visit products list, open detail, verify all fields present |
| TC9 | Search Product | products/products.spec.ts | Search by keyword, verify results are shown |
| TC10 | Subscription in Home page | cart/cart.spec.ts | Enter email in footer subscription on home page |
| TC11 | Subscription in Cart page | cart/cart.spec.ts | Enter email in footer subscription on cart page |
| TC12 | Add Products in Cart | cart/cart.spec.ts | Add two products, verify both appear in cart |
| TC13 | Verify Product quantity | cart/cart.spec.ts | Set quantity to 4, add to cart, verify quantity |
| TC14 | Place Order: Register while Checkout | checkout/checkout.spec.ts | Add to cart, register at checkout prompt, complete order |
| TC15 | Place Order: Register before Checkout | checkout/checkout.spec.ts | Register first, then add to cart and complete order |
| TC16 | Place Order: Login before Checkout | checkout/checkout.spec.ts | Login first, then add to cart and complete order |
| TC17 | Remove Products From Cart | cart/cart.spec.ts | Add product, click delete, verify cart is empty |
| TC18 | View Category Products | products/products.spec.ts | Filter by Women > Dress and Men > Tshirts categories |
| TC19 | View & Cart Brand Products | products/products.spec.ts | Filter by Polo brand, switch to H&M brand |
| TC20 | Search & Verify Cart After Login | cart/cart.spec.ts | Search products, add to cart, login, verify cart retained |
| TC21 | Add review on product | products/products.spec.ts | Open product detail, submit review, verify thank-you message |
| TC22 | Add to cart from Recommended | cart/cart.spec.ts | Scroll to recommended section, add item, verify in cart |
| TC23 | Verify address in checkout | checkout/checkout.spec.ts | Register, checkout, verify delivery address matches registration |
| TC24 | Download Invoice | checkout/checkout.spec.ts | Complete order, click Download Invoice, verify download starts |
| TC25 | Scroll Up via Arrow button | navigation/navigation.spec.ts | Scroll to footer, click arrow button, verify hero is visible |
| TC26 | Scroll Up without Arrow button | navigation/navigation.spec.ts | Scroll to footer, scroll up via JS, verify hero is visible |

---

## Prerequisites

Before running the framework, make sure you have the following installed:

**Node.js v18 or higher**

```bash
node -v   # should print v18.x.x or higher
```

Download from [nodejs.org](https://nodejs.org) if not installed.

> Git is also required to clone the repository. Download from [git-scm.com](https://git-scm.com).

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/playwright-ui-automation-framework.git
cd playwright-ui-automation-framework
```

### 2. Use the one-click runner (recommended)

The runner scripts handle everything automatically — dependency installation, browser installation, type-checking, and running the tests.

**Windows:**

Simply double-click `run-tests.bat`, or from a terminal:

```bat
run-tests.bat
```

**macOS / Linux:**

```bash
chmod +x run-tests.sh
./run-tests.sh
```

The script will:

1. Check that Node.js is installed
2. Run `npm install` (skips if already done, still checks for updates)
3. Install Playwright's Chromium browser if not already present
4. Type-check the TypeScript code
5. Run all tests
6. Open the HTML report automatically when tests finish

---

## Running Tests

If you prefer to run tests manually rather than using the runner script:

### Install dependencies (first time only)

```bash
npm install
npx playwright install --with-deps
```

### Run all tests

```bash
npm test
```

### Run a specific suite

```bash
npm run test:auth        # TC1–TC5  — Authentication
npm run test:products    # TC8–TC9, TC18–TC19, TC21 — Products
npm run test:cart        # TC10–TC13, TC17, TC20, TC22 — Cart
npm run test:checkout    # TC14–TC16, TC23–TC24 — Checkout & Orders
npm run test:contact     # TC6–TC7  — Contact & Test Cases page
npm run test:navigation  # TC25–TC26 — Scroll behaviour
```

### Run against a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
```

### Run in headed mode (watch the browser)

```bash
npm run test:headed
```

### Run with Playwright's interactive UI

```bash
npm run test:ui
```

### Debug a specific test step by step

```bash
npm run test:debug
```

### Re-open the last HTML report

```bash
npm run test:report
```

---

## Configuration

All configuration lives in `playwright.config.ts`. Key settings:

| Setting | Value | Notes |
|---|---|---|
| `testDir` | `./tests` | Where Playwright looks for spec files |
| `testMatch` | `**/*.spec.ts` | Only files ending in `.spec.ts` are picked up |
| `fullyParallel` | `true` | Tests inside a file also run in parallel |
| `workers` | `50%` locally / `4` in CI | Number of parallel browser workers |
| `retries` | `2` | Failed tests are automatically retried twice |
| `headless` | `false` | Browser window is visible by default |
| `slowMo` | `500ms` | 500 ms pause between actions for visibility |
| `actionTimeout` | `15 000 ms` | Max time to wait for a single action |
| `navigationTimeout` | `30 000 ms` | Max time to wait for page navigation |
| `reporter` | `list` + `html` | Console output + timestamped HTML report |
| `open` | `always` | HTML report opens in browser automatically |
| `screenshot` | `only-on-failure` | Screenshots saved only when a test fails |
| `video` | `retain-on-failure` | Video recorded and saved only on failure |
| `trace` | `retain-on-failure` | Playwright trace saved only on failure |

### Browsers configured

| Project | Device |
|---|---|
| `chromium` | Desktop Chrome |
| `firefox` | Desktop Firefox |
| `webkit` | Desktop Safari |
| `Mobile Chrome` | Pixel 5 (375 × 667) |

### Reports

Every test run generates a uniquely timestamped report folder inside `playwright-report/`, for example:

```
playwright-report/
└── report-2025-04-28_T14-30-00-000/
    └── index.html
```

This means previous reports are never overwritten, letting you compare runs over time.

---

## Environment Variables

The base URL is loaded from a `.env` file so it can be changed without touching source code.

**`.env`** (already included in the project):

```env
BASE_URL=https://automationexercise.com
```

**How it works:** `config/env.ts` reads the `.env` file using `dotenv` and exports a typed `secretConfig` object. `playwright.config.ts` then imports `secretConfig.baseURL` and sets it as the `baseURL` for every test.

To point the framework at a different environment (for example a staging server), simply change the value in `.env`:

```env
BASE_URL=https://staging.automationexercise.com
```

> Never commit real secrets or passwords to `.env`. Add `.env` to `.gitignore` if it ever contains sensitive values.

---

## Understanding the Reports

After a test run, the HTML report opens automatically in your default browser. Here is what each section means:

**Passed** — test completed successfully on the first attempt.

**Flaky** — test failed on the first attempt but passed on a retry. The test is still counted as passed overall, but the flakiness is flagged so you can investigate the root cause.

**Failed** — test failed on all 3 attempts (original + 2 retries). The report shows the full error message, the exact step that failed, a screenshot of the browser at the moment of failure, and a video of the entire test run.

**Skipped** — test was not executed (for example due to a `test.skip()` annotation).

### Viewing failure details

1. Click any failed test in the report.
2. Under **Errors**, read the assertion message — it tells you exactly what was expected vs. what the page actually showed.
3. Under **Attachments**, open the screenshot to see what the browser looked like at the point of failure.
4. Click **Trace** to open the Playwright Trace Viewer — an interactive timeline of every action, network request, and DOM snapshot from the test run.

---

## CI/CD Pipeline

The `playwright.yml` file at the root of the project configures GitHub Actions to run tests automatically.

### When it runs

- On every push to `main` or `develop`
- On every pull request targeting `main`
- On a nightly schedule at 02:00 UTC

### How it runs

Tests run in a **matrix** across three browsers simultaneously — Chromium, Firefox, and WebKit — each in its own job. This means a full cross-browser suite completes in the time it takes to run one browser, not three.

```
GitHub Actions
├── Job: chromium tests   ──┐
├── Job: firefox tests    ──┼── run in parallel
└── Job: webkit tests     ──┘
```

### Artifacts

After every run:

- The full HTML report for each browser is uploaded as a downloadable artifact and kept for 14 days.
- On failure, the `test-results/` folder (screenshots, videos, traces) is uploaded and kept for 7 days.

To download a report: go to the Actions tab in GitHub → click the run → scroll to Artifacts.

---

## Key Design Decisions

**Why Page Object Model?**
All locators live in one class per page. When the site changes a selector, you update it in one place and every test using that page benefits instantly. Tests read like plain English because they call named methods (`authPage.login(...)`) rather than raw selectors.

**Why custom fixtures?**
`src/utils/fixtures.ts` extends Playwright's `test` so every spec gets all page objects injected automatically. This eliminates the repetitive `const authPage = new AuthPage(page)` boilerplate and keeps test files clean and readable.

**Why `generateEmail()` with timestamps?**
Since tests run in parallel, multiple tests may try to register accounts at the same time. By appending `Date.now()` to every email address, each registration is guaranteed to use a unique address and tests never interfere with each other.

**Why `dismissAdIfPresent()` on every page load?**
`automationexercise.com` injects Google Ad iframes that float over buttons and intercept clicks — the most common cause of flaky failures. `BasePage.goto()` calls this method automatically after every navigation so tests never need to think about ads. Three dismissal strategies are tried in sequence: removing the overlay div from the DOM, clicking the close button inside the ad iframe, and clicking any top-level close button.

**Why `waitUntil: 'domcontentloaded'` instead of `networkidle`?**
The site continuously fires ad and analytics requests, so `networkidle` never triggers and tests would hang indefinitely. `domcontentloaded` fires as soon as the main HTML is parsed, which is the right signal for this site.

**Why `retries: 2`?**
Ad overlays and network timing on a live public website introduce occasional flakiness that has nothing to do with the actual application behaviour. Two automatic retries filter out this noise without hiding genuine bugs — a test that fails all three times is a real failure.

**Why timestamped report folders?**
Each run writes to a new folder (`report-2025-04-28_T14-30-00/`) so historical reports are preserved. You can compare a passing run from yesterday against a failing one from today without any manual archiving.

---

## Troubleshooting

**`Cannot find name 'process'`**

Make sure `tsconfig.json` has `"types": ["node"]` in `compilerOptions`. This gives TypeScript knowledge of Node.js globals like `process.env`.

**`Cannot find name 'window'`**

Make sure `tsconfig.json` has `"DOM"` in the `lib` array. This is required because `page.evaluate()` callbacks run in the browser context.

**Browser window is not visible**

Check that `headless: false` is set in `playwright.config.ts`. You can also pass `--headed` on the command line:

```bash
npx playwright test --headed
```

**Tests failing because of ads / popups**

`dismissAdIfPresent()` runs automatically on every page navigation. If a particular test is still being blocked, use `safeClick()` from `BasePage` instead of `.click()` — it dismisses any ad overlay before clicking the target element.

**`npm install` fails**

Check your internet connection. If you are behind a corporate proxy, configure npm to use it:

```bash
npm config set proxy http://proxy.company.com:8080
```

**Playwright browsers not installed**

Run this manually to install all browsers and their system dependencies:

```bash
npx playwright install --with-deps
```

To install only Chromium:

```bash
npx playwright install chromium --with-deps
```

**Report does not open automatically**

Open it manually:

```bash
npm run test:report
```

Or open the `index.html` file inside the latest timestamped folder in `playwright-report/` directly in your browser.

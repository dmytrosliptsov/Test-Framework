# Test-Framework

A production-ready end-to-end and API test automation framework built with **Playwright** and **TypeScript**, targeting [playwright.dev](https://playwright.dev). Built from scratch as a demonstration of SDET best practices: Page Object Model, composable fixtures, typed data factories, and CI/CD integration.

## Overview

This framework tests the official Playwright documentation site across two layers:

- **E2E (browser) tests** — navigation, search, docs pages, and the API reference page, driven through the UI.
- **API tests** — HTTP-level checks against the site using Playwright's `APIRequestContext`.

Tests are organized around reusable Page Objects, dependency-injected via Playwright fixtures, with all test data sourced from typed factories rather than hardcoded strings.

## Tech Stack

- [Playwright](https://playwright.dev) `^1.60.0` — test runner and browser automation
- **TypeScript** `^6.0.3` — strict mode
- **dotenv** `^17.4.2` — environment configuration via `.env`
- **ESLint** + **typescript-eslint** + **eslint-plugin-playwright**, **Prettier**, **Husky** + **lint-staged** — linting, formatting, pre-commit checks
- **Node.js** / npm

## Architecture

### Page Object Model

- `BasePage` (`src/pages/BasePage.ts`) — abstract base class every page extends. Provides:
  - `page: Page` — the underlying Playwright page (used sparingly in tests)
  - `logoLink` — the navbar logo link, shared across all pages
  - Protected locator helpers: `locator()`, `getByRole()`, `getByText()`, `getByPlaceholder()`, `getByTestId()`
  - `navigate(path)` — base navigation method
- Concrete page objects extend `BasePage`:
  - `HomePage` — homepage, navbar links, search entry point
  - `DocsPage` — `/docs/intro`, sidebar, table of contents, breadcrumb, pagination
  - `ApiReferencePage` — `/docs/api/class-playwright`
- Locators are `readonly` class fields, always synchronous (`Locator`, never `Promise<Locator>`).
- Page Object methods describe **user actions** (e.g. `clickDocs()`), not implementation details.
- A `@step` decorator (`src/utils/step.decorator.ts`) wraps Page Object methods in `test.step()` automatically, so every method call shows up as a named step in the HTML report without repeating `test.step()` calls in the page objects themselves.

### Fixtures

Located in `src/fixtures/`:

- `pages.fixture.ts` — provides Page Object fixtures (`homePage`, `docsPage`, `apiPage`), each instantiated and navigated (`open()`) before the test runs.
- `api.fixture.ts` — provides an `apiContext` fixture (`APIRequestContext`) scoped to `BASE_URL`, disposed after the test.
- `index.ts` — combines both fixture sets via Playwright's `mergeTests` and re-exports `expect`. Tests import exclusively from `src/fixtures` (or `../../src/fixtures`), never directly from `@playwright/test`.

### Data Factories

Located in `src/data/`:

- `home.data.ts` — `createHomePageExpectations()`
- `docs.data.ts` — `createDocsPageExpectations()`, `createSearchData()`, `createNavigationExpectations()`

Factories return typed objects (strings and `RegExp`) with an accompanying `export type` declared alongside each factory. Tests never contain hardcoded expected values — all data flows through these factories.

### Path Aliases

Configured in `tsconfig.json`:

| Alias         | Resolves to      |
| ------------- | ---------------- |
| `@pages/*`    | `src/pages/*`    |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*`    | `src/utils/*`    |
| `@data/*`     | `src/data/*`     |

## Project Structure

```
src/
  pages/              Page Objects
    BasePage.ts
    HomePage.ts
    DocsPage.ts
    ApiReferencePage.ts
  fixtures/            Playwright fixtures
    pages.fixture.ts
    api.fixture.ts
    index.ts
  utils/                Shared utilities
    step.decorator.ts
  data/                 Typed test data factories
    home.data.ts
    docs.data.ts
tests/
  e2e/                  Browser-driven tests
    smoke.spec.ts
    docs.spec.ts
    search.spec.ts
    navigation.spec.ts
    api-reference.spec.ts
  api/                  HTTP-level tests
    playwright-site.spec.ts
.github/workflows/
  playwright.yml        CI pipeline
playwright.config.ts
tsconfig.json
```

## Test Suite

24 tests across 6 spec files:

| File                                | Tests | Tag           |
| ----------------------------------- | ----- | ------------- |
| `tests/e2e/smoke.spec.ts`           | 3     | `@smoke`      |
| `tests/e2e/docs.spec.ts`            | 4     | `@regression` |
| `tests/e2e/search.spec.ts`          | 3     | `@regression` |
| `tests/e2e/navigation.spec.ts`      | 9     | `@regression` |
| `tests/e2e/api-reference.spec.ts`   | 3     | `@regression` |
| `tests/api/playwright-site.spec.ts` | 2     | `@api`        |

## Prerequisites

- Node.js (LTS recommended)
- npm

## Installation

```bash
git clone https://github.com/dmytrosliptsov/Test-Framework.git
cd Test-Framework
npm install
npx playwright install --with-deps chromium firefox webkit
```

Create a `.env` file in the project root (or copy the existing one) to configure the target base URL:

```
BASE_URL=https://playwright.dev
```

## Running Tests

```bash
npm test                                 # run all tests
npm run test:smoke                       # only @smoke tests
npx playwright test --grep @regression   # only @regression tests
npx playwright test --grep @api          # only @api tests
npm run test:headed                      # run with a visible browser
npm run test:debug                       # step through with Playwright's debugger
npx playwright test --ui                 # interactive UI mode
npx playwright test --project=firefox    # run only on Firefox
npx playwright test --project=webkit     # run only on WebKit
```

Tests run against three browser projects configured in `playwright.config.ts`: `chromium` (Desktop Chrome), `firefox` (Desktop Firefox), and `webkit` (Desktop Safari). Use `--project=<name>` to target a single browser, or omit it to run against all three.

## Viewing the HTML Report

```bash
npm run report
```

By default, the HTML report opens automatically on failure locally (`open: 'on-failure'`); on CI it is never opened automatically (`open: 'never'`) and is instead uploaded as a build artifact. Every Page Object method call appears as a step in the report via the `@step` decorator.

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`:

1. Checks out the repo and sets up Node.js 22 (with npm caching).
2. Installs dependencies with `npm ci`.
3. Installs the Chromium, Firefox, and WebKit browsers via `npx playwright install --with-deps chromium firefox webkit`.
4. Runs the full test suite (`npm test`) across all three browser projects, with `CI=true` and `BASE_URL` from repository variables (falls back to `https://playwright.dev`).
5. Uploads the `playwright-report/` artifact (retained 30 days) and `test-results/` artifact (retained 7 days, if present) regardless of test outcome.

Retries are enabled only on CI (2 retries), and workers are capped at 2 on CI for stability.

## Code Quality

Code style and correctness are enforced with ESLint and Prettier, and checked automatically before every commit.

- **ESLint** (`eslint.config.mjs`) — flat config using `typescript-eslint` recommended rules plus `eslint-plugin-playwright`'s recommended rules scoped to `tests/**`, with `eslint-config-prettier` disabling any formatting rules that would conflict with Prettier.
- **Prettier** (`.prettierrc.json`) — single quotes, semicolons, 120-character print width, trailing commas.
- **Husky + lint-staged** — a `pre-commit` hook (`.husky/pre-commit`) runs `lint-staged`, which applies `eslint --fix` and `prettier --write` only to staged files.

```bash
npm run lint       # check for lint errors
npm run lint:fix   # check and auto-fix lint errors
npm run format     # format the whole project with Prettier
```

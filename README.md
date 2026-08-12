# Test-Framework

[![CI](https://github.com/dmytrosliptsov/Test-Framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/dmytrosliptsov/Test-Framework/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/github/package-json/dependency-version/dmytrosliptsov/Test-Framework/main/dev/@playwright/test?label=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/github/package-json/dependency-version/dmytrosliptsov/Test-Framework/main/dev/typescript?label=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/github/license/dmytrosliptsov/Test-Framework)](LICENSE)

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
- **allure-playwright** `^3.10.2` + **allure-commandline** `^2.43.0` — Allure reporting
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
    visual.spec.ts
    visual.spec.ts-snapshots/   Committed baseline screenshots
  api/                  HTTP-level tests
    playwright-site.spec.ts
.github/workflows/
  playwright.yml        CI pipeline
Dockerfile               Container image for running tests
docker-compose.yml       Runs the suite in a container, mounts reports back to host
playwright.config.ts
tsconfig.json
```

## Test Suite

25 tests across 7 spec files:

| File                                | Tests | Tag           |
| ----------------------------------- | ----- | ------------- |
| `tests/e2e/smoke.spec.ts`           | 3     | `@smoke`      |
| `tests/e2e/docs.spec.ts`            | 4     | `@regression` |
| `tests/e2e/search.spec.ts`          | 3     | `@regression` |
| `tests/e2e/navigation.spec.ts`      | 9     | `@regression` |
| `tests/e2e/api-reference.spec.ts`   | 3     | `@regression` |
| `tests/e2e/visual.spec.ts`          | 1     | `@visual`     |
| `tests/api/playwright-site.spec.ts` | 2     | `@api`        |

## Prerequisites

- Node.js (LTS recommended)
- npm
- Docker + Docker Compose (optional — only needed to run the suite in a container)

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
npx playwright test --grep @visual       # only @visual tests
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

## Visual Regression Testing

`tests/e2e/visual.spec.ts` (tagged `@visual`) uses Playwright's built-in `toHaveScreenshot()` assertion to catch unintended visual changes on the homepage hero section (`HomePage.heroHeading`).

**How baselines work:**

- The first run of a `toHaveScreenshot()` assertion has nothing to compare against, so it writes a baseline PNG instead of asserting and reports "A snapshot doesn't exist ... writing actual."
- Baselines are stored next to the spec file in `tests/e2e/visual.spec.ts-snapshots/`, one file per browser/OS combination (e.g. `home-hero-chromium-linux.png`), and must be **committed to the repository**.
- On every subsequent run, the actual screenshot is pixel-compared against the matching baseline; a mismatch fails the test and attaches the expected/actual/diff images to the HTML report.
- Because baselines are OS- and font-rendering-specific, screenshots generated on Windows/macOS **will not match** the Linux baselines used by CI (GitHub Actions runs on `ubuntu-latest`). Generate or update baselines using the project's [Docker image](#running-in-docker) so they match the CI environment:

```bash
docker compose run --rm --build playwright npx playwright test tests/e2e/visual.spec.ts --update-snapshots
```

**Updating baselines** after an intentional UI change:

```bash
npm run test:update-snapshots              # update all baselines against your local OS
npx playwright test --grep @visual --update-snapshots   # update only @visual baselines
```

For baselines that must match CI, run the equivalent command through Docker (as shown above) instead of natively, then commit the resulting PNGs in `tests/e2e/visual.spec.ts-snapshots/`.

## Allure Report

Alongside the built-in HTML reporter, `allure-playwright` writes raw result files to `allure-results/` on every run. Generating and viewing the human-readable Allure report requires the [Allure commandline](https://allurereport.org/docs/gettingstarted/) (installed as `allure-commandline`), which in turn requires a **Java runtime (JRE 8+)** on your machine.

```bash
npm run allure:generate   # build the HTML report from allure-results/ into allure-report/
npm run allure:open       # serve and open the generated Allure report
npm run allure:report     # generate and open in one step
```

## Running in Docker

The suite can run inside a container based on the [official Playwright Docker image](https://playwright.dev/docs/docker), pinned to this project's installed Playwright version (`v1.60.0-noble`) so the container's bundled browsers match `@playwright/test`.

```bash
npm run test:docker
```

This runs `docker compose run --rm playwright`, which builds the image (installing dependencies via `npm ci`) and runs `npx playwright test` inside the container. `docker-compose.yml` mounts `playwright-report/`, `test-results/`, and `allure-results/` back to the host, so reports generated inside the container are viewable locally with the same commands as a native run (`npm run report`, `npm run allure:report`).

`BASE_URL` can be overridden the same way as locally, e.g. `BASE_URL=https://playwright.dev npm run test:docker`. To run a subset of tests, pass extra arguments through Compose, e.g. `docker compose run --rm playwright npx playwright test --grep @smoke`.

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`:

1. Checks out the repo and sets up Node.js 22 (with npm caching).
2. Installs dependencies with `npm ci`.
3. Installs the Chromium, Firefox, and WebKit browsers via `npx playwright install --with-deps chromium firefox webkit`.
4. Runs the full test suite (`npm test`) across all three browser projects, with `CI=true` and `BASE_URL` from repository variables (falls back to `https://playwright.dev`).
5. Uploads the `playwright-report/` artifact (retained 30 days), `test-results/` artifact (retained 7 days, if present), and `allure-results/` artifact (retained 7 days, if present) regardless of test outcome.

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

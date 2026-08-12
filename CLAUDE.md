# Playwright Test Framework — CLAUDE.md

## Project Goal

A learning project for practicing SDET (test automation engineering) skills. The goal is to build a **production-ready Playwright test framework** from scratch, step by step, applying industry best practices. Not just writing tests, but building out the supporting test infrastructure.

**Target site:** `https://playwright.dev` (the official Playwright documentation).

---

## Tech Stack

- **Playwright 1.60+** — test runner + browser automation
- **TypeScript** — strict mode
- **dotenv** — environment configuration via `.env`
- **Node.js / npm**
- No unnecessary dependencies — only add a library when there's a clear need

---

## Architecture

### Page Object Model

- `BasePage` — abstract base class. Contains:
  - `readonly page: Page` — public (use minimally in tests)
  - `readonly logoLink` — global navbar element, shared across all pages
  - Protected helpers: `locator`, `getByRole`, `getByText`, `getByPlaceholder`, `getByTestId`
  - `navigate(path)` — base navigation
- Concrete pages extend `BasePage`:
  - `HomePage` — homepage, navbar links, search
  - `DocsPage` — /docs/intro, sidebar, TOC, breadcrumb, pagination
  - `ApiReferencePage` — /docs/api/class-playwright
- Locators — `readonly` class fields, **always synchronous** (Locator, not Promise<Locator>)
- Methods describe **user actions**, not technical details (`clickDocs()`, not `clickElement()`)

### Fixtures

- `src/fixtures/pages.fixture.ts` — Page Object fixtures (`homePage`, `docsPage`, `apiPage`)
- `src/fixtures/api.fixture.ts` — `APIRequestContext` fixture (`apiContext`)
- `src/fixtures/index.ts` — `mergeTests(pagesTest, apiTest)` + re-export `expect`
- A fixture is responsible for creating the object and calling `open()` before the test
- Tests import **only** from `src/fixtures` (or `../../src/fixtures`)

### Data factories

- `src/data/home.data.ts` — `createHomePageExpectations()`
- `src/data/docs.data.ts` — `createDocsPageExpectations()`, `createSearchData()`, `createNavigationExpectations()`
- Factories return typed objects with RegExp and strings
- Types are declared separately (`export type`) alongside the factory

### Folder Structure

```
src/
  pages/              — Page Objects (BasePage, HomePage, DocsPage, ApiReferencePage)
  fixtures/           — Playwright fixtures (pages, api, index)
  utils/              — shared utilities (currently empty)
  data/               — test data and factories
tests/
  e2e/                — end-to-end tests
  api/                — HTTP API tests
.github/workflows/    — GitHub Actions CI/CD
```

### Path aliases (tsconfig.json)

```
@pages/*    → src/pages/*
@fixtures/* → src/fixtures/*
@utils/*    → src/utils/*
@data/*     → src/data/*
```

---

## Conventions

### Naming
- `PascalCase` for Page Objects (`HomePage.ts`)
- `camelCase.fixture.ts` for fixtures
- `kebab-case.spec.ts` for tests

### Test tags
- `@smoke` — critical checks, run first
- `@regression` — full functional coverage
- `@api` — HTTP level (no browser)

### Locators
- Priority: `getByRole` > `getByText` > `getByPlaceholder` > CSS class (`.class-name`)
- Locators always live in the Page Object, **never** in the test
- `exact: true` when a locator's text could partially match other elements on the page
- Methods returning `Locator` are **synchronous** (not async)

### Tests
- `test.step()` for every logical step — improves the HTML report
- Steps are **flat** (not nested), each step is one action or one assertion
- Data — only via factories, no hardcoded strings in tests
- Direct access to `page` in a test — only when there's no alternative

### Comments
- Only when the WHY isn't obvious. Don't comment on what the code does.

---

## Open Architectural Questions

1. `page` in `BasePage` is `readonly` (public). Left as-is for now, but tests should touch it minimally
2. A fixture always calls `open()` — if a need arises to not auto-open the page, discuss separately

---

## Current Test State

**24 tests, all green**

| File | Tests | Tags |
|---|---|---|
| `tests/e2e/smoke.spec.ts` | 3 | @smoke |
| `tests/e2e/docs.spec.ts` | 4 | @regression |
| `tests/e2e/search.spec.ts` | 3 | @regression |
| `tests/e2e/navigation.spec.ts` | 9 | @regression |
| `tests/e2e/api-reference.spec.ts` | 3 | @regression |
| `tests/api/playwright-site.spec.ts` | 2 | @api |

---

## Roadmap and Definition of Done

### Phase 1 — Initialization ✅
- [x] npm init + TypeScript + tsconfig with path aliases
- [x] Playwright installed, Chromium downloaded
- [x] `playwright.config.ts` with baseURL, retries, trace, screenshot

### Phase 2 — Page Objects ✅
- [x] `BasePage` abstract class
- [x] `HomePage extends BasePage`

### Phase 3 — Fixtures and first tests ✅
- [x] `pages.fixture.ts` + barrel `index.ts`
- [x] `smoke.spec.ts` — 3 tests, all green

### Phase 4 — Test Data Management ✅
- [x] `.env` + `dotenv`, `playwright.config.ts` loads `.env`
- [x] `src/data/` — factories for all test data
- [x] Tests with no hardcoded data

### Phase 5 — API Testing ✅
- [x] `api.fixture.ts` with `APIRequestContext`
- [x] `mergeTests` for composable fixtures
- [x] 2 API tests in `tests/api/`

### Phase 6 — Reporting ✅
- [x] HTML reporter: `open: 'on-failure'` locally, `'never'` on CI
- [x] `test.step()` in every test — detailed step tree in the report

### Phase 7 — CI/CD ✅
- [x] GitHub Actions workflow on push/PR to main
- [x] Node.js 22, `npm ci`, `playwright install --with-deps chromium`
- [x] Artifacts: `playwright-report` (30 days), `test-results` (7 days)

### Phase 8 — Coverage expansion ✅
- [x] `DocsPage` — sidebar, TOC, breadcrumb, pagination
- [x] `ApiReferencePage`
- [x] Navigation flows, browser history, sidebar/TOC interaction
- [x] Search modal — open, type, Escape

---

## Commands

```bash
npm test                           # all tests
npm run test:smoke                 # only @smoke
npm run test:headed                # with a visible browser
npm run test:debug                 # step-through debugger
npx playwright test --ui           # interactive UI mode
npx playwright test --grep @regression  # only regression
npm run report                     # open the HTML report
```

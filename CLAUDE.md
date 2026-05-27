# Playwright Test Framework — CLAUDE.md

## Мета проекту

Навчальний проект SDET Дими. Мета — побудувати **production-ready Playwright test framework** з нуля, крок за кроком, застосовуючи best practices. Не просто написати тести, а збудувати інфраструктуру для тестування.

**Цільовий сайт:** `https://playwright.dev` (офіційна документація Playwright).

---

## Технічний стек

- **Playwright 1.60+** — test runner + browser automation
- **TypeScript** — strict mode
- **dotenv** — конфігурація середовища через `.env`
- **Node.js / npm**
- Без зайвих залежностей — додавати бібліотеки тільки коли є чітка потреба

---

## Архітектура

### Page Object Model

- `BasePage` — абстрактний клас. Містить:
  - `readonly page: Page` — публічне (мінімально використовувати в тестах)
  - `readonly logoLink` — глобальний navbar елемент, спільний для всіх сторінок
  - Захищені хелпери: `locator`, `getByRole`, `getByText`, `getByPlaceholder`, `getByTestId`
  - `navigate(path)` — базова навігація
- Конкретні сторінки extends `BasePage`:
  - `HomePage` — головна сторінка, navbar links, search
  - `DocsPage` — /docs/intro, sidebar, TOC, breadcrumb, pagination
  - `ApiReferencePage` — /docs/api/class-playwright
- Локатори — `readonly` поля класу, **завжди синхронні** (Locator, не Promise<Locator>)
- Методи описують **дії користувача**, не технічні деталі (`clickDocs()`, не `clickElement()`)

### Fixtures

- `src/fixtures/pages.fixture.ts` — Page Object fixtures (`homePage`, `docsPage`, `apiPage`)
- `src/fixtures/api.fixture.ts` — `APIRequestContext` fixture (`apiContext`)
- `src/fixtures/index.ts` — `mergeTests(pagesTest, apiTest)` + re-export `expect`
- Fixture відповідає за створення об'єкта та виклик `open()` перед тестом
- Тести імпортують **тільки** з `src/fixtures` (або `../../src/fixtures`)

### Data factories

- `src/data/home.data.ts` — `createHomePageExpectations()`
- `src/data/docs.data.ts` — `createDocsPageExpectations()`, `createSearchData()`, `createNavigationExpectations()`
- Фабрики повертають типізовані об'єкти з RegExp та рядками
- Типи оголошуються окремо (`export type`) поряд із фабрикою

### Структура папок

```
src/
  pages/              — Page Objects (BasePage, HomePage, DocsPage, ApiReferencePage)
  fixtures/           — Playwright fixtures (pages, api, index)
  utils/              — допоміжні утиліти (поки порожньо)
  data/               — тестові дані та фабрики
tests/
  e2e/                — end-to-end тести
  api/                — HTTP API тести
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

## Конвенції

### Іменування
- `PascalCase` для Page Objects (`HomePage.ts`)
- `camelCase.fixture.ts` для fixtures
- `kebab-case.spec.ts` для тестів

### Теги тестів
- `@smoke` — критичні перевірки, запускаються першими
- `@regression` — повна перевірка функціональності
- `@api` — HTTP рівень (без браузера)

### Локатори
- Пріоритет: `getByRole` > `getByText` > `getByPlaceholder` > CSS клас (`.class-name`)
- Локатори завжди в Page Object, **ніколи** в тесті
- `exact: true` коли текст локатора може частково збігатись з іншими елементами на сторінці
- Методи що повертають `Locator` — **синхронні** (не async)

### Тести
- `test.step()` для кожного логічного кроку — покращує HTML звіт
- Кроки **пласкі** (не вкладені), кожен крок — одна дія або одна assertion
- Дані — тільки через фабрики, без hardcoded рядків у тестах
- Прямий доступ до `page` в тесті — тільки коли немає альтернативи

### Коментарі
- Тільки коли WHY неочевидний. Не коментувати що робить код.

### Мова
- Спілкування з Димою — **українська**

---

## Відкриті архітектурні питання

1. `page` в `BasePage` — `readonly` (публічне). Поки залишаємо так, але у тестах звертатись мінімально
2. Fixture завжди викликає `open()` — якщо з'явиться потреба не відкривати сторінку автоматично, обговорити окремо

---

## Поточний стан тестів

**24 тести, всі зелені**

| Файл | Тестів | Теги |
|---|---|---|
| `tests/e2e/smoke.spec.ts` | 3 | @smoke |
| `tests/e2e/docs.spec.ts` | 4 | @regression |
| `tests/e2e/search.spec.ts` | 3 | @regression |
| `tests/e2e/navigation.spec.ts` | 9 | @regression |
| `tests/e2e/api-reference.spec.ts` | 3 | @regression |
| `tests/api/playwright-site.spec.ts` | 2 | @api |

---

## Roadmap та Definition of Done

### Фаза 1 — Ініціалізація ✅
- [x] npm init + TypeScript + tsconfig з path aliases
- [x] Playwright встановлено, Chromium завантажено
- [x] `playwright.config.ts` з baseURL, retries, trace, screenshot

### Фаза 2 — Page Objects ✅
- [x] `BasePage` абстрактний клас
- [x] `HomePage extends BasePage`

### Фаза 3 — Fixtures та перші тести ✅
- [x] `pages.fixture.ts` + barrel `index.ts`
- [x] `smoke.spec.ts` — 3 тести, всі зелені

### Фаза 4 — Test Data Management ✅
- [x] `.env` + `dotenv`, `playwright.config.ts` завантажує `.env`
- [x] `src/data/` — фабрики для всіх тестових даних
- [x] Тести без hardcoded даних

### Фаза 5 — API Testing ✅
- [x] `api.fixture.ts` з `APIRequestContext`
- [x] `mergeTests` для composable fixtures
- [x] 2 API тести в `tests/api/`

### Фаза 6 — Reporting ✅
- [x] HTML reporter: `open: 'on-failure'` локально, `'never'` на CI
- [x] `test.step()` у всіх тестах — детальне дерево кроків у звіті

### Фаза 7 — CI/CD ✅
- [x] GitHub Actions workflow на push/PR до main
- [x] Node.js 22, `npm ci`, `playwright install --with-deps chromium`
- [x] Артефакти: `playwright-report` (30 днів), `test-results` (7 днів)

### Фаза 8 — Розширення покриття ✅
- [x] `DocsPage` — sidebar, TOC, breadcrumb, pagination
- [x] `ApiReferencePage`
- [x] Navigation flows, browser history, sidebar/TOC interaction
- [x] Search modal — open, type, Escape

---

## Команди

```bash
npm test                           # всі тести
npm run test:smoke                 # тільки @smoke
npm run test:headed                # з видимим браузером
npm run test:debug                 # покроковий дебагер
npx playwright test --ui           # інтерактивний UI режим
npx playwright test --grep @regression  # тільки regression
npm run report                     # відкрити HTML звіт
```

# Playwright Test Framework — CLAUDE.md

## Мета проекту

Навчальний проект SDET Дими. Мета — побудувати **production-ready Playwright test framework** з нуля, крок за кроком, застосовуючи best practices. Не просто написати тести, а збудувати інфраструктуру для тестування.

**Цільовий сайт:** `https://playwright.dev` (офіційна документація Playwright).

---

## Технічний стек

- **Playwright** — test runner + browser automation
- **TypeScript** — strict mode
- **Node.js / npm**
- Без зайвих залежностей — додавати бібліотеки тільки коли є чітка потреба

---

## Архітектура

### Page Object Model
- `BasePage` — абстрактний клас. Містить `readonly page: Page` та захищені хелпери (`locator`, `getByRole`, тощо)
- Конкретні сторінки (`HomePage`, тощо) extends `BasePage`
- Локатори оголошуються як `readonly` поля класу
- Методи сторінки описують **дії користувача**, не технічні деталі

### Fixtures
- Кожна Page Object реєструється як Playwright fixture у `src/fixtures/pages.fixture.ts`
- Fixture відповідає за створення об'єкта та виклик `open()` перед тестом
- `src/fixtures/index.ts` — barrel file, тести імпортують тільки звідси

### Структура папок
```
src/
  pages/       — Page Objects
  fixtures/    — Playwright fixtures
  utils/       — допоміжні утиліти
  data/        — тестові дані та фабрики
tests/
  e2e/         — end-to-end тести
  api/         — API тести
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

- **Теги тестів:** `@smoke`, `@regression`, `@api` — додавати до назви тесту
- **Іменування файлів:** `PascalCase` для Page Objects, `camelCase.fixture.ts`, `kebab-case.spec.ts`
- **Коментарі:** тільки коли WHY неочевидний. Не коментувати що робить код
- **Мова спілкування з Dimою:** українська

---

## Відкриті архітектурні питання

1. `page` в `BasePage` — `readonly` (публічне). Поки залишаємо так, але у тестах звертатись до нього мінімально
2. Fixture завжди викликає `open()` — якщо з'явиться потреба не відкривати сторінку автоматично, обговорити окремо

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

### Фаза 4 — Test Data Management ⬜
**DoD:**
- [ ] `.env` файл + `dotenv` для конфігурації середовища
- [ ] `src/data/` — мінімум одна data factory функція
- [ ] Тести не містять hardcoded даних — все через фабрики або env

### Фаза 5 — API Testing ⬜
**DoD:**
- [ ] API fixture з `APIRequestContext`
- [ ] Мінімум 2 API тести (GET + POST або перевірка статусу)
- [ ] API тести в `tests/api/`

### Фаза 6 — Reporting ⬜
**DoD:**
- [ ] HTML reporter налаштований (або Allure — вирішити разом)
- [ ] Звіт генерується після запуску тестів локально

### Фаза 7 — CI/CD ⬜
**DoD:**
- [ ] GitHub Actions workflow — запуск тестів на push/PR
- [ ] Артефакти (звіти, screenshots) зберігаються як artifacts

---

## Команди

```bash
npx playwright test              # запустити всі тести
npx playwright test --grep @smoke  # тільки smoke
npx playwright show-report       # відкрити HTML звіт
```

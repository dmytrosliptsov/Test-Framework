---
allowed-tools: Read, Write, Bash
---

Створи новий spec файл для цього Playwright проекту.

Аргументи: `$ARGUMENTS`
Формат аргументів: `spec-name fixtureName`
Приклад: `writing-tests docsPage`
Приклад без fixture: `smoke`

## Кроки

1. **Прочитай** `tests/e2e/docs.spec.ts` як еталон структури.

2. **Визнач** тип тесту:
   - E2E (з fixture) → `tests/e2e/{spec-name}.spec.ts`
   - API → `tests/api/{spec-name}.spec.ts`

3. **Створи** файл з такою структурою:
   ```ts
   import { test, expect } from '../../src/fixtures';
   // імпортуй data factory якщо є відповідна

   test.describe('{Назва з аргументу}', () => {
     test('{опис} @regression', async ({ {fixture} }) => {
       await test.step('{крок}', async () => {
         // assertion
       });
     });
   });
   ```

4. **Додай** мінімум 2-3 тести що покривають:
   - Базову перевірку (URL або heading)
   - Ключову функціональність сторінки
   - Один edge case або навігаційний flow

5. **Запусти** `npx playwright test tests/e2e/{spec-name}.spec.ts` щоб перевірити що тести зелені.

6. **Виведи** підсумок: скільки тестів створено, які теги, результат запуску.

Теги: `@smoke` для критичних, `@regression` для решти, `@api` для HTTP тестів.
Кроки `test.step()` — завжди пласкі, не вкладені.

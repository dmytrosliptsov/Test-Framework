---
allowed-tools: Read, Write, Edit, Bash
---

Створи новий Playwright Page Object для цього проекту.

Аргументи: `$ARGUMENTS`
Формат аргументів: `ClassName /url/path`
Приклад: `SearchPage /docs/search`

## Кроки

1. **Прочитай** `src/pages/BasePage.ts` і `src/pages/DocsPage.ts` для розуміння поточних конвенцій.

2. **Створи** `src/pages/{ClassName}.ts`:
   - `extends BasePage`
   - `readonly` локатори через `getByRole` де можливо
   - Метод `open()` з URL з аргументів
   - Методи для ключових дій користувача на цій сторінці
   - Без зайвих коментарів

3. **Оновити** `src/fixtures/pages.fixture.ts`:
   - Додай тип до `type Pages`
   - Додай fixture що створює об'єкт і викликає `open()`

4. **Запитай** у користувача чи потрібен data файл для цієї сторінки.

5. **Виведи** підсумок: які файли створено/змінено, які локатори додано, що варто протестити.

Дотримуйся конвенцій з CLAUDE.md: `PascalCase` для класу, синхронні локатори (не async), методи описують дії користувача.

---
allowed-tools: Read, Write, Edit, Bash
---

Create a new Playwright Page Object for this project.

Arguments: `$ARGUMENTS`
Argument format: `ClassName /url/path`
Example: `SearchPage /docs/search`

## Steps

1. **Read** `src/pages/BasePage.ts` and `src/pages/DocsPage.ts` to understand the current conventions.

2. **Create** `src/pages/{ClassName}.ts`:
   - `extends BasePage`
   - `readonly` locators via `getByRole` where possible
   - An `open()` method with the URL from the arguments
   - Methods for the key user actions on this page
   - No unnecessary comments

3. **Update** `src/fixtures/pages.fixture.ts`:
   - Add the type to `type Pages`
   - Add a fixture that creates the object and calls `open()`

4. **Ask** the user whether a data file is needed for this page.

5. **Output** a summary: which files were created/changed, which locators were added, and what's worth testing.

Follow the conventions from CLAUDE.md: `PascalCase` for the class, synchronous locators (not async), methods describe user actions.

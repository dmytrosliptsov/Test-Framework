---
allowed-tools: Read, Write, Bash
---

Create a new spec file for this Playwright project.

Arguments: `$ARGUMENTS`
Argument format: `spec-name fixtureName`
Example: `writing-tests docsPage`
Example without a fixture: `smoke`

## Steps

1. **Read** `tests/e2e/docs.spec.ts` as a reference for structure.

2. **Determine** the test type:
   - E2E (with a fixture) → `tests/e2e/{spec-name}.spec.ts`
   - API → `tests/api/{spec-name}.spec.ts`

3. **Create** the file with this structure:
   ```ts
   import { test, expect } from '../../src/fixtures';
   // import a data factory if a matching one exists

   test.describe('{Name from the argument}', () => {
     test('{description} @regression', async ({ {fixture} }) => {
       await test.step('{step}', async () => {
         // assertion
       });
     });
   });
   ```

4. **Add** at least 2-3 tests covering:
   - A basic check (URL or heading)
   - The page's key functionality
   - One edge case or navigation flow

5. **Run** `npx playwright test tests/e2e/{spec-name}.spec.ts` to verify the tests are green.

6. **Output** a summary: how many tests were created, which tags, and the run result.

Tags: `@smoke` for critical checks, `@regression` for the rest, `@api` for HTTP tests.
`test.step()` steps are always flat, never nested.

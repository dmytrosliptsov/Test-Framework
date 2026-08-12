---
allowed-tools: Bash, Read
---

Inspect a playwright.dev page and return useful data for writing locators.

Arguments: `$ARGUMENTS`
Format: URL path relative to baseURL
Example: `/docs/intro` or `/mcp/introduction`

## Action

Run the following Node.js script (substitute the argument for `PATH`):

```bash
node -e "
const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://playwright.dev$ARGUMENTS');

  // Navbar links
  const navLinks = await page.locator('nav.navbar a').all();
  console.log('\\n=== NAVBAR LINKS ===');
  for (const link of navLinks) {
    const text = (await link.textContent()).trim();
    const href = await link.getAttribute('href');
    if (text) console.log(\`  \"\${text}\" → \${href}\`);
  }

  // H1 heading
  const h1 = await page.getByRole('heading', { level: 1 }).first().textContent().catch(() => 'not found');
  console.log('\\n=== H1 HEADING ===');
  console.log(' ', h1);

  // Buttons
  const buttons = await page.getByRole('button').allTextContents();
  console.log('\\n=== BUTTONS ===');
  buttons.filter(t => t.trim()).forEach(t => console.log(\`  \"\${t.trim()}\"\`));

  // Navigation landmarks
  const navs = await page.locator('nav').all();
  console.log('\\n=== NAV ELEMENTS (aria-label) ===');
  for (const nav of navs) {
    const label = await nav.getAttribute('aria-label');
    if (label) console.log(\`  aria-label=\"\${label}\"\`);
  }

  // Key links (first 10)
  const links = await page.getByRole('link').all();
  console.log('\\n=== LINKS (first 10 with text) ===');
  let count = 0;
  for (const link of links) {
    const text = (await link.textContent()).trim();
    const href = await link.getAttribute('href');
    if (text && count < 10) { console.log(\`  \"\${text}\" → \${href}\`); count++; }
  }

  await browser.close();
})().catch(e => console.error(e.message));
"
```

## What to output after running

After getting the results — **analyze them and propose ready-to-use locators** for the Page Object:

```ts
// Proposed locators for {ARGUMENTS}
readonly someElement: Locator = this.getByRole('heading', { name: '...' });
readonly someLink: Locator = this.getByRole('link', { name: '...' });
readonly someButton: Locator = this.getByRole('button', { name: '...' });
```

Explain why you chose these specific locators (getByRole > getByText > CSS).

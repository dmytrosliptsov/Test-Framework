---
allowed-tools: mcp__playwright__*, Write, Read
---

Run an exploratory testing session on playwright.dev through a live browser (Playwright MCP).

Arguments: `$ARGUMENTS`
Format: area of the site to explore (URL path or a description of the section)
Example: `/docs/api/class-page` or `documentation search`

If no arguments are given — explore the homepage (`/`) and main navigation.

## Goal

You do NOT write tests and do NOT generate Page Object code. Your job is to explore
the page(s) like a curious tester and record findings. Whether a case is worth its
own regression test is a decision for a human to make.

## What to look for

- Broken links (404s, empty hrefs, external links that lead nowhere)
- Unusual form/search behavior (empty input, special characters, very long strings, Escape/Enter)
- Browser console errors (JS errors, failed network requests)
- Accessibility issues (missing aria-labels, poor focus order, contrast)
- Inconsistencies between pages (identical elements behaving differently)
- Navigation edge cases (back/forward, direct deep-link loading, window resize)

## Steps

1. **Open** the page via `browser_navigate` using the argument (or `/` if no argument given).
2. **Explore** iteratively: click, read the DOM (`browser_snapshot`), try the edge cases above.
   For each hypothesis — one action, one check of the result.
3. **Capture the console** (`browser_console_messages`) after key actions — look for errors.
4. **Take a screenshot** (`browser_take_screenshot`) for every finding worth noting.
5. Don't leave `https://playwright.dev` — don't follow a link to an external domain beyond confirming it leads somewhere.

## Report Format

Output a Markdown report with these sections:

```markdown
# Exploratory testing: {area}

## Covered
- list of what was explored

## Findings

### [Severity: High/Medium/Low] Short title
- **Where:** URL / element
- **Steps to reproduce:** 1, 2, 3...
- **Expected:** ...
- **Actual:** ...
- **Screenshot:** path, if saved

## No Findings
- scenarios checked that were fine (brief, as a list)
```

If there are multiple findings, put them all in one report, sorted by severity.

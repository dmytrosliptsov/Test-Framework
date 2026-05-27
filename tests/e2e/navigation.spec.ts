import { test, expect } from '../../src/fixtures';
import { createNavigationExpectations } from '@data/docs.data';

const nav = createNavigationExpectations();

test.describe('Navbar navigation', () => {
  test('Docs link navigates to Installation page @regression', async ({ homePage }) => {
    await test.step('click Docs in navbar', async () => {
      await homePage.clickDocs();
    });
    await test.step('verify URL is docs/intro', async () => {
      await expect(homePage.page).toHaveURL(nav.docsUrl);
    });
  });

  test('API link navigates to API reference @regression', async ({ homePage }) => {
    await test.step('click API in navbar', async () => {
      await homePage.clickApi();
    });
    await test.step('verify URL is docs/api/class-playwright', async () => {
      await expect(homePage.page).toHaveURL(nav.apiUrl);
    });
  });

  test('MCP link navigates to MCP introduction @regression', async ({ homePage }) => {
    await test.step('click MCP in navbar', async () => {
      await homePage.clickMcp();
    });
    await test.step('verify URL is mcp/introduction', async () => {
      await expect(homePage.page).toHaveURL(nav.mcpUrl);
    });
  });

  test('logo click returns to homepage @regression', async ({ docsPage }) => {
    await test.step('click Playwright logo from docs page', async () => {
      await docsPage.logoLink.click();
    });
    await test.step('verify URL is homepage', async () => {
      await expect(docsPage.page).toHaveURL(nav.homeUrl);
    });
  });
});

test.describe('Browser history navigation', () => {
  test('back button returns to previous page @regression', async ({ homePage }) => {
    await test.step('navigate to docs via navbar', async () => {
      await homePage.clickDocs();
      await expect(homePage.page).toHaveURL(nav.docsUrl);
    });
    await test.step('press browser back', async () => {
      await homePage.page.goBack();
    });
    await test.step('verify returned to homepage', async () => {
      await expect(homePage.page).toHaveURL(nav.homeUrl);
    });
  });
});

test.describe('Docs sidebar navigation', () => {
  test('clicking Writing tests opens correct page @regression', async ({ docsPage }) => {
    await test.step('click Writing tests in sidebar', async () => {
      await docsPage.clickSidebarLink(/Writing tests/i);
    });
    await test.step('verify URL is writing-tests', async () => {
      await expect(docsPage.page).toHaveURL(nav.writingTestsUrl);
    });
  });
});

test.describe('Docs table of contents', () => {
  test('breadcrumb shows current section @regression', async ({ docsPage }) => {
    await test.step('verify breadcrumb is visible', async () => {
      await expect(docsPage.breadcrumb).toBeVisible();
    });
    await test.step('verify breadcrumb contains Getting Started', async () => {
      await expect(docsPage.breadcrumb).toContainText('Getting Started');
    });
  });

  test('TOC is visible and has items @regression', async ({ docsPage }) => {
    await test.step('verify table of contents is visible', async () => {
      await expect(docsPage.tableOfContents).toBeVisible();
    });
    await test.step('verify TOC contains Installation item', async () => {
      await expect(docsPage.tableOfContents).toContainText('Installing Playwright');
    });
  });

  test('clicking TOC item anchors to section @regression', async ({ docsPage }) => {
    await test.step('click Installing Playwright in TOC', async () => {
      await docsPage.clickTocItem(/Installing Playwright/i);
    });
    await test.step('verify URL contains anchor', async () => {
      await expect(docsPage.page).toHaveURL(/#installing-playwright/);
    });
  });
});

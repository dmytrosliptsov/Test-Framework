import { test, expect } from '../../src/fixtures';
import { createDocsPageExpectations } from '@data/docs.data';

const data = createDocsPageExpectations();

test.describe('Docs page', () => {
  test('has correct URL and heading @regression', async ({ docsPage }) => {
    await test.step('verify URL contains "docs/intro"', async () => {
      await expect(docsPage.page).toHaveURL(data.urlPattern);
    });
    await test.step('verify h1 heading contains "Installation"', async () => {
      await expect(docsPage.pageHeading).toContainText(data.headingPattern);
    });
  });

  test('sidebar navigation is visible @regression', async ({ docsPage }) => {
    await test.step('verify docs sidebar is visible', async () => {
      await expect(docsPage.sidebar).toBeVisible();
    });
    await test.step('verify sidebar has Installation link', async () => {
      const link = await docsPage.getSidebarLink(/Installation/i);
      await expect(link).toBeVisible();
    });
  });

  test('page contains code blocks @regression', async ({ docsPage }) => {
    await test.step('verify at least one code block is present', async () => {
      await expect(docsPage.codeBlock).toBeVisible();
    });
  });

  test('next page link navigates forward @regression', async ({ docsPage }) => {
    await test.step('click next page link', async () => {
      await docsPage.clickNextPage();
    });
    await test.step('verify URL changed to writing-tests', async () => {
      await expect(docsPage.page).toHaveURL(data.nextPageUrlPattern);
    });
  });
});

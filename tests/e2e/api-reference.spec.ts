import { test, expect } from '../../src/fixtures';

test.describe('API Reference page', () => {
  test('has correct URL @regression', async ({ apiPage }) => {
    await expect(apiPage.page).toHaveURL(/docs\/api\/class-playwright/);
  });

  test('page heading is visible @regression', async ({ apiPage }) => {
    await expect(apiPage.pageHeading).toBeVisible();
  });

  test('sidebar navigation is visible @regression', async ({ apiPage }) => {
    await expect(apiPage.sidebar).toBeVisible();
  });
});

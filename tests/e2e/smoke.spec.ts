import { test, expect } from '../../src/fixtures';

test.describe('Playwright homepage', () => {
  test('has correct title @smoke', async ({ homePage }) => {
    await expect(homePage.page).toHaveTitle(/Playwright/);
  });

  test('hero heading is visible @smoke', async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
  });

  test('get started link navigates to docs @smoke', async ({ homePage, page }) => {
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/intro/);
  });
});

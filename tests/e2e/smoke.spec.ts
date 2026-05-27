import { test, expect } from '../../src/fixtures';
import { createHomePageExpectations } from '@data/home.data';

const data = createHomePageExpectations();

test.describe('Playwright homepage', () => {
  test('has correct title @smoke', async ({ homePage }) => {
    await test.step('check page title contains "Playwright"', async () => {
      await expect(homePage.page).toHaveTitle(data.titlePattern);
    });
  });

  test('hero heading is visible @smoke', async ({ homePage }) => {
    await test.step('check hero heading is visible on page', async () => {
      await expect(homePage.heroHeading).toBeVisible();
    });
  });

  test('get started link navigates to docs @smoke', async ({ homePage }) => {
    await test.step('click Get Started link', async () => {
      await homePage.clickGetStarted();
    });
    await test.step('verify URL contains "intro"', async () => {
      await expect(homePage.page).toHaveURL(data.getStartedUrlPattern);
    });
  });
});

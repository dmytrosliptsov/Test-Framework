import { test, expect } from '../../src/fixtures';

test.describe('Visual regression', () => {
  test('homepage hero section matches baseline @visual', async ({ homePage }) => {
    await test.step('compare hero section screenshot to baseline', async () => {
      await expect(homePage.heroHeading).toHaveScreenshot('home-hero.png');
    });
  });
});

import { test, expect } from '../../src/fixtures';
import { createSearchData } from '@data/docs.data';

const data = createSearchData();

test.describe('Search', () => {
  test('search modal opens on button click @regression', async ({ homePage }) => {
    await test.step('click search button', async () => {
      await homePage.openSearch();
    });
    await test.step('verify search input is visible', async () => {
      await expect(homePage.searchInput).toBeVisible();
    });
  });

  test('search input accepts text and shows results @regression', async ({ homePage }) => {
    await test.step('open search and type query', async () => {
      await homePage.search(data.query);
    });
    await test.step('verify search input contains typed text', async () => {
      await expect(homePage.searchInput).toHaveValue(data.query);
    });
    await test.step('verify search results are displayed', async () => {
      await expect(homePage.searchResults).toBeVisible();
    });
  });

  test('search can be closed with Escape @regression', async ({ homePage }) => {
    await test.step('open search modal', async () => {
      await homePage.openSearch();
      await expect(homePage.searchInput).toBeVisible();
    });
    await test.step('press Escape to close', async () => {
      await homePage.page.keyboard.press('Escape');
    });
    await test.step('verify search input is no longer visible', async () => {
      await expect(homePage.searchInput).not.toBeVisible();
    });
  });
});

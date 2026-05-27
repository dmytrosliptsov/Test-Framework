import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { DocsPage } from '../pages/DocsPage';

type Pages = {
  homePage: HomePage;
  docsPage: DocsPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await use(homePage);
  },
  docsPage: async ({ page }, use) => {
    const docsPage = new DocsPage(page);
    await docsPage.open();
    await use(docsPage);
  },
});

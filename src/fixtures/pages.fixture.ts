import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { DocsPage } from '../pages/DocsPage';
import { ApiReferencePage } from '../pages/ApiReferencePage';

type Pages = {
  homePage: HomePage;
  docsPage: DocsPage;
  apiPage: ApiReferencePage;
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
  apiPage: async ({ page }, use) => {
    const apiPage = new ApiReferencePage(page);
    await apiPage.open();
    await use(apiPage);
  },
});

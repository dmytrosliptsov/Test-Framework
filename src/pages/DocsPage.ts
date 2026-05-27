import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DocsPage extends BasePage {
  readonly pageHeading: Locator = this.getByRole('heading', { level: 1 });
  readonly logoLink: Locator = this.getByRole('link', { name: 'Playwright' }).first();
  readonly sidebar: Locator = this.getByRole('navigation', { name: /docs sidebar/i });
  readonly breadcrumb: Locator = this.getByRole('navigation', { name: 'Breadcrumbs' });
  readonly tableOfContents: Locator = this.locator('.table-of-contents');
  readonly articleContent: Locator = this.locator('article');
  readonly codeBlock: Locator = this.locator('pre').first();
  readonly nextPageLink: Locator = this.locator('.pagination-nav__link--next');

  async open(): Promise<void> {
    await this.navigate('/docs/intro');
  }

  async clickNextPage(): Promise<void> {
    await this.nextPageLink.click();
  }

  async clickSidebarLink(name: string | RegExp): Promise<void> {
    await this.sidebar.getByRole('link', { name }).click();
  }

  async clickTocItem(name: string | RegExp): Promise<void> {
    await this.tableOfContents.getByRole('link', { name }).click();
  }

  async getSidebarLink(name: string | RegExp): Promise<Locator> {
    return this.sidebar.getByRole('link', { name });
  }
}

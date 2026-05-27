import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DocsPage extends BasePage {
  readonly pageHeading: Locator = this.getByRole('heading', { level: 1 });
  readonly sidebar: Locator = this.getByRole('navigation', { name: /docs sidebar/i });
  readonly articleContent: Locator = this.locator('article');
  readonly codeBlock: Locator = this.locator('pre').first();
  readonly nextPageLink: Locator = this.locator('.pagination-nav__link--next');

  async open(): Promise<void> {
    await this.navigate('/docs/intro');
  }

  async clickNextPage(): Promise<void> {
    await this.nextPageLink.click();
  }

  async getSidebarLink(name: string | RegExp): Promise<Locator> {
    return this.sidebar.getByRole('link', { name });
  }
}

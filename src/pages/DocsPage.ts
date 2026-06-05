import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '@utils/step.decorator';

export class DocsPage extends BasePage {
  readonly pageHeading: Locator = this.getByRole('heading', { level: 1 });
  readonly sidebar: Locator = this.getByRole('navigation', { name: /docs sidebar/i });
  readonly breadcrumb: Locator = this.getByRole('navigation', { name: 'Breadcrumbs' });
  readonly tableOfContents: Locator = this.locator('.table-of-contents');
  readonly articleContent: Locator = this.locator('article');
  readonly codeBlock: Locator = this.locator('pre').first();
  readonly nextPageLink: Locator = this.locator('.pagination-nav__link--next');

  @step('Open docs page')
  async open(): Promise<void> {
    await this.navigate('/docs/intro');
  }

  @step('Click next page')
  async clickNextPage(): Promise<void> {
    await this.nextPageLink.click();
  }

  @step((name: string | RegExp) => `Click sidebar link "${name}"`)
  async clickSidebarLink(name: string | RegExp): Promise<void> {
    await this.sidebar.getByRole('link', { name }).click();
  }

  @step((name: string | RegExp) => `Click TOC item "${name}"`)
  async clickTocItem(name: string | RegExp): Promise<void> {
    await this.tableOfContents.getByRole('link', { name }).click();
  }

  getSidebarLink(name: string | RegExp): Locator {
    return this.sidebar.getByRole('link', { name });
  }
}

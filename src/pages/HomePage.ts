import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchButton: Locator = this.getByRole('button', { name: 'Search' });
  readonly getStartedLink: Locator = this.getByRole('link', { name: 'Get started' });
  readonly heroHeading: Locator = this.getByRole('heading', { name: /Playwright enables reliable/ });

  async open(): Promise<void> {
    await this.navigate('/');
  }

  async openSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }
}

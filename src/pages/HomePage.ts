import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchButton: Locator = this.getByRole('button', { name: 'Search' });
  readonly getStartedLink: Locator = this.getByRole('link', { name: 'Get started' });
  readonly heroHeading: Locator = this.getByRole('heading', { name: /Playwright enables reliable/ });
  readonly docsNavLink: Locator = this.getByRole('link', { name: 'Docs' });
  readonly apiNavLink: Locator = this.getByRole('link', { name: 'API' });
  readonly mcpNavLink: Locator = this.getByRole('link', { name: 'MCP', exact: true });
  readonly searchInput: Locator = this.getByRole('searchbox');
  readonly searchResults: Locator = this.getByRole('listbox').first();

  async open(): Promise<void> {
    await this.navigate('/');
  }

  async openSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async search(query: string): Promise<void> {
    await this.openSearch();
    await this.searchInput.fill(query);
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  async clickDocs(): Promise<void> {
    await this.docsNavLink.click();
  }

  async clickApi(): Promise<void> {
    await this.apiNavLink.click();
  }

  async clickMcp(): Promise<void> {
    await this.mcpNavLink.click();
  }

  async goHome(): Promise<void> {
    await this.logoLink.click();
  }
}

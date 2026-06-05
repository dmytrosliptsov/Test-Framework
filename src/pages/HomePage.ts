import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '@utils/step.decorator';

export class HomePage extends BasePage {
  readonly searchButton: Locator = this.getByRole('button', { name: 'Search' });
  readonly getStartedLink: Locator = this.getByRole('link', { name: 'Get started' });
  readonly heroHeading: Locator = this.getByRole('heading', { name: /Playwright enables reliable/ });
  readonly docsNavLink: Locator = this.getByRole('link', { name: 'Docs' });
  readonly apiNavLink: Locator = this.getByRole('link', { name: 'API' });
  readonly mcpNavLink: Locator = this.getByRole('link', { name: 'MCP', exact: true });
  readonly searchInput: Locator = this.getByRole('searchbox');
  readonly searchResults: Locator = this.getByRole('listbox').first();

  @step('Open home page')
  async open(): Promise<void> {
    await this.navigate('/');
  }

  @step('Open search')
  async openSearch(): Promise<void> {
    await this.searchButton.click();
  }

  @step((query: string) => `Search for "${query}"`)
  async search(query: string): Promise<void> {
    await this.openSearch();
    await this.searchInput.fill(query);
  }

  @step('Click Get Started')
  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  @step('Click Docs')
  async clickDocs(): Promise<void> {
    await this.docsNavLink.click();
  }

  @step('Click API')
  async clickApi(): Promise<void> {
    await this.apiNavLink.click();
  }

  @step('Click MCP')
  async clickMcp(): Promise<void> {
    await this.mcpNavLink.click();
  }

  @step('Go to home page')
  async goHome(): Promise<void> {
    await this.logoLink.click();
  }
}

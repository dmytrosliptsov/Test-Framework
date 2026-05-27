import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(readonly page: Page) {}

  readonly logoLink: Locator = this.getByRole('link', { name: 'Playwright' }).first();

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  protected getByText(text: string): Locator {
    return this.page.getByText(text);
  }

  protected getByPlaceholder(text: string): Locator {
    return this.page.getByPlaceholder(text);
  }

  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
}

import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ApiReferencePage extends BasePage {
  readonly pageHeading: Locator = this.getByRole('heading', { level: 1 });
  readonly sidebar: Locator = this.getByRole('navigation', { name: /docs sidebar/i });

  async open(): Promise<void> {
    await this.navigate('/docs/api/class-playwright');
  }
}

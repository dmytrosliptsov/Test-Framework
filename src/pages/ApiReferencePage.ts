import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '@utils/step.decorator';

export class ApiReferencePage extends BasePage {
  readonly pageHeading: Locator = this.getByRole('heading', { level: 1 });
  readonly sidebar: Locator = this.getByRole('navigation', { name: /docs sidebar/i });

  @step('Open API reference page')
  async open(): Promise<void> {
    await this.navigate('/docs/api/class-playwright');
  }
}

import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HomePage } from './home.page';

export class SettingsPage extends BasePage {
  readonly logOutButton: Locator;

  constructor(page: Page, baseURL = 'http://localhost:4200/settings') {
    super(page, baseURL);
    this.logOutButton = this.page.getByRole('button', { name: 'Or click here to logout.' });
  }

  async logout(): Promise<HomePage> {
    await this.logOutButton.click();
    return new HomePage(this.page);
  }
}

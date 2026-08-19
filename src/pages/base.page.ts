import { expect, Page, test } from '@playwright/test';

export class BasePage {
  readonly baseURL: string;
  readonly page: Page;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto(): Promise<void> {
    await test.step(`Opening page with url "${this.baseURL}".`, async () => {
      await this.page.goto(this.baseURL);
      await expect(this.page).toHaveURL(this.baseURL);
    });
  }

  async reload(): Promise<void> {
    const currentUrl = this.page.url();
    await test.step(`Reloading page with url "${currentUrl}".`, async () => {
      await this.page.reload();
    });
  }
}

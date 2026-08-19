import { Locator, Page } from '@playwright/test';

export class NavBar {
  readonly #root: Locator;
  readonly #page: Page;

  readonly currentUserLink: Locator;

  constructor(page: Page, selector: string) {
    this.#page = page;
    this.#root = this.#page.locator(selector);

    this.currentUserLink = this.#root.locator('a.nav-link').filter({
      has: this.#page.locator('img.user-pic'),
    });
  }
}

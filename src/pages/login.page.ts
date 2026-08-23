import test, { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginRequest } from '../models/user';

type LoginError = 'credentials invalid';

export class LoginPage extends BasePage {
  readonly #emailField: Locator;
  readonly #passwordField: Locator;
  readonly signInButton: Locator;
  readonly #errorsContainer: Locator;

  constructor(page: Page, baseURL = 'http://localhost:4200/login') {
    super(page, baseURL);
    this.#emailField = this.page.getByRole('textbox', { name: 'Email' });
    this.#passwordField = this.page.getByRole('textbox', { name: 'Password' });
    this.signInButton = this.page.getByRole('button', { name: 'Sign in' });
    this.#errorsContainer = this.page.locator('ul.error-messages');
  }

  async fillCredentials(credentials: LoginRequest): Promise<void> {
    await this.#emailField.fill(credentials.email);
    await this.#passwordField.fill(credentials.password);
  }

  //TODO: should return HomePage class.
  async logInAsUser(credentials: LoginRequest): Promise<void> {
    return await test.step(`Performing login as "${credentials.email}" user.`, async () => {
      await this.fillCredentials(credentials);
      await this.signInButton.click();
    });
  }

  // TODO: add all possible errors to this union type.
  async expectErrors(...errors: LoginError[]): Promise<void> {
    await expect(this.#errorsContainer).toBeVisible();

    for (const error of errors) {
      await expect(this.#errorsContainer).toContainText(error);
    }
  }
}

import test, { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CreateUserRequest } from '../models/user';

type RegistrationError =
  | 'email has already been taken'
  | 'username has already been taken'
  | "username can't be blank"
  | "password can't be blank"
  | "email can't be blank";

export class RegistrationPage extends BasePage {
  readonly #usernameField: Locator;
  readonly #emailField: Locator;
  readonly #passwordField: Locator;
  readonly signUpButton: Locator;
  readonly #errorsContainer: Locator;

  constructor(page: Page, baseURL = 'http://localhost:4200/register') {
    super(page, baseURL);
    this.#usernameField = this.page.getByRole('textbox', { name: 'Username' });
    this.#emailField = this.page.getByRole('textbox', { name: 'Email' });
    this.#passwordField = this.page.getByRole('textbox', { name: 'Password' });
    this.signUpButton = this.page.getByRole('button', { name: 'Sign up' });

    this.#errorsContainer = this.page.locator('ul.error-messages');
  }

  async fillFields(credentials: CreateUserRequest): Promise<void> {
    await this.#usernameField.fill(credentials.username);
    await this.#emailField.fill(credentials.email);
    await this.#passwordField.fill(credentials.password);
  }

  //TODO: should return HomePage class.
  async registerUser(credentials: CreateUserRequest): Promise<void> {
    return await test.step(`Registering "${credentials.username}" user.`, async () => {
      await this.fillFields(credentials);
      await this.signUpButton.click();
    });
  }

  // TODO: Maybe expect errors can be moved into basePage and leave only override to correct error type in child classes.
  async expectErrors(...errors: RegistrationError[]): Promise<void> {
    await expect(this.#errorsContainer).toBeVisible();

    for (const error of errors) {
      await expect(this.#errorsContainer).toContainText(error);
    }
  }
}

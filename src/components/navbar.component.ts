import { Locator, Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { RegistrationPage } from '../pages/registration.page';
import { LoginPage } from '../pages/login.page';
import { SettingsPage } from '../pages/settings.page';

type PageRole = 'Login' | 'Registration' | 'Home' | 'Settings';

export class NavBar {
  readonly #root: Locator;
  readonly #page: Page;

  readonly homeButton: Locator;

  readonly loggedIn: {
    currentUserLink: Locator;
    settingsLink: Locator;
  };

  readonly loggedOut: {
    signInLink: Locator;
    signUpLink: Locator;
  };

  constructor(page: Page, selector: string) {
    this.#page = page;
    this.#root = this.#page.locator(selector);

    this.homeButton = this.#root.getByRole('link', { name: 'Home' });

    this.loggedIn = {
      currentUserLink: this.#root.locator('a.nav-link').filter({
        has: this.#page.locator('img.user-pic'),
      }),
      settingsLink: this.#root.getByRole('link', { name: 'Settings' }),
    };
    this.loggedOut = {
      signInLink: this.#root.getByRole('link', { name: 'Sign in' }),
      signUpLink: this.#root.getByRole('link', { name: 'Sign up' }),
    };
  }

  async openPage(role: PageRole): Promise<HomePage | RegistrationPage | LoginPage | SettingsPage> {
    switch (role) {
      case 'Login':
        await this.loggedOut.signInLink.click();
        return new LoginPage(this.#page);
      case 'Registration':
        await this.loggedOut.signUpLink.click();
        return new RegistrationPage(this.#page);
      case 'Home':
        await this.homeButton.click();
        return new HomePage(this.#page);
      case 'Settings':
        await this.loggedIn.settingsLink.click();
        return new SettingsPage(this.#page);
      default:
        role satisfies never;
        throw new Error(`Unsupported page role: ${role}`);
    }
  }
}

import { test as base } from '@playwright/test';
import { ApiClient } from '../api/app';
import { LoginPage } from '../pages/login.page';
import { TestUser } from '../models/user';
import { UserFactory } from '../factories/user.factory';

type ApiFixtures = {
  apiClient: ApiClient;
  newUser: TestUser;
};

type PagesFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<PagesFixtures & ApiFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  apiClient: async ({ playwright }, use) => {
    const apiURL = process.env.API_URL;
    if (!apiURL) {
      throw new Error('API_URL environment variable is required.');
    }

    const context = await playwright.request.newContext();
    const client = new ApiClient(context, apiURL);

    await use(client);
    await context.dispose();
  },

  newUser: async ({ apiClient }, use) => {
    const credentials = UserFactory.create();

    const user = {
      password: credentials.password,
      ...(await apiClient.createUser(credentials)).user,
    };
    await use(user);
    // TODO: There is no user deletion in API i think
  },
});

export { expect } from '@playwright/test';

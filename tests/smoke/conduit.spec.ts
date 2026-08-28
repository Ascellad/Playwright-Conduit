import { test, expect } from '../../src/fixtures/fixtures';
import { UserFactory } from '../../src/factories/user.factory';
import { SettingsPage } from '../../src/pages/settings.page';

test.use({ storageState: { cookies: [], origins: [] } });

test('Conduit application is available', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Conduit/i);
});

test.describe('Login', () => {
  test('User can log in with valid credentials', async ({ loginPage, newUser }) => {
    await loginPage.goto();
    const homePage = await loginPage.logInAsUser({
      email: newUser.email,
      password: newUser.password,
    });
    await expect(homePage.page).toHaveURL('/');
    await expect(homePage.navBar.loggedIn.currentUserLink).toHaveText(newUser.username);
  });

  test('User cannot log in with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.logInAsUser({ email: 'somerandomemail', password: 'somerandompassword' });

    await expect(loginPage.page).toHaveURL('/login');
    await loginPage.expectErrors('credentials invalid');
  });

  test('Sign in button is disabled when email or password is empty', async ({ loginPage }) => {
    await loginPage.goto();

    await test.step('Email is empty', async () => {
      await loginPage.fillCredentials({ email: '', password: '123456' });
      await expect(loginPage.signInButton).toBeDisabled();
    });

    await test.step('Password is empty', async () => {
      await loginPage.fillCredentials({ email: 'email@gmail.com', password: '' });
      await expect(loginPage.signInButton).toBeDisabled();
    });
  });
});

test.describe('Register', () => {
  test('User can register with valid credentials', async ({ registrationPage }) => {
    await registrationPage.goto();

    const credentials = UserFactory.create();
    const homePage = await registrationPage.registerUser(credentials);

    await expect(homePage.page).toHaveURL('/');
    await expect(homePage.navBar.loggedIn.currentUserLink).toHaveText(credentials.username);
  });

  test('Sign up button is disabled when any field is empty', async ({ registrationPage }) => {
    await registrationPage.goto();

    await test.step('Username is empty', async () => {
      await registrationPage.fillFields({
        username: '',
        email: 'email@gmail.com',
        password: '123456',
      });
      await expect(registrationPage.signUpButton).toBeDisabled();
    });

    await test.step('Email is empty', async () => {
      await registrationPage.fillFields({ username: 'testUser', email: '', password: '123456' });
      await expect(registrationPage.signUpButton).toBeDisabled();
    });

    await test.step('Password is empty', async () => {
      await registrationPage.fillFields({
        username: 'testUser',
        email: 'email@gmail.com',
        password: '',
      });
      await expect(registrationPage.signUpButton).toBeDisabled();
    });
  });

  test('User cannot register if any field is blank', async ({ registrationPage }) => {
    await registrationPage.goto();

    await test.step('Username is empty', async () => {
      await registrationPage.registerUser({
        username: ' ',
        email: 'email@gmail.com',
        password: '123456',
      });

      await expect(registrationPage.page).toHaveURL('/register');
      await registrationPage.expectErrors("username can't be blank");
    });

    await test.step('Email is empty', async () => {
      await registrationPage.registerUser({
        username: 'testUser',
        email: ' ',
        password: '123456',
      });

      await expect(registrationPage.page).toHaveURL('/register');
      await registrationPage.expectErrors("email can't be blank");
    });

    await test.step('Password is empty', async () => {
      await registrationPage.registerUser({
        username: 'testUser',
        email: 'email@gmail.com',
        password: ' ',
      });

      await expect(registrationPage.page).toHaveURL('/register');
      await registrationPage.expectErrors("password can't be blank");
    });
    await test.step('All', async () => {
      await registrationPage.registerUser({
        username: ' ',
        email: ' ',
        password: ' ',
      });

      await expect(registrationPage.page).toHaveURL('/register');
      await registrationPage.expectErrors(
        "email can't be blank",
        "username can't be blank",
        "password can't be blank",
      );
    });
  });

  test("User cannot register if email or username isn't unique", async ({
    registrationPage,
    newUser,
  }) => {
    await registrationPage.goto();

    await test.step("Username isn't unique", async () => {
      await registrationPage.registerUser(UserFactory.createWith({ username: newUser.username }));

      await expect(registrationPage.page).toHaveURL('/register');
      await registrationPage.expectErrors(
        'username has already been taken',
        'email has already been taken',
      );
    });

    await test.step("Email isn't unique", async () => {
      await registrationPage.registerUser(UserFactory.createWith({ email: newUser.email }));

      await expect(registrationPage.page).toHaveURL('/register');
      await registrationPage.expectErrors(
        'email has already been taken',
        'username has already been taken',
      );
    });
  });
});

test.describe('Logout', () => {
  test.use({ storageState: '.auth/user.json' });
  test('User can logout', async ({ homePage }) => {
    await homePage.goto();
    const settingsPage = (await homePage.navBar.openPage('Settings')) as SettingsPage;
    homePage = await settingsPage.logout();

    await expect(homePage.page).toHaveURL('/');
    await expect(homePage.navBar.loggedOut.signInLink).toBeVisible();
    await expect(homePage.navBar.loggedOut.signUpLink).toBeVisible();
    await expect(homePage.navBar.loggedIn.currentUserLink).not.toBeVisible();
  });
  test("Unauthorized user can't access some pages", async ({ homePage }) => {
    await homePage.goto();
    const settingsPage = (await homePage.navBar.openPage('Settings')) as SettingsPage;
    homePage = await settingsPage.logout();

    await expect(homePage.page).toHaveURL('/');
    await expect(homePage.navBar.loggedOut.signInLink).toBeVisible();
    await expect(homePage.navBar.loggedOut.signUpLink).toBeVisible();
    await expect(homePage.navBar.loggedIn.currentUserLink).not.toBeVisible();
  });
});

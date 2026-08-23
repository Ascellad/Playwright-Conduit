import { NavBar } from '../../src/components/navbar.component';
import { test, expect } from '../../src/fixtures/fixtures';

test('Conduit application is available', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Conduit/i);
});

test.describe('Login', () => {
  test('User can log in with valid credentials', async ({ loginPage, newUser }) => {
    await loginPage.goto();
    await loginPage.logInAsUser({ email: newUser.email, password: newUser.password });
    await expect(loginPage.page).toHaveURL('/');
    //TODO: Move this into components/main page object.
    const navBar = new NavBar(loginPage.page, 'nav.navbar');
    await expect(navBar.currentUserLink).toHaveText(newUser.username);
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

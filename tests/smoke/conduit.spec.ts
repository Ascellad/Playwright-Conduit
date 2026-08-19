import { NavBar } from '../../src/components/navbar.component';
import { test, expect } from '../../src/fixtures/fixtures';

test('Conduit application is available', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Conduit/i);
});

test('User can log in with valid credentials', async ({ loginPage, newUser }) => {
  await loginPage.goto();
  await loginPage.logInAsUser(newUser.email, newUser.password);
  await expect(loginPage.page).toHaveURL('/');
  const navBar = new NavBar(loginPage.page, 'nav.navbar');
  await expect(navBar.currentUserLink).toHaveText(newUser.username);
});

test('User cannot log in with invalid credentials', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.logInAsUser('somerandomemail', 'somerandompassword');

  await expect(loginPage.page).toHaveURL('/login');
  await loginPage.expectErrors('credentials invalid');
});

test('Sign in button is disabled when email or password is empty', async ({ loginPage }) => {
  await loginPage.goto();

  await test.step('Email is empty', async () => {
    await loginPage.fillCredentials('', '123456');
    await expect(loginPage.signInButton).toBeDisabled();
  });

  await test.step('Password is empty', async () => {
    await loginPage.fillCredentials('email@gmail.com', '');
    await expect(loginPage.signInButton).toBeDisabled();
  });
});

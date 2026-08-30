import { expect } from '@playwright/test';
import { authFile } from '../../src/config/paths';
import { test } from '../../src/fixtures/fixtures';
import { SettingsPage } from '../../src/pages/settings.page';

test.describe('Logout', () => {
  test.use({ storageState: authFile });
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

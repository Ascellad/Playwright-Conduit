import { expect, test } from '@playwright/test';

test('Conduit application is available', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Conduit/i);
});

import { test, expect } from '../../src/fixtures/fixtures';

test('Conduit application is available', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Conduit/i);
});

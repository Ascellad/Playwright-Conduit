import { authFile } from '../playwright.config';
import { test as setup } from '../src/fixtures/fixtures';
import { LoginRequest } from '../src/models/user';

setup('authenticate', async ({ page, apiClient }) => {
  const credentials: LoginRequest = {
    email: 'test@gmail.com',
    password: '11111111',
  };
  const token = await apiClient.login(credentials);

  await page.goto('/');
  await page.evaluate((token) => {
    localStorage.setItem('jwtToken', token);
  }, token);
  await page.context().storageState({ path: authFile });
});

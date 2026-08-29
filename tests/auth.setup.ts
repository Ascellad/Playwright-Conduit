import { authFile } from '../src/config/paths';
import { UserFactory } from '../src/factories/user.factory';
import { test as setup } from '../src/fixtures/fixtures';

setup('authenticate', async ({ page, apiClient }) => {
  const credentials = UserFactory.create();
  const token = (await apiClient.createUser(credentials)).user.token;
  console.log(`Test user created: email=${credentials.email}, username=(${credentials.username})`);

  await page.goto('/');
  await page.evaluate((token) => {
    localStorage.setItem('jwtToken', token);
  }, token);
  await page.context().storageState({ path: authFile });
});

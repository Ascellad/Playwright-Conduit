import { UserFactory } from '../../src/factories/user.factory';
import { test as apiTest, expect } from '../../src/fixtures/fixtures';

apiTest.describe('User registration', () => {
  apiTest('User can be registered via API', async ({ apiClient }) => {
    const credentials = UserFactory.create();

    const user = (await apiClient.createUser(credentials)).user;

    expect(user.id).toBeGreaterThan(0);
    expect(user.username).toBe(credentials.username);
    expect(user.email).toBe(credentials.email);
    expect(user.token).toBeDefined();
  });

  apiTest('User cannot be registered with an existing email', async ({ newUser, apiClient }) => {
    const credentials = UserFactory.createWith({ email: newUser.email });

    const response = await apiClient.createUserRaw(credentials);

    expect(response.status()).toBe(409);
    const body = await response.json();
    //Known SUT behavior: both errors appear even if only one of the values is non unique
    expect(body.errors).toEqual({
      email: ['has already been taken'],
      username: ['has already been taken'],
    });
  });

  apiTest('User cannot be registered with an existing username', async ({ newUser, apiClient }) => {
    const credentials = UserFactory.createWith({ username: newUser.username });

    const response = await apiClient.createUserRaw(credentials);

    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.errors).toEqual({
      email: ['has already been taken'],
      username: ['has already been taken'],
    });
  });
});

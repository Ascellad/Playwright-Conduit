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

apiTest.describe('User can log in with valid credentials', () => {
  apiTest('valid', async ({ newUser, apiClient }) => {
    const user = (await apiClient.login(newUser)).user;

    expect(user.username).toBe(newUser.username);
    expect(user.email).toBe(newUser.email);
    expect(user.token).toBeDefined();
  });

  apiTest('User cannot log in with invalid credentials', async ({ newUser, apiClient }) => {
    await apiTest.step('invalid email', async () => {
      const response = await apiClient.loginRaw({
        email: "thisEmailTotallyDoesn'tExist.com",
        password: newUser.password,
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.errors).toEqual({
        credentials: ['invalid'],
      });
    });
    await apiTest.step('invalid password', async () => {
      const response = await apiClient.loginRaw({
        email: newUser.email,
        password: 'thisPasswordIsTotallyIncorrect',
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.errors).toEqual({
        credentials: ['invalid'],
      });
    });
  });

  apiTest('User cannot log in with blank credentials', async ({ newUser, apiClient }) => {
    await apiTest.step('blank email', async () => {
      const response = await apiClient.loginRaw({
        email: '',
        password: newUser.password,
      });

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors).toEqual({
        email: ["can't be blank"],
      });
    });
    await apiTest.step('blank password', async () => {
      const response = await apiClient.loginRaw({
        email: newUser.email,
        password: '',
      });

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors).toEqual({
        password: ["can't be blank"],
      });
    });
    await apiTest.step('both', async () => {
      const response = await apiClient.loginRaw({
        email: '',
        password: '',
      });

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors).toEqual({
        email: ["can't be blank"],
        password: ["can't be blank"],
      });
    });
  });

  apiTest('User cannot log in with missing credentials', async ({ newUser, apiClient }) => {
    await apiTest.step('missing email', async () => {
      const response = await apiClient.loginRaw({
        password: newUser.password,
      });

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors).toEqual({
        email: ['Required'],
      });
    });
    await apiTest.step('missing password', async () => {
      const response = await apiClient.loginRaw({
        email: newUser.email,
      });

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors).toEqual({
        password: ['Required'],
      });
    });
    await apiTest.step('both', async () => {
      const response = await apiClient.loginRaw({});

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors).toEqual({
        email: ['Required'],
        password: ['Required'],
      });
    });
  });
});

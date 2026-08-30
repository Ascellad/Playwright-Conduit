import { defineConfig, devices } from '@playwright/test';
import { authFile } from './src/config/paths';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  ...(process.env.CI ? { workers: 1 } : {}),

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:4200',

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium-smoke',
      testDir: './tests/smoke',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'chromium-guest',
      testDir: './tests/guest',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'chromium-authenticated',
      testDir: './tests/authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'npm run start:sut',
    url: 'http://localhost:4200',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

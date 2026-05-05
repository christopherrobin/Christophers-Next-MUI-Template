import { defineConfig, devices } from '@playwright/test'

const testDbUrl = process.env.DATABASE_TEST_URL ?? ''

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Serialize workers: avoids auth-fixture race against the single dev server.
  // Emotion SSR cold start widens the collision window beyond what the Tailwind
  // sibling exhibits. Tailwind variant uses default (`process.env.CI ? 1 : undefined`).
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  globalSetup: require.resolve('./e2e/global-setup'),
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000',
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...(process.env as Record<string, string>),
      DATABASE_PUBLIC_URL: testDbUrl,
      DATABASE_URL: testDbUrl
    }
  }
})

import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:18888';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    headless: true,
    // Locally use the installed Edge; CI installs Playwright's Chromium.
    channel: process.env.CI ? undefined : 'msedge',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/serve-docs.mjs',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0:0,
  workers: process.env.CI ? 3:undefined,

//npx allure generate reports/allure-results --clean -o reports/allure-report
//npx allure open reports/allure-report

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results', detail: true, suiteTitle: true }],
  ],

  use: {
    baseURL: "https://dev.ges.store/",
    headless: process.env.HEADLESS
  ? process.env.HEADLESS === 'true'
  : !!process.env.CI,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    launchOptions: {
      args: ['--start-maximized'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});
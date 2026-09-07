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
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 1,

  expect: {
    timeout: 15000,   // was 5000 default — give hydration room to finish
  },

  //npx allure generate reports/allure-results --clean -o reports/allure-report
  //npx allure open reports/allure-report

  reporter: [
    ['list'],

    [
      'html',
      {
        outputFolder: 'reports',
        open: 'never',
      },
    ],

    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
      },],
  ],

  use: {
  baseURL: "https://fastener.jetrails.cloud/",
  headless: process.env.HEADLESS ? process.env.HEADLESS === 'true' : !!process.env.CI,
  viewport: { width: 1920, height: 1080 },
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 15000,       // add this
  navigationTimeout: 45000,   // add this
  launchOptions: {
    args: [] 
    },
},

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
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
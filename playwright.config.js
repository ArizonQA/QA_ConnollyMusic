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
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

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
  baseURL: "https://commerce-hub-ai.arizon.solutions/",
  headless: process.env.HEADLESS ? process.env.HEADLESS === 'true' : !!process.env.CI,
  viewport: { width: 1920, height: 1080 },
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 15000,       // add this
  navigationTimeout: 30000,   // add this
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
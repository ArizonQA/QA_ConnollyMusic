import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

test.describe('Login Tests', () => {

  test.beforeEach(async ({ page, logs }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    console.log("URL - " + page.url());
  });
  
  const filePath = path.resolve('testcase/Commerce_Hub_AI_Test_cases.xlsx');
  const sheetName = 'Login, ForgetPassword';

  function getCredentialFields(testData) {
    const email = testData?.Email ?? testData?.email;
    const password = testData?.Password ?? testData?.password;

    if (!email || !password) {
      throw new Error('Missing required Email/Password fields in Excel Test Data.');
    }

    return { email, password };
  }

  // ─── TC_LOGIN_02 ─────────────────────────────────────────────────────────────
  test('TC_LOGIN_02 - Verify successful login with valid registered email and correct password @critical',
  async ({ page, AllPageObjects, logs }) => {

    const tc = 'TC_LOGIN_02';
    const startTime = new Date();

    try {

      const data = ExcelUtils.getTestData(filePath, sheetName, tc);
      const { email, password } = getCredentialFields(data);

      await test.step('Enter valid email address', async () => {
        await AllPageObjects.login().emailInput.fill(email);
        await logs.info(`Filled email: ${email}`);
      });

      await test.step('Enter valid password', async () => {
        await AllPageObjects.login().passwordInput.fill(password);
      });

      await test.step('Click Sign In button', async () => {
        await AllPageObjects.login().signInButton.first().click();
        await logs.info('Clicked Sign In button');
      });

      await test.step('Verify redirect to storefront dashboard', async () => {
        await expect(page).not.toHaveURL(/\/login/);
        await expect(page.getByRole('heading').first()).toBeVisible();
        await logs.info(`Post-login URL: ${page.url()}`);
      });

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, tc, 'Pass', startTime, endTime,
        'User authenticated successfully and redirected to storefront dashboard.');
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, tc, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  // ─── TC_LOGIN_03 ─────────────────────────────────────────────────────────────
  test('TC_LOGIN_03 - Verify login fails with incorrect password @critical',
  async ({ page, AllPageObjects, logs }) => {

    const tc = 'TC_LOGIN_03';
    const startTime = new Date();

    try {

      const data = ExcelUtils.getTestData(filePath, sheetName, tc);
      const { email, password } = getCredentialFields(data);

      await test.step('Enter valid email address', async () => {
        await AllPageObjects.login().emailInput.fill(email);
        await logs.info(`Filled email: ${email}`);
      });

      await test.step('Enter incorrect password', async () => {
        await AllPageObjects.login().passwordInput.fill(password);
        await logs.info('Filled incorrect password');
      });

      await test.step('Click Sign In button', async () => {
        await AllPageObjects.login().signInButton.first().click();
        await logs.info('Clicked Sign In button');
      });

      await test.step('Verify error message is displayed and user remains on login page', async () => {
        await expect(page).toHaveURL(/\/login/);
        const errorMessage = page.getByText(/invalid credentials/i);
        await expect(errorMessage).toBeVisible();
        await logs.info('Error message displayed as expected');
      });

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, tc, 'Pass', startTime, endTime,
        'Login rejected with incorrect password; error message displayed.');
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, tc, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  // ─── TC_LOGIN_19 ─────────────────────────────────────────────────────────────
  test('TC_LOGIN_19 - Verify caseinsensitive email works as expected @regression',
  async ({ page, AllPageObjects, logs }) => {

    const tc = 'TC_LOGIN_19';
    const startTime = new Date();

    try {

      const data = ExcelUtils.getTestData(filePath, sheetName, tc);
      const { email, password } = getCredentialFields(data);

      await test.step('Enter uppercase email address', async () => {
        await AllPageObjects.login().emailInput.fill(email);
        await logs.info(`Filled uppercase email: ${email}`);
      });

      await test.step('Enter password from test data', async () => {
        await AllPageObjects.login().passwordInput.fill(password);
      });

      await test.step('Click Sign In button', async () => {
        await AllPageObjects.login().signInButton.first().click();
        await logs.info('Clicked Sign In button with uppercase email test data');
      });

      await test.step('Verify successful authentication and dashboard redirect', async () => {
        await expect(page).not.toHaveURL(/\/login/);
        await expect(page.getByRole('heading').first()).toBeVisible();
        await logs.info(`Post-login URL for ${tc}: ${page.url()}`);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, tc, 'Pass', startTime, endTime,
        'Uppercase email authentication succeeded and user was redirected to the merchant dashboard.');
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, tc, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

});
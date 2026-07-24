import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

const filePath = path.resolve(__dirname, '../testcase/Commerce_Hub_AI_Test_cases.xlsx');
const sheetName = 'Login and Store Sync';


// ---------------------------------------------------------
// Group 1: tests using the shared page/AllPageObjects fixture
// ---------------------------------------------------------
test.describe('Login Page - UI', () => {

test.beforeEach(async ({ page, logs }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    console.log("Url - " + page.url());
  });

  test('TC_LOGIN_01 - Verify login page loads with default Customer Login tab selected @regression',
    async ({ AllPageObjects, logs }) => {
      const startTime = new Date();
      try {
        const loginPage = AllPageObjects.login();

        await logs.info('Verify Customer Login tab and related login fields are visible by default');
        await expect(loginPage.customerLoginHeading).toBeVisible();
        await expect(loginPage.customerSubtitle).toBeVisible();
        await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'name@yourstore.com');
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.signInButton).toBeVisible();
        await expect(loginPage.signInWithStoreAccessButton).toBeVisible();
        await expect(loginPage.rememberMeCheckbox).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();

        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_01", "Pass", startTime, endTime,
          "Login page loaded with Customer Login tab selected and all expected controls visible.");
      } catch (error) {
        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_01", "Fail", startTime, endTime, "", error.message);
        throw error;
      }
    });

  test('TC_LOGIN_02 - Verify tab switch between Customer Login and Admin Login tabs @regression',
    async ({ AllPageObjects, logs }) => {
      const startTime = new Date();
      try {
        const loginPage = AllPageObjects.login();

        await logs.info('Switch to Admin Login tab');
        await loginPage.switchToAdminLogin();

        await expect(loginPage.adminLoginHeading).toBeVisible();
        await expect(loginPage.adminSubtitle).toBeVisible();
        await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'name@company.com');
        await expect(loginPage.signInButton).toBeVisible();

        await logs.info('Switch back to Customer Login tab');
        await loginPage.switchToCustomerLogin();

        await expect(loginPage.customerLoginHeading).toBeVisible();
        await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'name@yourstore.com');
        await expect(loginPage.signInWithStoreAccessButton).toBeVisible();

        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_02", "Pass", startTime, endTime,
          "Tab switching works correctly and returned to Customer Login with expected form elements.");
      } catch (error) {
        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_02", "Fail", startTime, endTime, "", error.message);
        throw error;
      }
    });

  // TC_LOGIN_03
  test('TC_LOGIN_03 - Verify password field masks input by default @regression',
    async ({ AllPageObjects, logs }) => {
      const startTime = new Date();
      try {
        const loginPage = AllPageObjects.login();
        const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGIN_03");
        const password = testData.split(':')[1].trim();

        await logs.info('Step 1: Navigate to CommerceHub AI site');
        await loginPage.goto();

        await logs.info('Step 2: Enter password from test data');
        await loginPage.passwordInput.fill(password);

        await logs.info('Step 3: Verify password input is masked by default');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_03", "Pass", startTime, endTime,
          "Password field is masked by default.");
      } catch (error) {
        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_03", "Fail", startTime, endTime, "", error.message);
        throw error;
      }
    });

  // TC_LOGIN_04
  test('TC_LOGIN_04 - Verify show/hide password (eye icon) toggle @regression',
    async ({ AllPageObjects, logs }) => {
      const startTime = new Date();
      try {
        const loginPage = AllPageObjects.login();
        const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGIN_04");
        const password = testData.split(':')[1].trim();

        await logs.info('Step 1: Navigate to CommerceHub AI site');
        await loginPage.goto();

        await logs.info('Step 2: Enter password in password field');
        await loginPage.passwordInput.fill(password);

        await logs.info('Step 3: Verify password input is masked by default');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

        await logs.info('Step 4: Click password visibility toggle button to reveal password');
        await loginPage.togglePasswordVisibility();

        await logs.info('Step 5: Verify password is revealed in plain text');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

        await logs.info('Step 6: Click password visibility toggle button again to mask password');
        await loginPage.togglePasswordVisibility();

        await logs.info('Step 7: Verify password is re-masked');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_04", "Pass", startTime, endTime,
          "First click reveals password in plain text, second click re-masks it.");
      } catch (error) {
        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_04", "Fail", startTime, endTime, "", error.message);
        throw error;
      }
    });

});
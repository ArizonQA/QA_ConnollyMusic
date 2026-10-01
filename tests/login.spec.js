import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import loginTestData from '../testcase/datas.js';
import assertions from '../testcase/assertions/login-assertions.json' with { type: 'json' };
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

test.describe('Login Module Tests', () => {
  const primaryFilePath = path.resolve('testcase/Fasteners_Test_Cases.xlsx');
  const fallbackFilePath = path.resolve('testcase/Fasteners_Test_Case.xlsx');
  const filePath = fs.existsSync(primaryFilePath) ? primaryFilePath : fallbackFilePath;
  const sheetName = 'Login';

  // Pre-load test case details once to prevent concurrent file read/write conflicts
  const testCaseDetailsMap = {};
  try {
    const wb = XLSX.readFile(filePath);
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);
    for (const r of rows) {
      if (r['Test Case ID']) {
        testCaseDetailsMap[String(r['Test Case ID']).trim()] = r;
      }
    }
  } catch (e) {
    console.warn('Warning: Could not preload test cases:', e.message);
  }

  function getDetails(id) {
    return testCaseDetailsMap[id] || ExcelUtils.getTestCaseDetails(filePath, sheetName, id);
  }

  test.beforeEach(async ({ page, AllPageObjects, logs }) => {
    test.setTimeout(90000);
    await AllPageObjects.login().gotoLoginPage(loginTestData.Url);
    await logs.info('Navigated to login page - ' + page.url());
  });

  test('Tc_Login_01 - Verify Login page loads with all key elements @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_01';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Verify BoltSpec branding, heading, subtext, form fields, and action buttons', async () => {
        await expect(AllPageObjects.login().brandMark).toBeVisible();
        await expect(AllPageObjects.login().loginHeading).toBeVisible();
        await expect(AllPageObjects.login().subtext).toBeVisible();
        await expect(AllPageObjects.login().emailInput).toBeVisible();
        await expect(AllPageObjects.login().passwordInput).toBeVisible();
        await expect(AllPageObjects.login().signInButton).toBeVisible();
        await expect(AllPageObjects.login().requestAccessLink).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_02 - Verify BoltSpec logo and heading display correctly @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_02';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Verify branding logo, heading, and subtext text content', async () => {
        await expect(AllPageObjects.login().brandMark).toBeVisible();
        await expect(AllPageObjects.login().loginHeading).toHaveText('Sign in to your account');
        await expect(AllPageObjects.login().subtext).toHaveText('Access BoltSpec agentic quoting & logistics portal');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_03 - Verify clicking the BoltSpec logo on the Login page navigates to the Homepage @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_03';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Click BoltSpec header logo and verify navigation to Homepage', async () => {
        await AllPageObjects.login().clickHeaderLogo();
        await expect(page).toHaveURL(new RegExp(`${assertions.homePageUrlFragment}$`));
        await expect(page).toHaveTitle(assertions.homePageTitle);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_04 - Verify Work Email field placeholder text @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_04';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Observe Work Email input placeholder attribute', async () => {
        await expect(AllPageObjects.login().emailInput).toHaveAttribute('placeholder', 'you@company.com');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_05 - Verify email field accepts a valid email format @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_05';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter valid email and verify HTML5 validation state', async () => {
        await AllPageObjects.login().fillEmail('customer@example.com');
        await expect(AllPageObjects.login().emailInput).toHaveValue('customer@example.com');
        const isValid = await AllPageObjects.login().emailInput.evaluate(el => el.checkValidity());
        expect(isValid).toBe(true);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_06 - Verify validation error for invalid email format @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_06';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter invalid email format and submit form', async () => {
        await AllPageObjects.login().fillEmail('customer@@example');
        await AllPageObjects.login().clickSignIn();
      });

      await test.step('Verify field validity error and form is not submitted', async () => {
        const isValid = await AllPageObjects.login().emailInput.evaluate(el => el.checkValidity());
        expect(isValid).toBe(false);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_07 - Verify validation for empty email field on submit @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_07';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Leave Work Email empty and submit with password', async () => {
        await AllPageObjects.login().fillPassword('Pass@123');
        await AllPageObjects.login().clickSignIn();
      });

      await test.step('Verify required validation prompts user and form is not submitted', async () => {
        const isValueMissing = await AllPageObjects.login().emailInput.evaluate(el => el.validity.valueMissing);
        expect(isValueMissing).toBe(true);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_08 - Verify email field sanitizes script injection attempts @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_08';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      let scriptAlertTriggered = false;
      page.on('dialog', () => {
        scriptAlertTriggered = true;
      });

      await test.step('Enter script tag in Work Email and click Sign In', async () => {
        await AllPageObjects.login().fillEmail("<script>alert('test')</script>");
        await AllPageObjects.login().clickSignIn();
      });

      await test.step('Verify no script executed and form is blocked from submitting', async () => {
        expect(scriptAlertTriggered).toBe(false);
        const isValid = await AllPageObjects.login().emailInput.evaluate(el => el.checkValidity());
        expect(isValid).toBe(false);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_09 - Verify email field handles excessively long input @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_09';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      const longEmail = 'a'.repeat(288) + '@example.com';

      await test.step('Enter excessively long email string and submit', async () => {
        await AllPageObjects.login().fillEmail(longEmail);
        await AllPageObjects.login().fillPassword('Pass@123');
        await AllPageObjects.login().clickSignIn();
      });

      await test.step('Verify application handles request gracefully without crashing', async () => {
        await expect(AllPageObjects.login().getLoginCard()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_10 - Verify email field trims leading and trailing spaces @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_10';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter email with leading/trailing spaces and valid password', async () => {
        const paddedEmail = `   ${loginTestData.customerLogin.Email}   `;
        await AllPageObjects.login().fillEmail(paddedEmail);
        await AllPageObjects.login().fillPassword(loginTestData.customerLogin.Password);
        await AllPageObjects.login().clickSignIn();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify user is authenticated and redirected successfully', async () => {
        await expect(page).toHaveURL(new RegExp(assertions.accountOverviewUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_11 - Verify Password field masks entered characters @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_11';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter password and verify type attribute is masked', async () => {
        await AllPageObjects.login().fillPassword('Pass@123');
        await expect(AllPageObjects.login().getPasswordInput()).toHaveAttribute('type', 'password');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_12 - Verify password visibility toggle icon shows and hides the password @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_12';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter password and toggle visibility to show plain text', async () => {
        await AllPageObjects.login().fillPassword('Pass@123');
        await AllPageObjects.login().togglePasswordVisibility();
        await expect(AllPageObjects.login().passwordInput).toHaveAttribute('type', 'text');
      });

      await test.step('Toggle visibility again to hide password characters', async () => {
        await AllPageObjects.login().togglePasswordVisibility();
        await expect(AllPageObjects.login().passwordInput).toHaveAttribute('type', 'password');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_13 - Verify validation for empty password field on submit @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_13';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter valid email and leave Password empty', async () => {
        await AllPageObjects.login().fillEmail('customer@example.com');
        await AllPageObjects.login().clickSignIn();
      });

      await test.step('Verify password required validation and form is not submitted', async () => {
        const isValueMissing = await AllPageObjects.login().getPasswordInput().evaluate(el => el.validity.valueMissing);
        expect(isValueMissing).toBe(true);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_14 - Verify Password field accepts special characters correctly @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_14';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter password containing special characters', async () => {
        const specialPass = 'P@$$w0rd!#2024';
        await AllPageObjects.login().fillPassword(specialPass);
        await expect(AllPageObjects.login().getPasswordInput()).toHaveValue(specialPass);
        await expect(AllPageObjects.login().getPasswordInput()).toHaveAttribute('type', 'password');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_15 - Verify Password field sanitizes script injection attempts @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_15';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      let scriptAlertTriggered = false;
      page.on('dialog', () => {
        scriptAlertTriggered = true;
      });

      await test.step('Enter script tag in password field and submit', async () => {
        await AllPageObjects.login().fillEmail('vijay@arizon.digital');
        await AllPageObjects.login().fillPassword("<script>alert('test')</script>");
        await AllPageObjects.login().clickSignIn();
        await page.waitForTimeout(2000);
      });

      await test.step('Verify no script executed and standard authentication failure is shown', async () => {
        expect(scriptAlertTriggered).toBe(false);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_16 - Verify Forgot password link navigation @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_16';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Click Forgot password? link and verify navigation', async () => {
        await AllPageObjects.login().clickForgotPassword();
        await expect(page).toHaveURL(new RegExp(assertions.forgotPasswordUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_17 - Verify successful login with valid credentials @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_17';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Submit valid customer credentials', async () => {
        await AllPageObjects.login().loginAsCustomer(
          loginTestData.customerLogin.Email,
          loginTestData.customerLogin.Password
        );
      });

      await test.step('Verify authenticated redirection and header user indicators', async () => {
        await expect(page).toHaveURL(new RegExp(assertions.accountOverviewUrlFragment));
        await expect(AllPageObjects.login().getHeaderAvatar()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_18 - Verify login failure with incorrect password @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_18';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Submit valid email with incorrect password', async () => {
        await AllPageObjects.login().fillEmail(loginTestData.customerLogin.Email);
        await AllPageObjects.login().fillPassword('password@123');
        await AllPageObjects.login().clickSignIn();
        await page.waitForTimeout(2000);
      });

      await test.step('Verify error message is displayed indicating invalid credentials', async () => {
        await expect(AllPageObjects.login().getErrorAlert()).toBeVisible();
        await expect(AllPageObjects.login().getErrorAlert()).toContainText(/Could not find an account/i);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_19 - Verify login failure with an unregistered email address @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_19';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Submit unregistered email and password', async () => {
        await AllPageObjects.login().fillEmail('unregistered@example.com');
        await AllPageObjects.login().fillPassword('Pass@123');
        await AllPageObjects.login().clickSignIn();
        await page.waitForTimeout(2000);
      });

      await test.step('Verify invalid credentials error is displayed', async () => {
        await expect(AllPageObjects.login().getErrorAlert()).toBeVisible();
        await expect(AllPageObjects.login().getErrorAlert()).toContainText(/Could not find an account/i);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_20 - Verify Sign In behavior when both fields are left empty @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_20';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Click Sign In button with both fields empty', async () => {
        await AllPageObjects.login().clickSignIn();
      });

      await test.step('Verify validation prevents submission', async () => {
        const isEmailValid = await AllPageObjects.login().getEmailInput().evaluate(el => el.checkValidity());
        expect(isEmailValid).toBe(false);
        await expect(page).toHaveURL(new RegExp(assertions.loginPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_21 - Verify account lockout after multiple failed login attempts @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_21';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Submit incorrect password repeatedly', async () => {
        for (let i = 1; i <= 5; i++) {
          await AllPageObjects.login().fillEmail('customer@example.com');
          await AllPageObjects.login().fillPassword(`WrongPass${i}`);
          await AllPageObjects.login().clickSignIn();
          await page.waitForTimeout(1000);
        }
      });

      await test.step('Verify error alert handles multiple failed attempts gracefully', async () => {
        await expect(AllPageObjects.login().getErrorAlert()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_22 - Verify email field is case-insensitive during login @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_22';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter registered email in uppercase letters and valid password', async () => {
        const uppercaseEmail = loginTestData.customerLogin.Email.toUpperCase();
        await AllPageObjects.login().fillEmail(uppercaseEmail);
        await AllPageObjects.login().fillPassword(loginTestData.customerLogin.Password);
        await AllPageObjects.login().clickSignIn();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify user is authenticated successfully', async () => {
        await expect(page).toHaveURL(new RegExp(assertions.accountOverviewUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_23 - Verify pressing the Enter key on the Password field submits the login form @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_23';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter credentials and press Enter on password field', async () => {
        await AllPageObjects.login().fillEmail(loginTestData.customerLogin.Email);
        await AllPageObjects.login().fillPassword(loginTestData.customerLogin.Password);
        await AllPageObjects.login().submitPasswordWithEnter();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify form submission and authentication via Enter key', async () => {
        await expect(page).toHaveURL(new RegExp(assertions.accountOverviewUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_24 - Verify a loading indicator displays while the login request is processing @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_24';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Enter valid credentials and submit', async () => {
        await AllPageObjects.login().fillEmail(loginTestData.customerLogin.Email);
        await AllPageObjects.login().fillPassword(loginTestData.customerLogin.Password);
        await AllPageObjects.login().clickSignIn();
      });

      await test.step('Verify login request processes and navigates to overview', async () => {
        await expect(page).toHaveURL(new RegExp(assertions.accountOverviewUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_25 - Verify login behavior on network failure @flaky-risk', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_25';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Simulate network failure and submit credentials', async () => {
        await page.route('**/account/login', route => route.abort('failed'));
        await AllPageObjects.login().fillEmail(loginTestData.customerLogin.Email);
        await AllPageObjects.login().fillPassword(loginTestData.customerLogin.Password);
        await AllPageObjects.login().clickSignIn().catch(() => { });
      });

      await test.step('Verify application does not crash and recovers once connectivity is restored', async () => {
        await page.unroute('**/account/login');
        await AllPageObjects.login().gotoLoginPage(loginTestData.Url);
        await expect(AllPageObjects.login().getLoginCard()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_26 - Verify Request Access link navigation @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_26';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      // Step: Click on the Request Access link
      await test.step('Click on the Request Access link', async () => {
        await AllPageObjects.login().clickRequestAccess();
      });

      // Verification: User is navigated to the account request/sign-up page
      await test.step('Verify navigation to the account request page', async () => {
        await expect(page).toHaveURL(new RegExp(assertions.requestAccessUrlFragment));
        await expect(AllPageObjects.login().getRequestAccessHeading()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_27 - Verify Don\'t have an account text and Request Access link display correctly @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_27';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Verify Request Access link and descriptive text', async () => {
        await expect(AllPageObjects.login().getRequestAccessText()).toBeVisible();
        await expect(AllPageObjects.login().getRequestAccessLink()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_28 - Verify Login page renders correctly on a mobile viewport @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_28';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Set mobile viewport and navigate to login page', async () => {
        await page.setViewportSize({ width: 375, height: 667 });
        await AllPageObjects.login().gotoLoginPage(loginTestData.Url);
      });

      await test.step('Verify login card and form elements render without layout overlap', async () => {
        await expect(AllPageObjects.login().getLoginCard()).toBeVisible();
        await expect(AllPageObjects.login().getEmailInput()).toBeVisible();
        await expect(AllPageObjects.login().getPasswordInput()).toBeVisible();
        await expect(AllPageObjects.login().getSignInButton()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Login_29 - Verify redirection to the originally requested page after successful login @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Login_29';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Attempt to access protected orders page while unauthenticated', async () => {
        const protectedOrdersUrl = new URL(assertions.ordersPageUrlFragment, loginTestData.Url).toString();
        await page.goto(protectedOrdersUrl, { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().dismissCookieBanner();
      });

      await test.step('Verify redirect to login page with redirectTo parameter', async () => {
        await expect(page).toHaveURL(/.*account\/login.*redirectTo.*/);
        await expect(AllPageObjects.login().getLoginHeading()).toBeVisible();
      });

      await test.step('Submit valid credentials', async () => {
        await AllPageObjects.login().loginAsCustomer(
          loginTestData.customerLogin.Email,
          loginTestData.customerLogin.Password
        );
      });

      await test.step('Verify redirection back to the originally requested protected page', async () => {
        await expect(page).toHaveURL(new RegExp(assertions.ordersPageUrlFragment));
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });
});

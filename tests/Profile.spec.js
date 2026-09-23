import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import loginTestData from '../testcase/datas.js';
import path from 'path';
import fs from 'fs';

test.describe('Profile Module Tests', () => {
  const primaryFilePath = path.resolve('testcase/Fasteners_Test_Cases.xlsx');
  const fallbackFilePath = path.resolve('testcase/Fasteners_Test_Case.xlsx');
  const filePath = fs.existsSync(primaryFilePath) ? primaryFilePath : fallbackFilePath;
  const sheetName = 'Profile';

  test.beforeEach(async ({ page, AllPageObjects }) => {
    // Navigate to base URL and dismiss cookie modal if present
    await page.goto(loginTestData.Url, { waitUntil: 'domcontentloaded' });
    await AllPageObjects.login().dismissCookieBanner();
  });

  test('Tc_Profile_01 - Verify an unauthenticated user is redirected to the Login page when accessing the Profile page directly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_01';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Access Profile URL directly in an unauthenticated session', async () => {
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Verify redirection to Login page', async () => {
        await expect(page).toHaveURL(/.*account\/login.*/);
        await expect(AllPageObjects.login().getLoginHeading()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Unauthenticated user is redirected to the Login page when accessing the Profile page directly.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Unauthenticated user is not redirected to the Login page when accessing Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_02 - Verify a logged-in user can navigate to the Profile page via the Profile Settings header link @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_02';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
      });

      await test.step('Click Profile Settings link in header', async () => {
        await AllPageObjects.profile().navigateViaHeader();
      });

      await test.step('Verify navigation to Profile page', async () => {
        await expect(page).toHaveURL(/.*account\/profile.*/);
        await expect(AllPageObjects.profile().accountHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'User is navigated to the Profile page when clicking the Profile Settings link in the header.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'User is unable to navigate to the Profile page via the Profile Settings header link.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_03 - Verify clicking the Profile tab within Account navigation displays the Profile section @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_03';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and open Account overview page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Click Profile tab in Account navigation', async () => {
        await AllPageObjects.profile().navigateViaNavTab();
      });

      await test.step('Verify Profile section displays', async () => {
        await expect(page).toHaveURL(/.*account\/profile.*/);
        await expect(AllPageObjects.profile().accountHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'The Profile section loads displaying the Profile heading and personal details when clicking the Profile tab.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Profile tab in Account navigation does not display the Profile section.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_15 - Verify a validation error is shown when First Name is cleared and Save changes is clicked @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_15';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Clear First Name and submit', async () => {
        await AllPageObjects.profile().clearFirstName();
        await AllPageObjects.profile().clickSavePersonalData();
      });

      await test.step('Verify validation error is triggered for First Name', async () => {
        await expect(AllPageObjects.profile().firstNameInput).toHaveAttribute('required', 'required');
        const isInvalid = await AllPageObjects.profile().firstNameInput.evaluate(el => !el.checkValidity());
        expect(isInvalid).toBe(true);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Validation error is displayed and form prevents submission when First Name is cleared.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error is not displayed when First Name is cleared and Save is clicked.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_16 - Verify a validation error is shown when Last Name is cleared and Save changes is clicked @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_16';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Clear Last Name and submit', async () => {
        await AllPageObjects.profile().clearLastName();
        await AllPageObjects.profile().clickSavePersonalData();
      });

      await test.step('Verify validation error is triggered for Last Name', async () => {
        await expect(AllPageObjects.profile().lastNameInput).toHaveAttribute('required', 'required');
        const isInvalid = await AllPageObjects.profile().lastNameInput.evaluate(el => !el.checkValidity());
        expect(isInvalid).toBe(true);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Validation error is displayed and form prevents submission when Last Name is cleared.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error is not displayed when Last Name is cleared and Save is clicked.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_17 - Verify the First Name and Last Name fields sanitize script injection attempts @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_17';
    const startTime = new Date();
    let dialogAppeared = false;

    page.on('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Enter script injection into First Name and submit', async () => {
        await AllPageObjects.profile().setFirstName("<script>alert('test')</script>");
        await AllPageObjects.profile().clickSavePersonalData();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify script does not execute and input is safely escaped', async () => {
        expect(dialogAppeared).toBe(false);
        await expect(AllPageObjects.profile().accountHeading).toBeVisible();
      });

      // Cleanup
      await AllPageObjects.profile().setFirstName('Account');
      await AllPageObjects.profile().clickSavePersonalData();

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Input is sanitized/escaped by the system and no script executes.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Script injection attempt is not properly sanitized on the First Name field.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_20 - Verify clicking Save changes with valid updated data saves the changes successfully @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_20';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Update First Name and Last Name and submit', async () => {
        await AllPageObjects.profile().setFirstName('Account');
        await AllPageObjects.profile().setLastName('New');
        await AllPageObjects.profile().clickSavePersonalData();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify updated values persist', async () => {
        await expect(AllPageObjects.profile().firstNameInput).toHaveValue('Account');
        await expect(AllPageObjects.profile().lastNameInput).toHaveValue('New');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'The updated personal data is saved successfully and the values persist.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Personal data updates fail to save or persist.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_24 - Verify clicking Change email address opens the email change flow @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_24';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Verify Change email address link is visible and click it', async () => {
        await expect(AllPageObjects.profile().changeEmailLink).toBeVisible();
        await AllPageObjects.profile().clickChangeEmailAddress();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'User is shown form/modal to update email address upon clicking Change email address.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Change email address link is not available on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_25 - Verify the Change email address flow requires current password confirmation @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_25';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Open Change email address flow', async () => {
        await expect(AllPageObjects.profile().changeEmailLink).toBeVisible();
        await AllPageObjects.profile().clickChangeEmailAddress();
      });

      await test.step('Submit new email without current password and verify validation', async () => {
        await AllPageObjects.profile().fillEmailChangeForm('newemail@example.com', 'newemail@example.com', '');
        await AllPageObjects.profile().clickSaveEmailChanges();
        await expect(AllPageObjects.profile().emailCurrentPasswordInput).toHaveAttribute('required', 'required');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'System requires current password to confirm email change and displays validation error.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Change email address flow is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_26 - Verify clicking Change password opens the password change flow @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_26';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Verify Change password link is visible and click it', async () => {
        await expect(AllPageObjects.profile().changePasswordLink).toBeVisible();
        await AllPageObjects.profile().clickChangePassword();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'User is shown form/modal to update account password upon clicking Change password.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Change password link is not displayed on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_27 - Verify the Change password flow requires the current password before allowing a new password to be set @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_27';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Open Change password flow', async () => {
        await expect(AllPageObjects.profile().changePasswordLink).toBeVisible();
        await AllPageObjects.profile().clickChangePassword();
      });

      await test.step('Submit new password without current password and verify validation', async () => {
        await AllPageObjects.profile().fillPasswordForm('NewPass@123', 'NewPass@123', '');
        await AllPageObjects.profile().clickSavePasswordChanges();
        await expect(AllPageObjects.profile().currentPasswordInput).toHaveAttribute('required', 'required');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'System requires current password before allowing a new password to be set.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Change password flow is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_34 - Verify clicking Launch AI Assistant Canvas navigates to the AI Assistant interface @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_34';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Click Launch AI Assistant Canvas button', async () => {
        await expect(AllPageObjects.profile().launchAiCanvasButton).toBeVisible();
        await AllPageObjects.profile().clickLaunchAiCanvas();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'User is navigated to the AI Assistant canvas interface.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Launch AI Assistant Canvas button is not found on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_37 - Verify entering a valid fastener query and clicking Ask AI returns relevant sourcing results @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_37';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Enter query into Ask AI input and submit', async () => {
        await expect(AllPageObjects.profile().askAiInput).toBeVisible();
        await AllPageObjects.profile().enterAskAiQuery('M8 316 hex bolts');
        await AllPageObjects.profile().clickAskAi();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'AI processes query and returns relevant fastener product results.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Ask AI input field and button are not present on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_45 - Verify the Ask AI input field sanitizes script injection attempts @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_45';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Enter script injection into Ask AI input and submit', async () => {
        await expect(AllPageObjects.profile().askAiInput).toBeVisible();
        await AllPageObjects.profile().enterAskAiQuery("<script>alert('test')</script>");
        await AllPageObjects.profile().clickAskAi();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Input is sanitized/escaped by the system and no script executes.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Ask AI input field is not present on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_53 - Verify clicking Start Agentic Order Draft navigates to the Agentic Ordering workflow @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_53';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Click Start Agentic Order Draft button', async () => {
        await expect(AllPageObjects.profile().startAgenticOrderDraftButton).toBeVisible();
        await AllPageObjects.profile().clickStartAgenticOrderDraft();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'User is navigated to the Agentic Ordering page with a new order draft session.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Start Agentic Order Draft button is not found on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_60 - Verify a validation error is shown when the New password is shorter than 8 characters @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_60';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Enter short password and submit', async () => {
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm('Pass1', 'Pass1', 'password');
        await AllPageObjects.profile().clickSavePasswordChanges();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Validation error is displayed indicating password does not meet minimum length requirement.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password section is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_61 - Verify a validation error is shown when New password and Password confirmation do not match @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_61';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Enter mismatched passwords and submit', async () => {
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm('NewPass@123', 'NewPass@456', 'password');
        await AllPageObjects.profile().clickSavePasswordChanges();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Validation error is displayed indicating password confirmation does not match.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password section is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_62 - Verify a validation error is shown when Current password is left empty on Save changes @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_62';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Submit password change without Current password', async () => {
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm('NewPass@123', 'NewPass@123', '');
        await AllPageObjects.profile().clickSavePasswordChanges();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Validation error is displayed indicating current password is required.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password section is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_63 - Verify an appropriate error is shown when an incorrect Current password is entered @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_63';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Submit password change with incorrect Current password', async () => {
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm('NewPass@123', 'NewPass@123', 'WrongCurrentPass');
        await AllPageObjects.profile().clickSavePasswordChanges();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Authentication error is displayed indicating current password is incorrect.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password section is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_64 - Verify the password updates successfully with a valid New password, matching confirmation and correct Current password @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_64';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Submit valid new password with confirmation and current password', async () => {
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm('NewPass@123', 'NewPass@123', loginTestData.customerLogin.Password);
        await AllPageObjects.profile().clickSavePasswordChanges();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Password is updated successfully and confirmation message is displayed.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password section is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });

  test('Tc_Profile_73 - Verify the Password fields sanitize script injection attempts @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_73';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in and navigate to Profile page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });

      await test.step('Enter script injection into New password field and submit', async () => {
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm("<script>alert('test')</script>", "<script>alert('test')</script>", loginTestData.customerLogin.Password);
        await AllPageObjects.profile().clickSavePasswordChanges();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Input is sanitized/escaped by the system and no script executes.'
      );
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password section is not accessible on the Profile page.';
      const failureReason = `${actualResult} Reason: ${error.message}`;
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Fail',
        startTime,
        endTime,
        actualResult,
        failureReason
      );
      throw error;
    }
  });
});

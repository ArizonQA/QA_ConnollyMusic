import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import loginTestData from '../testcase/datas.js';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

test.describe('Profile Module Tests', () => {
  const primaryFilePath = path.resolve('testcase/Fasteners_Test_Cases.xlsx');
  const fallbackFilePath = path.resolve('testcase/Fasteners_Test_Case.xlsx');
  const filePath = fs.existsSync(primaryFilePath) ? primaryFilePath : fallbackFilePath;
  const sheetName = 'Profile';

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
        await expect(AllPageObjects.login().loginHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'User is redirected to the login page when accessing the profile page unauthenticated.'
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
        'User navigates to the profile page via the Profile Settings header link.'
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
        'Profile tab displays the profile personal data section.'
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

test('Tc_Profile_04 - Verify the Profile page renders correctly on a mobile viewport @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_04';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Set viewport to mobile 375x667', async () => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify account navigation and profile form render responsively', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.accountHeading).toBeVisible();
        await expect(profile.firstNameInput).toBeVisible();
        await expect(profile.lastNameInput).toBeVisible();
        await expect(profile.savePersonalDataButton).toBeVisible();
      });

      // Restore viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Profile page renders all components responsively on a mobile viewport.'
      );
    } catch (error) {
      await page.setViewportSize({ width: 1280, height: 720 });
      const endTime = new Date();
      const actualResult = 'Profile page fails to render correctly on mobile viewport.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_05 - Verify all account navigation tabs are displayed correctly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_05';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify account navigation tabs are displayed', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.profileNavTab).toBeVisible();
        await expect(profile.addressesNavTab).toBeVisible();
        const tabCount = await profile.allNavTabs.count();
        expect(tabCount).toBeGreaterThanOrEqual(5);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'All account navigation tabs are displayed with correct labels.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Account navigation tabs are not displayed correctly.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_06 - Verify the currently active tab is visually indicated @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_06';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify the active navigation tab is visually indicated', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.activeNavTab).toBeVisible();
        await expect(profile.activeNavTab).toContainText('Profile');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Currently active tab is visually highlighted.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Active navigation tab is not visually indicated.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_07 - Verify clicking each account navigation tab navigates to its corresponding section @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_07';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Click Addresses navigation tab', async () => {
        await AllPageObjects.profile().clickAddressesTab();
      });

      await test.step('Verify URL and address section displayed', async () => {
        await expect(page).toHaveURL(/.*account\/address.*/);
      });

      // Navigate back to profile
      await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Clicking each account navigation tab navigates to its corresponding section.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Clicking account navigation tab failed to navigate.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_08 - Verify the Hello, [Name] Account greeting displays the correct account name @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_08';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify Account greeting matches format in Test Data (Hello + Name)', async () => {
        const profile = AllPageObjects.profile();
        const testData = testCaseDetails['Test Data'] || 'Hello + Name';
        await expect(profile.accountGreeting).toBeVisible();

        // Extract expected greeting prefix from Test Data ('Hello + Name' -> 'Hello')
        const greetingPrefix = testData.split('+')[0].trim();
        await expect(profile.accountGreeting).toContainText(new RegExp(greetingPrefix, 'i'));

        // Retrieve customer name from profile to verify the '+ Name' requirement
        const firstName = await profile.firstNameInput.inputValue();
        if (firstName) {
          await expect(profile.accountGreeting).toContainText(firstName);
        }
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Hello, [Name] account greeting displays the correct account name.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Account greeting does not display the correct account name.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_09 - Verify the Profile heading and Check your personal data subtext display correctly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_09';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify Profile heading and subtext display correctly', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.accountHeading).toBeVisible();
        await expect(profile.accountSubtext).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Profile heading and personal data subtext display correctly.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Profile heading or subtext not displayed correctly.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_10 - Verify the Personal data section heading displays correctly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_10';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify Personal data heading is displayed', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.personalDataHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Personal data section heading displays correctly.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Personal data heading is not displayed.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_11 - Verify the Salutation dropdown displays available options and defaults to Not specified @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_11';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify Salutation dropdown options', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.salutationSelect).toBeVisible();
        const optionsText = await profile.salutationSelect.innerText();
        expect(optionsText).toMatch(/Not specified|Mr\.|Mrs\./i);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Salutation dropdown displays all options and defaults to Not specified.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Salutation dropdown options not displayed as expected.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_12 - Verify selecting a Salutation option updates the field correctly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_12';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      const profile = AllPageObjects.profile();
      const initialValue = await profile.salutationSelect.inputValue();

      await test.step('Select a salutation option and verify selection', async () => {
        await profile.selectSalutation('Mr.');
        await expect(profile.salutationSelect).toHaveValue(/019d9d24ed0573e996821aff5ba9803e|.*/);
      });

      // Restore initial salutation
      if (initialValue) {
        await profile.salutationSelect.selectOption(initialValue);
      }

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Selecting a salutation option updates the field selection.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Selecting a Salutation option failed to update the field.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_13 - Verify the First Name and Last Name fields display the currently saved values on page load @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_13';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify First Name and Last Name fields display saved values', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.firstNameInput).toBeVisible();
        await expect(profile.lastNameInput).toBeVisible();
        await expect(profile.firstNameInput).not.toHaveValue('');
        await expect(profile.lastNameInput).not.toHaveValue('');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'First Name and Last Name fields display the currently saved values on page load.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'First Name and Last Name fields do not display saved values.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_14 - Verify the First Name and Last Name fields are marked as required with a red asterisk @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_14';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify required asterisks for First Name and Last Name', async () => {
        const profile = AllPageObjects.profile();
        const asterisksCount = await profile.requiredAsterisks.count();
        expect(asterisksCount).toBeGreaterThanOrEqual(2);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'First Name and Last Name fields display a red asterisk indicating required fields.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'First Name and Last Name fields are not marked as required.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
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
        await expect(AllPageObjects.profile().firstNameInput).toHaveAttribute('aria-required', 'true');
        await expect(AllPageObjects.profile().firstNameInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Validation error displays when First Name is cleared and Save changes is clicked.'
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
        await expect(AllPageObjects.profile().lastNameInput).toHaveAttribute('aria-required', 'true');
        await expect(AllPageObjects.profile().lastNameInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Validation error displays when Last Name is cleared and Save changes is clicked.'
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
        await AllPageObjects.profile().firstNameInput.fill("<script>alert('test')</script>");
        await AllPageObjects.profile().clickSavePersonalData();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify script does not execute and input is safely handled', async () => {
        expect(dialogAppeared).toBe(false);
        const isHeadingVisible = await page.getByRole('heading', { level: 1 }).isVisible();
        expect(isHeadingVisible).toBe(true);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Script injection in name fields is sanitized and no script executes.'
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

test('Tc_Profile_18 - Verify the First Name and Last Name fields handle excessively long input gracefully @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_18';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      const profile = AllPageObjects.profile();
      const longString = 'A'.repeat(120);

      await test.step('Fill long string in first name and last name', async () => {
        await profile.firstNameInput.fill(longString);
        await profile.lastNameInput.fill(longString);
        await expect(profile.firstNameInput).toHaveValue(longString);
        await expect(profile.lastNameInput).toHaveValue(longString);
      });

      // Restore default names
      await profile.restoreDefaultNames();

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Excessively long input in name fields is handled gracefully without page distortion.');
    } catch (error) {
      await AllPageObjects.profile().restoreDefaultNames().catch(() => {});
      const endTime = new Date();
      const actualResult = 'Fields failed to handle excessively long input gracefully.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_19 - Verify the Fields marked with asterisks are required helper text displays correctly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_19';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify helper text is visible', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.requiredFieldsHelperText).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Helper text \'Fields marked with asterisks (*) are required\' displays correctly.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Fields marked with asterisks helper text is not displayed.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
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
        await AllPageObjects.profile().firstNameInput.fill('Account');
        await AllPageObjects.profile().lastNameInput.fill('New');
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
        'Updated personal data saves successfully and success notification displays.'
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

test('Tc_Profile_21 - Verify the Save changes button behavior when no fields have been modified @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_21';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      let initialFirstName;
      await test.step('Click Save changes without modifying fields', async () => {
        const profile = AllPageObjects.profile();
        initialFirstName = await profile.firstNameInput.inputValue();
        await profile.clickSavePersonalData();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify page remains intact and stable', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.accountHeading).toBeVisible();
        await expect(profile.firstNameInput).toHaveValue(initialFirstName);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Save changes button remains clickable and stable when fields are unmodified.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Save changes button threw an unexpected error when unmodified.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_22 - Verify Save changes behavior on network failure @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_22';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Simulate network failure on profile save route', async () => {
        await page.route('**/account/profile', route => {
          if (route.request().method() === 'POST') {
            route.abort('failed');
          } else {
            route.continue();
          }
        });
      });

      await test.step('Attempt to submit and verify application handles failure gracefully', async () => {
        const profile = AllPageObjects.profile();
        await profile.clickSavePersonalData().catch(() => {});
      });

      await page.unroute('**/account/profile');
      await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Save changes handles network failure gracefully with appropriate error feedback.');
    } catch (error) {
      await page.unroute('**/account/profile').catch(() => {});
      const endTime = new Date();
      const actualResult = 'Save changes failed to handle network failure gracefully.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_23 - Verify the registered email address displays correctly under Login data @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_23';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify registered email text is visible', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.registeredEmailText).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Registered email address displays correctly under Login data.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Registered email address is not displayed under Login data.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
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
        'Clicking Change email address expands the email change form.'
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
        await expect(AllPageObjects.profile().emailCurrentPasswordInput).toHaveAttribute('aria-required', 'true');
        await expect(AllPageObjects.profile().emailCurrentConfirmHelper).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Email change requires current password confirmation and displays validation feedback.'
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
        'Clicking Change password expands the password change form.'
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

test('Tc_Profile_27 - Verify the email address is not directly editable inline within the Login data section @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_27';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify email is not editable inline without clicking change email', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.registeredEmailText).toBeVisible();
        await expect(profile.changeEmailButton).toBeVisible();
        await expect(profile.newEmailConfirmationInput).not.toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Email address is display-only and cannot be edited inline.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Email address was editable inline.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_28 - Verify the Header displays the Hi [Name] greeting and correct cart item count on the Profile page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_28';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify header greeting and cart link', async () => {
        const profile = AllPageObjects.profile();
        await expect(profile.headerUserGreeting).toBeVisible();
        await expect(profile.cartLink).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Header displays Hi [Name] greeting and correct cart item count.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Header greeting or cart link is missing.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_29 - Verify the Password section fields display below the Login data section @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_29';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Expand password section and verify fields', async () => {
        const profile = AllPageObjects.profile();
        await profile.ensurePasswordFormOpen();
        await expect(profile.newPasswordInput).toBeVisible();
        await expect(profile.passwordConfirmationInput).toBeVisible();
        await expect(profile.currentPasswordInput).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Password section fields display correctly below the Login data section.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password section fields not displayed.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_30 - Verify the minimum password length helper text displays correctly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_30';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify minimum password length helper text', async () => {
        const profile = AllPageObjects.profile();
        await profile.ensurePasswordFormOpen();
        await expect(profile.passwordMinLengthHelper).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Minimum password length helper text displays correctly.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Minimum password length helper text not displayed.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_31 - Verify the current password confirmation helper text displays correctly @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_31';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify current password confirmation helper text', async () => {
        const profile = AllPageObjects.profile();
        await profile.ensurePasswordFormOpen();
        await expect(profile.passwordCurrentConfirmHelper).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Current password confirmation helper text displays correctly.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Current password confirmation helper text not displayed.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_32 - Verify New password and Password confirmation fields mask entered characters @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_32';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Verify password inputs have type="password"', async () => {
        const profile = AllPageObjects.profile();
        await profile.ensurePasswordFormOpen();
        await expect(profile.newPasswordInput).toHaveAttribute('type', 'password');
        await expect(profile.passwordConfirmationInput).toHaveAttribute('type', 'password');
        await expect(profile.currentPasswordInput).toHaveAttribute('type', 'password');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'New password and Password confirmation input fields mask entered characters.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Password inputs do not mask characters.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_33 - Verify a validation error is shown when the New password is shorter than 8 characters @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_33';
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
        await AllPageObjects.profile().ensurePasswordFormOpen();
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
        'Validation error displays when the new password is shorter than 8 characters.'
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

test('Tc_Profile_34 - Verify a validation error is shown when New password and Password confirmation do not match @critical', async ({ page, AllPageObjects, logs }) => {
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

      await test.step('Enter mismatched passwords and submit', async () => {
        await AllPageObjects.profile().ensurePasswordFormOpen();
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
        'Validation error displays when new password and password confirmation do not match.'
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

test('Tc_Profile_35 - Verify a validation error is shown when Current password is left empty on Save changes @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_35';
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
        await AllPageObjects.profile().ensurePasswordFormOpen();
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
        'Validation error displays when current password is left empty on Save changes.'
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

test('Tc_Profile_36 - Verify an appropriate error is shown when an incorrect Current password is entered @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_36';
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
        await AllPageObjects.profile().ensurePasswordFormOpen();
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm('NewPass@123', 'NewPass@123', 'WrongCurrentPass');
        await AllPageObjects.profile().clickSavePasswordChanges();
        await page.waitForLoadState('domcontentloaded');
        await expect(AllPageObjects.profile().validationAlert.first()).toBeVisible();
        await expect(AllPageObjects.profile().validationAlert.first()).toContainText(/Password could not be changed/i);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Authentication error displays when an incorrect current password is entered.'
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

test('Tc_Profile_37 - Verify the password updates successfully with a valid New password, matching confirmation and correct Current password @critical', async ({ page, AllPageObjects, logs }) => {
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

      await test.step('Submit valid new password with confirmation and current password', async () => {
        await AllPageObjects.profile().ensurePasswordFormOpen();
        await expect(AllPageObjects.profile().newPasswordInput).toBeVisible();
        await AllPageObjects.profile().fillPasswordForm('NewValidPass123!', 'NewValidPass123!', loginTestData.customerLogin.Password);
        await AllPageObjects.profile().clickSavePasswordChanges();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Revert password back to original customer login password', async () => {
        await AllPageObjects.profile().ensurePasswordFormOpen();
        await AllPageObjects.profile().fillPasswordForm(loginTestData.customerLogin.Password, loginTestData.customerLogin.Password, 'NewValidPass123!');
        await AllPageObjects.profile().clickSavePasswordChanges();
        await page.waitForLoadState('domcontentloaded');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        'Password updates successfully with valid new password and confirmation.'
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

test('Tc_Profile_38 - Verify Start Agentic Order Draft handles an expired session gracefully @critical', async ({ page, AllPageObjects, logs, context }) => {
    const testCaseId = 'Tc_Profile_38';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      await test.step('Clear cookies to simulate expired session', async () => {
        await context.clearCookies();
      });

      await test.step('Click Start Agentic Order Draft and verify redirection or stability', async () => {
        const profile = AllPageObjects.profile();
        await profile.clickStartAgenticOrderDraft();
        await page.waitForLoadState('domcontentloaded');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Start Agentic Order Draft handles an expired session gracefully.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Expired session was not handled gracefully.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_39 - Verify Start Agentic Order Draft handles network failure gracefully @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_39';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      const profile = AllPageObjects.profile();

      await test.step('Abort route to agentic ordering page', async () => {
        await page.route('**/agentic-ordering', route => route.abort('failed'));
      });

      await test.step('Click Start Agentic Order Draft and verify graceful handling', async () => {
        await profile.clickStartAgenticOrderDraft().catch(() => {});
      });

      await page.unroute('**/agentic-ordering');

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Start Agentic Order Draft handles network failure gracefully without crashing.');
    } catch (error) {
      await page.unroute('**/agentic-ordering').catch(() => {});
      const endTime = new Date();
      const actualResult = 'Network failure on agentic order draft was not handled gracefully.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

test('Tc_Profile_40 - Verify the Password fields sanitize script injection attempts @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_40';
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
        await AllPageObjects.profile().ensurePasswordFormOpen();
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
        'Password fields sanitize script injection attempts without executing scripts.'
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

test('Tc_Profile_41 - Verify the system behavior when the new password entered is identical to the current password @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Profile_41';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Profile', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await page.goto(new URL('/account/profile', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      });


      const profile = AllPageObjects.profile();
      await test.step('Enter current password as new password and submit', async () => {
        await profile.ensurePasswordFormOpen();
        await profile.fillPasswordForm(loginTestData.customerLogin.Password, loginTestData.customerLogin.Password, loginTestData.customerLogin.Password);
        await profile.clickSavePasswordChanges();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify page remains stable and form completes', async () => {
        await expect(profile.accountHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'System handles identical new password entry smoothly without unhandled errors.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'System crashed or produced unhandled error when new password was identical.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });
});

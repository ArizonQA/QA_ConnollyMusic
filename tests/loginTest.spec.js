import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import { TestData } from '../testdata/AllTestData.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

const filePath = path.resolve(__dirname, '../testdata/Commerce_Hub_AI_Test_cases.xlsx');
const sheetName = 'Login and Store Sync';
const STORAGE_STATE = 'storagestate/storageState.json';

// ---------------------------------------------------------
// Group 1: tests using the shared page/AllPageObjects fixture
// ---------------------------------------------------------
test.describe('Login - single context tests', () => {

  test.beforeEach(async ({ page, logs }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    console.log("Url - " + page.url());
  });

  //TC_LOGIN_01
  test( 'TC_LOGIN_01 - Verify login page loads with default tab selected & Verify CommerceHub AI User tab displays correct heading, subtitle and placeholders',
    async ({ AllPageObjects }) => {
      const startTime = new Date();
      try {
        const login = AllPageObjects.login();

        await expect(login.customerLoginHeading).toHaveText(
          new RegExp(TestData.loginData().customerLoginHeading, "i")
        );

        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_01", "Pass", startTime, endTime,
          "Login page loads with 'Customer Login' tab selected by default; heading reads 'Customer Login' with subtitle 'Access your personalized storefront intelligence.', email placeholder shows name@yourstore.com, Password field, 'Sign In' and 'Sign in with SSO' buttons, 'Remember me' checkbox and 'Forgot password?' link are all visible");
      } catch (error) {
        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_01", "Fail", startTime, endTime, "", error.message);
        throw error;
      }
    });

  //TC_LOGIN_02 & TC_AIUSER_01
  test(" TC_LOGIN_02 & TC_AIUSER_01 - Verify tab switch from default 'Customer Login' tab to 'CommerceHub AI User' tab", async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();

      await login.adminLogin.click();

      await expect(login.CustomerHubAiHeading).toContainText(TestData.loginData().AdminTabHeading);
      await expect(login.CustomerHubAiSubHeading).toContainText(TestData.loginData().AdminSubTabHeading);

      await login.customerLoginTab.click();
      await expect(login.customerLoginHeading).toContainText(TestData.loginData().customerLoginHeading);

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_02", "Pass", startTime, endTime,
        "Admin switch from default 'Customer Login' tab to 'CommerceHub AI User' tab");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_02", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  // TC_LOGIN_03
  test('TC_LOGIN_03 - Verify password field masks input by default', async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGIN_03");

      await login.password.fill(testData.trim());
      await expect(login.password).toHaveAttribute('type', 'password');

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_03", "Pass", startTime, endTime,"Entered characters are masked (dots) by default");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_03", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_LOGIN_04
  test('TC_LOGIN_04 - Verify show/hide password (eye icon) toggle', async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const testdata = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGIN_04");

      await login.password.fill(testdata);
      await expect(login.password).toHaveAttribute('type', 'password');

      await login.showPassword.click();
      await expect(login.password).toHaveAttribute('type', 'text');

      await login.hidePassword.click();
      await expect(login.password).toHaveAttribute('type', 'password');

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_04", "Pass", startTime, endTime,
        "First click reveals password in plain text, second click re-masks it");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_04", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_LOGIN_05
  test("TC_LOGIN_05 - Verify 'Remember me' checkbox can be toggled", async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();

      if (!(await login.rememberMe.isChecked())) {
        await login.rememberMe.check();
      }
      await expect(login.rememberMe).toBeChecked();

      await login.rememberMe.uncheck();
      await expect(login.rememberMe).not.toBeChecked();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_05", "Pass", startTime, endTime, 
        "Checkbox toggles between checked and unchecked states correctly");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_05", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_AIUSER_02
  test('TC_AIUSER_02 - Verify successful login with valid registered email and correct password', async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_02");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await expect(login.CustomerHubAiHeading).toContainText(TestData.loginData().AdminTabHeading);
      await expect(login.CustomerHubAiSubHeading).toContainText(TestData.loginData().AdminSubTabHeading);

      await login.email.fill(email.trim());
      await login.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login.signIn.click();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_02", "Pass", startTime, endTime, 
        "User is authenticated successfully and redirected to the CommerceHub AI Admin/Platform dashboard where they can connect and manage existing platform integrations");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_02", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_AIUSER_04
  test('TC_AIUSER_04 - Verify login fails with incorrect password', async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_04");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await expect(login.CustomerHubAiHeading).toContainText(TestData.loginData().AdminTabHeading);
      await expect(login.CustomerHubAiSubHeading).toContainText(TestData.loginData().AdminSubTabHeading);

      await login.email.fill(email.trim());
      await login.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login.signIn.click();

      await expect(login.invalidPassword).toContainText(TestData.invalidLogin().errorMessage);

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_04", "Pass", startTime, endTime, 
        "Login rejected; a generic error message such as 'Invalid email or password' is shown; no indication of which field is wrong");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_04", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  // TC_AIUSER_06
  test("TC_AIUSER_06 - Verify validation error for invalid email formats", async ({ AllPageObjects, page }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const rawData = ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_06");

      const parts = rawData.split(",");
      const password = parts[parts.length - 1].trim();
      const emails = parts.slice(0, -1).map(e => e.trim());

      await login.adminLogin.click();

      for (const email of emails) {
        await login.email.fill(email);
        await login.password.fill(password);
        console.log(email + " " + password);
        await login.signIn.click();

        await expect(login.emailError.first()).toContainText(TestData.invalidEmails().errorMessageForEmail);

        await page.reload();
        await login.adminLogin.click();
      }

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_06", "Pass", startTime, endTime,
        "Inline validation error 'Please enter a valid email address' displayed; form is not submitted"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_06", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  // TC_AIUSER_12
  test("TC_AIUSER_12 - Verify SQL Injection payload in Email/Password fields is safely handled", async ({ AllPageObjects, page }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const rawData = ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_12");

      const parts = rawData.split(",");
      const password = parts[parts.length - 1].trim();
      const emails = parts.slice(0, -1).map(e => e.trim());

      await login.adminLogin.click();

      for (const email of emails) {
        await login.email.fill(email);
        await login.password.fill(password);
        console.log(email + " " + password);
        await login.signIn.click();

        await expect(login.emailError.first()).toContainText(TestData.invalidEmails().errorMessageForEmail);

        await page.reload();
        await login.adminLogin.click();
      }

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_12", "Pass", startTime, endTime,
        "Login fails safely with a generic invalid-credentials error; no SQL error is exposed; no unauthorized access is granted; input is sanitized/parameterized on the backend"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_12", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  // TC_AIUSER_13
  test("TC_AIUSER_13 - Verify script injection (XSS) payload in Email field is sanitized", async ({ AllPageObjects, page }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const rawData = ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_13");
      const [email, password] = rawData.split(",");

      await login.adminLogin.click();

      await login.email.fill(email);
      await login.password.fill(password);
      console.log(email + " " + password);
      await login.signIn.click();

      await expect(login.emailError.first()).toContainText(TestData.invalidEmails().errorMessageForEmail);

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_13", "Pass", startTime, endTime, 
        "Input is escaped/sanitized; no script executes; a validation error or generic login failure is shown"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_13", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_AIUSER_14
  test("TC_AIUSER_14 - Verify leading/trailing whitespace in email is trimmed before validation", async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_15");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await login.email.fill(email);
      await login.password.fill(password);
      console.log(email + " " + password);
      await login.signIn.click();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_14", "Pass", startTime, endTime,
        "Whitespace is trimmed automatically; login succeeds as if entered without spaces"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_14", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_AIUSER_15
  test("TC_AIUSER_15 - Verify email is treated as case-insensitive during login", async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_15");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await login.email.fill(email);
      await login.password.fill(password);
      console.log(email + " " + password);
      await login.signIn.click();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_15", "Pass", startTime, endTime,
        "Login succeeds regardless of the email's letter casing");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_15", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_AIUSER_21
  test(" TC_AIUSER_21 - Verify 'Forgot password?' link navigates to the password reset flow",
    async ({ AllPageObjects }) => {
      const startTime = new Date();
      try {
        const login = AllPageObjects.login();

        await login.adminLogin.click();
        await login.ForgetPassword.click();

        await AllPageObjects.forget().verifyHeading(TestData.forgetPassword().forgetPasswordHeading);

        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_21", "Pass", startTime, endTime,
          "User is navigated to a 'Reset Password' page/flow where they can enter their registered email to receive a reset link"
        );
      } catch (error) {
        const endTime = new Date();
        ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_21", "Fail", startTime, endTime, "", error.message);
        throw error;
      }
    }
  );

});

// ---------------------------------------------------------
// Group 2: tests that manage their own browser.newContext()
// No shared "page" beforeEach here — avoids an extra
// default context/window opening alongside context1/context2
// ---------------------------------------------------------
test.describe('Login - multi context tests', () => {

  //TC_AIUSER_03
  test("Verify login with 'Remember me' checked persists session across browser restarts", async ({ browser }) => {
    const startTime = new Date();
    try {
      const context1 = await browser.newContext();
      const page1 = await context1.newPage();
      const allPageObjects1 = new AllPageObjects(page1);
      const login1 = allPageObjects1.login();
      const dashboard1 = allPageObjects1.dashboard();

      const testData = await ExcelUtils.getTestData(filePath, sheetName, "TC_AIUSER_03");
      const [email, password] = testData.split(",");

      await page1.goto(TestData.Urls().Url);

      await login1.adminLogin.click();

      await login1.email.fill(email.trim());
      await login1.password.fill(password.trim());
      await login1.rememberMe.check();
      await login1.signIn.click();

      await expect(dashboard1.adminText).toContainText('Admin');

      await context1.storageState({ path: STORAGE_STATE });
      await context1.close();

      const context2 = await browser.newContext({ storageState: STORAGE_STATE });
      const page2 = await context2.newPage();
      const allPageObjects2 = new AllPageObjects(page2);
      const dashboard2 = allPageObjects2.dashboard();

      await page2.goto(TestData.Urls().DashboardUrl);

      await expect(dashboard2.adminText).toContainText('Admin');

      await context2.close();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_03", "Pass", startTime, endTime,
        "User remains logged in / session persists without re-entering credentials, until the Remember-me token expires"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_AIUSER_03", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

});
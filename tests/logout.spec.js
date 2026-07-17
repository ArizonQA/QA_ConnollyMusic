import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import { TestData } from '../testdata/AllTestData.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

const filePath = path.resolve(__dirname, '../testdata/Commerce_Hub_AI_Test_cases.xlsx');
const sheetName = 'Login and Store Sync';
const STORAGE_STATE_LOGOUT = 'storagestate/newstorageState.json';

// ---------------------------------------------------------
// Group 1: tests that use the shared page/AllPageObjects fixture
// ---------------------------------------------------------
test.describe('Logout - single context tests', () => {

  test.beforeEach(async ({ page, logs }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    console.log("Url - " + page.url());
  });

  //TC_LOGOUT_01 & TC_LOGOUT_02
  test.skip("TC_LOGOUT_01 & 02 - Verify clicking Logout terminates the session and redirects to the Login page", async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const dashboard = AllPageObjects.dashboard();

      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_02");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await login.email.fill(email.trim());
      await login.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login.signIn.click();

      await dashboard.profileButton.click();
      await login.page.waitForTimeout(2000);
      await dashboard.logoutButton.click();
      await login.page.waitForTimeout(2000);

      await expect(login.customerLoginHeading).toHaveText(
        new RegExp(TestData.loginData().customerLoginHeading, "i")
      );

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_02", "Pass", startTime, endTime,
        "User's session is terminated; user is redirected to the Login page with the default 'Customer Login' tab shown"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_02", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_LOGOUT_03
  test.skip("TC_LOGOUT_03 - Verify browser Back button after logout does not display a cached Dashboard", async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const dashboard = AllPageObjects.dashboard();

      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_03");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await login.email.fill(email.trim());
      await login.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login.signIn.click();

      await dashboard.Customers.click();

      await dashboard.profileButton.click();
      await login.page.waitForTimeout(2000);
      await dashboard.logoutButton.click();
      await login.page.waitForTimeout(2000);

      await AllPageObjects.goBack();

      await expect(login.customerLoginHeading).toHaveText(
        new RegExp(TestData.loginData().customerLoginHeading, "i")
      );

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_03", "Pass", startTime, endTime,
        "Browser does not display a cached/stale Dashboard view; user is shown the Login page or redirected back to it if a cached page briefly appears"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_03", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  // TC_LOGOUT_04
  test.skip("TC_LOGOUT_04 - Verify direct Dashboard URL access after logout redirects to Login page", async ({ AllPageObjects, page }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const dashboard = AllPageObjects.dashboard();

      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_04");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await login.email.fill(email.trim());
      await login.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login.signIn.click();

      await dashboard.profileButton.click();
      await page.waitForTimeout(2000);
      await dashboard.logoutButton.click();
      await page.waitForTimeout(2000);

      await page.goto(TestData.Urls().DashboardUrl);

      await expect(login.customerLoginHeading).toHaveText(
        new RegExp(TestData.loginData().customerLoginHeading, "i")
      );

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_04", "Pass", startTime, endTime,
        "User is redirected to the Login page; Dashboard content/data is never rendered without an active session"
      );
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_04", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_LOGOUT_07
  test("TC_LOGOUT_07 - Verify user can log back in immediately after logout", async ({ AllPageObjects }) => {
    const startTime = new Date();
    try {
      const login = AllPageObjects.login();
      const dashboard = AllPageObjects.dashboard();

      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_07");
      const [email, password] = testData.split(",");

      await login.adminLogin.click();

      await login.email.fill(email.trim());
      await login.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login.signIn.click();

      await expect(dashboard.adminText).toContainText('Admin');

      await dashboard.profileButton.click();
      await login.page.waitForTimeout(2000);
      await dashboard.logoutButton.click();
      await login.page.waitForTimeout(2000);

      await login.adminLogin.click();

      await login.email.fill(email.trim());
      await login.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login.signIn.click();

      await expect(dashboard.adminText).toContainText('Admin');

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_07", "Pass", startTime, endTime,
        "User is authenticated successfully and lands back on Dashboard with no lockout or residual error from the prior session");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_07", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

});

// ---------------------------------------------------------
// Group 2: tests that manage their own browser.newContext()
// No shared "page" beforeEach here — avoids the extra
// default context/window opening alongside context1/context2
// ---------------------------------------------------------
test.describe('Logout - multi context tests', () => {

  // TC_LOGOUT_05
  test("TC_LOGOUT_05 - Verify email textbox state persisted after logout", async ({ browser }) => {
    const startTime = new Date();
    try {
      const context1 = await browser.newContext();
      const page1 = await context1.newPage();
      const allPageObjects1 = new AllPageObjects(page1);
      const login1 = allPageObjects1.login();
      const dashboard1 = allPageObjects1.dashboard();

      const testData = await ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_05");
      const [email, password] = testData.split(",");

      await page1.goto(TestData.Urls().Url);

      await login1.adminLogin.click();

      await login1.email.fill(email.trim());
      await login1.password.fill(password.trim());
      await login1.rememberMe.check();
      await login1.signIn.click();

      await expect(dashboard1.adminText).toContainText('Admin');

      await dashboard1.profileButton.click();
      await page1.waitForTimeout(2000);
      await dashboard1.logoutButton.click();
      await page1.waitForTimeout(2000);

      await context1.storageState({ path: STORAGE_STATE_LOGOUT });
      await context1.close();

      const context2 = await browser.newContext({ storageState: STORAGE_STATE_LOGOUT });
      const page2 = await context2.newPage();
      const allPageObjects2 = new AllPageObjects(page2);
      const login2 = allPageObjects2.login();

      await page2.goto(TestData.Urls().Url);

      await expect(login2.rememberMe).toBeChecked();
      await expect(login2.email).toHaveValue(email.trim());

      await context2.close();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_05", "Pass", startTime, endTime,
        "User is shown the Login page with email auto filled.");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_05", "Fail", startTime, endTime, "", error.message);
      throw error;
    }
  });

  //TC_LOGOUT_06
  test("TC_LOGOUT_06 - Verify logout in one tab logs out all open tabs", async ({ browser }) => {
    const startTime = new Date();
    try {
      const context = await browser.newContext();
      const page1 = await context.newPage();
      const allPageObjects1 = new AllPageObjects(page1);
      const login1 = allPageObjects1.login();
      const dashboard1 = allPageObjects1.dashboard();

      const testData = await ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_06");
      const [email, password] = testData.split(",");

      await page1.goto(TestData.Urls().Url);

      await login1.adminLogin.click();

      await login1.email.fill(email.trim());
     await login1.password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await login1.signIn.click();

      await expect(dashboard1.adminText).toContainText('Admin');

      const page2 = await context.newPage();
      const allPageObjects2 = new AllPageObjects(page2);
      const login2 = allPageObjects2.login();
      const dashboard2 = allPageObjects2.dashboard();

      await page2.goto(TestData.Urls().DashboardUrl);

      await expect(dashboard2.adminText).toContainText('Admin');

      await page1.bringToFront();

      await dashboard1.profileButton.click();
      await page1.waitForTimeout(2000);
      await dashboard1.logoutButton.click();
      await page1.waitForTimeout(2000);

      await page1.waitForTimeout(2000);
      await page2.bringToFront();
      await page2.waitForTimeout(1000);

      await dashboard2.Customers.click();

      await expect(login2.customerLoginHeading).toHaveText(
        new RegExp(TestData.loginData().customerLoginHeading, "i")
      );

      await context.close();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_06", "Pass", startTime, endTime,
        "Tab 2 also reflects the logged-out state (redirected to Login page or shows a session-expired message) once any request is made");
    } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_06", "Fail", startTime, endTime, "", "", error.message);
      throw error;
    }
  });

});
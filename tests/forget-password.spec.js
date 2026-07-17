import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import { TestData } from '../testdata/AllTestData.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

const filePath = path.resolve(__dirname, '../testdata/Commerce_Hub_AI_Test_cases.xlsx');
const sheetName = 'Login and Store Sync';

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  console.log("Url - " + page.url());
});

// TC_FP_01
test('TC_FP_01 - Verify forgot password flow sends reset link for a registered email', async ({ AllPageObjects }) => {
  const startTime = new Date();
  try {
    const login = AllPageObjects.login();
    const forget = AllPageObjects.forget();

    // Read test data from Excel
    const email = await ExcelUtils.getTestData(filePath, sheetName, "TC_FP_01");

    // ForgetPasswordRedirection
    await login.ForgetPassword.click();

    // verifyHeading
    await expect(forget.heading).toContainText(TestData.forgetPassword().forgetPasswordHeading);

    // enterEmail
    await forget.emailTextbox.click();
    await forget.emailTextbox.fill(email.trim());

    // sendResetLink
    await forget.sendResetButton.click();

    // verifyResetMessage
    await expect(forget.form).toContainText(TestData.forgetPassword().successMessage);

    // backToSignIn
    await forget.backToSignInLink.click();

    // verifyByDefaultCustomerLoginPageIsDisplayed
    await expect(login.customerLoginHeading).toHaveText(
      new RegExp(TestData.loginData().customerLoginHeading, "i")
    );

    const endTime = new Date();
    ExcelUtils.updateStatus(filePath, sheetName, "TC_FP_01", "Pass", startTime, endTime,
      "Forgot password flow sends reset link for a registered email");
  } catch (error) {
    const endTime = new Date();
    ExcelUtils.updateStatus(filePath, sheetName, "TC_FP_01", "Fail", startTime, endTime, "" ,error.message);
    throw error;
  }
});
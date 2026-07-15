import { test } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import { TestData } from '../testdata/AllTestData.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

const filePath = path.resolve(__dirname, '../testdata/Commerce_Hub_AI_Test_cases.xlsx');
const sheetName = 'Login and Store Sync';


test('Verify forgot password flow sends reset link for a registered email', async ({ AllPageObjects }) => {
  const startTime = new Date();
  try {
   

    // Read test data from Excel
    const email = await ExcelUtils.getTestData(filePath, sheetName, "TC_FP_01");

    await AllPageObjects.login().ForgetPasswordRedirection();
   
    await AllPageObjects.forget().verifyHeading(TestData.forgetPassword().forgetPasswordHeading);

    await AllPageObjects.forget().enterEmail(email.trim());
    await AllPageObjects.forget().sendResetLink();
    await AllPageObjects.forget().verifyResetMessage(TestData.forgetPassword().successMessage);
    await AllPageObjects.forget().backToSignIn();

    await AllPageObjects.login().verifyByDefaultCutomerLoginPageIsDisplayed(
            TestData.CustomerHublogin().customerLoginHeading,
            TestData.CustomerHublogin().customerLoginSubHeading
         );

    const endTime = new Date();
     ExcelUtils.updateStatus(filePath, sheetName, "TC_FP_01", "Pass", startTime, endTime);
  } catch (error) {
    const endTime = new Date();
    ExcelUtils.updateStatus(filePath, sheetName, "TC_FP_01", "Fail", startTime, endTime, error.message);
    throw error;
  }
});


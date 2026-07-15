import { test , expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import { TestData } from '../testdata/AllTestData.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

const filePath = path.resolve(__dirname, '../testdata/Commerce_Hub_AI_Test_cases.xlsx');
const sheetName = 'Login and Store Sync';


test('Verify login page loads with default tab selected & Verify CommerceHub AI User tab displays correct heading, subtitle and placeholders',
   async ({ AllPageObjects }) => {
      const startTime = new Date();
      try {
         await AllPageObjects.login().verifyByDefaultCutomerLoginPageIsDisplayed(
            TestData.CustomerHublogin().customerLoginHeading,
            TestData.CustomerHublogin().customerLoginSubHeading
         );
         const endTime = new Date();
         ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_01", "Pass", startTime, endTime);
      } catch (error) {
         const endTime = new Date();
         ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_01", "Fail", startTime, endTime, error.message);
         throw error; // rethrow so Playwright marks test failed
      }
   });

test("Verify tab switch from default 'Customer Login' tab to 'CommerceHub AI User' tab", async ({ AllPageObjects }) => {
   const startTime = new Date();
   try {
      await AllPageObjects.login().selectuserTypeCommerceHubAi();
      await AllPageObjects.login().validateCustomerHubAi_Tab(
         TestData.CustomerHublogin().CustomeHubAiTabHeading,
         TestData.CustomerHublogin().CustomeHubAiTabSubHeading
      );
      await AllPageObjects.login().switchToCustomerLoginTab(TestData.CustomerHublogin().customerLoginSubHeading);

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_02", "Pass", startTime, endTime);
   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_02", "Fail", startTime, endTime, error.message);
      throw error;
   }
});

test("Verify 'Remember me' checkbox can be toggled", async ({ AllPageObjects }) => {
   const startTime = new Date();
   try {
      await AllPageObjects.login().verifyToggleRememberMe();

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_05", "Pass", startTime, endTime);
   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_05", "Fail", startTime, endTime, error.message);
      throw error;
   }
});


test('Verify successful customer login with valid credentials', async ({ AllPageObjects }) => {
   const startTime = new Date();
   try {
      // Get test data from Excel
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_CST_HUB_02");
      const [email, password] = testData.split(","); // assuming "email,password" format

      await AllPageObjects.login().selectuserTypeCommerceHubAi();
      await AllPageObjects.login().validateCustomerHubAi_Tab(
         TestData.CustomerHublogin().CustomeHubAiTabHeading,
         TestData.CustomerHublogin().CustomeHubAiTabSubHeading
      );
      await AllPageObjects.login().loginIntoCustomerHubAi(email.trim(), password.trim());

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_CST_HUB_02", "Pass", startTime, endTime);
   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_CST_HUB_02", "Fail", startTime, endTime, error.message);
      throw error;
   }
});



test('Verify customer login fails with invalid credentials', async ({ AllPageObjects }) => {
   const startTime = new Date();
   try {
      // Get test data from Excel
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_CST_HUB_06");
      const [email, password] = testData.split(","); // assuming "email,password" format

      await AllPageObjects.login().selectuserTypeCommerceHubAi();
      await AllPageObjects.login().validateCustomerHubAi_Tab(
         TestData.CustomerHublogin().CustomeHubAiTabHeading,
         TestData.CustomerHublogin().CustomeHubAiTabSubHeading
      );
      await AllPageObjects.login().loginIntoCustomerHubAi(email.trim(), password.trim());
      await AllPageObjects.login().observeErrorMessage(TestData.invalidLogin().errorMessage);

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_CST_HUB_06", "Pass", startTime, endTime);
   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_CST_HUB_06", "Fail", startTime, endTime, error.message);
      throw error;
   }

});

test('Verify password field masks input by default', async ({ AllPageObjects }) => {
   const startTime = new Date();
   try {
      // Get test data from Excel
      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGIN_03");

      await AllPageObjects.login().verifyPasswordMaskedByDefault(testData.trim());

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_03", "Pass", startTime, endTime);
   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_03", "Fail", startTime, endTime, error.message);
      throw error;
   }

});

//TC_LOGIN_04

test('Verify show/hide password (eye icon) toggle', async ({ AllPageObjects }) => {
   const startTime = new Date();
   try {
      const testdata = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGIN_04");

      await await AllPageObjects.login().verifyShowHidePassword(testdata);
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_04", "Pass", startTime, endTime);
   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGIN_04", "Pass", startTime, endTime, error.message);
      throw error;
   }

});

//TC_USER_02

//Need clarification which page should be displayed when remembered

test("Verify login with 'Remember me' checked persists session across browser restarts", async ({ AllPageObjects }) => {
  const startTime = new Date();
  try {
    const testData = await ExcelUtils.getTestData(filePath, sheetName, "TC_USER_02");
    if (!testData) throw new Error("No test data found for TC_USER_02");
    const [email, password] = testData.split(",");

    await AllPageObjects.login().selectuserTypeCommerceHubAi();
    await AllPageObjects.login().loginWithRemberMeOption(email.trim(), password.trim());

    await AllPageObjects.dashboard().logout();

    // Wait for login page to be visible again
    await AllPageObjects.login().verifyByDefaultCutomerLoginPageIsDisplayed(
      TestData.CustomerHublogin().customerLoginHeading,
      TestData.CustomerHublogin().customerLoginSubHeading
    );

    await AllPageObjects.login().selectuserTypeCommerceHubAi();
    await AllPageObjects.login().verifyEmailAutofilled(email.trim());

    const endTime = new Date();
    await ExcelUtils.updateStatus(filePath, sheetName, "TC_USER_02", "Pass", startTime, endTime);
  } catch (error) {
    const endTime = new Date();
    await ExcelUtils.updateStatus(filePath, sheetName, "TC_USER_02", "Fail", startTime, endTime, error.message);
    throw error;
  }
});


//TC_CST_HUB_09

test("Verify 'Forgot password?' link on CommerceHub AI User tab navigates to password reset flow",
   async ({ AllPageObjects }) => {
      const startTime = new Date();
      try {
        
         await AllPageObjects.login().ForgetPasswordRedirection();

         await AllPageObjects.forget().verifyHeading(TestData.forgetPassword().forgetPasswordHeading);
         const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_CST_HUB_09", "Pass", startTime, endTime);

   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_CST_HUB_09", "Fail", startTime, endTime, error.message);
      throw error;
   }

   }
);



//TC_LOGOUT_02

test("Verify clicking Logout terminates the session and redirects to the Login page", async ({ AllPageObjects }) => {

   const startTime = new Date();
   try {

      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_02");
      const [email, password] = testData.split(","); // assuming "email,password" format

      await AllPageObjects.login().selectuserTypeCommerceHubAi();
      await AllPageObjects.login().loginIntoCustomerHubAi(email.trim(), password.trim());

      await AllPageObjects.dashboard().logout();
      
      await AllPageObjects.login().verifyByDefaultCutomerLoginPageIsDisplayed(
            TestData.CustomerHublogin().customerLoginHeading,
            TestData.CustomerHublogin().customerLoginSubHeading
         );

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_02", "Pass", startTime, endTime);

   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_02", "Fail", startTime, endTime, error.message);
      throw error;
   }

});

//TC_LOGOUT_03

test("Verify browser Back button after logout does not display a cached Dashboard", async ({ AllPageObjects }) => {

   const startTime = new Date();
   try {

      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_03");
      const [email, password] = testData.split(","); // assuming "email,password" format

      await AllPageObjects.login().selectuserTypeCommerceHubAi();
      await AllPageObjects.login().loginIntoCustomerHubAi(email.trim(), password.trim());

      await AllPageObjects.dashboard().clickOncustomer();

      await AllPageObjects.dashboard().logout();

      await AllPageObjects.goBack();

       await AllPageObjects.verifyByDefaultCutomerLoginPageIsDisplayed();

       await AllPageObjects.login().verifyByDefaultCutomerLoginPageIsDisplayed(
            TestData.CustomerHublogin().customerLoginHeading,
            TestData.CustomerHublogin().customerLoginSubHeading
         );

      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_03", "Pass", startTime, endTime);

   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_03", "Fail", startTime, endTime, error.message);
      throw error;
   }

});

// TC_LOGOUT_04	


test("Verify direct Dashboard URL access after logout redirects to Login page", async ({ AllPageObjects }) => {

   const startTime = new Date();
   try {


      const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_LOGOUT_04");
      const [email, password] = testData.split(","); // assuming "email,password" format

     await AllPageObjects.login().selectuserTypeCommerceHubAi();
      await AllPageObjects.login().loginIntoCustomerHubAi(email.trim(), password.trim());


      await AllPageObjects.dashboard().logout();
      
      await AllPageObjects.goToUrl(TestData.Urls.CommerceHubAiDashboard);

      await AllPageObjects.login().verifyByDefaultCutomerLoginPageIsDisplayed(
            TestData.CustomerHublogin().customerLoginHeading,
            TestData.CustomerHublogin().customerLoginSubHeading
         );


      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_04", "Pass", startTime, endTime);

   } catch (error) {
      const endTime = new Date();
      ExcelUtils.updateStatus(filePath, sheetName, "TC_LOGOUT_04", "Fail", startTime, endTime, error.message);
      throw error;
   }

});


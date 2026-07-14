import { test } from '../fixtures/base.js';
import { TestData } from '../testdata/AllTestData.js';


test('Verify login page loads with default tab selected', async ({ AllPageObjects, logs }) => {
   await AllPageObjects.page.waitForTimeout(1000);

   await AllPageObjects.login().verifyByDefaultCutomerLoginPageIsDisplayed(
    TestData.CustomerHublogin().customerLoginHeading,
    TestData.CustomerHublogin().customerLoginSubHeading
);

});

test("Verify tab switch from default 'Customer Login' tab to 'CommerceHub AI User' tab", async({AllPageObjects, logs })=>
{

   await AllPageObjects.login().selectuserTypeCommerceHubAi();

   await AllPageObjects.login().validateCustomerHubAi_Tab(TestData.CustomerHublogin().CustomeHubAiTabHeading,
   TestData.CustomerHublogin().CustomeHubAiTabSubHeading);

   await logs.info("Admin able to switch from customer login to Commerce Hub Ai Tab");

   await AllPageObjects.login().switchToCustomerLoginTab(TestData.CustomerHublogin().customerLoginSubHeading);

   await logs.info("Admin able to switch from CommerceHub Ai to Customer Login");

});

// test("Verify 'Remember me' checkbox can be toggled", async ({ AllPageObjects, logs }) => {

//    await AllPageObjects.login().toggleRememberMe();
//    await logs.info("'Remember me' checkbox was checked (verified) and unchecked (verified) successfully");

// });

test('Login Into Commerce Hub Ai', async ({ AllPageObjects, logs }) => {

   await logs.info("Commerce Hub Ai User landed on the login page");
   await AllPageObjects.login().selectuserTypeCommerceHubAi();
   await AllPageObjects.page.waitForTimeout(1000);

   await AllPageObjects.login().validateCustomerHubAi_Tab(TestData.CustomerHublogin().CustomeHubAiTabHeading,
   TestData.CustomerHublogin().CustomeHubAiTabSubHeading);
   await AllPageObjects.page.waitForTimeout(1000);
   await AllPageObjects.login().loginIntoCustomerHubAi(TestData.CustomerHublogin().email,
      TestData.CustomerHublogin().password);
   await logs.info("Commerce Hub Ai User sucessfully Logged in");


});
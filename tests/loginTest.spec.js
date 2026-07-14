import { test } from '../fixtures/base.js';
import { TestData } from '../testdata/AllTestData.js';

test('Login Into Commerce Hub Ai',async({ AllPageObjects, logs }) => {
   await logs.info("Commerce Hub Ai User landed on the login page");
await AllPageObjects.login().navigate(TestData.Urls().CommerceHubAi);


await AllPageObjects.login().selectuserTypeCommerceHubAi();
await AllPageObjects.page.waitForTimeout(1000);

await AllPageObjects.login().validateCustomerHubAi_Tab(TestData.CustomerHublogin().CustomeHubAiTabText);
await AllPageObjects.page.waitForTimeout(1000);
await AllPageObjects.login().loginIntoCustomerHubAi(TestData.CustomerHublogin().email,
TestData.CustomerHublogin().password);


await AllPageObjects.dashboard().verifyDashboardForCommerceHubAi();

await logs.info("Commerce Hub Ai User landed Dashboard");

});
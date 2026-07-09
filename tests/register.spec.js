import { test, expect } from '../fixtures/base.js';
import { RegisterTestData } from '../testdata/registerTestData.js';

test.beforeEach(async ({ page, AllPageObjects }) => {
  await page.goto("https://dev.ges.store/", { waitUntil: 'networkidle' });
  await AllPageObjects.login().securitycodeTextbox.fill(process.env.SecretCode);
        await AllPageObjects.login().continuetoWebsite.click();
  
  await AllPageObjects.login().accountMenu.click();
  await AllPageObjects.login().registerLink.click();
  await expect(page).toHaveURL("https://dev.ges.store/findcompany");

});

test.skip(" @smoke Register with existing company as Exhibitor", async ({ page, AllPageObjects }) => {
  

  await AllPageObjects.register().register_With_Existing_Company_As_Exhibitor(RegisterTestData.existingCompany());


 // await AllPageObjects.register().myprofile.click();

 // await expect(AllPageObjects.register().companyName.not.toBeNull();

 

});

test.skip("Register with existing company as Eac", async ({ page, AllPageObjects }) => {
  

  await AllPageObjects.register().register_With_Existing_Company_As_Eac(RegisterTestData.existingCompanyAsEac());
 // await AllPageObjects.register().myprofile.click();

 // await expect(AllPageObjects.register().companyName.not.toBeNull();
});

test("Register with new company as Exhibitor", async ({ page, AllPageObjects }) => {
  await AllPageObjects.register().register_With_New_Company_As_Exhibitor(RegisterTestData.newExhibitorDetails());
});

// test("Register with new company as EAC", async ({ page, AllPageObjects }) => {
//   await AllPageObjects.register().register_With_New_Company_As_Eac(RegisterTestData.newEacDetails());
// });


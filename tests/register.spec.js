import { test, expect } from '../fixtures/base.js';
import { RegisterTestData } from '../testdata/registerTestData.js';


test("Register with existing company", async ({ page, AllPageObjects }) => {
  await page.goto("https://uat.ges.store/", { waitUntil: 'networkidle' });
  await AllPageObjects.login().accountMenu.click();
  await AllPageObjects.login().registerLink.click();

  await AllPageObjects.register().registerWithExistingCompany(RegisterTestData.existingCompany());
 // await AllPageObjects.register().myprofile.click();

 // await expect(AllPageObjects.register().companyName).not.toBeNull();

});
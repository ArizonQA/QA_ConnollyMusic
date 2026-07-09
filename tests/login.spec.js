import { test } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';

const users = ExcelUtils.getAllData('./testdata/login.xlsx', 'login');

users.forEach((user, index) => {
  test(`Login Functionality - ${user.TestcaseID} [Row ${index + 1}]`, async ({ page, AllPageObjects }) => {

    const start = new Date();

    try {
      await page.goto("https://dev.ges.store/", { waitUntil: 'networkidle' });
      await AllPageObjects.login().securitycodeTextbox.fill(process.env.SecretCode);
      await AllPageObjects.login().continuetoWebsite.click();
      await AllPageObjects.login().loginIntoSite(user.Email, user.Password, { waitUntil: 'networkidle' });

const end = new Date();
      ExcelUtils.updateStatus(
        "./testdata/login.xlsx",
        "login",
        user.TestcaseID,
        "Passed",
        start.toISOString(),
        end.toISOString()
      );

    } catch (error) {
      const end = new Date();

      ExcelUtils.updateStatus(
        "./testdata/login.xlsx",
        "login",
        user.TestcaseID,
        "Failed",
        start.toISOString(),
        end.toISOString()
      );
      throw error;
    }
  });
});

import { test } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';

const users = ExcelUtils.getAllData('./testdata/login.xlsx', 'login');

users.forEach((user, index) => {
  test(`Login Test ${user.Email} [Row ${index + 1}]`, async ({ page, AllPageObjects }) => {
    await page.goto("https://dev.ges.store/", { waitUntil: 'networkidle' });
    await AllPageObjects.login().securitycodeTextbox.fill(process.env.SecretCode);
    await AllPageObjects.login().continuetoWebsite.click();
    await AllPageObjects.login().loginIntoSite(user.Email, user.Password, { waitUntil: 'networkidle' });
  });
});

import { test } from '../fixtures/base.js';


test('Login to Exhibitor Portal', async ({ page, AllPageObjects }) => {
  await page.goto("https://dev.ges.store/", { waitUntil: 'networkidle' });
 await AllPageObjects.login().securitycodeTextbox.fill(process.env.SecretCode);
        await AllPageObjects.login().continuetoWebsite.click();
 
  await AllPageObjects.login().loginIntoSite("vijay@arizon.digital", "Pass@1234",{ waitUntil: 'networkidle' });
});

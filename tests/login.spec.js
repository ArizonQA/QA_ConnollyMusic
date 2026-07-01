import { test } from '../fixtures/base.js';

test('Login to Exhibitor Portal', async ({ page, AllPageObjects }) => {
  await page.goto('https://uat.ges.store/');
  await AllPageObjects.login().loginIntoSite('vijay@arizon.digital', 'Pass@123');
});

import { test as setup } from '../fixtures/base.js';
import loginTestData from '../testcase/datas.js';
import fs from 'fs';
import path from 'path';

const authDir = path.resolve('.auth');
const authFile = path.join(authDir, 'user.json');

setup('authenticate customer', async ({ page, AllPageObjects, logs }) => {
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await logs.info('Starting one-time authentication setup for customer...');
  await AllPageObjects.login().gotoLoginPage(loginTestData.Url);
  await AllPageObjects.login().loginAsCustomer(
    loginTestData.customerLogin.Email,
    loginTestData.customerLogin.Password
  );

  // Wait for post-login destination URL
  await page.waitForURL(/account/, { timeout: 30000 });
  await page.context().storageState({ path: authFile });
  await logs.info(`Customer storage state saved to ${authFile}`);
});

import { test as base, expect } from '@playwright/test';
import { AllPageObjects } from '../pages/all_objects.js';
import { ExcelUtils } from '../utils/ExcelUtilsOld.js';

export const test = base.extend({
  AllPageObjects: async ({ page }, use) => {
    await use(new AllPageObjects(page));
  },

  excel: async ({ }, use) => {
    await use(ExcelUtils);
  },
  logs: async ({ }, use, testInfo) => {

    const logger = {

      async info(message) {
        await testInfo.attach(
          `INFO - ${new Date().toLocaleTimeString()}`,
          {
            body: Buffer.from(message),
            contentType: "text/plain"
          }
        );
      },

    };

    await use(logger);

  }

});



test.afterEach(async ({ page, context }, testInfo) => {
  if (testInfo.status === 'passed' || testInfo.status === 'failed') {
    await testInfo.attach('screenshot', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',

    });
  }

  // await context.clearCookies();
  // await context.clearPermissions();
});

export { expect } ;
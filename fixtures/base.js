import { test as base } from '@playwright/test';
import { AllPageObjects } from '../pages/all_objects.js';

export const test = base.extend({
  AllPageObjects: async ({ page }, use) => {
    await use(new AllPageObjects(page));
  }
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'passed' || testInfo.status === 'failed') {
    await testInfo.attach('screenshot', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
});

export { expect } from '@playwright/test';
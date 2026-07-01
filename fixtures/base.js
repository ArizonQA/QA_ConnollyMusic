import { test as base } from '@playwright/test';
import { AllPageObjects } from '../pages/all_objects.js';

export const test = base.extend({
  AllPageObjects: async ({ page }, use) => {
    await use(new AllPageObjects(page));
  }
});

export { expect } from '@playwright/test';
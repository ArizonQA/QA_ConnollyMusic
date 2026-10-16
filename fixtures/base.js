import { test as base, expect } from '@playwright/test';
import { AllPageObjects } from '../pages/all_objects.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';
import fs from 'fs';

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
  },

  /**
   * Automated runner that handles Excel details lookup, start/end timing,
   * info logging, and updating Excel status on Pass or Fail.
   */
  runTestCase: async ({ logs }, use, testInfo) => {
    const runner = async (sheetOrOptions, testFn) => {
      const options = typeof sheetOrOptions === 'string' ? { sheet: sheetOrOptions } : (sheetOrOptions || {});
      const testCaseId = options.id || testInfo.title.match(/(Tc_[A-Za-z0-9_]+)/i)?.[1];
      const sheetName = options.sheet;

      if (!testCaseId) {
        throw new Error(`Could not determine Test Case ID from title "${testInfo.title}" or options.`);
      }

      const primaryFilePath = path.resolve('testcase/Fasteners_Test_Cases.xlsx');
      const fallbackFilePath = path.resolve('testcase/Fasteners_Test_Case.xlsx');
      const filePath = options.filePath || (fs.existsSync(primaryFilePath) ? primaryFilePath : fallbackFilePath);

      const startTime = new Date();
      let testCaseDetails = {};
      try {
        testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
        if (testCaseDetails['Test Summary']) {
          await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);
        }
      } catch (err) {
        await logs.info(`[Warning] Could not load details for ${testCaseId}: ${err.message}`);
      }

      try {
        await testFn(testCaseDetails);
        const endTime = new Date();
        await ExcelUtils.updateStatus(
          filePath,
          sheetName,
          testCaseId,
          'Pass',
          startTime,
          endTime,
          testCaseDetails['Expected Result'] || 'Automation execution completed successfully'
        );
      } catch (error) {
        const endTime = new Date();
        await ExcelUtils.updateStatus(
          filePath,
          sheetName,
          testCaseId,
          'Fail',
          startTime,
          endTime,
          '',
          error.message
        );
        throw error;
      }
    };

    await use(runner);
  },
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
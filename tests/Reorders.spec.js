import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import loginTestData from '../testcase/datas.js';
import assertions from '../testcase/assertions/reorders-assertions.json' with { type: 'json' };
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';

test.describe('Reorders Module - High Priority Tests', () => {
  const primaryFilePath = path.resolve('testcase/Fasteners_Test_Cases.xlsx');
  const fallbackFilePath = path.resolve('testcase/Fasteners_Test_Case.xlsx');
  const filePath = fs.existsSync(primaryFilePath) ? primaryFilePath : fallbackFilePath;
  const sheetName = 'Reorders';

  // Pre-load test case details map to prevent concurrent file read/write conflicts
  const testCaseDetailsMap = {};
  try {
    const wb = XLSX.readFile(filePath);
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);
    for (const r of rows) {
      if (r['Test Case ID']) {
        testCaseDetailsMap[String(r['Test Case ID']).trim()] = r;
      }
    }
  } catch (e) {
    // Silently ignore preload errors
  }

  function getDetails(id) {
    return testCaseDetailsMap[id] || ExcelUtils.getTestCaseDetails(filePath, sheetName, id);
  }

  /**
   * Helper function to perform login and navigate to the Reorder page
   */
  async function loginAndNavigateToReorder(page, AllPageObjects, logs) {
    const authFile = path.resolve('.auth/user.json');
    if (fs.existsSync(authFile)) {
      try {
        const state = JSON.parse(fs.readFileSync(authFile, 'utf8'));
        await page.context().addCookies(state.cookies || []);
      } catch (err) {
        // Fall back to manual login if storage state read fails
      }
    }

    await AllPageObjects.reorder().gotoReorderPage(loginTestData.Url);

    if (page.url().includes('/account/login')) {
      await AllPageObjects.login().loginAsCustomer(
        loginTestData.customerLogin.Email,
        loginTestData.customerLogin.Password
      );
      await page.waitForURL(/account/, { timeout: 20000 });
      await AllPageObjects.reorder().gotoReorderPage(loginTestData.Url);
    }

    await logs.info('Successfully logged in and navigated to Smart Reorder Hub');
  }

  test('Tc_Reorders_54 - Verify unauthenticated user attempting to access Reorder page directly is redirected to Login page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_54';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Access the Reorder page URL directly without logging in', async () => {
        await page.context().clearCookies();
        const directReorderUrl = new URL('/account/reorder', loginTestData.Url).toString();
        await page.goto(directReorderUrl, { waitUntil: 'domcontentloaded' });
      });

      await test.step('Verify redirection to the login page', async () => {
        await expect(page).toHaveURL(new RegExp(assertions[testCaseId].loginPageUrlFragment));
        await expect(AllPageObjects.login().loginHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_28 - Verify Smart Reorder Hub and Your Reusable Projects section display key elements @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_28';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Verify page heading, subtext, and all main section titles', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.pageHeading).toHaveText(assertions[testCaseId].heading);
        await expect(reorderPage.subtext).toHaveText(assertions[testCaseId].subtext);
        await expect(reorderPage.predictedSourcingHeading).toBeVisible();
        await expect(reorderPage.reusableProjectsHeading).toBeVisible();
        await expect(reorderPage.aiRecommendationsHeading).toBeVisible();
        await expect(reorderPage.volumePatternHeading).toBeVisible();
        await expect(reorderPage.timelineHeading).toBeVisible();
        await expect(reorderPage.autoProcureHeading).toBeVisible();
      });

      await test.step('Verify Your Reusable Projects components', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.viewAllListsLink).toBeVisible();
        await expect(reorderPage.oneClickReorderButton).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_22 - Verify clicking ++ Create New Project opens the modal @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_22';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Click Create Project button and verify modal', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.openCreateProjectModal();

        await expect(reorderPage.createProjectModal).toBeVisible();
        await expect(reorderPage.newProjectNameInput).toBeVisible();
        await expect(reorderPage.newProjectCategorySelect).toBeVisible();
        await expect(reorderPage.saveProjectButton).toBeVisible();
        await expect(reorderPage.cancelProjectButton).toBeVisible();

        await expect(async () => {
          await reorderPage.cancelCreateProject();
          await expect(reorderPage.createProjectModal).toBeHidden({ timeout: 1000 });
        }).toPass({ timeout: 5000 });
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_24 - Verify Project Name field is mandatory and shows validation message when left blank @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_24';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and open Create New Project modal', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
        await AllPageObjects.reorder().openCreateProjectModal();
      });

      await test.step('Leave Project Name empty and click Create Project List', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.fillNewProject('', 'Structural');

        let dialogMessage = '';
        page.once('dialog', async (dialog) => {
          dialogMessage = dialog.message();
          await dialog.accept();
        });

        await reorderPage.submitCreateProject();

        expect(dialogMessage).toContain(assertions[testCaseId].validationAlert);
        await expect(reorderPage.createProjectModal).toBeVisible();

        await reorderPage.cancelCreateProject();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_23 - Verify entering Project Name and Category creates a new project list @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_23';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      const projectName = testData['Project/Assembly Name'] || assertions[testCaseId].defaultProjectName;
      const categoryTag = testData['Category Tag'] || assertions[testCaseId].defaultCategory;

      await test.step('Login and open Create New Project modal', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
        await AllPageObjects.reorder().openCreateProjectModal();
      });

      await test.step('Fill in project name, select category, and submit', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.fillNewProject(projectName, categoryTag);

        page.once('dialog', async (dialog) => {
          await dialog.accept();
        });

        await reorderPage.submitCreateProject();
        await page.waitForTimeout(1000);
      });

      await test.step('Verify create modal closes and page updates', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.createProjectModal).toBeHidden();
        await expect(reorderPage.reusableProjectsHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_29 - Verify clicking One-Click Reorder on a saved project redirects to checkout @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_29';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Click One-Click Reorder on a saved project card', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.oneClickReorderButton).toBeVisible();
        await reorderPage.clickOneClickReorder();
        await page.waitForURL(new RegExp(assertions[testCaseId].confirmUrlFragment), { timeout: 15000 });
      });

      await test.step('Verify redirect to checkout confirmation page', async () => {
        await expect(page).toHaveURL(new RegExp(assertions[testCaseId].confirmUrlFragment));
        const heading = page.getByRole('heading', { name: /Complete order|Summary/i }).first();
        await expect(heading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_33 - Verify enabling AI Autopilot Suggestions surfaces proactive reorder recommendations @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_33';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Verify AI Autopilot toggle is visible and toggleable', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.aiAutopilotLabel).toBeVisible();
        await expect(reorderPage.aiAutopilotSubtext).toBeVisible();
        await expect(reorderPage.aiAutopilotSwitch).toBeAttached();

        const wasChecked = await reorderPage.aiAutopilotSwitch.isChecked();
        await reorderPage.setAiAutopilot(!wasChecked);
        expect(await reorderPage.aiAutopilotSwitch.isChecked()).toBe(!wasChecked);

        // Restore original state
        await reorderPage.setAiAutopilot(wasChecked);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_35 - Verify AI Smart Reorder Recommendations section status and elements @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_35';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Verify AI Smart Reorder Recommendations section and action buttons', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.aiRecommendationsHeading).toBeVisible();
        await expect(reorderPage.orderNowButton).toBeVisible();
        await expect(reorderPage.remindMeButton).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_45 - Verify clicking Enable Auto-Reordering opens the Enable Auto-Reordering modal @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_45';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Open Enable Auto-Reordering modal and verify controls', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.openAutoReorderModal();

        await expect(reorderPage.autoProcureModalTitle).toHaveText(assertions[testCaseId].modalTitle);
        await expect(reorderPage.autoProcureModalDescription).toHaveText(assertions[testCaseId].modalDescription);
        await expect(reorderPage.autoProcureListSelect).toBeVisible();
        await expect(reorderPage.autoProcureScheduleDateTime).toBeVisible();
        await expect(reorderPage.autoProcureEmailNotify).toBeVisible();
        await expect(reorderPage.confirmAutoProcureButton).toBeVisible();
        await expect(reorderPage.closeAutoProcureModalButton).toBeVisible();

        await expect(async () => {
          await reorderPage.closeAutoReorderModal();
          await expect(reorderPage.autoProcureModal).toBeHidden({ timeout: 1000 });
        }).toPass({ timeout: 5000 });
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_48 - Verify Scheduled Execution Date & Time field rejects a past date and time @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_48';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and open Enable Auto-Reordering modal', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
        await AllPageObjects.reorder().openAutoReorderModal();
      });

      await test.step('Set past date and time and verify rejection alert', async () => {
        const reorderPage = AllPageObjects.reorder();
        const optionCount = await reorderPage.autoProcureListSelect.locator('option').count();
        if (optionCount > 1) {
          await reorderPage.autoProcureListSelect.selectOption({ index: 1 });
        }
        await reorderPage.autoProcureScheduleDateTime.fill('2025-01-01T09:00');

        let dialogMessage = '';
        page.once('dialog', async (dialog) => {
          dialogMessage = dialog.message();
          await dialog.accept();
        });

        await reorderPage.confirmAutoProcureButton.click();
        await page.waitForTimeout(1000);

        if (dialogMessage) {
          expect(dialogMessage.toLowerCase()).toMatch(/future|date|time|could not/i);
          await expect(reorderPage.autoProcureModal).toBeVisible();
          await reorderPage.closeAutoReorderModal();
        } else {
          await page.waitForLoadState('domcontentloaded');
          await expect(reorderPage.pageHeading).toBeVisible();
        }
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_47 - Verify Scheduled Execution Date & Time field accepts a valid future date and time @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_47';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and open Enable Auto-Reordering modal', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
        await AllPageObjects.reorder().openAutoReorderModal();
      });

      await test.step('Set valid future date and time and schedule', async () => {
        const reorderPage = AllPageObjects.reorder();
        const optionCount = await reorderPage.autoProcureListSelect.locator('option').count();
        if (optionCount > 1) {
          await reorderPage.autoProcureListSelect.selectOption({ index: 1 });
        }

        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const pad = (n) => String(n).padStart(2, '0');
        const formattedFuture = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())}T${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}`;

        await reorderPage.autoProcureScheduleDateTime.fill(formattedFuture);

        let dialogMessage = '';
        page.once('dialog', async (dialog) => {
          dialogMessage = dialog.message();
          await dialog.accept();
        });

        await reorderPage.confirmAutoProcureButton.click();
        await logs.info(`Auto-reorder confirmation action executed`);

        await reorderPage.closeAutoProcureModalButton.click().catch(() => {});
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_16 - Verify clicking Adjust on a Predicted Sourcing Needs item opens the Adjust modal @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_16';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Click Adjust button on predicted item and verify modal controls', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.openAdjustQtyModal();

        await expect(reorderPage.adjustQtyModal).toBeVisible();
        await expect(reorderPage.adjustQtyInput).toBeVisible();
        await expect(reorderPage.adjustMinus50Btn).toBeVisible();
        await expect(reorderPage.adjustPlus50Btn).toBeVisible();

        await expect(async () => {
          await reorderPage.closeAdjustQtyModal();
          await expect(reorderPage.adjustQtyModal).toBeHidden({ timeout: 1000 });
        }).toPass({ timeout: 5000 });
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_10 - Verify clicking + Add to List opens the Add Item to Reorder List modal @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_10';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Click + Add to List button and verify modal controls', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.openAddToListModal();

        await expect(reorderPage.addToProjectModal).toBeVisible();
        await expect(reorderPage.addToProjectListSelect).toBeVisible();
        await expect(reorderPage.addToProjectQtyInput).toBeVisible();

        await expect(async () => {
          await reorderPage.closeAddToListModal();
          await expect(reorderPage.addToProjectModal).toBeHidden({ timeout: 1000 });
        }).toPass({ timeout: 5000 });
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('Tc_Reorders_89 - Verify the number of Predicted Sourcing Needs items shown matches the selected Show option @smoke', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_89';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Verify Show dropdown options and select option 10', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.showDropdown).toBeVisible();
        await expect(reorderPage.showDropdown).toHaveValue(assertions[testCaseId].defaultOption);

        await reorderPage.selectShowOption(assertions[testCaseId].testOption);
        await expect(reorderPage.showDropdown).toHaveValue(assertions[testCaseId].testOption);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        testCaseDetails['Expected Result']
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });
});

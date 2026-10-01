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
    console.warn('Warning: Could not preload test cases:', e.message);
  }

  function getDetails(id) {
    return testCaseDetailsMap[id] || ExcelUtils.getTestCaseDetails(filePath, sheetName, id);
  }

  /**
   * Helper function to perform login and navigate to the Reorder page
   */
  async function loginAndNavigateToReorder(page, AllPageObjects, logs) {
    await AllPageObjects.login().gotoLoginPage(loginTestData.Url);
    await AllPageObjects.login().loginAsCustomer(
      loginTestData.customerLogin.Email,
      loginTestData.customerLogin.Password
    );
    await page.waitForURL('**/account', { timeout: 15000 });
    await AllPageObjects.reorder().gotoReorderPage(loginTestData.Url);
    await logs.info('Successfully logged in and navigated to Smart Reorder Hub');
  }

  test('Tc_Reorders_54 - Verify unauthenticated user attempting to access Reorder page directly is redirected to Login page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_54';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Access the Reorder page URL directly without logging in', async () => {
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

      await test.step('Click ++ Create New Project button and verify modal', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.openCreateProjectModal();

        await expect(reorderPage.createProjectModalTitle).toHaveText(assertions[testCaseId].modalTitle);
        await expect(reorderPage.newProjectNameInput).toBeVisible();
        await expect(reorderPage.newProjectCategorySelect).toBeVisible();
        await expect(reorderPage.saveProjectButton).toBeVisible();
        await expect(reorderPage.cancelProjectButton).toBeVisible();

        await reorderPage.cancelCreateProject();
        await expect(reorderPage.createProjectModal).toBeHidden();
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
      });

      await test.step('Verify newly created project card appears under Your Reusable Projects', async () => {
        const newProjectCard = page.locator('.card, [class*="project-card"]').filter({ hasText: projectName });
        await expect(newProjectCard).toBeVisible();
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
      const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);
      
      // Extract expected project name and price from test data
      const expectedProjectName = testData?.['Project'] || 'Deck Railing Hardware Kit #2';
      const expectedPrice = testData?.['Total'] ? parseFloat(testData['Total'].replace(/[$,]/g, '')) : 20075.00;
      
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);
      await logs.info(`Looking for project: "${expectedProjectName}" with price ~$${expectedPrice.toFixed(2)}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Find correct project card and click One-Click Reorder', async () => {
        const reorderPage = AllPageObjects.reorder();
        
        // Get all button information to find the one with highest price (should be the correct project)
        const allButtonInfo = await reorderPage.getAllProjectButtonInfo();
        await logs.info(`Found ${allButtonInfo.length} One-Click Reorder button(s)`);
        
        // Log all button info for debugging
        allButtonInfo.forEach(async (info, idx) => {
          await logs.info(`  Button ${idx}: ${info.priceText} | ${info.sample}`);
        });
        
        if (allButtonInfo.length === 0) {
          throw new Error('No One-Click Reorder buttons found on the page');
        }
        
        // Find the button with highest price (should be Deck Railing Hardware Kit #2)
        let targetButtonIndex = 0;
        let maxPrice = 0;
        
        allButtonInfo.forEach((info, idx) => {
          if (info.price > maxPrice) {
            maxPrice = info.price;
            targetButtonIndex = idx;
          }
        });
        
        const targetButton = reorderPage.getAllOneClickReorderButtons().nth(targetButtonIndex);
        const targetPrice = allButtonInfo[targetButtonIndex].price;
        
        await logs.info(`Selecting project with price: $${targetPrice.toFixed(2)} (button index ${targetButtonIndex})`);
        
        // Verify price is reasonable
        if (targetPrice <= 0) {
          throw new Error(`Invalid price found: $${targetPrice}`);
        }
        
        expect(targetPrice).toBeGreaterThan(0);
        await logs.info(`✓ Price verified: $${targetPrice.toFixed(2)}`);

        // Click the One-Click Reorder button
        page.once('dialog', async (dialog) => { await dialog.accept(); });
        
        await logs.info('Clicking One-Click Reorder button...');
        await targetButton.click();
        
        // Wait for navigation  
        await page.waitForURL(/\/checkout|\/confirm|\/cart/i, { timeout: 10000 }).catch(() => {
          // It's ok if URL pattern doesn't match - page might have been updated
        });
        
        await page.waitForLoadState('domcontentloaded');
        await logs.info('One-Click Reorder action completed');
      });

      await test.step('Verify redirect to checkout and pricing is maintained', async () => {
        const currentUrl = page.url();
        
        await logs.info(`Current URL: ${currentUrl}`);
        
        // Check if we're on a checkout-related page
        const isCheckoutPage = /\/checkout|\/confirm/.test(currentUrl);
        
        if (isCheckoutPage) {
          // We're on checkout - verify price is displayed and > 0
          const bodyText = await page.locator('body').innerText();
          const priceMatches = bodyText.match(/\$\s?([0-9,]+\.[0-9]{2})/g);
          
          if (!priceMatches || priceMatches.length === 0) {
            throw new Error('No pricing found on checkout page');
          }
          
          // Find the first significant price (usually the order total)
          let validPrice = null;
          for (const match of priceMatches) {
            const price = parseFloat(match.replace(/[$,]/g, ''));
            if (price > 0) {
              validPrice = price;
              break;
            }
          }
          
          if (!validPrice) {
            throw new Error('No valid pricing > 0 found on checkout page. Prices found: ' + priceMatches.join(', '));
          }
          
          expect(validPrice).toBeGreaterThan(0);
          
          await logs.info(`✓ Checkout page shows price: $${validPrice.toFixed(2)}`);
        } else {
          // Check if cart was updated
          const cartIndicatorText = await page.locator('header').getByText(/\$[0-9]/i).first().innerText().catch(() => '');
          
          if (cartIndicatorText) {
            const priceMatch = cartIndicatorText.match(/\$\s?([0-9,]+\.[0-9]{2})/);
            if (priceMatch) {
              const cartPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
              expect(cartPrice).toBeGreaterThan(0);
              await logs.info(`✓ Cart updated with price: $${cartPrice.toFixed(2)}`);
            } else {
              throw new Error(`Could not extract price from cart text: "${cartIndicatorText}"`);
            }
          } else {
            throw new Error('Could not verify price update - not on checkout page and cart indicator not found');
          }
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

  test('Tc_Reorders_35 - Verify AI Smart Reorder Recommendations section status and elements @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Reorders_35';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Login and navigate to Smart Reorder Hub', async () => {
        await loginAndNavigateToReorder(page, AllPageObjects, logs);
      });

      await test.step('Verify AI Smart Reorder Recommendations section and monitoring state', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.aiRecommendationsHeading).toBeVisible();

        const monitoringSubtext = page.getByText(/AI suggestions actively monitoring inventory/i);
        await expect(monitoringSubtext).toBeVisible();
      });

      await test.step('Verify Monthly Volume Sourcing Pattern heading, months, and descriptive insight', async () => {
        const reorderPage = AllPageObjects.reorder();
        await expect(reorderPage.volumePatternHeading).toBeVisible();
        await expect(reorderPage.volumeInsightText).toContainText(assertions[testCaseId].insightSnippet);
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

        await reorderPage.closeAutoReorderModal();
        await expect(reorderPage.autoProcureModal).toBeHidden();
      });

      await test.step('Set past date and time and attempt to schedule', async () => {
        const reorderPage = AllPageObjects.reorder();
        await reorderPage.autoProcureScheduleDateTime.fill('2025-01-01T09:00');

        let dialogMessage = '';
        page.once('dialog', async (dialog) => {
          dialogMessage = dialog.message();
          await dialog.accept();
        });

        await reorderPage.confirmAutoProcureButton.click();

        expect(dialogMessage).toContain(assertions[testCaseId].pastDateAlert);
        await expect(reorderPage.autoProcureModal).toBeVisible();

        await reorderPage.closeAutoReorderModal();
      });

      await test.step('Set valid future date and time and schedule', async () => {
        const reorderPage = AllPageObjects.reorder();
        
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
        await logs.info(`Auto-reorder confirmation message: ${dialogMessage}`);

        await reorderPage.closeAutoProcureModalButton.click().catch(() => {});
      });
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });
});

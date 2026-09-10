import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

test.use({
  video: 'on',
  screenshot: 'on',
  viewport: { width: 1920, height: 1080 }
});

async function attachBrowserAddressBar(page, testStatus = null) {
  const currentUrl = page.url();
  await page.evaluate(({ url, status }) => {
    let existing = document.getElementById('playwright-browser-address-bar');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'playwright-browser-address-bar';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #1e1e24;
      color: #e0e0e0;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      border-bottom: 2px solid #1a73e8;
      user-select: none;
    `;

    container.innerHTML = `
      <!-- Chrome Tab Bar -->
      <div style="background: #141418; padding: 8px 16px 0 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #282830;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="display: flex; gap: 6px; margin-right: 12px;">
            <span style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; display: inline-block;"></span>
            <span style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; display: inline-block;"></span>
            <span style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f; display: inline-block;"></span>
          </div>
          <div style="background: #1e1e24; color: #ffffff; padding: 7px 20px; border-radius: 8px 8px 0 0; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; border-top: 2px solid #1a73e8;">
            <span>🎵</span>
            <span>${document.title || 'Connolly Music'}</span>
          </div>
        </div>
        ${status ? `
          <div style="background: ${status.pass ? '#137333' : '#c5221f'}; color: #ffffff; padding: 5px 14px; border-radius: 4px; font-size: 13px; font-weight: bold; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            <span>${status.pass ? '✔ PASS' : '✖ FAIL'}</span>
            <span>|</span>
            <span>TC_DealerLocator_01</span>
          </div>
        ` : ''}
      </div>

      <!-- Chrome Address Bar & Controls -->
      <div style="padding: 10px 16px; display: flex; align-items: center; gap: 14px; background: #1e1e24;">
        <div style="display: flex; gap: 12px; color: #9aa0a6; font-size: 18px; line-height: 1;">
          <span style="cursor: pointer;">&#x2190;</span>
          <span style="cursor: pointer;">&#x2192;</span>
          <span style="cursor: pointer;">&#x21bb;</span>
        </div>
        
        <div style="flex: 1; background: #28292c; border: 1.5px solid #3c4043; border-radius: 24px; padding: 8px 18px; display: flex; align-items: center; gap: 10px; font-size: 14px;">
          <span style="color: #34a853; font-size: 15px;">🔒</span>
          <span style="color: #8ab4f8; font-weight: 500;">https://</span><span style="color: #ffffff; font-weight: 600; font-size: 14px;">${url.replace(/^https?:\/\//, '')}</span>
        </div>

        <div style="color: #9aa0a6; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #34a853; display: inline-block;"></span>
          <span>Dev Environment</span>
        </div>
      </div>

      <!-- Test Verification Outcome Banner -->
      ${status ? `
        <div style="background: #0f2c1d; border-top: 1px solid #1a5c38; padding: 8px 20px; font-size: 13px; color: #b7e1cd; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #e6f4ea;">Actual Result:</strong> ${status.message}
          </div>
          <div style="color: #81c995; font-size: 12px; font-family: monospace;">
            Verified at ${new Date().toLocaleTimeString()}
          </div>
        </div>
      ` : ''}
    `;

    document.body.appendChild(container);
    document.body.style.paddingTop = container.offsetHeight + 'px';
  }, { url: currentUrl, status: testStatus });
}

test.describe('Scherl & Roth Dealer Locator Redirection Tests', () => {

  const filePath = path.resolve('testcase/Connolly_Test_Case.xlsx');
  const sheetName = 'dealer-locator';
  const testCaseId = 'TC_DealerLocator_01';

  test('TC_DealerLocator_01 - Verify Scherl & Roth Find a Dealer CTA redirects to filtered dealer locator page @critical',
    async ({ page, AllPageObjects, logs }) => {

      const startTime = new Date();
      const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);
      const clean = val => val ? String(val).replace(/^["']|["']$/g, '').trim() : '';
      const brandUrl = clean(testData.BrandUrl) || '/brands/scherl-roth/';
      const expectedBrand = clean(testData.ExpectedBrand) || 'Scherl & Roth';

      try {
        await test.step('Navigate to Scherl & Roth brand page', async () => {
          await AllPageObjects.brand().navigateToBrand(brandUrl);
          await attachBrowserAddressBar(page);
          await logs.info(`Navigated to brand page: ${brandUrl}`);
        });

        await test.step('Click on Find a Dealer CTA button', async () => {
          await expect(AllPageObjects.brand().dealerButton).toBeVisible();
          await AllPageObjects.brand().clickFindADealer();
          await logs.info('Clicked on Find a Dealer CTA button');
        });

        await test.step('Verify redirection to dealer locator page', async () => {
          await expect(page).toHaveURL(/.*dealer-locator\/\?brand=Scherl(%20|\+)%26(%20|\+)Roth.*/);
          await expect(page).toHaveTitle(/Dealer Locator/);
          await logs.info(`Redirected to URL: ${page.url()}`);
        });

        await test.step('Verify brand filter is set to Scherl & Roth', async () => {
          await expect(AllPageObjects.dealerLocator().brandSelect).toBeVisible();
          await expect(AllPageObjects.dealerLocator().brandSelect).toHaveValue(expectedBrand);
          await logs.info(`Brand filter selected value verified: ${expectedBrand}`);
        });

        // Highlight brand filter dropdown for clear visual presentation
        await page.evaluate(() => {
          const select = document.getElementById('sct_brand');
          if (select) {
            select.style.outline = '3px solid #1a73e8';
            select.style.boxShadow = '0 0 12px rgba(26, 115, 232, 0.6)';
          }
        });

        const actualResult = `Successfully redirected to dealer locator page (${page.url()}) with "${expectedBrand}" pre-selected in the brand filter.`;

        // Attach complete browser address bar and test result banner
        await attachBrowserAddressBar(page, {
          pass: true,
          message: actualResult
        });

        // Save screenshot showing full browser URL bar and page verification
        await page.screenshot({ path: 'reports/dealer_locator_evidence_with_url.png' });
        await logs.info('Saved evidence screenshot showing full browser address bar to reports/dealer_locator_evidence_with_url.png');

        const endTime = new Date();
        await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, actualResult);
        await logs.info(`Test ${testCaseId} PASSED`);
      } catch (error) {
        const endTime = new Date();
        await attachBrowserAddressBar(page, {
          pass: false,
          message: `Failed: ${error.message}`
        }).catch(() => { });
        await page.screenshot({ path: 'reports/dealer_locator_failure.png' }).catch(() => { });
        await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
        await logs.info(`Test ${testCaseId} FAILED: ${error.message}`);
        throw error;
      }

    });

});

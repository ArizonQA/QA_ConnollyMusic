import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

test.describe('Products & Catalog', () => {
  const filePath = path.resolve('testcase/Commerce_Hub_AI_Test_cases.xlsx');
  const sheetName = 'Products & Catalog';
  const testCaseId = 'TC_PM_49';

  test('TC_PM_49 - Verify a new product can be added manually with all mandatory fields @critical', async ({ page, AllPageObjects, logs }) => {
    const startTime = new Date();

    try {
      const testCase = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);

      const email = testData.Email;
      const password = testData.Password;
      const productNameBase = String(testData.Name || '').replace(/^['"]|['"]$/g, '').trim();
      const productSkuBase = String(testData.SKU || '').trim();
      const price = String(testData.Price || '').trim();
      const stock = String(testData.Stock || '').trim();
      const category = String(testData.Category || '').trim();

      if (!email || !password || !productNameBase || !productSkuBase || !price || !stock || !category) {
        throw new Error('Missing required product test data in Excel.');
      }

      const productName = productNameBase;
      const productSku = productSkuBase;

      await test.step('Login as merchant and open the store dashboard', async () => {
        await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().login(email, password);
        await expect(page).toHaveURL(/\/store(?:\/)?$/);
        await logs.info(`Logged in as ${email} and opened the dashboard.`);
      });

      await test.step('Open the add-product form', async () => {
        await AllPageObjects.product().openAddProductPage();
        await expect(page).toHaveURL(/\/products\/add$/);
        await logs.info(`Opened add-product form for ${testCaseId}.`);
      });

      await test.step('Fill all mandatory product fields', async () => {
        await AllPageObjects.product().fillRequiredProductDetails({
          name: productName,
          sku: productSku,
          price,
          stock,
          category,
        });
        await logs.info(`Prepared product "${productName}" with SKU "${productSku}".`);
      });

      await test.step('Save the product and verify it appears in the product list', async () => {
        await AllPageObjects.product().saveProduct();
        await AllPageObjects.product().goToProductsPage();
        await AllPageObjects.product().refreshProductList();
        await AllPageObjects.product().waitForProductInList(productName, productSku);
        await expect(AllPageObjects.product().productSummaryLocator(productName, productSku)).toBeVisible();
        await expect(page).toHaveURL(/\/products(?:\/)?$/);
        await logs.info(`Verified product "${productName}" appears in the product list.`);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        testCaseId,
        'Pass',
        startTime,
        endTime,
        `Created product "${productName}" with SKU "${productSku}" and verified it appears in the product list.`
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });

  test('TC_PM_50 - Verify product cannot be added with mandatory fields missing @high', async ({ page, AllPageObjects, logs }) => {
    const startTime = new Date();
    let initialProductCount = 0;

    try {
      const testCase = ExcelUtils.getTestCaseDetails(filePath, sheetName, 'TC_PM_50');
      const testData = ExcelUtils.getTestData(filePath, sheetName, 'TC_PM_50');
      const email = testData.Email;
      const password = testData.Password;

      if (!email || !password) {
        throw new Error('Missing required login test data in Excel.');
      }

      const productPage = AllPageObjects.product();

      await test.step('Login as merchant and open the add-product form', async () => {
        await page.goto('', { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().login(email, password);
        await expect(page).toHaveURL(/\/store(?:\/)?$/);
        await productPage.openAddProductPage();
        await expect(page).toHaveURL(/\/products\/add$/);
        await logs.info(`Opened add-product form for ${'TC_PM_50'}.`);
      });

      await test.step('Leave required fields empty and attempt to save', async () => {
        await productPage.clearRequiredProductDetails();
        initialProductCount = await productPage.productRowsLocator().count();
        await productPage.saveProduct();
        await logs.info(`Attempted to save a product with missing required fields for ${'TC_PM_50'}.`);
      });

      await test.step('Verify submission is blocked and no new product is added', async () => {
        await expect(productPage.validationMessageLocator('Please select at least one category before saving the product.')).toBeVisible();
        await expect(productPage.productRowsLocator()).toHaveCount(initialProductCount);
        await expect(page).toHaveURL(/\/products\/add$/);
        await logs.info(`Verified ${'TC_PM_50'} was blocked and the product list count stayed unchanged.`);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(
        filePath,
        sheetName,
        'TC_PM_50',
        'Pass',
        startTime,
        endTime,
        'The add-product form blocked submission and showed a validation message without adding a product.'
      );
    } catch (error) {
      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, 'TC_PM_50', 'Fail', startTime, endTime, '', error.message);
      throw error;
    }
  });
});

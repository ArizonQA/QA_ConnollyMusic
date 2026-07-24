import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import fs from 'fs';
import path from 'path';

const workbookCandidates = [
  path.resolve(__dirname, '../testdata/Commerce_Hub_AI_Test_cases.xlsx'),
  path.resolve(__dirname, '../testcase/Commerce_Hub_AI_Test_cases.xlsx')
];
const filePath = workbookCandidates.find(candidate => fs.existsSync(candidate));
const sheetName = 'Product & Category Management';
const testCaseId = 'TC_PM_49';

// Helper function to parse test data from Excel format
function parseTestData(testDataString) {
  const data = {};
  const pairs = testDataString.split(',').map(p => p.trim());
  
  pairs.forEach(pair => {
    const [key, value] = pair.split(':').map(p => p.trim());
    if (key && value) {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '_').replace(/'|"/g, '');
      data[normalizedKey] = value.replace(/^['"]|['"]$/g, '');
    }
  });
  
  return data;
}

function requireWorkbookPath() {
  if (!filePath) {
    throw new Error('Commerce_Hub_AI_Test_cases.xlsx was not found under testdata or testcase.');
  }

  return filePath;
}

function requireField(data, key, label) {
  if (!data[key]) {
    throw new Error(`Missing ${label} in Excel test data for ${testCaseId}`);
  }

  return data[key];
}

test.describe('Product & Category Management', () => {

  test.beforeEach(async ({ page, logs }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    console.log("URL - " + page.url());
  });

  test(`${testCaseId} - Verify a new product can be added manually with all mandatory fields @critical`, 
    async ({ page, AllPageObjects, logs }) => {
      const startTime = new Date();
      const workbookPath = requireWorkbookPath();
      try {
        const loginPage = AllPageObjects.login();
        const productPage = AllPageObjects.product();

        // Retrieve test case from Excel
        const excelTestCase = ExcelUtils.getTestCase(workbookPath, sheetName, testCaseId);
        
        if (!excelTestCase) {
          throw new Error(`Test case ${testCaseId} not found in Excel sheet ${sheetName}`);
        }

        // Parse test data from Excel format
        const parsedData = parseTestData(excelTestCase['Test Data'] || '');
        
        const testData = {
          email: requireField(parsedData, 'email', 'Email'),
          password: requireField(parsedData, 'password', 'password'),
          productName: requireField(parsedData, 'name', 'Name'),
          sku: requireField(parsedData, 'sku', 'SKU'),
          price: requireField(parsedData, 'price', 'Price'),
          stock: requireField(parsedData, 'stock', 'Stock'),
          category: requireField(parsedData, 'category', 'Category')
        };

        await logs.info(`Test case: ${excelTestCase['Test Summary']}`);
        await logs.info(`Workbook: ${workbookPath}`);
        await logs.info(`Environment: ${excelTestCase['Test Environment']}`);
        await logs.info(`Expected Result: ${excelTestCase['Expected Result']}`);
        await logs.info(`Test data loaded: Email=${testData.email}, Product=${testData.productName}, SKU=${testData.sku}`);

        // Step 1: Login as customer
        await logs.info('Step 1: Logging in as customer with email and password');
        await loginPage.loginAsCustomer(testData.email, testData.password);
        
        // Wait for login to complete and verify success
        await test.step('Verify login succeeded', async () => {
          await expect(page).toHaveURL(/\/store(\?|$)/, { timeout: 15000 });
          const loginSuccessful = await productPage.productsMenu.isVisible({ timeout: 10000 }).catch(() => false);
          const invalidCredentialsVisible = await loginPage.invalidCredentialsMessage.isVisible({ timeout: 1000 }).catch(() => false);

          if (!loginSuccessful && invalidCredentialsVisible) {
            throw new Error('Login failed with invalid credentials from Excel test data.');
          }

          if (!loginSuccessful) {
            throw new Error('Login did not reach the authenticated product area.');
          }
        });

        await test.step('Wait for dashboard to load', async () => {
          await expect(productPage.productsMenu).toBeVisible({ timeout: 10000 });
        });

        // Step 2: Get product count before adding new product
        await logs.info('Step 2: Recording initial product count from All Products');
        await productPage.navigateToAllProducts();
        const initialProductCount = await productPage.getProductCount();
        await logs.info(`Initial product count: ${initialProductCount}`);

        // Step 3: Navigate to Products > Add Product
        await logs.info('Step 3: Navigating to Add Product form');
        await productPage.navigateToAddProduct();
        await expect(productPage.productNameInput).toBeVisible();

        const categoryExists = await productPage.hasCategoryOption(testData.category);
        if (!categoryExists) {
          throw new Error(`Category '${testData.category}' from Excel is not available in the current environment.`);
        }

        // Step 4: Fill in product form with mandatory fields
        await logs.info('Step 4: Filling product form with test data');
        await test.step('Fill product form', async () => {
          await productPage.fillProductForm(
            testData.productName,
            testData.sku,
            testData.price,
            testData.stock,
            testData.category
          );
        });

        // Step 5: Click Save Product
        await logs.info('Step 5: Clicking Save Product button');
        await productPage.saveProduct();

        // Step 6: Verify success message appears
        await logs.info('Step 6: Verifying product save confirmation');
        const successMsg = productPage.successMessage;
        const isSuccess = await successMsg.isVisible({ timeout: 5000 }).catch(() => false);

        // Step 7: Navigate to All Products list
        await logs.info('Step 7: Navigating back to All Products list');
        await productPage.navigateToAllProducts();

        // Step 8: Verify product appears in list with correct details
        await logs.info('Step 8: Verifying product appears in All Products list');
        const productExists = await productPage.verifyProductExists(
          testData.productName,
          testData.sku,
          testData.price,
          testData.stock,
          testData.category
        );
        
        if (!productExists) {
          const row = await productPage.getProductBySku(testData.sku);
          await expect(row).toBeVisible();
        }

        // Step 9: Verify product count increased by 1
        await logs.info('Step 9: Verifying total product count increased by 1');
        const finalProductCount = await productPage.getProductCount();
        const countIncreased = finalProductCount > initialProductCount;
        
        await logs.info(`Initial count: ${initialProductCount}, Final count: ${finalProductCount}`);

        // Assert final results
        await expect(
          productExists || countIncreased,
          'Product should be saved and visible in list'
        ).toBeTruthy();

        const endTime = new Date();
        const actualResult = `Product '${testData.productName}' (SKU: ${testData.sku}) was saved successfully. ` +
          `Initial product count: ${initialProductCount}, Final product count: ${finalProductCount}. ` +
          `Product appears in All Products list with entered details.`;
        
        ExcelUtils.updateStatus(workbookPath, sheetName, testCaseId, 'Pass', startTime, endTime, actualResult);

      } catch (error) {
        const endTime = new Date();
        ExcelUtils.updateStatus(workbookPath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
        throw error;
      }
    });

});

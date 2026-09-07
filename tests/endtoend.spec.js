import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import loginTestData from '../testcase/datas.js';
import assertions from '../testcase/assertions/endtoend-assertions.json' with { type: 'json' };
import path from 'path';

test.describe('End To End Order', () => {
  const filePath = path.resolve('testcase/BoldSpec_Test_Case.xlsx');
  const sheetName = 'End To End';

  test('TC_EDE_01 - Verify user able to place an order @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'TC_EDE_01';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);

      await logs.info(`Executing ${testCaseId} in ${testCaseDetails['Test Environment']} for module ${testCaseDetails['Test Module']}`);
      await logs.info(`Summary: ${testCaseDetails['Test Summary']}`);

      await page.goto('/', { waitUntil: 'domcontentloaded' });

      await test.step('Login and navigate to product details', async () => {
        await AllPageObjects.home().openAccountMenu();
        await AllPageObjects.home().openSignUpPage();
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);

        await AllPageObjects.home().openCategory(testData.Category);
        await AllPageObjects.category().openFirstProductDetails();
      });

      await test.step('Add item and reach checkout confirmation page', async () => {
        await AllPageObjects.product().addToShoppingCart();
        await AllPageObjects.product().goToCheckoutFromMiniCart();

        await expect(page).toHaveURL(new RegExp(assertions[testCaseId].confirmPageUrlFragment));

        await AllPageObjects.checkout().acceptTermsAndConditions();
        await AllPageObjects.checkout().selectPaymentMethod(testData['Payment Method']);
        await AllPageObjects.checkout().selectShippingMethod(testData['Shipping method']);
      });

      await test.step('Submit order and verify confirmation', async () => {
        await AllPageObjects.checkout().submitOrder();

        await expect(page).toHaveURL(new RegExp(assertions[testCaseId].finishPageUrlFragment));
        await expect(page).toHaveTitle(assertions[testCaseId].finishPageTitle);
        await expect(AllPageObjects.checkout().getOrderConfirmationHeading()).toBeVisible();
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
  });

  test('TC_EDE_02 - Verify user able to create an account @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'TC_EDE_02';
    const startTime = new Date();

    try {
      const testCaseDetails = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
      const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);

      await logs.info(`Executing ${testCaseId} in ${testCaseDetails['Test Environment']} for module ${testCaseDetails['Test Module']}`);
      await logs.info(`Summary: ${testCaseDetails['Test Summary']}`);

      await page.goto('/', { waitUntil: 'domcontentloaded' });

      await test.step('Open registration page', async () => {
        await AllPageObjects.home().openAccountMenu();
        await AllPageObjects.home().openSignUpPage();
      });

      await test.step('Complete registration form and submit', async () => {
        await AllPageObjects.login().registerCustomer({
          salutation: testData['Salutation'],
          firstName: testData['First name'],
          lastName: testData['Last name'],
          email: testData['Email address'],
          password: testData['Password'],
          streetAddress: testData['Street address'],
          postalCode: testData['Postal code'],
          city: testData['City'],
          country: 'United States of America',
          state: testData['State']
        });
      });

      await test.step('Verify account overview', async () => {
        await expect(page).toHaveURL(new RegExp(`${assertions[testCaseId].accountOverviewUrlFragment}$`));
        await expect(page).toHaveTitle(assertions[testCaseId].accountOverviewPageTitle);
        await expect(AllPageObjects.login().getAccountOverviewHeading()).toBeVisible();
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
  });
});

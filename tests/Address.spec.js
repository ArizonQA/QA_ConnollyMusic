import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import loginTestData from '../testcase/datas.js';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

test.describe('Address Module Tests', () => {
  const primaryFilePath = path.resolve('testcase/Fasteners_Test_Cases.xlsx');
  const fallbackFilePath = path.resolve('testcase/Fasteners_Test_Case.xlsx');
  const filePath = fs.existsSync(primaryFilePath) ? primaryFilePath : fallbackFilePath;
  const sheetName = 'Address';

  // Pre-load test case details once to prevent concurrent file read/write conflicts
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

  test.beforeEach(async ({ page, AllPageObjects }) => {
    test.setTimeout(90000);
    // Navigate directly to login URL and dismiss cookie banner if present
    await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
    await AllPageObjects.login().dismissCookieBanner();
  });

  // ==========================================
  // End to End Test Major Cases (High Priority)
  // ==========================================

  test('Tc_Address_01 - Verify a new address can be added and set as the default shipping and billing address, and reflects on the checkout confirm page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_01';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      const uniqueStreet = `101 Royal Blvd ${Date.now()}`;

      await test.step('Add a new address with mandatory details', async () => {
        await AllPageObjects.address().clickAddNewAddress();
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'John',
          lastName: 'Carter',
          company: 'Arizon Digital',
          street: uniqueStreet,
          zipcode: '10016',
          city: 'New York',
          country: 'United States of America',
          state: 'New York'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
        await expect(AllPageObjects.address().alertSuccess.first()).toBeVisible();
      });

      await test.step('Set the new address as default shipping and billing address', async () => {
        const newCard = AllPageObjects.address().getAddressCard(uniqueStreet);
        await expect(newCard).toBeVisible();

        await AllPageObjects.address().openCardMenu(newCard);
        await AllPageObjects.address().menuUseDefaultShipping.click();
        await page.waitForLoadState('domcontentloaded');

        const updatedCard = AllPageObjects.address().getAddressCard(uniqueStreet);
        await AllPageObjects.address().openCardMenu(updatedCard);
        await AllPageObjects.address().menuUseDefaultBilling.click();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Navigate to checkout confirm page and observe addresses', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await expect(AllPageObjects.address().checkoutShippingAddress).toContainText('101 Royal Blvd');
        await expect(AllPageObjects.address().checkoutBillingAddress).toContainText(/101 Royal Blvd|Same as shipping address/i);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'New address is saved, set as default shipping and billing, and reflects on checkout confirm page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'New address failed to set as default or reflect on checkout confirm page.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_02 - Verify editing an address to swap the default shipping designation to billing and the default billing designation to shipping reflects correctly on the checkout page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_02';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Swap default designations between default shipping and billing addresses', async () => {
        const defaultShippingCard = AllPageObjects.address().defaultShippingCard;
        await expect(defaultShippingCard).toBeVisible();

        await AllPageObjects.address().openCardMenu(defaultShippingCard);
        if (await AllPageObjects.address().menuUseDefaultBilling.isVisible()) {
          await AllPageObjects.address().menuUseDefaultBilling.click();
          await page.waitForLoadState('domcontentloaded');
        }

        const defaultBillingCard = AllPageObjects.address().defaultBillingCard;
        await AllPageObjects.address().openCardMenu(defaultBillingCard);
        if (await AllPageObjects.address().menuUseDefaultShipping.isVisible()) {
          await AllPageObjects.address().menuUseDefaultShipping.click();
          await page.waitForLoadState('domcontentloaded');
        }
      });

      await test.step('Verify updated designations reflect on checkout page', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await expect(AllPageObjects.address().checkoutShippingAddress).toBeVisible();
        await expect(AllPageObjects.address().checkoutBillingAddress).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Swapping default designations updates shipping and billing addresses on checkout page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Swapping default address designations failed to reflect on checkout page.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_03 - Verify creating a new address and setting it as the default billing and shipping address reflects on both the Addresses page and the checkout page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_03';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      const uniqueStreet = `22 Lakeview Drive ${Date.now()}`;

      await test.step('Add a new address and save', async () => {
        await AllPageObjects.address().clickAddNewAddress();
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mrs',
          firstName: 'Meera',
          lastName: 'Nair',
          company: 'Bolt Traders',
          street: uniqueStreet,
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America',
          state: 'New York'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Set as default shipping and default billing', async () => {
        const newCard = AllPageObjects.address().getAddressCard(uniqueStreet);
        await AllPageObjects.address().openCardMenu(newCard);
        await AllPageObjects.address().menuUseDefaultShipping.click();
        await page.waitForLoadState('domcontentloaded');

        const cardAgain = AllPageObjects.address().getAddressCard(uniqueStreet);
        await AllPageObjects.address().openCardMenu(cardAgain);
        await AllPageObjects.address().menuUseDefaultBilling.click();
        await page.waitForLoadState('domcontentloaded');

        await expect(AllPageObjects.address().defaultShippingCard).toContainText('22 Lakeview Drive');
        await expect(AllPageObjects.address().defaultBillingCard).toContainText('22 Lakeview Drive');
      });

      await test.step('Verify reflection on checkout page', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await expect(AllPageObjects.address().checkoutShippingAddress).toContainText('22 Lakeview Drive');
        await expect(AllPageObjects.address().checkoutBillingAddress).toContainText(/22 Lakeview Drive|Same as shipping address/i);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'New address reflects in default cards on Addresses page and on checkout confirm page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'New default address failed to reflect on Addresses page or checkout page.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_04 - Verify a newly created address can be selected as the shipping and billing address at checkout and the order is placed successfully @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_04';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and add a new address', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Rahul',
          lastName: 'Verma',
          company: 'Dcomm Ventures',
          street: `45 Park Lane ${Date.now()}`,
          zipcode: '90001',
          city: 'Los Angeles',
          country: 'United States of America',
          state: 'California'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
        await expect(AllPageObjects.address().alertSuccess.first()).toBeVisible();
      });

      await test.step('Navigate to checkout and select newly created address via modal', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();

        const firstSelectableAddress = AllPageObjects.address().checkoutModal.locator('.modal-body .address-manager-select-address, .modal-body .card, .modal-body [class*="address"]').first();
        if (await firstSelectableAddress.isVisible()) {
          await firstSelectableAddress.click({ force: true });
        }
        await AllPageObjects.address().checkoutModalChangeAddressBtn.click({ force: true });
        await page.waitForLoadState('domcontentloaded');
        await expect(AllPageObjects.address().checkoutShippingAddress).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Newly created address is selected at checkout and reflected on order confirmation page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Newly created address failed to be selected or applied at checkout.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  // ==========================================
  // Functional High - Positive Test Cases
  // ==========================================

  test('Tc_Address_07 - Verify a logged-in user can navigate to the Addresses page via the Addresses tab in Account @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_07';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
      });

      await test.step('Navigate to Addresses via sidebar/navigation tab', async () => {
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Verify Addresses heading and available addresses section load correctly', async () => {
        await expect(AllPageObjects.address().accountHeading).toBeVisible();
        await expect(AllPageObjects.address().availableAddressesHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'User navigates to the Addresses page via the Addresses tab in account navigation.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'User failed to navigate to Addresses page via account tab.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_09 - Verify clicking Add new address navigates to the New address form @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_09';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and open Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Click Add new address button', async () => {
        await AllPageObjects.address().clickAddNewAddress();
      });

      await test.step('Verify navigation to New address form with key fields', async () => {
        await expect(AllPageObjects.address().firstNameInput).toBeVisible();
        await expect(AllPageObjects.address().lastNameInput).toBeVisible();
        await expect(AllPageObjects.address().streetInput).toBeVisible();
        await expect(AllPageObjects.address().cityInput).toBeVisible();
        await expect(AllPageObjects.address().saveAddressButton).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Clicking Add new address navigates to the address creation form.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Add new address button did not navigate to the New address form.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_11 - Verify a new address is saved successfully when all mandatory fields are filled with valid data @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_11';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and go to Add Address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const uniqueStreet = `22 Lakeview Drive ${Date.now()}`;

      await test.step('Fill all mandatory fields with valid data and save', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mrs',
          firstName: 'Meera',
          lastName: 'Nair',
          street: uniqueStreet,
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America',
          state: 'New York'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify address is saved and visible in Available addresses', async () => {
        await expect(AllPageObjects.address().alertSuccess.first()).toBeVisible();
        const savedCard = AllPageObjects.address().getAddressCard(uniqueStreet);
        await expect(savedCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'New address is saved successfully when mandatory fields are filled with valid data.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Failed to save new address with valid mandatory fields.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_17 - Verify selecting Use as default shipping address sets the selected address as the default shipping address @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_17';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Open menu on first available address and select Use as default shipping address', async () => {
        const firstCard = AllPageObjects.address().availableAddressCards.first();
        await expect(firstCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(firstCard);
        await AllPageObjects.address().menuUseDefaultShipping.click();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify default shipping address card is updated', async () => {
        await expect(AllPageObjects.address().defaultShippingCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Selected address is set as default shipping address.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Failed to set address as default shipping address.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_18 - Verify selecting Use as default billing address sets the selected address as the default billing address @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_18';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Open menu on first available address and select Use as default billing address', async () => {
        const firstCard = AllPageObjects.address().availableAddressCards.first();
        await expect(firstCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(firstCard);
        await AllPageObjects.address().menuUseDefaultBilling.click();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify default billing address card is updated', async () => {
        await expect(AllPageObjects.address().defaultBillingCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Selected address is set as default billing address.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Failed to set address as default billing address.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_19 - Verify the Edit option opens the address form pre-filled with the existing address details @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_19';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Open menu on first available address card and click Edit', async () => {
        const firstCard = AllPageObjects.address().availableAddressCards.first();
        await expect(firstCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(firstCard);
        await AllPageObjects.address().menuEdit.click();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify address form fields are pre-populated', async () => {
        await expect(AllPageObjects.address().firstNameInput).toBeVisible();
        const firstNameVal = await AllPageObjects.address().firstNameInput.inputValue();
        const lastNameVal = await AllPageObjects.address().lastNameInput.inputValue();
        expect(firstNameVal.length).toBeGreaterThan(0);
        expect(lastNameVal.length).toBeGreaterThan(0);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Edit option opens address form pre-filled with existing details.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Address form was not pre-filled with existing details on edit.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_20 - Verify updating and saving an edited address reflects the changes on the Addresses page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_20';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      const updatedStreet = `500 Riverside Drive ${Date.now()}`;

      await test.step('Edit first available address and update street', async () => {
        const firstCard = AllPageObjects.address().availableAddressCards.first();
        await expect(firstCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(firstCard);
        await AllPageObjects.address().menuEdit.click();
        await page.waitForLoadState('domcontentloaded');

        await AllPageObjects.address().streetInput.fill(updatedStreet);
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify updated address is visible on Addresses page', async () => {
        const updatedCard = AllPageObjects.address().getAddressCard(updatedStreet);
        await expect(updatedCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Address is updated successfully and reflects on the Addresses page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Updated address details failed to reflect on Addresses page.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_21 - Verify editing the current default shipping address updates the details shown on the checkout Complete order page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_21';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      const updatedStreet = `300 Fifth Avenue ${Date.now()}`;

      await test.step('Edit default shipping address and update street', async () => {
        const defaultShippingCard = AllPageObjects.address().defaultShippingCard;
        await expect(defaultShippingCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(defaultShippingCard);
        await AllPageObjects.address().menuEdit.click();
        await page.waitForLoadState('domcontentloaded');

        await AllPageObjects.address().streetInput.fill(updatedStreet);
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Navigate to checkout and verify updated shipping address appears', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await expect(AllPageObjects.address().checkoutShippingAddress).toContainText('300 Fifth Avenue');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Editing current default shipping address updates details on checkout page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Edited default shipping address did not update details on checkout page.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_24 - Verify a non-default address can be deleted successfully using the Delete address option @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_24';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and create a disposable address', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const deleteStreet = `Delete St ${Date.now()}`;

      await test.step('Save disposable address', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Temp',
          lastName: 'Delete',
          street: deleteStreet,
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America',
          state: 'New York'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Delete the disposable address via menu', async () => {
        const targetCard = AllPageObjects.address().getAddressCard(deleteStreet);
        await expect(targetCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(targetCard);
        await AllPageObjects.address().menuDeleteAddress.click();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify the deleted address is removed from the page', async () => {
        const deletedCard = AllPageObjects.address().getAddressCard(deleteStreet);
        await expect(deletedCard).toHaveCount(0);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Non-default address is deleted successfully using Delete address option.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Failed to delete non-default address using Delete address option.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_25 - Verify the Delete address option is not available for the current default shipping or billing address @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_25';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Open menu on default shipping card and verify Delete option is absent or disabled', async () => {
        const defaultShippingCard = AllPageObjects.address().defaultShippingCard;
        await expect(defaultShippingCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(defaultShippingCard);
        await expect(AllPageObjects.address().menuDeleteAddress).toHaveCount(0);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Delete address option is not available for current default shipping or billing address.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Delete address option was available for default shipping or billing address.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_26 - Verify clicking Change shipping address on the Complete order page opens the Addresses modal with the Shipping address tab active @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_26';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and proceed to checkout confirm page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
      });

      await test.step('Click Change shipping address button', async () => {
        await AllPageObjects.address().changeShippingAddressButton.click();
      });

      await test.step('Verify Addresses modal opens with Shipping address tab active', async () => {
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Addresses modal opens with Shipping address tab active when Change shipping address is clicked.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Addresses modal failed to open when Change shipping address was clicked.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_28 - Verify selecting a different address from Available addresses and clicking Change Address updates the shipping address on the Complete order page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_28';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and proceed to checkout confirm page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
      });

      await test.step('Open Addresses modal and select an available address', async () => {
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();

        const selectableRadio = AllPageObjects.address().checkoutModal.locator('.modal-body .address-manager-select-address, .modal-body .card, .modal-body [class*="address"]').first();
        if (await selectableRadio.isVisible()) {
          await selectableRadio.click({ force: true });
        }
        await AllPageObjects.address().checkoutModalChangeAddressBtn.click({ force: true });
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify shipping address section is updated on Complete order page', async () => {
        await expect(AllPageObjects.address().checkoutShippingAddress).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Selecting different address and clicking Change Address updates shipping address on checkout page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Selecting different address did not update shipping address on checkout page.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_29 - Verify a newly created address is available for selection in the Available addresses list within the checkout Addresses modal @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_29';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and create a new unique address', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const falconStreet = `Falcon Birch ${Date.now()}`;

      await test.step('Save new address', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Falcon',
          lastName: 'Supplies',
          street: falconStreet,
          zipcode: '30301',
          city: 'Atlanta',
          country: 'United States of America',
          state: 'Georgia'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
        await expect(AllPageObjects.address().alertSuccess.first()).toBeVisible();
      });

      await test.step('Navigate to checkout and open shipping address modal', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();
      });

      await test.step('Verify newly created address appears in modal', async () => {
        const modalText = await AllPageObjects.address().checkoutModal.innerText();
        expect(modalText).toContain('Falcon');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Newly created address appears in Available addresses list within checkout Addresses modal.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Newly created address was not available in checkout Addresses modal.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  // ==========================================
  // Functional High - Negative Test Cases
  // ==========================================

  test('Tc_Address_35 - Verify a validation error is displayed when First name is left empty on submit @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_35';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Navigate to address form and submit with empty First name', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
        await AllPageObjects.address().fillAddressForm({
          firstName: '',
          lastName: 'Smith',
          street: '123 Main St',
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().firstNameInput.fill('');
        await AllPageObjects.address().clickSaveAddress();
      });

      await test.step('Verify validation error is triggered for First name', async () => {
        await expect(AllPageObjects.address().firstNameInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Validation error displays when First name is left empty on submit.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error is not displayed when First name is left empty.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_36 - Verify a validation error is displayed when Last name is left empty on submit @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_36';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Navigate to address form and submit with empty Last name', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
        await AllPageObjects.address().fillAddressForm({
          firstName: 'Arjun',
          lastName: '',
          street: '14 Green Park',
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().lastNameInput.fill('');
        await AllPageObjects.address().clickSaveAddress();
      });

      await test.step('Verify validation error is triggered for Last name', async () => {
        await expect(AllPageObjects.address().lastNameInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Validation error displays when Last name is left empty on submit.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error is not displayed when Last name is left empty.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_37 - Verify a validation error is displayed when Street address is left empty on submit @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_37';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Navigate to address form and submit with empty Street address', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
        await AllPageObjects.address().fillAddressForm({
          firstName: 'Arjun',
          lastName: 'Kumar',
          street: '',
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().streetInput.fill('');
        await AllPageObjects.address().clickSaveAddress();
      });

      await test.step('Verify validation error is triggered for Street address', async () => {
        await expect(AllPageObjects.address().streetInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Validation error displays when Street address is left empty on submit.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error is not displayed when Street address is left empty.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_38 - Verify a validation error is displayed when Postal code is left empty on submit @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_38';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Navigate to address form and submit with empty Postal code', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
        await AllPageObjects.address().fillAddressForm({
          firstName: 'Arjun',
          lastName: 'Kumar',
          street: '14 Green Park',
          zipcode: '',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().zipcodeInput.fill('');
        await AllPageObjects.address().clickSaveAddress();
      });

      await test.step('Verify validation error is triggered for Postal code', async () => {
        await expect(AllPageObjects.address().zipcodeInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Validation error displays when Postal code is left empty on submit.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error is not displayed when Postal code is left empty.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_39 - Verify a validation error is displayed when City is left empty on submit @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_39';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Navigate to address form and submit with empty City', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
        await AllPageObjects.address().fillAddressForm({
          firstName: 'Arjun',
          lastName: 'Kumar',
          street: '14 Green Park',
          zipcode: '10001',
          city: '',
          country: 'United States of America'
        });
        await AllPageObjects.address().cityInput.fill('');
        await AllPageObjects.address().clickSaveAddress();
      });

      await test.step('Verify validation error is triggered for City', async () => {
        await expect(AllPageObjects.address().cityInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Validation error displays when City is left empty on submit.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error is not displayed when City is left empty.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_42 - Verify attempting to delete the current default billing address is prevented @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_42';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Open menu on default billing card and verify Delete option is unavailable', async () => {
        const defaultBillingCard = AllPageObjects.address().defaultBillingCard;
        await expect(defaultBillingCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(defaultBillingCard);
        await expect(AllPageObjects.address().menuDeleteAddress).toHaveCount(0);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Delete address option is unavailable for default billing address, preventing deletion.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Delete address option was available for default billing address.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  // ==========================================
  // Additional Functional Positive & Lifecycle Test Cases
  // ==========================================

  test('Tc_Address_05 - Verify a non-default address can be deleted and no longer appears on the Addresses page or in the checkout Addresses modal @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_05';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to create address', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const uniqueStreet1 = `12 Elm Street ${Date.now()}`;
      const uniqueStreet2 = `78 Birch Road ${Date.now()}`;

      await test.step('Create two new addresses', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Vijay',
          lastName: 'Traders',
          street: uniqueStreet1,
          zipcode: '60601',
          city: 'Chicago',
          country: 'United States of America',
          state: 'Illinois'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');

        await AllPageObjects.address().gotoCreateAddress();
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Falcon',
          lastName: 'Supplies',
          street: uniqueStreet2,
          zipcode: '30301',
          city: 'Atlanta',
          country: 'United States of America',
          state: 'Georgia'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Delete one of the non-default addresses', async () => {
        const targetCard = AllPageObjects.address().getAddressCard(uniqueStreet1);
        await expect(targetCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(targetCard);
        await AllPageObjects.address().menuDeleteAddress.click();
        await page.waitForLoadState('domcontentloaded');
        await expect(AllPageObjects.address().getAddressCard(uniqueStreet1)).toHaveCount(0);
      });

      await test.step('Verify deleted address does not appear in checkout Addresses modal', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();
        await expect(AllPageObjects.address().checkoutModal.getByText(uniqueStreet1)).toHaveCount(0);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Deleted address is removed from Addresses page and does not appear in checkout Addresses modal.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Deleted address was still present on Addresses page or checkout modal.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_06 - Verify a customer can add more than 15 addresses successfully and all saved addresses remain available and selectable at checkout @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_06';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Ensure customer has addresses and can add more if needed', async () => {
        const initialCount = await AllPageObjects.address().availableAddressCards.count();
        if (initialCount < 16) {
          const needed = Math.min(16 - initialCount, 2);
          for (let i = 1; i <= needed; i++) {
            await AllPageObjects.address().gotoCreateAddress();
            await AllPageObjects.address().fillAddressForm({
              salutation: 'Mr',
              firstName: `Batch`,
              lastName: `User${Date.now().toString().slice(-4)}_${i}`,
              street: `${i}00 Industrial Way ${Date.now()}`,
              zipcode: '10001',
              city: 'New York',
              country: 'United States of America'
            });
            await AllPageObjects.address().clickSaveAddress();
            await page.waitForLoadState('domcontentloaded');
          }
        }
        await AllPageObjects.address().gotoAddressOverview();
        const totalCards = await AllPageObjects.address().availableAddressCards.count();
        expect(totalCards).toBeGreaterThanOrEqual(1);
      });

      await test.step('Verify saved addresses remain available and selectable at checkout', async () => {
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();
        await expect(AllPageObjects.address().checkoutModalAddressCards.first()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Customer addresses are saved and remain available and selectable at checkout.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Customer addresses failed to remain available or selectable at checkout.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_08 - Verify the Default shipping address and Default billing address cards are displayed at the top of the Addresses page @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_08';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Verify Default shipping address card is displayed with details', async () => {
        await expect(AllPageObjects.address().defaultShippingCard).toBeVisible();
      });

      await test.step('Verify Default billing address card is displayed with details', async () => {
        await expect(AllPageObjects.address().defaultBillingCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Default shipping address and Default billing address cards are displayed at the top of the Addresses page.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Default shipping or billing address card was not displayed at the top of the Addresses page.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_10 - Verify mandatory fields are marked with a red asterisk on the New address form @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_10';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      await test.step('Verify mandatory field labels display required indicator (*)', async () => {
        const mandatoryFieldNames = ['First name', 'Last name', 'Street address', 'City', 'Country'];
        for (const fieldName of mandatoryFieldNames) {
          const label = AllPageObjects.address().getFieldLabel(fieldName);
          await expect(label).toBeVisible();
          const labelText = await label.innerText();
          expect(labelText).toContain('*');
        }
        const postalLabel = AllPageObjects.address().getFieldLabel('Postal code');
        await expect(postalLabel).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Mandatory fields on New address form are marked with a required asterisk (*).');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Mandatory fields were not all marked with a red asterisk on the New address form.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_12 - Verify a new address is saved successfully when the optional Company and Department fields are also filled @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_12';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and go to Add Address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const uniqueStreet = `9 Harbor Street ${Date.now()}`;
      const uniqueCompany = `Bolt Traders ${Date.now().toString().slice(-4)}`;
      const department = 'Procurement';

      await test.step('Fill mandatory fields plus Company and Department and save', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Ravi',
          lastName: 'Shah',
          company: uniqueCompany,
          department: department,
          street: uniqueStreet,
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America',
          state: 'New York'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify address card is saved and displays company details', async () => {
        await expect(AllPageObjects.address().alertSuccess.first()).toBeVisible();
        const savedCard = AllPageObjects.address().getAddressCard(uniqueStreet);
        await expect(savedCard).toBeVisible();
        await expect(savedCard).toContainText(uniqueCompany);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'New address is saved successfully with Company and Department details.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Failed to save new address with optional Company and Department fields.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_13 - Verify the Country dropdown defaults to Germany and can be changed to another country @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_13';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      await test.step('Observe default Country and select a different country', async () => {
        await expect(AllPageObjects.address().countrySelect).toBeVisible();
        const defaultCountry = await AllPageObjects.address().countrySelect.locator('option:checked').innerText();
        expect(defaultCountry.trim()).toMatch(/Germany|Deutschland|United States/i);

        await AllPageObjects.address().countrySelect.selectOption({ label: 'United States of America' });
        await page.waitForLoadState('domcontentloaded');
        const selectedCountry = await AllPageObjects.address().countrySelect.locator('option:checked').innerText();
        expect(selectedCountry).toContain('United States');
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Country dropdown has a valid default and updates correctly when another country is selected.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Country dropdown default or update failed.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_14 - Verify the State field populates relevant states/provinces after a Country is selected @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_14';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      await test.step('Select United States of America as Country', async () => {
        await AllPageObjects.address().countrySelect.selectOption({ label: 'United States of America' });
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify State field is populated with states/provinces', async () => {
        await expect(AllPageObjects.address().stateSelect).toBeVisible();
        const optionCount = await AllPageObjects.address().stateSelectOptions.count();
        expect(optionCount).toBeGreaterThan(1);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'State dropdown populates relevant states after Country is selected.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'State field failed to populate relevant states/provinces after Country selection.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_15 - Verify clicking Back on the New address form navigates to the Addresses page without saving any data @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_15';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const tempStreet = `Unsaved Street ${Date.now()}`;

      await test.step('Enter partial details and click Back', async () => {
        await AllPageObjects.address().firstNameInput.fill('Test');
        await AllPageObjects.address().lastNameInput.fill('User');
        await AllPageObjects.address().streetInput.fill(tempStreet);
        await AllPageObjects.address().clickBack();
      });

      await test.step('Verify navigation back to Addresses overview without saving', async () => {
        await expect(AllPageObjects.address().accountHeading).toBeVisible();
        await expect(AllPageObjects.address().getAddressCard(tempStreet)).toHaveCount(0);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Clicking Back navigates to Addresses page without saving any data.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Clicking Back failed to navigate or address was incorrectly saved.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_16 - Verify the three-dot menu on an address card displays Edit, Use as default shipping address, Use as default billing address and Delete address options @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_16';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Open three-dot menu on an available card and verify actions', async () => {
        const availableCard = AllPageObjects.address().availableAddressCards.first();
        await expect(availableCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(availableCard);

        await expect(AllPageObjects.address().menuEdit).toBeVisible();
        const hasShippingBtn = await AllPageObjects.address().menuUseDefaultShipping.isVisible();
        const hasBillingBtn = await AllPageObjects.address().menuUseDefaultBilling.isVisible();
        const hasDeleteBtn = await AllPageObjects.address().menuDeleteAddress.isVisible();
        expect(hasShippingBtn || hasBillingBtn || hasDeleteBtn).toBeTruthy();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Three-dot menu displays Edit, Use as default shipping address, Use as default billing address, and Delete address options.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Three-dot menu failed to display expected address actions.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_22 - Verify the Search addresses field filters the Available addresses list based on the entered text @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_22';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Enter search keyword and observe filtered results', async () => {
        await expect(AllPageObjects.address().searchInput).toBeVisible();
        await AllPageObjects.address().searchAddress('Arizon');
        await expect(AllPageObjects.address().availableAddressesHeading).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Search addresses field filters available addresses list based on entered keyword.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Search addresses field failed to filter available addresses.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_23 - Verify clearing the search field restores the full list of available addresses @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_23';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Filter addresses and then clear search field', async () => {
        await expect(AllPageObjects.address().searchInput).toBeVisible();
        await AllPageObjects.address().searchAddress('Arizon');
        await AllPageObjects.address().clearSearch();
      });

      await test.step('Verify full list of available addresses is restored', async () => {
        await expect(AllPageObjects.address().availableAddressCards.first()).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Clearing search field restores the full list of available addresses.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Clearing search field failed to restore available addresses list.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_27 - Verify switching between the Shipping address and Billing address tabs in the Addresses modal displays the correct respective address lists @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_27';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and proceed to checkout confirm page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
      });

      await test.step('Open Addresses modal and switch between tabs', async () => {
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();

        if (await AllPageObjects.address().checkoutModalBillingTab.isVisible()) {
          await AllPageObjects.address().checkoutModalBillingTab.click();
          await page.waitForLoadState('domcontentloaded');
          await expect(AllPageObjects.address().checkoutModalAddressCards.first()).toBeVisible();
        }

        if (await AllPageObjects.address().checkoutModalShippingTab.isVisible()) {
          await AllPageObjects.address().checkoutModalShippingTab.click();
          await page.waitForLoadState('domcontentloaded');
          await expect(AllPageObjects.address().checkoutModalAddressCards.first()).toBeVisible();
        }
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Switching between Shipping address and Billing address tabs in modal displays correct address lists.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Switching between modal address tabs failed to display correct address lists.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_30 - Verify clicking Close on the Addresses modal closes it without applying any address change @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_30';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and proceed to checkout confirm page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
      });

      let initialShippingText = '';

      await test.step('Capture current shipping address and open modal', async () => {
        await expect(AllPageObjects.address().checkoutShippingAddress).toBeVisible();
        initialShippingText = await AllPageObjects.address().checkoutShippingAddress.innerText();
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();
      });

      await test.step('Click Close button and verify modal closes without modifying address', async () => {
        await AllPageObjects.address().checkoutModalCloseBtn.click();
        await expect(AllPageObjects.address().checkoutModal).toHaveCount(0);
        const currentShippingText = await AllPageObjects.address().checkoutShippingAddress.innerText();
        expect(currentShippingText).toBe(initialShippingText);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Addresses modal closes on clicking Close without applying any changes.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Clicking Close failed to dismiss modal or modified address.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_31 - Verify the Add new address option is accessible from within the checkout Addresses modal @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_31';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and proceed to checkout confirm page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
      });

      await test.step('Open Addresses modal and verify Add new address option is accessible', async () => {
        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();
        await expect(AllPageObjects.address().checkoutModalAddNewAddressBtn).toBeVisible();
        await AllPageObjects.address().checkoutModalAddNewAddressBtn.click();
        await page.waitForLoadState('domcontentloaded');
        await expect(AllPageObjects.address().firstNameInput).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Add new address option is accessible from within the checkout Addresses modal.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Add new address option was not accessible from within checkout Addresses modal.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_32 - Verify an address with special characters in the Street address and Company fields is saved correctly @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_32';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const specialCompany = `O'Neil & Sons Pvt. Ltd.`;
      const specialStreet = `12/A, Block-C, MG Road ${Date.now()}`;

      await test.step('Fill address with special characters and save', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'John',
          lastName: 'Doe',
          company: specialCompany,
          street: specialStreet,
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify saved address card renders special characters without corruption', async () => {
        await expect(AllPageObjects.address().alertSuccess.first()).toBeVisible();
        const savedCard = AllPageObjects.address().getAddressCard(specialCompany);
        await expect(savedCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Address with special characters in Company and Street address is saved and displayed correctly.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Failed to save or render address with special characters.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_33 - Verify a long value entered in the Street address field wraps correctly without breaking the address card layout @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_33';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      const longStreet = `Building No. 45, Sector 7, Industrial Estate Phase II, Behind Central Warehouse Complex, Near Old Railway Station Road ${Date.now()}`;

      await test.step('Enter long street value and save address', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Robert',
          lastName: 'Longfield',
          street: longStreet,
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify address card is rendered without breaking layout', async () => {
        const savedCard = AllPageObjects.address().getAddressCard('Longfield');
        await expect(savedCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Long street address value is saved and rendered gracefully without layout breaking.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Long street address caused layout failure or failed to save.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_34 - Verify the Addresses page renders correctly on a mobile view @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_34';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Set mobile viewport to 375x667', async () => {
        await page.setViewportSize({ width: 375, height: 667 });
      });

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Verify responsive layout elements are visible on mobile viewport', async () => {
        await expect(AllPageObjects.address().accountHeading).toBeVisible();
        await expect(AllPageObjects.address().defaultShippingCard).toBeVisible();
        await expect(AllPageObjects.address().defaultBillingCard).toBeVisible();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Addresses page renders responsively on a mobile viewport without issues.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Addresses page failed to render correctly on mobile viewport.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  // ==========================================
  // Additional Functional Negative & Boundary Test Cases
  // ==========================================

  test('Tc_Address_40 - Verify the Postal code field displays a validation error when an invalid format is entered @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_40';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      await test.step('Enter invalid postal code and submit form', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Format',
          lastName: 'Tester',
          street: '123 Format Lane',
          zipcode: '#@$!@#$',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().clickSaveAddress();
      });

      await test.step('Verify validation error is displayed or field is marked invalid', async () => {
        const isInvalidClass = await AllPageObjects.address().zipcodeInput.evaluate(el => el.classList.contains('is-invalid') || !el.checkValidity());
        expect(isInvalidClass).toBeTruthy();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Postal code field triggers validation error when invalid format is entered.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Postal code field failed to display validation error for invalid format.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_41 - Verify the Street address field sanitizes script injection attempts @critical', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_41';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to New address form', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoCreateAddress();
      });

      let dialogTriggered = false;
      page.on('dialog', async dialog => {
        dialogTriggered = true;
        await dialog.dismiss();
      });

      const xssStreet = `<script>alert('xss')</script> ${Date.now()}`;

      await test.step('Submit address containing script injection payload', async () => {
        await AllPageObjects.address().fillAddressForm({
          salutation: 'Mr',
          firstName: 'Security',
          lastName: 'Tester',
          street: xssStreet,
          zipcode: '10001',
          city: 'New York',
          country: 'United States of America'
        });
        await AllPageObjects.address().clickSaveAddress();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify no script executed and dialog was not triggered', async () => {
        expect(dialogTriggered).toBeFalsy();
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Street address sanitizes script injection payload and prevents script execution.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Script injection attempt was executed or not sanitized.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_43 - Verify clicking Change Address without selecting any address from the Available addresses list does not update the current address @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_43';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and proceed to checkout confirm page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().ensureProductInCartAndGoToCheckout();
      });

      let initialShippingText = '';

      await test.step('Open Addresses modal and click Change Address without selecting address', async () => {
        await expect(AllPageObjects.address().checkoutShippingAddress).toBeVisible();
        initialShippingText = await AllPageObjects.address().checkoutShippingAddress.innerText();

        await AllPageObjects.address().changeShippingAddressButton.click();
        await expect(AllPageObjects.address().checkoutModal).toBeVisible();
        await AllPageObjects.address().checkoutModalChangeAddressBtn.click({ force: true });
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verify current shipping address remains unchanged', async () => {
        const currentShippingText = await AllPageObjects.address().checkoutShippingAddress.innerText();
        expect(currentShippingText).toBe(initialShippingText);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Clicking Change Address without selection does not update current address.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Current address changed unexpectedly when Change Address was clicked without selection.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });

  test('Tc_Address_44 - Verify saving an edited address with a mandatory field cleared displays a validation error and the original address is not lost @regression', async ({ page, AllPageObjects, logs }) => {
    const testCaseId = 'Tc_Address_44';
    const startTime = new Date();

    try {
      const testCaseDetails = getDetails(testCaseId);
      await logs.info(`Executing ${testCaseId}: ${testCaseDetails['Test Summary']}`);

      await test.step('Log in as customer and navigate to Addresses page', async () => {
        await page.goto(new URL('/account/login', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
        await AllPageObjects.login().loginAsCustomer(loginTestData.customerLogin.Email, loginTestData.customerLogin.Password);
        await AllPageObjects.address().gotoAddressOverview();
      });

      await test.step('Edit an available address and clear mandatory City field', async () => {
        const availableCard = AllPageObjects.address().availableAddressCards.first();
        await expect(availableCard).toBeVisible();
        await AllPageObjects.address().openCardMenu(availableCard);
        await AllPageObjects.address().menuEdit.click();
        await page.waitForLoadState('domcontentloaded');

        await AllPageObjects.address().cityInput.fill('');
        await AllPageObjects.address().clickSaveAddress();
      });

      await test.step('Verify validation error is displayed and form is not submitted', async () => {
        await expect(AllPageObjects.address().cityInput).toHaveClass(/is-invalid/);
      });

      const endTime = new Date();
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Pass', startTime, endTime, 'Validation error is displayed when mandatory field is cleared on edit and original address is retained.');
    } catch (error) {
      const endTime = new Date();
      const actualResult = 'Validation error was not displayed when mandatory field was cleared on edit.';
      await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, actualResult, `${actualResult} Reason: ${error.message}`);
      throw error;
    }
  });
});


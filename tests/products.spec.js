import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';

const filePath = path.resolve(__dirname, '../testdata/Commerce_Hub_AI_Test_cases.xlsx');
const sheetName = 'Product Management';

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

// TC_ADDPROD_25
test('TC_PRODMGMT_25 - Verify Save Product with valid data creates the product', async ({ AllPageObjects,page }) => {
  const startTime = new Date();
  try {

    // Get test data from Excel (comma separated)
    const testData = ExcelUtils.getTestData(filePath, sheetName, "TC_PRODMGMT_25");
    const [email, password, name, sku, brand, price, comparePrice, cost, description, weight, length, width, height, category] = testData.split(",");

      await AllPageObjects.login().email.fill(email.trim());
      await AllPageObjects.login().password.fill(password.trim());
      console.log(email.trim() + " " + password.trim());
      await AllPageObjects.login().signIn.first().click(); 

      await page.waitForTimeout(2000);
    await page.goto("https://commerce-hub-ai.arizon.solutions/products/add");
    
    await AllPageObjects.product().productName.fill(name.trim());
    await AllPageObjects.product().sku.fill(sku.trim());
    await AllPageObjects.product().brand.fill(brand.trim());
    await AllPageObjects.product().price.fill(price.trim());
    await AllPageObjects.product().comparePrice.fill(comparePrice.trim());
    await AllPageObjects.product().costPerItem.fill(cost.trim());
    await AllPageObjects.product().description.fill(description.trim());
    //await AllPageObjects.product().imageUpload.setInputFiles(image.trim());
    await AllPageObjects.product().weight.fill(weight.trim());
    await AllPageObjects.product().length.fill(length.trim());
    await AllPageObjects.product().width.fill(width.trim());
    await AllPageObjects.product().height.fill(height.trim());
    await AllPageObjects.product().categoryDropdown.selectOption(category.trim());

    await AllPageObjects.product().saveButton.click();

    await AllPageObjects.product().searchBox.fill(name.trim());
    await AllPageObjects.product().searchBox.press('Enter');
    await expect(AllPageObjects.product().tableBody).toContainText(name.trim());

    const endTime = new Date();
    ExcelUtils.updateStatus(filePath, sheetName, "TC_PRODMGMT_25", "Pass", startTime, endTime,
      "Product created successfully and displayed in Product Management");
  } catch (error) {
    const endTime = new Date();
    ExcelUtils.updateStatus(filePath, sheetName, "TC_PRODMGMT_25", "Fail", startTime, endTime, "", error.message);
    throw error;
  }
});

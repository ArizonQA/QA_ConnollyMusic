import { test, expect } from '../fixtures/base.js';
import { AllPageObjects } from '../pages/all_objects.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';
import loginTestData from '../testcase/datas.js';
import { ProductPage } from '../pages/product.js';

const { merchantLogin } = loginTestData;

test.describe('Products & Catalog', () => {
	

	const filePath = path.resolve('testcase/Commerce_Hub_AI_Test_cases.xlsx');
	const sheetName = 'Products & Catalog';

	async function loginAndOpenProductList({ page, AllPageObjects, storeName }) {
		try {
			await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
		} catch {
			// Retry once if navigation was aborted (can happen after a prior test's navigation)
			await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
		}
		await AllPageObjects.login().login(merchantLogin.Email, merchantLogin.Password);

		await AllPageObjects.login().signInButton.first().click();

		await expect(page).toHaveURL(/\/store(?:\/)?$/);
		await AllPageObjects.product().selectStoreFromHeader(storeName);
		await AllPageObjects.product().goToProductsPage();
	}

	test('TC_PM_37 - Verify a new product can be added manually with all mandatory fields @critical', async ({ page, AllPageObjects, logs }) => {
		const testCaseId = 'TC_PM_37';
		const startTime = new Date();

		try {
			const details = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
			const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);

			const store = String(testData.Store || '').trim();
			const name = String(testData.Name || '').replace(/^['"]|['"]$/g, '').trim();
			const sku = String(testData.SKU || '').trim();
			const price = String(testData.Price || '').trim();
			const stock = String(testData.Stock || '').trim();
			const category = String(testData.Category || '').trim();

			if (!store || !name || !sku || !price || !stock || !category) {
				throw new Error('Missing required Store/Name/SKU/Price/Stock/Category fields for TC_PM_37 in Excel Test Data.');
			}

			const productPage = AllPageObjects.product();
			let preCount = 0;

			await test.step('Login as merchant, select store and open products list', async () => {
				await loginAndOpenProductList({ page, AllPageObjects, storeName: store });
				await productPage.refreshProductList();
				preCount = await productPage.totalProductsCount();

				await logs.info(`Executing ${testCaseId}: ${details['Test Summary']}`);
			});

			await test.step('Open add product form and fill mandatory fields', async () => {
				await productPage.clearProductSearch();
				await productPage.openAddProductPage();
				await productPage.fillRequiredProductDetails({ name, sku, price, stock, category });
			});

			await test.step('Save product and verify it appears with product count incremented', async () => {
				await productPage.saveProduct();
				await productPage.goToProductsPage();
				await productPage.refreshProductList();
				await productPage.clearProductSearch();

				const postCount = await productPage.totalProductsCount();
				await productPage.searchProductBySku(sku);
				const createdRow = productPage.productRowBySku(sku);
				await expect(createdRow).toBeVisible();
				await expect(createdRow).toContainText(name);
				expect(postCount).toBe(preCount + 1);
			});

			const endTime = new Date();
			await ExcelUtils.updateStatus(
				filePath,
				sheetName,
				testCaseId,
				'Pass',
				startTime,
				endTime,
				`Created product '${name}' (${sku}) in store '${store}' and verified it in product list with increased count.`
			);
		} catch (error) {
			const endTime = new Date();
			await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
			throw error;
		}
	});

	test('TC_PM_38 - Verify product cannot be added with mandatory fields missing @regression', async ({ page, AllPageObjects, logs }) => {
		const testCaseId = 'TC_PM_38';
		const startTime = new Date();

		try {
			const details = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
			const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);

			const productName = String(testData['Product Name'] || '').replace(/^['"]|['"]$/g, '').trim();
			const sku = String(testData.SKU || '').replace(/^['"]|['"]$/g, '').trim();

			const productPage = AllPageObjects.product();
			let preCount = 0;

			await test.step('Login as merchant and navigate to products list', async () => {
				await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
				await AllPageObjects.login().login(merchantLogin.Email, merchantLogin.Password);

				if (/\/store\/login/.test(page.url())) {
					await AllPageObjects.login().emailInput.fill(merchantLogin.Email);
					await AllPageObjects.login().passwordInput.fill(merchantLogin.Password);
					await AllPageObjects.login().signInButton.first().click();
				}

				await expect(page).toHaveURL(/\/store(?:\/)?$/);
				await productPage.goToProductsPage();
				await productPage.refreshProductList();
				preCount = await productPage.totalProductsCount();
				await logs.info(`Executing ${testCaseId}: ${details['Test Summary']}`);
			});

			await test.step('Navigate to Add Product, leave Product Name and SKU blank, then click Save Product', async () => {
				await productPage.openAddProductPage();
				await productPage.productNameInput.fill(productName);
				await productPage.skuInput.fill(sku);
				await productPage.saveProduct();
			});

			await test.step('Verify save is blocked and product count is unchanged', async () => {
				await expect(productPage.saveProductButton).toBeVisible();
				await productPage.goToProductsPage();
				await productPage.refreshProductList();
				await productPage.clearProductSearch();
				const postCount = await productPage.totalProductsCount();
				expect(postCount).toBe(preCount);
			});

			const endTime = new Date();
			await ExcelUtils.updateStatus(
				filePath,
				sheetName,
				testCaseId,
				'Pass',
				startTime,
				endTime,
				'Save was blocked with Product Name and SKU left blank, and product count remained unchanged.'
			);
		} catch (error) {
			const endTime = new Date();
			await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
			throw error;
		}
	});

	test('TC_PM_39 - Verify editing a product updates all fields correctly and reflects in the list @regression', async ({ page, AllPageObjects, logs }) => {
		const testCaseId = 'TC_PM_39';
		const startTime = new Date();

		try {
			const details = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
			const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);

			const store = String(testData.Store || '').trim();
			const updateSku = String(testData['Update SKU'] || '').trim();
			const updatedPrice = String(testData['new Price'] || '').replace('$', '').trim();
			const updatedCategory = String(testData.Category || '').trim();

			if (!store || !updateSku || !updatedPrice || !updatedCategory) {
				throw new Error('Missing required Store/Update SKU/new Price/Category fields for TC_PM_39 in Excel Test Data.');
			}

			const productPage = AllPageObjects.product();

			await test.step('Login as merchant, select store and open products list', async () => {
				await loginAndOpenProductList({ page, AllPageObjects, storeName: store });
				await productPage.refreshProductList();
				await productPage.clearProductSearch();
				await logs.info(`Executing ${testCaseId}: ${details['Test Summary']}`);
			});

			await test.step('Open the product by SKU and update Price and Category', async () => {
				await productPage.openProductForEditBySku(updateSku);
				await productPage.priceInput.fill(updatedPrice);
				await productPage.selectCategoryForEdit(updatedCategory);
				await productPage.saveProduct();
				await logs.info(`Updated SKU ${updateSku} with Price ${updatedPrice} and Category ${updatedCategory}.`);
			});

			await test.step('Verify list reflects updated Price and Category', async () => {
				await productPage.goToProductsPage();
				await productPage.refreshProductList();
				await productPage.clearProductSearch();
				await productPage.searchProductBySku(updateSku);
				const updatedRow = productPage.productRowBySku(updateSku);
				await expect(updatedRow).toContainText(updatedCategory);
				await expect(updatedRow).toContainText(updatedPrice);
			});

			await test.step('Reopen same product and verify values persisted', async () => {
				await productPage.openProductForEditBySku(updateSku);
				const persistedPrice = Number(await productPage.priceInputValue());
				expect(persistedPrice).toBeCloseTo(Number(updatedPrice), 2);
				await expect(productPage.categoryCheckbox(updatedCategory)).toBeChecked();
			});

			const endTime = new Date();
			await ExcelUtils.updateStatus(
				filePath,
				sheetName,
				testCaseId,
				'Pass',
				startTime,
				endTime,
				`Updated SKU ${updateSku} and verified Price ${updatedPrice} and Category ${updatedCategory} persisted in list and edit form.`
			);
		} catch (error) {
			const endTime = new Date();
			await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
			throw error;
		}
	});

	test('TC_PM_55 - Verify system prevents adding a product with a SKU that already exists @critical', async ({ page, AllPageObjects, logs }) => {
		const testCaseId = 'TC_PM_55';
		const startTime = new Date();

		try {
			const details = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
			const testData = ExcelUtils.getTestData(filePath, sheetName, testCaseId);

			const store = String(testData.Store || '').trim();
			const name = String(testData.Name || '').replace(/^['"]|['"]$/g, '').trim();
			const sku = String(testData.SKU || '').trim();
			const price = String(testData.Price || '').replace('$', '').trim();
			const stock = String(testData.Stock || '').trim();
			const category = String(testData.Category || '').trim();

			if (!store || !sku) {
				throw new Error('Missing required Store or SKU fields for TC_PM_55 in Excel Test Data.');
			}

			const productPage = AllPageObjects.product();
			let preCount = 0;

			await test.step('Login as merchant, select store and open products list', async () => {
				await loginAndOpenProductList({ page, AllPageObjects, storeName: store });
				await productPage.refreshProductList();
				await productPage.clearProductSearch();
				preCount = await productPage.totalProductsCount();
				await logs.info(`Executing ${testCaseId}: ${details['Test Summary']}`);
			});

			await test.step('Open Add Product and fill all mandatory fields using an already-existing SKU', async () => {
				await productPage.openAddProductPage();
				await productPage.fillRequiredProductDetails({ name, sku, price, stock, category });
			});

			await test.step('Attempt to save and verify duplicate SKU error is shown', async () => {
				await productPage.saveProduct();
				await productPage.waitForDuplicateSkuError();
				await expect(productPage.duplicateSkuErrorMessage()).toBeVisible();
			});

			await test.step('Verify product count is unchanged after blocked save', async () => {
				await productPage.goToProductsPage();
				await productPage.refreshProductList();
				await productPage.clearProductSearch();
				const postCount = await productPage.totalProductsCount();
				expect(postCount).toBe(preCount);
			});

			const endTime = new Date();
			await ExcelUtils.updateStatus(
				filePath,
				sheetName,
				testCaseId,
				'Pass',
				startTime,
				endTime,
				`Duplicate SKU '${sku}' was correctly rejected; validation error displayed and product count remained at ${preCount}.`
			);
		} catch (error) {
			const endTime = new Date();
			await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
			throw error;
		}
	});


});


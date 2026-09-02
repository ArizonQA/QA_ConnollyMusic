import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';
import loginTestData from '../testcase/datas.js';

const { merchantLogin } = loginTestData;

test.describe('Products & Catalog', () => {
	const filePath = path.resolve('testcase/Commerce_Hub_AI_Test_cases.xlsx');
	const sheetName = 'Products & Catalog';

	function parseMultilineTestData(rawTestData) {
		const values = {};

		const normalizeValue = (value) => String(value || '')
			.trim()
			.replace(/;+$/g, '')
			.replace(/,+$/g, '')
			.trim();

		for (const line of String(rawTestData || '').split(/\r?\n/)) {
			const trimmedLine = line.trim();
			if (!trimmedLine || !trimmedLine.includes(':')) {
				continue;
			}

			const separatorIndex = trimmedLine.indexOf(':');
			const key = trimmedLine.slice(0, separatorIndex).trim();
			const value = normalizeValue(trimmedLine.slice(separatorIndex + 1));

			if (key) {
				values[key] = value;
			}
		}

		return values;
	}

	function getRequiredData(details) {
		const parsed = parseMultilineTestData(details['Test Data']);
		const data = {
			store: String(parsed.Store || '').trim(),
			sku: String(parsed.Sku || parsed.SKU || '').trim(),
		};

		const missingFields = Object.entries(data)
			.filter(([, value]) => !value)
			.map(([key]) => key);

		if (missingFields.length) {
			throw new Error(`Missing required fields in Excel Test Data: ${missingFields.join(', ')}`);
		}

		return data;
	}

	async function loginSelectStoreAndOpenProducts({ page, AllPageObjects, storeName }) {
		try {
			await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
		} catch {
			await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
		}

		if (/\/store\/login/.test(page.url())) {
			await AllPageObjects.login().login(merchantLogin.Email, merchantLogin.Password);
		}

		await AllPageObjects.product().selectStoreFromHeader(storeName);
		await AllPageObjects.product().goToProductsPage();
	}

	test('TC_PM_05 - Verify clearing the search field @regression', async ({ page, AllPageObjects, logs }) => {
		const testCaseId = 'TC_PM_05';
		const startTime = new Date();

		try {
			const details = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
			const data = getRequiredData(details);
			const productPage = AllPageObjects.product();

			await test.step('Login as merchant, select store, and open Products page', async () => {
				await loginSelectStoreAndOpenProducts({ page, AllPageObjects, storeName: data.store });
				await logs.info(`Executing ${testCaseId}: ${details['Test Summary']}`);
				await logs.info(`Module: ${details['Test Module']} | Environment: ${details['Test Environment']}`);
				await logs.info(`Expected Result: ${details['Expected Result']}`);
			});

			await test.step('Search for product by SKU and verify filtered row is visible', async () => {
				await productPage.searchProductBySku(data.sku);
				await expect(productPage.productRowByText(data.sku)).toBeVisible();
				await logs.info(`Searched for SKU: ${data.sku}`);
			});

			await test.step('Clear search field and verify complete product list is visible', async () => {
				await productPage.clearProductSearch();
				await expect(productPage.productSearchInput).toHaveValue('');
				await expect(productPage.productCountSummary).toBeVisible();
				await expect(productPage.productRowsLocator().first()).toBeVisible();
			});

			const endTime = new Date();
			await ExcelUtils.updateStatus(
				filePath,
				sheetName,
				testCaseId,
				'Pass',
				startTime,
				endTime,
				`Search was cleared for SKU '${data.sku}', and the complete product list was displayed again.`
			);
		} catch (error) {
			const endTime = new Date();
			await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
			throw error;
		}
	});
});

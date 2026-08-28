import { test, expect } from '../fixtures/base.js';
import ExcelUtils from '../utils/ExcelUtils.js';
import path from 'path';
import loginTestData from '../testcase/datas.js';

const { merchantLogin } = loginTestData;

test.describe('B2B Customer Management', () => {
	const filePath = path.resolve('testcase/Commerce_Hub_AI_Test_cases.xlsx');
	const sheetName = 'B2B Customer Management';

	function parseMultilineTestData(rawTestData) {
		const values = {};

		const normalizeValue = (value) => String(value || '')
			.trim()
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

	function getRequiredCompanyData(details) {
		const data = parseMultilineTestData(details['Test Data']);
		const companyData = {
			store: String(data.Store || '').trim(),
			companyName: String(data['Company Name'] || '').trim(),
			streetAddress: String(data['Street Address'] || '').trim(),
			addressLine2: String(data['Address Line 2'] || '').trim(),
			legalEntityName: String(data['Legal Entity Name'] || '').trim(),
			city: String(data.City || '').trim(),
			country: String(data.Country || '').trim(),
			industry: String(data.Industry || '').trim(),
			companyType: String(data['Company Type'] || '').trim(),
			state: String(data.State || '').trim(),
			zipCode: String(data['ZIP Code'] || data['ZIP / Postal'] || '').trim(),
			taxId: String(data['Tax ID'] || '').trim(),
			website: String(data.Website || '').trim(),
			phone: String(data.Phone || '').trim(),
			email: String(data.Email || '').trim(),
			tier: String(data.Tier || '').trim(),
			status: String(data.Status || '').trim(),
			creditLimit: String(data['Credit Limit'] || '').trim(),
			paymentTerms: String(data['Payment Terms'] || '').trim(),
			currency: String(data.Currency || '').trim(),
			priceList: String(data['Price List'] || 'Premier Special Price - Cust Trade Agreement').trim(),
		};

		const missingFields = Object.entries(companyData)
			.filter(([key, value]) => !value && !['addressLine2', 'legalEntityName', 'taxId', 'website'].includes(key))
			.map(([key]) => key);

		if (missingFields.length) {
			throw new Error(`Missing required B2B company fields in Excel Test Data: ${missingFields.join(', ')}`);
		}

		return companyData;
	}

	async function loginAndOpenB2BCustomers({ page, AllPageObjects, storeName }) {
		try {
			await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
		} catch {
			await page.goto('/store/login', { waitUntil: 'domcontentloaded' });
		}

		if (/\/store\/login/.test(page.url())) {
			await AllPageObjects.login().login(merchantLogin.Email, merchantLogin.Password);
		}

		await expect(page).toHaveURL(/\/store(?:\/)?$/);
		await AllPageObjects.product().selectStoreFromHeader(storeName);
		await AllPageObjects.b2bCustomer().goToB2BCustomersPage();
	}

	test('TC_B2B_1 - Verify Admin can add a new company account @critical', async ({ page, AllPageObjects, logs }) => {
		const testCaseId = 'TC_B2B_1';
		const startTime = new Date();

		try {
			const details = ExcelUtils.getTestCaseDetails(filePath, sheetName, testCaseId);
			const companyData = getRequiredCompanyData(details);
			const b2bCustomersPage = AllPageObjects.b2bCustomer();
			let preCount = 0;

			await test.step('Login as merchant, select the target store, and open B2B Customers', async () => {
				await loginAndOpenB2BCustomers({ page, AllPageObjects, storeName: companyData.store });

				if (await b2bCustomersPage.hasCompany(companyData.companyName)) {
					await logs.info(`Removing pre-existing company '${companyData.companyName}' to restore the Excel-defined test precondition.`);
					await b2bCustomersPage.deleteCompanyByName(companyData.companyName);
					await b2bCustomersPage.goToB2BCustomersPage();
				}

				preCount = await b2bCustomersPage.totalCompaniesCount();

				await logs.info(`Executing ${testCaseId}: ${details['Test Summary']}`);
				await logs.info(`Module: ${details['Test Module']} | Environment: ${details['Test Environment']}`);
				await logs.info(`Expected Result: ${details['Expected Result']}`);
			});

			await test.step('Open Add Company and complete the company details form', async () => {
				await b2bCustomersPage.openAddCompanyForm();
				await b2bCustomersPage.fillCompanyDetails(companyData);

				await logs.info(`Prepared company '${companyData.companyName}' for creation in store '${companyData.store}'.`);
			});

			await test.step('Create the company and verify it appears in the list', async () => {
				await b2bCustomersPage.createCompany();
				await b2bCustomersPage.goToB2BCustomersPage();

				const postCount = await b2bCustomersPage.totalCompaniesCount();
				const createdCompanyRow = b2bCustomersPage.companyRow(companyData.companyName);

				await expect(createdCompanyRow).toBeVisible();
				await expect(createdCompanyRow).toContainText(companyData.status);
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
				`Created company '${companyData.companyName}' and verified it appears in the company list with total count increasing from ${preCount} to ${preCount + 1}.`
			);
		} catch (error) {
			const endTime = new Date();
			await ExcelUtils.updateStatus(filePath, sheetName, testCaseId, 'Fail', startTime, endTime, '', error.message);
			throw error;
		}
	});
});

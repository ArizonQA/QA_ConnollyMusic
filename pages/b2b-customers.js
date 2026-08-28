export class B2BCustomersPage {
  constructor(page) {
    this.page = page;

    this.storeNavigation = page.getByRole('navigation', { name: /Store navigation/i });
    this.b2bCustomersLink = this.storeNavigation.getByRole('link', { name: 'B2B Customers' });
    this.b2bCustomersBreadcrumbButton = page.getByRole('button', { name: 'B2B Customers' });
    this.b2bCustomerManagementHeading = page.getByRole('heading', { name: 'B2B Customer Management' });
    this.editCompanyHeading = page.getByRole('heading', { name: 'Edit Company' });
    this.addCompanyButton = page.getByRole('button', { name: 'Add Company' });
    this.addNewCompanyHeading = page.getByRole('heading', { name: 'Add New Company' });
    this.customersTabButton = page.getByRole('button', { name: 'Customers' });

    this.companyNameInput = page.getByRole('textbox', { name: 'Company Name*' });
    this.streetAddressInput = page.getByRole('textbox', { name: 'Street Address*' });
    this.addressLine2Input = page.getByRole('textbox', { name: 'Address Line 2' });
    this.legalEntityNameInput = page.getByRole('textbox', { name: 'Legal Entity Name' });
    this.cityInput = page.getByRole('textbox', { name: 'City*' });
    this.countryInput = page.getByRole('textbox', { name: 'Country*' });
    this.industrySelect = page.getByRole('combobox').filter({
      has: page.getByRole('option', { name: 'Select industry' }),
    });
    this.companyTypeSelect = page.getByRole('combobox').filter({
      has: page.getByRole('option', { name: 'Select company type' }),
    });
    this.stateInput = page.getByRole('textbox', { name: 'State*' });
    this.zipPostalInput = page.getByRole('textbox', { name: 'ZIP / Postal*' });
    this.taxIdInput = page.getByRole('textbox', { name: 'XX-XXXXXXX' });
    this.websiteInput = page.getByRole('textbox', { name: 'https://...' });
    this.phoneInput = page.getByRole('textbox', { name: '+1...' });
    this.contactEmailInput = page.getByRole('textbox', { name: 'Contact Email*' });
    this.statusSelect = page.getByRole('combobox', { name: 'Status*' });
    this.creditLimitInput = page.getByRole('textbox', { name: 'Credit Limit*' });
    this.paymentTermsSelect = page.getByRole('combobox', { name: 'Payment Terms*' });
    this.currencySelect = page.getByRole('combobox', { name: 'Currency*' });
    this.priceListSelect = page.getByRole('combobox', { name: 'Price List*' });
    this.createCompanyButton = page.getByRole('button', { name: 'Create Company' });
    this.deleteConfirmationDialog = page.getByRole('dialog');
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  accountTierButton(tierName) {
    return this.page.getByRole('button', { name: new RegExp(String(tierName).trim(), 'i') }).first();
  }

  async selectAutocompleteValue(inputLocator, value) {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) {
      return;
    }

    await inputLocator.fill('');
    await inputLocator.fill(normalizedValue);

    const matchingOption = this.page.getByRole('option', {
      name: new RegExp(`^${this.escapeRegex(normalizedValue)}$`, 'i'),
    }).first();

    if (await matchingOption.isVisible().catch(() => false)) {
      await matchingOption.click();
      return;
    }

    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  companyRow(companyName) {
    return this.page.getByRole('row').filter({ hasText: String(companyName).trim() }).first();
  }

  deleteCompanyButton(companyName) {
    return this.page.getByRole('button', { name: `Delete ${String(companyName).trim()}` });
  }

  companyCountSummary() {
    return this.page.getByText(/Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+companies/i).first();
  }

  async goToB2BCustomersPage() {
    if (await this.editCompanyHeading.isVisible().catch(() => false)) {
      await this.customersTabButton.click();
    } else if (await this.addNewCompanyHeading.isVisible().catch(() => false) && await this.b2bCustomersBreadcrumbButton.isVisible().catch(() => false)) {
      await this.b2bCustomersBreadcrumbButton.click();
    } else if (await this.b2bCustomersLink.count()) {
      await this.b2bCustomersLink.first().click();
    } else {
      await this.page.goto('/b2b-customers', { waitUntil: 'domcontentloaded' });
    }

    await this.b2bCustomerManagementHeading.waitFor();
  }

  async openAddCompanyForm() {
    await this.goToB2BCustomersPage();
    await this.addCompanyButton.click();
    await this.addNewCompanyHeading.waitFor();
  }

  async selectAccountTier(tierName) {
    const normalizedTier = String(tierName || '').trim();
    if (!normalizedTier) {
      return;
    }

    await this.accountTierButton(normalizedTier).click();
  }

  async fillCompanyDetails(companyData) {
    await this.companyNameInput.fill(String(companyData.companyName));
    await this.streetAddressInput.fill(String(companyData.streetAddress));
    await this.addressLine2Input.fill(String(companyData.addressLine2 || ''));
    await this.legalEntityNameInput.fill(String(companyData.legalEntityName || ''));
    await this.cityInput.fill(String(companyData.city));
    await this.selectAutocompleteValue(this.countryInput, companyData.country);
    await this.industrySelect.selectOption({ label: String(companyData.industry) });
    await this.companyTypeSelect.selectOption({ label: String(companyData.companyType) });
    await this.selectAutocompleteValue(this.stateInput, companyData.state);
    await this.zipPostalInput.fill(String(companyData.zipCode));

    if (companyData.taxId) {
      await this.taxIdInput.fill(String(companyData.taxId));
    }

    if (companyData.website) {
      await this.websiteInput.fill(String(companyData.website));
    }

    if (companyData.phone) {
      await this.phoneInput.fill(String(companyData.phone));
    }

    await this.contactEmailInput.fill(String(companyData.email));
    await this.selectAccountTier(companyData.tier);
    await this.statusSelect.selectOption({ label: String(companyData.status) });
    await this.creditLimitInput.fill(String(companyData.creditLimit));
    await this.paymentTermsSelect.selectOption({ label: String(companyData.paymentTerms) });
    await this.currencySelect.selectOption({ label: String(companyData.currency) });
    await this.priceListSelect.selectOption({ label: String(companyData.priceList) });
  }

  async createCompany() {
    await this.createCompanyButton.click();
  }

  async hasCompany(companyName) {
    await this.companyCountSummary().waitFor();
    return (await this.companyRow(companyName).count()) > 0;
  }

  async deleteCompanyByName(companyName) {
    await this.deleteCompanyButton(companyName).click();
    await this.deleteConfirmationDialog.waitFor();
    await this.confirmDeleteButton.click();
  }

  async totalCompaniesCount() {
    const summaryText = await this.companyCountSummary().innerText();
    const match = summaryText.match(/of\s+(\d+)\s+companies/i);

    if (!match) {
      throw new Error(`Unable to parse company count from: ${summaryText}`);
    }

    return Number(match[1]);
  }
}
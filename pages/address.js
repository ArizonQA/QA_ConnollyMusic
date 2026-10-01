import loginTestData from '../testcase/datas.js';

export class AddressPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Navigation and overview headings
    this.addressNavTab = page.locator('.account-aside a, .account-navigation a').filter({ hasText: 'Addresses' }).first();
    this.accountHeading = page.getByRole('heading', { name: 'Addresses', level: 1 });
    this.availableAddressesHeading = page.getByRole('heading', { name: 'Available addresses', level: 2 });
    this.addNewAddressButton = page.getByRole('link', { name: 'Add new address' }).first();
    this.searchInput = page.locator('input.address-manager-list-search, input[placeholder*="Search addresses" i]').first();

    // Default address cards and badges
    this.defaultShippingCard = page.locator('.address-manager-select-address, .p-3.border').filter({ hasText: /default shipping address/i }).first();
    this.defaultBillingCard = page.locator('.address-manager-select-address, .p-3.border').filter({ hasText: /default billing address/i }).first();
    this.defaultShippingBadge = page.locator('.address-item-default-badge').filter({ hasText: /default shipping address/i }).first();
    this.defaultBillingBadge = page.locator('.address-item-default-badge').filter({ hasText: /default billing address/i }).first();
    this.availableAddressCards = page.locator('.address-manager-list-base .address-manager-select-address, .address-manager-list-base .address');

    // Dropdown menu items
    this.menuEdit = page.locator('.dropdown-menu.show').getByRole('link', { name: 'Edit' });
    this.menuUseDefaultShipping = page.locator('.dropdown-menu.show').getByRole('button', { name: 'Use as default shipping address' });
    this.menuUseDefaultBilling = page.locator('.dropdown-menu.show').getByRole('button', { name: 'Use as default billing address' });
    this.menuDeleteAddress = page.locator('.dropdown-menu.show').getByRole('button', { name: 'Delete address' });

    // Address form inputs
    this.salutationSelect = page.locator('#addresspersonalSalutation');
    this.firstNameInput = page.locator('#address-personalFirstName');
    this.lastNameInput = page.locator('#address-personalLastName');
    this.companyInput = page.locator('#address-company');
    this.departmentInput = page.locator('#address-department');
    this.streetInput = page.locator('#address-AddressStreet');
    this.zipcodeInput = page.locator('#addressAddressZipcode');
    this.cityInput = page.locator('#addressAddressCity');
    this.countrySelect = page.locator('#addressAddressCountry');
    this.stateSelect = page.locator('#addressAddressCountryState');
    this.saveAddressButton = page.locator('button[type="submit"]:has-text("Save address"), button:has-text("Save address")').first();
    this.backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();

    // Alerts and messages
    this.alertSuccess = page.locator('.alert-success, .flash-message');
    this.alertDanger = page.locator('.alert-danger, .alert');

    // Checkout complete order page elements
    this.checkoutShippingAddress = page.locator('.confirm-shipping-address, .shipping-address').first();
    this.checkoutBillingAddress = page.locator('.confirm-billing-address, .billing-address').first();
    this.changeShippingAddressButton = page.getByRole('button', { name: 'Change shipping address' }).or(page.getByRole('link', { name: 'Change shipping address' })).first();
    this.changeBillingAddressButton = page.getByRole('button', { name: 'Change billing address' }).or(page.getByRole('link', { name: 'Change billing address' })).first();
    this.checkoutModal = page.locator('.modal.show');
    this.checkoutModalChangeAddressBtn = page.locator('.modal.show').getByRole('button', { name: 'Change Address' });
    this.checkoutModalCloseBtn = page.locator('.modal.show').getByRole('button', { name: 'Close' }).or(page.locator('.modal.show .btn-close, .modal.show button[data-bs-dismiss="modal"]')).first();
    this.checkoutModalAddNewAddressBtn = page.locator('.modal.show').getByRole('link', { name: 'Add new address' }).or(page.locator('.modal.show a, .modal.show button').filter({ hasText: 'Add new address' })).first();
    this.checkoutModalShippingTab = page.locator('.modal.show').getByRole('tab', { name: /shipping/i }).or(page.locator('.modal.show .nav-tabs a, .modal.show .nav-tabs button, .modal.show .nav-link').filter({ hasText: /shipping/i })).first();
    this.checkoutModalBillingTab = page.locator('.modal.show').getByRole('tab', { name: /billing/i }).or(page.locator('.modal.show .nav-tabs a, .modal.show .nav-tabs button, .modal.show .nav-link').filter({ hasText: /billing/i })).first();
    this.checkoutModalAddressCards = page.locator('.modal.show .address-manager-select-address, .modal.show .card, .modal.show [class*="address"]');
    this.formLabels = page.locator('form label');
    this.stateSelectOptions = page.locator('#addressAddressCountryState option');
  }

  /**
   * Navigates to /account/address
   */
  async gotoAddressOverview() {
    await this.page.goto(new URL('/account/address', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigates to /account/address/create
   */
  async gotoCreateAddress() {
    await this.page.goto(new URL('/account/address/create', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
  }

  /**
   * Clicks the Add new address button
   */
  async clickAddNewAddress() {
    await this.addNewAddressButton.scrollIntoViewIfNeeded();
    await this.addNewAddressButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fills address form fields
   */
  async fillAddressForm({ salutation, firstName, lastName, company, department, street, zipcode, city, country, state } = {}) {
    if (salutation !== undefined) {
      if (typeof salutation === 'number') {
        await this.salutationSelect.selectOption({ index: salutation });
      } else {
        await this.salutationSelect.selectOption({ label: salutation }).catch(async () => {
          await this.salutationSelect.selectOption({ index: 1 });
        });
      }
    }
    if (firstName !== undefined) {
      await this.firstNameInput.fill(firstName);
    }
    if (lastName !== undefined) {
      await this.lastNameInput.fill(lastName);
    }
    if (company !== undefined) {
      await this.companyInput.fill(company);
    }
    if (department !== undefined) {
      await this.departmentInput.fill(department);
    }
    if (street !== undefined) {
      await this.streetInput.fill(street);
    }
    if (zipcode !== undefined) {
      await this.zipcodeInput.fill(zipcode);
    }
    if (city !== undefined) {
      await this.cityInput.fill(city);
    }
    if (country !== undefined) {
      await this.countrySelect.selectOption({ label: country }).catch(async () => {
        await this.countrySelect.selectOption({ index: 1 });
      });
      // Allow dynamic state populate if country selected
      await this.page.waitForLoadState('domcontentloaded');
    }
    if (state !== undefined) {
      try {
        if (await this.stateSelect.isVisible()) {
          await this.stateSelect.selectOption({ label: state }).catch(async () => {
            await this.stateSelect.selectOption({ index: 1 });
          });
        }
      } catch (e) {
        // State dropdown may not be present for all countries
      }
    }
  }

  /**
   * Clicks Save address button
   */
  async clickSaveAddress() {
    await this.saveAddressButton.scrollIntoViewIfNeeded();
    await this.saveAddressButton.click({ force: true });
  }

  /**
   * Locates an address card containing the specified text
   * @param {string} text
   */
  getAddressCard(text) {
    return this.page.locator('.address-manager-select-address, .address-manager-list-base .p-3, .address').filter({ hasText: text }).first();
  }

  /**
   * Opens the options (three-dot) menu on an address card
   * @param {import('@playwright/test').Locator} card
   */
  async openCardMenu(card) {
    const btn = card.locator('button[aria-label="Address options"], button[data-bs-toggle="dropdown"]').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
    await this.page.locator('.dropdown-menu.show').first().waitFor({ state: 'visible' }).catch(() => {});
  }

  /**
   * Ensures an item exists in the cart and navigates to /checkout/confirm
   */
  async ensureProductInCartAndGoToCheckout() {
    const confirmUrl = new URL('/checkout/confirm', loginTestData.Url).toString();
    await this.page.goto(confirmUrl, { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/checkout/cart') || this.page.url().includes('/account/login')) {
      // Need to add product
      await this.page.goto(new URL('/Catalog/', loginTestData.Url).toString(), { waitUntil: 'domcontentloaded' });
      const firstProduct = this.page.locator('.product-box a, .product-image-link, .product-name').first();
      if (await firstProduct.isVisible()) {
        await firstProduct.click();
        await this.page.waitForLoadState('domcontentloaded');
        const addToCartBtn = this.page.getByRole('button', { name: /add to shopping cart|add to cart/i }).first();
        if (await addToCartBtn.isVisible()) {
          await addToCartBtn.click();
          await this.page.waitForLoadState('domcontentloaded');
        }
      }
      await this.page.goto(confirmUrl, { waitUntil: 'domcontentloaded' });
    }
  }

  /**
   * Retrieves a form label by text
   * @param {string|RegExp} name
   */
  getFieldLabel(name) {
    return this.page.locator('label').filter({ hasText: name }).first();
  }

  /**
   * Searches for addresses using the search input
   * @param {string} term
   */
  async searchAddress(term) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter').catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clears the address search input
   */
  async clearSearch() {
    await this.searchInput.fill('');
    await this.searchInput.press('Enter').catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the Back button on the address form
   */
  async clickBack() {
    await this.backButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}


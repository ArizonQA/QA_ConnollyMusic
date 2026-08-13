export class ProductPage {
  constructor(page) {
    this.page = page;

    this.productManagementHeading = page.getByRole('heading', { name: 'Product Management' });
    this.storeNavigation = page.getByRole('navigation', { name: /Store navigation/i });
    this.productsLink = this.storeNavigation.getByRole('link', { name: 'Products' });
    this.addProductButton = page.getByRole('button', { name: /Add Product/i });
    this.addProductLink = page.getByRole('link', { name: /Add Product/i });
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.productSearchInput = page.getByRole('textbox', { name: /Search products/i });

    this.productNameInput = page.getByRole('textbox', { name: 'Product Name *' });
    this.skuInput = page.getByRole('textbox', { name: 'SKU *' });
    this.priceInput = page.getByRole('textbox', { name: 'Price', exact: true });
    this.currentStockInput = page.getByRole('spinbutton', { name: 'Current Stock' });
    this.lowStockAlertInput = page.getByRole('spinbutton', { name: 'Low Stock Alert' });
    this.saveProductButton = page.getByRole('button', { name: 'Save Product' }).last();
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async selectStoreFromHeader(storeName) {
    const targetStoreName = String(storeName || '').trim();
    if (!targetStoreName) {
      throw new Error('Store name is required.');
    }

    const escapedStoreName = this.escapeRegex(targetStoreName);
    const selectedStoreButton = this.page
      .getByRole('banner')
      .getByRole('button', { name: new RegExp(escapedStoreName, 'i') });

    if (await selectedStoreButton.count()) {
      return;
    }

    const switcherCandidates = [
      this.page.getByRole('banner').getByRole('button', { name: /expo|sandbox|store/i }),
      this.page.getByRole('button', { name: /expo|sandbox|store/i }),
    ];

    let switcherOpened = false;
    for (const switcher of switcherCandidates) {
      if (await switcher.count()) {
        await switcher.first().click();
        switcherOpened = true;
        break;
      }
    }

    if (!switcherOpened) {
      throw new Error(`Unable to find store switcher to select '${targetStoreName}'.`);
    }

    const optionCandidates = [
      this.page.getByRole('option', { name: new RegExp(escapedStoreName, 'i') }),
      this.page.getByRole('menuitem', { name: new RegExp(escapedStoreName, 'i') }),
      this.page.getByRole('button', { name: new RegExp(escapedStoreName, 'i') }),
    ];

    for (const option of optionCandidates) {
      if (await option.count()) {
        await option.first().click();
        return;
      }
    }

    throw new Error(`Store '${targetStoreName}' is not visible in the switcher.`);
  }

  async openProductsFromNavigation() {
    if (await this.productsLink.count()) {
      await this.productsLink.first().click();
      return;
    }

    const topProductsLink = this.page.getByRole('link', { name: 'Products' });
    if (await topProductsLink.count()) {
      await topProductsLink.first().click();
      return;
    }

    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }

  async goToProductsPage() {
    await this.openProductsFromNavigation();
    await this.productManagementHeading.waitFor();
  }

  async openAddProductPage() {
    await this.goToProductsPage();
    if (await this.addProductButton.count()) {
      await this.addProductButton.first().click();
    } else if (await this.addProductLink.count()) {
      await this.addProductLink.first().click();
    } else {
      throw new Error('Add Product control is not visible on Product Management page.');
    }
    await this.saveProductButton.waitFor();
  }

  async fillRequiredProductDetails({ name, sku, price, stock, category }) {
    await this.productNameInput.fill(String(name));
    await this.skuInput.fill(String(sku));
    await this.priceInput.fill(String(price).replace('$', '').trim());
    await this.currentStockInput.fill(String(stock));
    await this.lowStockAlertInput.fill('10');
    await this.selectCategory(category);
  }

  async selectCategory(categoryName) {
    const normalizedCategory = String(categoryName || '').trim();
    const category = this.page.getByRole('checkbox', { name: normalizedCategory });
    if (!await category.count()) {
      throw new Error(`Category '${normalizedCategory}' is not available.`);
    }
    await category.first().check();
  }

  async selectCategoryForEdit(categoryName) {
    const normalizedCategory = String(categoryName || '').trim();

    const checkedCategoryCheckboxes = this.page.getByRole('checkbox', {
      checked: true,
      name: /^(?!\s*Visible on storefront\s*$)(?!\s*Track Inventory\s*$).+/i,
    });

    for (const checkbox of await checkedCategoryCheckboxes.all()) {
      await checkbox.uncheck();
    }

    const targetCategory = this.page.getByRole('checkbox', { name: normalizedCategory });
    if (!await targetCategory.count()) {
      throw new Error(`Edit category '${normalizedCategory}' is not available.`);
    }

    await targetCategory.first().check();
  }

  productRowsLocator() {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('checkbox', { name: /Select (?!all products)/i }),
    });
  }

  productRowBySku(sku) {
    return this.page.getByRole('row').filter({ hasText: String(sku).trim() }).first();
  }

  productSummaryLocator(name, sku) {
    return this.page.getByRole('row').filter({ hasText: String(name).trim() }).filter({ hasText: String(sku).trim() }).first();
  }

  async refreshProductList() {
    await this.refreshButton.first().click();
  }

  async searchProductBySku(sku) {
    const searchValue = String(sku || '').trim();
    if (!searchValue) return;

    if (await this.productSearchInput.count()) {
      await this.productSearchInput.first().fill(searchValue);
      await this.page.keyboard.press('Enter');
      return;
    }

    const searchInputFallback = this.page.getByRole('textbox').first();
    if (await searchInputFallback.count()) {
      await searchInputFallback.fill(searchValue);
      await this.page.keyboard.press('Enter');
    }
  }

  async clearProductSearch() {
    if (await this.productSearchInput.count()) {
      await this.productSearchInput.first().fill('');
      await this.page.keyboard.press('Enter');
      return;
    }

    const searchInputFallback = this.page.getByRole('textbox').first();
    if (await searchInputFallback.count()) {
      await searchInputFallback.fill('');
      await this.page.keyboard.press('Enter');
    }
  }

  async hasProductBySku(sku) {
    const targetSku = String(sku || '').trim();
    if (!targetSku) return false;

    await this.clearProductSearch();
    await this.searchProductBySku(targetSku);
    const row = this.productRowBySku(targetSku).first();

    try {
      await row.waitFor({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async totalProductsCount() {
    const countSummary = this.page.getByText(/Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+products/i).first();
    if (!await countSummary.count()) {
      throw new Error('Could not find total products summary text.');
    }

    const summaryText = await countSummary.innerText();
    const match = summaryText.match(/of\s+(\d+)\s+products/i);
    if (!match) {
      throw new Error(`Unable to parse product count from: ${summaryText}`);
    }

    return Number(match[1]);
  }

  async waitForProductInList(name, sku) {
    await this.productSummaryLocator(name, sku).waitFor();
  }

  async saveProduct() {
    await this.saveProductButton.click();
  }

  async openProductForEditBySku(sku) {
    const rawSku = String(sku || '').trim();
    if (!rawSku) {
      throw new Error('SKU is required to open product for edit.');
    }

    const skuCandidates = [rawSku];
    if (!/^SKU-/i.test(rawSku) && /^\d+$/.test(rawSku)) {
      skuCandidates.push(`SKU-${rawSku}`);
    }

    let row = null;

    for (const candidate of skuCandidates) {
      await this.searchProductBySku(candidate);
      const matchedRow = this.productRowBySku(candidate);
      try {
        await matchedRow.first().waitFor({ timeout: 5000 });
        row = matchedRow;
        break;
      } catch {
        // Try the next SKU candidate.
      }
    }

    if (!row) {
      throw new Error(`No product row found for SKU candidates: ${skuCandidates.join(', ')}`);
    }

    await row.first().waitFor();

    const namedEditLink = row.first().getByRole('link', { name: 'Edit Product' });
    if (await namedEditLink.count()) {
      await namedEditLink.first().click();
      await this.saveProductButton.waitFor();
      return;
    }

    const namedEditButton = row.first().getByRole('button', { name: 'Edit Product' });
    if (await namedEditButton.count()) {
      await namedEditButton.first().click();
      await this.saveProductButton.waitFor();
      return;
    }

    const genericEditButton = row.first().getByRole('button', { name: /Edit/i });
    if (await genericEditButton.count()) {
      await genericEditButton.first().click();
      await this.saveProductButton.waitFor();
      return;
    }

    const firstActionButton = row.first().getByRole('button').first();
    if (await firstActionButton.count()) {
      await firstActionButton.click();
      await this.saveProductButton.waitFor();
      return;
    }

    await row.first().click();
    await this.saveProductButton.waitFor();
  }

  categoryCheckbox(categoryName) {
    return this.page.getByRole('checkbox', { name: String(categoryName).trim() });
  }

  async priceInputValue() {
    return this.priceInput.inputValue();
  }
}

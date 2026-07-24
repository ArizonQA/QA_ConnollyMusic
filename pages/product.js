export class ProductPage {
  constructor(page) {
    this.page = page;
    
    // Navigation elements
    this.productsMenu = page.getByRole('link', { name: /Products/i });
    this.addProductButton = page.getByRole('link', { name: 'Add Product' });
    this.allProductsLink = page.getByRole('link', { name: /All Products/i });
    this.productManagementHeading = page.getByRole('heading', { name: 'Product Management' });
    this.addNewProductHeading = page.getByText('Add New Product', { exact: true });
    
    // Form fields - Add/Edit Product
    this.productNameInput = page.getByRole('textbox', { name: 'Product Name *' });
    this.skuInput = page.getByRole('textbox', { name: 'SKU *' });
    this.priceInput = page.getByLabel(/Price/i);
    this.stockInput = page.getByRole('spinbutton', { name: 'Current Stock' });
    this.categorySelect = page.getByRole('combobox').last();
    
    // Form buttons
    this.saveProductButton = page.getByRole('button', { name: 'Save Product' }).last();
    this.cancelButton = page.getByRole('button', { name: 'Cancel' }).last();
    
    // Product list elements
    this.productTable = page.getByRole('table');
    this.productRows = page.getByRole('row');
    this.productCountText = page.getByText(/Showing \d+ to \d+ of \d+ products/i);
    
    // Success/Error messages
    this.successMessage = page.getByText(/saved|added|success/i);
    this.errorMessage = page.getByText(/error|failed/i);
  }

  async navigateToAddProduct() {
    const productsMenuVisible = await this.productsMenu.isVisible({ timeout: 5000 }).catch(() => false);
    if (productsMenuVisible) {
      await this.productsMenu.click();
      await this.productManagementHeading.waitFor({ state: 'visible', timeout: 10000 });
    }
    
    await this.addProductButton.click();
    await this.addNewProductHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async navigateToAllProducts() {
    const productsMenuVisible = await this.productsMenu.isVisible({ timeout: 5000 }).catch(() => false);
    if (productsMenuVisible) {
      await this.productsMenu.click();
    }

    await this.allProductsLink.click();
    await this.productManagementHeading.waitFor({ state: 'visible', timeout: 10000 });
    await this.productTable.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillProductForm(productName, sku, price, stock, category) {
    await this.productNameInput.fill(productName);
    await this.skuInput.fill(sku);
    await this.priceInput.fill(price.toString());
    await this.stockInput.fill(stock.toString());
    await this.categorySelect.selectOption({ label: category });
  }

  async saveProduct() {
    await this.saveProductButton.click();
  }

  async getProductCount() {
    try {
      const countText = await this.productCountText.textContent();
      const match = countText.match(/of\s+(\d+)\s+products/i);
      return match ? parseInt(match[1], 10) : 0;
    } catch {
      const rowCount = await this.productRows.count();
      return rowCount > 0 ? rowCount - 1 : 0;
    }
  }

  async getProductByName(productName) {
    return this.productRows.filter({ hasText: productName }).first();
  }

  async getProductBySku(sku) {
    return this.productRows.filter({ hasText: sku }).first();
  }

  async hasCategoryOption(category) {
    const options = await this.categorySelect.locator('option').allTextContents();
    return options.map(option => option.trim()).includes(category);
  }

  async verifyProductExists(productName, sku, price, stock, category) {
    const row = await this.getProductByName(productName);
    const exists = await row.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (exists) {
      const rowText = await row.textContent();
      return rowText.includes(sku) && rowText.includes(String(price)) && rowText.includes(String(stock));
    }
    return false;
  }
}

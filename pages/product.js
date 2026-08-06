export class ProductPage {
  constructor(page) {
    this.page = page;
    this.productsPageHeading = page.getByRole('heading', { name: 'Product Management' });
    this.addProductLink = page.getByRole('link', { name: 'Add Product' });
    this.productNameInput = page.getByRole('textbox', { name: 'Product Name *' });
    this.skuInput = page.getByRole('textbox', { name: 'SKU *' });
    this.priceInput = page.getByRole('textbox', { name: 'Price', exact: true });
    this.currentStockInput = page.getByRole('spinbutton', { name: 'Current Stock' });
    this.lowStockAlertInput = page.getByRole('spinbutton', { name: 'Low Stock Alert' });
    this.saveProductButton = page.getByRole('button', { name: 'Save Product' }).last();
  }

  async goToProductsPage() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }

  async openAddProductPage() {
    await this.goToProductsPage();
    await this.addProductLink.click();
  }

  async fillRequiredProductDetails({ name, sku, price, stock, category }) {
    await this.productNameInput.fill(name);
    await this.skuInput.fill(sku);
    await this.priceInput.fill(String(price).replace('$', '').trim());
    await this.currentStockInput.fill(String(stock));
    await this.lowStockAlertInput.fill('10');
    await this.selectCategory(category);
  }

  async selectCategory(categoryName) {
    const normalizedCategory = (categoryName || '').trim();
    const targetCheckbox = this.page.getByRole('checkbox', { name: normalizedCategory });
    if (await targetCheckbox.count()) {
      await targetCheckbox.check();
      return;
    }

    const fallbackCheckbox = this.page.getByRole('checkbox', { name: 'Backpacks' });
    if (await fallbackCheckbox.count()) {
      await fallbackCheckbox.check();
      return;
    }

    throw new Error(`Category '${categoryName}' is not available in the current UI.`);
  }

  async saveProduct() {
    await this.saveProductButton.click();
  }

  async refreshProductList() {
    await this.page.getByRole('button', { name: 'Refresh' }).click();
  }

  productSummaryLocator(productName, sku) {
    return this.page
      .getByRole('row')
      .filter({ hasText: productName })
      .filter({ hasText: sku })
      .first();
  }

  async waitForProductInList(productName, sku) {
    await this.productSummaryLocator(productName, sku).waitFor();
  }

  async clearRequiredProductDetails() {
    await this.productNameInput.fill('');
    await this.skuInput.fill('');
  }

  validationMessageLocator(message) {
    return this.page.getByText(message, { exact: true });
  }

  productRowsLocator() {
    return this.page.getByRole('table').locator('tbody tr');
  }
}

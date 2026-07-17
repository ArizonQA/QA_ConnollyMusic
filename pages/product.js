export class Product{
   constructor(page) {
    this.page = page;

    // Product Management
    this.productLink = page.locator("//a[.='Products']");
    this.heading = page.getByRole('heading', { name: 'Product Management' });
    this.searchBox = page.getByRole('textbox', { name: 'Search products by name, SKU' });
    this.tableBody = page.locator('tbody');
    this.addProductLink = page.getByRole('link', { name: 'Add Product' });

    // Add Product form
    this.productName = page.getByRole('textbox', { name: 'Product Name *' });
    this.sku = page.getByRole('textbox', { name: 'SKU *' });
    this.brand = page.getByRole('textbox', { name: 'Brand' });
    this.price = page.getByRole('textbox', { name: 'Price', exact: true });
    this.comparePrice = page.getByRole('textbox', { name: 'Compare At Price' });
    this.costPerItem = page.getByRole('textbox', { name: 'Cost Per Item' });
    this.description = page.locator('.tiptap');
    this.imageUpload = page.getByLabel('Drag images here or click to');
    this.weight = page.getByRole('textbox', { name: 'Weight (lbs)' });
    this.length = page.getByRole('textbox', { name: 'L', exact: true });
    this.width = page.getByRole('textbox', { name: 'W', exact: true });
    this.height = page.getByRole('textbox', { name: 'H', exact: true });
    this.categoryDropdown = page.locator('section').filter({ hasText: 'CategoriesSelect a' }).getByRole('combobox');
    this.saveButton = page.getByRole('button', { name: 'Save Product' }).nth(1);
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }
}
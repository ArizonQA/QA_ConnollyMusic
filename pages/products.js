export class ProductPage {
	constructor(page) {
		this.page = page;

		this.storeNavigation = page.getByRole('navigation', { name: /Store navigation/i });
		this.storeDropdownTrigger = page.getByRole('button', { name: /select store|switch store|market place|store/i }).first();
		this.productsNavLink = this.storeNavigation.getByRole('link', { name: 'Products' }).first();

		this.productManagementHeading = page.getByRole('heading', { name: 'Product Management' });
		this.productSearchInput = page.getByRole('textbox', { name: /search products by name, sku/i }).first();
		this.clearSearchButton = page.getByRole('button', { name: /clear search/i }).first();
		this.productCountSummary = page.getByText(/showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+products/i).first();
	}

	escapeRegex(value) {
		return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	async selectStoreFromHeader(storeName) {
		const normalizedStoreName = String(storeName || '').trim();
		if (!normalizedStoreName) {
			throw new Error('Store name is required to select store from header.');
		}

		const selectedStoreButton = this.page.getByRole('button', {
			name: new RegExp(`^${this.escapeRegex(normalizedStoreName)}$`, 'i'),
		}).first();

		if (await selectedStoreButton.isVisible().catch(() => false)) {
			return;
		}

		await this.storeDropdownTrigger.click();

		const storeOption = this.page.getByRole('option', { name: new RegExp(`^${this.escapeRegex(normalizedStoreName)}$`, 'i') })
			.or(this.page.getByRole('menuitem', { name: new RegExp(`^${this.escapeRegex(normalizedStoreName)}$`, 'i') }))
			.or(this.page.getByRole('button', { name: new RegExp(`^${this.escapeRegex(normalizedStoreName)}$`, 'i') }))
			.first();

		await storeOption.click();
	}

	async goToProductsPage() {
		await this.productsNavLink.click();
		await this.productManagementHeading.waitFor();
	}

	async searchProductBySku(sku) {
		const searchValue = String(sku || '').trim();
		if (!searchValue) {
			throw new Error('SKU is required to search products.');
		}

		await this.productSearchInput.fill(searchValue);
		await this.page.keyboard.press('Enter');
	}

	async clearProductSearch() {
		if (await this.clearSearchButton.isVisible().catch(() => false)) {
			await this.clearSearchButton.click();
			return;
		}

		await this.productSearchInput.fill('');
		await this.page.keyboard.press('Enter');
	}

	noProductsMatchRow() {
		return this.page.getByRole('row', { name: /No products match the current search and filter\./i });
	}

	productRowsLocator() {
		return this.page.getByRole('row').filter({
			has: this.page.getByRole('checkbox', { name: /Select (?!all products)/i }),
		});
	}

	productRowByText(value) {
		return this.page.getByRole('row').filter({ hasText: String(value || '').trim() }).first();
	}
}

export class DealerLocatorPage {
  constructor(page) {
    this.page = page;
    this.brandSelect = this.page.locator('#sct_brand');
    this.pageHeading = this.page.getByRole('heading', { name: 'Dealer Locator' });
  }

  async getSelectedBrand() {
    return await this.brandSelect.inputValue();
  }
}

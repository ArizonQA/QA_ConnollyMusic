export class CategoryPage {
  constructor(page) {
    this.page = page;
    this.productDetailsLinks = page.getByRole('link', { name: /details/i });
  }

  async openFirstProductDetails() {
    await this.productDetailsLinks.first().click();
  }
}

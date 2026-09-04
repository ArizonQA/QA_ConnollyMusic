export class ProductPage {
  constructor(page) {
    this.page = page;
    this.addToShoppingCartButton = page.getByRole('button', { name: /add to shopping cart/i });
    this.miniCartDialog = page.getByRole('dialog').first();
  }

  async addToShoppingCart() {
    await this.addToShoppingCartButton.click();
  }

  async goToCheckoutFromMiniCart() {
    await this.miniCartDialog.getByText(/go to checkout/i).click();
  }
}

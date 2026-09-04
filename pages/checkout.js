export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.termsCheckbox = page.getByRole('checkbox', { name: /terms|conditions/i });
    this.submitOrderButton = page.getByRole('button', { name: /submit order/i });
    this.orderConfirmationHeading = page.getByRole('heading', { name: /thank you for your order/i });
  }

  async acceptTermsAndConditions() {
    await this.termsCheckbox.check();
  }

  async selectPaymentMethod(methodName) {
    await this.page.getByRole('radio', { name: new RegExp(methodName, 'i') }).check();
  }

  async selectShippingMethod(methodName) {
    await this.page.getByRole('radio', { name: new RegExp(methodName, 'i') }).check();
  }

  async submitOrder() {
    await this.submitOrderButton.click();
  }

  getOrderConfirmationHeading() {
    return this.orderConfirmationHeading;
  }
}

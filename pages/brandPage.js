export class BrandPage {
  constructor(page) {
    this.page = page;
    this.dealerButton = this.page.locator('#dealer_button').getByRole('link', { name: 'FIND A DEALER' });
  }

  async navigateToBrand(brandPath) {
    await this.page.goto(brandPath, { waitUntil: 'domcontentloaded' });
  }

  async clickFindADealer() {
    await this.dealerButton.click();
  }
}

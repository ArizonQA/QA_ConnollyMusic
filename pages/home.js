export class HomePage {
  constructor(page) {
    this.page = page;
    this.accountButton = page.getByRole('button', { name: /account/i });
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
  }

  async openAccountMenu() {
    await this.accountButton.click();
  }

  async openSignUpPage() {
    await this.signUpLink.click();
  }

  async openCategory(categoryName) {
    await this.page.getByRole('link', { name: new RegExp(categoryName, 'i') }).first().click();
  }
}

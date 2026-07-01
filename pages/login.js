// Login Page Object Model - Converted from Java to JavaScript

export class LoginPage {
    constructor(page) {
        this.page = page;
        this.email = "Email Address";
        this.password = "Enter Your Password...";
        this.submit = "Log in";
        this.account = "Account";
        this.registerLink = "Create an Account";
    }

async loginIntoSite(email, password) {
  await this.page.getByText(this.account).click();
  await this.page.getByLabel(this.email).fill(email);
  await this.page.getByPlaceholder(this.password).fill(password);
  await this.page.getByText(this.submit).click();
}
}


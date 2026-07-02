export class FacebookLoginPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://www.facebook.com/';
    this.emailInput = "//input[@name='email']";
    this.passwordInput = "//input[@name='pass']";
    
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'load', timeout: 60000 });
  }

  async login(email, password) {
    await this.goto();
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
  
  }
}

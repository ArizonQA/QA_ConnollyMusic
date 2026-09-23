export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Work Email');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
    this.cookieTechnicalButton = page.getByRole('button', { name: 'Only technically required' });
    this.cookieAcceptAllButton = page.getByRole('button', { name: 'Accept all cookies' });
    this.loginHeading = page.getByRole('heading', { name: 'Sign in to your account' });
  }

  /**
   * Dismisses the cookie banner if present
   */
  async dismissCookieBanner() {
    try {
      if (await this.cookieTechnicalButton.isVisible()) {
        await this.cookieTechnicalButton.click();
      } else if (await this.cookieAcceptAllButton.isVisible()) {
        await this.cookieAcceptAllButton.click({ force: true });
      }
    } catch {
      // Ignore if banner is already gone or closed
    }
  }

  /**
   * Logs in with email and password
   * @param {string} email
   * @param {string} password
   */
  async loginAsCustomer(email, password) {
    await this.dismissCookieBanner();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Returns heading locator
   */
  getLoginHeading() {
    return this.loginHeading;
  }
}

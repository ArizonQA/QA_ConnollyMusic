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
    this.subtext = page.getByText(/Access.*agentic quoting.*logistics portal/i);
    this.brandMark = page.locator('.boltspec-login-brand');
    this.headerLogo = page.locator('header, [role="banner"]').getByRole('link', { name: /FastenerPilot|BoltSpec|FastenerSpec/i });
    this.passwordToggle = page.getByRole('button', { name: /Show password|Hide password/i });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.requestAccessLink = page.getByRole('link', { name: 'Request Access' });
    this.requestAccessText = page.getByText("Don't have an account? Request Access");
    this.requestAccessHeading = page.getByRole('heading', { name: 'Request Platform Access' });
    this.ssoButton = page.getByRole('button', { name: /Single Sign-On|SSO/i });
    this.errorAlert = page.locator('.alert, [role="alert"]').filter({ hasText: /Could not find an account|credentials|invalid|error/i });
    this.headerAvatar = page.locator('header').getByText(/Hi\s|welcome/i);
    this.loginCard = page.locator('.boltspec-login-card');
  }

  getEmailInput() { return this.emailInput; }
  getPasswordInput() { return this.passwordInput; }
  getSignInButton() { return this.signInButton; }
  getBrandMark() { return this.brandMark; }
  getLoginHeading() { return this.loginHeading; }
  getSubtext() { return this.subtext; }
  getRequestAccessLink() { return this.requestAccessLink; }
  getRequestAccessText() { return this.requestAccessText; }
  getRequestAccessHeading() { return this.requestAccessHeading; }
  getLoginCard() { return this.loginCard; }
  getHeaderAvatar() { return this.headerAvatar; }
  getErrorAlert() { return this.errorAlert; }

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
   * Navigates to the login page and dismisses cookie banner
   * @param {string} baseUrl
   */
  async gotoLoginPage(baseUrl = '/') {
    const loginUrl = new URL('/account/login', baseUrl).toString();
    await this.page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    await this.dismissCookieBanner();
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
    await this.signInButton.click({ force: true, timeout: 35000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fills the email field
   * @param {string} email
   */
  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  /**
   * Fills the password field
   * @param {string} password
   */
  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the Sign In button
   */
  async clickSignIn() {
    await this.signInButton.click({ force: true });
  }

  /**
   * Clicks the password toggle button (eye icon)
   */
  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }

  /**
   * Presses the Enter key while focused on the password field
   */
  async submitPasswordWithEnter() {
    await this.passwordInput.press('Enter');
  }

  /**
   * Clicks the header BoltSpec logo
   */
  async clickHeaderLogo() {
    const headerLink = this.page.locator('header, [role="banner"]').getByRole('link', { name: /FastenerPilot|BoltSpec|FastenerSpec/i }).first();
    await headerLink.click();
  }

  /**
   * Clicks the Forgot password? link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Clicks the Request Access link
   */
  async clickRequestAccess() {
    await this.requestAccessLink.click();
  }
}

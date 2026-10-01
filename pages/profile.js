export class ProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header and navigation
    this.profileSettingsHeaderLink = page.getByRole('link', { name: 'Profile Settings' });
    this.profileNavTab = page.getByRole('link', { name: 'Profile', exact: true });
    this.addressesNavTab = page.locator('.account-aside a, .account-navigation a').filter({ hasText: 'Addresses' }).first();
    this.activeNavTab = page.locator('.account-aside a.is-active, .account-navigation a.is-active, a.nav-link.is-active').first();
    this.allNavTabs = page.locator('.account-aside a, .account-navigation a');
    this.accountHeading = page.getByRole('heading', { name: 'Profile', level: 1 });
    this.accountSubtext = page.getByText('Check your personal data.');
    this.accountGreeting = page.locator('.account-aside, .account-nav, aside').getByText(/Hello,\s*/i).or(page.getByText(/Hello,\s*/i)).first();
    this.accountNav = page.getByRole('navigation', { name: 'Your account' });
    this.accountNavLinks = page.getByRole('navigation', { name: 'Your account' }).getByRole('link');
    this.headerUserGreeting = page.locator('header').getByText(/Hi /i).first();
    this.cartLink = page.getByRole('link', { name: /shopping cart/i }).or(page.locator('.header-cart, a[href*="checkout/cart"]')).first();

    // Personal data form
    this.personalDataHeading = page.getByText('Personal data', { exact: true });
    this.salutationSelect = page.getByRole('combobox', { name: /salutation/i });
    this.firstNameInput = page.getByRole('textbox', { name: /first name/i });
    this.lastNameInput = page.getByRole('textbox', { name: /last name/i });
    this.emailInput = page.getByRole('textbox', { name: /email address/i }).first();
    this.savePersonalDataButton = page.getByRole('button', { name: 'Save changes' }).first();
    this.validationAlert = page.locator('.alert-danger, .form-field-feedback, .alert');
    this.requiredAsterisks = page.locator('#profilePersonalForm span[aria-hidden="true"]:has-text("*")');
    this.requiredFieldsHelperText = page.locator('#profilePersonalForm').getByText(/Fields marked with asterisks/i);

    // Login Data section links and buttons
    this.registeredEmailText = page.getByText(/vijay@arizon\.digital/i).first();
    this.changeEmailButton = page.getByRole('button', { name: 'Change email address' });
    this.changeEmailLink = this.changeEmailButton;
    this.changePasswordButton = page.getByRole('button', { name: 'Change password' });
    this.changePasswordLink = this.changePasswordButton;

    // Change email form
    this.newEmailInput = page.locator('#profileMailForm').locator('input[type="email"]').first();
    this.newEmailConfirmationInput = page.getByLabel(/email address confirmation/i);
    this.emailCurrentPasswordInput = page.locator('#profileMailForm').getByLabel(/password/i);
    this.emailCurrentConfirmHelper = page.locator('#profileMailForm').getByText(/Please enter your current password to confirm your changes/i);
    this.saveEmailChangesButton = page.locator('#profileMailForm').getByRole('button', { name: 'Save changes' });

    // Password section form
    this.newPasswordInput = page.getByLabel(/new password/i);
    this.passwordConfirmationInput = page.getByLabel(/password confirmation/i);
    this.currentPasswordInput = page.locator('#profilePasswordForm').getByLabel(/current password/i);
    this.savePasswordChangesButton = page.locator('#profilePasswordForm').getByRole('button', { name: 'Save changes' });
    this.passwordMinLengthHelper = page.getByText(/Passwords must have a minimum length of 8 characters/i);
    this.passwordCurrentConfirmHelper = page.locator('#profilePasswordForm').getByText(/Please enter your current password to confirm your changes/i);

    // AI / Agentic elements (accessible via header / AI Copilot / Agentic Ordering)
    this.aiCopilotButton = page.getByRole('button', { name: /ai copilot/i });
    this.launchAiCanvasButton = this.aiCopilotButton;
    this.askAiInput = page.getByPlaceholder(/ask specs|tell ai/i);
    this.askAiButton = page.getByRole('button', { name: /ai copilot|ask ai|search/i });
    this.startAgenticOrderDraftButton = page.getByRole('link', { name: /agentic ordering/i });
    this.trendingPromptButton = page.getByRole('button', { name: /M8 Stainless Hex Bolts|trending/i }).first();
    this.specsPromptButton = page.getByRole('button', { name: /competitor part|specs/i }).first();
    this.volumePromptButton = page.getByRole('button', { name: /Reorder last month|volume/i }).first();
    this.regenerateResponseButton = page.getByRole('button', { name: /Regenerate response|refresh/i }).first();
    this.agenticHeading = page.getByRole('heading', { name: /Autonomous Fastener Sourcing/i }).first();
    this.bulkBomButton = page.getByRole('button', { name: /Bulk BOM Parser/i }).first();
    this.drawingAiButton = page.getByRole('button', { name: /Drawing & Blueprint AI/i }).first();
    this.liveOrderDraftHeading = page.getByRole('heading', { name: /Live Order Draft/i }).first();
    this.agenticFeatureBadges = page.getByText(/Auto Companion Mating|DIN \/ ISO Equivalents/i).first();
    this.agenticSubtitle = page.getByText(/DIN\/ISO Cross-Standard Engine/i).first();

    // Footer elements
    this.footerHeading = page.getByRole('heading', { name: /get product updates/i }).first();
    this.footerNewsletterInput = page.getByPlaceholder(/you@company.com/i).or(page.locator('input[type="email"][name*="newsletter"], footer input[type="email"]')).first();
    this.footerSubscribeButton = page.locator('footer').getByRole('button', { name: /subscribe/i }).first();

    // WAF / Cloudflare block page elements
    this.blockedHeading = page.getByRole('heading', { name: 'Sorry, you have been blocked' });
    this.blockedSubheading = page.getByRole('heading', { name: 'You are unable to access jetrails.cloud' });
    this.blockedWhyHeading = page.getByRole('heading', { name: 'Why have I been blocked?' });
    this.blockedResolveHeading = page.getByRole('heading', { name: 'What can I do to resolve this?' });
    this.cloudflareRayId = page.getByText(/^Cloudflare Ray ID:/);
    this.cloudflareBranding = page.getByText('Performance & security by Cloudflare');
  }

  /**
   * Navigates to profile using the Header link
   */
  async navigateViaHeader() {
    await this.profileSettingsHeaderLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigates to profile using the Account navigation tab
   */
  async navigateViaNavTab() {
    await this.profileNavTab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks Change email address button
   */
  async clickChangeEmailAddress() {
    await this.changeEmailButton.click({ timeout: 5000 });
  }

  /**
   * Clicks Change password button
   */
  async clickChangePassword() {
    await this.changePasswordButton.click({ timeout: 5000 });
  }

  /**
   * Clicks Launch AI Assistant Canvas button
   */
  async clickLaunchAiCanvas() {
    await this.aiCopilotButton.click({ timeout: 5000 });
  }

  /**
   * Enters query into Ask AI input
   * @param {string} query
   */
  async enterAskAiQuery(query) {
    await this.ensureAiCopilotOpen();
    await this.askAiInput.fill(query, { timeout: 5000 });
  }

  /**
   * Clicks Ask AI button
   */
  async clickAskAi() {
    await this.askAiInput.press('Enter');
  }

  /**
   * Clicks Start Agentic Order Draft button
   */
  async clickStartAgenticOrderDraft() {
    await this.startAgenticOrderDraftButton.click({ timeout: 5000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fills the password section
   * @param {string} newPassword
   * @param {string} confirmPassword
   * @param {string} currentPassword
   */
  async fillPasswordForm(newPassword, confirmPassword, currentPassword) {
    await this.ensurePasswordFormOpen();
    if (newPassword !== undefined) {
      await this.newPasswordInput.fill(newPassword, { timeout: 5000 });
    }
    if (confirmPassword !== undefined) {
      await this.passwordConfirmationInput.fill(confirmPassword, { timeout: 5000 });
    }
    if (currentPassword !== undefined) {
      await this.currentPasswordInput.fill(currentPassword, { timeout: 5000 });
    }
  }

  /**
   * Clicks Save changes in the password section
   */
  async clickSavePasswordChanges() {
    await this.savePasswordChangesButton.scrollIntoViewIfNeeded();
    await this.savePasswordChangesButton.click({ force: true });
  }

  /**
   * Fills the change email form
   * @param {string} newEmail
   * @param {string} confirmEmail
   * @param {string} currentPassword
   */
  async fillEmailChangeForm(newEmail, confirmEmail, currentPassword) {
    await this.ensureEmailFormOpen();
    if (newEmail !== undefined) {
      await this.newEmailInput.fill(newEmail, { timeout: 5000 });
    }
    if (confirmEmail !== undefined) {
      await this.newEmailConfirmationInput.fill(confirmEmail, { timeout: 5000 });
    }
    if (currentPassword !== undefined) {
      await this.emailCurrentPasswordInput.fill(currentPassword, { timeout: 5000 });
    }
  }

  /**
   * Clicks Save changes in the email change section
   */
  async clickSaveEmailChanges() {
    await this.saveEmailChangesButton.scrollIntoViewIfNeeded();
    await this.saveEmailChangesButton.click({ force: true });
  }

  /**
   * Clicks the Addresses tab in account navigation
   */
  async clickAddressesTab() {
    await this.addressesNavTab.click({ timeout: 5000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Restores default user first and last name
   */
  async restoreDefaultNames() {
    await this.firstNameInput.fill('Ar');
    await this.lastNameInput.fill('Commerce');
    await this.savePersonalDataButton.click({ timeout: 5000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Enters email in newsletter subscription input
   * @param {string} email
   */
  async enterNewsletterEmail(email) {
    await this.footerNewsletterInput.fill(email);
  }

  /**
   * Clicks newsletter subscribe button
   */
  async clickSubscribeNewsletter() {
    await this.footerSubscribeButton.click({ timeout: 5000 });
  }

  /**
   * Clicks Trending prompt card in AI drawer or Agentic page
   */
  async clickTrendingPrompt() {
    await this.trendingPromptButton.click({ timeout: 5000 });
  }

  /**
   * Navigates to Agentic Ordering page via Start Agentic Order Draft
   */
  async navigateToAgenticOrdering() {
    await this.startAgenticOrderDraftButton.click({ timeout: 5000 });
    await this.page.waitForLoadState('domcontentloaded');
  }
}



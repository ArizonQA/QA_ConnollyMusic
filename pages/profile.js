export class ProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header and navigation
    this.profileSettingsHeaderLink = page.getByRole('link', { name: 'Profile Settings' });
    this.profileNavTab = page.getByRole('link', { name: 'Profile', exact: true });
    this.accountHeading = page.getByRole('heading', { name: 'Profile', level: 1 });
    this.greetingContainer = page.locator('.account-welcome');

    // Personal data form
    this.firstNameInput = page.getByLabel('First name*');
    this.lastNameInput = page.getByLabel('Last name*');
    this.emailInput = page.getByLabel('Email address*');
    this.savePersonalDataButton = page.getByRole('button', { name: 'Save', exact: true });

    // Login Data section links
    this.changeEmailLink = page.getByRole('link', { name: 'Change email address' });
    this.changePasswordLink = page.getByRole('link', { name: 'Change password' });

    // Change email form
    this.newEmailInput = page.locator('#personalMail');
    this.newEmailConfirmationInput = page.locator('#personalMailConfirmation');
    this.emailCurrentPasswordInput = page.locator('#personalMailPasswordCurrent');
    this.saveEmailChangesButton = page.locator('#profileMailForm button.profile-form-submit, #profileMailForm button:has-text("Save changes")');

    // Password section form
    this.newPasswordInput = page.getByLabel('New password*');
    this.passwordConfirmationInput = page.getByLabel('Password confirmation*');
    this.currentPasswordInput = page.getByLabel('Current password*');
    this.savePasswordChangesButton = page.locator('#profilePasswordForm button.profile-form-submit, #profilePasswordForm button:has-text("Save changes")');

    // AI / Agentic elements
    this.launchAiCanvasButton = page.getByRole('button', { name: 'Launch AI Assistant Canvas' });
    this.askAiInput = page.getByPlaceholder(/ask ai/i);
    this.askAiButton = page.getByRole('button', { name: 'Ask AI', exact: true });
    this.startAgenticOrderDraftButton = page.getByRole('button', { name: 'Start Agentic Order Draft' });
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
   * Sets first name
   * @param {string} firstName
   */
  async setFirstName(firstName) {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Clears first name
   */
  async clearFirstName() {
    await this.firstNameInput.fill('');
  }

  /**
   * Sets last name
   * @param {string} lastName
   */
  async setLastName(lastName) {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Clears last name
   */
  async clearLastName() {
    await this.lastNameInput.fill('');
  }

  /**
   * Clicks Save on the personal data form
   */
  async clickSavePersonalData() {
    await this.savePersonalDataButton.click();
  }

  /**
   * Clicks Change email address link
   */
  async clickChangeEmailAddress() {
    await this.changeEmailLink.click({ timeout: 5000 });
  }

  /**
   * Clicks Change password link
   */
  async clickChangePassword() {
    await this.changePasswordLink.click({ timeout: 5000 });
  }

  /**
   * Clicks Launch AI Assistant Canvas button
   */
  async clickLaunchAiCanvas() {
    await this.launchAiCanvasButton.click({ timeout: 5000 });
  }

  /**
   * Enters query into Ask AI input
   * @param {string} query
   */
  async enterAskAiQuery(query) {
    await this.askAiInput.fill(query, { timeout: 5000 });
  }

  /**
   * Clicks Ask AI button
   */
  async clickAskAi() {
    await this.askAiButton.click({ timeout: 5000 });
  }

  /**
   * Clicks Start Agentic Order Draft button
   */
  async clickStartAgenticOrderDraft() {
    await this.startAgenticOrderDraftButton.click({ timeout: 5000 });
  }

  /**
   * Fills the password section
   * @param {string} newPassword
   * @param {string} confirmPassword
   * @param {string} currentPassword
   */
  async fillPasswordForm(newPassword, confirmPassword, currentPassword) {
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
    await this.savePasswordChangesButton.click({ timeout: 5000 });
  }

  /**
   * Fills the change email form
   * @param {string} newEmail
   * @param {string} confirmEmail
   * @param {string} currentPassword
   */
  async fillEmailChangeForm(newEmail, confirmEmail, currentPassword) {
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
    await this.saveEmailChangesButton.click({ timeout: 5000 });
  }
}

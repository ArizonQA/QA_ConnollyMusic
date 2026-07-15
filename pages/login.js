import { expect } from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;

        this.userTypeCommerceHubAi = page.getByRole('button', { name: /CommerceHub AI User/i });
        this.email = page.getByRole('textbox', { name: 'Email Address' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.signIn = page.getByRole('button', { name: 'Sign In' });
        this.CustomerHubAiHeading = page.getByRole('heading', { name: 'Welcome back' });
        this.CustomerHubAiSubHeading = page.getByText("Please enter your details to sign in to the CommerceHub AI console.");
        this.ForgetPassword = page.getByRole('link', { name: 'Forgot password?' });
        this.customerLoginHeading = page.getByRole('heading', { name: 'Customer Login' });
        this.loginDescription = page.getByRole('main');
        this.customerLoginTab = page.getByRole('button', { name: 'Customer Login' });
        this.invalidPassword = page.locator('form');
        this.rememberMe = page.getByRole('checkbox', { name: 'Remember me' });

        this.showPassword=page.getByRole('button', { name: 'Show password' });
       this.hidePassword= page.getByRole('button', { name: 'Hide password' });

    }


    async navigate(url) {

        await this.page.goto(url);

    }

    async verifyByDefaultCutomerLoginPageIsDisplayed(heading, subheading) {
        await this.page.waitForTimeout(1000);
        await expect(this.customerLoginHeading).toContainText(heading);
        await expect(this.loginDescription).toContainText(subheading);
    }

    async selectuserTypeCommerceHubAi() {

        await this.userTypeCommerceHubAi.click();
      
    }

    async validateCustomerHubAi_Tab(header, subheader) {

        await expect(this.CustomerHubAiHeading).toContainText(header);

        await expect(this.CustomerHubAiSubHeading).toContainText(subheader);
    }

    async switchToCustomerLoginTab(customerLoginSubHeading) {

        await this.customerLoginTab.click();
        await expect(this.loginDescription).toContainText(customerLoginSubHeading);
    }

    async loginIntoCustomerHubAi(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
        console.log(email + " " + password);
        await this.signIn.click();
    }

    async ForgetPasswordRedirection() {
        await this.ForgetPassword.click();

    }

    async observeErrorMessage(error) {

        await expect(this.invalidPassword).toContainText(error)

    }

    async verifyToggleRememberMe() {
    if (!(await this.rememberMe.isChecked())) {
        await this.rememberMe.check();
    }
    await expect(this.rememberMe).toBeChecked();

    await this.rememberMe.uncheck();
    await expect(this.rememberMe).not.toBeChecked();
}

async verifyPasswordMaskedByDefault(password) {

    await this.password.fill(password);
    await expect(this.password).toHaveAttribute('type', 'password');

}

async verifyShowHidePassword(password) {

    await this.password.fill(password);
    await expect(this.password).toHaveAttribute('type', 'password');

    await this.showPassword.click();
    await expect(this.password).toHaveAttribute('type', 'text');

    await this.hidePassword.click();
    await expect(this.password).toHaveAttribute('type', 'password');

}

 async loginWithRemberMeOption(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.rememberMe.check();
        await this.signIn.click();
    }

  async verifyEmailAutofilled(expectedEmail) {
        await expect(this.email).toHaveValue(expectedEmail);
    }

}
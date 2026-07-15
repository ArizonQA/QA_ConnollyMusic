import { expect } from '@playwright/test';

export class ForgetPassword {

    constructor(page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.emailTextbox = page.getByRole('textbox', { name: 'Email Address' });
        this.sendResetButton = page.getByRole('button', { name: 'Send reset link' });
        this.form = page.locator('form');
        this.backToSignInLink = page.getByRole('link', { name: 'Back to sign in' });
    }


    async verifyHeading(expectedText) {
        await expect(this.heading).toContainText(expectedText);
    }

    async enterEmail(email) {
        await this.emailTextbox.click();
        await this.emailTextbox.fill(email);
    }

    async sendResetLink() {
        await this.sendResetButton.click();
    }

    async verifyResetMessage(expectedMessage) {
        await expect(this.form).toContainText(expectedMessage);
    }

    async backToSignIn() {
        await this.backToSignInLink.click();
    }

}
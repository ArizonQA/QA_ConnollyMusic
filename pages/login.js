
import { expect } from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.accountMenu = page.getByText('Account');
        this.emailTextbox = page.getByLabel('Email Address');
        this.passwordTextbox = page.getByPlaceholder('Enter Your Password...');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.registerLink = page.getByText('Create an Account');
    }


    async loginIntoSite(email, password) {
        await this.accountMenu.click();
        await this.emailTextbox.fill(email);
        await this.passwordTextbox.fill(password);
        await this.loginButton.click();
    }

   
}
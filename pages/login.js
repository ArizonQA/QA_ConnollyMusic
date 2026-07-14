import { expect } from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;

        this.userTypeCommerceHubAi = page.getByRole('button', { name: 'CommerceHub AI User' });
        this.email = page.getByRole('textbox', { name: 'Email Address' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.signIn = page.getByRole('button', { name: 'Sign In' });
        this.validateCustomerHubAiTab =  page.getByText("Please enter your details to sign in to the CommerceHub AI console.");
        this.ForgetPassword = page.getByRole('link',{name:'Forgot password?'});
        
    }

    async navigate(url) {

        await this.page.goto(url);
        
    }

    async selectuserTypeCommerceHubAi() {
        
        await this.userTypeCommerceHubAi.click();
        await this.page.waitForTimeout(1000);
    }

    async validateCustomerHubAi_Tab(CustomeHubAiTabText) {

        await expect(this.validateCustomerHubAiTab).toContainText(
        CustomeHubAiTabText);
    }

    async loginIntoCustomerHubAi(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
        console.log(email+ " " +password);
        await this.signIn.click();
    }

    async ValidateForgetPasswordRedirection(){
        await this.ForgetPassword.click();
       
    }

   
}
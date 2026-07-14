import { expect } from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;

        this.userTypeCommerceHubAi = page.getByRole('button', { name: 'CommerceHub AI User' });
        this.email = page.getByRole('textbox', { name: 'Email Address' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.signIn = page.getByRole('button', { name: 'Sign In' });
        this.CustomerHubAiHeading =  page.getByRole('heading', { name: 'Welcome back'});
        this.CustomerHubAiSubHeading =  page.getByText("Please enter your details to sign in to the CommerceHub AI console.");
        this.ForgetPassword = page.getByRole('link',{name:'Forgot password?'});
        this.customerLoginHeading = page.getByRole('heading', { name: 'Customer Login' });
        this.loginDescription = page.getByRole('main');
        this.customerLoginTab = page.getByRole('button', { name: 'Customer Login' });


    }


    async navigate(url) {

        await this.page.goto(url);
        
    }

     async verifyByDefaultCutomerLoginPageIsDisplayed(heading, subheading) {
    await expect(this.customerLoginHeading).toContainText(heading);
    await expect(this.loginDescription).toContainText(subheading);
}

    async selectuserTypeCommerceHubAi() {
        
        await this.userTypeCommerceHubAi.click();
        await this.page.waitForTimeout(1000);
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
        console.log(email+ " " +password);
        await this.signIn.click();
    }

    async ValidateForgetPasswordRedirection(){
        await this.ForgetPassword.click();
       
    }

    
   
}
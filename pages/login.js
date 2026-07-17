
export class LoginPage {
    constructor(page) {
        this.page = page;

        //userTypeCommerceHubAi
        this.adminLogin = page.getByRole('button', { name: 'Admin Login' });
        this.email = page.getByRole('textbox', { name: 'Email Address' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.signIn = page.getByRole('button', { name: 'Sign In' });
        this.CustomerHubAiHeading = page.getByRole('heading', { name: 'Welcome back' });
        this.CustomerHubAiSubHeading = page.getByText("Please enter your details to sign in to the CommerceHub AI console.");
        this.ForgetPassword = page.getByRole('link', { name: 'Forgot password?' });
        this.customerLoginHeading = page.getByRole('heading', { name: 'Customer Login' });
       
        this.customerLoginTab = page.getByRole('button', { name: 'Customer Login' });
        this.invalidPassword = page.locator('form');
        this.rememberMe = page.getByRole('checkbox', { name: 'Remember me' });

        this.showPassword=page.getByRole('button', { name: 'Show password' });
       this.hidePassword= page.getByRole('button', { name: 'Hide password' });
       this.emailError=page.locator("//p[@class='mt-2 text-xs font-medium text-rose-500']");

    }

}
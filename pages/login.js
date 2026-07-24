
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.customerLoginTab = page.getByRole('button', { name: 'Customer Login' });
        this.adminLoginTab = page.getByRole('button', { name: 'Admin Login' });
        this.customerLoginHeading = page.getByRole('heading', { name: 'Customer Login' });
        this.customerSubtitle = page.getByText('Access your personalized storefront and continue your buying journey.');
        this.adminLoginHeading = page.getByRole('heading', { name: 'Welcome back' });
        this.adminSubtitle = page.getByText('Please enter your details to sign in to the CommerceHub AI console.');
        this.emailInput = page.getByLabel('Email Address');
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
        this.signInWithStoreAccessButton = page.getByRole('button', { name: 'Sign in with Store Access' });
        this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
        this.passwordVisibilityToggle = page.getByRole('button', { name: /Show password|Hide password/ });
        this.invalidCredentialsMessage = page.getByText('Invalid credentials.');
    }

    async goto() {
        await this.page.goto('/');
    }

    async switchToAdminLogin() {
        await this.adminLoginTab.click();
    }

    async switchToCustomerLogin() {
        await this.customerLoginTab.click();
    }

    async getPasswordInputType() {
        return await this.passwordInput.getAttribute('type');
    }

    async togglePasswordVisibility() {
        await this.passwordVisibilityToggle.click();
    }

    async loginAsCustomer(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }
}

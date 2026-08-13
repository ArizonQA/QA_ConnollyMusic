
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByLabel('Email Address');
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.first().click();
    }
}

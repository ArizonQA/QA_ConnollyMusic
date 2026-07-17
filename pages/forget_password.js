export class ForgetPassword {

    constructor(page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.emailTextbox = page.getByRole('textbox', { name: 'Email Address' });
        this.sendResetButton = page.getByRole('button', { name: 'Send reset link' });
        this.form = page.locator('form');
        this.backToSignInLink = page.getByRole('link', { name: 'Back to sign in' });
    }

}
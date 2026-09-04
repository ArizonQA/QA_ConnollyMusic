
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByLabel(/email/i).first();
        this.passwordInput = page.getByLabel(/password/i).first();
        this.loginButton = page.getByRole('button', { name: /^log in$/i }).first();
        this.personalInfoGroup = page.getByRole('group', { name: /personal information/i });
        this.addressGroup = page.getByRole('group', { name: /your address/i });
        this.continueButton = page.getByRole('button', { name: /^continue$/i });
        this.accountOverviewHeading = page.getByRole('heading', { level: 1, name: /overview/i });
    }

    async loginAsCustomer(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async registerCustomer(registrationData) {
        await this.personalInfoGroup.getByRole('combobox', { name: /salutation/i }).selectOption({ label: registrationData.salutation });
        await this.personalInfoGroup.getByRole('textbox', { name: /first name/i }).fill(registrationData.firstName);
        await this.personalInfoGroup.getByRole('textbox', { name: /last name/i }).fill(registrationData.lastName);
        await this.personalInfoGroup.getByRole('textbox', { name: /email address/i }).fill(registrationData.email);
        await this.personalInfoGroup.getByRole('textbox', { name: /password/i }).fill(registrationData.password);

        await this.addressGroup.getByRole('textbox', { name: /street address/i }).fill(registrationData.streetAddress);
        await this.addressGroup.getByRole('textbox', { name: /postal code/i }).fill(registrationData.postalCode);
        await this.addressGroup.getByRole('textbox', { name: /city/i }).fill(registrationData.city);
        await this.addressGroup.getByRole('combobox', { name: /country/i }).selectOption({ label: registrationData.country });
        await this.addressGroup.getByRole('combobox', { name: /state/i }).selectOption({ label: registrationData.state });

        await this.continueButton.click();
    }

    getAccountOverviewHeading() {
        return this.accountOverviewHeading;
    }
}
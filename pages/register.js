import { expect } from '@playwright/test';

export class RegisterPage {
  constructor(page) {
    this.page = page;

    // Search / Company selection
    this.customerNumber = page.getByLabel('Customer Number');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.selectFirst = page.getByText('Select').first();

    // Confirmation / create
    this.confirmCreateYourAccount = page.getByText('Confirm & Create Your Account');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

    // User fields
    this.firstName = page.getByLabel('First Name');
    this.lastName = page.getByLabel('Last Name');
    this.emailAddress = page.getByLabel('Email Address');
    this.emailConfirmation = page.getByLabel('Email Confirmation');
    this.phoneNumber = page.getByLabel('Phone Number');
    this.passwordTextbox = page.getByRole('textbox', { name: 'Password' });
    this.EACCheckbox = page.getByLabel('3rd Party/EAC');

    // New company / EAC form fields
    this.submitRequestButton = page.getByRole('button', { name: 'Submit Request' });
    this.fName = page.getByLabel('First Name');
    this.nName = page.getByLabel('Last Name');
    this.cEmail = page.getByLabel('Email');
    this.companyName = page.getByLabel('Company Name');
    this.address = page.getByLabel('Company Address');
    this.city = page.getByLabel('City');
    this.postalCode = page.getByLabel('Postal Code');
    this.phone = page.getByLabel('Phone');

    // Country / State selectors
    this.countryButton = page.getByRole('button', { name: 'Select Country' });
    this.searchCountry = page.getByPlaceholder('Search...');
    this.selectCountry = page.locator("//li[normalize-space()='United States']");

    this.stateButton = page.getByRole('button', { name: 'Select State' });
    this.searchState = page.getByPlaceholder('Search...');
    this.selectState = page.locator("//li[normalize-space()='New York']");

    this.submitButton = page.getByRole('button', { name: 'Submit' });

    this.myprofile= page.getByText('My Profile');
    this.companyName = page.getByLabel('Company Name');
  }


  async registerWithExistingCompany(data) {
    await this.customerNumber.fill("414518");
    await this.searchButton.click();
    await this.selectFirst.click();
    await this.confirmCreateYourAccount.click();
    await this.createAccountButton.click();
    
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.emailAddress.fill(data.email);
    await this.emailConfirmation.fill(data.email);
    await this.phoneNumber.fill(data.phone);
    await this.passwordTextbox.nth(0).fill(data.password);
    await this.passwordTextbox.nth(1).fill(data.password);
    await this.createAccountButton.click();

  }
}
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


  async register_With_Existing_Company_As_Exhibitor(data) {
    await this.customerNumber.fill("414518");
    await this.searchButton.click();
    await this.selectFirst.click();
    await this.confirmCreateYourAccount.click();

    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.emailAddress.fill(data.email);
    await this.emailConfirmation.fill(data.email);
    await this.phoneNumber.fill(data.phone);
    await this.passwordTextbox.nth(0).fill(data.password);
    await this.passwordTextbox.nth(1).fill(data.password);
    await this.createAccountButton.click();

  }

  async register_With_Existing_Company_As_Eac(EacData) {
    await this.customerNumber.fill("414518");
    await this.searchButton.click();
    await this.selectFirst.click();
    await this.confirmCreateYourAccount.click();
    
 
    await this.firstName.fill(EacData.firstName);
    await this.lastName.fill(EacData.lastName);
    await this.emailAddress.fill(EacData.email);
    await this.emailConfirmation.fill(EacData.email);
    await this.phoneNumber.fill(EacData.phone);
    await this.passwordTextbox.nth(0).fill(EacData.password);
    await this.passwordTextbox.nth(1).fill(EacData.password);
    await this.EACCheckbox.check();
    await this.createAccountButton.click();


  }

  async register_With_New_Company_As_Exhibitor(NewExhibitorData) {
    await this.customerNumber.fill("customernumber");
    await this.searchButton.click();
    await  this.submitRequestButton.click();
    await this.page.waitForTimeout(2000);
    await expect(this.page).toHaveURL("https://dev.ges.store/findcompany/submit");
    await this.fName.fill(NewExhibitorData.company.firstName);
    await this.nName.fill(NewExhibitorData.company.lastName);
    await this.cEmail.fill(NewExhibitorData.company.email);
    await this.companyName.fill(NewExhibitorData.company.companyName);
    await this.address.fill(NewExhibitorData.company.address);
    await this.city.fill(NewExhibitorData.company.city);
    await this.countryButton.click();
    await this.searchCountry.type(NewExhibitorData.company.country);

    await this.selectCountry.first().click();
    await this.stateButton.click();
    await this.searchState.fill(NewExhibitorData.company.state);
    await this.selectState.first().click();
    await this.postalCode.fill(NewExhibitorData.company.postalCode);
    await this.phone.fill(NewExhibitorData.company.phone);
    await this.submitButton.click();

await this.confirmCreateYourAccount.click();
    
    await this.firstName.fill(NewExhibitorData.company.userfirstName);
    await this.lastName.fill(NewExhibitorData.company.userlastName);
    await this.emailAddress.fill(NewExhibitorData.company.useremail);
    await this.emailConfirmation.fill(NewExhibitorData.company.useremail);
    await this.phoneNumber.fill(NewExhibitorData.company.userphone);
    await this.passwordTextbox.nth(0).fill(NewExhibitorData.company.userpassword);
    await this.passwordTextbox.nth(1).fill(NewExhibitorData.company.userpassword);
    await this.createAccountButton.click();


  }

  async register_With_New_Company_As_Eac(NewEacData) {
    await this.customerNumber.fill("customernumber");
    await this.searchButton.click();
    await  this.submitRequestButton.click();
    await this.page.waitForTimeout(2000);
    await expect(this.page).toHaveURL("https://dev.ges.store/findcompany/submit");
    await this.fName.fill(NewEacData.company.firstName);
    await this.nName.fill(NewEacData.company.lastName);
    await this.cEmail.fill(NewEacData.company.email);
    await this.companyName.fill(NewEacData.company.companyName);
    await this.address.fill(NewEacData.company.address);
    await this.city.fill(NewEacData.company.city);
    await this.countryButton.click();
    await this.searchCountry.fill(NewEacData.company.country);
    await this.selectCountry.click();
    await this.stateButton.click();
    await this.searchState.fill(NewEacData.company.state);
    await this.selectState.click();
    await this.postalCode.fill(NewEacData.company.postalCode);
    await this.phone.fill(NewEacData.company.phone);
    await this.submitButton.click();

    await this.confirmCreateYourAccount.click();
    
    await this.firstName.fill(NewEacData.company.userfirstName);
    await this.lastName.fill(NewEacData.company.userlastName);
    await this.emailAddress.fill(NewEacData.company.useremail);
    await this.emailConfirmation.fill(NewEacData.company.useremail);
    await this.phoneNumber.fill(NewEacData.company.userphone);
    await this.passwordTextbox.nth(0).fill(NewEacData.company.userpassword);
    await this.passwordTextbox.nth(1).fill(NewEacData.company.userpassword);
    await this.EACCheckbox.check();
    await this.createAccountButton.click();


  }
}
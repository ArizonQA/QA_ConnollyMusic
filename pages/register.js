export class RegisterPage {
  constructor(page) {
    this.page = page;

    // Label locator
    this.customerNumberInput = page.getByLabel('Customer Number');

    // Role locator
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // Text locator
    this.selectCompanyOption = page.getByText('Select').first();

    // Text locator
    this.confirmCreateYourAccountButton = page.getByText('Confirm & Create Your Account');

    // Label locator
    this.firstNameInput = page.getByLabel('First Name');

    // Label locator
    this.lastNameInput = page.getByLabel('Last Name');

    // Label locator
    this.phoneNumberInput = page.getByLabel('Phone Number');

    // Label locator
    this.emailAddressInput = page.getByLabel('Email Address');

    // Label locator
    this.emailConfirmationInput = page.getByLabel('Email Confirmation');

    // Role locator (textbox)
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    // Label locator
    this.eacCheckbox = page.getByLabel('3rd Party/EAC');

    // Role locator
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

    // Role locator
    this.submitRequestButton = page.getByRole('button', { name: 'Submit Request' });

    // Label locator
    this.companyContactFirstNameInput = page.getByLabel('First Name');

    // Label locator
    this.companyContactLastNameInput = page.getByLabel('Last Name');

    // Label locator
    this.companyEmailInput = page.getByLabel('Email');

    // Label locator
    this.companyNameInput = page.getByLabel('Company Name');

    // Label locator
    this.companyAddressInput = page.getByLabel('Company Address');

    // Label locator
    this.cityInput = page.getByLabel('City');

    // Role locator
    this.countryDropdown = page.getByRole('button', { name: 'Select Country' });

    // Placeholder locator
    this.countrySearchInput = page.getByPlaceholder('Search...');

    // XPath locator
    this.unitedStatesOption = page.locator("//li[normalize-space()='United States']");

    // Role locator
    this.stateDropdown = page.getByRole('button', { name: 'Select State' });

    // Placeholder locator
    this.stateSearchInput = page.getByPlaceholder('Search...');

    // XPath locator
    this.newYorkOption = page.locator("//li[normalize-space()='New York']");

    // Label locator
    this.postalCodeInput = page.getByLabel('Postal Code');

    // Label locator
    this.phoneInput = page.getByLabel('Phone');

    // Role locator
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }


  async ExistingCustomerRegistration() {
    await this.customerNumberInput.fill('123456');
  }
  
}
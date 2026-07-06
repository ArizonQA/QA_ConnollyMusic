export class RegisterTestData {
  static existingCompany() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'Devges+1@gmail.com',
      phone: '123-456-7890',
      password: 'Pass123!'
    };
  }

  static existingCompanyAsEac() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'DevgesEac+1@gmail.com',
      phone: '123-456-7890',
      password: 'Pass123!'
    };
  }

  static newExhibitorDetails() {
    return {
      company: {
        firstName: 'UAT',
        lastName: 'Exhibitor',
        email: 'UatNewExhibitorn@ges.com',
        companyName: 'It solution',
        address: '100 Park Street',
        city: 'New york',
        country: 'United States',
        state: 'New York',
        postalCode: '10001',
        phone: '98765432112',
        userfirstName: 'New',
        userlastName: 'Exhibitor',
        useremail: 'NewExhibitorAutomation@ges.com',
        userphone: '98765567890',
        userpassword: 'Pass@123'
      }
    };
  }

  static newEacDetails() {
    return {
      company: {
        firstName: 'New',
        lastName: 'EAC',
        email: 'NewEacAutomation@ges.com',
        companyName: 'It solution',
        address: '100 Park Street',
        city: 'New york',
        country: 'United States',
        state: 'New York',
        postalCode: '10001',
        phone: '984875892452',
        userfirstName: 'New',
        userlastName: 'EAC',
        useremail: 'NewEacAutomation@ges.com',
        userphone: '98765567890',
        userpassword: 'Pass@123'
      }
    };
  }

}

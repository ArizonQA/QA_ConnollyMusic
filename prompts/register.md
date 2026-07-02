Feature: Registration Flow Validation
As an exhibitor,
I want to register my company
So that I can log in and place orders associated with a booth.


1. Scenario: Validate Registering an account as existing exhibitor
Open exhibitor Portal- https://dev.ges.store/
provide the security code - FiP93&@1U94L
And the click on account 
Validate login page is displayed 
And click on create an account
Given Exhibitor enters a valid customer number - 212529 and selects a company
When Selecting a company and lands on the “Confirm Your Company” page
And Validates customer number
Then Click on the “Confirm and Create Account” button and validate the details like company name and address
And Enter first name, last name, phone number, email, and password
Then  Click on the “Create Account” button 
And Account should be created & Exhibitor should be redirected to the “My Shows” page
Validate company name and address is displayed on my shows page

2. Scenario: Validate Registering an account as existing 3rd Party EAC.
Open exhibitor Portal- https://dev.ges.store/
provide the security code - FiP93&@1U94L
And the click on account 
Validate login page is displayed 
Then Click on the “Confirm and Create Account” button and validate the details like company name and address
Given Exhibitor enters a valid customer number - 212529 and selects a company
When Selecting a company and lands on the “Confirm Your Company” page
And Validates customer number
Then Click on the “Confirm and Create Account” button and validate the details like company name and address
And Enter first name, last name, phone number, email, and password & Choose option User Type Exhibitor Or EAC
Then  Click on the “Create Account” button 
And Account should be created & Exhibitor should be redirected to the “My Shows” page
Validate company name and address is displayed on my shows page


3. Scenario: Validate new company registration as exhibitor
Open exhibitor Portal- https://dev.ges.store/
provide the security code - FiP93&@1U94L
And the click on account 
Validate login page is displayed 
And click on create an account
Given Exhibitor enters a invalid customer number
When Clicking on Submit Request
And Enter All company details
Then Click on the “Confirm and Create Account” button and validate the details like company name and address
And Enter first name, last name, phone number, email, and password - New Company
Then  Click on the “Create Account” button 
And Account should be created & Exhibitor should be redirected to the “My Shows” page
Validate company name and address is displayed on my shows page

4. Scenario: Validate new company registeration as exhibitor
Open exhibitor Portal- https://dev.ges.store/
provide the security code - FiP93&@1U94L
And the click on account 
Validate login page is displayed 
And click on create an account
Given Exhibitor enters a invalid customer number
When Clicking on Submit Request
And Enter All Eac details 
Then Click on the “Confirm and Create Account” button
And Enter first name, last name, phone number, email, and password & Choose option User Type - EAC
Then  Click on the “Create Account” button 
And Account should be created & Exhibitor should be redirected to the “My Shows” page
Validate company name and address is displayed on my shows page


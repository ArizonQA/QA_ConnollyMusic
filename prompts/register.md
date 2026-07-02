# Feature: Registration Flow Validation

**As an Exhibitor,**
I want to register my company account
**So that** I can log in and place orders associated with my booth.

---

## Scenario 1: Validate Registration for an Existing Exhibitor

**Given** the user opens the Exhibitor Portal: `https://dev.ges.store/`
**And** enters the security code **FiP93&@1U94L**
**And** clicks on **Account**
**Then** the Login page should be displayed
**When** the user clicks **Create an Account**
**And** enters a valid customer number **212529**
**And** selects the appropriate company
**Then** the user should be navigated to the **Confirm Your Company** page
**And** the customer number should be validated successfully
**When** the user clicks the **Confirm and Create Account** button
**Then** the company name and address should be displayed for verification
**When** the user enters the following registration details:

* First Name
* Last Name
* Phone Number
* Email Address
* Password

**And** clicks the **Create Account** button
**Then** the account should be created successfully
**And** the user should be redirected to the **My Shows** page
**And** the registered company name and address should be displayed.

---

## Scenario 2: Validate Registration for an Existing Third-Party EAC

**Given** the user opens the Exhibitor Portal: `https://dev.ges.store/`
**And** enters the security code **FiP93&@1U94L**
**And** clicks on **Account**
**Then** the Login page should be displayed
**When** the user clicks **Create an Account**
**And** enters a valid customer number **212529**
**And** selects the appropriate company
**Then** the user should be navigated to the **Confirm Your Company** page
**And** the customer number should be validated successfully
**When** the user clicks the **Confirm and Create Account** button
**Then** the company name and address should be displayed for verification
**When** the user enters the following registration details:

* First Name
* Last Name
* Phone Number
* Email Address
* Password

**And** selects the **User Type** as **EAC (Exhibitor Appointed Contractor)**
**And** clicks the **Create Account** button
**Then** the account should be created successfully
**And** the user should be redirected to the **My Shows** page
**And** the registered company name and address should be displayed.

---

## Scenario 3: Validate Registration for a New Exhibitor Company

**Given** the user opens the Exhibitor Portal: `https://dev.ges.store/`
**And** enters the security code **FiP93&@1U94L**
**And** clicks on **Account**
**Then** the Login page should be displayed
**When** the user clicks **Create an Account**
**And** enters an invalid customer number
**And** clicks **Submit Request**
**Then** the user should be prompted to enter the new company details
**When** the user enters all required company information
**And** clicks the **Confirm and Create Account** button
**And** enters the following registration details:

* First Name
* Last Name
* Phone Number
* Email Address
* Password

**And** clicks the **Create Account** button
**Then** the account should be created successfully
**And** the user should be redirected to the **My Shows** page
**And** the newly registered company name and address should be displayed.

---

## Scenario 4: Validate Registration for a New EAC Company

**Given** the user opens the Exhibitor Portal: `https://dev.ges.store/`
**And** enters the security code **FiP93&@1U94L**
**And** clicks on **Account**
**Then** the Login page should be displayed
**When** the user clicks **Create an Account**
**And** enters an invalid customer number
**And** clicks **Submit Request**
**Then** the user should be prompted to enter all required EAC company details
**When** the user enters the required EAC information
**And** selects the **User Type** as **EAC**
**And** clicks the **Create Account** button
**Then** the account should be created successfully
**And** the user should be redirected to the **My Shows** page
**And** the registered company name and address should be displayed.

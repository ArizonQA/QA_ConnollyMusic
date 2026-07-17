export class TestData {

     static Urls() {
        return {
            Url: "https://commerce-hub-ai.arizon.solutions/",
            DashboardUrl: 'https://commerce-hub-ai.arizon.solutions/admin',
            forgetPasswordUrl:'https://commerce-hub-ai.arizon.solutions/forgot-password',
        }
    }
//CustomerHublogin
    static loginData() {
        return { 

            email: 'kathir@arizon.digital',
            password: 'password',
            AdminTabHeading: 'Welcome back',
            AdminSubTabHeading: 'Please enter your details to sign in to the CommerceHub AI console.',
            customerLoginHeading:"Customer Login",
        };
    }

    static forgetPassword(){
        return{
            forgetPasswordHeading: 'Forgot password',
            forgetPasswordsubHeading: "Enter your work email address and we'll send a reset link if an account exists.",
            successMessage:'If the email exists, a reset link has been sent.',
        }
    }

    static invalidLogin(){
        return {
            password:'password123',
            errorMessage:'Invalid credentials.'
        }
    }
    // 🔑 New static function for invalid email datasets
    static invalidEmails() {
    return {
        errorMessageForEmail: "Enter a valid email address.",
        errorMessageForEmptyEmail:"Enter an email address."
    };
}

}

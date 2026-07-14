export class TestData {

     static Urls() {
        return {
            CommerceHubAi: "https://commerce-hub-ai.arizon.solutions/",
            customerDashboard: 'https://commerce-hub-ai.arizon.solutions/admin',
        }
    }

    static CustomerHublogin() {
        return { 
            email: 'kathir@arizon.digital',
            password: 'password',

            CustomeHubAiTabHeading: 'Welcome back',
            CustomeHubAiTabSubHeading: 'Please enter your details to sign in to the CommerceHub AI console.',
            
            customerLoginHeading:
                "Customer Login",

            customerLoginSubHeading:
                "Access your personalized storefront and continue your buying journey."
        };
    }

    static forgetPassword(){
        return{
            forgetPasswordHeading: "Enter your work email address and we'll send a reset link if an account exists.",
        }
    }
}

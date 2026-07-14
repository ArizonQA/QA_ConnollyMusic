import { expect } from '@playwright/test';

export class ForgetPassword{

    constructor(page){
        this.page= page;
        this.Forgotpassword =page.getByText("Enter your work email address and we'll send a reset link if an account exists.");
    }


   async validateForgetPasswordTab(heading) {
    await expect(this.Forgotpassword).toHaveText(heading);
}


}
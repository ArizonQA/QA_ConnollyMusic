import { expect } from '@playwright/test';

export class DashboardPage {

    constructor(page) {
        this.page = page;
        this.Customers=page.getByRole('link',{name:'Customers'});
         this.profileButton = page.getByRole('button', {
            name: 'KA Kathir Admin Enterprise'
        });

        this.logoutButton = page.getByRole('button', {
            name: 'Logout'
        });

       
    }

    async logout() {
        await this.profileButton.click();
        await this.page.waitForTimeout(2000);
        await this.logoutButton.click();

        await this.page.waitForTimeout(2000);
    }
    async clickOncustomer(){
        await this.Customers.click();
    }

}
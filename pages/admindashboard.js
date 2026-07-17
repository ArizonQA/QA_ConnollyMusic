import { expect } from '@playwright/test';

export class DashboardPage {

    constructor(page) {
        this.page = page;
        this.Customers=page.getByRole('link',{name:'Customers'});
        this.adminText=page.getByRole('banner');
         this.profileButton = page.getByRole('button', {
            name: 'KA Kathir Admin Enterprise'
        });

        this.logoutButton = page.getByRole('button', {
            name: 'Logout'
        });

       
    }
 
}
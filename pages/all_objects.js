import { LoginPage } from './login.js';
import { ProductPage } from './products.js';
import { B2BCustomersPage } from './b2b-customers.js';

export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.loginpage = null;
    this.productpage = null;
    this.b2bCustomersPage = null;
  }

  login() {
    if (!this.loginpage) this.loginpage = new LoginPage(this.page);
    return this.loginpage;
  }

  product() {
    if (!this.productpage) this.productpage = new ProductPage(this.page);
    return this.productpage;
  }

  b2bCustomer() {
    if (!this.b2bCustomersPage) this.b2bCustomersPage = new B2BCustomersPage(this.page);
    return this.b2bCustomersPage;
  }

}
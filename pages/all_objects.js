import { LoginPage } from './login.js';
import { ProductPage } from './product.js';

export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.loginpage = null;
    this.productpage = null;
  }

  login() {
    if (!this.loginpage) this.loginpage = new LoginPage(this.page);
    return this.loginpage;
  }

  product() {
    if (!this.productpage) this.productpage = new ProductPage(this.page);
    return this.productpage;
  }

}
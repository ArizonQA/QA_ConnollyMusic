import { LoginPage } from './login.js';
import { HomePage } from './home.js';
import { CategoryPage } from './category.js';
import { ProductPage } from './product.js';
import { CheckoutPage } from './checkout.js';

export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.homepage = null;
    this.loginpage = null;
    this.categorypage = null;
    this.productpage = null;
    this.checkoutpage = null;
  
  }

  home() {
    if (!this.homepage) this.homepage = new HomePage(this.page);
    return this.homepage;
  }

  login() {
    if (!this.loginpage) this.loginpage = new LoginPage(this.page);
    return this.loginpage;
  }

  category() {
    if (!this.categorypage) this.categorypage = new CategoryPage(this.page);
    return this.categorypage;
  }

  product() {
    if (!this.productpage) this.productpage = new ProductPage(this.page);
    return this.productpage;
  }

  checkout() {
    if (!this.checkoutpage) this.checkoutpage = new CheckoutPage(this.page);
    return this.checkoutpage;
  }

}
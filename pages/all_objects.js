import { LoginPage } from './login.js';
import { DashboardPage } from './admindashboard.js';
import {CustomerDashboard} from './customerDashboard.js';
import { ForgetPassword } from './forget_password.js';
import {Product} from './product.js';


export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.loginpage = null;
    this.dashboardpage =null;
    this.forgetPassword = null;
    this.customerDashboard=null;
    this.products=null;
   
  }

  login() {
    if (!this.loginpage) this.loginpage = new LoginPage(this.page);
    return this.loginpage;
  }

  dashboard() {
    if (!this.dashboardpage) this.dashboardpage = new DashboardPage(this.page);
    return this.dashboardpage;
  }

  forget(){
    if(!this.forgetPassword) this.forgetPassword = new ForgetPassword(this.page);
    return this.forgetPassword;
  }
  customerDashboard(){
    if(!this.customerDashboard) this.customerDashboard = new CustomerDashboard(this.page);
    return this.customerDashboard;
  }

  product(){
    if(!this.product) this.product =new Product(this.page)
      return this.product;
  }
 
//   async waitForTimeout(ms) {
//     await this.page.waitForTimeout(ms);
//   }

//    async goBack() {
//     await this.page.goBack();
//   }

 
//   async goToUrl(url) {
//   await this.page.goto(url, { waitUntil: 'networkidle' }); 
// }

}
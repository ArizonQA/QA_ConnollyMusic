import { LoginPage } from './login.js';
import { DashboardPage } from './dashboard.js';
import { ForgetPassword } from './forget_password.js';


export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.loginpage = null;
    this.dashboardpage =null;
    this.forgetPassword = null;
   
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
}
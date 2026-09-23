import { LoginPage } from './login.js';
import { CategoryPage } from './category.js';
import { ProfilePage } from './profile.js';

export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.categorypage = null;
    this.loginpage = null;
    this.profilepage = null;
  }
  
  category() {
    if (!this.categorypage) this.categorypage = new CategoryPage(this.page);
    return this.categorypage;
  }

  login() {
    if (!this.loginpage) this.loginpage = new LoginPage(this.page);
    return this.loginpage;
  }

  profile() {
    if (!this.profilepage) this.profilepage = new ProfilePage(this.page);
    return this.profilepage;
  }
}
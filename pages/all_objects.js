import { LoginPage } from './login.js';
import { CategoryPage } from './category.js';
import { ProfilePage } from './profile.js';
import { AddressPage } from './address.js';
import { QuotePage } from './quote.js';
import { ReorderPage } from './reorder.js';

export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.categorypage = null;
    this.loginpage = null;
    this.profilepage = null;
    this.addresspage = null;
    this.quotepage = null;
    this.reorderpage = null;
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

  address() {
    if (!this.addresspage) this.addresspage = new AddressPage(this.page);
    return this.addresspage;
  }

  quote() {
    if (!this.quotepage) this.quotepage = new QuotePage(this.page);
    return this.quotepage;
  }

  reorder() {
    if (!this.reorderpage) this.reorderpage = new ReorderPage(this.page);
    return this.reorderpage;
  }
}

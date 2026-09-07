import { LoginPage } from './login.js';
import { CategoryPage } from './category.js';

export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.categorypage = null;
    
  
  }
  
  category() {
    if (!this.categorypage) this.categorypage = new CategoryPage(this.page);
    return this.categorypage;
  }


}
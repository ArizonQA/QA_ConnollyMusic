import { CategoryPage } from './category.js';
import { BrandPage } from './brandPage.js';
import { DealerLocatorPage } from './dealerLocatorPage.js';

export class AllPageObjects {
  
  constructor(page) {
    this.page = page;
    this.categorypage = null;
    this.brandPage = null;
    this.dealerLocatorPage = null;
  }
  
  category() {
    if (!this.categorypage) this.categorypage = new CategoryPage(this.page);
    return this.categorypage;
  }

  brand() {
    if (!this.brandPage) this.brandPage = new BrandPage(this.page);
    return this.brandPage;
  }

  dealerLocator() {
    if (!this.dealerLocatorPage) this.dealerLocatorPage = new DealerLocatorPage(this.page);
    return this.dealerLocatorPage;
  }

}
import { LoginPage } from './login.js';

export class AllPageObjects {
  constructor(page) {
    this.page = page;
    this._login = null;
  }

  login() {
    if (!this._login) this._login = new LoginPage(this.page);
    return this._login;
  }
}
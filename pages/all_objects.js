import { LoginPage } from './login.js';
import { RegisterPage } from './register.js';

export class AllPageObjects {
  constructor(page) {
    this.page = page;
    this._login = null;
    this._register = null;
  }

  login() {
    if (!this._login) this._login = new LoginPage(this.page);
    return this._login;
  }

  register() {
    if (!this._register) this._register = new RegisterPage(this.page);
    return this._register;
  }
  
}
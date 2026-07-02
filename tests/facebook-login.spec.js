import { test, expect } from '@playwright/test';
import { FacebookLoginPage } from '../pages/facebook-login.js';

const fbEmail = process.env.FB_EMAIL || 'your-facebook-email';
const fbPassword = process.env.FB_PASSWORD || 'your-facebook-password';

test('Facebook login', async ({ page }) => {
  const facebookLogin = new FacebookLoginPage(page);
  await facebookLogin.login("vijay@gmail.com", "Pass@123");
  
});

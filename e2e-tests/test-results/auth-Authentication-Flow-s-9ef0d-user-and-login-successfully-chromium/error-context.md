# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flow >> should register a new user and login successfully
- Location: tests\auth.spec.js:10:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Authentication Flow', () => {
  4  |   const testUser = {
  5  |     name: `TestUser_${Date.now()}`,
  6  |     email: `test${Date.now()}@example.com`,
  7  |     password: 'password123'
  8  |   };
  9  | 
  10 |   test('should register a new user and login successfully', async ({ page }) => {
  11 |     // 1. Register a new user
> 12 |     await page.goto('/');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  13 |     
  14 |     // Open Login Popup
  15 |     await page.click('button:has-text("sign in")');
  16 |     await expect(page.locator('.login-popup-container')).toBeVisible();
  17 | 
  18 |     // Switch to Sign Up
  19 |     await page.click('text=Click here');
  20 |     await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
  21 | 
  22 |     // Fill form
  23 |     await page.fill('input[name="name"]', testUser.name);
  24 |     await page.fill('input[name="email"]', testUser.email);
  25 |     await page.fill('input[name="password"]', testUser.password);
  26 |     await page.check('input[type="checkbox"]');
  27 | 
  28 |     // Submit
  29 |     await page.click('button:has-text("Create account")');
  30 |     
  31 |     // Verify login success (popup disappears, profile icon appears)
  32 |     await expect(page.locator('.login-popup')).toBeHidden();
  33 |     await expect(page.locator('.navbar-profile')).toBeVisible();
  34 | 
  35 |     // 2. Logout
  36 |     await page.hover('.navbar-profile');
  37 |     await page.click('li:has-text("Logout")');
  38 |     
  39 |     // Verify logout (sign in button appears)
  40 |     await expect(page.locator('button:has-text("sign in")')).toBeVisible();
  41 | 
  42 |     // 3. Login
  43 |     await page.click('button:has-text("sign in")');
  44 |     await page.fill('input[name="email"]', testUser.email);
  45 |     await page.fill('input[name="password"]', testUser.password);
  46 |     await page.check('input[type="checkbox"]');
  47 |     await page.click('button:has-text("Login")');
  48 | 
  49 |     // Verify login success
  50 |     await expect(page.locator('.navbar-profile')).toBeVisible();
  51 |   });
  52 | });
  53 | 
```
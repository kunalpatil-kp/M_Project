const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  const testUser = {
    name: `TestUser_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };

  test('should register a new user and login successfully', async ({ page }) => {
    // 1. Register a new user
    await page.goto('/');
    
    // Open Login Popup
    await page.click('button:has-text("sign in")');
    await expect(page.locator('.login-popup-container')).toBeVisible();

    // Switch to Sign Up
    await page.click('text=Click here');
    await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();

    // Fill form
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.check('input[type="checkbox"]');

    // Submit
    await page.click('button:has-text("Create account")');
    
    // Verify login success (popup disappears, profile icon appears)
    await expect(page.locator('.login-popup')).toBeHidden();
    await expect(page.locator('.navbar-profile')).toBeVisible();

    // 2. Logout
    await page.hover('.navbar-profile');
    await page.click('li:has-text("Logout")');
    
    // Verify logout (sign in button appears)
    await expect(page.locator('button:has-text("sign in")')).toBeVisible();

    // 3. Login
    await page.click('button:has-text("sign in")');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Login")');

    // Verify login success
    await expect(page.locator('.navbar-profile')).toBeVisible();
  });
});

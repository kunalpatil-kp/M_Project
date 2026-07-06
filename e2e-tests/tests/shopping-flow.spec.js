const { test, expect } = require('@playwright/test');

test.describe('Shopping and Checkout Flow', () => {
  let userEmail = `shopper${Date.now()}@test.com`;
  let userPassword = 'password123';

  test.beforeEach(async ({ page }) => {
    // Register and login a fresh user for shopping
    await page.goto('/');
    await page.click('button:has-text("sign in")');
    await page.click('text=Click here');
    await page.fill('input[name="name"]', 'Shopper');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Create account")');
    await expect(page.locator('.navbar-profile')).toBeVisible();
  });

  test('should browse, add items to cart, and proceed to checkout', async ({ page }) => {
    // 1. Browse Food Categories
    await page.goto('/');
    
    // Wait for food display to load
    await expect(page.locator('.food-display-list')).toBeVisible();
    
    // Click on 'Pure Veg' category to filter
    await page.click('p:has-text("Pure Veg")');
    
    // 2. Add multiple items to cart
    const addIcons = page.locator('.add');
    await addIcons.first().waitFor();
    
    // Add first item
    await addIcons.nth(0).click();
    
    // 3. Update quantity (increase)
    const plusIcons = page.locator('img[alt="plus"]');
    await expect(plusIcons.first()).toBeVisible();
    await plusIcons.first().click(); // Quantity is now 2
    
    // Add another distinct item
    await addIcons.nth(1).click();
    
    // 4. Navigate to Cart
    await page.click('a[href="/cart"]');
    await expect(page).toHaveURL(/\/cart/);
    
    // Verify cart items exist
    const cartItems = page.locator('.cart-items-title.cart-items-item');
    await expect(cartItems).toHaveCount(2);
    
    // 5. Remove an item
    const removeIcons = page.locator('.cross');
    await removeIcons.first().click();
    await expect(page.locator('.cart-items-title.cart-items-item')).toHaveCount(1);
    
    // 6. Checkout
    await page.click('button:has-text("PROCEED TO CHECKOUT")');
    await expect(page).toHaveURL(/\/order/);
    
    // Fill delivery address
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="street"]', '123 Test St');
    await page.fill('input[name="city"]', 'Test City');
    await page.fill('input[name="state"]', 'TS');
    await page.fill('input[name="zipcode"]', '123456');
    await page.fill('input[name="country"]', 'Test Country');
    await page.fill('input[name="phone"]', '1234567890');
    
    // Place Order
    // Listen for the request to place order
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/api/order/place')),
      page.click('button:has-text("PROCEED TO PAYMENT")')
    ]);
    
    // We don't complete real Stripe payment in UI tests to avoid interacting with Stripe external UI,
    // but we can verify that Stripe redirect URL is returned.
    const response = await request.response();
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.session_url).toContain('stripe.com');
  });
});

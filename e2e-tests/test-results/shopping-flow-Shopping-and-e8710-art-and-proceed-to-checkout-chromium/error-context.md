# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shopping-flow.spec.js >> Shopping and Checkout Flow >> should browse, add items to cart, and proceed to checkout
- Location: tests\shopping-flow.spec.js:20:3

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
  3  | test.describe('Shopping and Checkout Flow', () => {
  4  |   let userEmail = `shopper${Date.now()}@test.com`;
  5  |   let userPassword = 'password123';
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Register and login a fresh user for shopping
> 9  |     await page.goto('/');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  10 |     await page.click('button:has-text("sign in")');
  11 |     await page.click('text=Click here');
  12 |     await page.fill('input[name="name"]', 'Shopper');
  13 |     await page.fill('input[name="email"]', userEmail);
  14 |     await page.fill('input[name="password"]', userPassword);
  15 |     await page.check('input[type="checkbox"]');
  16 |     await page.click('button:has-text("Create account")');
  17 |     await expect(page.locator('.navbar-profile')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('should browse, add items to cart, and proceed to checkout', async ({ page }) => {
  21 |     // 1. Browse Food Categories
  22 |     await page.goto('/');
  23 |     
  24 |     // Wait for food display to load
  25 |     await expect(page.locator('.food-display-list')).toBeVisible();
  26 |     
  27 |     // Click on 'Pure Veg' category to filter
  28 |     await page.click('p:has-text("Pure Veg")');
  29 |     
  30 |     // 2. Add multiple items to cart
  31 |     const addIcons = page.locator('.add');
  32 |     await addIcons.first().waitFor();
  33 |     
  34 |     // Add first item
  35 |     await addIcons.nth(0).click();
  36 |     
  37 |     // 3. Update quantity (increase)
  38 |     const plusIcons = page.locator('img[alt="plus"]');
  39 |     await expect(plusIcons.first()).toBeVisible();
  40 |     await plusIcons.first().click(); // Quantity is now 2
  41 |     
  42 |     // Add another distinct item
  43 |     await addIcons.nth(1).click();
  44 |     
  45 |     // 4. Navigate to Cart
  46 |     await page.click('a[href="/cart"]');
  47 |     await expect(page).toHaveURL(/\/cart/);
  48 |     
  49 |     // Verify cart items exist
  50 |     const cartItems = page.locator('.cart-items-title.cart-items-item');
  51 |     await expect(cartItems).toHaveCount(2);
  52 |     
  53 |     // 5. Remove an item
  54 |     const removeIcons = page.locator('.cross');
  55 |     await removeIcons.first().click();
  56 |     await expect(page.locator('.cart-items-title.cart-items-item')).toHaveCount(1);
  57 |     
  58 |     // 6. Checkout
  59 |     await page.click('button:has-text("PROCEED TO CHECKOUT")');
  60 |     await expect(page).toHaveURL(/\/order/);
  61 |     
  62 |     // Fill delivery address
  63 |     await page.fill('input[name="firstName"]', 'Test');
  64 |     await page.fill('input[name="lastName"]', 'User');
  65 |     await page.fill('input[name="email"]', userEmail);
  66 |     await page.fill('input[name="street"]', '123 Test St');
  67 |     await page.fill('input[name="city"]', 'Test City');
  68 |     await page.fill('input[name="state"]', 'TS');
  69 |     await page.fill('input[name="zipcode"]', '123456');
  70 |     await page.fill('input[name="country"]', 'Test Country');
  71 |     await page.fill('input[name="phone"]', '1234567890');
  72 |     
  73 |     // Place Order
  74 |     // Listen for the request to place order
  75 |     const [request] = await Promise.all([
  76 |       page.waitForRequest(req => req.url().includes('/api/order/place')),
  77 |       page.click('button:has-text("PROCEED TO PAYMENT")')
  78 |     ]);
  79 |     
  80 |     // We don't complete real Stripe payment in UI tests to avoid interacting with Stripe external UI,
  81 |     // but we can verify that Stripe redirect URL is returned.
  82 |     const response = await request.response();
  83 |     const responseBody = await response.json();
  84 |     expect(responseBody.success).toBe(true);
  85 |     expect(responseBody.session_url).toContain('stripe.com');
  86 |   });
  87 | });
  88 | 
```
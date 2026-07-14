# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.js >> Admin Panel Operations >> should login, view orders, and add a product
- Location: tests\admin.spec.js:7:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4173/
Call log:
  - navigating to "http://localhost:4173/", waiting until "load"

```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Admin Panel Operations', () => {
  4  |   // Use a custom base URL for the admin panel
  5  |   test.use({ baseURL: 'http://localhost:4173' });
  6  | 
  7  |   test('should login, view orders, and add a product', async ({ page }) => {
  8  |     // Navigate to Admin
> 9  |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4173/
  10 |     
  11 |     // Admin login is typically not implemented with real auth in these tutorials,
  12 |     // but if there's a dashboard, we verify it loads.
  13 |     await expect(page.locator('.sidebar')).toBeVisible();
  14 |     
  15 |     // 1. Add Product
  16 |     await page.click('a:has-text("Add Items")');
  17 |     await expect(page).toHaveURL(/\/add/);
  18 |     
  19 |     // Fill Add Product Form
  20 |     await page.fill('input[name="name"]', 'Test E2E Product');
  21 |     await page.fill('textarea[name="description"]', 'This is an automated test product');
  22 |     await page.fill('input[name="price"]', '199');
  23 |     await page.selectOption('select[name="category"]', 'Pure Veg');
  24 |     
  25 |     // File upload (mock image)
  26 |     const buffer = Buffer.from('fake image data');
  27 |     await page.setInputFiles('input[type="file"]', {
  28 |       name: 'test.jpg',
  29 |       mimeType: 'image/jpeg',
  30 |       buffer
  31 |     });
  32 |     
  33 |     // Submit
  34 |     await page.click('button:has-text("ADD")');
  35 |     // Note: In real runs, verify a toast notification "Food Added Successfully"
  36 |     
  37 |     // 2. View Orders
  38 |     await page.click('a:has-text("Orders")');
  39 |     await expect(page).toHaveURL(/\/orders/);
  40 |     
  41 |     // Verify an order exists and update status
  42 |     const selectStatus = page.locator('select.order-item-select').first();
  43 |     await selectStatus.waitFor();
  44 |     await selectStatus.selectOption('Out for delivery');
  45 |   });
  46 | });
  47 | 
```
const { test, expect } = require('@playwright/test');

test.describe('Admin Panel Operations', () => {
  // Use a custom base URL for the admin panel
  test.use({ baseURL: 'http://localhost:4173' });

  test('should login, view orders, and add a product', async ({ page }) => {
    // Navigate to Admin
    await page.goto('/');
    
    // Admin login is typically not implemented with real auth in these tutorials,
    // but if there's a dashboard, we verify it loads.
    await expect(page.locator('.sidebar')).toBeVisible();
    
    // 1. Add Product
    await page.click('a:has-text("Add Items")');
    await expect(page).toHaveURL(/\/add/);
    
    // Fill Add Product Form
    await page.fill('input[name="name"]', 'Test E2E Product');
    await page.fill('textarea[name="description"]', 'This is an automated test product');
    await page.fill('input[name="price"]', '199');
    await page.selectOption('select[name="category"]', 'Pure Veg');
    
    // File upload (mock image)
    const buffer = Buffer.from('fake image data');
    await page.setInputFiles('input[type="file"]', {
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer
    });
    
    // Submit
    await page.click('button:has-text("ADD")');
    // Note: In real runs, verify a toast notification "Food Added Successfully"
    
    // 2. View Orders
    await page.click('a:has-text("Orders")');
    await expect(page).toHaveURL(/\/orders/);
    
    // Verify an order exists and update status
    const selectStatus = page.locator('select.order-item-select').first();
    await selectStatus.waitFor();
    await selectStatus.selectOption('Out for delivery');
  });
});

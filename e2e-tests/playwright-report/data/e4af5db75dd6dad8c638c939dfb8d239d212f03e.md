# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.js >> Admin Panel Operations >> should login, view orders, and add a product
- Location: tests\admin.spec.js:7:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select.order-item-select').first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - region "Notifications Alt+T"
  - separator [ref=e5]
  - generic [ref=e6]:
    - generic [ref=e8]:
      - link "Add Items" [ref=e9] [cursor=pointer]:
        - /url: /add
        - paragraph [ref=e10]: Add Items
      - link "List Items" [ref=e11] [cursor=pointer]:
        - /url: /list
        - paragraph [ref=e12]: List Items
      - link "Orders" [active] [ref=e13] [cursor=pointer]:
        - /url: /orders
        - paragraph [ref=e14]: Orders
    - generic [ref=e15]:
      - heading "Order Page" [level=3] [ref=e16]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - paragraph [ref=e19]:
            - generic [ref=e20]: Creamy Alfredo Pasta x 3,
            - generic [ref=e21]: Pesto Penne Pasta x 2
          - paragraph [ref=e22]: kalpesh patil
          - generic [ref=e23]:
            - paragraph [ref=e24]: street,
            - paragraph [ref=e25]: parola,maharashtra,india, 425113
          - paragraph [ref=e26]: "7276213580"
          - paragraph [ref=e27]: "Item: 2"
          - paragraph [ref=e28]: ₹1082
          - combobox [ref=e29]:
            - option "Food Processing"
            - option "Out for delivery"
            - option "Delivered" [selected]
        - generic [ref=e30]:
          - paragraph [ref=e31]:
            - generic [ref=e32]: Paneer Butter Masala x 2
          - paragraph [ref=e33]: darshan patil
          - generic [ref=e34]:
            - paragraph [ref=e35]: shevage bk taluka parola,
            - paragraph [ref=e36]: Parola,Maharashtra,India, 425111
          - paragraph [ref=e37]: "07020891044"
          - paragraph [ref=e38]: "Item: 1"
          - paragraph [ref=e39]: ₹462
          - combobox [ref=e40]:
            - option "Food Processing"
            - option "Out for delivery" [selected]
            - option "Delivered"
        - generic [ref=e41]:
          - paragraph [ref=e42]:
            - generic [ref=e43]: Avocado Garden Salad x 2
          - paragraph [ref=e44]: kalpesh patil
          - generic [ref=e45]:
            - paragraph [ref=e46]: street,
            - paragraph [ref=e47]: parola,maharashtra,India, 425113
          - paragraph [ref=e48]: "07276213580"
          - paragraph [ref=e49]: "Item: 1"
          - paragraph [ref=e50]: ₹262
          - combobox [ref=e51]:
            - option "Food Processing" [selected]
            - option "Out for delivery"
            - option "Delivered"
        - generic [ref=e52]:
          - paragraph [ref=e53]:
            - generic [ref=e54]: Avocado Garden Salad x 2
          - paragraph [ref=e55]: kalpesh patil
          - generic [ref=e56]:
            - paragraph [ref=e57]: street,
            - paragraph [ref=e58]: parola,maharashtra,India, 425113
          - paragraph [ref=e59]: "07276213580"
          - paragraph [ref=e60]: "Item: 1"
          - paragraph [ref=e61]: ₹262
          - combobox [ref=e62]:
            - option "Food Processing" [selected]
            - option "Out for delivery"
            - option "Delivered"
        - generic [ref=e63]:
          - paragraph [ref=e64]:
            - generic [ref=e65]: Mixed Veg Curry x 3
          - paragraph [ref=e66]: kunal patil
          - generic [ref=e67]:
            - paragraph [ref=e68]: street,
            - paragraph [ref=e69]: mumbai,maharastra,India, 425113
          - paragraph [ref=e70]: "7020891044"
          - paragraph [ref=e71]: "Item: 1"
          - paragraph [ref=e72]: ₹632
          - combobox [ref=e73]:
            - option "Food Processing" [selected]
            - option "Out for delivery"
            - option "Delivered"
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
  9  |     await page.goto('/');
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
> 43 |     await selectStatus.waitFor();
     |                        ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  44 |     await selectStatus.selectOption('Out for delivery');
  45 |   });
  46 | });
  47 | 
```
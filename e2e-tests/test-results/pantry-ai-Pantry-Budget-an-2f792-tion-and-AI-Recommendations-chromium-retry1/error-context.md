# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pantry-ai.spec.js >> Pantry, Budget, and AI Features >> should verify Budget Planner creation and AI Recommendations
- Location: tests\pantry-ai.spec.js:19:3

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
  3  | test.describe('Pantry, Budget, and AI Features', () => {
  4  |   let userEmail = `smartuser${Date.now()}@test.com`;
  5  |   
  6  |   test.beforeEach(async ({ page }) => {
  7  |     // Register and login
> 8  |     await page.goto('/');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  9  |     await page.click('button:has-text("sign in")');
  10 |     await page.click('text=Click here');
  11 |     await page.fill('input[name="name"]', 'SmartUser');
  12 |     await page.fill('input[name="email"]', userEmail);
  13 |     await page.fill('input[name="password"]', 'password123');
  14 |     await page.check('input[type="checkbox"]');
  15 |     await page.click('button:has-text("Create account")');
  16 |     await expect(page.locator('.navbar-profile')).toBeVisible();
  17 |   });
  18 | 
  19 |   test('should verify Budget Planner creation and AI Recommendations', async ({ page }) => {
  20 |     // 1. Create Budget Planner
  21 |     await page.goto('/');
  22 |     
  23 |     // Locate the Budget Planner section (assuming it is on the home page or via a link)
  24 |     // Looking at the codebase, Budget Planner appears on Home Page or has a specific form
  25 |     const budgetInput = page.locator('input[placeholder="₹ Monthly Budget"]');
  26 |     await expect(budgetInput).toBeVisible();
  27 |     await budgetInput.fill('5000');
  28 |     
  29 |     const familyInput = page.locator('input[placeholder="Family Size"]');
  30 |     await familyInput.fill('4');
  31 |     
  32 |     await page.click('button:has-text("Save Budget")');
  33 |     
  34 |     // Verify Dashboard shows up
  35 |     await expect(page.locator('h3:has-text("Budget Analytics")')).toBeVisible();
  36 |     
  37 |     // 2. Verify AI Recommendations
  38 |     // AI Recommendations section should appear below ExploreMenu
  39 |     const aiTitle = page.locator('h2:has-text("AI Recommendations")');
  40 |     await expect(aiTitle).toBeVisible();
  41 |     
  42 |     // The recommendations should display items
  43 |     const aiItems = page.locator('.ai-grid .food-item');
  44 |     // Ensure at least one AI recommendation is loaded
  45 |     await expect(aiItems.first()).toBeVisible();
  46 |     
  47 |     // Add an AI recommended item to cart
  48 |     await aiItems.first().locator('.add').click();
  49 |     
  50 |     // Verify Cart updates
  51 |     await page.goto('/cart');
  52 |     await expect(page.locator('.cart-items-title.cart-items-item')).toHaveCount(1);
  53 |   });
  54 | 
  55 |   test('should navigate to Smart Pantry and verify empty state', async ({ page }) => {
  56 |     // 1. Navigate to Smart Pantry
  57 |     await page.goto('/');
  58 |     
  59 |     // Click profile dropdown
  60 |     await page.hover('.navbar-profile');
  61 |     
  62 |     // Click "My Pantry"
  63 |     await page.click('li:has-text("My Pantry")');
  64 |     
  65 |     // Verify URL
  66 |     await expect(page).toHaveURL(/\/pantry/);
  67 |     
  68 |     // Verify Empty State since no orders placed yet
  69 |     await expect(page.locator('h3:has-text("Your pantry is empty")')).toBeVisible();
  70 |   });
  71 | });
  72 | 
```
const { test, expect } = require('@playwright/test');

test.describe('Pantry, Budget, and AI Features', () => {
  let userEmail = `smartuser${Date.now()}@test.com`;
  
  test.beforeEach(async ({ page }) => {
    // Register and login
    await page.goto('/');
    await page.click('button:has-text("sign in")');
    await page.click('text=Click here');
    await page.fill('input[name="name"]', 'SmartUser');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Create account")');
    await expect(page.locator('.navbar-profile')).toBeVisible();
  });

  test('should verify Budget Planner creation and AI Recommendations', async ({ page }) => {
    // 1. Create Budget Planner
    await page.goto('/');
    
    // Locate the Budget Planner section (assuming it is on the home page or via a link)
    // Looking at the codebase, Budget Planner appears on Home Page or has a specific form
    const budgetInput = page.locator('input[placeholder="₹ Monthly Budget"]');
    await expect(budgetInput).toBeVisible();
    await budgetInput.fill('5000');
    
    const familyInput = page.locator('input[placeholder="Family Size"]');
    await familyInput.fill('4');
    
    await page.click('button:has-text("Save Budget")');
    
    // Verify Dashboard shows up
    await expect(page.locator('h3:has-text("Budget Analytics")')).toBeVisible();
    
    // 2. Verify AI Recommendations
    // AI Recommendations section should appear below ExploreMenu
    const aiTitle = page.locator('h2:has-text("AI Recommendations")');
    await expect(aiTitle).toBeVisible();
    
    // The recommendations should display items
    const aiItems = page.locator('.ai-grid .food-item');
    // Ensure at least one AI recommendation is loaded
    await expect(aiItems.first()).toBeVisible();
    
    // Add an AI recommended item to cart
    await aiItems.first().locator('.add').click();
    
    // Verify Cart updates
    await page.goto('/cart');
    await expect(page.locator('.cart-items-title.cart-items-item')).toHaveCount(1);
  });

  test('should navigate to Smart Pantry and verify empty state', async ({ page }) => {
    // 1. Navigate to Smart Pantry
    await page.goto('/');
    
    // Click profile dropdown
    await page.hover('.navbar-profile');
    
    // Click "My Pantry"
    await page.click('li:has-text("My Pantry")');
    
    // Verify URL
    await expect(page).toHaveURL(/\/pantry/);
    
    // Verify Empty State since no orders placed yet
    await expect(page.locator('h3:has-text("Your pantry is empty")')).toBeVisible();
  });
});

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pantry-ai.spec.js >> Pantry, Budget, and AI Features >> should verify Budget Planner creation and AI Recommendations
- Location: tests\pantry-ai.spec.js:19:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[placeholder="₹ Monthly Budget"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[placeholder="₹ Monthly Budget"]')

```

```yaml
- link "Groceries":
  - /url: /
  - img "Groceries"
- list:
  - link "home":
    - /url: /
  - link "menu":
    - /url: "#explore-menu"
  - link "mobile-app":
    - /url: "#app-download"
  - link "contact us":
    - /url: "#footer"
- link:
  - /url: /cart
- heading "Fresh Groceries Delivered to Your Door Fresh Groceries Delivered to Your Door" [level=2]
- paragraph: Shop fresh produce, pantry essentials, and everyday staples with fast delivery and curated quality, all from a single convenient app. Shop fresh produce, pantry staples, and everyday essentials with fast delivery and curated quality.
- button "View Menu"
- heading "Explore our menu" [level=1]
- paragraph: Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quaerat, error facere officia harum molestiae ea dolores, nisi sint voluptatibus cumque quas incidunt saepe praesentium alias doloribus quia, aspernatur nobis.
- paragraph: Salad
- paragraph: Rolls
- paragraph: Deserts
- paragraph: Sandwich
- paragraph: Cake
- paragraph: Pure Veg
- paragraph: Pasta
- paragraph: Noodles
- separator
- heading "✨ AI Smart Recommendations" [level=2]
- paragraph: Personalized picks just for you
- text: AI Recommended
- img "Veg Hakka Noodles"
- img "add"
- heading "Veg Hakka Noodles" [level=3]
- text: ₹160
- paragraph: Noodles
- text: Popular among similar users AI Recommended
- img "Spicy Arrabiata Pasta"
- img "add"
- heading "Spicy Arrabiata Pasta" [level=3]
- text: ₹205
- paragraph: Pasta
- text: Popular among similar users AI Recommended
- img "Shrimp Chow Mein"
- img "add"
- heading "Shrimp Chow Mein" [level=3]
- text: ₹215
- paragraph: Noodles
- text: Popular among similar users AI Recommended
- img "Veg Sandwich"
- img "add"
- heading "Veg Sandwich" [level=3]
- text: ₹140
- paragraph: Sandwich
- text: Popular among similar users AI Recommended
- img "Mixed Asian Noodles"
- img "add"
- heading "Mixed Asian Noodles" [level=3]
- text: ₹190
- paragraph: Noodles
- text: Popular among similar users AI Recommended
- img "Test E2E Product"
- img "add"
- heading "Test E2E Product" [level=3]
- text: ₹199
- paragraph: Pure Veg
- text: Popular among similar users
- heading "Top dishes near you Top Grocery Picks Near You" [level=2]
- paragraph: Avocado Garden Salad
- paragraph: Creamy avocado, crisp lettuce, and garden vegetables.
- paragraph: ₹130
- paragraph: Classic Caesar Salad
- paragraph: Romaine lettuce, parmesan, and crunchy croutons in Caesar dressing.
- paragraph: ₹140
- paragraph: Chicken Kathi Roll
- paragraph: Spiced chicken wrapped in soft paratha with chutney.
- paragraph: ₹160
- paragraph: Veggie Spring Roll
- paragraph: Crispy rolls filled with fresh vegetables and sauce.
- paragraph: ₹110
- paragraph: Paneer Tikka Roll
- paragraph: Smoky paneer tikka wrapped with onions and peppers.
- paragraph: ₹155
- paragraph: Spicy Egg Roll
- paragraph: Egg masala rolled in a soft flatbread with fiery spices.
- paragraph: ₹145
- paragraph: Chocolate Lava Cake
- paragraph: Warm chocolate cake with a gooey molten center.
- paragraph: ₹180
- paragraph: Strawberry Cheesecake
- paragraph: Creamy cheesecake topped with fresh strawberries.
- paragraph: ₹190
- paragraph: Red Velvet Cake
- paragraph: Rich and moist red velvet cake with cream cheese frosting.
- paragraph: ₹200
- paragraph: Vanilla Sponge Cake
- paragraph: Light and fluffy vanilla cake finished with icing.
- paragraph: ₹170
- paragraph: Creamy Alfredo Pasta
- paragraph: Fettuccine tossed in a rich creamy Alfredo sauce.
- paragraph: ₹220
- paragraph: Pesto Penne Pasta
- paragraph: Penne pasta coated in fresh basil pesto and parmesan.
- paragraph: ₹210
- paragraph: Spicy Arrabiata Pasta
- paragraph: Tomato pasta with garlic and spicy chili flakes.
- paragraph: ₹205
- paragraph: Mac and Cheese
- paragraph: Creamy macaroni baked with a golden cheese crust.
- paragraph: ₹195
- paragraph: Chicken Noodles
- paragraph: Stir-fried noodles with tender chicken and vegetables.
- paragraph: ₹180
- paragraph: Veg Hakka Noodles
- paragraph: Asian-style noodles with crisp vegetables and soy glaze.
- paragraph: ₹160
- paragraph: Shrimp Chow Mein
- paragraph: Savory chow mein tossed with shrimp and vegetables.
- paragraph: ₹215
- paragraph: Mixed Asian Noodles
- paragraph: A colorful mix of noodles with vegetables and sesame.
- paragraph: ₹190
- paragraph: Veg Sandwich
- paragraph: Fresh vegetables layered between toasted bread slices.
- paragraph: ₹140
- paragraph: Grilled Chicken Sandwich
- paragraph: Grilled chicken with lettuce and sauce on bread.
- paragraph: ₹165
- paragraph: Club Sandwich
- paragraph: Classic club sandwich with layered fillings and fries.
- paragraph: ₹175
- paragraph: Paneer Sandwich
- paragraph: Spiced paneer with fresh veggies in toasted bread.
- paragraph: ₹150
- paragraph: Veg Dessert Platter
- paragraph: A selection of sweet treats with fresh fruit.
- paragraph: ₹130
- paragraph: Gulab Jamun
- paragraph: Soft syrup-soaked dumplings with cardamom flavor.
- paragraph: ₹110
- paragraph: Chocolate Brownie
- paragraph: Rich chocolate brownie with a fudgy center.
- paragraph: ₹125
- paragraph: Fruit Custard
- paragraph: Creamy custard loaded with fresh seasonal fruits.
- paragraph: ₹135
- paragraph: Pure Veg Thali
- paragraph: A wholesome vegetarian thali with multiple dishes.
- paragraph: ₹240
- paragraph: Veg Kebab Plate
- paragraph: Grilled vegetarian kebabs served with chutney.
- paragraph: ₹220
- paragraph: Mixed Veg Curry
- paragraph: Seasonal vegetables cooked in a rich gravy.
- paragraph: ₹210
- paragraph: Paneer Butter Masala
- paragraph: Creamy paneer cooked in buttery tomato sauce.
- paragraph: ₹230
- paragraph: Test E2E Product
- paragraph: This is an automated test product
- paragraph: ₹199
- heading "🛒 Setup Monthly Budget" [level=2]
- spinbutton
- combobox:
  - option "1 Member" [selected]
  - option "2 Members"
  - option "3 Members"
  - option "4 Members"
  - option "5 Members"
  - option "6 Members"
  - option "7 Members"
  - option "8 Members"
  - option "9 Members"
  - option "10 Members"
  - option "11 Members"
  - option "12 Members"
  - option "13 Members"
  - option "14 Members"
  - option "15 Members"
  - option "16 Members"
  - option "17 Members"
  - option "18 Members"
  - option "19 Members"
  - option "20 Members"
- button "Save Budget"
- paragraph: For the best grocery experience, download the Groceries App
- paragraph: Groceries delivers fresh produce, pantry essentials, and everyday staples with fast delivery and local value for every home. Groceries delivers fresh produce, pantry essentials, and everyday groceries with fast delivery and local value.
- heading "COMPANY" [level=2]
- list:
  - listitem: Home
  - listitem: About
  - listitem: Delivery
  - listitem: Privacy policy
- heading "GET IN TOUCH" [level=2]
- list:
  - listitem: +91-702-089-1044
  - listitem: contact@groceries.com contact@groceries.com
- separator
- paragraph: Copyright 2026 @ Groceries - All Rights Reserved. Copyright 2026 @ Groceries - All Rights Reserved.
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
  8  |     await page.goto('/');
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
> 26 |     await expect(budgetInput).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
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
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flow >> should register a new user and login successfully
- Location: tests\auth.spec.js:10:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.navbar-profile')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.navbar-profile')

```

```yaml
- heading "Login" [level=2]
- textbox "Your email": test1783333072996@example.com
- textbox "Password": password123
- button "Login"
- checkbox
- paragraph: By continuing i agree to the term of use & privacy policy.
- paragraph: Create a new account? Click here
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
- button "sign in"
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
  3  | test.describe('Authentication Flow', () => {
  4  |   const testUser = {
  5  |     name: `TestUser_${Date.now()}`,
  6  |     email: `test${Date.now()}@example.com`,
  7  |     password: 'password123'
  8  |   };
  9  | 
  10 |   test('should register a new user and login successfully', async ({ page }) => {
  11 |     // 1. Register a new user
  12 |     await page.goto('/');
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
  46 |     await page.click('button:has-text("Login")');
  47 | 
  48 |     // Verify login success
> 49 |     await expect(page.locator('.navbar-profile')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  50 |   });
  51 | });
  52 | 
```
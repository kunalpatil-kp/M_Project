# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.js >> 05_login_user
- Location: tests\production.spec.js:80:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: null
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications Alt+T"
  - generic [ref=e4]:
    - heading "Login" [level=2] [ref=e6]
    - generic [ref=e7]:
      - textbox "Your email" [ref=e8]: pwuser_1783925842074@test.com
      - textbox "Password" [ref=e9]: password123
    - button "Login" [ref=e10] [cursor=pointer]
    - generic [ref=e11]:
      - checkbox [active] [ref=e12]
      - paragraph [ref=e13]: By continuing i agree to the term of use & privacy policy.
    - paragraph [ref=e14]: Create a new account? Click here
  - generic [ref=e15]:
    - generic [ref=e16]:
      - link "Groceries" [ref=e17] [cursor=pointer]:
        - /url: /
        - img "Groceries" [ref=e18]
      - list [ref=e19]:
        - link "home" [ref=e20] [cursor=pointer]:
          - /url: /
        - link "menu" [ref=e21] [cursor=pointer]:
          - /url: "#explore-menu"
        - link "mobile-app" [ref=e22] [cursor=pointer]:
          - /url: "#app-download"
        - link "contact us" [ref=e23] [cursor=pointer]:
          - /url: "#footer"
      - generic [ref=e24]:
        - link [ref=e26] [cursor=pointer]:
          - /url: /cart
        - button "Toggle Theme" [ref=e27] [cursor=pointer]: 🌙
        - button "sign in" [ref=e28] [cursor=pointer]
    - generic [ref=e29]:
      - generic [ref=e31]:
        - heading "Fresh Groceries Delivered to Your Door Fresh Groceries Delivered to Your Door" [level=2] [ref=e32]
        - paragraph [ref=e33]: Shop fresh fruits, vegetables, dairy products, grains, snacks, beverages, and everyday essentials from one trusted grocery destination. Enjoy premium quality products, affordable prices, secure payments, and lightning-fast doorstep delivery. Shop fresh fruits, vegetables, dairy products, grains, snacks, beverages, and everyday essentials from one trusted grocery destination. Enjoy premium quality products, affordable prices, secure payments, and lightning-fast doorstep delivery.
        - button "View Menu" [ref=e34] [cursor=pointer]
      - generic [ref=e35]:
        - heading "Explore our menu" [level=1] [ref=e36]
        - paragraph [ref=e37]: Discover a wide variety of fresh fruits, vegetables, dairy products, bakery items, beverages, snacks, and daily essentials. Carefully selected for quality and freshness, our products make grocery shopping simple, convenient, and delivered right to your doorstep.
        - generic [ref=e38]:
          - paragraph [ref=e40] [cursor=pointer]: Salad
          - paragraph [ref=e42] [cursor=pointer]: Rolls
          - paragraph [ref=e44] [cursor=pointer]: Deserts
          - paragraph [ref=e46] [cursor=pointer]: Sandwich
          - paragraph [ref=e48] [cursor=pointer]: Cake
          - paragraph [ref=e50] [cursor=pointer]: Pure Veg
          - paragraph [ref=e52] [cursor=pointer]: Pasta
          - paragraph [ref=e54] [cursor=pointer]: Noodles
        - separator [ref=e55]
      - heading "Top dishes near you Top Grocery Picks Near You" [level=2] [ref=e57]
      - paragraph [ref=e59]:
        - text: For the best grocery experience, download the
        - text: Groceries App
  - generic [ref=e61]:
    - generic [ref=e62]:
      - paragraph [ref=e64]: Groceries delivers fresh produce, pantry essentials, and everyday staples with fast delivery and local value for every home. Groceries delivers fresh produce, pantry essentials, and everyday groceries with fast delivery and local value.
      - generic [ref=e66]:
        - heading "COMPANY" [level=2] [ref=e67]
        - list [ref=e68]:
          - listitem [ref=e69] [cursor=pointer]: Home
          - listitem [ref=e70] [cursor=pointer]: About
          - listitem [ref=e71] [cursor=pointer]: Delivery
          - listitem [ref=e72] [cursor=pointer]: Privacy policy
      - generic [ref=e73]:
        - heading "GET IN TOUCH" [level=2] [ref=e74]
        - list [ref=e75]:
          - listitem [ref=e76] [cursor=pointer]: +91-702-089-1044
          - listitem [ref=e77] [cursor=pointer]: contact@groceries.com contact@groceries.com
          - listitem [ref=e78] [cursor=pointer]:
            - link "kunalkp2580@gmail.com" [ref=e79]:
              - /url: mailto:kunalkp2580@gmail.com
              - img [ref=e80]
              - text: kunalkp2580@gmail.com
    - separator [ref=e83]
    - paragraph [ref=e84]: Copyright 2026 @ Groceries - All Rights Reserved. Copyright 2026 @ Groceries - All Rights Reserved.
```

# Test source

```ts
  1   | ﻿const { test, expect } = require("@playwright/test");
  2   | 
  3   | // ─── CONFIG ─────────────────────────────────────────────────────
  4   | const FRONTEND = "https://food-delivery-frontend-9pel.onrender.com";
  5   | const ADMIN    = "https://food-delivery-admin-gssu.onrender.com";
  6   | const BACKEND  = "https://food-delivery-fquq.onrender.com";
  7   | const ADMIN_EMAIL    = "admin@food.com";
  8   | const ADMIN_PASSWORD = "admin123";
  9   | const TS = Date.now();
  10  | const TEST_EMAIL    = `pwuser_${TS}@test.com`;
  11  | const TEST_PASSWORD = "password123";
  12  | const TEST_NAME     = "Playwright User";
  13  | 
  14  | // ─── HELPERS ────────────────────────────────────────────────────
  15  | async function apiCall(path, method = "GET", body = null, token = null) {
  16  |   const headers = { "Content-Type": "application/json" };
  17  |   if (token) headers["token"] = token;
  18  |   const opts = { method, headers };
  19  |   if (body) opts.body = JSON.stringify(body);
  20  |   const r = await fetch(`${BACKEND}${path}`, opts);
  21  |   return r.json().catch(() => ({}));
  22  | }
  23  | 
  24  | // ─── SECTION 1: BACKEND WAKEUP ──────────────────────────────────
  25  | test("01_backend_is_alive", async ({ page }) => {
  26  |   const r = await fetch(`${BACKEND}/`);
  27  |   expect(r.status).toBe(200);
  28  |   const text = await r.text();
  29  |   expect(text).toContain("API");
  30  | });
  31  | 
  32  | // ─── SECTION 2: CUSTOMER FRONTEND ───────────────────────────────
  33  | test("02_home_page_loads", async ({ page }) => {
  34  |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  35  |   const title = await page.title();
  36  |   console.log("Page title:", title);
  37  |   await expect(page.locator("body")).toBeVisible();
  38  |   // Check no JS crash error overlay
  39  |   const errorText = await page.locator("text=Something went wrong").count();
  40  |   expect(errorText).toBe(0);
  41  | });
  42  | 
  43  | test("03_food_items_visible", async ({ page }) => {
  44  |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  45  |   // Wait for food cards to appear (backend may be waking up)
  46  |   await page.waitForTimeout(3000);
  47  |   const foodCards = page.locator(".food-item, .food-card, [class*=food]").first();
  48  |   await foodCards.waitFor({ timeout: 30000, state: "visible" }).catch(() => {});
  49  |   const count = await page.locator(".food-item, .food-card, [class*=food]").count();
  50  |   console.log("Food items visible:", count);
  51  |   expect(count).toBeGreaterThan(0);
  52  | });
  53  | 
  54  | test("04_register_new_user", async ({ page }) => {
  55  |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  56  |   // Click sign in / login button in navbar
  57  |   const signinBtn = page.locator("button, a").filter({ hasText: /sign.?in|login/i }).first();
  58  |   await signinBtn.click();
  59  |   await page.waitForTimeout(1000);
  60  |   // Switch to Sign Up if form shows Sign In
  61  |   const signupLink = page.locator("p, span, button, a").filter({ hasText: /sign.?up|create|register/i }).first();
  62  |   if (await signupLink.count() > 0) await signupLink.click();
  63  |   await page.waitForTimeout(500);
  64  |   // Fill form
  65  |   const nameInput = page.locator("input[placeholder*=name i], input[name*=name i]").first();
  66  |   const emailInput = page.locator("input[type=email], input[placeholder*=email i]").first();
  67  |   const passInput  = page.locator("input[type=password]").first();
  68  |   await nameInput.fill(TEST_NAME).catch(() => {});
  69  |   await emailInput.fill(TEST_EMAIL);
  70  |   await passInput.fill(TEST_PASSWORD);
  71  |   const submitBtn = page.locator("button[type=submit], button").filter({ hasText: /create|sign.?up|register|continue/i }).first();
  72  |   await submitBtn.click();
  73  |   await page.waitForTimeout(2000);
  74  |   // After register, modal should close or token should appear in localStorage
  75  |   const token = await page.evaluate(() => localStorage.getItem("token"));
  76  |   console.log("Token after register:", token ? "SET" : "NOT SET");
  77  |   expect(token).toBeTruthy();
  78  | });
  79  | 
  80  | test("05_login_user", async ({ page }) => {
  81  |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  82  |   const signinBtn = page.locator("button, a").filter({ hasText: /sign.?in|login/i }).first();
  83  |   await signinBtn.click();
  84  |   await page.waitForTimeout(1000);
  85  |   const emailInput = page.locator("input[type=email], input[placeholder*=email i]").first();
  86  |   const passInput  = page.locator("input[type=password]").first();
  87  |   await emailInput.fill(TEST_EMAIL);
  88  |   await passInput.fill(TEST_PASSWORD);
  89  |   const submitBtn = page.locator("button[type=submit], button").filter({ hasText: /login|sign.?in|continue/i }).first();
  90  |   await submitBtn.click();
  91  |   await page.waitForTimeout(2000);
  92  |   const token = await page.evaluate(() => localStorage.getItem("token"));
> 93  |   expect(token).toBeTruthy();
      |                 ^ Error: expect(received).toBeTruthy()
  94  |   console.log("Login: token obtained");
  95  | });
  96  | 
  97  | test("06_add_to_cart", async ({ page }) => {
  98  |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  99  |   // Set token so we are logged in
  100 |   const data = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  101 |   if (!data.success) { console.log("Login failed, skipping cart test"); return; }
  102 |   await page.evaluate((tok) => localStorage.setItem("token", tok), data.token);
  103 |   await page.reload({ waitUntil: "networkidle" });
  104 |   await page.waitForTimeout(2000);
  105 |   // Click first + button
  106 |   const addBtn = page.locator("button").filter({ hasText: /^\+$/ }).first();
  107 |   const addBtnAlt = page.locator("[class*=add], [class*=plus]").first();
  108 |   if (await addBtn.count() > 0) {
  109 |     await addBtn.click();
  110 |   } else if (await addBtnAlt.count() > 0) {
  111 |     await addBtnAlt.click();
  112 |   } else {
  113 |     console.log("No + button found, skipping");
  114 |     return;
  115 |   }
  116 |   await page.waitForTimeout(1500);
  117 |   // Verify cart count > 0
  118 |   const cartCount = page.locator("[class*=cart-count], .cart-count, [class*=count]").first();
  119 |   console.log("Cart interaction complete");
  120 | });
  121 | 
  122 | test("07_navigate_to_cart", async ({ page }) => {
  123 |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  124 |   const data = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  125 |   if (!data.success) return;
  126 |   await page.evaluate((tok) => localStorage.setItem("token", tok), data.token);
  127 |   await page.reload({ waitUntil: "networkidle" });
  128 |   await page.waitForTimeout(2000);
  129 |   // Navigate to cart
  130 |   await page.goto(`${FRONTEND}/cart`, { waitUntil: "networkidle" });
  131 |   await expect(page.locator("body")).toBeVisible();
  132 |   const title = await page.title();
  133 |   console.log("Cart page title:", title);
  134 | });
  135 | 
  136 | test("08_apply_invalid_coupon", async ({ page }) => {
  137 |   await page.goto(`${FRONTEND}/cart`, { waitUntil: "networkidle" });
  138 |   const data = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  139 |   if (!data.success) return;
  140 |   await page.evaluate((tok) => localStorage.setItem("token", tok), data.token);
  141 |   await page.reload({ waitUntil: "networkidle" });
  142 |   await page.waitForTimeout(2000);
  143 |   const couponInput = page.locator("input[placeholder*=coupon i], input[placeholder*=code i], input[class*=coupon]").first();
  144 |   if (await couponInput.count() > 0) {
  145 |     await couponInput.fill("INVALIDCOUPON999");
  146 |     const applyBtn = page.locator("button").filter({ hasText: /apply|submit/i }).first();
  147 |     if (await applyBtn.count() > 0) await applyBtn.click();
  148 |     await page.waitForTimeout(1500);
  149 |     // Should show invalid message - not crash
  150 |     const pageText = await page.textContent("body");
  151 |     expect(pageText).not.toContain("Cannot read");
  152 |     console.log("Coupon rejection: OK (no crash)");
  153 |   } else {
  154 |     console.log("No coupon input found - skipping");
  155 |   }
  156 | });
  157 | 
  158 | test("09_my_orders_page", async ({ page }) => {
  159 |   const data = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  160 |   if (!data.success) { console.log("Login failed, skipping"); return; }
  161 |   await page.goto(`${FRONTEND}/myorders`, { waitUntil: "networkidle" });
  162 |   await page.evaluate((tok) => localStorage.setItem("token", tok), data.token);
  163 |   await page.reload({ waitUntil: "networkidle" });
  164 |   await page.waitForTimeout(2000);
  165 |   await expect(page.locator("body")).toBeVisible();
  166 |   const body = await page.textContent("body");
  167 |   expect(body).not.toContain("Cannot read");
  168 |   console.log("My Orders page: OK");
  169 | });
  170 | 
  171 | test("10_logout", async ({ page }) => {
  172 |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  173 |   const data = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  174 |   if (!data.success) return;
  175 |   await page.evaluate((tok) => localStorage.setItem("token", tok), data.token);
  176 |   await page.reload({ waitUntil: "networkidle" });
  177 |   await page.waitForTimeout(2000);
  178 |   // Find logout button
  179 |   const logoutBtn = page.locator("li, button, a").filter({ hasText: /logout|sign.?out/i }).first();
  180 |   if (await logoutBtn.count() > 0) {
  181 |     await logoutBtn.click();
  182 |     await page.waitForTimeout(1000);
  183 |     const token = await page.evaluate(() => localStorage.getItem("token"));
  184 |     expect(!token || token === "").toBeTruthy();
  185 |     console.log("Logout: token cleared");
  186 |   } else {
  187 |     console.log("Logout button not found - try navbar");
  188 |   }
  189 | });
  190 | 
  191 | // ─── SECTION 3: ADMIN PANEL ─────────────────────────────────────
  192 | test("11_admin_home_redirects_to_login", async ({ page }) => {
  193 |   await page.goto(ADMIN, { waitUntil: "networkidle" });
```
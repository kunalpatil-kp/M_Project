# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.js >> 01_backend_is_alive
- Location: tests\production.spec.js:25:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
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
> 27  |   expect(r.status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
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
  93  |   expect(token).toBeTruthy();
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
```
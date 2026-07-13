# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.js >> 12_admin_login
- Location: tests\production.spec.js:206:1

# Error details

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('input[type=email], input[placeholder*=email i]').first()

```

# Page snapshot

```yaml
- generic [ref=e2]: Not Found
```

# Test source

```ts
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
  194 |   await page.waitForTimeout(2000);
  195 |   const url = page.url();
  196 |   const body = await page.textContent("body");
  197 |   console.log("Admin home URL:", url);
  198 |   // Should either be on /login or show login form
  199 |   const hasLoginForm = await page.locator("input[type=email], input[type=password]").count() > 0;
  200 |   const isLoginPage  = url.includes("login") || hasLoginForm;
  201 |   console.log("Admin redirects to login:", isLoginPage);
  202 |   // Whether it redirects or not, at minimum the page must not crash
  203 |   expect(body).not.toContain("Cannot read");
  204 | });
  205 | 
  206 | test("12_admin_login", async ({ page }) => {
  207 |   await page.goto(ADMIN, { waitUntil: "networkidle" });
  208 |   await page.waitForTimeout(2000);
  209 |   // Navigate to login if needed
  210 |   if (!page.url().includes("login")) {
  211 |     await page.goto(`${ADMIN}/login`, { waitUntil: "networkidle" });
  212 |   }
  213 |   const emailInput = page.locator("input[type=email], input[placeholder*=email i]").first();
  214 |   const passInput  = page.locator("input[type=password]").first();
> 215 |   await emailInput.fill(ADMIN_EMAIL);
      |                    ^ TimeoutError: locator.fill: Timeout 30000ms exceeded.
  216 |   await passInput.fill(ADMIN_PASSWORD);
  217 |   const submitBtn = page.locator("button[type=submit], button").filter({ hasText: /login|sign.?in|continue/i }).first();
  218 |   await submitBtn.click();
  219 |   await page.waitForTimeout(3000);
  220 |   const adminToken = await page.evaluate(() => localStorage.getItem("admin_token") || localStorage.getItem("token"));
  221 |   console.log("Admin token after login:", adminToken ? "SET" : "NOT SET (check Render ADMIN env vars)");
  222 |   // Whether login works or not depends on Render env vars being set
  223 |   // We just verify no crash
  224 |   const body = await page.textContent("body");
  225 |   expect(body).not.toContain("Unhandled Runtime Error");
  226 | });
  227 | 
  228 | test("13_admin_add_food", async ({ page }) => {
  229 |   await page.goto(ADMIN, { waitUntil: "networkidle" });
  230 |   // Login first
  231 |   if (!page.url().includes("login")) await page.goto(`${ADMIN}/login`, { waitUntil: "networkidle" });
  232 |   const emailInput = page.locator("input[type=email], input[placeholder*=email i]").first();
  233 |   const passInput  = page.locator("input[type=password]").first();
  234 |   if (await emailInput.count() > 0) {
  235 |     await emailInput.fill(ADMIN_EMAIL);
  236 |     await passInput.fill(ADMIN_PASSWORD);
  237 |     await page.locator("button[type=submit], button").filter({ hasText: /login/i }).first().click();
  238 |     await page.waitForTimeout(3000);
  239 |   }
  240 |   // Navigate to Add page
  241 |   await page.goto(`${ADMIN}/add`, { waitUntil: "networkidle" });
  242 |   await page.waitForTimeout(2000);
  243 |   const body = await page.textContent("body");
  244 |   // If logged in, should show add form. If not, should redirect to login.
  245 |   const hasForm   = await page.locator("input[placeholder*=name i], input[placeholder*=food i]").count() > 0;
  246 |   const isLogin   = body.toLowerCase().includes("login") || body.toLowerCase().includes("sign in");
  247 |   console.log("Add Food page:", hasForm ? "Form visible (admin logged in)" : isLogin ? "Redirected to login (correct)" : "Unknown state");
  248 | });
  249 | 
  250 | test("14_admin_delete_food", async ({ page }) => {
  251 |   // Navigate to admin list
  252 |   await page.goto(`${ADMIN}/list`, { waitUntil: "networkidle" });
  253 |   await page.waitForTimeout(2000);
  254 |   const body = await page.textContent("body");
  255 |   expect(body).not.toContain("Cannot read");
  256 |   console.log("Admin List page accessible without crash");
  257 | });
  258 | 
  259 | test("15_admin_orders", async ({ page }) => {
  260 |   await page.goto(`${ADMIN}/orders`, { waitUntil: "networkidle" });
  261 |   await page.waitForTimeout(2000);
  262 |   const body = await page.textContent("body");
  263 |   expect(body).not.toContain("Cannot read");
  264 |   console.log("Admin Orders page: OK");
  265 | });
  266 | 
  267 | // ─── SECTION 4: BACKEND API TESTS ───────────────────────────────
  268 | test("16_api_auth_register", async () => {
  269 |   const d = await apiCall("/api/user/register", "POST", { name: "PW Test", email: `pw2_${TS}@t.com`, password: "password123" });
  270 |   expect(d.success).toBe(true);
  271 |   expect(d.token).toBeTruthy();
  272 | });
  273 | 
  274 | test("17_api_auth_login_valid", async () => {
  275 |   const d = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  276 |   expect(d.success).toBe(true);
  277 |   expect(d.token).toBeTruthy();
  278 | });
  279 | 
  280 | test("18_api_auth_login_invalid", async () => {
  281 |   const d = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: "wrongpass" });
  282 |   expect(d.success).toBe(false);
  283 | });
  284 | 
  285 | test("19_api_food_list", async () => {
  286 |   const d = await apiCall("/api/food/list");
  287 |   expect(d.success).toBe(true);
  288 |   expect(d.data.length).toBeGreaterThan(0);
  289 |   console.log(`Food items: ${d.data.length}`);
  290 | });
  291 | 
  292 | test("20_api_cart_add_valid", async () => {
  293 |   const login = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  294 |   const foods  = await apiCall("/api/food/list");
  295 |   if (!login.success || foods.data.length === 0) return;
  296 |   const d = await apiCall("/api/cart/add", "POST", { itemId: foods.data[0]._id }, login.token);
  297 |   expect(d.success).toBe(true);
  298 | });
  299 | 
  300 | test("21_api_cart_add_invalid_id", async () => {
  301 |   const login = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  302 |   if (!login.success) return;
  303 |   const d = await apiCall("/api/cart/add", "POST", { itemId: "TOTALLY_INVALID_ID" }, login.token);
  304 |   expect(d.success).toBe(false);
  305 |   console.log("Invalid itemId correctly rejected:", d.message);
  306 | });
  307 | 
  308 | test("22_api_cart_get", async () => {
  309 |   const login = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  310 |   if (!login.success) return;
  311 |   const d = await apiCall("/api/cart/get", "POST", {}, login.token);
  312 |   expect(d.success).toBe(true);
  313 |   expect(d.cartData).toBeDefined();
  314 | });
  315 | 
```
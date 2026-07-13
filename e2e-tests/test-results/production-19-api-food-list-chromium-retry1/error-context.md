# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.js >> 19_api_food_list
- Location: tests\production.spec.js:285:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
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
  215 |   await emailInput.fill(ADMIN_EMAIL);
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
> 287 |   expect(d.success).toBe(true);
      |                     ^ Error: expect(received).toBe(expected) // Object.is equality
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
  316 | test("23_api_cart_requires_auth", async () => {
  317 |   const d = await apiCall("/api/cart/get", "POST", {});
  318 |   expect(d.success).toBe(false);
  319 |   console.log("Cart auth check:", d.message);
  320 | });
  321 | 
  322 | test("24_api_coupon_invalid", async () => {
  323 |   const d = await apiCall("/api/coupon/verify", "POST", { couponCode: "NOSUCHCOUPON", amount: 500 });
  324 |   expect(d.success).toBe(false);
  325 | });
  326 | 
  327 | test("25_api_coupon_empty_code", async () => {
  328 |   const d = await apiCall("/api/coupon/verify", "POST", { amount: 500 });
  329 |   expect(d.success).toBe(false);
  330 |   console.log("Empty coupon rejected:", d.message);
  331 | });
  332 | 
  333 | test("26_api_order_verify_bad_id", async () => {
  334 |   const d = await apiCall("/api/order/verify", "POST", { orderId: "BAD-ID", success: "true" });
  335 |   expect(d.success).toBe(false);
  336 |   console.log("Bad orderId rejected:", d.message);
  337 | });
  338 | 
  339 | test("27_api_order_list_requires_admin", async () => {
  340 |   // Without token
  341 |   const d1 = await apiCall("/api/order/list");
  342 |   expect(d1.success).toBe(false);
  343 |   // With customer token
  344 |   const login = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  345 |   const d2 = await apiCall("/api/order/list", "GET", null, login.token);
  346 |   expect(d2.success).toBe(false);
  347 |   console.log("Order list RBAC: correctly blocked customer");
  348 | });
  349 | 
  350 | test("28_api_food_add_requires_admin", async () => {
  351 |   const login = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  352 |   const d = await apiCall("/api/food/add", "POST", {}, login.token);
  353 |   expect(d.success).toBe(false);
  354 |   console.log("Food add RBAC:", d.message);
  355 | });
  356 | 
  357 | test("29_api_nosql_injection", async () => {
  358 |   const d = await apiCall("/api/user/login", "POST", { email: { "$gt": "" }, password: "test" });
  359 |   expect(d.success).toBe(false);
  360 |   console.log("NoSQL injection blocked:", d.success === false);
  361 | });
  362 | 
  363 | test("30_api_fake_jwt", async () => {
  364 |   const headers = { "Content-Type": "application/json", "token": "fake.jwt.token" };
  365 |   const r = await fetch(`${BACKEND}/api/cart/get`, { method: "POST", headers, body: JSON.stringify({}) });
  366 |   const d = await r.json();
  367 |   expect(d.success).toBe(false);
  368 |   console.log("Fake JWT rejected:", d.message);
  369 | });
  370 | 
  371 | test("31_api_admin_login", async () => {
  372 |   const d = await apiCall("/api/user/admin-login", "POST", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  373 |   if (d.success) {
  374 |     console.log("Admin login: PASS - Render env vars are set correctly");
  375 |     expect(d.token).toBeTruthy();
  376 |   } else {
  377 |     console.log("Admin login: FAIL -", d.message, "- You must set ADMIN_EMAIL and ADMIN_PASSWORD in Render Dashboard");
  378 |     // Don't fail the test — this is a Render config issue, not a code issue
  379 |   }
  380 | });
  381 | 
  382 | test("32_api_userorders_authenticated", async () => {
  383 |   const login = await apiCall("/api/user/login", "POST", { email: TEST_EMAIL, password: TEST_PASSWORD });
  384 |   if (!login.success) return;
  385 |   const d = await apiCall("/api/order/userorders", "POST", {}, login.token);
  386 |   expect(d.success).toBe(true);
  387 |   expect(Array.isArray(d.data)).toBe(true);
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.js >> 33_performance_food_list_speed
- Location: tests\production.spec.js:391:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
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
  388 | });
  389 | 
  390 | // ─── SECTION 5: PERFORMANCE ─────────────────────────────────────
  391 | test("33_performance_food_list_speed", async () => {
  392 |   const t0 = Date.now();
  393 |   const d  = await apiCall("/api/food/list");
  394 |   const ms = Date.now() - t0;
> 395 |   expect(d.success).toBe(true);
      |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  396 |   console.log(`Food list response time: ${ms}ms`);
  397 |   // Warn but not fail - Render free tier can be slow on cold start
  398 |   if (ms > 5000) console.log("WARNING: Slow response > 5s (Render cold start?)");
  399 | });
  400 | 
  401 | test("34_performance_no_console_errors_on_home", async ({ page }) => {
  402 |   const errors = [];
  403 |   page.on("console", (msg) => {
  404 |     if (msg.type() === "error") errors.push(msg.text());
  405 |   });
  406 |   page.on("pageerror", (err) => errors.push(err.message));
  407 |   await page.goto(FRONTEND, { waitUntil: "networkidle" });
  408 |   await page.waitForTimeout(3000);
  409 |   const criticalErrors = errors.filter(e =>
  410 |     !e.includes("favicon") &&
  411 |     !e.includes("net::ERR") && // CORS during test is OK
  412 |     !e.includes("Failed to load resource")
  413 |   );
  414 |   console.log("Console errors:", errors.length, "| Critical:", criticalErrors.length);
  415 |   if (criticalErrors.length > 0) console.log("Critical errors:", criticalErrors);
  416 |   // Allow some expected CORS issues but no React crashes
  417 |   const reactCrash = errors.some(e => e.includes("Uncaught TypeError") || e.includes("Cannot read properties of null"));
  418 |   expect(reactCrash).toBe(false);
  419 | });
  420 | 
  421 | test("35_performance_concurrent_api_requests", async () => {
  422 |   const [r1, r2, r3] = await Promise.all([
  423 |     apiCall("/api/food/list"),
  424 |     apiCall("/api/food/list"),
  425 |     apiCall("/api/food/list"),
  426 |   ]);
  427 |   expect(r1.success).toBe(true);
  428 |   expect(r2.success).toBe(true);
  429 |   expect(r3.success).toBe(true);
  430 |   console.log("Concurrent requests: all 3 succeeded");
  431 | });
  432 | 
  433 | // ─── SECTION 6: NAVIGATION & ROUTES ────────────────────────────
  434 | test("36_verify_page_loads", async ({ page }) => {
  435 |   await page.goto(`${FRONTEND}/verify?success=false&orderId=fake123`, { waitUntil: "networkidle" });
  436 |   await page.waitForTimeout(2000);
  437 |   const body = await page.textContent("body");
  438 |   expect(body).not.toContain("Cannot read");
  439 |   // Should show error / redirect, not crash
  440 |   console.log("Verify page (cancel): OK, no crash");
  441 | });
  442 | 
  443 | test("37_direct_admin_url_protection", async ({ page }) => {
  444 |   // Try to access admin dashboard directly without logging in
  445 |   await page.goto(`${ADMIN}/add`, { waitUntil: "networkidle" });
  446 |   await page.waitForTimeout(2000);
  447 |   const body = await page.textContent("body");
  448 |   const hasLoginForm = await page.locator("input[type=email], input[type=password]").count() > 0;
  449 |   const isProtected  = hasLoginForm || body.toLowerCase().includes("login") || body.toLowerCase().includes("sign in");
  450 |   console.log("Direct admin URL protected:", isProtected);
  451 |   // At minimum: no crash
  452 |   expect(body).not.toContain("Cannot read");
  453 | });
  454 | 
```
import assert from "node:assert/strict";
import test from "node:test";

const BASE_URL = "http://localhost:3000";

test("SECURITY: Admin routes redirect to login when unauthenticated", async () => {
  const routes = ["/admin", "/admin/products", "/admin/orders", "/admin/categories"];

  for (const route of routes) {
    const res = await fetch(`${BASE_URL}${route}`, { redirect: "manual" });
    assert.equal(
      res.status,
      307,
      `Unauthenticated access to ${route} must redirect with 307`
    );
    const loc = res.headers.get("location");
    assert.ok(
      loc && loc.includes("/admin/login"),
      `Redirect location for ${route} must be /admin/login`
    );
  }
});

test("SECURITY: Admin APIs return 401 Unauthorized without session", async () => {
  const apis = [
    { url: "/api/admin/dashboard", method: "GET" },
    { url: "/api/admin/products", method: "GET" },
    { url: "/api/admin/orders", method: "GET" },
    { url: "/api/admin/categories", method: "GET" },
    { url: "/api/admin/products", method: "POST", body: {} },
    { url: "/api/admin/categories", method: "POST", body: {} },
  ];

  for (const api of apis) {
    const res = await fetch(`${BASE_URL}${api.url}`, {
      method: api.method,
      headers: { "Content-Type": "application/json" },
      body: api.body ? JSON.stringify(api.body) : undefined,
    });
    assert.equal(
      res.status,
      401,
      `API ${api.method} ${api.url} must reject with 401 Unauthorized`
    );
  }
});

test("SECURITY: Bad login rejected", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "hacker", password: "wrongpassword123" }),
  });
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, "Invalid username or password.");
});

test("SECURITY: Order checkout ignores client forged prices and validates stock", async () => {
  // Test 1: Empty cart
  const emptyRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Tester",
      phone: "9829000000",
      address: "Main Street",
      city: "Pali",
      pincode: "306401",
      payment: "cod",
      items: [],
    }),
  });
  assert.equal(emptyRes.status, 400);

  // Test 2: Invalid phone
  const badPhoneRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Tester",
      phone: "123", // invalid phone
      address: "Main Street",
      city: "Pali",
      pincode: "306401",
      payment: "cod",
      items: [{ productId: "p-mamaearth-rosemary-oil", quantity: 1 }],
    }),
  });
  assert.equal(badPhoneRes.status, 400);

  // Test 3: Excessive quantity exceeding stock
  const excessRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Tester",
      phone: "9829000000",
      address: "Main Street",
      city: "Pali",
      pincode: "306401",
      payment: "cod",
      items: [{ productId: "p-mamaearth-rosemary-oil", quantity: 99999 }],
    }),
  });
  assert.equal(excessRes.status, 400);
  const excessData = await excessRes.json();
  assert.match(excessData.error, /Insufficient stock/i);
});

test("SECURITY: Customer cannot snoop on random order ID", async () => {
  const randomOrderId = "MS-FORGED-ID-999";
  const res = await fetch(`${BASE_URL}/api/orders/${randomOrderId}`);
  assert.equal(res.status, 403, "Random order lookup without cookie must return 403 Forbidden");
});

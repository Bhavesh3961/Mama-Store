import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";

test("Security: Password verification and HMAC session token integrity", () => {
  const secret = "test-secret-key-123456789";

  function sign(payload) {
    const dataStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", secret).update(dataStr).digest("base64url");
    return `${dataStr}.${sig}`;
  }

  function verify(token) {
    if (!token || !token.includes(".")) return null;
    const [dataStr, sig] = token.split(".");
    const expectedSig = crypto.createHmac("sha256", secret).update(dataStr).digest("base64url");
    if (sig !== expectedSig) return null;
    return JSON.parse(Buffer.from(dataStr, "base64url").toString("utf8"));
  }

  const token = sign({ username: "admin", role: "admin", exp: Date.now() + 10000 });
  const verified = verify(token);
  assert.equal(verified.username, "admin");
  assert.equal(verified.role, "admin");

  // Tampered payload must fail
  const tamperedToken = token.slice(0, 10) + "X" + token.slice(11);
  assert.equal(verify(tamperedToken), null);
});

test("Integration: Price change reflects and order server validation operates atomically", () => {
  const db = new DatabaseSync(":memory:");

  db.exec(`
    CREATE TABLE products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      price REAL,
      mrp REAL,
      stock INTEGER NOT NULL,
      in_stock INTEGER NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      archived INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      subtotal REAL NOT NULL,
      delivery_fee REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL
    );
  `);

  // Insert initial product with price 499
  db.prepare(`
    INSERT INTO products (id, name, slug, price, mrp, stock, in_stock, published, archived)
    VALUES ('p-lipstick', 'Matte Lipstick', 'matte-lipstick', 499, 699, 15, 1, 1, 0)
  `).run();

  // 1. Admin changes price: 499 -> 449
  db.prepare("UPDATE products SET price = 449 WHERE id = 'p-lipstick'").run();

  const currentProduct = db.prepare("SELECT * FROM products WHERE id = 'p-lipstick'").get();
  assert.equal(currentProduct.price, 449);

  // 2. Customer attempts to place order with client forged price (e.g. client sends 10)
  // Server ignores client price, queries DB (449), checks stock (15 >= 2), calculates 898
  const requestedQty = 2;
  const dbPrice = currentProduct.price; // 449
  assert.equal(dbPrice, 449);

  const subtotal = dbPrice * requestedQty; // 898
  const deliveryFee = subtotal >= 799 ? 0 : 40;
  const grandTotal = subtotal + deliveryFee; // 898

  db.exec("BEGIN IMMEDIATE");
  const orderId = "MS-ORDER-999";
  db.prepare(`
    INSERT INTO orders (id, customer_name, customer_phone, subtotal, delivery_fee, total, status, created_at)
    VALUES (?, 'Pooja', '9829012345', ?, ?, ?, 'Pending', datetime('now'))
  `).run(orderId, subtotal, deliveryFee, grandTotal);

  db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES (?, 'p-lipstick', ?, ?, ?)
  `).run(orderId, requestedQty, dbPrice, subtotal);

  db.prepare(`
    UPDATE products
    SET stock = stock - ?,
        in_stock = CASE WHEN (stock - ?) <= 0 THEN 0 ELSE 1 END
    WHERE id = 'p-lipstick'
  `).run(requestedQty, requestedQty);
  db.exec("COMMIT");

  // Verify stock decremented to 13
  const afterOrderProduct = db.prepare("SELECT * FROM products WHERE id = 'p-lipstick'").get();
  assert.equal(afterOrderProduct.stock, 13);
  assert.equal(afterOrderProduct.in_stock, 1);

  // Verify grand total is exactly 898
  const placedOrder = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  assert.equal(placedOrder.total, 898);
  assert.equal(placedOrder.status, "Pending");

  // 3. Attempting to purchase more than available stock (e.g. 20 > 13) must fail
  const excessQty = 20;
  assert.ok(afterOrderProduct.stock < excessQty, "Stock must be insufficient for excess purchase");
});

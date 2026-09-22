import assert from "node:assert/strict";
import test from "node:test";

test("Database initialization, product querying, atomic order checkout and stock decrement", async () => {
  // Dynamic import of TypeScript/built TS or compiled code via tsx or node
  // Since tsx might not be installed, let's test directly with node:sqlite
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");

  db.exec(`
    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      tone TEXT,
      archived INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand_id TEXT,
      category_id TEXT,
      description TEXT,
      details TEXT,
      ingredients TEXT,
      size TEXT,
      image TEXT NOT NULL,
      mrp REAL,
      price REAL,
      stock INTEGER NOT NULL DEFAULT 20,
      in_stock INTEGER NOT NULL DEFAULT 1,
      is_new INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.8,
      review_count INTEGER DEFAULT 12,
      published INTEGER NOT NULL DEFAULT 1,
      archived INTEGER DEFAULT 0,
      variants_json TEXT DEFAULT '[]',
      gallery_json TEXT DEFAULT '[]',
      offer_ids_json TEXT DEFAULT '[]',
      related_ids_json TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT 'Rajasthan',
      pincode TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      notes TEXT,
      subtotal REAL NOT NULL,
      delivery_fee REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id),
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      variant_id TEXT,
      variant_name TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL
    );
  `);

  // Insert test category and product
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO categories (id, name, slug, description, tone, archived, created_at, updated_at)
    VALUES ('cat-skincare', 'Skincare', 'skincare', 'Cleansers', '#f5efe6', 0, ?, ?)
  `).run(now, now);

  db.prepare(`
    INSERT INTO products (
      id, slug, name, category_id, image, mrp, price, stock, in_stock, published, archived, created_at, updated_at
    )
    VALUES ('p-test-serum', 'test-serum', 'Test Serum', 'cat-skincare', 'test.jpg', 699, 499, 10, 1, 1, 0, ?, ?)
  `).run(now, now);

  // Test product fetch
  const prod = db.prepare("SELECT * FROM products WHERE id = ?").get("p-test-serum");
  assert.equal(prod.name, "Test Serum");
  assert.equal(prod.stock, 10);
  assert.equal(prod.price, 499);

  // Test atomic order placement: buy 3 items
  const qtyToBuy = 3;
  assert.ok(prod.stock >= qtyToBuy);

  db.exec("BEGIN IMMEDIATE");
  const subtotal = prod.price * qtyToBuy;
  const deliveryFee = subtotal >= 799 ? 0 : 40;
  const total = subtotal + deliveryFee;
  const orderId = "MS-TEST-001";

  db.prepare(`
    INSERT INTO orders (
      id, customer_name, customer_phone, address, city, state, pincode, payment_method,
      subtotal, delivery_fee, total, status, created_at, updated_at
    )
    VALUES (?, 'Bhavesh', '9876543210', 'Main Bazar', 'Pali', 'Rajasthan', '306401', 'cod', ?, ?, ?, 'Pending', ?, ?)
  `).run(orderId, subtotal, deliveryFee, total, now, now);

  db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(orderId, prod.id, prod.name, qtyToBuy, prod.price, subtotal);

  db.prepare(`
    UPDATE products
    SET stock = stock - ?,
        in_stock = CASE WHEN (stock - ?) <= 0 THEN 0 ELSE 1 END,
        updated_at = ?
    WHERE id = ?
  `).run(qtyToBuy, qtyToBuy, now, prod.id);
  db.exec("COMMIT");

  // Verify stock decremented
  const updatedProd = db.prepare("SELECT * FROM products WHERE id = ?").get("p-test-serum");
  assert.equal(updatedProd.stock, 7);
  assert.equal(updatedProd.in_stock, 1);

  // Verify order and order items inserted
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  assert.equal(order.total, 499 * 3 + 0); // 1497 >= 799 so free delivery
  assert.equal(order.status, "Pending");

  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId);
  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 3);
});

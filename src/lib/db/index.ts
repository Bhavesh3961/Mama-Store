import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { categories as initialCategories } from "@/data/categories";
import { products as initialProducts } from "@/data/products";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "mama_store.db");

function initDatabase(): DatabaseSync {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      tone TEXT DEFAULT '#f5efe6',
      archived INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand_id TEXT DEFAULT 'br-mama',
      category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
      description TEXT,
      details TEXT,
      ingredients TEXT,
      size TEXT DEFAULT '',
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

    CREATE TABLE IF NOT EXISTS orders (
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

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      variant_id TEXT,
      variant_name TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  `);

  // Seed if empty
  const countCatRow = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
  if (countCatRow.count === 0) {
    const now = new Date().toISOString();
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, tone, archived, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `);

    for (const cat of initialCategories) {
      insertCat.run(cat.id, cat.name, cat.slug, cat.description || "", cat.tone || "#f5efe6", now, now);
    }
  }

  const countProdRow = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (countProdRow.count === 0) {
    const now = new Date().toISOString();
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, slug, name, brand_id, category_id, description, details, ingredients,
        size, image, mrp, price, stock, in_stock, is_new, is_bestseller, rating,
        review_count, published, archived, variants_json, gallery_json,
        offer_ids_json, related_ids_json, created_at, updated_at
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, 1, 0, ?, ?,
        ?, ?, ?, ?
      )
    `);

    for (const p of initialProducts) {
      insertProd.run(
        p.id,
        p.slug,
        p.name,
        p.brandId || "br-mama",
        p.categoryId,
        p.description || "",
        p.details || "",
        p.ingredients || "",
        p.size || "",
        p.image,
        p.mrp,
        p.price,
        p.inStock ? 25 : 0,
        p.inStock ? 1 : 0,
        p.isNew ? 1 : 0,
        p.isBestseller ? 1 : 0,
        p.rating || 4.8,
        p.reviewCount || 10,
        JSON.stringify(p.variants || []),
        JSON.stringify(p.gallery || []),
        JSON.stringify(p.offerIds || []),
        JSON.stringify(p.relatedIds || []),
        now,
        now
      );
    }
  }

  return db;
}

const globalForDb = globalThis as unknown as { mamaDb?: DatabaseSync };
export const db = globalForDb.mamaDb ?? initDatabase();
if (process.env.NODE_ENV !== "production") {
  globalForDb.mamaDb = db;
}

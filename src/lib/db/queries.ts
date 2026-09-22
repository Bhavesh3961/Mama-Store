import { db } from "./index";
import {
  DbCategoryRow,
  DbProductRow,
  DbOrderRow,
  DbOrderItemRow,
  OrderWithItems,
  OrderStatus,
  mapDbProductToCatalog,
  mapDbCategoryToCatalog,
} from "./types";
import { store } from "@/data/store";
import type { Product as CatalogProduct } from "@/data/products";
import type { Category as CatalogCategory } from "@/data/categories";

// Transaction Helper
export function runTransaction<T>(fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    try {
      db.exec("ROLLBACK");
    } catch {}
    throw err;
  }
}

// ==========================================
// CATEGORIES
// ==========================================

export function getDbCategories(): DbCategoryRow[] {
  const rows = db
    .prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.archived = 0
      WHERE c.archived = 0
      GROUP BY c.id
      ORDER BY c.name ASC
    `)
    .all() as unknown as DbCategoryRow[];
  return rows;
}

export function getAllCategoriesForCatalog(): CatalogCategory[] {
  return getDbCategories().map(mapDbCategoryToCatalog);
}

export function getDbCategoryById(id: string): DbCategoryRow | null {
  const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as unknown as DbCategoryRow | undefined;
  return row ?? null;
}

export function createCategory(data: {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  tone?: string;
}): DbCategoryRow {
  const now = new Date().toISOString();
  const slug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")).trim();
  const id = data.id || `cat-${slug}`;

  db.prepare(`
    INSERT INTO categories (id, name, slug, description, tone, archived, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?)
  `).run(
    id,
    data.name.trim(),
    slug,
    data.description?.trim() || "",
    data.tone?.trim() || "#f5efe6",
    now,
    now
  );

  return getDbCategoryById(id)!;
}

export function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    tone?: string;
  }
): DbCategoryRow {
  const existing = getDbCategoryById(id);
  if (!existing) throw new Error("Category not found");

  const now = new Date().toISOString();
  const name = data.name !== undefined ? data.name.trim() : existing.name;
  const slug = data.slug !== undefined ? data.slug.trim() : existing.slug;
  const description = data.description !== undefined ? data.description.trim() : existing.description;
  const tone = data.tone !== undefined ? data.tone.trim() : existing.tone;

  db.prepare(`
    UPDATE categories
    SET name = ?, slug = ?, description = ?, tone = ?, updated_at = ?
    WHERE id = ?
  `).run(name, slug, description, tone, now, id);

  return getDbCategoryById(id)!;
}

export function deleteCategory(id: string): void {
  // Soft delete / archive
  db.prepare("UPDATE categories SET archived = 1, updated_at = ? WHERE id = ?").run(
    new Date().toISOString(),
    id
  );
}

// ==========================================
// PRODUCTS
// ==========================================

export function getDbProducts(options?: {
  categoryId?: string;
  query?: string;
  includeUnpublished?: boolean;
  includeArchived?: boolean;
}): DbProductRow[] {
  let sql = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  type SqlParam = string | number | null;
  const params: SqlParam[] = [];

  if (!options?.includeArchived) {
    sql += " AND p.archived = 0";
  }

  if (!options?.includeUnpublished) {
    sql += " AND p.published = 1";
  }

  if (options?.categoryId) {
    sql += " AND (p.category_id = ? OR c.slug = ?)";
    params.push(options.categoryId, options.categoryId);
  }

  if (options?.query) {
    const q = `%${options.query.trim().toLowerCase()}%`;
    sql += " AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ?)";
    params.push(q, q);
  }

  sql += " ORDER BY p.is_bestseller DESC, p.created_at DESC";

  const rows = (params.length > 0
    ? db.prepare(sql).all(...params)
    : db.prepare(sql).all()) as unknown as DbProductRow[];
  return rows;
}

export function getAllProductsForCatalog(): CatalogProduct[] {
  return getDbProducts({ includeUnpublished: false, includeArchived: false }).map(mapDbProductToCatalog);
}

export function getDbProductById(id: string): DbProductRow | null {
  const row = db
    .prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `)
    .get(id) as unknown as DbProductRow | undefined;
  return row ?? null;
}

export function getDbProductBySlug(slug: string): DbProductRow | null {
  const row = db
    .prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.archived = 0
    `)
    .get(slug) as unknown as DbProductRow | undefined;
  return row ?? null;
}

export function createProduct(data: {
  name: string;
  slug?: string;
  brand_id?: string;
  category_id: string;
  description: string;
  details?: string;
  ingredients?: string;
  size?: string;
  image: string;
  mrp?: number | null;
  price?: number | null;
  stock?: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  published?: boolean;
  gallery?: { label: string; url?: string; tone: string }[];
}): DbProductRow {
  const now = new Date().toISOString();
  const slug = (
    data.slug ||
    data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  ).trim();
  const id = `p-${slug}-${Date.now().toString(36).slice(-4)}`;
  const stock = data.stock ?? 20;
  const inStock = stock > 0 ? 1 : 0;
  const published = data.published !== false ? 1 : 0;
  const isNew = data.is_new ? 1 : 0;
  const isBestseller = data.is_bestseller ? 1 : 0;

  db.prepare(`
    INSERT INTO products (
      id, slug, name, brand_id, category_id, description, details, ingredients,
      size, image, mrp, price, stock, in_stock, is_new, is_bestseller, rating,
      review_count, published, archived, variants_json, gallery_json,
      offer_ids_json, related_ids_json, created_at, updated_at
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, 4.9,
      1, ?, 0, '[]', ?,
      '[]', '[]', ?, ?
    )
  `).run(
    id,
    slug,
    data.name.trim(),
    data.brand_id || "br-mama",
    data.category_id,
    data.description?.trim() || "",
    data.details?.trim() || "",
    data.ingredients?.trim() || "",
    data.size?.trim() || "",
    data.image.trim(),
    data.mrp ?? null,
    data.price ?? null,
    stock,
    inStock,
    isNew,
    isBestseller,
    published,
    JSON.stringify(data.gallery || []),
    now,
    now
  );

  return getDbProductById(id)!;
}

export function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    brand_id: string;
    category_id: string;
    description: string;
    details: string;
    ingredients: string;
    size: string;
    image: string;
    mrp: number | null;
    price: number | null;
    stock: number;
    is_new: boolean;
    is_bestseller: boolean;
    published: boolean;
    gallery: { label: string; url?: string; tone: string }[];
  }>
): DbProductRow {
  const existing = getDbProductById(id);
  if (!existing) throw new Error("Product not found");

  const now = new Date().toISOString();
  const name = data.name !== undefined ? data.name.trim() : existing.name;
  const slug = data.slug !== undefined ? data.slug.trim() : existing.slug;
  const brand_id = data.brand_id !== undefined ? data.brand_id : existing.brand_id;
  const category_id = data.category_id !== undefined ? data.category_id : existing.category_id;
  const description = data.description !== undefined ? data.description.trim() : existing.description;
  const details = data.details !== undefined ? data.details.trim() : existing.details;
  const ingredients = data.ingredients !== undefined ? data.ingredients.trim() : existing.ingredients;
  const size = data.size !== undefined ? data.size.trim() : existing.size;
  const image = data.image !== undefined ? data.image.trim() : existing.image;
  const mrp = data.mrp !== undefined ? data.mrp : existing.mrp;
  const price = data.price !== undefined ? data.price : existing.price;
  const stock = data.stock !== undefined ? data.stock : existing.stock;
  const in_stock = stock > 0 ? 1 : 0;
  const is_new = data.is_new !== undefined ? (data.is_new ? 1 : 0) : existing.is_new;
  const is_bestseller = data.is_bestseller !== undefined ? (data.is_bestseller ? 1 : 0) : existing.is_bestseller;
  const published = data.published !== undefined ? (data.published ? 1 : 0) : existing.published;
  const gallery_json = data.gallery !== undefined ? JSON.stringify(data.gallery) : existing.gallery_json;

  db.prepare(`
    UPDATE products
    SET name = ?, slug = ?, brand_id = ?, category_id = ?, description = ?,
        details = ?, ingredients = ?, size = ?, image = ?, mrp = ?, price = ?,
        stock = ?, in_stock = ?, is_new = ?, is_bestseller = ?, published = ?,
        gallery_json = ?, updated_at = ?
    WHERE id = ?
  `).run(
    name,
    slug,
    brand_id,
    category_id,
    description,
    details,
    ingredients,
    size,
    image,
    mrp,
    price,
    stock,
    in_stock,
    is_new,
    is_bestseller,
    published,
    gallery_json,
    now,
    id
  );

  return getDbProductById(id)!;
}

export function updateProductStock(id: string, stock: number): DbProductRow {
  const existing = getDbProductById(id);
  if (!existing) throw new Error("Product not found");

  const now = new Date().toISOString();
  const safeStock = Math.max(0, Math.floor(stock));
  const in_stock = safeStock > 0 ? 1 : 0;

  db.prepare(`
    UPDATE products
    SET stock = ?, in_stock = ?, updated_at = ?
    WHERE id = ?
  `).run(safeStock, in_stock, now, id);

  return getDbProductById(id)!;
}

export function toggleProductPublished(id: string): DbProductRow {
  const existing = getDbProductById(id);
  if (!existing) throw new Error("Product not found");

  const now = new Date().toISOString();
  const published = existing.published ? 0 : 1;

  db.prepare("UPDATE products SET published = ?, updated_at = ? WHERE id = ?").run(published, now, id);
  return getDbProductById(id)!;
}

export function deleteProduct(id: string): void {
  // Soft delete / archive
  db.prepare("UPDATE products SET archived = 1, updated_at = ? WHERE id = ?").run(
    new Date().toISOString(),
    id
  );
}

// ==========================================
// ORDERS & TRANSACTIONAL CHECKOUT
// ==========================================

export type CreateOrderInput = {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
  payment_method: "cod" | "upi";
  notes?: string;
  items: {
    productId: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
  }[];
};

export function createOrderWithStockDeduction(input: CreateOrderInput): OrderWithItems {
  // 1. Validation
  const name = input.customer_name?.trim();
  const phone = input.customer_phone?.trim();
  const address = input.address?.trim();
  const city = input.city?.trim();
  const state = (input.state?.trim() || "Rajasthan").trim();
  const pincode = input.pincode?.trim();
  const payment = input.payment_method === "upi" ? "upi" : "cod";
  const notes = input.notes?.trim() || null;

  if (!name || name.length < 2) {
    throw new Error("Please provide your full name.");
  }
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    throw new Error("Please provide a valid 10-digit Indian mobile number.");
  }
  if (!address || address.length < 5) {
    throw new Error("Please provide a complete delivery address.");
  }
  if (!city) {
    throw new Error("City is required.");
  }
  if (!pincode || !/^\d{6}$/.test(pincode)) {
    throw new Error("Please provide a valid 6-digit postal pincode.");
  }
  if (!input.items || input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  // 2. Run inside atomic SQLite transaction
  return runTransaction(() => {
    const orderId = `MS-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    let subtotal = 0;
    const validatedItems: {
      productId: string;
      productName: string;
      variantId: string | null;
      variantName: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    const getProductStmt = db.prepare(`
      SELECT id, name, price, stock, in_stock, published, archived
      FROM products
      WHERE id = ?
    `);

    const updateStockStmt = db.prepare(`
      UPDATE products
      SET stock = stock - ?,
          in_stock = CASE WHEN (stock - ?) <= 0 THEN 0 ELSE 1 END,
          updated_at = ?
      WHERE id = ?
    `);

    for (const item of input.items) {
      const qty = Math.floor(item.quantity);
      if (qty <= 0) {
        throw new Error("Item quantity must be at least 1.");
      }

      const product = getProductStmt.get(item.productId) as unknown as
        | {
            id: string;
            name: string;
            price: number | null;
            stock: number;
            in_stock: number;
            published: number;
            archived: number;
          }
        | undefined;

      if (!product || product.archived === 1 || product.published === 0) {
        throw new Error(`Product "${item.productId}" is no longer available.`);
      }

      if (product.price == null) {
        throw new Error(
          `"${product.name}" is marked for price enquiry only and cannot be ordered online.`
        );
      }

      if (product.stock < qty) {
        throw new Error(
          `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        );
      }

      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      const fullProductName = item.variantName
        ? `${product.name} · ${item.variantName}`
        : product.name;

      validatedItems.push({
        productId: product.id,
        productName: fullProductName,
        variantId: item.variantId || null,
        variantName: item.variantName || null,
        quantity: qty,
        unitPrice: product.price,
        totalPrice: itemTotal,
      });

      // Deduct stock immediately in transaction
      updateStockStmt.run(qty, qty, now, product.id);
    }

    const deliveryFee = subtotal >= store.freeDeliveryOver ? 0 : store.deliveryFee;
    const total = subtotal + deliveryFee;

    // Insert Order
    db.prepare(`
      INSERT INTO orders (
        id, customer_name, customer_phone, customer_email, address,
        city, state, pincode, payment_method, notes, subtotal,
        delivery_fee, total, status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
    `).run(
      orderId,
      name,
      phone,
      input.customer_email?.trim() || null,
      address,
      city,
      state,
      pincode,
      payment,
      notes,
      subtotal,
      deliveryFee,
      total,
      now,
      now
    );

    // Insert Order Items
    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_name, variant_id, variant_name,
        quantity, unit_price, total_price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of validatedItems) {
      insertItemStmt.run(
        orderId,
        item.productId,
        item.productName,
        item.variantId,
        item.variantName,
        item.quantity,
        item.unitPrice,
        item.totalPrice
      );
    }

    return getOrderById(orderId)!;
  });
}

export function getOrderById(id: string): OrderWithItems | null {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as unknown as
    | DbOrderRow
    | undefined;
  if (!order) return null;

  const items = db
    .prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC")
    .all(id) as unknown as DbOrderItemRow[];

  return {
    ...order,
    items,
  };
}

export function getAllOrders(options?: {
  status?: string;
  query?: string;
  limit?: number;
  offset?: number;
}): OrderWithItems[] {
  let sql = "SELECT * FROM orders WHERE 1=1";
  type SqlParam = string | number;
  const params: SqlParam[] = [];

  if (options?.status && options.status !== "All") {
    sql += " AND status = ?";
    params.push(options.status);
  }

  if (options?.query) {
    const q = `%${options.query.trim().toLowerCase()}%`;
    sql += " AND (LOWER(id) LIKE ? OR LOWER(customer_name) LIKE ? OR customer_phone LIKE ?)";
    params.push(q, q, q);
  }

  sql += " ORDER BY created_at DESC";

  if (options?.limit) {
    sql += " LIMIT ?";
    params.push(options.limit);
  }
  if (options?.offset) {
    sql += " OFFSET ?";
    params.push(options.offset);
  }

  const orders = (params.length > 0
    ? db.prepare(sql).all(...params)
    : db.prepare(sql).all()) as unknown as DbOrderRow[];

  return orders.map((o) => {
    const items = db
      .prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC")
      .all(o.id) as unknown as DbOrderItemRow[];
    return { ...o, items };
  });
}

export function updateOrderStatus(id: string, status: OrderStatus): OrderWithItems {
  const validStatuses: OrderStatus[] = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const now = new Date().toISOString();
  db.prepare("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?").run(status, now, id);

  const updated = getOrderById(id);
  if (!updated) throw new Error("Order not found");
  return updated;
}

// ==========================================
// DASHBOARD STATS
// ==========================================

export function getDashboardStats(): {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: OrderWithItems[];
  lowStockProducts: DbProductRow[];
} {
  const prodRow = db
    .prepare("SELECT COUNT(*) as count FROM products WHERE archived = 0")
    .get() as { count: number };
  const orderRow = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
  const pendingRow = db
    .prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'")
    .get() as { count: number };
  const revenueRow = db
    .prepare("SELECT SUM(total) as revenue FROM orders WHERE status != 'Cancelled'")
    .get() as { revenue: number | null };

  const recentOrders = getAllOrders({ limit: 5 });

  const lowStockProducts = db
    .prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.archived = 0 AND p.stock <= 5
      ORDER BY p.stock ASC
      LIMIT 10
    `)
    .all() as unknown as DbProductRow[];

  return {
    totalProducts: prodRow.count,
    totalOrders: orderRow.count,
    pendingOrders: pendingRow.count,
    totalRevenue: revenueRow.revenue || 0,
    recentOrders,
    lowStockProducts,
  };
}

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

// Transaction Helper (No-op for in-memory)
export function runTransaction<T>(fn: () => T): T {
  return fn();
}

// ==========================================
// CATEGORIES
// ==========================================

export function getDbCategories(): DbCategoryRow[] {
  return db.categories
    .filter((c) => c.archived === 0)
    .map((c) => {
      const product_count = db.products.filter(
        (p) => p.category_id === c.id && p.archived === 0
      ).length;
      return { ...c, product_count };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllCategoriesForCatalog(): CatalogCategory[] {
  return getDbCategories().map(mapDbCategoryToCatalog);
}

export function getDbCategoryById(id: string): DbCategoryRow | null {
  return db.categories.find((c) => c.id === id) || null;
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

  const newCat: DbCategoryRow = {
    id,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || "",
    tone: data.tone?.trim() || "#f5efe6",
    archived: 0,
    created_at: now,
    updated_at: now,
  };

  db.categories.push(newCat);
  return newCat;
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
  const existingIndex = db.categories.findIndex((c) => c.id === id);
  if (existingIndex === -1) throw new Error("Category not found");

  const existing = db.categories[existingIndex];
  const now = new Date().toISOString();

  const updated: DbCategoryRow = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    slug: data.slug !== undefined ? data.slug.trim() : existing.slug,
    description: data.description !== undefined ? data.description.trim() : existing.description,
    tone: data.tone !== undefined ? data.tone.trim() : existing.tone,
    updated_at: now,
  };

  db.categories[existingIndex] = updated;
  return updated;
}

export function deleteCategory(id: string): void {
  const existing = db.categories.find((c) => c.id === id);
  if (existing) {
    existing.archived = 1;
    existing.updated_at = new Date().toISOString();
  }
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
  let list = db.products.map((p) => {
    const cat = db.categories.find((c) => c.id === p.category_id);
    return { ...p, category_name: cat ? cat.name : null };
  });

  if (!options?.includeArchived) {
    list = list.filter((p) => p.archived === 0);
  }

  if (!options?.includeUnpublished) {
    list = list.filter((p) => p.published === 1);
  }

  if (options?.categoryId) {
    list = list.filter((p) => {
      const cat = db.categories.find((c) => c.id === p.category_id);
      return p.category_id === options.categoryId || (cat && cat.slug === options.categoryId);
    });
  }

  if (options?.query) {
    const q = options.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => {
    if (a.is_bestseller !== b.is_bestseller) {
      return b.is_bestseller - a.is_bestseller; // 1 before 0
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getAllProductsForCatalog(): CatalogProduct[] {
  return getDbProducts({ includeUnpublished: false, includeArchived: false }).map(mapDbProductToCatalog);
}

export function getDbProductById(id: string): DbProductRow | null {
  const p = db.products.find((p) => p.id === id);
  if (!p) return null;
  const cat = db.categories.find((c) => c.id === p.category_id);
  return { ...p, category_name: cat ? cat.name : null };
}

export function getDbProductBySlug(slug: string): DbProductRow | null {
  const p = db.products.find((p) => p.slug === slug && p.archived === 0);
  if (!p) return null;
  const cat = db.categories.find((c) => c.id === p.category_id);
  return { ...p, category_name: cat ? cat.name : null };
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

  const newProd: DbProductRow = {
    id,
    slug,
    name: data.name.trim(),
    brand_id: data.brand_id || "br-mama",
    category_id: data.category_id,
    description: data.description?.trim() || "",
    details: data.details?.trim() || "",
    ingredients: data.ingredients?.trim() || "",
    size: data.size?.trim() || "",
    image: data.image.trim(),
    mrp: data.mrp ?? null,
    price: data.price ?? null,
    stock,
    in_stock: inStock,
    is_new: isNew,
    is_bestseller: isBestseller,
    rating: 4.9,
    review_count: 1,
    published,
    archived: 0,
    variants_json: '[]',
    gallery_json: JSON.stringify(data.gallery || []),
    offer_ids_json: '[]',
    related_ids_json: '[]',
    created_at: now,
    updated_at: now,
  };

  db.products.push(newProd);
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
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Product not found");

  const existing = db.products[index];
  const now = new Date().toISOString();

  const stock = data.stock !== undefined ? data.stock : existing.stock;
  const in_stock = stock > 0 ? 1 : 0;

  const updated: DbProductRow = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    slug: data.slug !== undefined ? data.slug.trim() : existing.slug,
    brand_id: data.brand_id !== undefined ? data.brand_id : existing.brand_id,
    category_id: data.category_id !== undefined ? data.category_id : existing.category_id,
    description: data.description !== undefined ? data.description.trim() : existing.description,
    details: data.details !== undefined ? data.details.trim() : existing.details,
    ingredients: data.ingredients !== undefined ? data.ingredients.trim() : existing.ingredients,
    size: data.size !== undefined ? data.size.trim() : existing.size,
    image: data.image !== undefined ? data.image.trim() : existing.image,
    mrp: data.mrp !== undefined ? data.mrp : existing.mrp,
    price: data.price !== undefined ? data.price : existing.price,
    stock,
    in_stock,
    is_new: data.is_new !== undefined ? (data.is_new ? 1 : 0) : existing.is_new,
    is_bestseller: data.is_bestseller !== undefined ? (data.is_bestseller ? 1 : 0) : existing.is_bestseller,
    published: data.published !== undefined ? (data.published ? 1 : 0) : existing.published,
    gallery_json: data.gallery !== undefined ? JSON.stringify(data.gallery) : existing.gallery_json,
    updated_at: now,
  };

  db.products[index] = updated;
  return getDbProductById(id)!;
}

export function updateProductStock(id: string, stock: number): DbProductRow {
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Product not found");

  const safeStock = Math.max(0, Math.floor(stock));
  const in_stock = safeStock > 0 ? 1 : 0;
  
  db.products[index].stock = safeStock;
  db.products[index].in_stock = in_stock;
  db.products[index].updated_at = new Date().toISOString();

  return getDbProductById(id)!;
}

export function toggleProductPublished(id: string): DbProductRow {
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Product not found");

  db.products[index].published = db.products[index].published ? 0 : 1;
  db.products[index].updated_at = new Date().toISOString();
  
  return getDbProductById(id)!;
}

export function deleteProduct(id: string): void {
  const p = db.products.find((p) => p.id === id);
  if (p) {
    p.archived = 1;
    p.updated_at = new Date().toISOString();
  }
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
  const name = input.customer_name?.trim();
  const phone = input.customer_phone?.trim();
  const address = input.address?.trim();
  const city = input.city?.trim();
  const state = (input.state?.trim() || "Rajasthan").trim();
  const pincode = input.pincode?.trim();
  const payment = input.payment_method === "upi" ? "upi" : "cod";
  const notes = input.notes?.trim() || null;

  if (!name || name.length < 2) throw new Error("Please provide your full name.");
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) throw new Error("Please provide a valid 10-digit Indian mobile number.");
  if (!address || address.length < 5) throw new Error("Please provide a complete delivery address.");
  if (!city) throw new Error("City is required.");
  if (!pincode || !/^\d{6}$/.test(pincode)) throw new Error("Please provide a valid 6-digit postal pincode.");
  if (!input.items || input.items.length === 0) throw new Error("Your cart is empty.");

  const orderId = `MS-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  let subtotal = 0;
  const validatedItems: DbOrderItemRow[] = [];
  let nextItemId = db.orderItems.length > 0 ? Math.max(...db.orderItems.map((i) => i.id)) + 1 : 1;

  for (const item of input.items) {
    const qty = Math.floor(item.quantity);
    if (qty <= 0) throw new Error("Item quantity must be at least 1.");

    const productIndex = db.products.findIndex((p) => p.id === item.productId);
    const product = db.products[productIndex];

    if (!product || product.archived === 1 || product.published === 0) {
      throw new Error(`Product "${item.productId}" is no longer available.`);
    }
    if (product.price == null) {
      throw new Error(`"${product.name}" is marked for price enquiry only and cannot be ordered online.`);
    }
    if (product.stock < qty) {
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`);
    }

    const itemTotal = product.price * qty;
    subtotal += itemTotal;

    const fullProductName = item.variantName ? `${product.name} · ${item.variantName}` : product.name;

    validatedItems.push({
      id: nextItemId++,
      order_id: orderId,
      product_id: product.id,
      product_name: fullProductName,
      variant_id: item.variantId || null,
      variant_name: item.variantName || null,
      quantity: qty,
      unit_price: product.price,
      total_price: itemTotal,
    });

    // Deduct stock in memory
    db.products[productIndex].stock -= qty;
    db.products[productIndex].in_stock = db.products[productIndex].stock > 0 ? 1 : 0;
    db.products[productIndex].updated_at = now;
  }

  const deliveryFee = subtotal >= store.freeDeliveryOver ? 0 : store.deliveryFee;
  const total = subtotal + deliveryFee;

  const newOrder: DbOrderRow = {
    id: orderId,
    customer_name: name,
    customer_phone: phone,
    customer_email: input.customer_email?.trim() || null,
    address,
    city,
    state,
    pincode,
    payment_method: payment,
    notes,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    status: "Pending",
    created_at: now,
    updated_at: now,
  };

  db.orders.push(newOrder);
  db.orderItems.push(...validatedItems);

  return getOrderById(orderId)!;
}

export function getOrderById(id: string): OrderWithItems | null {
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;

  const items = db.orderItems.filter((i) => i.order_id === id).sort((a, b) => a.id - b.id);
  return { ...order, items };
}

export function getAllOrders(options?: {
  status?: string;
  query?: string;
  limit?: number;
  offset?: number;
}): OrderWithItems[] {
  let list = db.orders;

  if (options?.status && options.status !== "All") {
    list = list.filter((o) => o.status === options.status);
  }

  if (options?.query) {
    const q = options.query.trim().toLowerCase();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
    );
  }

  list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (options?.offset !== undefined || options?.limit !== undefined) {
    const offset = options.offset || 0;
    const limit = options.limit || list.length;
    list = list.slice(offset, offset + limit);
  }

  return list.map((o) => {
    const items = db.orderItems.filter((i) => i.order_id === o.id).sort((a, b) => a.id - b.id);
    return { ...o, items };
  });
}

export function updateOrderStatus(id: string, status: OrderStatus): OrderWithItems {
  const validStatuses: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) throw new Error(`Invalid status: ${status}`);

  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) throw new Error("Order not found");

  db.orders[index].status = status;
  db.orders[index].updated_at = new Date().toISOString();

  return getOrderById(id)!;
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
  const totalProducts = db.products.filter((p) => p.archived === 0).length;
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o) => o.status === "Pending").length;
  
  const totalRevenue = db.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = getAllOrders({ limit: 5 });

  const lowStockProducts = db.products
    .filter((p) => p.archived === 0 && p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10)
    .map((p) => {
      const cat = db.categories.find((c) => c.id === p.category_id);
      return { ...p, category_name: cat ? cat.name : null };
    });

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue,
    recentOrders,
    lowStockProducts,
  };
}

import { categories as initialCategories } from "@/data/categories";
import { products as initialProducts } from "@/data/products";
import type { DbCategoryRow, DbProductRow, DbOrderRow, DbOrderItemRow } from "./types";

export type InMemoryDatabase = {
  categories: DbCategoryRow[];
  products: DbProductRow[];
  orders: DbOrderRow[];
  orderItems: DbOrderItemRow[];
};

function initDatabase(): InMemoryDatabase {
  const db: InMemoryDatabase = {
    categories: [],
    products: [],
    orders: [],
    orderItems: [],
  };

  const now = new Date().toISOString();

  // Seed Categories
  for (const cat of initialCategories) {
    db.categories.push({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      tone: cat.tone || "#f5efe6",
      archived: 0,
      created_at: now,
      updated_at: now,
    });
  }

  // Seed Products
  for (const p of initialProducts) {
    db.products.push({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand_id: p.brandId || "br-mama",
      category_id: p.categoryId,
      description: p.description || "",
      details: p.details || "",
      ingredients: p.ingredients || "",
      size: p.size || "",
      image: p.image,
      mrp: p.mrp,
      price: p.price,
      stock: p.inStock ? 25 : 0,
      in_stock: p.inStock ? 1 : 0,
      is_new: p.isNew ? 1 : 0,
      is_bestseller: p.isBestseller ? 1 : 0,
      rating: p.rating || 4.8,
      review_count: p.reviewCount || 10,
      published: 1,
      archived: 0,
      variants_json: JSON.stringify(p.variants || []),
      gallery_json: JSON.stringify(p.gallery || []),
      offer_ids_json: JSON.stringify(p.offerIds || []),
      related_ids_json: JSON.stringify(p.relatedIds || []),
      created_at: now,
      updated_at: now,
    });
  }

  return db;
}

const globalForDb = globalThis as unknown as { mamaDb?: InMemoryDatabase };
export const db = globalForDb.mamaDb ?? initDatabase();

// Sync any newly added products or updated images from initialProducts
for (const p of initialProducts) {
  const existing = db.products.find((x) => x.id === p.id);
  if (!existing) {
    db.products.push({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand_id: p.brandId || "br-mama",
      category_id: p.categoryId,
      description: p.description || "",
      details: p.details || "",
      ingredients: p.ingredients || "",
      size: p.size || "",
      image: p.image,
      mrp: p.mrp,
      price: p.price,
      stock: p.inStock ? 25 : 0,
      in_stock: p.inStock ? 1 : 0,
      is_new: p.isNew ? 1 : 0,
      is_bestseller: p.isBestseller ? 1 : 0,
      rating: p.rating || 4.8,
      review_count: p.reviewCount || 10,
      published: 1,
      archived: 0,
      variants_json: JSON.stringify(p.variants || []),
      gallery_json: JSON.stringify(p.gallery || []),
      offer_ids_json: JSON.stringify(p.offerIds || []),
      related_ids_json: JSON.stringify(p.relatedIds || []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } else {
    existing.image = p.image;
    existing.name = p.name;
    existing.description = p.description;
    existing.details = p.details || "";
    existing.gallery_json = JSON.stringify(p.gallery || []);
    if (p.price != null) existing.price = p.price;
    if (p.mrp != null) existing.mrp = p.mrp;
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForDb.mamaDb = db;
}


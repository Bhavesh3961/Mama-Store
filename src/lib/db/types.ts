import type { Product as CatalogProduct, ProductVariant } from "@/data/products";
import { getCategory, type Category as CatalogCategory } from "@/data/categories";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type DbProductRow = {
  id: string;
  slug: string;
  name: string;
  brand_id: string;
  category_id: string | null;
  category_name?: string | null;
  description: string;
  details: string;
  ingredients: string;
  size: string;
  image: string;
  mrp: number | null;
  price: number | null;
  stock: number;
  in_stock: number;
  is_new: number;
  is_bestseller: number;
  rating: number;
  review_count: number;
  published: number;
  archived: number;
  variants_json: string;
  gallery_json: string;
  offer_ids_json: string;
  related_ids_json: string;
  created_at: string;
  updated_at: string;
};

export type DbCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tone: string | null;
  archived: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
};

export type DbOrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: "cod" | "upi";
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type DbOrderItemRow = {
  id: number;
  order_id: string;
  product_id: string;
  product_name: string;
  variant_id: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type OrderWithItems = DbOrderRow & {
  items: DbOrderItemRow[];
};

export function mapDbProductToCatalog(row: DbProductRow): CatalogProduct {
  let variants: ProductVariant[] = [];
  try {
    variants = JSON.parse(row.variants_json || "[]");
  } catch {}

  let gallery: { label: string; url?: string; tone: string }[] = [];
  try {
    gallery = JSON.parse(row.gallery_json || "[]");
  } catch {}

  let offerIds: string[] = [];
  try {
    offerIds = JSON.parse(row.offer_ids_json || "[]");
  } catch {}

  let relatedIds: string[] = [];
  try {
    relatedIds = JSON.parse(row.related_ids_json || "[]");
  } catch {}

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandId: row.brand_id,
    categoryId: row.category_id || "",
    description: row.description,
    details: row.details || undefined,
    ingredients: row.ingredients || undefined,
    size: row.size,
    image: row.image,
    mrp: row.mrp,
    price: row.price,
    inStock: Boolean(row.in_stock && row.stock > 0),
    isNew: Boolean(row.is_new),
    isBestseller: Boolean(row.is_bestseller),
    offerIds,
    rating: row.rating,
    reviewCount: row.review_count,
    relatedIds,
    variants: variants.length ? variants : undefined,
    gallery,
  };
}

export function mapDbCategoryToCatalog(row: DbCategoryRow): CatalogCategory {
  const cat = getCategory(row.slug) || getCategory(row.id);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    tone: row.tone || "#f5efe6",
    image: cat?.image || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
    popularProducts: cat?.popularProducts || "Curated formulations",
    tagline: cat?.tagline || "Luxury Atelier",
  };
}

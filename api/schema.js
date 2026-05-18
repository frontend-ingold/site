export const schemaSql = `
CREATE TABLE IF NOT EXISTS page_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS hero_assets (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS search_categories (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS nav_items (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  mega_menu_class TEXT,
  sort_order INTEGER NOT NULL,
  promo_eyebrow TEXT,
  promo_title TEXT,
  promo_image TEXT
);

CREATE TABLE IF NOT EXISTS nav_columns (
  id SERIAL PRIMARY KEY,
  nav_item_id INTEGER NOT NULL REFERENCES nav_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS nav_column_items (
  id SERIAL PRIMARY KEY,
  nav_column_id INTEGER NOT NULL REFERENCES nav_columns(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  image TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  count_label TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  group_key TEXT NOT NULL,
  slug TEXT NOT NULL,
  sku TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  old_price TEXT NOT NULL,
  tag TEXT NOT NULL,
  image TEXT NOT NULL,
  rating INTEGER NOT NULL,
  available INTEGER NOT NULL,
  sold INTEGER NOT NULL,
  accent_color TEXT NOT NULL DEFAULT '',
  nutrition_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  short_description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  rating INTEGER NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS vendor_items (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date_label TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS accent_color TEXT NOT NULL DEFAULT '';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS nutrition_tags JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL DEFAULT '';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku TEXT NOT NULL DEFAULT '';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_description TEXT NOT NULL DEFAULT '';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS long_description TEXT NOT NULL DEFAULT '';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb;
`;

import { pool } from './db.js';

function keyValueRowsToObject(rows) {
  return rows.reduce((accumulator, row) => {
    accumulator[row.key] = row.value;
    return accumulator;
  }, {});
}

function mapProduct(row) {
  return {
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: row.price,
    oldPrice: row.old_price,
    tag: row.tag,
    image: row.image,
    rating: row.rating,
    available: row.available,
    sold: row.sold,
    accentColor: row.accent_color,
    nutritionTags: row.nutrition_tags ?? [],
    shortDescription: row.short_description,
    longDescription: row.long_description,
    galleryImages: row.gallery_images ?? [row.image]
  };
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email
  };
}

function mapOrder(row) {
  return {
    id: row.id,
    date: new Date(row.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    total: Number(row.total),
    status: row.status,
    items: row.items ?? [],
    customer: row.customer ?? {}
  };
}

export async function getPageData() {
  const [
    pageSettingsResult,
    heroAssetsResult,
    searchCategoriesResult,
    navItemsResult,
    navColumnsResult,
    navColumnItemsResult,
    categoriesResult,
    productsResult,
    dealMonthProductsResult,
    vendorsResult,
    vendorItemsResult,
    articlesResult
  ] = await Promise.all([
    pool.query('SELECT key, value FROM page_settings'),
    pool.query('SELECT key, value FROM hero_assets'),
    pool.query('SELECT label FROM search_categories ORDER BY sort_order'),
    pool.query('SELECT * FROM nav_items ORDER BY sort_order'),
    pool.query('SELECT * FROM nav_columns ORDER BY sort_order'),
    pool.query('SELECT * FROM nav_column_items ORDER BY sort_order'),
    pool.query('SELECT name, image, count_label, sort_order FROM categories ORDER BY sort_order'),
    pool.query('SELECT * FROM products WHERE group_key = $1 ORDER BY sort_order', ['catalog']),
    pool.query('SELECT * FROM products WHERE group_key = $1 ORDER BY sort_order', ['deal_month']),
    pool.query('SELECT * FROM vendors ORDER BY sort_order'),
    pool.query('SELECT * FROM vendor_items ORDER BY sort_order'),
    pool.query('SELECT * FROM articles ORDER BY sort_order')
  ]);

  const pageSettings = keyValueRowsToObject(pageSettingsResult.rows);
  const heroSlides = heroAssetsResult.rows.reduce((accumulator, row) => {
    accumulator[row.key] = row.value;
    return accumulator;
  }, {});

  const navItemsById = new Map();
  const navigationItems = navItemsResult.rows.map((row) => {
    const item = {
      label: row.label
    };

    if (row.mega_menu_class) {
      item.megaMenuClass = row.mega_menu_class;
      item.columns = [];
    }

    if (row.promo_title) {
      item.promo = {
        eyebrow: row.promo_eyebrow,
        title: row.promo_title,
        image: row.promo_image
      };
    }

    navItemsById.set(row.id, item);
    return item;
  });

  const navColumnsById = new Map();
  navColumnsResult.rows.forEach((row) => {
    const column = {
      title: row.title,
      displayType: row.display_type,
      items: []
    };

    navColumnsById.set(row.id, column);
    navItemsById.get(row.nav_item_id)?.columns?.push(column);
  });

  navColumnItemsResult.rows.forEach((row) => {
    const column = navColumnsById.get(row.nav_column_id);
    if (!column) {
      return;
    }

    column.items.push({
      label: row.label,
      ...(row.image ? { image: row.image } : {})
    });
  });

  const vendorsById = new Map();
  const vendors = vendorsResult.rows.map((row) => {
    const vendor = {
      name: row.name,
      logo: row.logo,
      rating: row.rating,
      items: []
    };
    vendorsById.set(row.id, vendor);
    return vendor;
  });

  vendorItemsResult.rows.forEach((row) => {
    vendorsById.get(row.vendor_id)?.items.push(row.image);
  });

  return {
    header: pageSettings.header,
    heroSlides,
    hero: pageSettings.hero,
    navigation: {
      searchCategories: searchCategoriesResult.rows.map((row) => row.label),
      utilities: pageSettings.navigation_utilities,
      items: navigationItems
    },
    sections: pageSettings.sections,
    categories: categoriesResult.rows.map((row) => ({
      name: row.name,
      image: row.image,
      count: row.count_label
    })),
    products: productsResult.rows.map(mapProduct),
    dealMonthProducts: dealMonthProductsResult.rows.map(mapProduct),
    vendors,
    articles: articlesResult.rows.map((row) => ({
      title: row.title,
      date: row.date_label,
      excerpt: row.excerpt,
      image: row.image
    })),
    footer: pageSettings.footer
  };
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existsResult = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existsResult.rowCount > 0) {
    return null;
  }

  const result = await pool.query(
    `INSERT INTO users(name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name.trim(), normalizedEmail, password]
  );

  return mapUser(result.rows[0]);
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    `SELECT id, name, email
     FROM users
     WHERE email = $1 AND password = $2`,
    [normalizedEmail, password]
  );

  return result.rowCount > 0 ? mapUser(result.rows[0]) : null;
}

export async function getUserPasswordHint(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query('SELECT password FROM users WHERE email = $1', [normalizedEmail]);
  return result.rowCount > 0 ? result.rows[0].password : null;
}

export async function updateUserProfile({ id, name, email }) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    `UPDATE users
     SET name = $2, email = $3, updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email`,
    [id, name.trim(), normalizedEmail]
  );

  return result.rowCount > 0 ? mapUser(result.rows[0]) : null;
}

export async function getOrdersByUserId(userId) {
  const result = await pool.query(
    `SELECT id, status, total, customer, items, created_at
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows.map(mapOrder);
}

export async function createOrder({ userId, orderId, status, total, customer, items }) {
  const result = await pool.query(
    `INSERT INTO orders(id, user_id, status, total, customer, items)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, status, total, customer, items, created_at`,
    [orderId, userId, status, total, JSON.stringify(customer), JSON.stringify(items)]
  );

  return mapOrder(result.rows[0]);
}

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

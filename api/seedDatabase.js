import seedData from './seedData.js';
import { pool } from './db.js';
import { schemaSql } from './schema.js';

export async function seedDatabase({ closePool = false } = {}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(schemaSql);
    await client.query(`
      TRUNCATE TABLE
        vendor_items,
        vendors,
        articles,
        products,
        categories,
        nav_column_items,
        nav_columns,
        nav_items,
        search_categories,
        hero_assets,
        page_settings
      RESTART IDENTITY CASCADE
    `);

    await client.query('INSERT INTO page_settings(key, value) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8), ($9, $10)', [
      'header',
      JSON.stringify(seedData.header),
      'hero',
      JSON.stringify(seedData.hero),
      'sections',
      JSON.stringify(seedData.sections),
      'navigation_utilities',
      JSON.stringify(seedData.navigation.utilities),
      'footer',
      JSON.stringify(seedData.footer)
    ]);

    for (const [key, value] of Object.entries(seedData.heroSlides)) {
      await client.query('INSERT INTO hero_assets(key, value) VALUES ($1, $2)', [key, value]);
    }

    for (const [index, label] of seedData.navigation.searchCategories.entries()) {
      await client.query('INSERT INTO search_categories(label, sort_order) VALUES ($1, $2)', [label, index]);
    }

    for (const [index, item] of seedData.navigation.items.entries()) {
      const navItemResult = await client.query(
        `INSERT INTO nav_items(label, mega_menu_class, sort_order, promo_eyebrow, promo_title, promo_image)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          item.label,
          item.megaMenuClass ?? null,
          index,
          item.promo?.eyebrow ?? null,
          item.promo?.title ?? null,
          item.promo?.image ?? null
        ]
      );

      if (!item.columns) {
        continue;
      }

      for (const [columnIndex, column] of item.columns.entries()) {
        const columnResult = await client.query(
          `INSERT INTO nav_columns(nav_item_id, title, display_type, sort_order)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [navItemResult.rows[0].id, column.title, column.displayType, columnIndex]
        );

        for (const [itemIndex, subItem] of column.items.entries()) {
          await client.query(
            `INSERT INTO nav_column_items(nav_column_id, label, image, sort_order)
             VALUES ($1, $2, $3, $4)`,
            [columnResult.rows[0].id, subItem.label, subItem.image ?? null, itemIndex]
          );
        }
      }
    }

    for (const [index, category] of seedData.categories.entries()) {
      await client.query(
        'INSERT INTO categories(name, image, count_label, sort_order) VALUES ($1, $2, $3, $4)',
        [category.name, category.image, category.count, index]
      );
    }

    for (const [index, product] of seedData.products.entries()) {
      await client.query(
        `INSERT INTO products(group_key, slug, sku, name, category, price, old_price, tag, image, rating, available, sold, accent_color, nutrition_tags, short_description, long_description, gallery_images, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          'catalog',
          product.slug,
          product.sku ?? '',
          product.name,
          product.category,
          product.price,
          product.oldPrice,
          product.tag,
          product.image,
          product.rating,
          product.available,
          product.sold,
          product.accentColor ?? '',
          JSON.stringify(product.nutritionTags ?? []),
          product.shortDescription ?? '',
          product.longDescription ?? '',
          JSON.stringify(product.galleryImages ?? [product.image]),
          index
        ]
      );
    }

    for (const [index, product] of seedData.dealMonthProducts.entries()) {
      await client.query(
        `INSERT INTO products(group_key, slug, sku, name, category, price, old_price, tag, image, rating, available, sold, accent_color, nutrition_tags, short_description, long_description, gallery_images, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          'deal_month',
          product.slug,
          product.sku ?? '',
          product.name,
          product.category,
          product.price,
          product.oldPrice,
          product.tag,
          product.image,
          product.rating,
          product.available,
          product.sold,
          product.accentColor ?? '',
          JSON.stringify(product.nutritionTags ?? []),
          product.shortDescription ?? '',
          product.longDescription ?? '',
          JSON.stringify(product.galleryImages ?? [product.image]),
          index
        ]
      );
    }

    for (const [index, vendor] of seedData.vendors.entries()) {
      const vendorResult = await client.query(
        'INSERT INTO vendors(name, logo, rating, sort_order) VALUES ($1, $2, $3, $4) RETURNING id',
        [vendor.name, vendor.logo, vendor.rating, index]
      );

      for (const [itemIndex, image] of vendor.items.entries()) {
        await client.query(
          'INSERT INTO vendor_items(vendor_id, image, sort_order) VALUES ($1, $2, $3)',
          [vendorResult.rows[0].id, image, itemIndex]
        );
      }
    }

    for (const [index, article] of seedData.articles.entries()) {
      await client.query(
        'INSERT INTO articles(title, date_label, excerpt, image, sort_order) VALUES ($1, $2, $3, $4, $5)',
        [article.title, article.date, article.excerpt, article.image, index]
      );
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    if (closePool) {
      await pool.end();
    }
  }
}

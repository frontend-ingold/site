import { pool } from "../config/db.js";

export async function getCategoryShowcase(_request, response) {
  try {
    const allowedSlugs = ["jeans", "shoes", "hats"];

    const categoriesResult = await pool.query(
      `
        SELECT
          id,
          name,
          slug,
          sort_order
        FROM category_showcase_categories
        WHERE slug = ANY($1::text[])
        ORDER BY sort_order ASC
      `,
      [allowedSlugs]
    );

    const categories = categoriesResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug
    }));

    const categoryIds = categories.map((row) => row.id);

    const productsResult = await pool.query(
      `
        SELECT
          id,
          category_id,
          brand,
          name,
          category_name,
          price,
          old_price,
          option_label,
          option_value,
          image_url,
          sort_order
        FROM category_showcase_products
        WHERE category_id::text = ANY($1::text[])
        ORDER BY category_id ASC, sort_order ASC
      `,
      [categoryIds]
    );

    response.json({
      title: "Categories",
      ctaLabel: "SHOP NOW",
      moreLabel: "Check More",
      categories,
      products: productsResult.rows.map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        brand: row.brand,
        name: row.name,
        category: row.category_name,
        price: row.price,
        oldPrice: row.old_price,
        optionLabel: row.option_label,
        optionValue: row.option_value,
        image: row.image_url
      }))
    });
  } catch (error) {
    console.error("Failed to fetch category showcase", error);
    response.status(500).json({
      message: "Failed to fetch category showcase"
    });
  }
}

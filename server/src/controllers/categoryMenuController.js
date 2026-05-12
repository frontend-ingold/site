import { pool } from "../config/db.js";

export async function getCategoryMenu(_request, response) {
  try {
    const categoryMenuResult = await pool.query(
      `
        SELECT
          cg.id AS group_id,
          cg.name AS group_name,
          cg.sort_order AS group_sort_order,
          cg.promo_image_url,
          ci.id AS item_id,
          ci.name AS item_name,
          ci.href,
          ci.sort_order AS item_sort_order
        FROM category_groups cg
        LEFT JOIN category_items ci ON ci.group_id = cg.id
        ORDER BY cg.sort_order ASC, ci.sort_order ASC
      `
    );

    const shopCardsResult = await pool.query(
      `
        SELECT
          id,
          title,
          image_url,
          href,
          sort_order
        FROM nav_shop_cards
        ORDER BY sort_order ASC
      `
    );

    const groupsMap = new Map();

    for (const row of categoryMenuResult.rows) {
      if (!groupsMap.has(row.group_id)) {
        groupsMap.set(row.group_id, {
          id: row.group_id,
          name: row.group_name,
          promoImageUrl: row.promo_image_url,
          items: []
        });
      }

      if (row.item_id) {
        groupsMap.get(row.group_id).items.push({
          id: row.item_id,
          name: row.item_name,
          href: row.href
        });
      }
    }

    response.json({
      groups: Array.from(groupsMap.values()),
      shopCards: shopCardsResult.rows.map((row) => ({
        id: row.id,
        title: row.title,
        image: row.image_url,
        href: row.href
      }))
    });
  } catch (error) {
    console.error("Failed to fetch category menu", error);
    response.status(500).json({
      message: "Failed to fetch category menu"
    });
  }
}

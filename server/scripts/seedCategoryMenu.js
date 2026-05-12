import dotenv from "dotenv";
import { pool } from "../src/config/db.js";

dotenv.config();

const menuGroups = [
  {
    name: "Women's Dress",
    sortOrder: 1,
    promoImageUrl: "/assets/hero/banner-img.webp",
    items: [
      "Women's Vintage Polka Dot Dress",
      "Women's 3/4-Sleeve Skater Dress",
      "Girls Frock Dress",
      "Girls Casual Dress",
      "Baby Girls Frocks Dress",
      "Baby Girl's Bodycon Midi Dress"
    ]
  },
  {
    name: "Women's Top",
    sortOrder: 2,
    promoImageUrl: "/assets/hero/banner-img.webp",
    items: [
      "Marie Lane Women Top",
      "Light Plan Simple Top",
      "Gold Brocade Shell Top",
      "Cream Printed Top",
      "Mustard Embroidered Top",
      "Off Black Culottes"
    ]
  },
  {
    name: "Women's Hats",
    sortOrder: 3,
    promoImageUrl: "/assets/hero/banner-img.webp",
    items: [
      "Unisex Cotton Hat",
      "Ribbon Style Beach Hat",
      "Kids Hat",
      "Kid's Caps",
      "Girl Kids Bow Striped Hat",
      "Cotton Hat"
    ]
  }
];

const shopCards = [
  {
    title: "Cloths",
    imageUrl: "/assets/workdo/vogue-main-banner1.webp",
    href: "#/collections/cloths",
    sortOrder: 1
  },
  {
    title: "Sweater",
    imageUrl: "/assets/workdo/vogue-main-banner2.webp",
    href: "#/collections/sweater",
    sortOrder: 2
  },
  {
    title: "Dress",
    imageUrl: "/assets/workdo/vogue-main-banner3.webp",
    href: "#/collections/dress",
    sortOrder: 3
  },
  {
    title: "westen top",
    imageUrl: "/assets/workdo/vogue-main-banner4.webp",
    href: "#/collections/westen-top",
    sortOrder: 4
  }
];

async function seedCategoryMenu() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS category_groups (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        promo_image_url TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS category_items (
        id BIGSERIAL PRIMARY KEY,
        group_id BIGINT NOT NULL REFERENCES category_groups(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        href TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS nav_shop_cards (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        href TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query("TRUNCATE TABLE category_items, category_groups, nav_shop_cards RESTART IDENTITY CASCADE");

    for (const group of menuGroups) {
      const groupResult = await client.query(
        `
          INSERT INTO category_groups (name, sort_order, promo_image_url)
          VALUES ($1, $2, $3)
          RETURNING id
        `,
        [group.name, group.sortOrder, group.promoImageUrl]
      );

      const groupId = groupResult.rows[0].id;

      for (const [index, item] of group.items.entries()) {
        const slug = item
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        await client.query(
          `
            INSERT INTO category_items (group_id, name, href, sort_order)
            VALUES ($1, $2, $3, $4)
          `,
          [groupId, item, `#/category/${slug}`, index + 1]
        );
      }
    }

    for (const card of shopCards) {
      await client.query(
        `
          INSERT INTO nav_shop_cards (title, image_url, href, sort_order)
          VALUES ($1, $2, $3, $4)
        `,
        [card.title, card.imageUrl, card.href, card.sortOrder]
      );
    }

    await client.query("COMMIT");
    console.log("Category menu seeded successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to seed category menu", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedCategoryMenu();

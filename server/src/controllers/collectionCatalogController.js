import { pool } from "../config/db.js";

async function ensureProductReviewsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id BIGSERIAL PRIMARY KEY,
      product_id BIGINT NOT NULL REFERENCES collection_products(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function buildProductDescription(product) {
  const option = `${product.option_label} ${product.option_value}`.trim();
  return `${product.brand} ${product.name} is a curated ${product.category_name.toLowerCase()} piece designed for versatile everyday styling. Crafted with attention to detail, it pairs statement appeal with wearable comfort. Key selection detail: ${option}.`;
}

function mapReviewRow(row) {
  return {
    id: row.id,
    rating: row.rating,
    title: row.title,
    content: row.content,
    displayName: row.display_name,
    createdAt: row.created_at
  };
}

function mapProductRow(row) {
  return {
    id: row.id,
    collectionSlug: row.collection_slug,
    brand: row.brand,
    name: row.name,
    category: row.category_name,
    price: row.price,
    oldPrice: row.old_price,
    optionLabel: row.option_label,
    optionValue: row.option_value,
    image: row.image_url,
    galleryImages: row.gallery_images?.length ? row.gallery_images : [row.image_url],
    attributeImages:
      row.attribute_images?.length
        ? row.attribute_images.map((item) => ({
            value: item.value,
            image: item.image || item.images?.[0] || row.image_url,
            images: item.images?.length ? item.images : [item.image || row.image_url]
          }))
        : [
            {
              value: row.option_value,
              image: row.image_url,
              images: row.gallery_images?.length ? row.gallery_images : [row.image_url]
            }
          ],
    inStock: row.in_stock,
    sku: `SKU-${String(row.id).padStart(6, "0")}`,
    description: buildProductDescription(row)
  };
}

export async function getCollectionBySlug(request, response) {
  try {
    const { slug } = request.params;

    const collectionResult = await pool.query(
      `
        SELECT
          card.id,
          card.slug,
          card.title,
          card.description,
          card.image_url,
          card.href,
          COUNT(product.id)::INTEGER AS item_count
        FROM nav_shop_cards card
        LEFT JOIN collection_products product ON product.collection_slug = card.slug
        WHERE card.slug = $1
        GROUP BY card.id
      `,
      [slug]
    );

    if (collectionResult.rowCount === 0) {
      return response.status(404).json({
        message: "Collection not found"
      });
    }

    const productsResult = await pool.query(
      `
        SELECT
          id,
          collection_slug,
          brand,
          name,
          category_name,
          price,
          old_price,
          option_label,
          option_value,
          image_url,
          gallery_images,
          attribute_images,
          in_stock,
          sort_order
        FROM collection_products
        WHERE collection_slug = $1
        ORDER BY sort_order ASC, id ASC
      `,
      [slug]
    );

    const collection = collectionResult.rows[0];

    return response.json({
      collection: {
        id: collection.id,
        slug: collection.slug,
        title: collection.title,
        description: collection.description,
        image: collection.image_url,
        href: collection.href,
        itemCount: collection.item_count
      },
      products: productsResult.rows.map(mapProductRow)
    });
  } catch (error) {
    console.error("Failed to fetch collection detail", error);
    return response.status(500).json({
      message: "Failed to fetch collection detail"
    });
  }
}

export async function getCollectionProductDetail(request, response) {
  try {
    await ensureProductReviewsTable();

    const { slug, productId } = request.params;

    const productResult = await pool.query(
      `
        SELECT
          product.id,
          product.collection_slug,
          product.brand,
          product.name,
          product.category_name,
          product.price,
          product.old_price,
          product.option_label,
          product.option_value,
          product.image_url,
          product.gallery_images,
          product.attribute_images,
          product.in_stock,
          product.sort_order,
          card.title AS collection_title,
          card.description AS collection_description
        FROM collection_products product
        INNER JOIN nav_shop_cards card ON card.slug = product.collection_slug
        WHERE product.collection_slug = $1 AND product.id = $2
      `,
      [slug, productId]
    );

    if (productResult.rowCount === 0) {
      return response.status(404).json({
        message: "Product not found"
      });
    }

    const relatedResult = await pool.query(
      `
        SELECT
          id,
          collection_slug,
          brand,
          name,
          category_name,
          price,
          old_price,
          option_label,
          option_value,
          image_url,
          gallery_images,
          attribute_images,
          in_stock,
          sort_order
        FROM collection_products
        WHERE collection_slug = $1 AND id <> $2
        ORDER BY sort_order ASC, id ASC
        LIMIT 6
      `,
      [slug, productId]
    );

    const recentResult = await pool.query(
      `
        SELECT
          id,
          collection_slug,
          brand,
          name,
          category_name,
          price,
          old_price,
          option_label,
          option_value,
          image_url,
          gallery_images,
          attribute_images,
          in_stock,
          sort_order
        FROM collection_products
        WHERE collection_slug = $1 AND id <> $2
        ORDER BY sort_order ASC, id ASC
        LIMIT 3
      `,
      [slug, productId]
    );

    const reviewsResult = await pool.query(
      `
        SELECT id, rating, title, content, display_name, created_at
        FROM product_reviews
        WHERE product_id = $1
        ORDER BY created_at DESC, id DESC
      `,
      [productId]
    );

    const productRow = productResult.rows[0];
    const reviewRows = reviewsResult.rows.map(mapReviewRow);
    const reviewCount = reviewRows.length;
    const averageRating = reviewCount
      ? Number((reviewRows.reduce((sum, item) => sum + item.rating, 0) / reviewCount).toFixed(1))
      : 0;

    return response.json({
      collection: {
        slug,
        title: productRow.collection_title,
        description: productRow.collection_description
      },
      product: mapProductRow(productRow),
      reviews: reviewRows,
      reviewSummary: {
        averageRating,
        reviewCount
      },
      relatedProducts: relatedResult.rows.map(mapProductRow),
      recentProducts: recentResult.rows.map(mapProductRow)
    });
  } catch (error) {
    console.error("Failed to fetch collection product detail", error);
    return response.status(500).json({
      message: "Failed to fetch collection product detail"
    });
  }
}

export async function createCollectionProductReview(request, response) {
  try {
    await ensureProductReviewsTable();

    const { slug, productId } = request.params;
    const { rating, title, content, displayName, email } = request.body ?? {};

    const numericRating = Number(rating);
    const normalizedTitle = String(title ?? "").trim();
    const normalizedContent = String(content ?? "").trim();
    const normalizedDisplayName = String(displayName ?? "").trim();
    const normalizedEmail = String(email ?? "").trim();

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5 ||
      !normalizedTitle ||
      !normalizedContent ||
      !normalizedDisplayName ||
      !normalizedEmail
    ) {
      return response.status(400).json({
        message: "Please provide rating, title, review content, display name, and email."
      });
    }

    const productResult = await pool.query(
      `
        SELECT id
        FROM collection_products
        WHERE collection_slug = $1 AND id = $2
      `,
      [slug, productId]
    );

    if (productResult.rowCount === 0) {
      return response.status(404).json({
        message: "Product not found"
      });
    }

    const insertResult = await pool.query(
      `
        INSERT INTO product_reviews (product_id, rating, title, content, display_name, email)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, rating, title, content, display_name, created_at
      `,
      [productId, numericRating, normalizedTitle, normalizedContent, normalizedDisplayName, normalizedEmail]
    );

    const summaryResult = await pool.query(
      `
        SELECT COUNT(*)::INTEGER AS review_count, COALESCE(AVG(rating), 0)::NUMERIC(3,1) AS average_rating
        FROM product_reviews
        WHERE product_id = $1
      `,
      [productId]
    );

    return response.status(201).json({
      review: mapReviewRow(insertResult.rows[0]),
      reviewSummary: {
        reviewCount: summaryResult.rows[0].review_count,
        averageRating: Number(summaryResult.rows[0].average_rating)
      }
    });
  } catch (error) {
    console.error("Failed to create product review", error);
    return response.status(500).json({
      message: "Failed to create product review"
    });
  }
}

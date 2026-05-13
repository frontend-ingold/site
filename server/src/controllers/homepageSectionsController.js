import { pool } from "../config/db.js";

function mapProduct(row) {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    category: row.category_name,
    price: row.price,
    oldPrice: row.old_price,
    optionLabel: row.option_label,
    optionValue: row.option_value,
    image: row.image_url,
    buttonLabel: row.in_stock ? "ADD TO CART" : "SOLD OUT",
    inStock: row.in_stock,
    collectionSlug: row.collection_slug
  };
}

function buildDefaultSections() {
  return {
    newArrivalShowcase: {
      feature: {
        title: "New Arrival Famous Brand Just For",
        description: "",
        buttonLabel: "SHOP NOW",
        image: "/assets/hero/custom-banner.webp"
      },
      tabs: [
        {
          label: "DRESS",
          slug: "dress",
          description: "",
          image: "/assets/hero/bestseller-bg.webp"
        },
        {
          label: "SWEATER",
          slug: "sweater",
          description: "",
          image: "/assets/hero/bestseller-bg.webp"
        },
        {
          label: "WOMEN TOPS",
          slug: "women-top",
          description: "",
          image: "/assets/hero/bestseller-bg.webp"
        }
      ],
      title: "Fashion That Reflects Who You Are",
      description: "",
      sideImage: "/assets/hero/bestseller-bg.webp",
      products: []
    },
    featuredProducts: [],
    editorialBanner: {
      title: "The World is Your Fashion Oyster",
      description: "",
      backgroundImage: "",
      products: []
    }
  };
}

export async function getHomepageSections(_request, response) {
  try {
    const sectionConfigsResult = await pool.query(
      `
        SELECT
          section_key,
          title,
          description,
          feature_title,
          feature_description,
          feature_button_label,
          feature_image_url,
          side_image_url,
          tab_slugs
        FROM homepage_section_configs
      `
    );

    const cardsResult = await pool.query(
      `
        SELECT slug, title, description, image_url, sort_order
        FROM nav_shop_cards
        ORDER BY sort_order ASC, id ASC
      `
    );

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
          in_stock,
          sort_order
        FROM collection_products
        ORDER BY sort_order ASC, id ASC
      `
    );

    const cards = cardsResult.rows;
    const products = productsResult.rows.map(mapProduct);
    const sectionConfigs = new Map(sectionConfigsResult.rows.map((row) => [row.section_key, row]));

    if (!cards.length || !products.length) {
      return response.json(buildDefaultSections());
    }

    const productsByCollection = new Map();
    for (const product of products) {
      if (!productsByCollection.has(product.collectionSlug)) {
        productsByCollection.set(product.collectionSlug, []);
      }

      productsByCollection.get(product.collectionSlug).push(product);
    }

    const newArrivalConfig = sectionConfigs.get("new-arrival-showcase");
    const editorialConfig = sectionConfigs.get("editorial-banner");
    const desiredArrivalSlugs = newArrivalConfig?.tab_slugs?.length ? newArrivalConfig.tab_slugs : ["dress", "sweater", "women-top"];
    const arrivalCards = desiredArrivalSlugs
      .map((slug) => cards.find((card) => card.slug === slug))
      .filter(Boolean);
    const arrivalProducts = arrivalCards.flatMap((card) => (productsByCollection.get(card.slug) ?? []).slice(0, 4));
    const featureCard = arrivalCards[0] ?? cards[0];
    const sideCard = arrivalCards[1] ?? cards[1] ?? featureCard;
    const editorialCard = cards.find((card) => card.slug === "collections") ?? cards[2] ?? featureCard;
    const editorialProducts = (productsByCollection.get(editorialCard.slug) ?? products).slice(0, 2);

    return response.json({
      newArrivalShowcase: {
        feature: {
          title: newArrivalConfig?.feature_title || `New Arrival ${featureCard.title}`,
          description: newArrivalConfig?.feature_description || featureCard.description,
          buttonLabel: newArrivalConfig?.feature_button_label || "SHOP NOW",
          image: newArrivalConfig?.feature_image_url || "/assets/hero/custom-banner.webp"
        },
        tabs: arrivalCards.map((card) => ({
          label: card.slug === "women-top" ? "WOMEN TOPS" : card.title.toUpperCase(),
          slug: card.slug,
          description: card.description,
          image: newArrivalConfig?.side_image_url || "/assets/hero/bestseller-bg.webp"
        })),
        title: newArrivalConfig?.title || "Fashion That Reflects Who You Are",
        description: newArrivalConfig?.description || arrivalCards[0]?.description || sideCard.description,
        sideImage: newArrivalConfig?.side_image_url || "/assets/hero/bestseller-bg.webp",
        products: arrivalProducts
      },
      featuredProducts: products.slice(0, 4),
      editorialBanner: {
        title: editorialConfig?.title || "The World is Your Fashion Oyster",
        description: editorialConfig?.description || editorialCard.description,
        backgroundImage: editorialConfig?.side_image_url || editorialCard.image_url,
        products: editorialProducts
      }
    });
  } catch (error) {
    console.error("Failed to fetch homepage sections", error);
    return response.status(500).json({
      message: "Failed to fetch homepage sections"
    });
  }
}

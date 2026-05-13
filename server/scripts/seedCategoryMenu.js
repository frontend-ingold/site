import dotenv from "dotenv";
import { pool } from "../src/config/db.js";

dotenv.config();

const menuGroups = [
  {
    name: "Women's Dress",
    sortOrder: 1,
    promoImageUrl: "https://images.pexels.com/photos/8387127/pexels-photo-8387127.jpeg?cs=srgb&dl=pexels-ron-lach-8387127.jpg&fm=jpg",
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
    promoImageUrl: "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg",
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
    promoImageUrl: "https://images.pexels.com/photos/5699098/pexels-photo-5699098.jpeg?cs=srgb&dl=pexels-rdne-stock-project-5699098.jpg&fm=jpg",
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

function getMenuGroupCollectionSlug(groupName) {
  if (groupName === "Women's Dress") {
    return "dress";
  }

  if (groupName === "Women's Top") {
    return "women-top";
  }

  if (groupName === "Women's Hats") {
    return "hats";
  }

  return "collections";
}

const collectionCards = [
  {
    slug: "cloths",
    title: "Cloths",
    imageUrl: "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg",
    href: "#/collections/cloths",
    description:
      "Clothing serves many purposes: it can serve as protection from the elements, rough surfaces, sharp stones, rash-causing plants, and insect bites, by providing a barrier between the skin and the environment. Clothing can insulate against cold or hot conditions, and it can provide a hygienic barrier."
  },
  {
    slug: "collections",
    title: "Collections",
    imageUrl: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?cs=srgb&dl=pexels-godisable-jacob-226636-994523.jpg&fm=jpg",
    href: "#/collections/collections",
    description:
      "A broad edit of standout styles across seasonal layers, dresses, accessories, and everyday staples. This collection brings together the best sellers and fresh arrivals in one curated destination."
  },
  {
    slug: "dress",
    title: "Dress",
    imageUrl: "https://images.pexels.com/photos/8387127/pexels-photo-8387127.jpeg?cs=srgb&dl=pexels-ron-lach-8387127.jpg&fm=jpg",
    href: "#/collections/dress",
    description:
      "Discover day dresses, occasion silhouettes, and versatile pieces with elegant drape, flattering cuts, and easy styling for everyday wardrobes."
  },
  {
    slug: "hats",
    title: "Hats",
    imageUrl: "https://images.pexels.com/photos/5699098/pexels-photo-5699098.jpeg?cs=srgb&dl=pexels-rdne-stock-project-5699098.jpg&fm=jpg",
    href: "#/collections/hats",
    description:
      "From structured caps to resort-ready straw hats, this edit covers warm-weather staples and statement toppers with texture, shape, and sun coverage."
  },
  {
    slug: "jeans",
    title: "Jeans",
    imageUrl: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?cs=srgb&dl=pexels-micaasato-1598505.jpg&fm=jpg",
    href: "#/collections/jeans",
    description:
      "Updated denim fits with straight legs, wide hems, vintage washes, and clean tailoring to anchor casual outfits through every season."
  },
  {
    slug: "shoes",
    title: "Shoes",
    imageUrl: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?cs=srgb&dl=pexels-melvin-buezo-2529148.jpg&fm=jpg",
    href: "#/collections/shoes",
    description:
      "A versatile footwear mix of sneakers, heels, loafers, and courts selected for comfort, polish, and wearability from weekday to weekend."
  },
  {
    slug: "sweater",
    title: "Sweater",
    imageUrl: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?cs=srgb&dl=pexels-mikhail-nilov-7679720.jpg&fm=jpg",
    href: "#/collections/sweater",
    description:
      "Soft knits and elevated pullovers with refined ribbing, tactile yarns, and modern proportions for layering through cooler weather."
  },
  {
    slug: "westen-top",
    title: "Westen Top",
    imageUrl: "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg",
    href: "#/collections/westen-top",
    description:
      "A polished top edit featuring satin, embroidery, and crisp cotton shapes that lift denim, tailoring, and occasion separates alike."
  },
  {
    slug: "women-top",
    title: "Women Top",
    imageUrl: "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg",
    href: "#/collections/women-top",
    description:
      "Browse essential and statement tops with easy fits, vibrant tones, soft fabrics, and updated silhouettes for daily styling."
  }
];

const categoryShowcaseCategories = [
  { name: "Westen Top", slug: "westen-top", sortOrder: 1 },
  { name: "Jeans", slug: "jeans", sortOrder: 2 },
  { name: "Shoes", slug: "shoes", sortOrder: 3 },
  { name: "Hats", slug: "hats", sortOrder: 4 }
];

const categoryShowcaseProducts = [
  {
    categorySlug: "westen-top",
    brand: "MANGO",
    name: "SATIN UTILITY SHIRT",
    categoryName: "westen top",
    price: "$49.99",
    oldPrice: "$69.99",
    optionLabel: "COLOR:",
    optionValue: "Ivory",
    imageUrl: "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg",
    sortOrder: 1
  },
  {
    categorySlug: "westen-top",
    brand: "H&M",
    name: "EMBROIDERED PEPLUM BLOUSE",
    categoryName: "westen top",
    price: "$39.99",
    oldPrice: "$54.99",
    optionLabel: "COLOR:",
    optionValue: "Cream",
    imageUrl: "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg",
    sortOrder: 2
  },
  {
    categorySlug: "westen-top",
    brand: "ZARA",
    name: "RIBBED KNIT CROP TOP",
    categoryName: "westen top",
    price: "$29.90",
    oldPrice: "",
    optionLabel: "SIZE:",
    optionValue: "Medium",
    imageUrl: "https://images.pexels.com/photos/9594678/pexels-photo-9594678.jpeg?cs=srgb&dl=pexels-ron-lach-9594678.jpg&fm=jpg",
    sortOrder: 3
  },
  {
    categorySlug: "westen-top",
    brand: "COS",
    name: "OVERSIZED POPLIN BLOUSE",
    categoryName: "westen top",
    price: "$59.00",
    oldPrice: "$79.00",
    optionLabel: "COLOR:",
    optionValue: "White",
    imageUrl: "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg",
    sortOrder: 4
  },
  {
    categorySlug: "jeans",
    brand: "LEVI'S",
    name: "RIBCAGE STRAIGHT ANKLE JEANS",
    categoryName: "Jeans",
    price: "$98.00",
    oldPrice: "$118.00",
    optionLabel: "WASH:",
    optionValue: "Mid Blue",
    imageUrl: "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?cs=srgb&dl=pexels-marina-abrosimova-1082528.jpg&fm=jpg",
    sortOrder: 1
  },
  {
    categorySlug: "jeans",
    brand: "WRANGLER",
    name: "HIGH RISE BOOTCUT JEANS",
    categoryName: "Jeans",
    price: "$74.00",
    oldPrice: "$92.00",
    optionLabel: "FIT:",
    optionValue: "Bootcut",
    imageUrl: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311392.jpg&fm=jpg",
    sortOrder: 2
  },
  {
    categorySlug: "jeans",
    brand: "LEE",
    name: "RELAXED WIDE LEG DENIM",
    categoryName: "Jeans",
    price: "$68.00",
    oldPrice: "",
    optionLabel: "SIZE:",
    optionValue: "28",
    imageUrl: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?cs=srgb&dl=pexels-micaasato-1598505.jpg&fm=jpg",
    sortOrder: 3
  },
  {
    categorySlug: "jeans",
    brand: "AGOLDE",
    name: "90'S PINCH WAIST JEAN",
    categoryName: "Jeans",
    price: "$128.00",
    oldPrice: "$148.00",
    optionLabel: "WASH:",
    optionValue: "Vintage Blue",
    imageUrl: "https://images.pexels.com/photos/4210860/pexels-photo-4210860.jpeg?cs=srgb&dl=pexels-mart-production-4210860.jpg&fm=jpg",
    sortOrder: 4
  },
  {
    categorySlug: "shoes",
    brand: "ADIDAS",
    name: "GRAND COURT 2.0 SNEAKERS",
    categoryName: "Shoes",
    price: "$75.00",
    oldPrice: "$90.00",
    optionLabel: "COLOR:",
    optionValue: "White",
    imageUrl: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpg?cs=srgb&dl=pexels-melvin-buezo-2529148.jpg&fm=jpg",
    sortOrder: 1
  },
  {
    categorySlug: "shoes",
    brand: "ALDO",
    name: "STESSY HEELED PUMPS",
    categoryName: "Shoes",
    price: "$110.00",
    oldPrice: "$135.00",
    optionLabel: "HEEL:",
    optionValue: "8 cm",
    imageUrl: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?cs=srgb&dl=pexels-jonathanborba-1456706.jpg&fm=jpg",
    sortOrder: 2
  },
  {
    categorySlug: "shoes",
    brand: "CLARKS",
    name: "SHEER55 COURT SHOES",
    categoryName: "Shoes",
    price: "$120.00",
    oldPrice: "",
    optionLabel: "SIZE:",
    optionValue: "39",
    imageUrl: "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?cs=srgb&dl=pexels-pixabay-267301.jpg&fm=jpg",
    sortOrder: 3
  },
  {
    categorySlug: "shoes",
    brand: "NIKE",
    name: "AIR MAX PULSE",
    categoryName: "Shoes",
    price: "$150.00",
    oldPrice: "$175.00",
    optionLabel: "COLOR:",
    optionValue: "Sand",
    imageUrl: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?cs=srgb&dl=pexels-micaasato-1598508.jpg&fm=jpg",
    sortOrder: 4
  },
  {
    categorySlug: "hats",
    brand: "BRIXTON",
    name: "JOANNA STRAW HAT",
    categoryName: "Hats",
    price: "$69.00",
    oldPrice: "$85.00",
    optionLabel: "COLOR:",
    optionValue: "Natural",
    imageUrl: "https://images.pexels.com/photos/5699098/pexels-photo-5699098.jpeg?cs=srgb&dl=pexels-rdne-stock-project-5699098.jpg&fm=jpg",
    sortOrder: 1
  },
  {
    categorySlug: "hats",
    brand: "KANGOL",
    name: "WASHED BUCKET HAT",
    categoryName: "Hats",
    price: "$45.00",
    oldPrice: "$58.00",
    optionLabel: "COLOR:",
    optionValue: "Black",
    imageUrl: "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?cs=srgb&dl=pexels-cottonbro-984619.jpg&fm=jpg",
    sortOrder: 2
  },
  {
    categorySlug: "hats",
    brand: "LACK OF COLOR",
    name: "THE INCA BUCKET",
    categoryName: "Hats",
    price: "$79.00",
    oldPrice: "",
    optionLabel: "SIZE:",
    optionValue: "M/L",
    imageUrl: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?cs=srgb&dl=pexels-vinta-supply-co-nyc-1124465.jpg&fm=jpg",
    sortOrder: 3
  },
  {
    categorySlug: "hats",
    brand: "GUCCI",
    name: "GG CANVAS BASEBALL HAT",
    categoryName: "Hats",
    price: "$420.00",
    oldPrice: "",
    optionLabel: "SIZE:",
    optionValue: "M",
    imageUrl: "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?cs=srgb&dl=pexels-cottonbro-984619.jpg&fm=jpg",
    sortOrder: 4
  }
];

const homepageSectionConfigs = [
  {
    sectionKey: "new-arrival-showcase",
    title: "Fashion That Reflects Who You Are",
    description:
      "Everything that is considered fashion is available and popularized by the fashion system. Given the rise in mass production of commodities and clothing at lower prices and global reach.",
    featureTitle: "New Arrival Clothes Just For",
    featureDescription:
      "These are just a few of the many trends that are popular for women's fashion in 2023. The best way to find what's trending is to experiment and find what works best for you.",
    featureButtonLabel: "SHOP NOW",
    featureImageUrl: "/assets/hero/custom-banner.webp",
    sideImageUrl: "/assets/hero/bestseller-bg.webp",
    tabSlugs: ["dress", "sweater", "women-top"]
  },
  {
    sectionKey: "editorial-banner",
    title: "The World is Your Fashion Oyster",
    description:
      "The French word mode, meaning fashion, dates as far back as 1482, while the English word denoting something in style dates only to the 16th century.",
    featureTitle: "",
    featureDescription: "",
    featureButtonLabel: "",
    featureImageUrl: "",
    sideImageUrl: "/assets/hero/section-banner.webp",
    tabSlugs: []
  }
];

function product(
  brand,
  name,
  category,
  price,
  oldPrice,
  optionLabel,
  optionValue,
  imageUrl,
  inStock = true,
  galleryImages = [],
  attributeImages = []
) {
  return { brand, name, category, price, oldPrice, optionLabel, optionValue, imageUrl, inStock, galleryImages, attributeImages };
}

function expandCollectionProducts(definitions) {
  return definitions.map((entry, index) => ({
    ...entry,
    sortOrder: index + 1
  }));
}

function attachGalleryImagesToCollectionProducts(collectionMap) {
  for (const products of Object.values(collectionMap)) {
    const imagePool = Array.from(new Set(products.map((item) => item.imageUrl)));

    products.forEach((productItem, index) => {
      const galleryImages = [productItem.imageUrl];
      let offset = 1;

      while (galleryImages.length < Math.min(5, imagePool.length) && offset <= imagePool.length) {
        const candidate = products[(index + offset) % products.length]?.imageUrl;
        if (candidate && !galleryImages.includes(candidate)) {
          galleryImages.push(candidate);
        }
        offset += 1;
      }

      productItem.galleryImages = galleryImages;
    });
  }
}

function attachAttributeImagesToCollectionProducts(collectionMap) {
  for (const products of Object.values(collectionMap)) {
    products.forEach((productItem) => {
      const sameAttributeProducts = products.filter(
        (candidate) =>
          candidate !== productItem &&
          String(candidate.optionLabel).trim().toLowerCase() === String(productItem.optionLabel).trim().toLowerCase()
      );

      const attributeImages = [
        {
          value: productItem.optionValue,
          image: productItem.imageUrl,
          images: productItem.galleryImages?.length ? productItem.galleryImages : [productItem.imageUrl]
        }
      ];

      for (const candidate of sameAttributeProducts) {
        if (attributeImages.length >= 4) {
          break;
        }

        if (attributeImages.some((entry) => entry.value === candidate.optionValue)) {
          continue;
        }

        attributeImages.push({
          value: candidate.optionValue,
          image: candidate.imageUrl,
          images: candidate.galleryImages?.length ? candidate.galleryImages : [candidate.imageUrl]
        });
      }

      productItem.attributeImages = attributeImages;
    });
  }
}

const collectionProducts = {
  cloths: expandCollectionProducts([
    product("RACIOUSE", "WOMEN'S COTTON OVERSHIRT", "Shirt", "$52.00", "$68.00", "COLOR:", "Ivory", "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg"),
    product("MANGO", "RELAXED STRIPED BLOUSE", "Blouse", "$46.00", "", "SIZE:", "M", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg"),
    product("ZARA", "SOFT TAILORED WAISTCOAT", "Vest", "$58.00", "$74.00", "COLOR:", "Taupe", "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311392.jpg&fm=jpg"),
    product("COS", "CLEAN DRAPE POPLIN SHIRT", "Shirt", "$64.00", "", "SIZE:", "L", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg", false)
  ]),
  dress: expandCollectionProducts([
    product("HOPSCOTCH", "WOMEN'S VINTAGE POLKA DOT DRESS", "Dress", "$72.00", "$94.00", "COLOR:", "Rust", "https://images.pexels.com/photos/8387127/pexels-photo-8387127.jpeg?cs=srgb&dl=pexels-ron-lach-8387127.jpg&fm=jpg"),
    product("RACIOUSE", "WOMEN'S 3/4-SLEEVE SKATER DRESS", "Dress", "$81.00", "", "SIZE:", "M", "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?cs=srgb&dl=pexels-godisable-jacob-226636-994523.jpg&fm=jpg"),
    product("ONLY", "GIRLS FROCK DRESS", "Dress", "$63.00", "$79.00", "COLOR:", "Black", "https://images.pexels.com/photos/7691126/pexels-photo-7691126.jpeg?cs=srgb&dl=pexels-rodnae-productions-7691126.jpg&fm=jpg"),
    product("MANGO", "GIRLS CASUAL DRESS", "Dress", "$89.00", "", "SIZE:", "S", "https://images.pexels.com/photos/6764048/pexels-photo-6764048.jpeg?cs=srgb&dl=pexels-mart-production-6764048.jpg&fm=jpg"),
    product("VERO MODA", "BABY GIRLS FROCKS DRESS", "Dress", "$68.00", "$84.00", "COLOR:", "Olive", "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?cs=srgb&dl=pexels-mikhail-nilov-7679720.jpg&fm=jpg"),
    product("ZARA", "BABY GIRL'S BODYCON MIDI DRESS", "Dress", "$74.00", "", "SIZE:", "L", "https://images.pexels.com/photos/6311605/pexels-photo-6311605.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311605.jpg&fm=jpg", false)
  ]),
  hats: expandCollectionProducts([
    product("BRIXTON", "UNISEX COTTON HAT", "Hat", "$69.00", "$85.00", "COLOR:", "Natural", "https://images.pexels.com/photos/5699098/pexels-photo-5699098.jpeg?cs=srgb&dl=pexels-rdne-stock-project-5699098.jpg&fm=jpg"),
    product("KANGOL", "RIBBON STYLE BEACH HAT", "Hat", "$45.00", "$58.00", "COLOR:", "Black", "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?cs=srgb&dl=pexels-cottonbro-984619.jpg&fm=jpg"),
    product("LACK OF COLOR", "KIDS HAT", "Hat", "$79.00", "", "SIZE:", "M/L", "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?cs=srgb&dl=pexels-vinta-supply-co-nyc-1124465.jpg&fm=jpg"),
    product("GUCCI", "KID'S CAPS", "Hat", "$420.00", "", "SIZE:", "M", "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?cs=srgb&dl=pexels-marcelo-chagas-246147-2294342.jpg&fm=jpg"),
    product("J.CREW", "GIRL KIDS BOW STRIPED HAT", "Hat", "$36.00", "$44.00", "COLOR:", "Stone", "https://images.pexels.com/photos/3889978/pexels-photo-3889978.jpeg?cs=srgb&dl=pexels-jessica-mangano-3889978.jpg&fm=jpg"),
    product("LULULEMON", "COTTON HAT", "Hat", "$39.00", "", "COLOR:", "Cream", "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg", false)
  ]),
  jeans: expandCollectionProducts([
    product("LEVI'S", "RIBCAGE STRAIGHT ANKLE JEANS", "Jeans", "$98.00", "$118.00", "WASH:", "Mid Blue", "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?cs=srgb&dl=pexels-marina-abrosimova-1082528.jpg&fm=jpg"),
    product("WRANGLER", "HIGH RISE BOOTCUT JEANS", "Jeans", "$74.00", "$92.00", "FIT:", "Bootcut", "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311392.jpg&fm=jpg"),
    product("LEE", "RELAXED WIDE LEG DENIM", "Jeans", "$68.00", "", "SIZE:", "28", "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?cs=srgb&dl=pexels-micaasato-1598505.jpg&fm=jpg"),
    product("AGOLDE", "90'S PINCH WAIST JEAN", "Jeans", "$128.00", "$148.00", "WASH:", "Vintage Blue", "https://images.pexels.com/photos/4210860/pexels-photo-4210860.jpeg?cs=srgb&dl=pexels-mart-production-4210860.jpg&fm=jpg")
  ]),
  shoes: expandCollectionProducts([
    product("ADIDAS", "GRAND COURT 2.0 SNEAKERS", "Shoes", "$75.00", "$90.00", "COLOR:", "White", "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpg?cs=srgb&dl=pexels-melvin-buezo-2529148.jpg&fm=jpg"),
    product("ALDO", "STESSY HEELED PUMPS", "Shoes", "$110.00", "$135.00", "HEEL:", "8 cm", "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?cs=srgb&dl=pexels-jonathanborba-1456706.jpg&fm=jpg"),
    product("CLARKS", "SHEER55 COURT SHOES", "Shoes", "$120.00", "", "SIZE:", "39", "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?cs=srgb&dl=pexels-pixabay-267301.jpg&fm=jpg"),
    product("NIKE", "AIR MAX PULSE", "Shoes", "$150.00", "$175.00", "COLOR:", "Sand", "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?cs=srgb&dl=pexels-micaasato-1598508.jpg&fm=jpg", false)
  ]),
  sweater: expandCollectionProducts([
    product("UNIQLO", "SOFT TOUCH CREW SWEATER", "Sweater", "$42.00", "", "COLOR:", "Mint", "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?cs=srgb&dl=pexels-mikhail-nilov-7679720.jpg&fm=jpg"),
    product("COS", "RIBBED WOOL BLEND KNIT", "Sweater", "$86.00", "$108.00", "SIZE:", "M", "https://images.pexels.com/photos/9558601/pexels-photo-9558601.jpeg?cs=srgb&dl=pexels-ron-lach-9558601.jpg&fm=jpg"),
    product("H&M", "CROPPED MOCK NECK SWEATER", "Sweater", "$39.00", "$52.00", "COLOR:", "Cream", "https://images.pexels.com/photos/6765018/pexels-photo-6765018.jpeg?cs=srgb&dl=pexels-mart-production-6765018.jpg&fm=jpg"),
    product("MANGO", "TEXTURED CABLE KNIT", "Sweater", "$58.00", "", "SIZE:", "S", "https://images.pexels.com/photos/7821112/pexels-photo-7821112.jpeg?cs=srgb&dl=pexels-anna-shvets-7821112.jpg&fm=jpg"),
    product("ARKET", "MERINO HALF ZIP PULLOVER", "Sweater", "$94.00", "$118.00", "COLOR:", "Taupe", "https://images.pexels.com/photos/6311399/pexels-photo-6311399.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311399.jpg&fm=jpg", false)
  ]),
  "westen-top": expandCollectionProducts([
    product("MANGO", "SATIN UTILITY SHIRT", "Westen Top", "$49.99", "$69.99", "COLOR:", "Ivory", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg"),
    product("H&M", "EMBROIDERED PEPLUM BLOUSE", "Westen Top", "$39.99", "$54.99", "COLOR:", "Cream", "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg"),
    product("ZARA", "RIBBED KNIT CROP TOP", "Westen Top", "$29.90", "", "SIZE:", "Medium", "https://images.pexels.com/photos/9594678/pexels-photo-9594678.jpeg?cs=srgb&dl=pexels-ron-lach-9594678.jpg&fm=jpg"),
    product("COS", "OVERSIZED POPLIN BLOUSE", "Westen Top", "$59.00", "$79.00", "COLOR:", "White", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg")
  ]),
  "women-top": expandCollectionProducts([
    product("MARIE LANE", "MARIE LANE WOMEN TOP", "Women Top", "$34.00", "$48.00", "COLOR:", "Brick", "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?cs=srgb&dl=pexels-godisable-jacob-226636-994523.jpg&fm=jpg"),
    product("ONLY", "LIGHT PLAN SIMPLE TOP", "Women Top", "$29.00", "", "SIZE:", "S", "https://images.pexels.com/photos/6311605/pexels-photo-6311605.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311605.jpg&fm=jpg"),
    product("RAREISM", "GOLD BROCADE SHELL TOP", "Women Top", "$61.00", "$75.00", "COLOR:", "Gold", "https://images.pexels.com/photos/6764048/pexels-photo-6764048.jpeg?cs=srgb&dl=pexels-mart-production-6764048.jpg&fm=jpg"),
    product("MANGO", "CREAM PRINTED TOP", "Women Top", "$37.00", "", "SIZE:", "M", "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg"),
    product("BIBA", "MUSTARD EMBROIDERED TOP", "Women Top", "$44.00", "$56.00", "COLOR:", "Mustard", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg"),
    product("ENAMOR", "OFF BLACK CULOTTES", "Women Top", "$41.00", "", "SIZE:", "L", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg", false)
  ])
};

const collectionsMegaProducts = [
  ["ZARA", "OVERSIZED POPLIN BLOUSE", "Top", "$59.00", "$79.00", "COLOR:", "White", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg"],
  ["MANGO", "SATIN UTILITY SHIRT", "Top", "$49.99", "$69.99", "COLOR:", "Ivory", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg"],
  ["HOPSCOTCH", "WOMEN'S VINTAGE MIDI DRESS", "Dress", "$72.00", "$94.00", "COLOR:", "Rust", "https://images.pexels.com/photos/8387127/pexels-photo-8387127.jpeg?cs=srgb&dl=pexels-ron-lach-8387127.jpg&fm=jpg"],
  ["LEVI'S", "RIBCAGE STRAIGHT ANKLE JEANS", "Jeans", "$98.00", "$118.00", "WASH:", "Mid Blue", "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?cs=srgb&dl=pexels-marina-abrosimova-1082528.jpg&fm=jpg"],
  ["ADIDAS", "GRAND COURT 2.0 SNEAKERS", "Shoes", "$75.00", "$90.00", "COLOR:", "White", "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpg?cs=srgb&dl=pexels-melvin-buezo-2529148.jpg&fm=jpg"],
  ["BRIXTON", "JOANNA STRAW HAT", "Hat", "$69.00", "$85.00", "COLOR:", "Natural", "https://images.pexels.com/photos/5699098/pexels-photo-5699098.jpeg?cs=srgb&dl=pexels-rdne-stock-project-5699098.jpg&fm=jpg"],
  ["UNIQLO", "SOFT TOUCH CREW SWEATER", "Sweater", "$42.00", "", "COLOR:", "Mint", "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?cs=srgb&dl=pexels-mikhail-nilov-7679720.jpg&fm=jpg"],
  ["ONLY", "LIGHT PLAN SIMPLE TOP", "Women Top", "$29.00", "", "SIZE:", "S", "https://images.pexels.com/photos/6311605/pexels-photo-6311605.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311605.jpg&fm=jpg"],
  ["COS", "RIBBED WOOL BLEND KNIT", "Sweater", "$86.00", "$108.00", "SIZE:", "M", "https://images.pexels.com/photos/9558601/pexels-photo-9558601.jpeg?cs=srgb&dl=pexels-ron-lach-9558601.jpg&fm=jpg"],
  ["VERO MODA", "BUTTON FRONT SHIRT DRESS", "Dress", "$68.00", "$84.00", "COLOR:", "Olive", "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?cs=srgb&dl=pexels-mikhail-nilov-7679720.jpg&fm=jpg"],
  ["ARKET", "MERINO HALF ZIP PULLOVER", "Sweater", "$94.00", "$118.00", "COLOR:", "Taupe", "https://images.pexels.com/photos/6311399/pexels-photo-6311399.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311399.jpg&fm=jpg"],
  ["ALDO", "STESSY HEELED PUMPS", "Shoes", "$110.00", "$135.00", "HEEL:", "8 cm", "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?cs=srgb&dl=pexels-jonathanborba-1456706.jpg&fm=jpg"],
  ["RAREISM", "GOLD BROCADE SHELL TOP", "Women Top", "$61.00", "$75.00", "COLOR:", "Gold", "https://images.pexels.com/photos/6764048/pexels-photo-6764048.jpeg?cs=srgb&dl=pexels-mart-production-6764048.jpg&fm=jpg"],
  ["J.CREW", "COTTON TWILL SUN CAP", "Hat", "$36.00", "$44.00", "COLOR:", "Stone", "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?cs=srgb&dl=pexels-marcelo-chagas-246147-2294342.jpg&fm=jpg"],
  ["MANGO", "RELAXED STRIPED BLOUSE", "Blouse", "$46.00", "", "SIZE:", "M", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg"],
  ["NIKE", "AIR MAX PULSE", "Shoes", "$150.00", "$175.00", "COLOR:", "Sand", "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?cs=srgb&dl=pexels-micaasato-1598508.jpg&fm=jpg"],
  ["BIBA", "MUSTARD EMBROIDERED TOP", "Women Top", "$44.00", "$56.00", "COLOR:", "Mustard", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg"],
  ["GUCCI", "GG CANVAS BASEBALL HAT", "Hat", "$420.00", "", "SIZE:", "M", "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?cs=srgb&dl=pexels-cottonbro-984619.jpg&fm=jpg"],
  ["ZARA", "RIBBED KNIT CROP TOP", "Westen Top", "$29.90", "", "SIZE:", "Medium", "https://images.pexels.com/photos/9594678/pexels-photo-9594678.jpeg?cs=srgb&dl=pexels-ron-lach-9594678.jpg&fm=jpg"],
  ["WRANGLER", "HIGH RISE BOOTCUT JEANS", "Jeans", "$74.00", "$92.00", "FIT:", "Bootcut", "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311392.jpg&fm=jpg"],
  ["ONLY", "RUCHED SLEEVE MINI DRESS", "Dress", "$63.00", "$79.00", "COLOR:", "Black", "https://images.pexels.com/photos/7691126/pexels-photo-7691126.jpeg?cs=srgb&dl=pexels-rodnae-productions-7691126.jpg&fm=jpg"],
  ["COS", "CLEAN DRAPE POPLIN SHIRT", "Shirt", "$64.00", "", "SIZE:", "L", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg"],
  ["LEE", "RELAXED WIDE LEG DENIM", "Jeans", "$68.00", "", "SIZE:", "28", "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?cs=srgb&dl=pexels-micaasato-1598505.jpg&fm=jpg"],
  ["LACK OF COLOR", "THE INCA BUCKET", "Hat", "$79.00", "", "SIZE:", "M/L", "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?cs=srgb&dl=pexels-vinta-supply-co-nyc-1124465.jpg&fm=jpg"],
  ["MANGO", "SATIN SLIP OCCASION DRESS", "Dress", "$89.00", "", "SIZE:", "S", "https://images.pexels.com/photos/6764048/pexels-photo-6764048.jpeg?cs=srgb&dl=pexels-mart-production-6764048.jpg&fm=jpg"],
  ["H&M", "CROPPED MOCK NECK SWEATER", "Sweater", "$39.00", "$52.00", "COLOR:", "Cream", "https://images.pexels.com/photos/6765018/pexels-photo-6765018.jpeg?cs=srgb&dl=pexels-mart-production-6765018.jpg&fm=jpg"],
  ["CLARKS", "SHEER55 COURT SHOES", "Shoes", "$120.00", "", "SIZE:", "39", "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?cs=srgb&dl=pexels-pixabay-267301.jpg&fm=jpg"],
  ["MARIE LANE", "TIE-FRONT PRINTED TOP", "Women Top", "$34.00", "$48.00", "COLOR:", "Brick", "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?cs=srgb&dl=pexels-godisable-jacob-226636-994523.jpg&fm=jpg"],
  ["MANGO", "TEXTURED CABLE KNIT", "Sweater", "$58.00", "", "SIZE:", "S", "https://images.pexels.com/photos/7821112/pexels-photo-7821112.jpeg?cs=srgb&dl=pexels-anna-shvets-7821112.jpg&fm=jpg"],
  ["RACIOUSE", "PRINTED TIERED MAXI DRESS", "Dress", "$81.00", "", "SIZE:", "M", "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?cs=srgb&dl=pexels-godisable-jacob-226636-994523.jpg&fm=jpg"],
  ["ENAMOR", "OFF BLACK CULOTTES TOP", "Women Top", "$41.00", "", "SIZE:", "L", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg"],
  ["J.CREW", "SOFT CANVAS MARKET SHIRT", "Shirt", "$54.00", "$66.00", "COLOR:", "Sand", "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg"],
  ["AGOLDE", "90'S PINCH WAIST JEAN", "Jeans", "$128.00", "$148.00", "WASH:", "Vintage Blue", "https://images.pexels.com/photos/4210860/pexels-photo-4210860.jpeg?cs=srgb&dl=pexels-mart-production-4210860.jpg&fm=jpg"],
  ["MANGO", "CREAM PRINTED TOP", "Women Top", "$37.00", "", "SIZE:", "M", "https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?cs=srgb&dl=pexels-sam-lion-5709656.jpg&fm=jpg"],
  ["LULULEMON", "PACKABLE VISOR", "Hat", "$39.00", "", "COLOR:", "Cream", "https://images.pexels.com/photos/3889978/pexels-photo-3889978.jpeg?cs=srgb&dl=pexels-jessica-mangano-3889978.jpg&fm=jpg"],
  ["VERO MODA", "SHADOW PRINT WRAP DRESS", "Dress", "$76.00", "$92.00", "COLOR:", "Plum", "https://images.pexels.com/photos/6311605/pexels-photo-6311605.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311605.jpg&fm=jpg"],
  ["COS", "SCULPTED RIB TANK", "Top", "$28.00", "", "SIZE:", "M", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg"],
  ["MASSIMO DUTTI", "DARTED TWILL TROUSER", "Bottom", "$69.00", "$82.00", "SIZE:", "30", "https://images.pexels.com/photos/4210860/pexels-photo-4210860.jpeg?cs=srgb&dl=pexels-mart-production-4210860.jpg&fm=jpg"],
  ["H&M", "LINEN BLEND RESORT SHIRT", "Shirt", "$44.00", "", "COLOR:", "Off White", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg"],
  ["ADIDAS", "RETRO RUNNER TRAINERS", "Shoes", "$84.00", "$96.00", "COLOR:", "Grey", "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpg?cs=srgb&dl=pexels-melvin-buezo-2529148.jpg&fm=jpg"],
  ["FREE PEOPLE", "SMOCKED PEASANT BLOUSE", "Top", "$62.00", "", "SIZE:", "S", "https://images.pexels.com/photos/9594678/pexels-photo-9594678.jpeg?cs=srgb&dl=pexels-ron-lach-9594678.jpg&fm=jpg"],
  ["ARKET", "WOOL RIB CARDIGAN", "Sweater", "$88.00", "$105.00", "COLOR:", "Oat", "https://images.pexels.com/photos/9558601/pexels-photo-9558601.jpeg?cs=srgb&dl=pexels-ron-lach-9558601.jpg&fm=jpg"],
  ["MANGO", "CLEAN CUT MIDI SKIRT", "Skirt", "$47.00", "", "SIZE:", "M", "https://images.pexels.com/photos/6764048/pexels-photo-6764048.jpeg?cs=srgb&dl=pexels-mart-production-6764048.jpg&fm=jpg"],
  ["KOTON", "COTTON GRAPHIC TEE", "T-shirt", "$24.00", "", "COLOR:", "Black", "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311392.jpg&fm=jpg"],
  ["STEVE MADDEN", "SLEEK POINTED SLINGBACK", "Shoes", "$119.00", "$139.00", "HEEL:", "7 cm", "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?cs=srgb&dl=pexels-jonathanborba-1456706.jpg&fm=jpg"],
  ["RAY BAN", "CLASSIC AVIATOR SUNGLASSES", "Accessories", "$161.00", "", "COLOR:", "Gold", "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?cs=srgb&dl=pexels-godisable-jacob-226636-994523.jpg&fm=jpg"],
  ["ZARA", "SOFT CROPPED BLAZER", "Outerwear", "$92.00", "$110.00", "SIZE:", "M", "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?cs=srgb&dl=pexels-evg-kowalievska-6311612.jpg&fm=jpg"],
  ["TOPSHOP", "PLEATED WAIST BLOUSE", "Top", "$48.00", "", "COLOR:", "Lilac", "https://images.pexels.com/photos/5418888/pexels-photo-5418888.jpeg?cs=srgb&dl=pexels-arina-krasnikova-5418888.jpg&fm=jpg"],
].map((entry, index) =>
  product(entry[0], entry[1], entry[2], entry[3], entry[4], entry[5], entry[6], entry[7], index % 7 !== 0)
);

collectionProducts.collections = expandCollectionProducts(collectionsMegaProducts);
attachGalleryImagesToCollectionProducts(collectionProducts);
attachAttributeImagesToCollectionProducts(collectionProducts);

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
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        image_url TEXT NOT NULL,
        href TEXT NOT NULL,
        item_count INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      ALTER TABLE nav_shop_cards
      ADD COLUMN IF NOT EXISTS slug TEXT
    `);

    await client.query(`
      ALTER TABLE nav_shop_cards
      ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT ''
    `);

    await client.query(`
      ALTER TABLE nav_shop_cards
      ADD COLUMN IF NOT EXISTS item_count INTEGER NOT NULL DEFAULT 0
    `);

    await client.query(`
      UPDATE nav_shop_cards
      SET slug = LOWER(REGEXP_REPLACE(title, '[^a-z0-9]+', '-', 'g'))
      WHERE slug IS NULL
    `);

    await client.query(`
      ALTER TABLE nav_shop_cards
      ALTER COLUMN slug SET NOT NULL
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS nav_shop_cards_slug_unique_idx
      ON nav_shop_cards(slug)
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS collection_products (
        id BIGSERIAL PRIMARY KEY,
        collection_slug TEXT NOT NULL REFERENCES nav_shop_cards(slug) ON DELETE CASCADE,
        brand TEXT NOT NULL,
        name TEXT NOT NULL,
        category_name TEXT NOT NULL,
        price TEXT NOT NULL,
        old_price TEXT NOT NULL,
        option_label TEXT NOT NULL,
        option_value TEXT NOT NULL,
        image_url TEXT NOT NULL,
        gallery_images TEXT[] NOT NULL DEFAULT '{}',
        attribute_images JSONB NOT NULL DEFAULT '[]'::jsonb,
        in_stock BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      ALTER TABLE collection_products
      ADD COLUMN IF NOT EXISTS gallery_images TEXT[] NOT NULL DEFAULT '{}'
    `);

    await client.query(`
      ALTER TABLE collection_products
      ADD COLUMN IF NOT EXISTS attribute_images JSONB NOT NULL DEFAULT '[]'::jsonb
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS category_showcase_categories (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        sort_order INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS category_showcase_products (
        id BIGSERIAL PRIMARY KEY,
        category_id BIGINT NOT NULL REFERENCES category_showcase_categories(id) ON DELETE CASCADE,
        brand TEXT NOT NULL,
        name TEXT NOT NULL,
        category_name TEXT NOT NULL,
        price TEXT NOT NULL,
        old_price TEXT NOT NULL,
        option_label TEXT NOT NULL,
        option_value TEXT NOT NULL,
        image_url TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_section_configs (
        id BIGSERIAL PRIMARY KEY,
        section_key TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        feature_title TEXT NOT NULL DEFAULT '',
        feature_description TEXT NOT NULL DEFAULT '',
        feature_button_label TEXT NOT NULL DEFAULT '',
        feature_image_url TEXT NOT NULL DEFAULT '',
        side_image_url TEXT NOT NULL DEFAULT '',
        tab_slugs TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
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

    await client.query(
      "TRUNCATE TABLE homepage_section_configs, product_reviews, category_items, category_groups, collection_products, nav_shop_cards, category_showcase_products, category_showcase_categories RESTART IDENTITY CASCADE"
    );

    const groupIdsByName = new Map();

    for (const group of menuGroups) {
      const groupResult = await client.query(
        `
          INSERT INTO category_groups (name, sort_order, promo_image_url)
          VALUES ($1, $2, $3)
          RETURNING id
        `,
        [group.name, group.sortOrder, group.promoImageUrl]
      );

      groupIdsByName.set(group.name, groupResult.rows[0].id);
    }

    const insertedProductIdsByCollection = new Map();

    for (const [index, card] of collectionCards.entries()) {
      await client.query(
        `
          INSERT INTO nav_shop_cards (slug, title, description, image_url, href, item_count, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [card.slug, card.title, card.description, card.imageUrl, card.href, 0, index + 1]
      );

      const insertedIds = [];

      for (const productRecord of collectionProducts[card.slug] ?? []) {
        const insertResult = await client.query(
          `
            INSERT INTO collection_products (
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
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id
          `,
          [
            card.slug,
            productRecord.brand,
            productRecord.name,
            productRecord.category,
            productRecord.price,
            productRecord.oldPrice,
            productRecord.optionLabel,
            productRecord.optionValue,
            productRecord.imageUrl,
            productRecord.galleryImages,
            JSON.stringify(productRecord.attributeImages),
            productRecord.inStock,
            productRecord.sortOrder
          ]
        );

        insertedIds.push(insertResult.rows?.[0]?.id);
      }

      insertedProductIdsByCollection.set(card.slug, insertedIds.filter(Boolean));
    }

    for (const group of menuGroups) {
      const groupId = groupIdsByName.get(group.name);
      const collectionSlug = getMenuGroupCollectionSlug(group.name);
      const productIds = insertedProductIdsByCollection.get(collectionSlug) ?? [];

      for (const [index, item] of group.items.entries()) {
        const productId = productIds[index % productIds.length];
        const href = productId ? `#/collections/${collectionSlug}/products/${productId}` : `#/collections/${collectionSlug}`;

        await client.query(
          `
            INSERT INTO category_items (group_id, name, href, sort_order)
            VALUES ($1, $2, $3, $4)
          `,
          [groupId, item, href, index + 1]
        );
      }
    }

    await client.query(`
      UPDATE nav_shop_cards card
      SET item_count = product_counts.count
      FROM (
        SELECT collection_slug, COUNT(*)::INTEGER AS count
        FROM collection_products
        GROUP BY collection_slug
      ) AS product_counts
      WHERE product_counts.collection_slug = card.slug
    `);

    const showcaseCategoryIds = new Map();

    for (const category of categoryShowcaseCategories) {
      const result = await client.query(
        `
          INSERT INTO category_showcase_categories (name, slug, sort_order)
          VALUES ($1, $2, $3)
          RETURNING id
        `,
        [category.name, category.slug, category.sortOrder]
      );

      showcaseCategoryIds.set(category.slug, result.rows[0].id);
    }

    for (const productRecord of categoryShowcaseProducts) {
      await client.query(
        `
          INSERT INTO category_showcase_products (
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
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          showcaseCategoryIds.get(productRecord.categorySlug),
          productRecord.brand,
          productRecord.name,
          productRecord.categoryName,
          productRecord.price,
          productRecord.oldPrice,
          productRecord.optionLabel,
          productRecord.optionValue,
          productRecord.imageUrl,
          productRecord.sortOrder
        ]
      );
    }

    for (const config of homepageSectionConfigs) {
      await client.query(
        `
          INSERT INTO homepage_section_configs (
            section_key,
            title,
            description,
            feature_title,
            feature_description,
            feature_button_label,
            feature_image_url,
            side_image_url,
            tab_slugs
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          config.sectionKey,
          config.title,
          config.description,
          config.featureTitle,
          config.featureDescription,
          config.featureButtonLabel,
          config.featureImageUrl,
          config.sideImageUrl,
          config.tabSlugs
        ]
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

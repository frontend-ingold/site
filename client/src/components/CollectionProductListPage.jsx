import { useEffect, useMemo, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { useCart } from "../context/CartContext";

const sortOptions = [
  { value: "best-selling", label: "Best selling" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name-asc", label: "Alphabetically, A-Z" }
];

function parsePrice(value) {
  return Number(String(value ?? "0").replace(/[^0-9.]/g, "")) || 0;
}

function normalizeColor(product) {
  if (String(product.optionLabel ?? "").trim().toLowerCase() === "color:") {
    return String(product.optionValue ?? "").trim();
  }

  return null;
}

function getProductHref(collectionSlug, productId) {
  return `#/collections/${collectionSlug}/products/${productId}`;
}

function getAttributeImages(product) {
  if (product.attributeImages?.length) {
    return product.attributeImages;
  }

  return [
    {
      value: product.optionValue,
      image: product.image,
      images: product.galleryImages?.length ? product.galleryImages : [product.image]
    }
  ];
}

function buildFacetCounts(products, getValue) {
  const counts = new Map();

  for (const product of products) {
    const value = getValue(product);
    if (!value) {
      continue;
    }

    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([value, count]) => ({
    value,
    count
  }));
}

const colorSwatches = {
  Black: "#000000",
  Blue: "#1437ff",
  Green: "#15803d",
  Pink: "#f9a8d4",
  Red: "#ff0000",
  White: "#ffffff",
  Yellow: "#fff000",
  Cream: "#f4ead7",
  Ivory: "#f8f4e8",
  Natural: "#d1b58a",
  Mustard: "#d1a11d"
};

function CollectionProductCard({ item, collectionSlug }) {
  const { addItem } = useCart();
  const attributeImages = getAttributeImages(item);
  const [activeAttributeIndex, setActiveAttributeIndex] = useState(0);

  useEffect(() => {
    setActiveAttributeIndex(0);
  }, [item.id]);

  const activeAttribute = attributeImages[activeAttributeIndex] ?? attributeImages[0];
  const previewImage = activeAttribute?.image || activeAttribute?.images?.[0] || item.image;
  const productHref = getProductHref(collectionSlug, item.id);
  const isColorAttribute = String(item.optionLabel ?? "").trim().toLowerCase() === "color:";

  return (
    <article className="collection-product-card">
      <p className="collection-product-card__brand">{item.brand}</p>
      <h3>
        <a href={productHref}>{item.name}</a>
      </h3>
      <p className="collection-product-card__type">{item.category}</p>

      <a className="collection-product-card__media" href={productHref}>
        <img src={previewImage} alt={item.name} />
      </a>

      {attributeImages.length > 1 ? (
        <div className="collection-product-card__variants" aria-label={`${item.name} variants`}>
          {attributeImages.map((attribute, index) => (
            <button
              type="button"
              key={`${item.id}-${attribute.value}-${index}`}
              className={`collection-product-card__variant ${index === activeAttributeIndex ? "is-active" : ""} ${
                isColorAttribute ? "is-color" : ""
              }`}
              onClick={() => {
                setActiveAttributeIndex(index);
              }}
              title={attribute.value}
            >
              {isColorAttribute ? (
                <span
                  className="collection-product-card__variant-swatch"
                  style={{ backgroundColor: colorSwatches[attribute.value] || "#d4c8ba" }}
                />
              ) : (
                <span>{attribute.value}</span>
              )}
            </button>
          ))}
        </div>
      ) : null}

      <div className="collection-product-card__price">
        <strong>{item.price}</strong>
        {item.oldPrice ? <span>{item.oldPrice}</span> : null}
      </div>

      <button type="button" className="collection-product-card__option">
        <span>{item.optionLabel}</span>
        <strong>{activeAttribute?.value || item.optionValue}</strong>
        <i>&#8964;</i>
      </button>

      <button
        type="button"
        className={`collection-product-card__button ${item.inStock ? "" : "is-sold-out"}`}
        onClick={() => {
          if (!item.inStock) {
            return;
          }

          addItem({
            id: item.id,
            productId: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            image: previewImage,
            optionLabel: item.optionLabel,
            optionValue: activeAttribute?.value || item.optionValue,
            quantity: 1
          });
        }}
      >
        {item.inStock ? "ADD TO CART" : "SOLD OUT"}
        <span>&raquo;</span>
      </button>
    </article>
  );
}

export function CollectionProductListPage({ data, isLoading = false }) {
  const products = data.products ?? [];
  const collection = data.collection;

  const [sortBy, setSortBy] = useState("best-selling");
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false
  });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: "0",
    max: String(
      Math.max(
        20,
        ...products.map((item) => parsePrice(item.price))
      )
    )
  });

  const maxPrice = useMemo(() => {
    return Math.max(20, ...products.map((item) => parsePrice(item.price)));
  }, [products]);

  const typeOptions = useMemo(() => {
    return buildFacetCounts(products, (item) => item.category).sort((left, right) => left.value.localeCompare(right.value));
  }, [products]);

  const brandOptions = useMemo(() => {
    return buildFacetCounts(products, (item) => item.brand).sort((left, right) => left.value.localeCompare(right.value));
  }, [products]);

  const colorOptions = useMemo(() => {
    return buildFacetCounts(products, (item) => normalizeColor(item)).sort((left, right) => left.value.localeCompare(right.value));
  }, [products]);

  useEffect(() => {
    setPriceRange({
      min: "0",
      max: String(maxPrice)
    });
    setAvailability({
      inStock: false,
      outOfStock: false
    });
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSortBy("best-selling");
  }, [collection?.slug, maxPrice]);

  const filteredProducts = useMemo(() => {
    let nextProducts = [...products];

    if (availability.inStock || availability.outOfStock) {
      nextProducts = nextProducts.filter((item) => {
        if (availability.inStock && item.inStock) {
          return true;
        }

        if (availability.outOfStock && !item.inStock) {
          return true;
        }

        return false;
      });
    }

    if (selectedTypes.length > 0) {
      nextProducts = nextProducts.filter((item) => selectedTypes.includes(item.category));
    }

    if (selectedBrands.length > 0) {
      nextProducts = nextProducts.filter((item) => selectedBrands.includes(item.brand));
    }

    if (selectedColors.length > 0) {
      nextProducts = nextProducts.filter((item) => selectedColors.includes(normalizeColor(item)));
    }

    const minPrice = Number(priceRange.min) || 0;
    const maxSelectedPrice = Number(priceRange.max) || maxPrice;

    nextProducts = nextProducts.filter((item) => {
      const price = parsePrice(item.price);
      return price >= minPrice && price <= maxSelectedPrice;
    });

    if (sortBy === "price-low") {
      nextProducts.sort((left, right) => parsePrice(left.price) - parsePrice(right.price));
    } else if (sortBy === "price-high") {
      nextProducts.sort((left, right) => parsePrice(right.price) - parsePrice(left.price));
    } else if (sortBy === "name-asc") {
      nextProducts.sort((left, right) => left.name.localeCompare(right.name));
    }

    return nextProducts;
  }, [
    availability.inStock,
    availability.outOfStock,
    maxPrice,
    priceRange.max,
    priceRange.min,
    products,
    selectedBrands,
    selectedColors,
    selectedTypes,
    sortBy
  ]);

  const inStockCount = products.filter((item) => item.inStock).length;
  const outOfStockCount = products.length - inStockCount;

  function toggleSelection(value, selectedValues, setSelectedValues) {
    setSelectedValues((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  }

  if (!collection || isLoading) {
    return (
      <main className="collection-detail-page">
        <section className="collection-detail-page__hero">
          <div className="container">
            <LoadingScreen label="Loading collection" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="collection-detail-page">
      <section className="collection-detail-page__hero">
        <div className="container">
          <button
            type="button"
            className="collection-detail-page__back"
            onClick={() => {
              window.location.hash = "/collections";
            }}
          >
            <span>&larr;</span>
            Back to Home
          </button>

          <div className="collection-detail-page__intro">
            <h2>{collection.title}</h2>
            <p>{collection.description}</p>
          </div>
        </div>
      </section>

      <section className="collection-detail-page__catalog">
        <div className="container">
          <div className="collection-detail-page__catalog-head">
            <h3>Filters</h3>
            <p>
              Home <span>/</span> {collection.title}
            </p>
            <label className="collection-detail-page__sort">
              <span>Sort by:</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="collection-detail-page__layout">
            <aside className="collection-filter-card">
              <div className="collection-filter-card__section">
                <div className="collection-filter-card__section-head">
                  <h3>Availability</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setAvailability({
                        inStock: false,
                        outOfStock: false
                      })
                    }
                  >
                    Reset
                  </button>
                </div>

                <p className="collection-filter-card__summary">
                  {(availability.inStock ? 1 : 0) + (availability.outOfStock ? 1 : 0)} selected
                </p>

                <label className="collection-filter-card__check">
                  <input
                    type="checkbox"
                    checked={availability.inStock}
                    onChange={(event) =>
                      setAvailability((current) => ({
                        ...current,
                        inStock: event.target.checked
                      }))
                    }
                  />
                  <span>In stock</span>
                  <strong>({inStockCount})</strong>
                </label>

                <label className="collection-filter-card__check">
                  <input
                    type="checkbox"
                    checked={availability.outOfStock}
                    onChange={(event) =>
                      setAvailability((current) => ({
                        ...current,
                        outOfStock: event.target.checked
                      }))
                    }
                  />
                  <span>Out of stock</span>
                  <strong>({outOfStockCount})</strong>
                </label>
              </div>

              <div className="collection-filter-card__section">
                <div className="collection-filter-card__section-head">
                  <h3>Price</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setPriceRange({
                        min: "0",
                        max: String(maxPrice)
                      })
                    }
                  >
                    Reset
                  </button>
                </div>
                <p className="collection-filter-card__summary">
                  The highest price is ${maxPrice.toFixed(2)}
                </p>
                <div className="collection-filter-card__price-grid">
                  <label>
                    <span>Min price:</span>
                    <input
                      type="number"
                      min="0"
                      value={priceRange.min}
                      onChange={(event) =>
                        setPriceRange((current) => ({
                          ...current,
                          min: event.target.value
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Max price:</span>
                    <input
                      type="number"
                      min="0"
                      value={priceRange.max}
                      onChange={(event) =>
                        setPriceRange((current) => ({
                          ...current,
                          max: event.target.value
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="collection-filter-card__section">
                <div className="collection-filter-card__section-head">
                  <h3>Product Type</h3>
                  <button type="button" onClick={() => setSelectedTypes([])}>
                    Reset
                  </button>
                </div>
                <p className="collection-filter-card__summary">{selectedTypes.length} selected</p>
                {typeOptions.map((item) => (
                  <label className="collection-filter-card__check" key={item.value}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(item.value)}
                      onChange={() => toggleSelection(item.value, selectedTypes, setSelectedTypes)}
                    />
                    <span>{item.value}</span>
                    <strong>({item.count})</strong>
                  </label>
                ))}
              </div>

              <div className="collection-filter-card__section">
                <div className="collection-filter-card__section-head">
                  <h3>Brand</h3>
                  <button type="button" onClick={() => setSelectedBrands([])}>
                    Reset
                  </button>
                </div>
                <p className="collection-filter-card__summary">{selectedBrands.length} selected</p>
                {brandOptions.map((item) => (
                  <label className="collection-filter-card__check" key={item.value}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(item.value)}
                      onChange={() => toggleSelection(item.value, selectedBrands, setSelectedBrands)}
                    />
                    <span>{item.value}</span>
                    <strong>({item.count})</strong>
                  </label>
                ))}
              </div>

              <div className="collection-filter-card__section">
                <div className="collection-filter-card__section-head">
                  <h3>Color</h3>
                  <button type="button" onClick={() => setSelectedColors([])}>
                    Reset
                  </button>
                </div>
                <p className="collection-filter-card__summary">{selectedColors.length} selected</p>
                {colorOptions.map((item) => (
                  <label className="collection-filter-card__check collection-filter-card__check--color" key={item.value}>
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(item.value)}
                      onChange={() => toggleSelection(item.value, selectedColors, setSelectedColors)}
                    />
                    <span className="collection-filter-card__swatch" style={{ backgroundColor: colorSwatches[item.value] || "#d4c8ba" }} />
                    <span>{item.value}</span>
                    <strong>({item.count})</strong>
                  </label>
                ))}
              </div>
            </aside>

            <div className="collection-detail-page__products">
              {filteredProducts.map((item) => (
                <CollectionProductCard item={item} collectionSlug={collection.slug} key={item.id} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

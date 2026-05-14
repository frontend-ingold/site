import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

export function CategoryGrid({ items }) {
  const viewportRef = useRef(null);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  const normalizedCategories = useMemo(() => {
    return items.categories.map((item) => ({
      ...item,
      id: String(item.id)
    }));
  }, [items.categories]);

  const normalizedProducts = useMemo(() => {
    return items.products.map((item) => ({
      ...item,
      id: String(item.id),
      categoryId: String(item.categoryId)
    }));
  }, [items.products]);

  const allCategoryProducts = useMemo(() => {
    const groupedProducts = new Map(normalizedCategories.map((item) => [item.id, []]));

    for (const product of normalizedProducts) {
      const categoryProducts = groupedProducts.get(product.categoryId);
      if (categoryProducts) {
        categoryProducts.push(product);
      }
    }

    const interleavedProducts = [];
    let rowIndex = 0;
    let appendedInRound = true;

    while (appendedInRound) {
      appendedInRound = false;

      for (const category of normalizedCategories) {
        const categoryProducts = groupedProducts.get(category.id) || [];
        if (categoryProducts[rowIndex]) {
          interleavedProducts.push(categoryProducts[rowIndex]);
          appendedInRound = true;
        }
      }

      rowIndex += 1;
    }

    return interleavedProducts;
  }, [normalizedCategories, normalizedProducts]);

  const visibleProducts = useMemo(() => {
    if (activeCategoryId === "all") {
      return allCategoryProducts;
    }

    return normalizedProducts.filter((item) => item.categoryId === activeCategoryId);
  }, [activeCategoryId, allCategoryProducts, normalizedProducts]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    function updateArrowState() {
      const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      setCanGoPrev(viewport.scrollLeft > 4);
      setCanGoNext(viewport.scrollLeft < maxScrollLeft - 4);
    }

    viewport.scrollTo({ left: 0, behavior: "auto" });
    updateArrowState();

    viewport.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);

    return () => {
      viewport.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, [visibleProducts]);

  function navigateToCollections() {
    window.location.hash = "/collections";
  }

  function showAllProducts() {
    setActiveCategoryId("all");
  }

  function handleCategorySelect(categoryId) {
    setActiveCategoryId(categoryId);
  }

  function scrollCards(direction) {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    viewport.scrollBy({
      left: direction * Math.max(viewport.clientWidth * 0.92, 280),
      behavior: "smooth"
    });
  }

  return (
    <section className="section container category-showcase">
      <div className="category-showcase__header">
        <h2>{items.title}</h2>
        <button type="button" className="category-showcase__cta" onClick={showAllProducts}>
          {items.ctaLabel}
          <span>&raquo;</span>
        </button>
      </div>

      <div className="category-showcase__layout">
        <aside className="category-showcase__sidebar">
          <div className="category-showcase__links" aria-label="Categories">
            {normalizedCategories.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === activeCategoryId ? "is-active" : ""}
                aria-pressed={item.id === activeCategoryId}
                onClick={() => handleCategorySelect(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`category-showcase__more ${activeCategoryId === "all" ? "is-active" : ""}`}
            aria-pressed={activeCategoryId === "all"}
            onClick={navigateToCollections}
          >
            {items.moreLabel}
          </button>
        </aside>

        <div className="category-showcase__cards-shell">
          <button
            type="button"
            className={`category-showcase__arrow category-showcase__arrow--prev ${canGoPrev ? "" : "is-disabled"}`}
            onClick={() => scrollCards(-1)}
            aria-label="Previous category products"
          >
            &#8249;
          </button>

          <div className="category-showcase__viewport" ref={viewportRef}>
            <div className="category-showcase__track">
              {visibleProducts.map((item) => (
                <article className="category-product-card" key={item.id}>
                  <p className="category-product-card__brand">{item.brand}</p>
                  <h3>{item.name}</h3>
                  <p className="category-product-card__type">{item.category}</p>

                  <div className="category-product-card__media">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="category-product-card__price">
                    <strong>{formatPrice(item.price)}</strong>
                    {item.oldPrice ? <span>{formatPrice(item.oldPrice)}</span> : null}
                  </div>

                  <button type="button" className="category-product-card__option">
                    <span>{item.optionLabel}</span>
                    <strong>{item.optionValue}</strong>
                    <i>&#8964;</i>
                  </button>

                  <button
                    type="button"
                    className="category-product-card__button"
                    onClick={() => {
                      addItem({
                        id: item.id,
                        productId: item.id,
                        name: item.name,
                        category: item.category,
                        price: item.price,
                        image: item.image,
                        optionLabel: item.optionLabel,
                        optionValue: item.optionValue,
                        quantity: 1
                      });
                    }}
                  >
                    ADD TO CART
                    <span>&raquo;</span>
                  </button>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`category-showcase__arrow category-showcase__arrow--next ${canGoNext ? "" : "is-disabled"}`}
            onClick={() => scrollCards(1)}
            aria-label="Next category products"
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}

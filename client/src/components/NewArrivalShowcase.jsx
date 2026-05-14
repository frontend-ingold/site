import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

export function NewArrivalShowcase({ content }) {
  const viewportRef = useRef(null);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const normalizedTabs = useMemo(() => {
    return (content.tabs ?? []).map((item) =>
      typeof item === "string"
        ? { label: item, slug: item.toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: content.description, image: content.sideImage }
        : item
    );
  }, [content.description, content.sideImage, content.tabs]);
  const [activeTabSlug, setActiveTabSlug] = useState(normalizedTabs[0]?.slug ?? "all");

  useEffect(() => {
    setActiveTabSlug(normalizedTabs[0]?.slug ?? "all");
  }, [normalizedTabs]);

  const activeTab = normalizedTabs.find((item) => item.slug === activeTabSlug) ?? normalizedTabs[0] ?? null;
  const visibleProducts = useMemo(() => {
    if (!activeTab?.slug) {
      return content.products ?? [];
    }

    return (content.products ?? []).filter((item) => item.collectionSlug === activeTab.slug);
  }, [activeTab?.slug, content.products]);

  useEffect(() => {
    viewportRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [activeTabSlug]);

  const scrollCards = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const amount = viewport.clientWidth * 0.34 * direction;
    viewport.scrollBy({ left: amount, behavior: "smooth" });
  };

  const featureTargetHref = `#/${activeTab?.slug ? `collections/${activeTab.slug}` : "collections"}`;

  return (
    <section className="arrival-showcase">
      <div className="arrival-showcase__feature">
        <div className="container arrival-showcase__feature-inner">
          <div className="arrival-showcase__feature-image">
            <img src={content.feature.image} alt={content.feature.title} />
          </div>

          <div className="arrival-showcase__feature-copy">
            <h2>{content.feature.title}</h2>
            <div className="arrival-showcase__feature-body">
              <p>{content.feature.description}</p>
              <a href={featureTargetHref} className="arrival-showcase__feature-button">
                {content.feature.buttonLabel}
                <span>&raquo;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="arrival-showcase__panel">
        <div className="container arrival-showcase__panel-inner">
          <div className="arrival-showcase__intro">
            <h3>{content.title}</h3>

            <div className="arrival-showcase__tabs" aria-label="Arrival categories">
              {normalizedTabs.map((item) => (
                <button
                  type="button"
                  key={item.slug}
                  className={item.slug === activeTabSlug ? "is-active" : ""}
                  onClick={() => {
                    setActiveTabSlug(item.slug);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p>{activeTab?.description || content.description}</p>
          </div>

          <div className="arrival-showcase__slider">
            <button type="button" className="arrival-showcase__arrow arrival-showcase__arrow--prev" onClick={() => scrollCards(-1)} aria-label="Previous products">
              &#8249;
            </button>

            <div className="arrival-showcase__viewport" ref={viewportRef}>
              <div className="arrival-showcase__track">
                {visibleProducts.map((item) => (
                  <article className="arrival-product-card" key={item.name}>
                    <p className="arrival-product-card__brand">{item.brand}</p>
                    <h4>{item.name}</h4>
                    <p className="arrival-product-card__type">{item.category}</p>

                    <div className="arrival-product-card__media">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="arrival-product-card__price">
                      <strong>{formatPrice(item.price)}</strong>
                      {item.oldPrice ? <span>{formatPrice(item.oldPrice)}</span> : null}
                    </div>

                    <button type="button" className="arrival-product-card__option">
                      <span>{item.optionLabel}</span>
                      <strong>{item.optionValue}</strong>
                      <i>&#8964;</i>
                    </button>

                    <button
                      type="button"
                      className="arrival-product-card__button"
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
                          image: item.image,
                          optionLabel: item.optionLabel,
                          optionValue: item.optionValue,
                          quantity: 1
                        });
                      }}
                    >
                      {item.buttonLabel || "ADD TO CART"}
                      <span>&raquo;</span>
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <button type="button" className="arrival-showcase__arrow arrival-showcase__arrow--next" onClick={() => scrollCards(1)} aria-label="Next products">
              &#8250;
            </button>
          </div>
        </div>

        <div className="arrival-showcase__side-image" aria-hidden="true">
          <img src={activeTab?.image || content.sideImage} alt="" />
        </div>
      </div>
    </section>
  );
}

import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";

export function FeaturedProducts({ items }) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <section className="section container">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{t("featured.eyebrow")}</p>
          <h2>{t("featured.title")}</h2>
        </div>
        <a href="/" onClick={(event) => event.preventDefault()} className="text-link">
          {t("featured.viewAll")}
        </a>
      </div>

      <div className="product-grid">
        {items.map((item) => (
          <article className="product-card product-card--catalog" key={item.name}>
            <div className="product-copy product-copy--catalog">
              <p className="product-brand">{item.brand}</p>
              <h3>{item.name}</h3>
              <p className="product-type">{item.category}</p>
            </div>
            <div className="product-media product-media--image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="product-copy product-copy--catalog product-copy--bottom">
              <div className="product-price-row">
                <strong>{formatPrice(item.price)}</strong>
                {item.oldPrice ? <span>{formatPrice(item.oldPrice)}</span> : null}
              </div>
              <p className="product-option">
                {item.optionLabel}:{item.optionValue}
              </p>
              <button
                type="button"
                className="product-action-button"
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
                {t("common.addToCart")} &raquo;
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

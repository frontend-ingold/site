import { useCurrency } from "../context/CurrencyContext";

export function SpotlightBanner({ content }) {
  const { formatPrice } = useCurrency();

  return (
    <section className="section container spotlight-banner-section">
      <article
        className="spotlight-banner"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(24, 31, 35, 0.78) 0%, rgba(24, 31, 35, 0.42) 36%, rgba(24, 31, 35, 0.16) 100%), url(${content.backgroundImage})` }}
      >
        <div className="spotlight-banner__copy">
          <p className="spotlight-banner__eyebrow">{content.eyebrow}</p>
          <h3>{content.title}</h3>
          <p className="spotlight-banner__category">{content.category}</p>

          <div className="spotlight-banner__price">
            <strong>{formatPrice(content.price)}</strong>
            <span>{formatPrice(content.oldPrice)}</span>
          </div>

          <a href="/" onClick={(event) => event.preventDefault()} className="spotlight-banner__button">
            {content.buttonLabel}
            <span>&raquo;</span>
          </a>
        </div>

        <div className="spotlight-banner__product">
          <div className="spotlight-banner__product-media">
            <img src={content.productImage} alt={content.title} />
          </div>

          <div className="spotlight-banner__hotspot spotlight-banner__hotspot--top">
            <button type="button" aria-label="Top product detail">
              +
            </button>
            <span>{content.topHotspot}</span>
          </div>

          <div className="spotlight-banner__hotspot spotlight-banner__hotspot--bottom">
            <button type="button" aria-label="Bottom product detail">
              +
            </button>
            <span>{content.bottomHotspot}</span>
          </div>
        </div>
      </article>
    </section>
  );
}

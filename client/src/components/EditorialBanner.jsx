export function EditorialBanner({ content }) {
  return (
    <section className="section editorial-banner-section">
      <article
        className="editorial-banner"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(86, 80, 74, 0.76) 0%, rgba(86, 80, 74, 0.44) 34%, rgba(86, 80, 74, 0.08) 100%), url(${content.backgroundImage})`
        }}
      >
        <div className="editorial-banner__copy">
          <h3>{content.title}</h3>
          <p>{content.description}</p>
        </div>

        <div className="editorial-banner__cards">
          {content.products.map((item) => (
            <article className="editorial-product-card" key={item.name}>
              <p className="editorial-product-card__brand">{item.brand}</p>
              <h4>{item.name}</h4>
              <p className="editorial-product-card__category">{item.category}</p>
              <div className="editorial-product-card__media">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="editorial-product-card__price">
                <strong>{item.price}</strong>
                {item.oldPrice ? <span>{item.oldPrice}</span> : null}
              </div>
              <p className="editorial-product-card__option">
                {item.optionLabel}:{item.optionValue}
              </p>
              <button type="button">{item.buttonLabel} »</button>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

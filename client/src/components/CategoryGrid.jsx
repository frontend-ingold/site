export function CategoryGrid({ items }) {
  return (
    <section className="section container category-showcase">
      <div className="category-showcase__header">
        <h2>Categories:</h2>
        <a href="/" onClick={(event) => event.preventDefault()} className="category-showcase__cta">
          SHOP NOW
          <span>&raquo;</span>
        </a>
      </div>

      <div className="category-showcase__layout">
        <aside className="category-showcase__sidebar">
          <nav className="category-showcase__links" aria-label="Categories">
            {items.links.map((item) => (
              <a href="/" key={item} onClick={(event) => event.preventDefault()}>
                {item}
              </a>
            ))}
          </nav>

          <a href="/" onClick={(event) => event.preventDefault()} className="category-showcase__more">
            {items.ctaLabel}
          </a>
        </aside>

        <div className="category-showcase__cards">
          {items.products.map((item) => (
            <article className="category-product-card" key={item.name}>
              <p className="category-product-card__brand">{item.brand}</p>
              <h3>{item.name}</h3>
              <p className="category-product-card__type">{item.category}</p>

              <div className="category-product-card__media">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="category-product-card__price">
                <strong>{item.price}</strong>
                {item.oldPrice ? <span>{item.oldPrice}</span> : null}
              </div>

              <button type="button" className="category-product-card__option">
                <span>{item.optionLabel}</span>
                <strong>{item.optionValue}</strong>
                <i>&#8964;</i>
              </button>

              <button type="button" className="category-product-card__button">
                ADD TO CART
                <span>&raquo;</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

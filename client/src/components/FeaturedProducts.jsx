export function FeaturedProducts({ items }) {
  return (
    <section className="section container">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">Featured products</p>
          <h2>Highlighted styles from the latest edit.</h2>
        </div>
        <a href="/" onClick={(event) => event.preventDefault()} className="text-link">
          View all products
        </a>
      </div>

      <div className="product-grid">
        {items.map((item) => (
          <article className="product-card" key={item.name}>
            <div className={`product-media accent-${item.accent}`}>
              <span>{item.badge}</span>
            </div>
            <div className="product-copy">
              <p>{item.category}</p>
              <h3>{item.name}</h3>
              <div className="product-row">
                <strong>{item.price}</strong>
                <button type="button">Add to cart</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

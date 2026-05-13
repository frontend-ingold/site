import { useCart } from "../context/CartContext";

export function FeaturedProducts({ items }) {
  const { addItem } = useCart();

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
                <strong>{item.price}</strong>
                {item.oldPrice ? <span>{item.oldPrice}</span> : null}
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
                {item.buttonLabel} &raquo;
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

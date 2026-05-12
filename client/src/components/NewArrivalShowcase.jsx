import { useRef } from "react";

export function NewArrivalShowcase({ content }) {
  const viewportRef = useRef(null);

  const scrollCards = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const amount = viewport.clientWidth * 0.34 * direction;
    viewport.scrollBy({ left: amount, behavior: "smooth" });
  };

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
              <a href="/" onClick={(event) => event.preventDefault()} className="arrival-showcase__feature-button">
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
              {content.tabs.map((item) => (
                <button type="button" key={item}>
                  {item}
                </button>
              ))}
            </div>

            <p>{content.description}</p>
          </div>

          <div className="arrival-showcase__slider">
            <button type="button" className="arrival-showcase__arrow arrival-showcase__arrow--prev" onClick={() => scrollCards(-1)} aria-label="Previous products">
              &#8249;
            </button>

            <div className="arrival-showcase__viewport" ref={viewportRef}>
              <div className="arrival-showcase__track">
                {content.products.map((item) => (
                  <article className="arrival-product-card" key={item.name}>
                    <p className="arrival-product-card__brand">{item.brand}</p>
                    <h4>{item.name}</h4>
                    <p className="arrival-product-card__type">{item.category}</p>

                    <div className="arrival-product-card__media">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="arrival-product-card__price">
                      <strong>{item.price}</strong>
                      {item.oldPrice ? <span>{item.oldPrice}</span> : null}
                    </div>

                    <button type="button" className="arrival-product-card__option">
                      <span>{item.optionLabel}</span>
                      <strong>{item.optionValue}</strong>
                      <i>&#8964;</i>
                    </button>

                    <button type="button" className="arrival-product-card__button">
                      ADD TO CART
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
          <img src={content.sideImage} alt="" />
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";

const heroContent = {
  count: "02",
  title: "Modern and timeless clothes from the best stylists.",
  description:
    "These dresses are often bold and eye-catching, and they can be dressed up or down depending on the occasion.",
  topHotspot: "Cotton Hat",
  bottomHotspot: "Junior Sweatshirt Kids"
};

const heroProducts = [
  {
    id: 1,
    label: "DISNEY",
    name: "KID'S CAPS",
    price: "$12.00",
    oldPrice: "$20.00",
    color: "White",
    image: "/assets/products/cap-white.svg"
  },
  {
    id: 2,
    label: "LIMITED",
    name: "WOMEN'S COTTON SHIRT",
    price: "$20.00",
    oldPrice: "$25.00",
    color: "Yellow",
    image: "/assets/products/shirt-yellow.svg"
  },
  {
    id: 3,
    label: "GENERIC",
    name: "LIGHT PLAN SIMPLE TOP",
    price: "$15.00",
    oldPrice: "$25.00",
    color: "Brown",
    image: "/assets/products/top-brown.svg"
  }
];

export function Hero() {
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveProduct((current) => (current + 1) % heroProducts.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const product = heroProducts[activeProduct];

  return (
    <section className="hero-banner">
      <div className="hero-banner__left">
        <div className="hero-banner__image" aria-hidden="true" />
        <div className="hero-banner__overlay" />

        <aside className="hero-share">
          <span>SHARE US</span>
          <div className="hero-share__icons">
            {["f", "x", "in", "o"].map((icon) => (
              <button type="button" key={icon} aria-label={`Share on ${icon}`}>
                {icon}
              </button>
            ))}
          </div>
        </aside>

        <div className="hero-copy hero-copy--overlay">
          <p className="hero-count">
            <strong>{heroContent.count}</strong>
            <span>/ 03</span>
          </p>
          <h1>{heroContent.title}</h1>
          <p className="hero-text hero-text--light">{heroContent.description}</p>
          <a href="/" onClick={(event) => event.preventDefault()} className="hero-shop-button">
            SHOP NOW
            <span>»</span>
          </a>
        </div>

        <div className="hero-hotspot hero-hotspot--top">
          <button type="button" aria-label="Featured product point">
            +
          </button>
          <span>{heroContent.topHotspot}</span>
        </div>

        <div className="hero-hotspot hero-hotspot--bottom">
          <button type="button" aria-label="Featured product point">
            +
          </button>
          <span>{heroContent.bottomHotspot}</span>
        </div>

        <div className="partner-strip">
          <span className="partner-strip__label">PARTNERS</span>
          <div className="partner-strip__viewport">
            <div className="partner-strip__track">
              {["VOGUE", "VOGUE", "VOGUE", "VOGUE"].map((partner, index) => (
                <span key={`${partner}-${index}`}>{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-banner__right">
        <div className="product-showcase">
          <article className="showcase-card">
            <p className="showcase-card__label">{product.label}</p>
            <h2>{product.name}</h2>
            <div className="showcase-media">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="showcase-card__price">
              <strong>{product.price}</strong>
              <span>{product.oldPrice}</span>
            </div>
            <p className="showcase-card__color">
              COLOR:<span>{product.color}</span>
            </p>
            <button type="button">ADD TO CART »</button>
          </article>

          <div className="showcase-dots" aria-label="Product slides">
            {heroProducts.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === activeProduct ? "is-active" : ""}
                onClick={() => setActiveProduct(index)}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

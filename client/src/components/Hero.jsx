import { useEffect, useState } from "react";

const heroSlides = [
  {
    id: 1,
    count: "01",
    title: "Modern and trending fashion for everyone",
    description:
      "Fashion allows individuals to showcase their personality, creativity, and cultural identity, while also serving practical purposes such as protection and comfort.",
    topHotspot: "Down Cotton Tshirt for Women",
    bottomHotspot: "Girls Frock Dress"
  },
  {
    id: 2,
    count: "02",
    title: "Modern and timeless clothes from the best stylists.",
    description:
      "These dresses are often bold and eye-catching, and they can be dressed up or down depending on the occasion.",
    topHotspot: "Cotton Hat",
    bottomHotspot: "Junior Sweatshirt Kids"
  },
  {
    id: 3,
    count: "03",
    title: "Make a Great Impression By Wearing The Right Clothes",
    description:
      "Denim is always a classic, and it's no exception in 2023. Denim jackets, jeans, and skirts are all popular trends this year.",
    topHotspot: "Pro Blue Running Sports",
    bottomHotspot: "Rust Solid Culottes"
  }
];

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

const partners = ["VOGUE", "VOGUE", "VOGUE", "VOGUE"];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    const textTimer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);

    const productTimer = window.setInterval(() => {
      setActiveProduct((current) => (current + 1) % heroProducts.length);
    }, 4000);

    return () => {
      window.clearInterval(textTimer);
      window.clearInterval(productTimer);
    };
  }, []);

  const slide = heroSlides[activeSlide];
  const product = heroProducts[activeProduct];

  return (
    <section className="hero-banner">
      <div className="hero-banner__left">
        <div className="hero-banner__image" aria-hidden="true" />
        <div className="hero-banner__overlay" />


        <div className="hero-copy hero-copy--overlay">
          <div className="home-banner-content">
            <div
              className="home-slider"
              style={{
                width: `${heroSlides.length * 684}px`,
                left: `${activeSlide * -684}px`,
                top: "0px",
                zIndex: 999,
                opacity: 1
              }}
            >
              {heroSlides.map((item, index) => (
                <article
                  key={item.id}
                  className="slick-slide hero-slide"
                  data-slick-index={index}
                  aria-hidden={index !== activeSlide}
                  style={{ width: "684px" }}
                >
                  <p className="hero-count">
                    <strong>{item.count}</strong>
                    <span>/ 03</span>
                  </p>

                  <div className="home-banner-content-inner">
                    <div className="banner-content-inner">
                      <div className="section-title">
                        <h1>{item.title}</h1>
                      </div>
                      <p className="hero-text hero-text--light">{item.description}</p>
                      <a
                        href="/"
                        onClick={(event) => event.preventDefault()}
                        className="hero-shop-button"
                      >
                        SHOP NOW
                        <span>»</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-hotspot hero-hotspot--top">
          <button type="button" aria-label="Featured product point">
            +
          </button>
          <span>{slide.topHotspot}</span>
        </div>

        <div className="hero-hotspot hero-hotspot--bottom">
          <button type="button" aria-label="Featured product point">
            +
          </button>
          <span>{slide.bottomHotspot}</span>
        </div>

        <div className="partner-strip">
          <span className="partner-strip__label">PARTNERS</span>
          <div className="partner-strip__viewport">
            <div className="partner-strip__track">
              {partners.concat(partners).map((partner, index) => (
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

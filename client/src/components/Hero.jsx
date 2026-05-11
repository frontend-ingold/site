export function Hero() {
  return (
    <section className="hero-section container">
      <div className="hero-copy">
        <p className="eyebrow">Multi-category fashion store</p>
        <h1>Style the season with bold essentials.</h1>
        <p className="hero-text">
          A static storefront concept for clothing, accessories, and lifestyle drops with a premium editorial feel.
        </p>
        <div className="hero-actions">
          <a href="/" onClick={(event) => event.preventDefault()} className="primary-button">
            Shop Collection
          </a>
          <a href="/" onClick={(event) => event.preventDefault()} className="secondary-button">
            Explore Lookbook
          </a>
        </div>
        <div className="hero-stats">
          <div>
            <strong>250+</strong>
            <span>new arrivals</span>
          </div>
          <div>
            <strong>18</strong>
            <span>curated edits</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>customer rating</span>
          </div>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-card hero-card-large">
          <span>Women Edit</span>
          <strong>Soft tailoring</strong>
        </div>
        <div className="hero-card hero-card-tall">
          <span>Men Studio</span>
          <strong>Urban layers</strong>
        </div>
        <div className="hero-card hero-card-wide">
          <span>Accessories</span>
          <strong>Statement details</strong>
        </div>
      </div>
    </section>
  );
}

const navItems = ["Home", "Women", "Men", "Kids", "Accessories", "Sale"];

export function Header() {
  return (
    <header className="site-header">
      <div className="top-strip">
        <span>Free shipping on orders over $99</span>
        <span>New season arrivals are live</span>
      </div>
      <div className="nav-row container">
        <div className="brand-mark">
          <span className="brand-badge">DH</span>
          <div>
            <p>Dress House</p>
            <span>Fashion Marketplace</span>
          </div>
        </div>

        <nav className="main-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button type="button">Search</button>
          <button type="button">Account</button>
          <button type="button" className="cart-button">
            Cart (02)
          </button>
        </div>
      </div>
    </header>
  );
}

const navItems = ["ALL CATEGORY", "Shop", "PAGES", "BLOGS", "COLLECTIONS"];

export function Header() {
  return (
    <header className="site-header">
      <div className="nav-row hero-nav-shell">
        <button type="button" className="menu-block">
          <span className="menu-block__icon" />
          <span>MENU</span>
        </button>

        <div className="brand-mark brand-mark--hero">
          <p>VOGUE</p>
        </div>

        <nav className="main-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
              <span className="nav-caret">▼</span>
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button type="button">Log In</button>
          <button type="button" className="nav-pill">
            USD
          </button>
          <button type="button" className="nav-pill">
            English
          </button>
          <button type="button">Search</button>
          <button type="button">CART(0)</button>
        </div>
      </div>
    </header>
  );
}

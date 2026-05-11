const footerColumns = {
  shop: [
    "Women's Vintage Polka Dot",
    "Women's 34-Sleeve Skater Dress",
    "Girls Frock Dress",
    "Girls Casual Dress",
    "Baby Girls Frocks Dress",
    "Baby Girl's Bodycon Midi Dress"
  ],
  extras: ["Search", "All collections", "All products", "My Cart"],
  categories: ["Cloths", "Dress", "Hats", "Jeans", "shoes", "Sweater", "westen top", "Women Top"],
  quickLinks: [
    "About us",
    "Contact with Us",
    "Faq's",
    "Privacy Policy",
    "Shipping & Delivery",
    "Terms & Conditions"
  ]
};

const socialItems = ["▶", "◉", "◎", "X"];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-layout">
        <div className="footer-brand-block">
          <p>
            The Modern Dress is a great piece for the spring and summer. The beautiful open back
            with structured shoulders will great on all ages and body types, while the slouchy fit
            can be dressed up or down depending on your mood.
          </p>

          <div className="footer-socials">
            {socialItems.map((item) => (
              <a href="/" key={item} onClick={(event) => event.preventDefault()} aria-label={`Social ${item}`}>
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-menu-column">
          <h3>Shop:</h3>
          {footerColumns.shop.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>

        <div className="footer-menu-column">
          <h3>Extras:</h3>
          {footerColumns.extras.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>

        <div className="footer-menu-column">
          <h3>Categories:</h3>
          {footerColumns.categories.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>

        <div className="footer-menu-column">
          <h3>Quick Links:</h3>
          {footerColumns.quickLinks.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

const footerLinks = ["About", "Shop", "Journal", "Support", "Contact"];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div>
          <h3>Dress House</h3>
          <p>Static storefront concept in React, ready for future API and PostgreSQL integration.</p>
        </div>
        <div className="footer-links">
          {footerLinks.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

import { NavLink } from "react-router-dom";

export function Header({ contact }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink className="brand" to="/">
          <span className="brand-mark">UC</span>
          <span>
            <strong>UrbanCare</strong>
            <small>Home Services</small>
          </span>
        </NavLink>
        <nav className="header-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/services">Services</NavLink>
          <a href="/#about">About</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#reviews">Reviews</a>
        </nav>
        <a className="header-contact" href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
          {contact.phone}
        </a>
      </div>
    </header>
  );
}

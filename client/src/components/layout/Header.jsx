import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Header({ contact }) {
  const { isAuthenticated, user, logout } = useAuth();

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
          {isAuthenticated ? <NavLink to="/my-services">My Services</NavLink> : null}
          <a href="/#about">About</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#reviews">Reviews</a>
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="header-user">Hi, {user.fullName.split(" ")[0]}</span>
              <button type="button" className="header-auth-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="header-auth-link" to="/login">
                Login
              </NavLink>
              <NavLink className="header-auth-button" to="/register">
                Register
              </NavLink>
            </>
          )}
          <a className="header-contact" href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
            {contact.phone}
          </a>
        </div>
      </div>
    </header>
  );
}

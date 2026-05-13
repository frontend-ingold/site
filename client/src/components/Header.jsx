import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navItems = [
  { label: "ALL CATEGORY", href: "#/" },
  { label: "Shop", href: "#/" },
  { label: "PAGES", href: "#/" },
  { label: "BLOGS", href: "#/" },
  { label: "COLLECTIONS", href: "#/" }
];

const pagesLinks = [
  "About us",
  "Contact with Us",
  "Faq's",
  "Privacy Policy",
  "Shipping & Delivery",
  "Terms & Conditions"
];

const blogLinks = ["Blogs Page", "Article Page"];

const localPanelLabels = new Set(["PAGES", "BLOGS", "COLLECTIONS"]);
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://clothsapi.vercel.app");

export function Header({ alwaysSolid = false }) {
  const { itemCount, openCart } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(alwaysSolid);
  const [menuGroups, setMenuGroups] = useState([]);
  const [shopCards, setShopCards] = useState([]);
  const [openNavLabel, setOpenNavLabel] = useState(null);
  const [activeMenuGroupId, setActiveMenuGroupId] = useState(null);

  useEffect(() => {
    if (alwaysSolid) {
      setIsScrolled(true);
      setIsVisible(true);
      return undefined;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeaderState = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY;
      const topVisibleThreshold = 8;
      const topThreshold = Math.max(48, window.innerHeight * 0.1);
      const atTop = currentScrollY <= topVisibleThreshold;
      const inTopHideZone = currentScrollY > topVisibleThreshold && currentScrollY <= topThreshold;

      setIsScrolled(!atTop);

      if (atTop) {
        setIsVisible(true);
      } else if (inTopHideZone) {
        setIsVisible(false);
      } else {
        setIsVisible(scrollingUp);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryMenu() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/category-menu`);
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setMenuGroups(data.groups ?? []);
          setShopCards(data.shopCards ?? []);
          setActiveMenuGroupId(data.groups?.[0]?.id ?? null);
        }
      } catch (error) {
        console.error("Failed to load category menu", error);
      }
    }

    loadCategoryMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const promoImage = useMemo(() => {
    return (
      menuGroups.find((group) => group.id === activeMenuGroupId)?.promoImageUrl ||
      menuGroups.find((group) => group.promoImageUrl)?.promoImageUrl ||
      "/assets/hero/banner-img.webp"
    );
  }, [activeMenuGroupId, menuGroups]);

  const isSharedPanelOpen = openNavLabel !== null && !localPanelLabels.has(openNavLabel);
  const accountLabel = isLoggedIn
    ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.email || "My Account"
    : "Log In";

  function renderLocalPanelContent(label) {
    if (label === "PAGES") {
      return (
        <div className="nav-simple-panel">
          {pagesLinks.map((item) => (
            <a href="#/" key={item} className="nav-simple-panel__link" onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>
      );
    }

    if (label === "BLOGS") {
      return (
        <div className="nav-simple-panel">
          {blogLinks.map((item) => (
            <a href="#/" key={item} className="nav-simple-panel__link" onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>
      );
    }

    if (label === "COLLECTIONS") {
      return (
        <div className="nav-simple-panel nav-simple-panel--collections">
          {shopCards.map((item) => (
            <a href={item.href} key={item.id} className="nav-simple-panel__link">
              {item.title}
            </a>
          ))}
        </div>
      );
    }

    return null;
  }

  function renderSharedPanelContent() {
    if (openNavLabel === "Shop") {
      return (
        <div className="nav-card-panel">
          {shopCards.map((item) => (
            <a href={item.href} key={item.id} className="nav-card-panel__item" onClick={() => setOpenNavLabel(null)}>
              <img src={item.image} alt={item.title} />
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      );
    }

    return (
      <div className="nav-mega-menu__content">
        <div className="nav-mega-menu__columns">
          {menuGroups.map((group) => (
            <div
              className={`nav-mega-menu__group ${group.id === activeMenuGroupId ? "nav-mega-menu__group--active" : ""}`}
              key={group.id}
              onMouseEnter={() => setActiveMenuGroupId(group.id)}
            >
              <h3>{group.name}</h3>
              <div className="nav-mega-menu__links">
                {group.items.map((menuItem) => (
                  <a href={menuItem.href} key={menuItem.id} onClick={() => setOpenNavLabel(null)}>
                    {menuItem.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="nav-mega-menu__media" aria-hidden="true">
          <img src={promoImage} alt="" />
        </div>
      </div>
    );
  }

  return (
    <header
      className={`site-header ${isVisible ? "site-header--visible" : "site-header--hidden"} ${isScrolled ? "site-header--scrolled" : ""}`}
    >
      <div className="header-mega-menu-shell" onMouseLeave={() => setOpenNavLabel(null)}>
        <div className="nav-row hero-nav-shell">
          <a href="#/" className="brand-mark brand-mark--hero" aria-label="Go to homepage">
            <p>VOGUE</p>
          </a>

          <nav className="main-nav" aria-label="Primary">
            {navItems.map((item) => {
              const isOpen = openNavLabel === item.label;
              const hasLocalPanel = localPanelLabels.has(item.label);

              return (
                <div
                  key={item.label}
                  className={`nav-mega-menu ${isOpen ? "nav-mega-menu--open" : ""}`}
                  onMouseEnter={() => setOpenNavLabel(item.label)}
                  onFocus={() => setOpenNavLabel(item.label)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenNavLabel(null);
                    }
                  }}
                >
                  <button type="button" className="nav-mega-menu__trigger">
                    <span>{item.label}</span>
                    <span className={`nav-caret nav-caret--animated ${isOpen ? "nav-caret--open" : ""}`}>▼</span>
                  </button>

                  {hasLocalPanel ? <div className={`nav-inline-panel ${isOpen ? "nav-inline-panel--open" : ""}`}>{renderLocalPanelContent(item.label)}</div> : null}
                </div>
              );
            })}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="header-inline-action"
              onClick={async () => {
                if (isLoggedIn) {
                  await logout();
                  window.location.hash = "/";
                  return;
                }

                window.location.hash = "/login";
              }}
            >
              <span className="header-inline-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 21C4 17.6863 7.58172 15 12 15C16.4183 15 20 17.6863 20 21"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{accountLabel}</span>
              <span className="nav-caret">{isLoggedIn ? "↗" : "▼"}</span>
            </button>

            <button type="button" className="nav-pill nav-pill--flag">
              <img src="/assets/hero/usd.svg" alt="USD flag" />
              <span>USD</span>
              <span className="nav-caret">▼</span>
            </button>

            <button type="button" className="nav-pill nav-pill--flag">
              <img src="/assets/hero/en.svg" alt="English flag" />
              <span>English</span>
              <span className="nav-caret">▼</span>
            </button>

            <button type="button" className="header-icon-button" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <button type="button" className="header-inline-action header-inline-action--cart" onClick={openCart}>
              <span className="header-inline-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 5H5L7 15H18L20 8H8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="19" r="1.6" fill="currentColor" />
                  <circle cx="17" cy="19" r="1.6" fill="currentColor" />
                </svg>
              </span>
              <span>CART({itemCount})</span>
            </button>
          </div>
        </div>

        {isSharedPanelOpen ? (
          <div className="header-shared-panel header-shared-panel--open">
            <div className="nav-mega-menu__panel">{renderSharedPanelContent()}</div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";
import { blogMenuItems, pageMenuItems } from "../data/navigationPages";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://clothsapi.vercel.app");

const languageFlags = {
  en: "https://flagcdn.com/w40/gb.png",
  de: "https://flagcdn.com/w40/de.png",
  fr: "https://flagcdn.com/w40/fr.png"
};

const currencies = [
  { code: "USD", flag: "https://flagcdn.com/w40/us.png" },
  { code: "EUR", flag: "https://flagcdn.com/w40/eu.png" },
  { code: "INR", flag: "https://flagcdn.com/w40/in.png" }
];

export function Header({ alwaysSolid = false }) {
  const { itemCount, openCart } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t, languages } = useLanguage();
  const closeNavTimeoutRef = useRef(null);
  const accountMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(alwaysSolid);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= 960
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuGroups, setMenuGroups] = useState([]);
  const [shopCards, setShopCards] = useState([]);
  const [openNavLabel, setOpenNavLabel] = useState(null);
  const [activeMenuGroupId, setActiveMenuGroupId] = useState(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const navItems = [
    { label: t("header.allCategory") },
    { label: t("header.shop") },
    { label: t("header.pages") },
    { label: t("header.blogs") },
    { label: t("header.collections") }
  ];

  const localPanelLabels = new Set([t("header.pages"), t("header.blogs"), t("header.collections")]);
  const activeLanguage = languages.find((item) => item.code === language) ?? languages[0];
  const activeCurrency = currencies.find((item) => item.code === currency) ?? currencies[0];

  useEffect(() => {
    function handleResize() {
      const nextIsMobile = window.innerWidth <= 960;
      setIsMobileViewport(nextIsMobile);

      if (!nextIsMobile) {
        setIsMobileMenuOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    function handlePointerDown(event) {
      if (!accountMenuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }

      if (!currencyMenuRef.current?.contains(event.target)) {
        setIsCurrencyMenuOpen(false);
      }

      if (!languageMenuRef.current?.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isSearchOpen || searchProducts.length > 0 || shopCards.length === 0) {
      return undefined;
    }

    let isMounted = true;

    async function loadSearchProducts() {
      setIsSearchLoading(true);

      try {
        const responses = await Promise.all(
          shopCards.map(async (item) => {
            const response = await fetch(`${apiBaseUrl}/api/collections/${item.slug}`);

            if (!response.ok) {
              throw new Error(`Failed with status ${response.status}`);
            }

            const data = await response.json();
            return (data.products ?? []).map((product) => ({
              ...product,
              collectionSlug: item.slug,
              collectionTitle: item.title
            }));
          })
        );

        if (isMounted) {
          setSearchProducts(responses.flat());
        }
      } catch (error) {
        console.error("Failed to load search products", error);
      } finally {
        if (isMounted) {
          setIsSearchLoading(false);
        }
      }
    }

    loadSearchProducts();

    return () => {
      isMounted = false;
    };
  }, [isSearchOpen, searchProducts.length, shopCards]);

  useEffect(() => {
    if (!isSearchOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const promoImage = useMemo(() => {
    return (
      menuGroups.find((group) => group.id === activeMenuGroupId)?.promoImageUrl ||
      menuGroups.find((group) => group.promoImageUrl)?.promoImageUrl ||
      "/assets/hero/banner-img.webp"
    );
  }, [activeMenuGroupId, menuGroups]);

  const isSharedPanelOpen =
    !isMobileViewport && openNavLabel !== null && !localPanelLabels.has(openNavLabel);
  const searchablePages = useMemo(() => [...pageMenuItems, ...blogMenuItems], []);
  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return {
        pages: searchablePages.slice(0, 4),
        collections: shopCards.slice(0, 4),
        products: searchProducts.slice(0, 6)
      };
    }

    const matches = (value) => String(value ?? "").toLowerCase().includes(normalizedQuery);

    return {
      pages: searchablePages.filter((item) => matches(item.label)).slice(0, 6),
      collections: shopCards.filter((item) => matches(item.title) || matches(item.slug)).slice(0, 6),
      products: searchProducts
        .filter(
          (item) =>
            matches(item.name) ||
            matches(item.brand) ||
            matches(item.category) ||
            matches(item.collectionTitle) ||
            matches(item.optionValue)
        )
        .slice(0, 8)
    };
  }, [searchProducts, searchQuery, searchablePages, shopCards]);

  const accountLabel = isLoggedIn
    ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.email || "My Account"
    : t("header.logIn");

  function closeUtilityMenus() {
    setIsAccountMenuOpen(false);
    setIsCurrencyMenuOpen(false);
    setIsLanguageMenuOpen(false);
  }

  function clearPendingNavClose() {
    if (closeNavTimeoutRef.current !== null) {
      window.clearTimeout(closeNavTimeoutRef.current);
      closeNavTimeoutRef.current = null;
    }
  }

  function scheduleNavClose() {
    clearPendingNavClose();
    closeNavTimeoutRef.current = window.setTimeout(() => {
      setOpenNavLabel(null);
      closeNavTimeoutRef.current = null;
    }, 140);
  }

  function closeMobileMenu() {
    clearPendingNavClose();
    setIsMobileMenuOpen(false);
    setOpenNavLabel(null);
    closeUtilityMenus();
  }

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery("");
  }

  function openSearch() {
    clearPendingNavClose();
    setOpenNavLabel(null);
    closeUtilityMenus();
    setIsMobileMenuOpen(false);
    setIsSearchOpen(true);
  }

  useEffect(() => {
    return () => {
      clearPendingNavClose();
    };
  }, []);

  function renderSimpleLinks(items) {
    return (
      <div className="nav-simple-panel">
        {items.map((item) => (
          <a
            href={item.href}
            key={item.key}
            className="nav-simple-panel__link"
            onClick={() => {
              setOpenNavLabel(null);
              if (isMobileViewport) {
                closeMobileMenu();
              }
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    );
  }

  function renderCollectionsLinks() {
    return (
      <div className="nav-simple-panel nav-simple-panel--collections">
        {shopCards.map((item) => (
          <a href={item.href} key={item.id} className="nav-simple-panel__link" onClick={(event) => event.preventDefault()}>
            {item.title}
          </a>
        ))}
      </div>
    );
  }

  function renderShopCards() {
    return (
      <div className="nav-card-panel">
        {shopCards.slice(0, 4).map((item) => (
          <a
            href={item.href}
            key={item.id}
            className="nav-card-panel__item"
            onClick={(event) => {
              event.preventDefault();
              setOpenNavLabel(null);
              if (isMobileViewport) {
                closeMobileMenu();
              }
            }}
          >
            <img src={item.image} alt={item.title} />
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    );
  }

  function renderAllCategoryPanel() {
    return (
      <div className="nav-mega-menu__content">
        <div className="nav-mega-menu__columns">
          {menuGroups.map((group) => (
            <div
              className={`nav-mega-menu__group ${group.id === activeMenuGroupId ? "nav-mega-menu__group--active" : ""}`}
              key={group.id}
              onMouseEnter={() => {
                if (!isMobileViewport) {
                  setActiveMenuGroupId(group.id);
                }
              }}
            >
              <h3>{group.name}</h3>
              <div className="nav-mega-menu__links">
                {group.items.map((menuItem) => (
                  <a
                    href={menuItem.href}
                    key={menuItem.id}
                    onClick={(event) => {
                      event.preventDefault();
                      setOpenNavLabel(null);
                      if (isMobileViewport) {
                        closeMobileMenu();
                      }
                    }}
                  >
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

  function renderPanelContent(label) {
    if (label === t("header.pages")) {
      return renderSimpleLinks(pageMenuItems);
    }

    if (label === t("header.blogs")) {
      return renderSimpleLinks(blogMenuItems);
    }

    if (label === t("header.collections")) {
      return renderCollectionsLinks();
    }

    if (label === t("header.shop")) {
      return renderShopCards();
    }

    return renderAllCategoryPanel();
  }

  return (
    <header
      className={`site-header ${isVisible ? "site-header--visible" : "site-header--hidden"} ${isScrolled ? "site-header--scrolled" : ""}`}
    >
      <div
        className="header-mega-menu-shell"
        onMouseEnter={() => {
          if (!isMobileViewport) {
            clearPendingNavClose();
          }
        }}
        onMouseLeave={() => {
          if (!isMobileViewport) {
            scheduleNavClose();
          }
        }}
      >
        <div className="nav-row hero-nav-shell">
          <a
            href="#/"
            className="brand-mark brand-mark--hero"
            aria-label="Go to homepage"
            onClick={() => {
              closeMobileMenu();
            }}
          >
            <p>VOGUE</p>
          </a>

          {isMobileViewport ? (
            <div className="header-mobile-quick">
              <button
                type="button"
                className="header-icon-button"
                aria-label={isLoggedIn ? accountLabel : t("header.logIn")}
                onClick={() => {
                  if (!isLoggedIn) {
                    window.location.hash = "/login";
                    return;
                  }

                  setIsAccountMenuOpen((current) => !current);
                  setIsCurrencyMenuOpen(false);
                  setIsLanguageMenuOpen(false);
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
              </button>

              <button type="button" className="header-icon-button" aria-label="Search" onClick={openSearch}>
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>

              <button
                type="button"
                className="header-icon-button header-icon-button--cart"
                aria-label={`${t("header.cart")} (${itemCount})`}
                onClick={openCart}
              >
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
                {itemCount > 0 ? <span className="header-icon-badge">{itemCount}</span> : null}
              </button>
            </div>
          ) : null}

          <button
            type="button"
            className={`header-menu-toggle ${isMobileMenuOpen ? "header-menu-toggle--open" : ""}`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            onClick={() => {
              setIsMobileMenuOpen((current) => {
                const next = !current;
                if (!next) {
                  setOpenNavLabel(null);
                  closeUtilityMenus();
                }
                return next;
              });
            }}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`header-mobile-panel ${isMobileMenuOpen ? "header-mobile-panel--open" : ""}`}>
            <div className="header-mobile-panel__inner">
              <nav className="main-nav" aria-label="Primary">
                {navItems.map((item) => {
                  const isOpen = openNavLabel === item.label;
                  const shouldRenderInlinePanel = isMobileViewport || localPanelLabels.has(item.label);

                  return (
                    <div
                      key={item.label}
                      className={`nav-mega-menu ${isOpen ? "nav-mega-menu--open" : ""}`}
                      onMouseEnter={() => {
                        if (!isMobileViewport) {
                          clearPendingNavClose();
                          setOpenNavLabel(item.label);
                        }
                      }}
                      onFocus={() => {
                        if (!isMobileViewport) {
                          setOpenNavLabel(item.label);
                        }
                      }}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget) && !isMobileViewport) {
                          setOpenNavLabel(null);
                        }
                      }}
                    >
                      <button
                        type="button"
                        className="nav-mega-menu__trigger"
                        onClick={() => {
                          if (isMobileViewport) {
                            setOpenNavLabel((current) => (current === item.label ? null : item.label));
                            return;
                          }

                          setOpenNavLabel((current) => (current === item.label ? null : item.label));
                        }}
                      >
                        <span>{item.label}</span>
                        <span className={`nav-caret nav-caret--animated ${isOpen ? "nav-caret--open" : ""}`}>▼</span>
                      </button>

                      {shouldRenderInlinePanel && isOpen ? (
                        <div className="nav-inline-panel nav-inline-panel--open">{renderPanelContent(item.label)}</div>
                      ) : null}
                    </div>
                  );
                })}
              </nav>

              <div className="nav-actions">
                <div className={`account-menu ${isAccountMenuOpen ? "account-menu--open" : ""}`} ref={accountMenuRef}>
                  <button
                    type="button"
                    className="header-inline-action"
                    onClick={() => {
                      if (!isLoggedIn) {
                        closeMobileMenu();
                        window.location.hash = "/login";
                        return;
                      }

                      setIsAccountMenuOpen((current) => !current);
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
                    <span className={`nav-caret nav-caret--animated ${isAccountMenuOpen ? "nav-caret--open" : ""}`}>▼</span>
                  </button>

                  {isLoggedIn ? (
                    <div className={`account-menu__panel ${isAccountMenuOpen ? "account-menu__panel--open" : ""}`}>
                      <button
                        type="button"
                        className="account-menu__item"
                        onClick={() => {
                          closeMobileMenu();
                          window.location.hash = "/wishlist";
                        }}
                      >
                        {t("header.myWishList")}
                      </button>
                      <button
                        type="button"
                        className="account-menu__item"
                        onClick={() => {
                          closeMobileMenu();
                          window.location.hash = "/my-orders";
                        }}
                      >
                        {t("header.myOrders")}
                      </button>
                      <button
                        type="button"
                        className="account-menu__item"
                        onClick={() => {
                          closeMobileMenu();
                          window.location.hash = "/my-address";
                        }}
                      >
                        {t("header.myAddress")}
                      </button>
                      <button
                        type="button"
                        className="account-menu__item account-menu__item--danger"
                        onClick={async () => {
                          closeMobileMenu();
                          await logout();
                          window.location.hash = "/";
                        }}
                      >
                        {t("header.logOut")}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className={`header-picker ${isCurrencyMenuOpen ? "header-picker--open" : ""}`} ref={currencyMenuRef}>
                  <button
                    type="button"
                    className="nav-pill nav-pill--flag nav-pill--currency"
                    onClick={() => {
                      setIsCurrencyMenuOpen((current) => !current);
                    }}
                    aria-haspopup="menu"
                    aria-expanded={isCurrencyMenuOpen ? "true" : "false"}
                  >
                    <img className="header-picker__flag-image" src={activeCurrency.flag} alt={activeCurrency.code} />
                    <span>{activeCurrency.code}</span>
                    <span className={`nav-caret nav-caret--animated ${isCurrencyMenuOpen ? "nav-caret--open" : ""}`}>▼</span>
                  </button>

                  <div className={`header-picker__panel ${isCurrencyMenuOpen ? "header-picker__panel--open" : ""}`} role="menu">
                    {currencies.map((item) => (
                      <button
                        type="button"
                        key={item.code}
                        className={`header-picker__item ${item.code === currency ? "is-active" : ""}`}
                        onClick={() => {
                          setCurrency(item.code);
                          setIsCurrencyMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <img className="header-picker__flag-image" src={item.flag} alt={item.code} />
                        <span>{item.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`header-picker ${isLanguageMenuOpen ? "header-picker--open" : ""}`} ref={languageMenuRef}>
                  <button
                    type="button"
                    className="nav-pill nav-pill--flag nav-pill--language"
                    onClick={() => {
                      setIsLanguageMenuOpen((current) => !current);
                    }}
                    aria-haspopup="menu"
                    aria-expanded={isLanguageMenuOpen ? "true" : "false"}
                  >
                    <img
                      className="header-picker__flag-image"
                      src={languageFlags[activeLanguage.code] ?? languageFlags.en}
                      alt={activeLanguage.label}
                    />
                    <span>{activeLanguage.label}</span>
                    <span className={`nav-caret nav-caret--animated ${isLanguageMenuOpen ? "nav-caret--open" : ""}`}>▼</span>
                  </button>

                  <div className={`header-picker__panel ${isLanguageMenuOpen ? "header-picker__panel--open" : ""}`} role="menu">
                    {languages.map((item) => (
                      <button
                        type="button"
                        key={item.code}
                        className={`header-picker__item ${item.code === language ? "is-active" : ""}`}
                        onClick={() => {
                          setLanguage(item.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <img
                          className="header-picker__flag-image"
                          src={languageFlags[item.code] ?? languageFlags.en}
                          alt={item.label}
                        />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" className="header-icon-button" aria-label="Search" onClick={openSearch}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="header-inline-action header-inline-action--cart"
                  onClick={() => {
                    closeMobileMenu();
                    openCart();
                  }}
                >
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
                  <span>
                    {t("header.cart")}({itemCount})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSharedPanelOpen ? (
          <div
            className="header-shared-panel header-shared-panel--open"
            onMouseEnter={() => {
              clearPendingNavClose();
            }}
            onMouseLeave={() => {
              scheduleNavClose();
            }}
          >
            <div className="nav-mega-menu__panel">{renderPanelContent(openNavLabel)}</div>
          </div>
        ) : null}

        {isSearchOpen ? (
          <div className="header-search" role="dialog" aria-modal="true" aria-label="Search">
            <button type="button" className="header-search__backdrop" aria-label="Close search" onClick={closeSearch} />
            <div className="header-search__panel">
              <div className="header-search__head">
                <div className="header-search__field">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products, collections, or pages"
                    autoFocus
                  />
                </div>
                <button type="button" className="header-search__close" onClick={closeSearch} aria-label="Close search">
                  &times;
                </button>
              </div>

              <div className="header-search__content">
                <section className="header-search__group">
                  <div className="header-search__label-row">
                    <span>Pages</span>
                  </div>
                  <div className="header-search__list">
                    {searchResults.pages.length ? (
                      searchResults.pages.map((item) => (
                        <a href={item.href} key={item.key} className="header-search__item" onClick={closeSearch}>
                          <strong>{item.label}</strong>
                          <span>Static page</span>
                        </a>
                      ))
                    ) : (
                      <p className="header-search__empty">No matching pages.</p>
                    )}
                  </div>
                </section>

                <section className="header-search__group">
                  <div className="header-search__label-row">
                    <span>Collections</span>
                  </div>
                  <div className="header-search__list">
                    {searchResults.collections.length ? (
                      searchResults.collections.map((item) => (
                        <a
                          href={`#/collections/${item.slug}`}
                          key={item.id}
                          className="header-search__item header-search__item--media"
                          onClick={closeSearch}
                        >
                          <img src={item.image} alt={item.title} />
                          <div className="header-search__item-copy">
                            <strong>{item.title}</strong>
                            <span>{item.itemCount} items</span>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="header-search__empty">No matching collections.</p>
                    )}
                  </div>
                </section>

                <section className="header-search__group">
                  <div className="header-search__label-row">
                    <span>Products</span>
                    {isSearchLoading ? <em>Loading</em> : null}
                  </div>
                  <div className="header-search__list">
                    {searchResults.products.length ? (
                      searchResults.products.map((item) => (
                        <a
                          href={`#/collections/${item.collectionSlug}/products/${item.id}`}
                          key={`${item.collectionSlug}-${item.id}`}
                          className="header-search__item header-search__item--media"
                          onClick={closeSearch}
                        >
                          <img src={item.image} alt={item.name} />
                          <div className="header-search__item-copy">
                            <strong>{item.name}</strong>
                            <span>{item.collectionTitle} · {item.brand}</span>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="header-search__empty">
                        {isSearchLoading ? "Loading products..." : "No matching products."}
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

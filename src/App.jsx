import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Eye, Flame, Grid2x2, Heart, Home, ListFilter, Minus, Phone, Plus, Repeat, Search, Settings, ShoppingCart, User } from 'lucide-react';
import { getPageData } from './lib/api.js';

const HOME_HASH = '#/';
const PRODUCT_LIST_PREFIX = '#/product-category/';
const PRODUCT_DETAIL_PREFIX = '#/product/';
const CART_HASH = '#/cart';
const WISHLIST_HASH = '#/wishlist';
const LOGIN_HASH = '#/login';
const REGISTER_HASH = '#/register';
const FORGOT_HASH = '#/forgot-password';
const CHECKOUT_HASH = '#/checkout';
const ACCOUNT_HASH = '#/my-profile';
const ORDERS_HASH = '#/my-orders';
const SUCCESS_PREFIX = '#/success/';
const STORAGE_KEYS = {
  users: 'freshmart-users',
  currentUser: 'freshmart-current-user',
  cart: 'freshmart-cart',
  wishlist: 'freshmart-wishlist',
  orders: 'freshmart-orders'
};

function slugifyCategory(value) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getProductListHash(categoryLabel) {
  if (!categoryLabel || categoryLabel === 'All' || categoryLabel === 'All Categories') {
    return `${PRODUCT_LIST_PREFIX}all`;
  }

  return `${PRODUCT_LIST_PREFIX}${slugifyCategory(categoryLabel)}`;
}

function getProductDetailHash(productSlug) {
  return `${PRODUCT_DETAIL_PREFIX}${productSlug}`;
}

function getSuccessHash(orderId) {
  return `${SUCCESS_PREFIX}${orderId}`;
}

function isProductListRoute(hash) {
  return hash.startsWith(PRODUCT_LIST_PREFIX) || hash === '#/products' || hash === '#products';
}

function isProductDetailRoute(hash) {
  return hash.startsWith(PRODUCT_DETAIL_PREFIX);
}

function isSuccessRoute(hash) {
  return hash.startsWith(SUCCESS_PREFIX);
}

function getRouteCategorySlug(hash) {
  if (hash === '#/products' || hash === '#products') {
    return 'all';
  }

  return hash.startsWith(PRODUCT_LIST_PREFIX)
    ? hash.slice(PRODUCT_LIST_PREFIX.length) || 'all'
    : 'all';
}

function getRouteProductSlug(hash) {
  return hash.startsWith(PRODUCT_DETAIL_PREFIX)
    ? hash.slice(PRODUCT_DETAIL_PREFIX.length)
    : '';
}

function getRouteSuccessOrderId(hash) {
  return hash.startsWith(SUCCESS_PREFIX)
    ? hash.slice(SUCCESS_PREFIX.length)
    : '';
}

function matchesArchiveCategory(product, categorySlug) {
  if (categorySlug === 'all') {
    return true;
  }

  const haystack = `${product.category} ${product.name}`.toLowerCase();
  const categoryMatchers = {
    fruits: ['fruit', 'apple', 'orange', 'grape'],
    vegetable: ['vegetable', 'cauliflower', 'garlic'],
    vegetables: ['vegetable', 'cauliflower', 'garlic'],
    beverages: ['beverage', 'juice'],
    dairy: ['dairy', 'milk', 'cheese'],
    bakery: ['bakery', 'croissant', 'bread'],
    seafood: ['seafood', 'salmon', 'carp', 'fish'],
    'vegan-meat': ['vegan', 'healthy meals', 'salad'],
    'vegan-meals': ['vegan', 'healthy meals', 'salad'],
    'beer-and-liquor': ['beer', 'liquor']
  };

  const matchTerms = categoryMatchers[categorySlug] ?? [categorySlug.replace(/-/g, ' ')];
  return matchTerms.some((term) => haystack.includes(term));
}

function getArchiveTitleFromSlug(categorySlug, categories) {
  if (categorySlug === 'all') {
    return 'All Products';
  }

  const categoryMatch = categories.find((category) => slugifyCategory(category.name) === categorySlug);
  return categoryMatch?.name ?? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getNavHref(label) {
  const archiveLabels = ['Fruits', 'Vegetable', 'Seafood', 'Dairy', 'Bakery', 'Beverages', 'Beer & Liquor', 'Vegan Meat'];
  return archiveLabels.includes(label) ? getProductListHash(label) : HOME_HASH;
}

function navigateToHash(nextHash) {
  if (window.location.hash === nextHash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }

  window.location.hash = nextHash;
}

function getProductSlug(product) {
  return product.slug || slugifyCategory(product.name);
}

function Header({ header, heroSlides, navigation, currentUser, cartCount, wishlistCount, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(navigation.searchCategories[0] ?? 'All Categories');
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    setSelectedCategory(navigation.searchCategories[0] ?? 'All Categories');
  }, [navigation.searchCategories]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!categoryDropdownRef.current?.contains(event.target)) {
        setCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <p>{header.topbarText}</p>
          <div className="top-links">
            {header.topLinks.map((link) => (
              <span key={link.label}>
                {link.label}
                {link.hasArrow ? <ChevronDown size={12} /> : null}
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container header-main">
          <div className="logo">
            <a href={HOME_HASH} onClick={(event) => {
              event.preventDefault();
              navigateToHash(HOME_HASH);
            }}>
              <img src={heroSlides.logo} alt="FreshMart" />
            </a>
          </div>
          <div className="search-box">
            <div className="category-dropdown" ref={categoryDropdownRef}>
              <button className="category-btn" type="button" onClick={() => setCategoryMenuOpen((open) => !open)}>
                {selectedCategory}
                <ChevronDown size={14} />
              </button>
              {categoryMenuOpen ? (
                <div className="category-menu">
                  {navigation.searchCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`category-menu-item ${selectedCategory === category ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryMenuOpen(false);
                        navigateToHash(getProductListHash(category));
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <input placeholder={header.searchPlaceholder} />
            <button className="search-btn"><Search size={20} /></button>
          </div>
          <div className="header-actions">
            <div className="support"><Phone size={20} /><span>Call us<br /><b>{header.phone}</b></span></div>
            <a
              className="header-action-link"
              href={currentUser ? ACCOUNT_HASH : LOGIN_HASH}
              onClick={(event) => {
                event.preventDefault();
                navigateToHash(currentUser ? ACCOUNT_HASH : LOGIN_HASH);
              }}
            >
              <User size={22} />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Login'}</span>
            </a>
            <a
              className="header-action-link"
              href={WISHLIST_HASH}
              onClick={(event) => {
                event.preventDefault();
                navigateToHash(WISHLIST_HASH);
              }}
            >
              <Heart size={22} />
              <span>Wishlist</span>
              {wishlistCount > 0 ? <b>{wishlistCount}</b> : null}
            </a>
            <a
              className="cart-icon header-action-link"
              href={CART_HASH}
              onClick={(event) => {
                event.preventDefault();
                navigateToHash(CART_HASH);
              }}
            >
              <ShoppingCart size={23} />
              <span>Cart</span>
              <b>{cartCount}</b>
            </a>
            {currentUser ? (
              <button type="button" className="header-logout-btn" onClick={onLogout}>Logout</button>
            ) : null}
          </div>
        </div>
      </header>

      <div className={`nav-sticky-wrap ${scrolled ? 'is-sticky' : ''}`}>
        <nav className="container nav-row">
          <div className="category-links">
            {navigation.items.map((item) => (
              <div className={`nav-category-item ${item.columns ? 'has-mega-menu' : ''}`} key={item.label}>
                <a
                  className={item.columns ? 'has-arrow' : ''} href={getNavHref(item.label)}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToHash(getNavHref(item.label));
                  }}
                >
                  {item.label}
                  {item.columns ? <ChevronDown size={14} /> : null}
                </a>
                {item.columns ? (
                  <div className={`nav-mega-menu ${item.megaMenuClass ?? ''}`}>
                    <div className={`nav-mega-inner ${item.promo ? 'with-promo' : ''}`}>
                      {item.columns.map((column) => (
                        <div className="nav-mega-column" key={column.title}>
                          <h4>{column.title}</h4>
                          {column.displayType === 'media' ? (
                            <div className="nav-media-list">
                              {column.items.map((subItem) => (
                                <a className="nav-media-link" key={subItem.label}>
                                  {subItem.image ? <img src={subItem.image} alt={subItem.label} /> : null}
                                  <span>{subItem.label}</span>
                                </a>
                              ))}
                            </div>
                          ) : (
                            <div className="nav-text-list">
                              {column.items.map((subItem) => (
                                <a key={subItem.label}>{subItem.label}</a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {item.promo ? (
                        <div className="nav-mega-promo" style={{ backgroundImage: `url(${item.promo.image})` }}>
                          <p>{item.promo.eyebrow}</p>
                          <h3>{item.promo.title}</h3>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="nav-utilities">
            {navigation.utilities.map((utility) => (
              <a key={utility.label}>
                {utility.label === 'Promotions' ? <Flame size={17} /> : <Bookmark size={17} />}
                {utility.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

function Hero({ hero, heroSlides }) {
  const [heroTitleBefore, heroTitleAfter = ''] = hero.main.title.split(hero.main.highlight);

  return (
    <section className="container hero-showcase reveal">
      <div className="hero-grid hero-grid-redesigned">
        <div className="hero-card big-hero hero-main-panel" style={{ backgroundImage: `url(${heroSlides.main})` }}>
          <div className="hero-copy">
            <p className="eyebrow">{hero.main.eyebrow}</p>
            <h1>{heroTitleBefore}<span>{hero.main.highlight}</span>{heroTitleAfter}</h1>
            <p>{hero.main.description}</p>
            <button className="hero-cta">{hero.main.cta}</button>
            <div className="hero-dots">
              <span className="is-active" />
              <span />
              <span />
            </div>
          </div>
        </div>
        <div className="hero-side-stack">
          <div className="hero-card side-card teal-card" style={{ backgroundImage: `url(${heroSlides.sideOne})` }}>
            <div className="side-copy side-copy-compact">
              <p>{hero.sideOne.title}</p>
              <a>{hero.sideOne.cta}</a>
            </div>
          </div>
          <div className="hero-card side-card split-promo-card">
            <div className="split-promo-top" style={{ backgroundImage: `url(${heroSlides.sideTwo})` }}>
              <div className="side-copy side-copy-compact dark-copy">
                <p>{hero.sideTwo.title}</p>
                <span>{hero.sideTwo.highlight}</span>
              </div>
            </div>
            <div className="split-promo-bottom" style={{ backgroundImage: `url(${heroSlides.sideThree})` }}>
              <div className="side-copy side-copy-compact light-copy">
                <p>{hero.sideThree.title}</p>
                <span>{hero.sideThree.highlight}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-ticker">
        <div className="hero-marquee-track">
          {hero.tickerItems.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
        </div>
      </div>
    </section>
  );
}

function CategorySection({ section, categories }) {
  return (
    <section className="container section reveal">
      <div className="section-title"><h2>{section.title}</h2><a>{section.linkLabel}</a></div>
      <div className="category-grid">
        {categories.map((category) => (
          <a
            className="category-card" href={getProductListHash(category.name)} key={category.name}
            onClick={(event) => {
              event.preventDefault();
              navigateToHash(getProductListHash(category.name));
            }}
          >
            <div className="cat-icon"><img src={category.image} alt={category.name} /></div>
            <h3>{category.name}</h3>
            <p>{category.count}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function DealOfMonthSection({ dealMeta, dealProducts, heroSlides, onAddToCart, onToggleWishlist, wishlistSlugs }) {
  const [timeLeft, setTimeLeft] = useState(dealMeta.countdownSeconds);

  useEffect(() => {
    setTimeLeft(dealMeta.countdownSeconds);
  }, [dealMeta.countdownSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((current) => (current <= 1 ? dealMeta.countdownSeconds : current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [dealMeta.countdownSeconds]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <section className="container section reveal deal-section">
      <div className="deal-layout">
        <aside className="deal-promo-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(33, 35, 63, .92) 0%, rgba(33, 35, 63, .84) 46%, rgba(33, 35, 63, .12) 100%), url(${heroSlides.dealPromo})` }}>
          <div className="deal-promo-copy">
            <p>{dealMeta.promoEyebrow}</p>
            <h3>{dealMeta.promoTitle} <span>{dealMeta.promoAccent}</span></h3>
            <div className="deal-countdown">
              <div><strong>{String(hours).padStart(2, '0')}</strong><span>Hours</span></div>
              <div><strong>{String(minutes).padStart(2, '0')}</strong><span>Minutes</span></div>
              <div><strong>{String(seconds).padStart(2, '0')}</strong><span>Seconds</span></div>
            </div>
          </div>
        </aside>
        <div className="deal-products-wrap">
          <div className="section-title deal-title">
            <h2>{dealMeta.title}</h2>
            <a>{dealMeta.linkLabel}</a>
          </div>
          <div className="deal-products-grid">
            {dealProducts.map((product) => (
              <ProductCard
                key={`deal-${product.name}`}
                product={product}
                compact
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistSlugs.includes(getProductSlug(product))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, compact = false, onAddToCart, onToggleWishlist, isWishlisted = false }) {
  const totalStock = (product.available ?? 0) + (product.sold ?? 0);
  const soldPercent = totalStock > 0 ? ((product.sold ?? 0) / totalStock) * 100 : 0;
  const productHref = getProductDetailHash(getProductSlug(product));

  if (compact) {
    return (
      <div className="discount-card">
        <span className="discount-badge">{product.tag}</span>
        <div className="discount-actions">
          <button
            type="button"
            aria-label="Add to wishlist"
            className={isWishlisted ? 'is-active' : ''}
            onClick={() => onToggleWishlist?.(product)}
          >
            <Heart size={16} />
          </button>
          <button type="button" aria-label="Compare product"><Repeat size={16} /></button>
        </div>
        <a
          className="discount-image"
          href={productHref}
          onClick={(event) => {
            event.preventDefault();
            navigateToHash(productHref);
          }}
        >
          <img src={product.image} alt={product.name} />
        </a>
        <div className="discount-content">
          <h3>
            <a
              href={productHref}
              onClick={(event) => {
                event.preventDefault();
                navigateToHash(productHref);
              }}
            >
              {product.name}
            </a>
          </h3>
          <p className="discount-category">{product.category}</p>
          <div className="discount-meta">
            <div className="price discount-price">
              <b>{product.price}</b>
              <del>{product.oldPrice}</del>
            </div>
            <div className="stars">{'\u2605'.repeat(product.rating)}{'\u2606'.repeat(5 - product.rating)}</div>
          </div>
          <div className="stock-progress">
            <span style={{ width: `${soldPercent}%` }} />
          </div>
          <div className="stock-summary">
            <span>Available: {product.available}</span>
            <span>Sold: {product.sold}</span>
          </div>
        </div>
        <button className="discount-cart-btn" type="button" onClick={() => onAddToCart?.(product)}>ADD TO CART</button>
      </div>
    );
  }

  return (
    <div className="product-card">
      <span className="badge">{product.tag}</span>
      <div className="product-actions">
        <button type="button" className={isWishlisted ? 'is-active' : ''} onClick={() => onToggleWishlist?.(product)}><Heart size={16} /></button>
        <button type="button"><Eye size={16} /></button>
        <button type="button"><Repeat size={16} /></button>
      </div>
      <a
        className="product-image"
        href={productHref}
        onClick={(event) => {
          event.preventDefault();
          navigateToHash(productHref);
        }}
      >
        <img src={product.image} alt={product.name} />
      </a>
      <div className="stars">{'\u2605'.repeat(product.rating)}{'\u2606'.repeat(5 - product.rating)}</div>
      <h3>
        <a
          href={productHref}
          onClick={(event) => {
            event.preventDefault();
            navigateToHash(productHref);
          }}
        >
          {product.name}
        </a>
      </h3>
      <div className="price"><b>{product.price}</b><del>{product.oldPrice}</del></div>
      <button className="cart-btn" type="button" onClick={() => onAddToCart?.(product)}><ShoppingCart size={17} /> Add to Cart</button>
    </div>
  );
}

function ProductsSection({ section, products, onAddToCart, onToggleWishlist, wishlistSlugs }) {
  const sliderRef = useRef(null);

  const scrollDiscounts = (direction) => {
    if (!sliderRef.current) {
      return;
    }

    const card = sliderRef.current.querySelector('.discount-card');
    const gap = 12;
    const cardWidth = card ? card.getBoundingClientRect().width + gap : 220;
    sliderRef.current.scrollBy({
      left: direction * cardWidth * 2,
      behavior: 'smooth'
    });
  };

  return (
    <section className="container section reveal">
      <div className="section-title">
        <div><h2>{section.title}</h2><p>{section.subtitle}</p></div>
        <div className="slider-controls">
          <button type="button" className="slider-btn" aria-label="Previous products" onClick={() => scrollDiscounts(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="slider-btn" aria-label="Next products" onClick={() => scrollDiscounts(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="discount-slider" ref={sliderRef}>
        {products.map((product) => (
          <ProductCard
            key={`${section.title}-${product.name}`}
            product={product}
            compact
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistSlugs.includes(getProductSlug(product))}
          />
        ))}
      </div>
    </section>
  );
}

function PromoBanner({ promo }) {
  return (
    <section className="container promo reveal">
      <div><p>{promo.eyebrow}</p><h2>{promo.title}</h2></div>
      <button className="light-btn">{promo.buttonLabel}</button>
    </section>
  );
}

function VendorSection({ section, vendors }) {
  return (
    <section className="container section reveal">
      <div className="section-title"><h2>{section.title}</h2><a>{section.linkLabel}</a></div>
      <div className="vendor-grid">
        {vendors.map((vendor) => (
          <div className="vendor-card" key={vendor.name}>
            <div className="vendor-head">
              <div className="vendor-logo-box">
                <img src={vendor.logo} alt={vendor.name} />
              </div>
              <div className="vendor-meta">
                <h3>{vendor.name}</h3>
                <div className="stars">{'\u2605'.repeat(vendor.rating)}{'\u2606'.repeat(5 - vendor.rating)}</div>
              </div>
            </div>
            <div className="vendor-product-mosaic">
              <div className="vendor-product-large">
                <img src={vendor.items[0]} alt={`${vendor.name} featured product`} />
              </div>
              <div className="vendor-product-stack">
                <div className="vendor-product-small">
                  <img src={vendor.items[1]} alt={`${vendor.name} product`} />
                </div>
                <div className="vendor-product-small">
                  <img src={vendor.items[2]} alt={`${vendor.name} product`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArticlesSection({ section, articles }) {
  return (
    <section className="container section reveal">
      <div className="section-title"><h2>{section.title}</h2><a>{section.linkLabel}</a></div>
      <div className="article-grid">
        {articles.map((article) => (
          <article className="article-card" key={article.title}>
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="article-body">
              <p className="article-date">{article.date}</p>
              <h3>{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductListPage({ pageData, routeHash, onAddToCart, onToggleWishlist, wishlistSlugs }) {
  const { categories, products, dealMonthProducts, sections } = pageData;
  const archiveMeta = sections.productList;
  const archiveProducts = [...dealMonthProducts, ...products];
  const routeCategorySlug = getRouteCategorySlug(routeHash);
  const routeCategoryTitle = getArchiveTitleFromSlug(routeCategorySlug, categories);
  const [sortBy, setSortBy] = useState(archiveMeta.sortOptions[0] ?? 'Default sorting');
  const [visibleCount, setVisibleCount] = useState(archiveMeta.showOptions?.[0] ?? 12);
  const [priceLimit, setPriceLimit] = useState(archiveMeta.priceRange?.max ?? 10);
  const [pendingPriceLimit, setPendingPriceLimit] = useState(archiveMeta.priceRange?.max ?? 10);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedNutrition, setSelectedNutrition] = useState([]);

  useEffect(() => {
    setPriceLimit(archiveMeta.priceRange?.max ?? 10);
    setPendingPriceLimit(archiveMeta.priceRange?.max ?? 10);
    setSelectedColors([]);
    setSelectedNutrition([]);
  }, [routeHash, archiveMeta.priceRange?.max]);

  const routeProducts = archiveProducts.filter((product) => matchesArchiveCategory(product, routeCategorySlug));
  const availableColors = Array.from(new Set(routeProducts.map((product) => product.accentColor).filter(Boolean)));
  const availableNutrition = Array.from(new Set(routeProducts.flatMap((product) => product.nutritionTags ?? [])));

  const filteredProducts = routeProducts.filter((product) => {
    const numericPrice = Number(product.price.replace(/[^0-9.]/g, ''));
    const matchesPrice = numericPrice <= priceLimit;
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.accentColor);
    const matchesNutrition = selectedNutrition.length === 0 || selectedNutrition.every((tag) => (product.nutritionTags ?? []).includes(tag));
    return matchesPrice && matchesColor && matchesNutrition;
  });

  const sortedProducts = [...filteredProducts].sort((left, right) => {
    const leftPrice = Number(left.price.replace(/[^0-9.]/g, ''));
    const rightPrice = Number(right.price.replace(/[^0-9.]/g, ''));

    if (sortBy === 'Price: Low to High') {
      return leftPrice - rightPrice;
    }

    if (sortBy === 'Price: High to Low') {
      return rightPrice - leftPrice;
    }

    if (sortBy === 'Latest products') {
      return 0;
    }

    return 0;
  });

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const sidebarCategories = [
    { name: 'All', count: archiveProducts.length },
    ...categories.map((category) => ({ name: category.name, count: category.count }))
  ];

  const toggleFilterValue = (currentValues, nextValue, setter) => {
    setter(
      currentValues.includes(nextValue)
        ? currentValues.filter((value) => value !== nextValue)
        : [...currentValues, nextValue]
    );
  };

  return (
    <main className="product-archive-page">
      <section className="container product-archive-hero reveal">
        <div className="product-archive-breadcrumbs">
          <a href={HOME_HASH} onClick={(event) => {
            event.preventDefault();
            navigateToHash(HOME_HASH);
          }}>Home</a>
          <span>/</span>
          <span>{routeCategoryTitle}</span>
        </div>
        <div className="product-archive-heading">
          <div>
            <h1>{routeCategoryTitle}</h1>
            <p>{archiveProducts.length} {archiveMeta.resultLabel}</p>
          </div>
        </div>
      </section>

      <section className="container section reveal">
        <div className="product-archive-layout">
          <aside className="product-archive-sidebar">
            <div className="archive-sidebar-card">
              <div className="archive-filter-header">
                <strong>Filter :</strong>
                <button
                  type="button"
                  className="archive-clear-btn"
                  onClick={() => {
                    setSelectedColors([]);
                    setSelectedNutrition([]);
                    setPriceLimit(archiveMeta.priceRange?.max ?? 10);
                    setPendingPriceLimit(archiveMeta.priceRange?.max ?? 10);
                  }}
                >
                  Clean All
                </button>
              </div>

              <h3>{archiveMeta.sidebarTitle}</h3>
              <div className="archive-category-list">
                {sidebarCategories.map((category) => (
                  <a
                    key={category.name}
                    href={getProductListHash(category.name)}
                    className={`archive-category-item ${slugifyCategory(category.name) === routeCategorySlug ? 'is-active' : ''}`}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateToHash(getProductListHash(category.name));
                    }}
                  >
                    <span>{category.name}</span>
                    <small>{category.count}</small>
                  </a>
                ))}
              </div>

              <div className="archive-filter-group">
                <div className="archive-filter-title-row">
                  <h4>Price</h4>
                  <span>-</span>
                </div>
                <input
                  className="archive-price-range"
                  type="range"
                  min={archiveMeta.priceRange?.min ?? 0}
                  max={archiveMeta.priceRange?.max ?? 10}
                  step="0.1"
                  value={pendingPriceLimit}
                  onChange={(event) => setPendingPriceLimit(Number(event.target.value))}
                />
                <div className="archive-price-actions">
                  <button type="button" className="archive-apply-btn" onClick={() => setPriceLimit(pendingPriceLimit)}>Filter</button>
                  <small>Price: ${archiveMeta.priceRange?.min ?? 0} - ${pendingPriceLimit.toFixed(2)}</small>
                </div>
              </div>

              <div className="archive-filter-group">
                <div className="archive-filter-title-row">
                  <h4>Color</h4>
                  <span>-</span>
                </div>
                <div className="archive-option-list">
                  {availableColors.map((color) => (
                    <label className="archive-option-item" key={color}>
                      <span className={`archive-color-dot archive-color-${slugifyCategory(color)}`} />
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => toggleFilterValue(selectedColors, color, setSelectedColors)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="archive-filter-group">
                <div className="archive-filter-title-row">
                  <h4>Nutrition</h4>
                  <span>-</span>
                </div>
                <div className="archive-option-list archive-option-list-nutrition">
                  {availableNutrition.map((tag) => (
                    <label className="archive-option-item archive-checkbox-item" key={tag}>
                      <input
                        type="checkbox"
                        checked={selectedNutrition.includes(tag)}
                        onChange={() => toggleFilterValue(selectedNutrition, tag, setSelectedNutrition)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="archive-sidebar-promo" style={{ backgroundImage: `linear-gradient(180deg, rgba(26, 58, 14, .18), rgba(26, 58, 14, .7)), url(${archiveMeta.promoImage})` }}>
              <span>{archiveMeta.promoEyebrow}</span>
              <h3>{archiveMeta.promoTitle}</h3>
            </div>
          </aside>

          <div className="product-archive-content">
            <div className="archive-toolbar">
              <div className="archive-toolbar-left">
                <ListFilter size={18} />
                <span>Showing {visibleProducts.length} of {routeProducts.length} products</span>
              </div>
              <div className="archive-toolbar-right">
                <select value={visibleCount} onChange={(event) => setVisibleCount(Number(event.target.value))}>
                  {(archiveMeta.showOptions ?? [12]).map((option) => (
                    <option key={option} value={option}>Show {option}</option>
                  ))}
                </select>
                <div className="archive-toolbar-view">
                  <button type="button" className="is-active" aria-label="Grid view"><Grid2x2 size={18} /></button>
                </div>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  {archiveMeta.sortOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="archive-product-grid">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={`${product.name}-${index}`}
                  product={product}
                  compact
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistSlugs.includes(getProductSlug(product))}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductDetailsPage({ pageData, routeHash, onAddToCart, onToggleWishlist, wishlistSlugs }) {
  const { categories, products, dealMonthProducts, sections } = pageData;
  const detailMeta = sections.productDetails;
  const allProducts = [...products, ...dealMonthProducts];
  const routeProductSlug = getRouteProductSlug(routeHash);
  const product = allProducts.find((item) => getProductSlug(item) === routeProductSlug) ?? products[0];
  const [selectedImage, setSelectedImage] = useState(product?.galleryImages?.[0] ?? product?.image ?? '');
  const [quantity, setQuantity] = useState(1);
  const numericPrice = Number(product.price.replace(/[^0-9.]/g, ''));
  const numericOldPrice = Number(product.oldPrice.replace(/[^0-9.]/g, ''));
  const savingsPercent = numericOldPrice > 0 ? Math.round(((numericOldPrice - numericPrice) / numericOldPrice) * 100) : 0;
  const stockState = product.available > 0 ? 'In stock' : 'Out of stock';
  const descriptionPoints = product.shortDescription.split('.').map((item) => item.trim()).filter(Boolean);
  const relatedProducts = allProducts
    .filter((item) => getProductSlug(item) !== getProductSlug(product) && matchesArchiveCategory(item, slugifyCategory(product.category)))
    .slice(0, 4);

  useEffect(() => {
    setSelectedImage(product?.galleryImages?.[0] ?? product?.image ?? '');
    setQuantity(1);
  }, [routeProductSlug, product]);

  return (
    <main className="product-detail-page">
      <section className="container product-detail-breadcrumbs reveal">
        <a href={HOME_HASH} onClick={(event) => {
          event.preventDefault();
          navigateToHash(HOME_HASH);
        }}>Home</a>
        <span>/</span>
        <a href={getProductListHash(product.category)} onClick={(event) => {
          event.preventDefault();
          navigateToHash(getProductListHash(product.category));
        }}>{getArchiveTitleFromSlug(slugifyCategory(product.category), categories)}</a>
        <span>/</span>
        <span>{product.name}</span>
      </section>

      <section className="container section reveal product-detail-shell">
        <div className="product-detail-layout">
          <div className="product-detail-gallery">
            <div className="product-detail-thumbs">
              {(product.galleryImages?.length ? product.galleryImages : [product.image]).map((image) => (
                <button
                  key={image}
                  type="button"
                  className={`product-detail-thumb ${selectedImage === image ? 'is-active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={product.name} />
                </button>
              ))}
            </div>
            <div className="product-detail-main-image">
              <img src={selectedImage || product.image} alt={product.name} />
            </div>
          </div>

          <div className="product-detail-summary">
            <div className="product-detail-badge-row">
              <span className="product-detail-sale-badge">{product.tag}</span>
              {savingsPercent > 0 ? <span className="product-detail-savings">Save {savingsPercent}%</span> : null}
            </div>
            <h1>{product.name}</h1>
            <div className="product-detail-rating-row">
              <div className="stars">{'\u2605'.repeat(product.rating)}{'\u2606'.repeat(5 - product.rating)}</div>
              <span>2 Reviews</span>
            </div>
            <div className="product-detail-price-row">
              <strong>{product.price}</strong>
              <del>{product.oldPrice}</del>
            </div>
            <div className="product-detail-short-copy">
              {descriptionPoints.length ? (
                <ul>
                  {descriptionPoints.map((point) => <li key={point}>{point}.</li>)}
                </ul>
              ) : (
                <p>{product.shortDescription}</p>
              )}
            </div>
            <div className="product-detail-stock-row">
              <span className={`product-detail-stock ${product.available > 0 ? 'is-in-stock' : 'is-out-stock'}`}>{stockState}</span>
              <span>{product.available} available</span>
            </div>
            <div className="product-detail-actions">
              <div className="product-detail-qty">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={16} /></button>
                <span>{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}><Plus size={16} /></button>
              </div>
              <button className="product-detail-cart-btn" type="button" onClick={() => onAddToCart?.(product, quantity)}>{detailMeta.addToCartLabel}</button>
              <button
                className={`product-detail-wishlist-btn ${wishlistSlugs.includes(getProductSlug(product)) ? 'is-active' : ''}`}
                type="button"
                onClick={() => onToggleWishlist?.(product)}
              >
                <Heart size={18} /> Wishlist
              </button>
            </div>
            <div className="product-detail-meta">
              <div><strong>SKU:</strong><span>{product.sku}</span></div>
              <div><strong>Category:</strong><span>{product.category}</span></div>
              <div><strong>Nutrition:</strong><span>{(product.nutritionTags?.length ? product.nutritionTags : ['General']).join(', ')}</span></div>
            </div>
            <div className="product-detail-share">
              <strong>{detailMeta.shareLabel}</strong>
              <div className="product-detail-share-list">
                {['Fb', 'Tw', 'Pin', 'Wa', 'In'].map((label) => <span key={label}>{label}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section reveal product-detail-description">
        <div className="product-detail-tab-head">
          <h2>{detailMeta.descriptionTabLabel}</h2>
        </div>
        <p>{product.longDescription}</p>
        <div className="product-detail-info-box">
          <h3>{detailMeta.additionalInfoTitle}</h3>
          <div className="product-detail-info-grid">
            <div><strong>SKU</strong><span>{product.sku}</span></div>
            <div><strong>Category</strong><span>{product.category}</span></div>
            <div><strong>Available</strong><span>{product.available}</span></div>
            <div><strong>Sold</strong><span>{product.sold}</span></div>
          </div>
        </div>
      </section>

      <section className="container section reveal">
        <div className="section-title">
          <div><h2>{detailMeta.relatedTitle}</h2><p>{detailMeta.relatedSubtitle}</p></div>
        </div>
        <div className="archive-product-grid product-detail-related-grid">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.slug || relatedProduct.name}
              product={relatedProduct}
              compact
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistSlugs.includes(getProductSlug(relatedProduct))}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function AccountPageHero({ title, crumbs }) {
  return (
    <section className="container account-page-hero reveal">
      <div className="product-archive-breadcrumbs">
        <a href={HOME_HASH} onClick={(event) => {
          event.preventDefault();
          navigateToHash(HOME_HASH);
        }}>Home</a>
        {crumbs.map((crumb) => (
          <React.Fragment key={crumb.label}>
            <span>/</span>
            {crumb.href ? (
              <a href={crumb.href} onClick={(event) => {
                event.preventDefault();
                navigateToHash(crumb.href);
              }}>{crumb.label}</a>
            ) : (
              <span>{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="product-archive-heading">
        <div><h1>{title}</h1></div>
      </div>
    </section>
  );
}

function EmptyStateCard({ title, text, actionLabel, actionHref }) {
  return (
    <div className="account-empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
      <button type="button" onClick={() => navigateToHash(actionHref)}>{actionLabel}</button>
    </div>
  );
}

function CartPage({ productsBySlug, cartItems, updateCartQuantity, removeCartItem }) {
  const rows = cartItems.map((item) => {
    const product = productsBySlug[item.slug];
    return product ? { ...item, product } : null;
  }).filter(Boolean);
  const subtotal = rows.reduce((sum, row) => sum + (Number(row.product.price.replace(/[^0-9.]/g, '')) * row.quantity), 0);

  return (
    <main className="account-page">
      <AccountPageHero title="Shopping Cart" crumbs={[{ label: 'Cart' }]} />
      <section className="container section reveal">
        {rows.length === 0 ? (
          <EmptyStateCard title="Your cart is empty" text="Add products from the home, archive, or detail page to begin checkout." actionLabel="Continue Shopping" actionHref={HOME_HASH} />
        ) : (
          <div className="account-card cart-layout">
            <div className="cart-table">
              {rows.map(({ slug, quantity, product }) => {
                const price = Number(product.price.replace(/[^0-9.]/g, ''));
                return (
                  <div className="cart-row" key={slug}>
                    <div className="cart-product">
                      <img src={product.image} alt={product.name} />
                      <div>
                        <a href={getProductDetailHash(slug)} onClick={(event) => {
                          event.preventDefault();
                          navigateToHash(getProductDetailHash(slug));
                        }}>{product.name}</a>
                        <span>{product.category}</span>
                      </div>
                    </div>
                    <strong>{product.price}</strong>
                    <div className="product-detail-qty">
                      <button type="button" onClick={() => updateCartQuantity(slug, quantity - 1)}><Minus size={16} /></button>
                      <span>{quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(slug, quantity + 1)}><Plus size={16} /></button>
                    </div>
                    <strong>${(price * quantity).toFixed(2)}</strong>
                    <button type="button" className="cart-remove-btn" onClick={() => removeCartItem(slug)}>Remove</button>
                  </div>
                );
              })}
            </div>
            <aside className="cart-summary">
              <h3>Cart Totals</h3>
              <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              <div><span>Shipping</span><strong>Free</strong></div>
              <div className="cart-summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>
              <button type="button" onClick={() => navigateToHash(CHECKOUT_HASH)}>Proceed To Checkout</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function WishlistPage({ wishlistProducts, onAddToCart, onToggleWishlist }) {
  return (
    <main className="account-page">
      <AccountPageHero title="Wishlist" crumbs={[{ label: 'Wishlist' }]} />
      <section className="container section reveal">
        {wishlistProducts.length === 0 ? (
          <EmptyStateCard title="Wishlist is empty" text="Save favorite products here so you can return to them later." actionLabel="Browse Products" actionHref={HOME_HASH} />
        ) : (
          <div className="archive-product-grid wishlist-grid">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={getProductSlug(product)}
                product={product}
                compact
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function AuthPage({ mode, users, setUsers, currentUser, setCurrentUser }) {
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
    setFormState({ name: '', email: '', password: '' });
  }, [mode]);

  useEffect(() => {
    if (currentUser && (mode === 'login' || mode === 'register' || mode === 'forgot')) {
      navigateToHash(ACCOUNT_HASH);
    }
  }, [currentUser, mode]);

  const titleMap = {
    login: 'Login',
    register: 'Register',
    forgot: 'Forgot Password'
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === 'register') {
      const exists = users.some((user) => user.email.toLowerCase() === formState.email.toLowerCase());
      if (exists) {
        setMessage('An account with this email already exists.');
        return;
      }

      const nextUser = {
        name: formState.name || formState.email.split('@')[0],
        email: formState.email,
        password: formState.password
      };
      const nextUsers = [...users, nextUser];
      setUsers(nextUsers);
      setCurrentUser({ name: nextUser.name, email: nextUser.email });
      setMessage('');
      navigateToHash(ACCOUNT_HASH);
      return;
    }

    if (mode === 'login') {
      const matchedUser = users.find((user) => user.email.toLowerCase() === formState.email.toLowerCase() && user.password === formState.password);
      if (!matchedUser) {
        setMessage('Invalid email or password.');
        return;
      }

      setCurrentUser({ name: matchedUser.name, email: matchedUser.email });
      setMessage('');
      navigateToHash(ACCOUNT_HASH);
      return;
    }

    if (mode === 'forgot') {
      const matchedUser = users.find((user) => user.email.toLowerCase() === formState.email.toLowerCase());
      setMessage(matchedUser ? `Password hint: ${matchedUser.password}` : 'No account found with that email.');
    }
  };

  return (
    <main className="account-page">
      <AccountPageHero title={titleMap[mode]} crumbs={[{ label: titleMap[mode] }]} />
      <section className="container section reveal">
        <div className="auth-shell">
          <div className="auth-card">
            <h2>{titleMap[mode]}</h2>
            <p>{mode === 'forgot' ? 'Enter your account email to recover access.' : 'Use the FreshMart account flow to continue shopping.'}</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' ? (
                <input value={formState.name} onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))} placeholder="Full name" />
              ) : null}
              <input value={formState.email} onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))} placeholder="Email address" type="email" required />
              {mode !== 'forgot' ? (
                <input value={formState.password} onChange={(event) => setFormState((state) => ({ ...state, password: event.target.value }))} placeholder="Password" type="password" required />
              ) : null}
              {message ? <div className="auth-message">{message}</div> : null}
              <button type="submit">{titleMap[mode]}</button>
            </form>
            <div className="auth-links">
              {mode !== 'login' ? <a href={LOGIN_HASH} onClick={(event) => { event.preventDefault(); navigateToHash(LOGIN_HASH); }}>Already have an account?</a> : null}
              {mode !== 'register' ? <a href={REGISTER_HASH} onClick={(event) => { event.preventDefault(); navigateToHash(REGISTER_HASH); }}>Create account</a> : null}
              {mode !== 'forgot' ? <a href={FORGOT_HASH} onClick={(event) => { event.preventDefault(); navigateToHash(FORGOT_HASH); }}>Forgot password?</a> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckoutPage({ currentUser, cartItems, productsBySlug, placeOrder }) {
  const [formState, setFormState] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });
  const rows = cartItems.map((item) => {
    const product = productsBySlug[item.slug];
    return product ? { ...item, product } : null;
  }).filter(Boolean);
  const total = rows.reduce((sum, row) => sum + (Number(row.product.price.replace(/[^0-9.]/g, '')) * row.quantity), 0);

  useEffect(() => {
    setFormState((state) => ({
      ...state,
      name: currentUser?.name ?? state.name,
      email: currentUser?.email ?? state.email
    }));
  }, [currentUser]);

  return (
    <main className="account-page">
      <AccountPageHero title="Checkout" crumbs={[{ label: 'Cart', href: CART_HASH }, { label: 'Checkout' }]} />
      <section className="container section reveal">
        {!currentUser ? (
          <EmptyStateCard title="Login required" text="Please login before completing checkout." actionLabel="Go To Login" actionHref={LOGIN_HASH} />
        ) : rows.length === 0 ? (
          <EmptyStateCard title="Cart is empty" text="Add at least one product before checkout." actionLabel="Browse Products" actionHref={HOME_HASH} />
        ) : (
          <div className="checkout-layout">
            <form
              className="account-card checkout-form"
              onSubmit={(event) => {
                event.preventDefault();
                placeOrder(formState);
              }}
            >
              <h3>Billing Details</h3>
              <div className="checkout-grid">
                {[
                  ['name', 'Full name'],
                  ['email', 'Email address'],
                  ['phone', 'Phone number'],
                  ['address', 'Street address'],
                  ['city', 'City'],
                  ['zip', 'Zip code']
                ].map(([key, label]) => (
                  <input
                    key={key}
                    value={formState[key]}
                    onChange={(event) => setFormState((state) => ({ ...state, [key]: event.target.value }))}
                    placeholder={label}
                    required
                  />
                ))}
              </div>
              <button type="submit">Place Order</button>
            </form>
            <aside className="cart-summary account-card">
              <h3>Your Order</h3>
              {rows.map((row) => (
                <div key={row.slug}><span>{row.product.name} x {row.quantity}</span><strong>${(Number(row.product.price.replace(/[^0-9.]/g, '')) * row.quantity).toFixed(2)}</strong></div>
              ))}
              <div className="cart-summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function AccountPage({ currentUser, orders, updateProfile }) {
  const [formState, setFormState] = useState({ name: currentUser?.name ?? '', email: currentUser?.email ?? '' });

  useEffect(() => {
    setFormState({ name: currentUser?.name ?? '', email: currentUser?.email ?? '' });
  }, [currentUser]);

  return (
    <main className="account-page">
      <AccountPageHero title="My Profile" crumbs={[{ label: 'My Profile' }]} />
      <section className="container section reveal">
        {!currentUser ? (
          <EmptyStateCard title="Login required" text="Please login to access your profile." actionLabel="Go To Login" actionHref={LOGIN_HASH} />
        ) : (
          <div className="account-layout">
            <div className="account-card">
              <h3>Account Details</h3>
              <form
                className="auth-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  updateProfile(formState);
                }}
              >
                <input value={formState.name} onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))} placeholder="Full name" />
                <input value={formState.email} onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))} placeholder="Email address" type="email" />
                <button type="submit">Save Changes</button>
              </form>
            </div>
            <div className="account-card">
              <h3>Account Snapshot</h3>
              <div className="account-stats">
                <div><strong>{orders.length}</strong><span>Orders</span></div>
                <div><strong>{currentUser.name.split(' ')[0]}</strong><span>Member</span></div>
              </div>
              <button type="button" onClick={() => navigateToHash(ORDERS_HASH)}>View My Orders</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function OrdersPage({ currentUser, orders }) {
  return (
    <main className="account-page">
      <AccountPageHero title="My Orders" crumbs={[{ label: 'My Orders' }]} />
      <section className="container section reveal">
        {!currentUser ? (
          <EmptyStateCard title="Login required" text="Please login to access your orders." actionLabel="Go To Login" actionHref={LOGIN_HASH} />
        ) : orders.length === 0 ? (
          <EmptyStateCard title="No orders yet" text="Complete a checkout and your orders will appear here." actionLabel="Start Shopping" actionHref={HOME_HASH} />
        ) : (
          <div className="account-card orders-list">
            {orders.map((order) => (
              <div className="order-row" key={order.id}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <span>{order.date}</span>
                </div>
                <div>
                  <strong>${order.total.toFixed(2)}</strong>
                  <span>{order.items.length} items</span>
                </div>
                <div>
                  <strong>{order.status}</strong>
                  <span>{order.customer.city}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SuccessPage({ order }) {
  return (
    <main className="account-page">
      <AccountPageHero title="Order Success" crumbs={[{ label: 'Checkout', href: CHECKOUT_HASH }, { label: 'Success' }]} />
      <section className="container section reveal">
        <div className="success-card">
          <span className="page-state-badge">FreshMart</span>
          <h2>Thank you for your order</h2>
          <p>Your checkout was completed successfully.</p>
          {order ? (
            <div className="success-summary">
              <div><strong>Order ID</strong><span>{order.id}</span></div>
              <div><strong>Total</strong><span>${order.total.toFixed(2)}</span></div>
              <div><strong>Status</strong><span>{order.status}</span></div>
            </div>
          ) : null}
          <div className="success-actions">
            <button type="button" onClick={() => navigateToHash(ORDERS_HASH)}>View Orders</button>
            <button type="button" className="is-secondary" onClick={() => navigateToHash(HOME_HASH)}>Back To Home</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function FloatingToolbar() {
  return (
    <div className="floating-toolbar">
      <button><Home size={18} /></button>
      <button><Settings size={18} /></button>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={18} /></button>
    </div>
  );
}

function Footer({ footer, heroSlides }) {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <img className="footer-logo" src={heroSlides.footerLogo} alt="FreshMart footer logo" />
          <p>{footer.description}</p>
          <div className="footer-apps"><img src={heroSlides.googlePlay} alt="Google Play" /><img src={heroSlides.appStore} alt="App Store" /></div>
        </div>
        <div><h3>Company</h3><p>{footer.companyLinks.map((link) => <React.Fragment key={link}>{link}<br /></React.Fragment>)}</p></div>
        <div><h3>Account</h3><p>{footer.accountLinks.map((link) => <React.Fragment key={link}>{link}<br /></React.Fragment>)}</p></div>
        <div><h3>Newsletter</h3><input placeholder={footer.newsletterPlaceholder} /><button>{footer.newsletterButton}</button><img className="footer-payments" src={heroSlides.payments} alt="Payment methods" /></div>
      </div>
    </footer>
  );
}

export default function App() {
  const [pageData, setPageData] = useState(null);
  const [pageError, setPageError] = useState('');
  const [routeHash, setRouteHash] = useState(window.location.hash || HOME_HASH);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.users) ?? '[]');
    const storedCurrentUser = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.currentUser) ?? 'null');
    const storedCart = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.cart) ?? '[]');
    const storedWishlist = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.wishlist) ?? '[]');
    const storedOrders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? '[]');

    setUsers(storedUsers);
    setCurrentUser(storedCurrentUser);
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.replace(`${window.location.pathname}${window.location.search}${HOME_HASH}`);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    getPageData()
      .then((response) => {
        if (isActive) {
          setPageData(response);
          setPageError('');
        }
      })
      .catch((error) => {
        console.error('Failed to load API page data:', error);
        if (isActive) {
          setPageError('Failed to load page data from API.');
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => setRouteHash(window.location.hash || HOME_HASH);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!pageData) {
      return undefined;
    }

    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible'));
    }, { threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pageData, routeHash]);

  if (pageError) {
    return (
      <div className="page-state page-state-error">
        <div className="page-state-panel">
          <span className="page-state-badge">Connection Error</span>
          <h2>API Error</h2>
          <p>{pageError}</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="page-state">
        <div className="page-state-backdrop page-state-backdrop-one" />
        <div className="page-state-backdrop page-state-backdrop-two" />
        <div className="page-state-panel page-state-panel-loading">
          <span className="page-state-badge">FreshMart</span>
          <div className="page-loader-orbit">
            <span className="page-loader-ring page-loader-ring-one" />
            <span className="page-loader-ring page-loader-ring-two" />
            <span className="page-loader-core">
              <img src="/wolmart-demo29/shop29-logo.png" alt="Wolmart" />
            </span>
          </div>
          <h2>Loading marketplace</h2>
          <div className="page-loader-progress">
            <span />
          </div>
        </div>
      </div>
    );
  }

  const allProducts = [...pageData.products, ...pageData.dealMonthProducts];
  const productsBySlug = allProducts.reduce((accumulator, product) => {
    accumulator[getProductSlug(product)] = product;
    return accumulator;
  }, {});
  const wishlistSlugs = wishlistItems;
  const wishlistProducts = wishlistSlugs.map((slug) => productsBySlug[slug]).filter(Boolean);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const successOrder = isSuccessRoute(routeHash)
    ? orders.find((order) => order.id === getRouteSuccessOrderId(routeHash))
    : null;

  const handleAddToCart = (product, quantity = 1) => {
    const slug = getProductSlug(product);
    setCartItems((items) => {
      const existing = items.find((item) => item.slug === slug);
      if (existing) {
        return items.map((item) => item.slug === slug ? { ...item, quantity: item.quantity + quantity } : item);
      }

      return [...items, { slug, quantity }];
    });
  };

  const handleToggleWishlist = (product) => {
    const slug = getProductSlug(product);
    setWishlistItems((items) => (
      items.includes(slug)
        ? items.filter((item) => item !== slug)
        : [...items, slug]
    ));
  };

  const updateCartQuantity = (slug, quantity) => {
    if (quantity <= 0) {
      setCartItems((items) => items.filter((item) => item.slug !== slug));
      return;
    }

    setCartItems((items) => items.map((item) => item.slug === slug ? { ...item, quantity } : item));
  };

  const removeCartItem = (slug) => {
    setCartItems((items) => items.filter((item) => item.slug !== slug));
  };

  const updateProfile = ({ name, email }) => {
    if (!currentUser) {
      return;
    }

    setCurrentUser({ name, email });
    setUsers((items) => items.map((user) => user.email === currentUser.email ? { ...user, name, email } : user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateToHash(HOME_HASH);
  };

  const placeOrder = (customer) => {
    const items = cartItems.map((item) => {
      const product = productsBySlug[item.slug];
      return {
        slug: item.slug,
        quantity: item.quantity,
        name: product?.name ?? item.slug,
        price: Number((product?.price ?? '$0').replace(/[^0-9.]/g, ''))
      };
    });
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = `FM${Date.now().toString().slice(-8)}`;
    const nextOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      total,
      status: 'Processing',
      items,
      customer
    };
    setOrders((items) => [nextOrder, ...items]);
    setCartItems([]);
    navigateToHash(getSuccessHash(orderId));
  };

  return (
    <>
      <Header
        header={pageData.header}
        heroSlides={pageData.heroSlides}
        navigation={pageData.navigation}
        currentUser={currentUser}
        cartCount={cartCount}
        wishlistCount={wishlistProducts.length}
        onLogout={handleLogout}
      />
      {routeHash === CART_HASH ? (
        <CartPage productsBySlug={productsBySlug} cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeCartItem={removeCartItem} />
      ) : routeHash === WISHLIST_HASH ? (
        <WishlistPage wishlistProducts={wishlistProducts} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
      ) : routeHash === LOGIN_HASH ? (
        <AuthPage mode="login" users={users} setUsers={setUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      ) : routeHash === REGISTER_HASH ? (
        <AuthPage mode="register" users={users} setUsers={setUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      ) : routeHash === FORGOT_HASH ? (
        <AuthPage mode="forgot" users={users} setUsers={setUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      ) : routeHash === CHECKOUT_HASH ? (
        <CheckoutPage currentUser={currentUser} cartItems={cartItems} productsBySlug={productsBySlug} placeOrder={placeOrder} />
      ) : routeHash === ACCOUNT_HASH ? (
        <AccountPage currentUser={currentUser} orders={orders} updateProfile={updateProfile} />
      ) : routeHash === ORDERS_HASH ? (
        <OrdersPage currentUser={currentUser} orders={orders} />
      ) : isSuccessRoute(routeHash) ? (
        <SuccessPage order={successOrder} />
      ) : isProductDetailRoute(routeHash) ? (
        <ProductDetailsPage pageData={pageData} routeHash={routeHash} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistSlugs={wishlistSlugs} />
      ) : isProductListRoute(routeHash) ? (
        <ProductListPage pageData={pageData} routeHash={routeHash} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistSlugs={wishlistSlugs} />
      ) : (
        <>
          <Hero hero={pageData.hero} heroSlides={pageData.heroSlides} />
          <DealOfMonthSection dealMeta={pageData.sections.dealMonth} dealProducts={pageData.dealMonthProducts} heroSlides={pageData.heroSlides} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistSlugs={wishlistSlugs} />
          <CategorySection section={pageData.sections.categories} categories={pageData.categories} />
          <ProductsSection section={pageData.sections.weeklyDiscounts} products={pageData.products} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistSlugs={wishlistSlugs} />
          <PromoBanner promo={pageData.sections.promoBanner} />
          <ProductsSection section={pageData.sections.newArrivals} products={pageData.products.slice(3)} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistSlugs={wishlistSlugs} />
          <VendorSection section={pageData.sections.vendors} vendors={pageData.vendors} />
          <ArticlesSection section={pageData.sections.articles} articles={pageData.articles} />
        </>
      )}
      <Footer footer={pageData.footer} heroSlides={pageData.heroSlides} />
      <FloatingToolbar />
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Eye, Flame, Grid2x2, Heart, Home, ListFilter, Phone, Repeat, Search, Settings, ShoppingCart, User } from 'lucide-react';
import { getPageData } from './lib/api.js';

const HOME_HASH = '#/';
const PRODUCT_LIST_PREFIX = '#/product-category/';

function slugifyCategory(value) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getProductListHash(categoryLabel) {
  if (!categoryLabel || categoryLabel === 'All' || categoryLabel === 'All Categories') {
    return `${PRODUCT_LIST_PREFIX}all`;
  }

  return `${PRODUCT_LIST_PREFIX}${slugifyCategory(categoryLabel)}`;
}

function isProductListRoute(hash) {
  return hash.startsWith(PRODUCT_LIST_PREFIX) || hash === '#/products' || hash === '#products';
}

function getRouteCategorySlug(hash) {
  if (hash === '#/products' || hash === '#products') {
    return 'all';
  }

  return hash.startsWith(PRODUCT_LIST_PREFIX)
    ? hash.slice(PRODUCT_LIST_PREFIX.length) || 'all'
    : 'all';
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

function Header({ header, heroSlides, navigation }) {
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
            <User size={22} />
            <Heart size={22} />
            <div className="cart-icon"><ShoppingCart size={23} /><b>2</b></div>
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

function DealOfMonthSection({ dealMeta, dealProducts, heroSlides }) {
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
            {dealProducts.map((product) => <ProductCard key={`deal-${product.name}`} product={product} compact />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, compact = false }) {
  const totalStock = (product.available ?? 0) + (product.sold ?? 0);
  const soldPercent = totalStock > 0 ? ((product.sold ?? 0) / totalStock) * 100 : 0;

  if (compact) {
    return (
      <div className="discount-card">
        <span className="discount-badge">{product.tag}</span>
        <div className="discount-actions">
          <button type="button" aria-label="Add to wishlist"><Heart size={16} /></button>
          <button type="button" aria-label="Compare product"><Repeat size={16} /></button>
        </div>
        <div className="discount-image"><img src={product.image} alt={product.name} /></div>
        <div className="discount-content">
          <h3>{product.name}</h3>
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
        <button className="discount-cart-btn" type="button">ADD TO CART</button>
      </div>
    );
  }

  return (
    <div className="product-card">
      <span className="badge">{product.tag}</span>
      <div className="product-actions"><button><Heart size={16} /></button><button><Eye size={16} /></button><button><Repeat size={16} /></button></div>
      <div className="product-image"><img src={product.image} alt={product.name} /></div>
      <div className="stars">{'\u2605'.repeat(product.rating)}{'\u2606'.repeat(5 - product.rating)}</div>
      <h3>{product.name}</h3>
      <div className="price"><b>{product.price}</b><del>{product.oldPrice}</del></div>
      <button className="cart-btn"><ShoppingCart size={17} /> Add to Cart</button>
    </div>
  );
}

function ProductsSection({ section, products }) {
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
        {products.map((product) => <ProductCard key={`${section.title}-${product.name}`} product={product} compact />)}
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

function ProductListPage({ pageData, routeHash }) {
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
                <ProductCard key={`${product.name}-${index}`} product={product} compact />
              ))}
            </div>
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

  return (
    <>
      <Header header={pageData.header} heroSlides={pageData.heroSlides} navigation={pageData.navigation} />
      {isProductListRoute(routeHash) ? (
        <ProductListPage pageData={pageData} routeHash={routeHash} />
      ) : (
        <>
          <Hero hero={pageData.hero} heroSlides={pageData.heroSlides} />
          <DealOfMonthSection dealMeta={pageData.sections.dealMonth} dealProducts={pageData.dealMonthProducts} heroSlides={pageData.heroSlides} />
          <CategorySection section={pageData.sections.categories} categories={pageData.categories} />
          <ProductsSection section={pageData.sections.weeklyDiscounts} products={pageData.products} />
          <PromoBanner promo={pageData.sections.promoBanner} />
          <ProductsSection section={pageData.sections.newArrivals} products={pageData.products.slice(3)} />
          <VendorSection section={pageData.sections.vendors} vendors={pageData.vendors} />
          <ArticlesSection section={pageData.sections.articles} articles={pageData.articles} />
        </>
      )}
      <Footer footer={pageData.footer} heroSlides={pageData.heroSlides} />
      <FloatingToolbar />
    </>
  );
}

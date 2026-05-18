import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Eye, Flame, Heart, Home, Phone, Repeat, Search, Settings, ShoppingCart, User } from 'lucide-react';
import { getPageData } from './lib/api.js';

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
            <img src={heroSlides.logo} alt="FreshMart" />
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
                <a className={item.columns ? 'has-arrow' : ''}>
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
          <div className="category-card" key={category.name}>
            <div className="cat-icon"><img src={category.image} alt={category.name} /></div>
            <h3>{category.name}</h3>
            <p>{category.count}</p>
          </div>
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

  useEffect(() => {
    let isActive = true;

    const loadPageData = () => {
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
    };

    loadPageData();

    const refreshInterval = import.meta.env.DEV
      ? window.setInterval(loadPageData, 2000)
      : null;

    return () => {
      isActive = false;
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
    };
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
  }, [pageData]);

  if (pageError) {
    return (
      <div className="page-state">
        <h2>API Error</h2>
        <p>{pageError}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="page-state">
        <h2>Loading...</h2>
        <p>Fetching page data from PostgreSQL API.</p>
      </div>
    );
  }

  return (
    <>
      <Header header={pageData.header} heroSlides={pageData.heroSlides} navigation={pageData.navigation} />
      <Hero hero={pageData.hero} heroSlides={pageData.heroSlides} />
      <DealOfMonthSection dealMeta={pageData.sections.dealMonth} dealProducts={pageData.dealMonthProducts} heroSlides={pageData.heroSlides} />
      <CategorySection section={pageData.sections.categories} categories={pageData.categories} />
      <ProductsSection section={pageData.sections.weeklyDiscounts} products={pageData.products} />
      <PromoBanner promo={pageData.sections.promoBanner} />
      <ProductsSection section={pageData.sections.newArrivals} products={pageData.products.slice(3)} />
      <VendorSection section={pageData.sections.vendors} vendors={pageData.vendors} />
      <ArticlesSection section={pageData.sections.articles} articles={pageData.articles} />
      <Footer footer={pageData.footer} heroSlides={pageData.heroSlides} />
      <FloatingToolbar />
    </>
  );
}

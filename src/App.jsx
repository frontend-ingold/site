import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ArrowUp, Bookmark, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Eye, Flame, Grid2x2, Heart, Home, ListFilter, Menu, Minus, Phone, Plus, Repeat, Search, Settings, ShoppingCart, User, X } from 'lucide-react';
import { createOrder as createOrderRequest, getOrders as getOrdersRequest, getPageData, getPasswordHint, loginUser as loginUserRequest, registerUser as registerUserRequest, updateUserProfile as updateUserProfileRequest } from './lib/api.js';

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
  currentUser: 'freshmart-current-user',
  cart: 'freshmart-cart',
  wishlist: 'freshmart-wishlist',
  currency: 'freshmart-currency',
  language: 'freshmart-language',
};

const CURRENCY_OPTIONS = {
  usd: { label: 'USD', code: 'USD', locale: 'en-US', rate: 1 },
  euro: { label: 'EUR', code: 'EUR', locale: 'de-DE', rate: 0.92 }
};

const LANGUAGE_OPTIONS = {
  english: 'English',
  german: 'German',
  french: 'French'
};

const TRANSLATIONS = {
  english: {
    welcomeMarketplace: 'Welcome to FreshMart Grocery Marketplace',
    searchPlaceholder: 'Search in fresh grocery products...',
    login: 'Login',
    wishlist: 'Wishlist',
    cart: 'Cart',
    callUs: 'Call us',
    viewCart: 'View Cart',
    checkout: 'Checkout',
    shoppingCart: 'Shopping Cart',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    continueShopping: 'Continue Shopping',
    clearCart: 'Clear Cart',
    updateCart: 'Update Cart',
    couponDiscount: 'Coupon Discount',
    applyCoupon: 'Apply Coupon',
    city: 'City',
    postcodeZip: 'Postcode / ZIP',
    updateTotals: 'Update Totals',
    shippingCost: 'Shipping Cost',
    free: 'Free',
    yourOrder: 'Your Order',
    billingDetails: 'Billing Details',
    firstName: 'First name *',
    lastName: 'Last name *',
    companyNameOptional: 'Company name (optional)',
    countryRegion: 'Country / Region *',
    streetAddress: 'Street address *',
    apartmentOptional: 'Apartment, suite, unit, etc. (optional)',
    townCity: 'Town / City *',
    state: 'State *',
    zipCode: 'ZIP Code *',
    phone: 'Phone *',
    emailAddress: 'Email address *',
    shipDifferentAddress: 'Ship to a different address?',
    orderNotesOptional: 'Order notes (optional)',
    notesPlaceholder: 'Notes about your order, e.g. special notes for delivery.',
    paymentMethods: 'Payment Methods',
    directBankTransfer: 'Direct bank transfer',
    checkPayments: 'Check payments',
    cashOnDelivery: 'Cash on delivery',
    placeOrder: 'Place Order',
    myOrders: 'My Orders',
    orderConfirmed: 'Order Confirmed',
    thankYouOrder: 'Thank you for your order',
    successCopy: 'Your checkout was completed successfully. We are preparing your items and will keep you updated on the delivery progress.',
    orderId: 'Order ID',
    status: 'Status',
    date: 'Date',
    customer: 'Customer',
    shippingTo: 'Shipping To',
    backToHome: 'Back To Home',
    viewOrders: 'View Orders',
    accountDetails: 'Account Details',
    accountSnapshot: 'Account Snapshot',
    saveChanges: 'Save Changes',
    orders: 'Orders',
    member: 'Member',
    fullName: 'Full name',
    forgotPassword: 'Forgot Password',
    register: 'Register',
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create account',
    forgotPasswordLink: 'Forgot password?',
    useFreshMartFlow: 'Use the FreshMart account flow to continue shopping.',
    enterEmailRecover: 'Enter your account email to recover access.',
    noOrdersYet: 'No orders yet',
    startShopping: 'Start Shopping',
    orderSuccess: 'Order Success',
    flatRate: 'Flat rate',
    localPickup: 'Local pickup',
    searchResultsFor: 'Search results for "{term}"'
  },
  german: {
    welcomeMarketplace: 'Willkommen beim FreshMart Lebensmittel-Marktplatz',
    searchPlaceholder: 'In frischen Lebensmitteln suchen...',
    login: 'Anmelden',
    wishlist: 'Wunschliste',
    cart: 'Warenkorb',
    callUs: 'Rufen Sie uns an',
    viewCart: 'Warenkorb ansehen',
    checkout: 'Kasse',
    shoppingCart: 'Warenkorb',
    subtotal: 'Zwischensumme',
    shipping: 'Versand',
    total: 'Gesamt',
    continueShopping: 'Weiter einkaufen',
    clearCart: 'Warenkorb leeren',
    updateCart: 'Warenkorb aktualisieren',
    couponDiscount: 'Gutscheinrabatt',
    applyCoupon: 'Gutschein anwenden',
    city: 'Stadt',
    postcodeZip: 'Postleitzahl',
    updateTotals: 'Summe aktualisieren',
    shippingCost: 'Versandkosten',
    free: 'Kostenlos',
    yourOrder: 'Ihre Bestellung',
    billingDetails: 'Rechnungsdetails',
    firstName: 'Vorname *',
    lastName: 'Nachname *',
    companyNameOptional: 'Firmenname (optional)',
    countryRegion: 'Land / Region *',
    streetAddress: 'Straßenadresse *',
    apartmentOptional: 'Wohnung, Suite, Einheit usw. (optional)',
    townCity: 'Ort / Stadt *',
    state: 'Bundesland *',
    zipCode: 'PLZ *',
    phone: 'Telefon *',
    emailAddress: 'E-Mail-Adresse *',
    shipDifferentAddress: 'An eine andere Adresse liefern?',
    orderNotesOptional: 'Bestellnotizen (optional)',
    notesPlaceholder: 'Hinweise zu Ihrer Bestellung, z. B. Lieferhinweise.',
    paymentMethods: 'Zahlungsmethoden',
    directBankTransfer: 'Direkte Banküberweisung',
    checkPayments: 'Scheckzahlungen',
    cashOnDelivery: 'Nachnahme',
    placeOrder: 'Bestellung aufgeben',
    myOrders: 'Meine Bestellungen',
    orderConfirmed: 'Bestellung bestätigt',
    thankYouOrder: 'Vielen Dank für Ihre Bestellung',
    successCopy: 'Ihr Einkauf wurde erfolgreich abgeschlossen. Wir bereiten Ihre Artikel vor und halten Sie über den Lieferstatus auf dem Laufenden.',
    orderId: 'Bestellnummer',
    status: 'Status',
    date: 'Datum',
    customer: 'Kunde',
    shippingTo: 'Lieferung nach',
    backToHome: 'Zurück zur Startseite',
    viewOrders: 'Bestellungen ansehen',
    accountDetails: 'Kontodaten',
    accountSnapshot: 'Kontoübersicht',
    saveChanges: 'Änderungen speichern',
    orders: 'Bestellungen',
    member: 'Mitglied',
    fullName: 'Vollständiger Name',
    forgotPassword: 'Passwort vergessen',
    register: 'Registrieren',
    alreadyHaveAccount: 'Sie haben bereits ein Konto?',
    createAccount: 'Konto erstellen',
    forgotPasswordLink: 'Passwort vergessen?',
    useFreshMartFlow: 'Verwenden Sie den FreshMart-Kontofluss, um weiter einzukaufen.',
    enterEmailRecover: 'Geben Sie Ihre Konto-E-Mail ein, um den Zugriff wiederherzustellen.',
    noOrdersYet: 'Noch keine Bestellungen',
    startShopping: 'Jetzt einkaufen',
    orderSuccess: 'Bestellung erfolgreich',
    flatRate: 'Pauschalpreis',
    localPickup: 'Abholung vor Ort',
    searchResultsFor: 'Suchergebnisse für „{term}“'
  },
  french: {
    welcomeMarketplace: 'Bienvenue sur le marché alimentaire FreshMart',
    searchPlaceholder: 'Rechercher dans les produits frais...',
    login: 'Connexion',
    wishlist: 'Favoris',
    cart: 'Panier',
    callUs: 'Appelez-nous',
    viewCart: 'Voir le panier',
    checkout: 'Paiement',
    shoppingCart: 'Panier',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    total: 'Total',
    continueShopping: 'Continuer vos achats',
    clearCart: 'Vider le panier',
    updateCart: 'Mettre à jour le panier',
    couponDiscount: 'Réduction coupon',
    applyCoupon: 'Appliquer le coupon',
    city: 'Ville',
    postcodeZip: 'Code postal',
    updateTotals: 'Mettre à jour le total',
    shippingCost: 'Frais de livraison',
    free: 'Gratuit',
    yourOrder: 'Votre commande',
    billingDetails: 'Détails de facturation',
    firstName: 'Prénom *',
    lastName: 'Nom *',
    companyNameOptional: 'Nom de l’entreprise (optionnel)',
    countryRegion: 'Pays / Région *',
    streetAddress: 'Adresse *',
    apartmentOptional: 'Appartement, suite, unité, etc. (optionnel)',
    townCity: 'Ville *',
    state: 'Région *',
    zipCode: 'Code postal *',
    phone: 'Téléphone *',
    emailAddress: 'Adresse e-mail *',
    shipDifferentAddress: 'Livrer à une autre adresse ?',
    orderNotesOptional: 'Notes de commande (optionnel)',
    notesPlaceholder: 'Notes concernant votre commande, par ex. instructions de livraison.',
    paymentMethods: 'Modes de paiement',
    directBankTransfer: 'Virement bancaire direct',
    checkPayments: 'Paiement par chèque',
    cashOnDelivery: 'Paiement à la livraison',
    placeOrder: 'Passer la commande',
    myOrders: 'Mes commandes',
    orderConfirmed: 'Commande confirmée',
    thankYouOrder: 'Merci pour votre commande',
    successCopy: 'Votre paiement a été effectué avec succès. Nous préparons vos articles et vous tiendrons informé de la livraison.',
    orderId: 'ID de commande',
    status: 'Statut',
    date: 'Date',
    customer: 'Client',
    shippingTo: 'Livraison à',
    backToHome: 'Retour à l’accueil',
    viewOrders: 'Voir les commandes',
    accountDetails: 'Détails du compte',
    accountSnapshot: 'Aperçu du compte',
    saveChanges: 'Enregistrer les modifications',
    orders: 'Commandes',
    member: 'Membre',
    fullName: 'Nom complet',
    forgotPassword: 'Mot de passe oublié',
    register: 'Inscription',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    createAccount: 'Créer un compte',
    forgotPasswordLink: 'Mot de passe oublié ?',
    useFreshMartFlow: 'Utilisez le parcours de compte FreshMart pour continuer vos achats.',
    enterEmailRecover: 'Entrez l’e-mail de votre compte pour récupérer l’accès.',
    noOrdersYet: 'Aucune commande pour le moment',
    startShopping: 'Commencer vos achats',
    orderSuccess: 'Commande réussie',
    flatRate: 'Tarif fixe',
    localPickup: 'Retrait sur place',
    searchResultsFor: 'Résultats de recherche pour « {term} »'
  }
};

const UiContext = createContext(null);

function parsePriceValue(value) {
  return typeof value === 'number' ? value : Number(String(value ?? '0').replace(/[^0-9.]/g, ''));
}

function interpolate(message, vars = {}) {
  return Object.entries(vars).reduce((result, [key, value]) => result.replace(`{${key}}`, String(value)), message);
}

function useUi() {
  return useContext(UiContext);
}

const SHIPPING_ZONES = {
  usa: {
    label: 'United States (US)',
    states: [
      { code: 'CA', label: 'California', flatRate: 7.5 },
      { code: 'NY', label: 'New York', flatRate: 9.25 },
      { code: 'TX', label: 'Texas', flatRate: 8.1 }
    ]
  },
  india: {
    label: 'India',
    states: [
      { code: 'WB', label: 'West Bengal', flatRate: 3.2 },
      { code: 'MH', label: 'Maharashtra', flatRate: 4.1 },
      { code: 'KA', label: 'Karnataka', flatRate: 4.65 }
    ]
  },
  germany: {
    label: 'Germany',
    states: [
      { code: 'BE', label: 'Berlin', flatRate: 10.4 },
      { code: 'BY', label: 'Bavaria', flatRate: 11.3 },
      { code: 'HH', label: 'Hamburg', flatRate: 9.9 }
    ]
  }
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

function getProductSearchHash(categoryLabel, searchTerm) {
  const baseHash = getProductListHash(categoryLabel);
  const normalizedSearch = searchTerm.trim();
  return normalizedSearch
    ? `${baseHash}?search=${encodeURIComponent(normalizedSearch)}`
    : baseHash;
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
  const [pathHash] = hash.split('?');
  if (hash === '#/products' || hash === '#products') {
    return 'all';
  }

  return pathHash.startsWith(PRODUCT_LIST_PREFIX)
    ? pathHash.slice(PRODUCT_LIST_PREFIX.length) || 'all'
    : 'all';
}

function getRouteSearchTerm(hash) {
  const queryIndex = hash.indexOf('?');
  if (queryIndex === -1) {
    return '';
  }

  const searchParams = new URLSearchParams(hash.slice(queryIndex + 1));
  return searchParams.get('search')?.trim() ?? '';
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

function getInitialShippingSelection() {
  const country = 'usa';
  const state = SHIPPING_ZONES[country].states[0];
  return {
    country,
    stateCode: state.code,
    city: '',
    zip: ''
  };
}

function readStorageValue(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    console.error(`Failed to read localStorage key: ${key}`, error);
    return fallback;
  }
}

function Header({ header, heroSlides, navigation, currentUser, cartCount, wishlistCount, onLogout, onCartClick, searchProducts = [] }) {
  const { currency, language, setCurrency, setLanguage, t } = useUi();
  const [scrolled, setScrolled] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(navigation.searchCategories[0] ?? 'All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const categoryDropdownRef = useRef(null);
  const searchBoxRef = useRef(null);

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

      if (!searchBoxRef.current?.contains(event.target)) {
        setSearchTerm((value) => value.trim());
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 980) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow || '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchSuggestions = normalizedSearch
    ? searchProducts
      .filter((product) => {
        const matchesCategory = selectedCategory === 'All Categories' || selectedCategory === 'All' || matchesArchiveCategory(product, slugifyCategory(selectedCategory));
        const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
      })
      .slice(0, 6)
    : [];
  const handleSearch = () => {
    navigateToHash(getProductSearchHash(selectedCategory, searchTerm));
    setCategoryMenuOpen(false);
    closeMobileMenu();
  };
  const mobileFlatLinks = navigation.items.flatMap((item) => (
    item.columns
      ? item.columns.flatMap((column) => column.items.map((subItem) => ({ label: subItem.label, href: getNavHref(item.label) })))
      : []
  ));

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <p>{t('welcomeMarketplace')}</p>
          <div className="top-links">
            <label className="top-select">
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                {Object.entries(LANGUAGE_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="top-select">
              <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                {Object.entries(CURRENCY_OPTIONS).map(([value, option]) => (
                  <option key={value} value={value}>{option.label}</option>
                ))}
              </select>
            </label>
            {header.topLinks.filter((link) => !link.hasArrow).map((link) => (
              <span key={link.label}>
                {link.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container header-main">
          <button type="button" className="mobile-menu-toggle" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="logo">
            <a href={HOME_HASH} onClick={(event) => {
              event.preventDefault();
              navigateToHash(HOME_HASH);
              closeMobileMenu();
            }}>
              <img src={heroSlides.logo} alt="FreshMart" />
            </a>
          </div>
          <div className="search-box" ref={searchBoxRef}>
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
                        closeMobileMenu();
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              placeholder={t('searchPlaceholder')}
            />
            <button className="search-btn" type="button" onClick={handleSearch}><Search size={20} /></button>
            {searchSuggestions.length > 0 ? (
              <div className="search-suggestions">
                {searchSuggestions.map((product) => (
                  <a
                    key={getProductSlug(product)}
                    href={getProductDetailHash(getProductSlug(product))}
                    className="search-suggestion-item"
                    onClick={(event) => {
                      event.preventDefault();
                      setSearchTerm(product.name);
                      navigateToHash(getProductDetailHash(getProductSlug(product)));
                      closeMobileMenu();
                    }}
                  >
                    <img src={product.image} alt={product.name} />
                    <span>
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <div className="header-actions">
            <div className="support">
              <span className="support-icon"><Phone size={18} /></span>
              <span className="support-copy">
                <small>{t('callUs')}</small>
                <strong>{header.phone}</strong>
              </span>
            </div>
            <a
              className="header-action-link"
              href={currentUser ? ACCOUNT_HASH : LOGIN_HASH}
              onClick={(event) => {
                event.preventDefault();
                navigateToHash(currentUser ? ACCOUNT_HASH : LOGIN_HASH);
                closeMobileMenu();
              }}
            >
              <User size={22} />
              <span>{currentUser ? currentUser.name.split(' ')[0] : t('login')}</span>
            </a>
            <a
              className="header-action-link"
              href={WISHLIST_HASH}
              onClick={(event) => {
                event.preventDefault();
                navigateToHash(WISHLIST_HASH);
                closeMobileMenu();
              }}
            >
              <Heart size={22} />
              <span>{t('wishlist')}</span>
              {wishlistCount > 0 ? <b>{wishlistCount}</b> : null}
            </a>
            <a
              className="cart-icon header-action-link"
              href={CART_HASH}
              onClick={(event) => {
                event.preventDefault();
                onCartClick?.();
                closeMobileMenu();
              }}
            >
              <ShoppingCart size={23} />
              <span>{t('cart')}</span>
              <b>{cartCount}</b>
            </a>
            {currentUser ? (
              <button type="button" className="header-logout-btn" onClick={onLogout}>Logout</button>
            ) : null}
          </div>
        </div>
      </header>

      <div className={`mobile-side-menu-backdrop ${mobileMenuOpen ? 'is-open' : ''}`} onClick={closeMobileMenu} />
      <aside className={`mobile-side-menu ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="mobile-side-menu-head">
          <img src={heroSlides.logo} alt="FreshMart" />
          <button type="button" aria-label="Close menu" onClick={closeMobileMenu}>
            <X size={22} />
          </button>
        </div>
        <div className="mobile-side-menu-body">
          <div className="mobile-side-menu-group">
            {navigation.items.map((item) => (
              <div className="mobile-side-menu-item" key={`mobile-${item.label}`}>
                <a
                  href={getNavHref(item.label)}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToHash(getNavHref(item.label));
                    closeMobileMenu();
                  }}
                >
                  {item.label}
                </a>
                {item.columns ? (
                  <div className="mobile-side-menu-sublist">
                    {item.columns.map((column) => (
                      <div key={`${item.label}-${column.title}`} className="mobile-side-menu-subgroup">
                        <strong>{column.title}</strong>
                        {column.items.map((subItem) => (
                          <span key={subItem.label}>{subItem.label}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mobile-side-menu-group">
            {navigation.utilities.map((utility) => (
              <a
                key={utility.label}
                href={HOME_HASH}
                onClick={(event) => {
                  event.preventDefault();
                  navigateToHash(HOME_HASH);
                  closeMobileMenu();
                }}
              >
                {utility.label}
              </a>
            ))}
          </div>

          <div className="mobile-side-menu-group mobile-side-menu-account">
            <a href={currentUser ? ACCOUNT_HASH : LOGIN_HASH} onClick={(event) => {
              event.preventDefault();
              navigateToHash(currentUser ? ACCOUNT_HASH : LOGIN_HASH);
              closeMobileMenu();
            }}>{currentUser ? currentUser.name : 'Login'}</a>
            {!currentUser ? (
              <a href={REGISTER_HASH} onClick={(event) => {
                event.preventDefault();
                navigateToHash(REGISTER_HASH);
                closeMobileMenu();
              }}>Register</a>
            ) : null}
            <a href={WISHLIST_HASH} onClick={(event) => {
              event.preventDefault();
              navigateToHash(WISHLIST_HASH);
              closeMobileMenu();
            }}>Wishlist</a>
            <a href={CART_HASH} onClick={(event) => {
              event.preventDefault();
              navigateToHash(CART_HASH);
              closeMobileMenu();
            }}>Cart ({cartCount})</a>
            {currentUser ? <button type="button" onClick={() => { onLogout(); closeMobileMenu(); }}>Logout</button> : null}
          </div>

          {mobileFlatLinks.length ? (
            <div className="mobile-side-menu-group mobile-side-menu-extra">
              {mobileFlatLinks.slice(0, 8).map((link) => (
                <span key={`extra-${link.label}`}>{link.label}</span>
              ))}
            </div>
          ) : null}
        </div>
      </aside>

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
  const { formatPrice } = useUi();
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
              <b>{formatPrice(product.price)}</b>
              <del>{formatPrice(product.oldPrice)}</del>
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
      <div className="price"><b>{formatPrice(product.price)}</b><del>{formatPrice(product.oldPrice)}</del></div>
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
  const { t, formatPrice } = useUi();
  const { categories, products, dealMonthProducts, sections } = pageData;
  const archiveMeta = sections.productList;
  const archiveProducts = [...dealMonthProducts, ...products];
  const routeCategorySlug = getRouteCategorySlug(routeHash);
  const routeSearchTerm = getRouteSearchTerm(routeHash);
  const routeCategoryTitle = routeSearchTerm ? t('searchResultsFor', { term: routeSearchTerm }) : getArchiveTitleFromSlug(routeCategorySlug, categories);
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

  const routeProducts = archiveProducts.filter((product) => {
    const matchesCategory = matchesArchiveCategory(product, routeCategorySlug);
    const matchesSearch = routeSearchTerm
      ? `${product.name} ${product.category}`.toLowerCase().includes(routeSearchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });
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
            <p>{routeProducts.length} {archiveMeta.resultLabel}</p>
          </div>
        </div>
      </section>

      <section className="container section checkout-section reveal">
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
                  <small>Price: {formatPrice(archiveMeta.priceRange?.min ?? 0)} - {formatPrice(pendingPriceLimit)}</small>
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
  const { formatPrice, t } = useUi();
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
              <strong>{formatPrice(product.price)}</strong>
              <del>{formatPrice(product.oldPrice)}</del>
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
                <Heart size={18} /> {t('wishlist')}
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

function CartPage({ productsBySlug, cartItems, updateCartQuantity, removeCartItem, clearCart }) {
  const { formatPrice, t } = useUi();
  const [shippingMethod, setShippingMethod] = useState('flat');
  const [shippingDraft, setShippingDraft] = useState(getInitialShippingSelection);
  const [shippingApplied, setShippingApplied] = useState(getInitialShippingSelection);
  const rows = cartItems.map((item) => {
    const product = productsBySlug[item.slug];
    return product ? { ...item, product } : null;
  }).filter(Boolean);
  const subtotal = rows.reduce((sum, row) => sum + (Number(row.product.price.replace(/[^0-9.]/g, '')) * row.quantity), 0);
  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const draftStates = SHIPPING_ZONES[shippingDraft.country].states;
  const appliedCountry = SHIPPING_ZONES[shippingApplied.country];
  const appliedState = appliedCountry.states.find((state) => state.code === shippingApplied.stateCode) ?? appliedCountry.states[0];
  const shippingRate = shippingMethod === 'local' ? 0 : appliedState.flatRate;
  const total = subtotal + shippingRate;

  const handleCountryChange = (country) => {
    const nextState = SHIPPING_ZONES[country].states[0];
    setShippingDraft((current) => ({
      ...current,
      country,
      stateCode: nextState.code
    }));
  };

  return (
    <main className="account-page">
      <section className="container section reveal">
        {rows.length === 0 ? (
          <EmptyStateCard title="Your cart is empty" text="Add products from the home, archive, or detail page to begin checkout." actionLabel="Continue Shopping" actionHref={HOME_HASH} />
        ) : (
          <div className="cart-layout">
            <div className="account-card cart-table-shell">
              <div className="cart-free-shipping">
                <p>Add <strong>{formatPrice(remainingForFreeShipping)}</strong> to cart and get free shipping!</p>
                <span><i style={{ width: `${progressPercent}%` }} /></span>
              </div>

              <div className="cart-table-head">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              <div className="cart-table">
                {rows.map(({ slug, quantity, product }) => {
                  const price = Number(product.price.replace(/[^0-9.]/g, ''));
                  return (
                    <div className="cart-row" key={slug}>
                      <button type="button" className="cart-remove-btn" onClick={() => removeCartItem(slug)} aria-label={`Remove ${product.name}`}>
                        <X size={14} />
                      </button>
                      <div className="cart-product">
                        <div className="cart-product-media">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="cart-product-copy">
                          <a href={getProductDetailHash(slug)} onClick={(event) => {
                            event.preventDefault();
                            navigateToHash(getProductDetailHash(slug));
                          }}>{product.name}</a>
                          <span><strong>Vendor:</strong> wolmart29 vendor2</span>
                        </div>
                      </div>
                      <strong className="cart-price">{formatPrice(product.price)}</strong>
                      <div className="cart-qty">
                        <button type="button" onClick={() => updateCartQuantity(slug, quantity - 1)}><Minus size={15} /></button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => updateCartQuantity(slug, quantity + 1)}><Plus size={15} /></button>
                      </div>
                      <strong className="cart-line-total">{formatPrice(price * quantity)}</strong>
                    </div>
                  );
                })}
              </div>

              <div className="cart-toolbar">
                <button type="button" className="cart-continue-btn" onClick={() => navigateToHash(HOME_HASH)}>{t('continueShopping')}</button>
                <div className="cart-toolbar-actions">
                  <button type="button" className="cart-outline-btn" onClick={clearCart}>{t('clearCart')}</button>
                  <button type="button" className="cart-muted-btn">{t('updateCart')}</button>
                </div>
              </div>

              <div className="cart-coupon">
                <h2>{t('couponDiscount')}</h2>
                <div className="cart-coupon-form">
                  <input type="text" placeholder="Enter coupon code here..." />
                  <button type="button" className="cart-outline-btn">{t('applyCoupon')}</button>
                </div>
              </div>
            </div>

            <aside className="account-card cart-summary">
              <h3>{t('cart')}</h3>
              <div><span>{t('subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="cart-summary-divider" />
              <div className="cart-summary-shipping-title"><span>{t('shipping')}</span></div>
              <label className="cart-shipping-option">
                <input
                  type="checkbox"
                  name="shipping-method"
                  checked={shippingMethod === 'flat'}
                  onChange={() => setShippingMethod('flat')}
                />
                <span>{t('flatRate')}: {formatPrice(appliedState.flatRate)}</span>
              </label>
              <label className="cart-shipping-option">
                <input
                  type="checkbox"
                  name="shipping-method"
                  checked={shippingMethod === 'local'}
                  onChange={() => setShippingMethod('local')}
                />
                <span>{t('localPickup')}</span>
              </label>
              <p className="cart-summary-destination">
                Shipping to <strong>{appliedState.code}, {appliedCountry.label}.</strong>
              </p>
              <div className="cart-summary-form">
                <select value={shippingDraft.country} onChange={(event) => handleCountryChange(event.target.value)}>
                  <option value="usa">United States (US)</option>
                  <option value="india">India</option>
                  <option value="germany">Germany</option>
                </select>
                <select value={shippingDraft.stateCode} onChange={(event) => setShippingDraft((current) => ({ ...current, stateCode: event.target.value }))}>
                  {draftStates.map((state) => (
                    <option key={`${shippingDraft.country}-${state.code}`} value={state.code}>{state.label}</option>
                  ))}
                </select>
                <input type="text" placeholder={t('city')} value={shippingDraft.city} onChange={(event) => setShippingDraft((current) => ({ ...current, city: event.target.value }))} />
                <input type="text" placeholder={t('postcodeZip')} value={shippingDraft.zip} onChange={(event) => setShippingDraft((current) => ({ ...current, zip: event.target.value }))} />
                <button type="button" className="cart-outline-btn" onClick={() => setShippingApplied(shippingDraft)}>{t('updateTotals')}</button>
              </div>
              <div className="cart-summary-charge"><span>{t('shippingCost')}</span><strong>{shippingMethod === 'local' ? t('free') : formatPrice(shippingRate)}</strong></div>
              <div className="cart-summary-total"><span>{t('total')}</span><strong>{formatPrice(total)}</strong></div>
              <button type="button" className="cart-checkout-btn" onClick={() => navigateToHash(CHECKOUT_HASH)}>{t('checkout')}</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function CartDrawer({ open, cartItems, productsBySlug, updateCartQuantity, removeCartItem, onClose }) {
  const { formatPrice, t } = useUi();
  const rows = cartItems.map((item) => {
    const product = productsBySlug[item.slug];
    return product ? { ...item, product } : null;
  }).filter(Boolean);
  const subtotal = rows.reduce((sum, row) => sum + (Number(row.product.price.replace(/[^0-9.]/g, '')) * row.quantity), 0);

  return (
    <>
      <div className={`cart-drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="cart-drawer-head">
          <h3>{t('shoppingCart')}</h3>
          <button type="button" className="cart-drawer-close" onClick={onClose}>
            Close <X size={18} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {rows.length === 0 ? (
            <div className="cart-drawer-empty">
              <h4>Your cart is empty</h4>
              <p>Add products from the catalogue to see them here.</p>
              <button type="button" onClick={onClose}>{t('continueShopping')}</button>
            </div>
          ) : (
            <>
              <div className="cart-drawer-items">
                {rows.map(({ slug, quantity, product }) => {
                  const price = Number(product.price.replace(/[^0-9.]/g, ''));
                  return (
                    <div className="cart-drawer-item" key={slug}>
                      <button type="button" className="cart-drawer-remove" onClick={() => removeCartItem(slug)} aria-label={`Remove ${product.name}`}>
                        <X size={14} />
                      </button>
                      <img src={product.image} alt={product.name} />
                      <div className="cart-drawer-item-copy">
                        <a href={getProductDetailHash(slug)} onClick={(event) => {
                          event.preventDefault();
                          onClose();
                          navigateToHash(getProductDetailHash(slug));
                        }}>{product.name}</a>
                        <span>{quantity} x {formatPrice(price)}</span>
                        <div className="cart-drawer-qty">
                          <button type="button" onClick={() => updateCartQuantity(slug, quantity - 1)}><Minus size={14} /></button>
                          <strong>{quantity}</strong>
                          <button type="button" onClick={() => updateCartQuantity(slug, quantity + 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-drawer-footer">
                <div className="cart-drawer-subtotal">
                  <span>{t('subtotal')}:</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div className="cart-drawer-actions">
                  <button type="button" className="cart-drawer-view" onClick={() => {
                    onClose();
                    navigateToHash(CART_HASH);
                  }}>{t('viewCart')}</button>
                  <button type="button" className="cart-drawer-checkout" onClick={() => {
                    onClose();
                    navigateToHash(CHECKOUT_HASH);
                  }}>{t('checkout')}</button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
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

function AuthPage({ mode, currentUser, onRegister, onLogin, onForgot }) {
  const { t } = useUi();
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    login: t('login'),
    register: t('register'),
    forgot: t('forgotPassword')
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage('');

    const action = async () => {
      if (mode === 'register') {
        await onRegister({
          name: formState.name || formState.email.split('@')[0],
          email: formState.email,
          password: formState.password
        });
        navigateToHash(ACCOUNT_HASH);
        return;
      }

      if (mode === 'login') {
        await onLogin({
          email: formState.email,
          password: formState.password
        });
        navigateToHash(ACCOUNT_HASH);
        return;
      }

      if (mode === 'forgot') {
        const passwordHint = await onForgot(formState.email);
        setMessage(`Password hint: ${passwordHint}`);
      }
    };

    action()
      .catch((error) => {
        setMessage(error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <main className="account-page">
      <AccountPageHero title={titleMap[mode]} crumbs={[{ label: titleMap[mode] }]} />
      <section className="container section reveal">
        <div className="auth-shell">
          <div className="auth-card">
            <h2>{titleMap[mode]}</h2>
            <p>{mode === 'forgot' ? t('enterEmailRecover') : t('useFreshMartFlow')}</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' ? (
                <input value={formState.name} onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))} placeholder={t('fullName')} />
              ) : null}
              <input value={formState.email} onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))} placeholder="Email address" type="email" required />
              {mode !== 'forgot' ? (
                <input value={formState.password} onChange={(event) => setFormState((state) => ({ ...state, password: event.target.value }))} placeholder="Password" type="password" required />
              ) : null}
              {message ? <div className="auth-message">{message}</div> : null}
              <button type="submit" disabled={submitting}>{titleMap[mode]}</button>
            </form>
            <div className="auth-links">
              {mode !== 'login' ? <a href={LOGIN_HASH} onClick={(event) => { event.preventDefault(); navigateToHash(LOGIN_HASH); }}>{t('alreadyHaveAccount')}</a> : null}
              {mode !== 'register' ? <a href={REGISTER_HASH} onClick={(event) => { event.preventDefault(); navigateToHash(REGISTER_HASH); }}>{t('createAccount')}</a> : null}
              {mode !== 'forgot' ? <a href={FORGOT_HASH} onClick={(event) => { event.preventDefault(); navigateToHash(FORGOT_HASH); }}>{t('forgotPasswordLink')}</a> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckoutPage({ currentUser, cartItems, productsBySlug, placeOrder }) {
  const { t, formatPrice } = useUi();
  const initialNameParts = (currentUser?.name ?? '').trim().split(/\s+/).filter(Boolean);
  const initialFirstName = initialNameParts[0] ?? '';
  const initialLastName = initialNameParts.slice(1).join(' ');
  const [shippingMethod, setShippingMethod] = useState('flat');
  const [formState, setFormState] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    company: '',
    country: 'usa',
    state: 'CA',
    address: '',
    addressTwo: '',
    city: '',
    zip: '',
    phone: '',
    email: currentUser?.email ?? '',
    shipDifferent: false,
    notes: '',
    paymentMethod: 'bank'
  });
  const rows = cartItems.map((item) => {
    const product = productsBySlug[item.slug];
    return product ? { ...item, product } : null;
  }).filter(Boolean);
  const subtotal = rows.reduce((sum, row) => sum + (Number(row.product.price.replace(/[^0-9.]/g, '')) * row.quantity), 0);
  const checkoutStates = SHIPPING_ZONES[formState.country].states;
  const selectedState = checkoutStates.find((state) => state.code === formState.state) ?? checkoutStates[0];
  const shippingCost = shippingMethod === 'local' ? 0 : selectedState.flatRate;
  const total = subtotal + shippingCost;
  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  useEffect(() => {
    setFormState((state) => ({
      ...state,
      firstName: currentUser?.name ? currentUser.name.split(' ')[0] : state.firstName,
      lastName: currentUser?.name ? currentUser.name.split(' ').slice(1).join(' ') : state.lastName,
      email: currentUser?.email ?? state.email
    }));
  }, [currentUser]);

  useEffect(() => {
    const defaultState = SHIPPING_ZONES[formState.country].states[0];
    if (!checkoutStates.some((state) => state.code === formState.state)) {
      setFormState((state) => ({ ...state, state: defaultState.code }));
    }
  }, [checkoutStates, formState.country, formState.state]);

  return (
    <main className="account-page">
      <section className="container section reveal">
        {rows.length === 0 ? (
          <EmptyStateCard title="Cart is empty" text="Add at least one product before checkout." actionLabel="Browse Products" actionHref={HOME_HASH} />
        ) : (
          <div className="checkout-shell">
            <form
              className="checkout-layout"
              onSubmit={(event) => {
                event.preventDefault();
                placeOrder({
                  name: `${formState.firstName} ${formState.lastName}`.trim(),
                  email: formState.email,
                  phone: formState.phone,
                  address: `${formState.address}${formState.addressTwo ? `, ${formState.addressTwo}` : ''}`,
                  city: formState.city,
                  zip: formState.zip,
                  company: formState.company,
                  country: SHIPPING_ZONES[formState.country].label,
                  state: selectedState.label,
                  notes: formState.notes,
                  paymentMethod: formState.paymentMethod
                });
              }}
            >
              <div className="checkout-billing">
                <h3>{t('billingDetails')}</h3>
                <div className="checkout-grid">
                  <label>
                    <span>{t('firstName')}</span>
                    <input value={formState.firstName} onChange={(event) => setFormState((state) => ({ ...state, firstName: event.target.value }))} required />
                  </label>
                  <label>
                    <span>{t('lastName')}</span>
                    <input value={formState.lastName} onChange={(event) => setFormState((state) => ({ ...state, lastName: event.target.value }))} required />
                  </label>
                </div>
                <label className="checkout-field">
                  <span>{t('companyNameOptional')}</span>
                  <input value={formState.company} onChange={(event) => setFormState((state) => ({ ...state, company: event.target.value }))} />
                </label>
                <label className="checkout-field">
                  <span>{t('countryRegion')}</span>
                  <select value={formState.country} onChange={(event) => setFormState((state) => ({ ...state, country: event.target.value }))}>
                    <option value="usa">United States (US)</option>
                    <option value="india">India</option>
                    <option value="germany">Germany</option>
                  </select>
                </label>
                <label className="checkout-field">
                  <span>{t('streetAddress')}</span>
                  <input value={formState.address} onChange={(event) => setFormState((state) => ({ ...state, address: event.target.value }))} placeholder="House number and street name" required />
                </label>
                <label className="checkout-field">
                  <input value={formState.addressTwo} onChange={(event) => setFormState((state) => ({ ...state, addressTwo: event.target.value }))} placeholder={t('apartmentOptional')} />
                </label>
                <div className="checkout-grid">
                  <label>
                    <span>{t('townCity')}</span>
                    <input value={formState.city} onChange={(event) => setFormState((state) => ({ ...state, city: event.target.value }))} required />
                  </label>
                  <label>
                    <span>{t('state')}</span>
                    <select value={formState.state} onChange={(event) => setFormState((state) => ({ ...state, state: event.target.value }))}>
                      {checkoutStates.map((state) => (
                        <option key={`${formState.country}-${state.code}`} value={state.code}>{state.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="checkout-grid">
                  <label>
                    <span>{t('zipCode')}</span>
                    <input value={formState.zip} onChange={(event) => setFormState((state) => ({ ...state, zip: event.target.value }))} required />
                  </label>
                  <label>
                    <span>{t('phone')}</span>
                    <input value={formState.phone} onChange={(event) => setFormState((state) => ({ ...state, phone: event.target.value }))} required />
                  </label>
                </div>
                <label className="checkout-field">
                  <span>{t('emailAddress')}</span>
                  <input type="email" value={formState.email} onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))} required />
                </label>
                <label className="checkout-check">
                  <input type="checkbox" checked={formState.shipDifferent} onChange={(event) => setFormState((state) => ({ ...state, shipDifferent: event.target.checked }))} />
                  <span>{t('shipDifferentAddress')}</span>
                </label>
                <label className="checkout-field">
                  <span>{t('orderNotesOptional')}</span>
                  <textarea value={formState.notes} onChange={(event) => setFormState((state) => ({ ...state, notes: event.target.value }))} placeholder={t('notesPlaceholder')} rows={4} />
                </label>
              </div>

              <aside className="checkout-order">
                <h3>{t('yourOrder')}</h3>
                <div className="checkout-order-head">
                  <span>Product</span>
                </div>
                <div className="checkout-order-items">
                  {rows.map((row) => (
                    <div className="checkout-order-item" key={row.slug}>
                      <div>
                        <strong>{row.product.name} × {row.quantity}</strong>
                        <span>Vendor: wolmart29 vendor2</span>
                      </div>
                      <b>{formatPrice((Number(row.product.price.replace(/[^0-9.]/g, '')) * row.quantity))}</b>
                    </div>
                  ))}
                </div>
                <div className="checkout-order-row"><span>{t('subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div>
                <div className="checkout-order-shipping">
                  <span>{t('shipping')}</span>
                  <label>
                    <input type="radio" name="checkout-shipping" checked={shippingMethod === 'flat'} onChange={() => setShippingMethod('flat')} />
                    <span>{t('flatRate')}</span>
                  </label>
                  <label>
                    <input type="radio" name="checkout-shipping" checked={shippingMethod === 'local'} onChange={() => setShippingMethod('local')} />
                    <span>{t('localPickup')}</span>
                  </label>
                </div>
                <div className="checkout-order-row"><span>{t('total')}</span><strong>{formatPrice(total)}</strong></div>
                <div className="checkout-order-progress">
                  <p>Add <strong>{formatPrice(remainingForFreeShipping)}</strong> to cart and get free shipping!</p>
                  <span><i style={{ width: `${progressPercent}%` }} /></span>
                </div>
                <div className="checkout-payment">
                  <h4>{t('paymentMethods')}</h4>
                  <label className="checkout-payment-option is-active">
                    <input type="radio" name="payment-method" checked={formState.paymentMethod === 'bank'} onChange={() => setFormState((state) => ({ ...state, paymentMethod: 'bank' }))} />
                    <span>{t('directBankTransfer')}</span>
                  </label>
                  <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                  <label className="checkout-payment-option">
                    <input type="radio" name="payment-method" checked={formState.paymentMethod === 'check'} onChange={() => setFormState((state) => ({ ...state, paymentMethod: 'check' }))} />
                    <span>{t('checkPayments')}</span>
                  </label>
                  <label className="checkout-payment-option">
                    <input type="radio" name="payment-method" checked={formState.paymentMethod === 'cod'} onChange={() => setFormState((state) => ({ ...state, paymentMethod: 'cod' }))} />
                    <span>{t('cashOnDelivery')}</span>
                  </label>
                </div>
                <button type="submit" className="checkout-place-order">{t('placeOrder')}</button>
              </aside>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

function AccountPage({ currentUser, orders, updateProfile }) {
  const { t } = useUi();
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
              <h3>{t('accountDetails')}</h3>
              <form
                className="auth-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  updateProfile(formState);
                }}
              >
                <input value={formState.name} onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))} placeholder={t('fullName')} />
                <input value={formState.email} onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))} placeholder={t('emailAddress')} type="email" />
                <button type="submit">{t('saveChanges')}</button>
              </form>
            </div>
            <div className="account-card">
              <h3>{t('accountSnapshot')}</h3>
              <div className="account-stats">
                <div><strong>{orders.length}</strong><span>{t('orders')}</span></div>
                <div><strong>{currentUser.name.split(' ')[0]}</strong><span>{t('member')}</span></div>
              </div>
              <button type="button" onClick={() => navigateToHash(ORDERS_HASH)}>{t('viewOrders')}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function OrdersPage({ currentUser, orders, productsBySlug }) {
  const { t, formatPrice } = useUi();
  return (
    <main className="account-page">
      <AccountPageHero title={t('myOrders')} crumbs={[{ label: t('myOrders') }]} />
      <section className="container section reveal">
        {!currentUser ? (
          <EmptyStateCard title="Login required" text="Please login to access your orders." actionLabel="Go To Login" actionHref={LOGIN_HASH} />
        ) : orders.length === 0 ? (
          <EmptyStateCard title="No orders yet" text="Complete a checkout and your orders will appear here." actionLabel="Start Shopping" actionHref={HOME_HASH} />
        ) : (
          <div className="account-card orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <span>{order.date}</span>
                  </div>
                  <div>
                    <strong>{formatPrice(order.total)}</strong>
                    <span>{order.items.length} items</span>
                  </div>
                  <div>
                    <strong>{order.status}</strong>
                    <span>{order.customer.city}</span>
                  </div>
                </div>
                <div className="order-products">
                  {order.items.map((item) => {
                    const fallbackProduct = productsBySlug[item.slug];
                    const image = item.image ?? fallbackProduct?.image;
                    const category = item.category ?? fallbackProduct?.category ?? '';

                    return (
                      <a
                        key={`${order.id}-${item.slug}`}
                        className="order-product-row"
                        href={getProductDetailHash(item.slug)}
                        onClick={(event) => {
                          event.preventDefault();
                          navigateToHash(getProductDetailHash(item.slug));
                        }}
                      >
                        {image ? <img src={image} alt={item.name} /> : null}
                        <div>
                          <strong>{item.name}</strong>
                          <span>{category}</span>
                        </div>
                        <b>{item.quantity} x {formatPrice(item.price)}</b>
                      </a>
                    );
                  })}
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
  const { t, formatPrice } = useUi();
  return (
    <main className="account-page">
      <section className="container section reveal">
        <div className="success-card success-card-modern">
          <div className="success-hero">
            <span className="success-icon"><CheckCircle2 size={34} /></span>
            <span className="success-kicker">{t('orderConfirmed')}</span>
            <h2>{t('thankYouOrder')}</h2>
            <p>{t('successCopy')}</p>
          </div>
          {order ? (
            <>
              <div className="success-summary-grid">
                <div>
                  <strong>{t('orderId')}</strong>
                  <span>{order.id}</span>
                </div>
                <div>
                  <strong>{t('total')}</strong>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div>
                  <strong>{t('status')}</strong>
                  <span>{order.status}</span>
                </div>
                <div>
                  <strong>{t('date')}</strong>
                  <span>{order.date}</span>
                </div>
              </div>
              <div className="success-summary">
                <div><strong>{t('customer')}</strong><span>{order.customer?.name ?? 'Guest'}</span></div>
                <div><strong>Email</strong><span>{order.customer?.email ?? 'Not provided'}</span></div>
                <div><strong>{t('shippingTo')}</strong><span>{order.customer?.city ?? 'N/A'}{order.customer?.state ? `, ${order.customer.state}` : ''}</span></div>
              </div>
            </>
          ) : null}
          <div className="success-actions">
            <button type="button" onClick={() => navigateToHash(ORDERS_HASH)}>{t('viewOrders')}</button>
            <button type="button" className="is-secondary" onClick={() => navigateToHash(HOME_HASH)}>{t('backToHome')}</button>
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
  const [currency, setCurrency] = useState(() => readStorageValue(STORAGE_KEYS.currency, 'usd'));
  const [language, setLanguage] = useState(() => readStorageValue(STORAGE_KEYS.language, 'english'));
  const [pageData, setPageData] = useState(null);
  const [pageError, setPageError] = useState('');
  const [routeHash, setRouteHash] = useState(window.location.hash || HOME_HASH);
  const [currentUser, setCurrentUser] = useState(() => readStorageValue(STORAGE_KEYS.currentUser, null));
  const [cartItems, setCartItems] = useState(() => readStorageValue(STORAGE_KEYS.cart, []));
  const [wishlistItems, setWishlistItems] = useState(() => readStorageValue(STORAGE_KEYS.wishlist, []));
  const [orders, setOrders] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.currency, JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.language, JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

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
    if (!cartDrawerOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cartDrawerOpen]);

  useEffect(() => {
    setCartDrawerOpen(false);
  }, [routeHash]);

  useEffect(() => {
    if (!currentUser?.id) {
      setOrders([]);
      return;
    }

    let isActive = true;
    getOrdersRequest(currentUser.id)
      .then((nextOrders) => {
        if (isActive) {
          setOrders(nextOrders);
        }
      })
      .catch((error) => {
        console.error('Failed to load orders:', error);
      });

    return () => {
      isActive = false;
    };
  }, [currentUser]);

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
  const showFloatingToolbar = routeHash !== CART_HASH && routeHash !== CHECKOUT_HASH;
  const t = (key, vars) => interpolate(TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.english[key] ?? key, vars);
  const formatPrice = (value) => {
    const currencyConfig = CURRENCY_OPTIONS[currency] ?? CURRENCY_OPTIONS.usd;
    const convertedValue = parsePriceValue(value) * currencyConfig.rate;
    return new Intl.NumberFormat(currencyConfig.locale, {
      style: 'currency',
      currency: currencyConfig.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedValue);
  };

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

  const clearCart = () => {
    setCartItems([]);
  };

  const updateProfile = ({ name, email }) => {
    if (!currentUser) {
      return;
    }

    updateUserProfileRequest({ id: currentUser.id, name, email })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
      })
      .catch((error) => {
        console.error('Failed to update profile:', error);
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateToHash(HOME_HASH);
  };

  const placeOrder = async (customer) => {
    if (!currentUser?.id) {
      navigateToHash(LOGIN_HASH);
      return;
    }

    const items = cartItems.map((item) => {
      const product = productsBySlug[item.slug];
      return {
        slug: item.slug,
        quantity: item.quantity,
        name: product?.name ?? item.slug,
        price: Number((product?.price ?? '$0').replace(/[^0-9.]/g, '')),
        image: product?.image ?? '',
        category: product?.category ?? ''
      };
    });
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = `FM${Date.now().toString().slice(-8)}`;
    const nextOrder = await createOrderRequest({
      userId: currentUser.id,
      orderId,
      status: 'Processing',
      total,
      customer,
      items
    });
    setOrders((items) => [nextOrder, ...items]);
    setCartItems([]);
    navigateToHash(getSuccessHash(orderId));
  };

  const handleRegister = async (user) => {
    const nextUser = await registerUserRequest(user);
    setCurrentUser(nextUser);
  };

  const handleLogin = async (credentials) => {
    const loggedInUser = await loginUserRequest(credentials);
    setCurrentUser(loggedInUser);
  };

  const handleForgotPassword = async (email) => {
    const result = await getPasswordHint(email);
    return result.passwordHint;
  };

  return (
    <UiContext.Provider value={{ currency, language, setCurrency, setLanguage, t, formatPrice }}>
    <>
      <Header
        header={pageData.header}
        heroSlides={pageData.heroSlides}
        navigation={pageData.navigation}
        currentUser={currentUser}
        cartCount={cartCount}
        wishlistCount={wishlistProducts.length}
        onLogout={handleLogout}
        onCartClick={() => setCartDrawerOpen(true)}
        searchProducts={allProducts}
      />
      {routeHash === CART_HASH ? (
        <CartPage productsBySlug={productsBySlug} cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeCartItem={removeCartItem} clearCart={clearCart} />
      ) : routeHash === WISHLIST_HASH ? (
        <WishlistPage wishlistProducts={wishlistProducts} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
      ) : routeHash === LOGIN_HASH ? (
        <AuthPage mode="login" currentUser={currentUser} onRegister={handleRegister} onLogin={handleLogin} onForgot={handleForgotPassword} />
      ) : routeHash === REGISTER_HASH ? (
        <AuthPage mode="register" currentUser={currentUser} onRegister={handleRegister} onLogin={handleLogin} onForgot={handleForgotPassword} />
      ) : routeHash === FORGOT_HASH ? (
        <AuthPage mode="forgot" currentUser={currentUser} onRegister={handleRegister} onLogin={handleLogin} onForgot={handleForgotPassword} />
      ) : routeHash === CHECKOUT_HASH ? (
        <CheckoutPage currentUser={currentUser} cartItems={cartItems} productsBySlug={productsBySlug} placeOrder={placeOrder} />
      ) : routeHash === ACCOUNT_HASH ? (
        <AccountPage currentUser={currentUser} orders={orders} updateProfile={updateProfile} />
      ) : routeHash === ORDERS_HASH ? (
        <OrdersPage currentUser={currentUser} orders={orders} productsBySlug={productsBySlug} />
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
      {showFloatingToolbar ? <FloatingToolbar /> : null}
      <CartDrawer
        open={cartDrawerOpen}
        cartItems={cartItems}
        productsBySlug={productsBySlug}
        updateCartQuantity={updateCartQuantity}
        removeCartItem={removeCartItem}
        onClose={() => setCartDrawerOpen(false)}
      />
    </>
    </UiContext.Provider>
  );
}

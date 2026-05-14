import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);
const LANGUAGE_STORAGE_KEY = "dress-language";

const translations = {
  en: {
    languageName: "English",
    common: {
      loading: "Loading...",
      item: "item",
      items: "items",
      remove: "Remove",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      reset: "Reset",
      apply: "Apply",
      save: "Save",
      update: "Update",
      viewItem: "View item",
      continueShopping: "Continue shopping",
      backToHome: "Back to Home",
      addToCart: "Add to cart",
      proceedToCheckout: "Proceed to checkout",
      shopNow: "Shop Now",
      defaultLabel: "Default",
      coupon: "Coupon",
      freeShipping: "Free Shipping",
      totalItems: "Total Item",
      subtotal: "Subtotal",
      discount: "Discount",
      total: "Total",
      shipping: "Shipping",
      color: "Color",
      quantity: "Quantity",
      trackOrder: "Track order",
      selectState: "Select state"
    },
    header: {
      allCategory: "ALL CATEGORY",
      shop: "Shop",
      pages: "PAGES",
      blogs: "BLOGS",
      collections: "COLLECTIONS",
      logIn: "Log In",
      myWishList: "My Wish List",
      myOrders: "My Orders",
      myAddress: "My Address",
      logOut: "Log out",
      cart: "CART",
      english: "English",
      german: "German",
      french: "French"
    },
    hero: {
      slide1Title: "Modern and trending fashion for everyone",
      slide1Description:
        "Fashion allows individuals to showcase their personality, creativity, and cultural identity, while also serving practical purposes such as protection and comfort.",
      slide1TopHotspot: "Down Cotton Tshirt for Women",
      slide1BottomHotspot: "Girls Frock Dress",
      slide2Title: "Modern and timeless clothes from the best stylists.",
      slide2Description:
        "These dresses are often bold and eye-catching, and they can be dressed up or down depending on the occasion.",
      slide2TopHotspot: "Cotton Hat",
      slide2BottomHotspot: "Junior Sweatshirt Kids",
      slide3Title: "Make a Great Impression By Wearing The Right Clothes",
      slide3Description:
        "Denim is always a classic, and it's no exception in 2023. Denim jackets, jeans, and skirts are all popular trends this year.",
      slide3TopHotspot: "Pro Blue Running Sports",
      slide3BottomHotspot: "Rust Solid Culottes",
      partners: "PARTNERS",
      featuredPoint: "Featured product point",
      productSlides: "Product slides",
      goToProduct: "Go to product {{count}}"
    },
    auth: {
      welcomeBack: "Welcome back",
      loginTitle: "Sign in to your fashion account",
      loginDescription:
        "Access saved edits, checkout faster, and keep track of your latest orders in one polished space.",
      loginSubmit: "Log In",
      newHere: "New here?",
      createAccount: "Create account",
      createAccountEyebrow: "Create account",
      createAccountTitle: "Join the Vogue edit",
      createAccountDescription:
        "Build your profile to save favorites, unlock early offers, and move through checkout with less friction.",
      createAccountSubmit: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      passwordReset: "Password reset",
      recoverAccount: "Recover your account",
      recoverDescription:
        "Enter the email linked to your account and we will send a secure reset link so you can get back in quickly.",
      sendReset: "Send Reset Link",
      rememberedIt: "Remembered it?",
      backToLogin: "Back to login",
      privateAccess: "Private Fashion Access",
      styleSaved: "Style, saved beautifully.",
      authIntro:
        "A refined account space for shopping, wishlists, order tracking, and exclusive fashion updates.",
      highlight1: "Curated style picks saved to your account",
      highlight2: "Fast checkout for your next order",
      highlight3: "Launch offers and seasonal member drops",
      firstName: "First name",
      lastName: "Last name",
      emailAddress: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      keepSignedIn: "Keep me signed in",
      forgotPassword: "Forgot password?",
      agreeTerms: "I agree to the privacy policy and terms.",
      pleaseWait: "Please wait...",
      continueWith: "or continue with",
      google: "Google",
      apple: "Apple",
      forgotHelper:
        "We will send a reset link to your inbox. Use a valid email address tied to your account.",
      placeholderEmail: "name@email.com",
      placeholderPassword: "Enter your password",
      placeholderFirstName: "Ava",
      placeholderLastName: "Johnson",
      placeholderConfirmPassword: "Re-enter your password"
    },
    newsletter: {
      eyebrow: "Newsletter",
      title: "Join for launch edits, offers, and trend notes.",
      placeholder: "Enter your email",
      subscribe: "Subscribe",
      emailAddress: "Email address"
    },
    featured: {
      eyebrow: "Featured products",
      title: "Highlighted styles from the latest edit.",
      viewAll: "View all products"
    },
    footer: {
      description:
        "The Modern Dress is a great piece for the spring and summer. The beautiful open back with structured shoulders will great on all ages and body types, while the slouchy fit can be dressed up or down depending on your mood.",
      shop: "Shop:",
      extras: "Extras:",
      categories: "Categories:",
      quickLinks: "Quick Links:",
      social: "Social {{item}}"
    },
    collections: {
      loadingCollections: "Loading collections",
      title: "Collections",
      itemsCount: "{{count}} - ITEMS",
      loadingCollection: "Loading collection",
      filters: "Filters",
      home: "Home",
      sortBy: "Sort by:",
      bestSelling: "Best selling",
      priceLow: "Price: low to high",
      priceHigh: "Price: high to low",
      nameAsc: "Alphabetically, A-Z",
      availability: "Availability",
      inStock: "In stock",
      outOfStock: "Out of stock",
      price: "Price",
      productType: "Product Type",
      brand: "Brand",
      color: "Color",
      highestPrice: "The highest price is ${{price}}",
      minPrice: "Min price:",
      maxPrice: "Max price:"
    },
    product: {
      loadingProduct: "Loading product",
      addToWishlist: "Add to Wishlist",
      savedToWishlist: "Saved to Wishlist",
      writeReview: "Write a Review",
      buyItNow: "Buy It Now",
      soldOut: "Sold Out",
      seeSizingGuide: "See Sizing Guide",
      share: "Share",
      linkCopied: "Link copied",
      shareUnavailable: "Share unavailable",
      recentlyViewed: "Recently Viewed Products",
      customerReviews: "Customer Reviews",
      beFirstReview: "Be the first to write a review",
      writeReviewAction: "Write a review",
      reviewSubmitted: "Review submitted successfully.",
      reviewIncomplete: "Please complete all required review fields.",
      submitting: "Submitting...",
      submitReview: "Submit Review",
      cancelReview: "Cancel review",
      reviewTitle: "Review Title (100)",
      reviewContent: "Review content",
      pictureVideo: "Picture/Video (optional)",
      displayName: "Display name (displayed publicly like John Smith)",
      yourEmail: "Your email address",
      upload: "Upload",
      quantity: "Quantity",
      option: "Option",
      sizingGuide: "Sizing Guide",
      closeSizingGuide: "Close sizing guide"
    },
    cartDrawer: {
      title: "My Cart",
      awayFromFreeShipping: "You're ${{amount}} away from FREE shipping.",
      unlockedFreeShipping: "You unlocked FREE shipping.",
      empty: "Your cart is empty.",
      couponSection: "Coupon Section",
      useCoupons: "Use SAVE10 or VOGUE50",
      viewCart: "View Cart",
      proceedToCheckout: "Proceed to checkout",
      closeCart: "Close cart"
    },
    cartPage: {
      title: "View Cart",
      itemsInBag: "{{count}} {{label}} in your shopping bag.",
      empty: "Your cart is empty.",
      couponSection: "Coupon Section",
      useCoupons: "Use SAVE10 or VOGUE50"
    },
    wishlist: {
      eyebrow: "Saved for later",
      title: "My Wish List",
      description: "Keep your favorite pieces close and move them to cart whenever you are ready.",
      savedItems: "{{count}} {{label}} saved",
      clearAll: "Clear all",
      removeItem: "Remove {{name}} from wishlist",
      emptyTitle: "Your wishlist is empty.",
      emptyDescription: "Browse collections and tap the heart to save products here.",
      exploreCollections: "Explore collections"
    },
    orders: {
      eyebrow: "Account orders",
      title: "My Orders",
      description:
        "Review your recent purchases, estimated deliveries, and jump into full tracking in one click.",
      totalOrders: "Total orders",
      itemsOrdered: "Items ordered",
      noOrdersTitle: "No orders yet.",
      noOrdersDescription: "Placed orders will appear here automatically after checkout.",
      startShopping: "Start shopping",
      tracking: "Tracking",
      delivery: "Delivery",
      status: "Status"
    },
    address: {
      eyebrow: "Checkout details",
      title: "My Address",
      description: "Save delivery details once and use them during checkout without typing the same information again.",
      editAddress: "Edit address",
      addNewAddress: "Add new address",
      savedAddresses: "Saved addresses",
      noSavedAddresses: "No addresses saved yet.",
      noSavedAddressesDescription: "Add a delivery address here and checkout will use it automatically.",
      setAsDefault: "Set as default address",
      saveAddress: "Save address",
      updateAddress: "Update address",
      addressUpdated: "Address updated.",
      addressSaved: "Address saved.",
      requiredFields: "Please complete all required address fields.",
      home: "Home",
      office: "Office",
      studio: "Studio",
      emailOrMobile: "Email or mobile",
      apartment: "Apartment, suite, etc.",
      city: "City",
      state: "State",
      zipCode: "ZIP code",
      country: "Country",
      address: "Address",
      label: "Label",
      makeDefault: "Make default",
      setDefault: "Set as default address"
    },
    checkout: {
      contact: "Contact",
      signIn: "Sign in",
      emailNews: "Email me with news and offers",
      delivery: "Delivery",
      manageAddresses: "Manage addresses",
      useSavedAddress: "Use saved address",
      shippingMethod: "Shipping method",
      freeShipping: "Free shipping",
      standardShipping: "Standard shipping",
      enterAddressToView: "Enter your shipping address to view available shipping methods.",
      payment: "Payment",
      paymentSecure: "All transactions are secure and encrypted.",
      creditCard: "Credit card",
      cashOnDelivery: "Cash on delivery",
      useShippingAsBilling: "Use shipping address as billing address",
      cashOnDeliveryDescription: "Pay with cash when your order is delivered to your address.",
      processing: "Processing...",
      payNow: "Pay now",
      placeOrder: "Place order",
      cartEmpty: "Your cart is empty.",
      completeFields: "Please complete the required contact and delivery fields.",
      completePayment: "Please complete your card payment details.",
      failedCreateOrder: "Failed to create order.",
      note: "Note",
      addOrderNote: "Add a note for your order",
      enterCoupon: "Enter coupon code",
      backToCart: "Back to cart",
      saveForNextTime: "Save this information for next time",
      cardNumber: "Card number",
      expiryDate: "Expiration date (MM / YY)",
      securityCode: "Security code",
      nameOnCard: "Name on card",
      totalItemsWithCount: "Subtotal · {{count}} {{label}}"
    },
    tracking: {
      title: "Track your order",
      description: "Enter your order number to see live status, items, and estimated delivery date.",
      orderNumber: "Order number",
      recentOrders: "Recent orders",
      loadingOrder: "Loading order...",
      orderNotFound: "Order not found.",
      estimatedDelivery: "Estimated delivery"
    },
    orderSuccess: {
      loading: "Loading order confirmation",
      notFoundTitle: "Order not found",
      placed: "Order placed",
      confirmed: "Your order is confirmed.",
      orderSummary: "Order summary"
    }
  },
  de: {
    languageName: "Deutsch"
  },
  fr: {
    languageName: "Français"
  }
};

function deepMerge(base, override) {
  if (!override) {
    return base;
  }

  const result = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object") {
      result[key] = deepMerge(base[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

translations.de = deepMerge(translations.en, {
  header: {
    allCategory: "ALLE KATEGORIEN",
    pages: "SEITEN",
    blogs: "BLOGS",
    collections: "KOLLEKTIONEN",
    logIn: "Anmelden",
    myWishList: "Meine Wunschliste",
    myOrders: "Meine Bestellungen",
    myAddress: "Meine Adresse",
    logOut: "Abmelden",
    cart: "WARENKORB",
    english: "Englisch",
    german: "Deutsch",
    french: "Französisch"
  },
  common: {
    loading: "Wird geladen...",
    item: "Artikel",
    items: "Artikel",
    remove: "Entfernen",
    edit: "Bearbeiten",
    delete: "Löschen",
    cancel: "Abbrechen",
    reset: "Zurücksetzen",
    apply: "Anwenden",
    save: "Speichern",
    update: "Aktualisieren",
    viewItem: "Artikel ansehen",
    continueShopping: "Weiter einkaufen",
    backToHome: "Zur Startseite",
    addToCart: "In den Warenkorb",
    proceedToCheckout: "Zur Kasse",
    shopNow: "Jetzt kaufen",
    defaultLabel: "Standard",
    coupon: "Gutschein",
    freeShipping: "Kostenloser Versand",
    totalItems: "Gesamtanzahl",
    subtotal: "Zwischensumme",
    discount: "Rabatt",
    total: "Gesamt",
    shipping: "Versand",
    color: "Farbe",
    quantity: "Menge",
    trackOrder: "Bestellung verfolgen",
    selectState: "Bundesland wählen"
  },
  newsletter: {
    eyebrow: "Newsletter",
    title: "Erhalte Launch-Edits, Angebote und Trend-Updates.",
    placeholder: "E-Mail eingeben",
    subscribe: "Abonnieren",
    emailAddress: "E-Mail-Adresse"
  },
  featured: {
    eyebrow: "Ausgewählte Produkte",
    title: "Hervorgehobene Styles aus der neuesten Auswahl.",
    viewAll: "Alle Produkte ansehen"
  },
  wishlist: {
    eyebrow: "Für später gespeichert",
    title: "Meine Wunschliste",
    description: "Behalte deine Lieblingsstücke im Blick und lege sie jederzeit in den Warenkorb.",
    clearAll: "Alles löschen",
    emptyTitle: "Deine Wunschliste ist leer.",
    emptyDescription: "Durchsuche Kollektionen und tippe auf das Herz, um Produkte hier zu speichern.",
    exploreCollections: "Kollektionen entdecken"
  },
  orders: {
    eyebrow: "Kontobestellungen",
    title: "Meine Bestellungen",
    description: "Sieh dir deine letzten Einkäufe und Liefertermine an und springe direkt zur Sendungsverfolgung.",
    totalOrders: "Bestellungen gesamt",
    itemsOrdered: "Bestellte Artikel",
    noOrdersTitle: "Noch keine Bestellungen.",
    noOrdersDescription: "Aufgegebene Bestellungen erscheinen hier automatisch nach dem Checkout.",
    startShopping: "Jetzt einkaufen",
    tracking: "Sendung",
    delivery: "Lieferung",
    status: "Status"
  },
  address: {
    eyebrow: "Checkout-Daten",
    title: "Meine Adresse",
    description: "Speichere Lieferdaten einmal und nutze sie beim Checkout ohne erneute Eingabe.",
    editAddress: "Adresse bearbeiten",
    addNewAddress: "Neue Adresse hinzufügen",
    savedAddresses: "Gespeicherte Adressen",
    noSavedAddresses: "Noch keine Adressen gespeichert.",
    noSavedAddressesDescription: "Füge hier eine Lieferadresse hinzu, und der Checkout nutzt sie automatisch.",
    saveAddress: "Adresse speichern",
    updateAddress: "Adresse aktualisieren",
    addressUpdated: "Adresse aktualisiert.",
    addressSaved: "Adresse gespeichert.",
    requiredFields: "Bitte fülle alle Pflichtfelder der Adresse aus.",
    emailOrMobile: "E-Mail oder Mobilnummer",
    apartment: "Wohnung, Suite usw.",
    city: "Stadt",
    state: "Bundesland",
    zipCode: "PLZ",
    country: "Land",
    address: "Adresse",
    label: "Bezeichnung",
    makeDefault: "Als Standard festlegen",
    setDefault: "Als Standardadresse festlegen"
  },
  checkout: {
    contact: "Kontakt",
    signIn: "Anmelden",
    emailNews: "Neuigkeiten und Angebote per E-Mail senden",
    delivery: "Lieferung",
    manageAddresses: "Adressen verwalten",
    useSavedAddress: "Gespeicherte Adresse verwenden",
    shippingMethod: "Versandart",
    freeShipping: "Kostenloser Versand",
    standardShipping: "Standardversand",
    enterAddressToView: "Gib deine Lieferadresse ein, um verfügbare Versandarten zu sehen.",
    payment: "Zahlung",
    paymentSecure: "Alle Transaktionen sind sicher und verschlüsselt.",
    creditCard: "Kreditkarte",
    cashOnDelivery: "Nachnahme",
    useShippingAsBilling: "Lieferadresse als Rechnungsadresse verwenden",
    cashOnDeliveryDescription: "Bezahle bar bei Lieferung an deine Adresse.",
    processing: "Wird verarbeitet...",
    payNow: "Jetzt bezahlen",
    placeOrder: "Bestellung aufgeben",
    cartEmpty: "Dein Warenkorb ist leer.",
    completeFields: "Bitte fülle die erforderlichen Kontakt- und Lieferfelder aus.",
    completePayment: "Bitte vervollständige deine Kartenzahlungsdaten.",
    failedCreateOrder: "Bestellung konnte nicht erstellt werden.",
    note: "Hinweis",
    addOrderNote: "Füge einen Hinweis zu deiner Bestellung hinzu",
    enterCoupon: "Gutscheincode eingeben",
    backToCart: "Zurück zum Warenkorb",
    saveForNextTime: "Diese Informationen für das nächste Mal speichern",
    cardNumber: "Kartennummer",
    expiryDate: "Ablaufdatum (MM / JJ)",
    securityCode: "Sicherheitscode",
    nameOnCard: "Name auf der Karte"
  },
  tracking: {
    title: "Bestellung verfolgen",
    description: "Gib deine Bestellnummer ein, um Status, Artikel und Lieferdatum zu sehen.",
    orderNumber: "Bestellnummer",
    recentOrders: "Letzte Bestellungen",
    loadingOrder: "Bestellung wird geladen...",
    orderNotFound: "Bestellung nicht gefunden.",
    estimatedDelivery: "Voraussichtliche Lieferung"
  },
  orderSuccess: {
    loading: "Bestellbestätigung wird geladen",
    notFoundTitle: "Bestellung nicht gefunden",
    placed: "Bestellung aufgegeben",
    confirmed: "Deine Bestellung ist bestätigt.",
    orderSummary: "Bestellübersicht"
  }
});

translations.fr = deepMerge(translations.en, {
  header: {
    allCategory: "TOUTES CATÉGORIES",
    pages: "PAGES",
    blogs: "BLOGS",
    collections: "COLLECTIONS",
    logIn: "Connexion",
    myWishList: "Ma liste d'envies",
    myOrders: "Mes commandes",
    myAddress: "Mon adresse",
    logOut: "Déconnexion",
    cart: "PANIER",
    english: "Anglais",
    german: "Allemand",
    french: "Français"
  },
  common: {
    loading: "Chargement...",
    item: "article",
    items: "articles",
    remove: "Supprimer",
    edit: "Modifier",
    delete: "Supprimer",
    cancel: "Annuler",
    reset: "Réinitialiser",
    apply: "Appliquer",
    save: "Enregistrer",
    update: "Mettre à jour",
    viewItem: "Voir l'article",
    continueShopping: "Continuer vos achats",
    backToHome: "Retour à l'accueil",
    addToCart: "Ajouter au panier",
    proceedToCheckout: "Passer à la caisse",
    shopNow: "Acheter",
    defaultLabel: "Par défaut",
    coupon: "Coupon",
    freeShipping: "Livraison gratuite",
    totalItems: "Articles totaux",
    subtotal: "Sous-total",
    discount: "Réduction",
    total: "Total",
    shipping: "Livraison",
    color: "Couleur",
    quantity: "Quantité",
    trackOrder: "Suivre la commande",
    selectState: "Sélectionner la région"
  },
  newsletter: {
    eyebrow: "Newsletter",
    title: "Recevez les nouveautés, offres et notes de tendance.",
    placeholder: "Entrez votre e-mail",
    subscribe: "S'abonner",
    emailAddress: "Adresse e-mail"
  },
  featured: {
    eyebrow: "Produits vedettes",
    title: "Styles mis en avant de la dernière sélection.",
    viewAll: "Voir tous les produits"
  },
  wishlist: {
    eyebrow: "Sauvegardé pour plus tard",
    title: "Ma liste d'envies",
    description: "Gardez vos pièces préférées à portée de main et ajoutez-les au panier quand vous voulez.",
    clearAll: "Tout effacer",
    emptyTitle: "Votre liste d'envies est vide.",
    emptyDescription: "Parcourez les collections et touchez le cœur pour enregistrer des produits ici.",
    exploreCollections: "Explorer les collections"
  },
  orders: {
    eyebrow: "Commandes du compte",
    title: "Mes commandes",
    description: "Consultez vos achats récents, les dates de livraison et accédez directement au suivi.",
    totalOrders: "Commandes totales",
    itemsOrdered: "Articles commandés",
    noOrdersTitle: "Aucune commande pour le moment.",
    noOrdersDescription: "Les commandes passées apparaîtront ici automatiquement après le paiement.",
    startShopping: "Commencer vos achats",
    tracking: "Suivi",
    delivery: "Livraison",
    status: "Statut"
  },
  address: {
    eyebrow: "Détails du paiement",
    title: "Mon adresse",
    description: "Enregistrez vos informations de livraison une fois et réutilisez-les au paiement.",
    editAddress: "Modifier l'adresse",
    addNewAddress: "Ajouter une adresse",
    savedAddresses: "Adresses enregistrées",
    noSavedAddresses: "Aucune adresse enregistrée.",
    noSavedAddressesDescription: "Ajoutez une adresse de livraison ici et le paiement l'utilisera automatiquement.",
    saveAddress: "Enregistrer l'adresse",
    updateAddress: "Mettre à jour l'adresse",
    addressUpdated: "Adresse mise à jour.",
    addressSaved: "Adresse enregistrée.",
    requiredFields: "Veuillez remplir tous les champs obligatoires de l'adresse.",
    emailOrMobile: "E-mail ou mobile",
    apartment: "Appartement, suite, etc.",
    city: "Ville",
    state: "Région",
    zipCode: "Code postal",
    country: "Pays",
    address: "Adresse",
    label: "Libellé",
    makeDefault: "Définir par défaut",
    setDefault: "Définir comme adresse par défaut"
  },
  checkout: {
    contact: "Contact",
    signIn: "Connexion",
    emailNews: "Recevoir des actualités et offres par e-mail",
    delivery: "Livraison",
    manageAddresses: "Gérer les adresses",
    useSavedAddress: "Utiliser une adresse enregistrée",
    shippingMethod: "Mode de livraison",
    freeShipping: "Livraison gratuite",
    standardShipping: "Livraison standard",
    enterAddressToView: "Entrez votre adresse de livraison pour voir les modes disponibles.",
    payment: "Paiement",
    paymentSecure: "Toutes les transactions sont sécurisées et chiffrées.",
    creditCard: "Carte bancaire",
    cashOnDelivery: "Paiement à la livraison",
    useShippingAsBilling: "Utiliser l'adresse de livraison comme adresse de facturation",
    cashOnDeliveryDescription: "Payez en espèces lorsque la commande est livrée à votre adresse.",
    processing: "Traitement...",
    payNow: "Payer maintenant",
    placeOrder: "Passer la commande",
    cartEmpty: "Votre panier est vide.",
    completeFields: "Veuillez remplir les champs de contact et de livraison requis.",
    completePayment: "Veuillez compléter les détails de votre carte.",
    failedCreateOrder: "Échec de la création de la commande.",
    note: "Note",
    addOrderNote: "Ajoutez une note à votre commande",
    enterCoupon: "Entrez le code promo",
    backToCart: "Retour au panier",
    saveForNextTime: "Enregistrer ces informations pour la prochaine fois",
    cardNumber: "Numéro de carte",
    expiryDate: "Date d'expiration (MM / AA)",
    securityCode: "Code de sécurité",
    nameOnCard: "Nom sur la carte"
  },
  tracking: {
    title: "Suivre votre commande",
    description: "Entrez votre numéro de commande pour voir le statut, les articles et la date de livraison.",
    orderNumber: "Numéro de commande",
    recentOrders: "Commandes récentes",
    loadingOrder: "Chargement de la commande...",
    orderNotFound: "Commande introuvable.",
    estimatedDelivery: "Livraison estimée"
  },
  orderSuccess: {
    loading: "Chargement de la confirmation",
    notFoundTitle: "Commande introuvable",
    placed: "Commande passée",
    confirmed: "Votre commande est confirmée.",
    orderSummary: "Récapitulatif de la commande"
  }
});

function readStoredLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return value && translations[value] ? value : "en";
}

function getByPath(object, path) {
  return path.split(".").reduce((current, key) => current?.[key], object);
}

function interpolate(template, values) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) => String(values?.[key] ?? ""));
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  function setLanguage(nextLanguage) {
    if (translations[nextLanguage]) {
      setLanguageState(nextLanguage);
    }
  }

  function t(path, values) {
    const languageValue = getByPath(translations[language], path);
    if (typeof languageValue === "string") {
      return interpolate(languageValue, values);
    }

    const fallbackValue = getByPath(translations.en, path);
    if (typeof fallbackValue === "string") {
      return interpolate(fallbackValue, values);
    }

    return path;
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: [
        { code: "en", label: "English" },
        { code: "de", label: "Deutsch" },
        { code: "fr", label: "Francais" }
      ]
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}

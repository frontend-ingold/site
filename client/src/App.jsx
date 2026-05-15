import { useEffect, useMemo, useState } from 'react';

const menuCatalog = [
  {
    category: 'Starters',
    description: 'Fast opening bites for dine-in tables and delivery add-ons.',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Paneer Tikka', price: 320, description: 'Charred cottage cheese, peppers, mint chutney.' },
      { name: 'Chicken Reshmi Kebab', price: 360, description: 'Creamy skewers finished in the tandoor.' },
      { name: 'Crispy Lotus Stem', price: 290, description: 'Honey chilli glaze with toasted sesame.' },
      { name: 'Prawn Tempura', price: 430, description: 'Light batter, spiced aioli, lemon wedge.' },
      { name: 'Loaded Nachos', price: 310, description: 'Cheese, jalapeno, salsa, beans, sour cream.' },
    ],
  },
  {
    category: 'Soups & Salads',
    description: 'Comforting bowls and fresh greens for lighter meals.',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Tom Yum Veg Soup', price: 210, description: 'Lemongrass broth with mushrooms and greens.' },
      { name: 'Roast Tomato Basil Soup', price: 220, description: 'Slow-roasted tomatoes with garlic croutons.' },
      { name: 'Caesar Salad', price: 280, description: 'Romaine, parmesan, croutons, classic dressing.' },
      { name: 'Grilled Chicken Salad', price: 340, description: 'Herb chicken, lettuce, cucumber, citrus vinaigrette.' },
      { name: 'Burrata Beet Salad', price: 390, description: 'Roasted beetroot, burrata, walnuts, balsamic.' },
    ],
  },
  {
    category: 'Indian Mains',
    description: 'House signatures built for premium dine-in service.',
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Butter Chicken', price: 520, description: 'Creamy tomato gravy, fenugreek, tandoor finish.' },
      { name: 'Kolkata Mutton Kosha', price: 610, description: 'Slow-cooked mutton in rich Bengali spices.' },
      { name: 'Paneer Lababdar', price: 430, description: 'Silky tomato cashew masala with cottage cheese.' },
      { name: 'Dal Saffron Table', price: 340, description: 'Black lentils simmered overnight with butter.' },
      { name: 'Malai Kofta', price: 410, description: 'Soft kofta dumplings in mild creamy curry.' },
    ],
  },
  {
    category: 'Tandoor & Grills',
    description: 'Smoky meats and seafood prepared for table sharing.',
    image:
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Tandoori Pomfret', price: 690, description: 'Whole fish marinated with mustard and herbs.' },
      { name: 'Murgh Malai Tikka', price: 390, description: 'Tender chicken, cream, green cardamom.' },
      { name: 'Lamb Seekh Kebab', price: 420, description: 'Spiced minced lamb skewers with onion salad.' },
      { name: 'Grilled Bhetki', price: 690, description: 'Lemon butter glaze with charred vegetables.' },
      { name: 'Peri Peri Cottage Cheese Steak', price: 440, description: 'Pan-seared paneer with pepper jus.' },
    ],
  },
  {
    category: 'Pasta & Continental',
    description: 'Comfort plates that travel well for delivery orders too.',
    image:
      'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Pasta Alfredo', price: 460, description: 'Parmesan cream, garlic, herbs, mushrooms.' },
      { name: 'Spaghetti Arrabbiata', price: 410, description: 'Tomato chilli sauce, olives, basil.' },
      { name: 'Grilled Chicken Steak', price: 590, description: 'Pepper sauce, mashed potato, greens.' },
      { name: 'Herb Crusted Fish', price: 620, description: 'Pan-seared fillet with lemon beurre blanc.' },
      { name: 'Wild Mushroom Risotto', price: 480, description: 'Creamy arborio rice, parmesan, truffle oil.' },
    ],
  },
  {
    category: 'Biryani & Rice',
    description: 'Fragrant rice selections for individual and family orders.',
    image:
      'https://images.unsplash.com/photo-1701579231347-6d98d48c5f2c?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Kolkata Chicken Biryani', price: 420, description: 'Aromatic rice, potato, egg, tender chicken.' },
      { name: 'Mutton Dum Biryani', price: 540, description: 'Saffron rice sealed with slow-cooked mutton.' },
      { name: 'Veg Subz Biryani', price: 360, description: 'Seasonal vegetables, fried onion, mint.' },
      { name: 'Prawn Pulao', price: 510, description: 'Lightly spiced rice with butter-tossed prawns.' },
      { name: 'Jeera Rice', price: 190, description: 'Steamed basmati finished with cumin and ghee.' },
    ],
  },
  {
    category: 'Breads & Sides',
    description: 'Essential pairings for curries, grills, and sharing platters.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Butter Naan', price: 70, description: 'Soft tandoor bread brushed with butter.' },
      { name: 'Garlic Naan', price: 90, description: 'Topped with fresh garlic and coriander.' },
      { name: 'Laccha Paratha', price: 85, description: 'Layered whole wheat bread, crisp edges.' },
      { name: 'Mashed Potatoes', price: 150, description: 'Creamy potato side with cracked pepper.' },
      { name: 'Sauteed Vegetables', price: 170, description: 'Seasonal vegetables in herb butter.' },
    ],
  },
  {
    category: 'Desserts & Beverages',
    description: 'Sweet finishes and drinks for dine-in or doorstep service.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Baked Rosogolla', price: 220, description: 'Classic Bengali dessert with caramel top.' },
      { name: 'Molten Chocolate Cake', price: 260, description: 'Warm chocolate center with vanilla scoop.' },
      { name: 'Classic Tiramisu', price: 280, description: 'Mascarpone layers, coffee, cocoa dust.' },
      { name: 'Signature Mocktail Pitcher', price: 520, description: 'Citrus basil cooler for sharing tables.' },
      { name: 'Cold Coffee Frappe', price: 190, description: 'Chilled coffee, cream, cocoa finish.' },
    ],
  },
];

const serviceOptions = [
  {
    title: 'Dine In',
    detail: 'Reserve indoor tables, celebration seating, and chef-led premium service every day from 10 AM to 11 PM.',
  },
  {
    title: 'Delivery',
    detail: 'Order signature curries, biryani, grills, desserts, and beverages packed for fresh home delivery in Kolkata.',
  },
];

const galleryImages = [
  {
    title: 'Ambient Interior',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Private Dining',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Signature Plating',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Celebration Nights',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
  },
];

const offers = [
  { title: 'Weekend Grand Buffet', detail: 'Saturday and Sunday lunch buffet with 30+ Indian and Continental dishes.' },
  { title: 'Live Music Friday', detail: 'Acoustic sets every Friday from 8 PM with chef-curated sharing platters.' },
  { title: 'Family Dinner Offer', detail: 'Complimentary dessert platter on dine-in bookings for four or more guests.' },
  { title: 'Candle Light Dinner', detail: 'Reserved corner seating, curated menu, and floral table styling for couples.' },
];

const reviews = [
  {
    name: 'Ananya S.',
    quote: 'Best restaurant experience in Kolkata. The service was precise, warm, and the food arrived beautifully plated.',
  },
  {
    name: 'Rohit D.',
    quote: 'Booked online for a birthday dinner and everything was ready on time. The grilled fish and mocktails stood out.',
  },
  {
    name: 'Megha P.',
    quote: 'A polished fine dining place for family dinners. Clean ambience, easy parking, and delivery packaging was solid too.',
  },
];

const features = [
  { title: 'Fresh Ingredients', detail: 'Daily produce, quality meats, and seasonal sourcing across every menu.' },
  { title: 'Premium Service', detail: 'Attentive staff, polished table setup, and thoughtful guest handling.' },
  { title: 'Online Reservation', detail: 'Quick table requests for dinners, date nights, and special celebrations.' },
  { title: 'Parking Available', detail: 'Convenient parking support for families and larger dinner groups.' },
  { title: 'Family Friendly', detail: 'Comfortable seating, flexible menu choices, and warm service for all ages.' },
  { title: 'Fast Delivery', detail: 'Popular dishes packed carefully for home and office delivery orders.' },
];

const stats = [
  { value: '40+', label: 'Curated menu items' },
  { value: '4.8/5', label: 'Guest rating' },
  { value: '120+', label: 'Seats available' },
  { value: '2 Modes', label: 'Dine in + delivery' },
];

const heroSlides = [
  {
    eyebrow: 'Fine Dining Experience In Kolkata',
    title: 'Book elegant tables for special dinners.',
    description: 'Warm interiors, polished service, and chef-led dining near Park Street.',
    image:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=80',
  },
  {
    eyebrow: 'Chef Crafted Signature Menu',
    title: 'Smoky grills. Rich biryanis.',
    description: 'Explore 40+ dine-in and delivery favorites.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80',
  },
  {
    eyebrow: 'Dine In And Delivery',
    title: 'Reserve tables or order home delivery.',
    description: 'One premium restaurant experience across central Kolkata.',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1800&q=80',
  },
];

const initialBooking = { date: '', time: '', guests: '2', request: '' };
const initialDelivery = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  area: '',
  city: 'Kolkata',
  postalCode: '',
  paymentMethod: 'cod',
  deliveryNotes: '',
};
const initialAuth = { name: '', email: '', password: '', confirmPassword: '', resetToken: '' };
const initialProfile = { name: '', email: '' };
const API_BASE_URL = 'https://restu-api.vercel.app';
const paymentOptions = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    detail: 'Pay when your order arrives at your door.',
  },
  {
    value: 'upi',
    label: 'UPI',
    detail: 'Google Pay, PhonePe, Paytm, BHIM and more.',
  },
  {
    value: 'card',
    label: 'Credit / Debit Card',
    detail: 'Secure checkout powered by Razorpay.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function parsePrice(priceLabel) {
  if (typeof priceLabel === 'number') {
    return priceLabel;
  }

  return Number(priceLabel.replace(/[^0-9.]/g, '')) || 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function getMenuItemAttributes(category, itemName) {
  const tags = ['Chef special'];

  if (category === 'Starters' || category === 'Soups & Salads') {
    tags.push('Quick bite');
  }

  if (category === 'Indian Mains' || category === 'Biryani & Rice') {
    tags.push('Best seller');
  }

  if (category === 'Tandoor & Grills') {
    tags.push('Smoky grill');
  }

  if (category === 'Pasta & Continental') {
    tags.push('Delivery ready');
  }

  if (category === 'Desserts & Beverages') {
    tags.push('Freshly prepared');
  }

  if (/Prawn|Fish|Pomfret|Chicken|Lamb|Mutton/i.test(itemName)) {
    tags.push('High protein');
  } else {
    tags.push('Vegetarian option');
  }

  return tags;
}

function buildCartItem(section, item) {
  const price = parsePrice(item.price);

  /*sss*/

  return {
    name: item.name,
    category: section.category,
    description: item.description,
    image: getImageForItem(item.name),
    attributes: getMenuItemAttributes(section.category, item.name),
    price,
    priceLabel: formatCurrency(price),
  };
}

function normalizeCartEntry(item) {
  const price = parsePrice(item.price ?? item.priceLabel ?? 0);
  const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

  return {
    ...item,
    price,
    priceLabel: formatCurrency(price),
    cartId: item.cartId || createCartId(),
    quantity,
    notes: item.notes || '',
    image: item.image || getImageForItem(item.name),
    attributes: Array.isArray(item.attributes) ? item.attributes : [],
  };
}

function createCartId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeStoredCart(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map(normalizeCartEntry);
}

function buildDeliveryAddress(deliveryForm) {
  return [
    deliveryForm.addressLine1,
    deliveryForm.addressLine2,
    deliveryForm.area,
    deliveryForm.city,
    deliveryForm.postalCode,
  ]
    .filter(Boolean)
    .join(', ');
}

function getPageFromHash() {
  const hash = window.location.hash;
  if (hash === '#/menu') {
    return 'menu';
  }
  if (hash === '#/auth') {
    return 'auth';
  }
  if (hash === '#/checkout') {
    return 'checkout';
  }
  if (hash === '#/order-success') {
    return 'order-success';
  }
  return 'home';
}

async function apiRequest(path, options = {}) {
  const normalizedPath = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(normalizedPath, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }
  return data;
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Razorpay), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load payment gateway.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load payment gateway.'));
    document.body.appendChild(script);
  });
}

function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [heroBooking, setHeroBooking] = useState(initialBooking);
  const [reservationBooking, setReservationBooking] = useState(initialBooking);
  const [deliveryForm, setDeliveryForm] = useState(initialDelivery);
  const [authForm, setAuthForm] = useState(initialAuth);
  const [profileForm, setProfileForm] = useState(initialProfile);
  const [cart, setCart] = useState(() => {
    try {
      return normalizeStoredCart(JSON.parse(localStorage.getItem('restu_cart') || '[]'));
    } catch {
      return [];
    }
  });
  const [authMode, setAuthMode] = useState('login');
  const [bookingMessage, setBookingMessage] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [forgotResetToken, setForgotResetToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [authToken, setAuthToken] = useState(localStorage.getItem('restu_auth_token') || '');
  const [authUser, setAuthUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [menuModalItem, setMenuModalItem] = useState(null);
  const [menuModalQuantity, setMenuModalQuantity] = useState(1);
  const [menuModalNotes, setMenuModalNotes] = useState('');
  const [cartPanelAnimated, setCartPanelAnimated] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState({ enabled: false, keyId: '' });

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    apiRequest('/api/payments/config')
      .then((config) => {
        if (isMounted) {
          setPaymentConfig({
            enabled: Boolean(config.enabled && config.keyId),
            keyId: config.keyId || '',
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setPaymentConfig({ enabled: false, keyId: '' });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (page !== 'home') {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [page]);

  useEffect(() => {
    if (!authToken) {
      setAuthUser(null);
      setProfileForm(initialProfile);
      setMyBookings([]);
      setMyDeliveries([]);
      return;
    }

    hydrateSession(authToken);
  }, [authToken]);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    setProfileForm({
      name: authUser.name || '',
      email: authUser.email || '',
    });
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('restu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!cartPanelAnimated) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCartPanelAnimated(false);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [cartPanelAnimated]);

  const featuredMenuItems = useMemo(() => menuCatalog.flatMap((section) => section.items.slice(0, 1)), []);

  const handleChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
  };

  async function hydrateSession(token) {
    try {
      const [meData, bookingsData, deliveriesData] = await Promise.all([
        apiRequest('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiRequest('/api/my/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiRequest('/api/my/deliveries', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAuthUser(meData.user);
      setMyBookings(bookingsData.bookings);
      setMyDeliveries(deliveriesData.deliveries);
    } catch (error) {
      localStorage.removeItem('restu_auth_token');
      setAuthToken('');
      setAuthUser(null);
      setAuthMessage('Your session expired. Please log in again.');
    }
  }

  async function refreshAccountData(token = authToken) {
    if (!token) {
      return;
    }

    const [bookingsData, deliveriesData] = await Promise.all([
      apiRequest('/api/my/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      apiRequest('/api/my/deliveries', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    setMyBookings(bookingsData.bookings);
    setMyDeliveries(deliveriesData.deliveries);
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    if (!authToken) {
      setProfileMessage('Please log in again to update your profile.');
      return;
    }

    try {
      setIsProfileSubmitting(true);
      setProfileMessage('');

      const data = await apiRequest('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
        }),
      });

      setAuthUser(data.user);
      setProfileMessage('Profile updated successfully.');
    } catch (error) {
      setProfileMessage(error.message);
    } finally {
      setIsProfileSubmitting(false);
    }
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthMessage('');

    try {
      setIsAuthSubmitting(true);

      if (authMode === 'register') {
        if (authForm.password !== authForm.confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        const data = await apiRequest('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: authForm.name,
            email: authForm.email,
            password: authForm.password,
          }),
        });

        localStorage.setItem('restu_auth_token', data.token);
        setAuthToken(data.token);
        setAuthUser(data.user);
        setAuthForm(initialAuth);
        setAuthMessage('Registration successful. You are now logged in.');
        window.location.hash = '#/';
        return;
      }

      if (authMode === 'login') {
        const data = await apiRequest('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password,
          }),
        });

        localStorage.setItem('restu_auth_token', data.token);
        setAuthToken(data.token);
        setAuthUser(data.user);
        setAuthForm(initialAuth);
        setAuthMessage('Login successful.');
        window.location.hash = '#/';
        return;
      }

      if (authMode === 'forgot') {
        const data = await apiRequest('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email }),
        });

        setForgotResetToken(data.resetToken || '');
        setAuthMessage(
          data.resetToken
            ? `Reset code generated: ${data.resetToken}`
            : 'If the account exists, a reset code has been generated.',
        );
        setAuthMode('reset');
        setAuthForm((current) => ({
          ...current,
          resetToken: data.resetToken || current.resetToken,
          password: '',
          confirmPassword: '',
        }));
        return;
      }

      if (authMode === 'reset') {
        if (authForm.password !== authForm.confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        await apiRequest('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: authForm.resetToken,
            password: authForm.password,
          }),
        });

        setAuthMessage('Password reset successful. Please log in.');
        setAuthMode('login');
        setAuthForm(initialAuth);
        setForgotResetToken('');
      }
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  function logout() {
    localStorage.removeItem('restu_auth_token');
    setAuthToken('');
    setAuthUser(null);
    setMyBookings([]);
    setMyDeliveries([]);
    setBookingMessage('');
    setDeliveryMessage('');
    setAuthMessage('You have been logged out.');
    window.location.hash = '#/auth';
  }

  function openMenuItemModal(item) {
    setMenuModalItem(item);
    setMenuModalQuantity(1);
    setMenuModalNotes('');
  }

  function closeMenuItemModal() {
    setMenuModalItem(null);
    setMenuModalQuantity(1);
    setMenuModalNotes('');
  }

  function confirmAddToCart() {
    if (!menuModalItem) {
      return;
    }

    const normalizedNotes = menuModalNotes.trim();
    const newEntry = normalizeCartEntry({
      ...menuModalItem,
      cartId: createCartId(),
      quantity: menuModalQuantity,
      notes: normalizedNotes,
    });

    setCart((current) => {
      const existing = current.find(
        (entry) => entry.name === newEntry.name && (entry.notes || '') === normalizedNotes,
      );

      if (existing) {
        return current.map((entry) =>
          entry.cartId === existing.cartId
            ? normalizeCartEntry({ ...entry, quantity: Number(entry.quantity) + menuModalQuantity })
            : entry,
        );
      }

      return [...current, newEntry];
    });

    setDeliveryMessage(`${menuModalItem.name} added to cart.`);
    setCartPanelAnimated(true);
    closeMenuItemModal();
  }

  function updateCartQuantity(cartId, delta) {
    setCart((current) =>
      current
        .map((entry) =>
          entry.cartId === cartId
            ? normalizeCartEntry({ ...entry, quantity: Math.max(0, Number(entry.quantity) + delta) })
            : normalizeCartEntry(entry),
        )
        .filter((entry) => entry.quantity > 0),
    );
  }

  function removeCartItem(cartId) {
    setCart((current) => current.filter((entry) => entry.cartId !== cartId));
  }

  const cartTotal = useMemo(
    () => cart.reduce((sum, entry) => sum + parsePrice(entry.price ?? entry.priceLabel) * (Number(entry.quantity) || 0), 0),
    [cart],
  );

  function getDeliveryPayload() {
    return {
      ...deliveryForm,
      address: buildDeliveryAddress(deliveryForm),
      items: cart,
      orderTotal: cartTotal,
      paymentMethod: deliveryForm.paymentMethod,
    };
  }

  async function finalizeSuccessfulOrder(paymentReference = '') {
    setDeliveryMessage(
      deliveryForm.paymentMethod === 'cod'
        ? `Order placed successfully for ${deliveryForm.name}.`
        : `Payment successful and order placed for ${deliveryForm.name}.`,
    );
    setLastOrder({
      customerName: deliveryForm.name,
      phone: deliveryForm.phone,
      address: buildDeliveryAddress(deliveryForm),
      paymentMethod: deliveryForm.paymentMethod,
      paymentReference,
      deliveryNotes: deliveryForm.deliveryNotes,
      items: cart,
      total: cartTotal,
    });
    setDeliveryForm(initialDelivery);
    setCart([]);
    await refreshAccountData();
    window.location.hash = '#/order-success';
  }

  async function startGatewayPayment() {
    if (!paymentConfig.enabled) {
      throw new Error('Online payments are not configured yet. Please use Cash on Delivery.');
    }

    if (!deliveryForm.name || !deliveryForm.phone || !buildDeliveryAddress(deliveryForm)) {
      throw new Error('Please complete your delivery details before paying online.');
    }

    const Razorpay = await loadRazorpayScript();
    const paymentOrder = await apiRequest('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        amount: cartTotal,
        receipt: `restu_${Date.now()}`,
      }),
    });

    await new Promise((resolve, reject) => {
      const razorpay = new Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.order.amount,
        currency: paymentOrder.order.currency,
        name: 'Saffron Table',
        description: 'Food delivery order',
        order_id: paymentOrder.order.id,
        prefill: {
          name: deliveryForm.name,
          email: authUser?.email || '',
          contact: deliveryForm.phone,
        },
        notes: {
          address: buildDeliveryAddress(deliveryForm),
          paymentMethod: deliveryForm.paymentMethod,
        },
        theme: {
          color: '#ab3f2d',
        },
        handler: async (response) => {
          try {
            await apiRequest('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                ...getDeliveryPayload(),
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            await finalizeSuccessfulOrder(response.razorpay_payment_id);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment window was closed before completion.')),
        },
      });

      razorpay.on('payment.failed', (event) => {
        reject(new Error(event.error?.description || 'Online payment failed.'));
      });

      razorpay.open();
    });
  }

  async function handleBookingSubmit(event, booking, source) {
    event.preventDefault();

    if (!authToken) {
      setBookingMessage('Please log in to create a booking.');
      window.location.hash = '#/auth';
      return;
    }

    try {
      setIsSubmitting(true);
      setBookingMessage('');

      await apiRequest('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          request: booking.request,
          source,
        }),
      });

      setBookingMessage(
        `Booking request created for ${booking.guests} guest${booking.guests === '1' ? '' : 's'} on ${booking.date} at ${booking.time}.`,
      );

      if (source === 'Hero') {
        setHeroBooking(initialBooking);
      } else {
        setReservationBooking(initialBooking);
      }

      await refreshAccountData();
    } catch (error) {
      setBookingMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeliverySubmit(event) {
    event.preventDefault();

    if (!authToken) {
      setDeliveryMessage('Please log in to place a delivery request.');
      window.location.hash = '#/auth';
      return;
    }

    try {
      setIsSubmitting(true);
      setDeliveryMessage('');

      if (cart.length === 0) {
        throw new Error('Your cart is empty.');
      }

      if (deliveryForm.paymentMethod === 'cod') {
        await apiRequest('/api/deliveries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(getDeliveryPayload()),
        });

        await finalizeSuccessfulOrder();
        return;
      }

      await startGatewayPayment();
    } catch (error) {
      setDeliveryMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="site-shell">
      <SiteHeader authUser={authUser} logout={logout} />
      {page === 'menu' ? (
        <MenuPage
          cart={cart}
          cartPanelAnimated={cartPanelAnimated}
          closeMenuItemModal={closeMenuItemModal}
          confirmAddToCart={confirmAddToCart}
          authUser={authUser}
          cartTotal={cartTotal}
          deliveryForm={deliveryForm}
          deliveryMessage={deliveryMessage}
          handleChange={handleChange}
          menuModalItem={menuModalItem}
          menuModalNotes={menuModalNotes}
          menuModalQuantity={menuModalQuantity}
          openMenuItemModal={openMenuItemModal}
          setDeliveryForm={setDeliveryForm}
          setMenuModalNotes={setMenuModalNotes}
          setMenuModalQuantity={setMenuModalQuantity}
          updateCartQuantity={updateCartQuantity}
          removeCartItem={removeCartItem}
        />
      ) : page === 'checkout' ? (
        <CheckoutPage
          authUser={authUser}
          cart={cart}
          cartTotal={cartTotal}
          deliveryForm={deliveryForm}
          deliveryMessage={deliveryMessage}
          handleChange={handleChange}
          handleDeliverySubmit={handleDeliverySubmit}
          isSubmitting={isSubmitting}
          paymentConfig={paymentConfig}
          removeCartItem={removeCartItem}
          setDeliveryForm={setDeliveryForm}
          updateCartQuantity={updateCartQuantity}
        />
      ) : page === 'order-success' ? (
        <SuccessPage
          authUser={authUser}
          deliveryMessage={deliveryMessage}
          lastOrder={lastOrder}
        />
      ) : page === 'auth' ? (
        <AuthPage
          authForm={authForm}
          authMessage={authMessage}
          authMode={authMode}
          forgotResetToken={forgotResetToken}
          handleAuthSubmit={handleAuthSubmit}
          handleChange={handleChange}
          isAuthSubmitting={isAuthSubmitting}
          setAuthForm={setAuthForm}
          setAuthMode={setAuthMode}
        />
      ) : (
        <HomePage
          authUser={authUser}
          bookingMessage={bookingMessage}
          featuredMenuItems={featuredMenuItems}
          heroBooking={heroBooking}
          reservationBooking={reservationBooking}
          setHeroBooking={setHeroBooking}
          setReservationBooking={setReservationBooking}
          activeHeroSlide={activeHeroSlide}
          handleChange={handleChange}
          handleBookingSubmit={handleBookingSubmit}
          handleProfileSubmit={handleProfileSubmit}
          isSubmitting={isSubmitting}
          isProfileSubmitting={isProfileSubmitting}
          myBookings={myBookings}
          myDeliveries={myDeliveries}
          profileForm={profileForm}
          profileMessage={profileMessage}
          setProfileForm={setProfileForm}
        />
      )}
      <SiteFooter authUser={authUser} />
    </div>
  );
}

function SiteHeader({ authUser, logout }) {
  return (
    <header className="top-shell">
      <nav className="topbar">
        <a className="brand-block" href="#/">
          <span className="brand-mark">S</span>
          <div>
            <p className="brand-name">Saffron Table</p>
            <p className="brand-subtitle">Fine Dining, Delivery & Celebration House</p>
          </div>
        </a>
        <div className="nav-links">
          <a href="#/">Home</a>
          <a href="#/menu">Menu</a>
          <a href="#reservation">Book Table</a>
          {authUser ? (
            <>
              <a href="#my-activity">My Account</a>
              <button className="nav-button" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <a href="#/auth">Login / Register</a>
          )}
        </div>
      </nav>
    </header>
  );
}

function HomePage({
  authUser,
  bookingMessage,
  featuredMenuItems,
  heroBooking,
  reservationBooking,
  setHeroBooking,
  setReservationBooking,
  activeHeroSlide,
  handleChange,
  handleBookingSubmit,
  handleProfileSubmit,
  isSubmitting,
  isProfileSubmitting,
  myBookings,
  myDeliveries,
  profileForm,
  profileMessage,
  setProfileForm,
}) {
  return (
    <>
      <section className="hero-section" id="home">
        <div className="hero-slider">
          <div className="hero-slider-track">
            {heroSlides.map((heroSlide, index) => (
              <article
                className={`hero-slide ${index === activeHeroSlide ? 'is-active' : ''}`}
                key={heroSlide.title}
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(13, 10, 8, 0.82) 0%, rgba(13, 10, 8, 0.55) 60%, rgba(13, 10, 8, 0.3) 100%), url(${heroSlide.image})`,
                }}
              >
                <div className="hero-slide-grid">
                  <section className="hero-copy hero-copy-overlay">
                    <p className="eyebrow hero-eyebrow-light">{heroSlide.eyebrow}</p>
                    <h1>{heroSlide.title}</h1>
                    <p className="hero-text hero-text-light">{heroSlide.description}</p>
                    <div className="hero-actions">
                      <a className="button-primary" href={authUser ? '#reservation' : '#/auth'}>
                        {authUser ? 'Book Table' : 'Login To Book'}
                      </a>
                      <a className="button-secondary hero-button-light" href="#/menu">
                        Explore Full Menu
                      </a>
                    </div>
                  </section>

                  <form className="booking-card booking-card-floating" onSubmit={(event) => handleBookingSubmit(event, heroBooking, 'Hero')}>
                    <h2>Reserve in seconds</h2>
                    {!authUser && <p className="lock-note">Login required before table booking.</p>}
                    <fieldset className="form-lock" disabled={!authUser || isSubmitting}>
                      <div className="booking-grid">
                        <label>
                          Date
                          <input name="date" type="date" value={heroBooking.date} onChange={handleChange(setHeroBooking)} />
                        </label>
                        <label>
                          Time
                          <input name="time" type="time" value={heroBooking.time} onChange={handleChange(setHeroBooking)} />
                        </label>
                        <label className="full-width">
                          Number of guests
                          <select name="guests" value={heroBooking.guests} onChange={handleChange(setHeroBooking)}>
                            {['1', '2', '3', '4', '5', '6', '7', '8+'].map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <button className="button-primary wide-button" type="submit">
                        Check Availability
                      </button>
                    </fieldset>
                    {!authUser && (
                      <a className="inline-auth-link" href="#/auth">
                        Go to login or register
                      </a>
                    )}
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hero-stats-wrap">
          <div className="stat-row">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main>
        {authUser && (
          <AccountSection
            authUser={authUser}
            handleChange={handleChange}
            handleProfileSubmit={handleProfileSubmit}
            isProfileSubmitting={isProfileSubmitting}
            myBookings={myBookings}
            myDeliveries={myDeliveries}
            profileForm={profileForm}
            profileMessage={profileMessage}
            setProfileForm={setProfileForm}
          />
        )}

        <section className="content-section service-section">
          <div className="section-heading">
            <p className="eyebrow">Dining Options</p>
            <h2>Choose the experience that fits your day.</h2>
          </div>
          <div className="service-grid">
            {serviceOptions.map((service) => (
              <article className="service-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.detail}</p>
                <a className="text-link" href={service.title === 'Dine In' ? '#reservation' : '#/menu'}>
                  {service.title === 'Dine In' ? 'Reserve a table' : 'Browse delivery menu'}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section about-section" id="about">
          <div className="section-heading">
            <p className="eyebrow">About Restaurant</p>
            <h2>Serving authentic Indian and Continental cuisine with a premium dining experience since 2015.</h2>
          </div>
          <div className="about-layout">
            <article className="about-copy">
              <p>
                Born from a chef-led vision to create refined yet welcoming dining in central Kolkata, Saffron Table
                has become a trusted address for intimate dinners, business lunches, and weekend family gatherings.
              </p>
              <p>
                Our kitchen specialises in North Indian classics, grilled seafood, seasonal Continental plates, and
                handcrafted mocktails. Every menu is designed around fresh ingredients, careful plating, and balanced
                flavour.
              </p>
              <p>
                Executive Chef Arindam Sen brings 18 years of hospitality experience across luxury hotels and boutique
                kitchens, shaping a menu that feels familiar, polished, and distinctly local.
              </p>
            </article>
            <div className="about-highlight">
              <h3>What guests return for</h3>
              <ul>
                <li>Elegant dining room with warm, modern interiors</li>
                <li>Chef-curated Indian and Continental signature plates</li>
                <li>Dine-in celebrations plus carefully packed delivery service</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="content-section" id="menu">
          <div className="section-heading">
            <p className="eyebrow">Signature Dishes</p>
            <h2>Featured menu picks from our larger category-based menu.</h2>
          </div>
          <div className="menu-grid">
            {featuredMenuItems.map((item) => (
              <article className="menu-card" key={item.name}>
                <img src={getImageForItem(item.name)} alt={item.name} />
                <div className="menu-card-body">
                  <div className="menu-card-head">
                    <h3>{item.name}</h3>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="menu-cta-row">
            <a className="button-primary" href="#/menu">
              View All 40+ Menu Items
            </a>
            <p className="support-note">Available for both dine-in and selected delivery zones.</p>
          </div>
        </section>

        <section className="reservation-panel" id="reservation">
          <div className="reservation-copy">
            <p className="eyebrow">Table Reservation</p>
            <h2>Reserve your table now</h2>
            <p>
              Lock in the right time, tell us your guest count, and add any special requests for birthdays,
              anniversaries, or dietary preferences.
            </p>
            {!authUser && <p className="lock-note">Please log in to unlock reservations.</p>}
            {bookingMessage && <p className="confirmation-message">{bookingMessage}</p>}
          </div>
          <form className="reservation-form" onSubmit={(event) => handleBookingSubmit(event, reservationBooking, 'Main')}>
            <fieldset className="form-lock" disabled={!authUser || isSubmitting}>
              <label>
                Select Date
                <input name="date" type="date" value={reservationBooking.date} onChange={handleChange(setReservationBooking)} />
              </label>
              <label>
                Select Time
                <input name="time" type="time" value={reservationBooking.time} onChange={handleChange(setReservationBooking)} />
              </label>
              <label>
                Guest Count
                <select name="guests" value={reservationBooking.guests} onChange={handleChange(setReservationBooking)}>
                  {['1', '2', '3', '4', '5', '6', '7', '8+'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full-width">
                Special request
                <textarea
                  name="request"
                  rows="4"
                  placeholder="Window seat, birthday setup, allergen details, high chair..."
                  value={reservationBooking.request}
                  onChange={handleChange(setReservationBooking)}
                />
              </label>
              <button className="button-primary wide-button" type="submit">
                Reserve Table
              </button>
            </fieldset>
            {!authUser && (
              <a className="inline-auth-link" href="#/auth">
                Login or register to book
              </a>
            )}
          </form>
        </section>

        <section className="content-section" id="gallery">
          <div className="section-heading">
            <p className="eyebrow">Restaurant Gallery</p>
            <h2>Interior, dining tables, food, and event moments that build trust before booking.</h2>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((item) => (
              <figure className="gallery-card" key={item.title}>
                <img src={item.image} alt={item.title} />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="content-section offer-section">
          <div className="section-heading">
            <p className="eyebrow">Special Offers & Events</p>
            <h2>Weekly experiences that turn routine dinner plans into occasions.</h2>
          </div>
          <div className="offer-grid">
            {offers.map((offer) => (
              <article className="offer-card" key={offer.title}>
                <h3>{offer.title}</h3>
                <p>{offer.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section review-section">
          <div className="section-heading">
            <p className="eyebrow">Customer Reviews</p>
            <h2>What guests say after dining with us.</h2>
          </div>
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <p className="rating">★★★★★</p>
                <p>{review.quote}</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section choose-section">
          <div className="section-heading">
            <p className="eyebrow">Why Choose Us</p>
            <h2>Comfort, quality, and flexible food service in one place.</h2>
          </div>
          <div className="feature-grid feature-grid-wide">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section contact-section" id="contact">
          <div className="section-heading">
            <p className="eyebrow">Location & Contact</p>
            <h2>Easy to find, easy to book, and open every day.</h2>
          </div>
          <div className="contact-layout">
            <div className="contact-card">
              <p>Address: 18 Park Street, Kolkata, West Bengal 700016</p>
              <p>Phone: +91 98300 11223</p>
              <p>Hours: 10:00 AM - 11:00 PM</p>
              <p>Email: reservations@saffrontable.in</p>
              <p>Delivery Hours: 12:00 PM - 10:30 PM</p>
            </div>
            <div className="map-frame">
              <iframe
                title="Saffron Table location map"
                src="https://www.google.com/maps?q=Park%20Street%20Kolkata&z=14&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function MenuPage({
  authUser,
  cart,
  cartPanelAnimated,
  cartTotal,
  closeMenuItemModal,
  confirmAddToCart,
  deliveryMessage,
  menuModalItem,
  menuModalNotes,
  menuModalQuantity,
  openMenuItemModal,
  removeCartItem,
  setMenuModalNotes,
  setMenuModalQuantity,
  updateCartQuantity,
}) {
  const totalItems = menuCatalog.reduce((count, section) => count + section.items.length, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main>
      <section className="menu-page-hero">
        <div className="menu-page-copy">
          <p className="eyebrow">Full Menu</p>
          <h1>Compact delivery menu.</h1>
          <p className="hero-text">
            Browse {totalItems} dishes, customize quickly, and review the live cart on the right.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href={authUser ? '#reservation' : '#/auth'}>
              {authUser ? 'Book Dine In' : 'Login To Continue'}
            </a>
            <a className="button-secondary" href="#/checkout">
              Go To Checkout
            </a>
          </div>
        </div>
        <div className="menu-summary-card menu-summary-hero">
          <p className="eyebrow">Delivery Rail</p>
          <h3>Custom notes and live totals.</h3>
          <div className="service-stack">
            <div>
              <strong>{cartCount} items in cart</strong>
              <p>Total: {formatCurrency(cartTotal)}</p>
            </div>
            <p className="support-note">Use “Customize & Add” on any dish.</p>
          </div>
        </div>
      </section>

      <section className="content-section menu-layout-shell">
        <div className="menu-layout">
          <div className="menu-catalog">
            <div className="section-heading">
              <p className="eyebrow">Menu Categories</p>
              <h2>Order from a compact category list.</h2>
            </div>
            <div className="category-stack category-stack-modern">
              {menuCatalog.map((section) => (
                <section className="category-panel category-panel-modern" key={section.category}>
                  <div className="category-banner category-banner-modern">
                    <img src={section.image} alt={section.category} />
                    <div className="category-banner-copy">
                      <p className="eyebrow">{section.category}</p>
                      <h3>{section.category}</h3>
                      <p>{section.description}</p>
                    </div>
                  </div>
                  <div className="category-list">
                    {section.items.map((item) => {
                      const preparedItem = buildCartItem(section, item);
                      return (
                        <article className="menu-list-card" key={item.name}>
                          <img className="menu-list-image" src={preparedItem.image} alt={item.name} />
                          <div className="menu-list-copy">
                            <div className="menu-card-head">
                              <h4>{item.name}</h4>
                              <span>{formatCurrency(item.price)}</span>
                            </div>
                            <div className="item-badge-row">
                              <span className="item-badge">{section.category}</span>
                              {preparedItem.attributes.map((attribute) => (
                                <span className="item-badge item-badge-muted" key={attribute}>
                                  {attribute}
                                </span>
                              ))}
                            </div>
                            <p>{item.description}</p>
                          </div>
                          <div className="menu-list-actions">
                            <button
                              className="button-primary menu-list-button"
                              type="button"
                              onClick={() => openMenuItemModal(preparedItem)}
                            >
                              Customize & Add
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className={`cart-side-panel ${cartPanelAnimated ? 'is-animated' : ''}`}>
            <div className="menu-summary-card">
              <div className="cart-panel-top">
                <p className="eyebrow">Live Cart</p>
                <h3>Delivery cart</h3>
              </div>
              <div className="cart-summary-strip">
                <div className="cart-summary-pill">
                  <span>Items</span>
                  <strong>{cartCount}</strong>
                </div>
                <div className="cart-summary-pill cart-summary-pill-total">
                  <span>Total</span>
                  <strong>{formatCurrency(cartTotal)}</strong>
                </div>
              </div>
              <div className="service-stack">
                <a className="button-primary" href="#/checkout">
                  Checkout
                </a>
              </div>
              {deliveryMessage && <p className="confirmation-message cart-inline-message">{deliveryMessage}</p>}
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <p>Choose any dish, open the modal, and add it to start your order.</p>
                </div>
              ) : (
                <CartList cart={cart} compact removeCartItem={removeCartItem} updateCartQuantity={updateCartQuantity} />
              )}
            </div>
          </aside>
        </div>
      </section>
      {menuModalItem && (
        <MenuItemModal
          closeMenuItemModal={closeMenuItemModal}
          confirmAddToCart={confirmAddToCart}
          item={menuModalItem}
          menuModalNotes={menuModalNotes}
          menuModalQuantity={menuModalQuantity}
          setMenuModalNotes={setMenuModalNotes}
          setMenuModalQuantity={setMenuModalQuantity}
        />
      )}
    </main>
  );
}

function CheckoutPage({
  authUser,
  cart,
  cartTotal,
  deliveryForm,
  deliveryMessage,
  handleChange,
  handleDeliverySubmit,
  isSubmitting,
  paymentConfig,
  removeCartItem,
  setDeliveryForm,
  updateCartQuantity,
}) {
  return (
    <main className="content-section checkout-page" id="delivery">
      <div className="section-heading">
        <p className="eyebrow">Checkout</p>
        <h2>Add delivery address, choose payment, and place your order.</h2>
      </div>
      <div className="checkout-grid">
        <section className="account-card">
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <>
              <p>Your cart is empty.</p>
              <a className="inline-auth-link" href="#/menu">
                Back to menu
              </a>
            </>
          ) : (
            <>
              <CartList cart={cart} removeCartItem={removeCartItem} updateCartQuantity={updateCartQuantity} />
              <p className="cart-total-line">Order Total: {formatCurrency(cartTotal)}</p>
            </>
          )}
        </section>

        <form className="reservation-form checkout-form" onSubmit={handleDeliverySubmit}>
          <div className="reservation-copy">
            <p className="eyebrow">Delivery Details</p>
            <h2>Place order</h2>
            {!authUser && <p className="lock-note">Please log in before checkout.</p>}
            {deliveryMessage && <p className="confirmation-message">{deliveryMessage}</p>}
          </div>
          <fieldset className="form-lock" disabled={!authUser || isSubmitting || cart.length === 0}>
            <label>
              Full Name
              <input name="name" value={deliveryForm.name} onChange={handleChange(setDeliveryForm)} />
            </label>
            <label>
              Phone Number
              <input name="phone" value={deliveryForm.phone} onChange={handleChange(setDeliveryForm)} />
            </label>
            <label className="full-width">
              Address Line 1
              <input
                name="addressLine1"
                value={deliveryForm.addressLine1}
                onChange={handleChange(setDeliveryForm)}
                placeholder="Flat / House no / Street"
              />
            </label>
            <label className="full-width">
              Address Line 2
              <input
                name="addressLine2"
                value={deliveryForm.addressLine2}
                onChange={handleChange(setDeliveryForm)}
                placeholder="Building, block, landmark"
              />
            </label>
            <label>
              Area
              <input name="area" value={deliveryForm.area} onChange={handleChange(setDeliveryForm)} />
            </label>
            <label>
              City
              <input name="city" value={deliveryForm.city} onChange={handleChange(setDeliveryForm)} />
            </label>
            <label className="full-width">
              Postal Code
              <input name="postalCode" value={deliveryForm.postalCode} onChange={handleChange(setDeliveryForm)} />
            </label>
            <label className="full-width">
              Delivery Notes
              <textarea
                name="deliveryNotes"
                rows="4"
                value={deliveryForm.deliveryNotes}
                onChange={handleChange(setDeliveryForm)}
                placeholder="Gate code, call before arrival, no onion, extra cutlery..."
              />
            </label>
            <div className="full-width payment-section">
              <div className="payment-section-head">
                <span className="payment-title">Payment Method</span>
                <span className="payment-helper">
                  {paymentConfig.enabled
                    ? 'Secure online checkout is available for UPI and cards.'
                    : 'Online payments will unlock after Razorpay keys are configured on the server.'}
                </span>
              </div>
              <div className="payment-options">
                {paymentOptions.map((option) => (
                  <label
                    className={`payment-option ${deliveryForm.paymentMethod === option.value ? 'is-selected' : ''} ${
                      option.value !== 'cod' && !paymentConfig.enabled ? 'is-disabled' : ''
                    }`}
                    key={option.value}
                  >
                    <input
                      checked={deliveryForm.paymentMethod === option.value}
                      disabled={option.value !== 'cod' && !paymentConfig.enabled}
                      name="paymentMethod"
                      onChange={handleChange(setDeliveryForm)}
                      type="radio"
                      value={option.value}
                    />
                    <div className="payment-option-copy">
                      <span className="payment-option-label">{option.label}</span>
                      <span className="payment-option-detail">{option.detail}</span>
                    </div>
                  </label>
                ))}
              </div>
              {deliveryForm.paymentMethod !== 'cod' && paymentConfig.enabled && (
                <div className="payment-gateway-note">
                  <strong>Razorpay checkout</strong>
                  <span>Your delivery order will be confirmed immediately after payment verification.</span>
                </div>
              )}
            </div>
            <button className="button-primary wide-button" type="submit">
              {deliveryForm.paymentMethod === 'cod' ? 'Place Order' : `Pay ${formatCurrency(cartTotal)} & Place Order`}
            </button>
          </fieldset>
          {!authUser && (
            <a className="inline-auth-link" href="#/auth">
              Login or register to order
            </a>
          )}
        </form>
      </div>
    </main>
  );
}

function SuccessPage({ authUser, deliveryMessage, lastOrder }) {
  return (
    <main className="auth-page-shell">
      <section className="auth-page-card success-card">
        <div className="auth-copy">
          <p className="eyebrow">Order Success</p>
          <h1>Your order has been placed successfully.</h1>
          <p className="hero-text">
            {deliveryMessage || 'We have received your order and will contact you shortly with confirmation details.'}
          </p>
          {lastOrder && (
            <div className="success-order-card">
              <strong>{lastOrder.customerName}</strong>
              <p>{lastOrder.address}</p>
              <p>Payment: {formatPaymentMethod(lastOrder.paymentMethod)}</p>
              <p>Total: {formatCurrency(lastOrder.total)}</p>
              <p>{lastOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items confirmed</p>
            </div>
          )}
          <div className="hero-actions">
            <a className="button-primary" href="#/menu">
              Order More
            </a>
            <a className="button-secondary" href={authUser ? '#my-activity' : '#/'}>
              {authUser ? 'View My Orders' : 'Back Home'}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function CartList({ cart, compact = false, removeCartItem, updateCartQuantity }) {
  return (
    <div className={`cart-list ${compact ? 'cart-list-compact' : ''}`}>
      {cart.map((item) => {
        const unitPrice = parsePrice(item.price ?? item.priceLabel);
        const itemTotal = unitPrice * (Number(item.quantity) || 0);

        return (
        <article className={`cart-item ${compact ? 'cart-item-compact' : ''}`} key={item.cartId}>
          <div className="cart-item-main">
            <img className="cart-item-image" src={item.image || getImageForItem(item.name)} alt={item.name} />
            <div className="cart-item-copy">
              <div className="cart-item-head">
                <strong>{item.name}</strong>
                <span className="cart-item-price">{formatCurrency(itemTotal)}</span>
              </div>
              {Number(item.quantity) > 1 && <p className="cart-item-unit-price">{formatCurrency(unitPrice)} each</p>}
              {!compact && item.category && <span className="item-badge cart-category-badge">{item.category}</span>}
              {!compact && item.description && <p className="cart-item-description">{item.description}</p>}
              {item.notes && <p className="cart-item-note">{compact ? item.notes : `Instruction: ${item.notes}`}</p>}
            </div>
          </div>
          {!compact && Array.isArray(item.attributes) && item.attributes.length > 0 && (
            <div className="item-badge-row cart-badge-row">
              {item.attributes.slice(0, 2).map((attribute) => (
                <span className="item-badge item-badge-muted" key={attribute}>
                  {attribute}
                </span>
              ))}
            </div>
          )}
          <div className="cart-item-footer">
            <div className="cart-actions">
              <button className="qty-button" type="button" onClick={() => updateCartQuantity(item.cartId, -1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button className="qty-button" type="button" onClick={() => updateCartQuantity(item.cartId, 1)}>
                +
              </button>
            </div>
            <div className="cart-footer-meta">
              <span className="cart-item-subtotal">{formatCurrency(itemTotal)}</span>
              <button className="remove-button" type="button" onClick={() => removeCartItem(item.cartId)}>
                Remove
              </button>
            </div>
          </div>
        </article>
      )})}
    </div>
  );
}

function MenuItemModal({
  closeMenuItemModal,
  confirmAddToCart,
  item,
  menuModalNotes,
  menuModalQuantity,
  setMenuModalNotes,
  setMenuModalQuantity,
}) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={closeMenuItemModal}>
      <div className="menu-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={closeMenuItemModal}>
          ×
        </button>
        <div className="menu-modal-grid">
          <img className="menu-modal-image" src={item.image} alt={item.name} />
          <div className="menu-modal-copy">
            <p className="eyebrow">{item.category}</p>
            <h2>{item.name}</h2>
            <p className="hero-text">{item.description}</p>
            <div className="item-badge-row">
              {item.attributes.map((attribute) => (
                <span className="item-badge item-badge-muted" key={attribute}>
                  {attribute}
                </span>
              ))}
            </div>
            <div className="menu-modal-controls">
              <div className="menu-modal-price">{item.priceLabel}</div>
              <label>
                Quantity
                <div className="modal-qty-controls">
                  <button type="button" className="qty-button" onClick={() => setMenuModalQuantity((current) => Math.max(1, current - 1))}>
                    -
                  </button>
                  <span>{menuModalQuantity}</span>
                  <button type="button" className="qty-button" onClick={() => setMenuModalQuantity((current) => current + 1)}>
                    +
                  </button>
                </div>
              </label>
            </div>
            <label className="full-width">
              Instruction Notes
              <textarea
                rows="4"
                value={menuModalNotes}
                onChange={(event) => setMenuModalNotes(event.target.value)}
                placeholder="Less spicy, no onion, extra dip, pack separately..."
              />
            </label>
            <div className="hero-actions">
              <button className="button-primary" type="button" onClick={confirmAddToCart}>
                Add {menuModalQuantity} To Cart
              </button>
              <button className="button-secondary" type="button" onClick={closeMenuItemModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPage({
  authForm,
  authMessage,
  authMode,
  forgotResetToken,
  handleAuthSubmit,
  handleChange,
  isAuthSubmitting,
  setAuthForm,
  setAuthMode,
}) {
  return (
    <main className="auth-page-shell">
      <section className="auth-page-card">
        <div className="auth-copy">
          <p className="eyebrow">Account Access</p>
          <h1>
            {authMode === 'login' && 'Login to unlock bookings and delivery.'}
            {authMode === 'register' && 'Create your account for table booking and orders.'}
            {authMode === 'forgot' && 'Generate a reset code for your account.'}
            {authMode === 'reset' && 'Set a new password using your reset code.'}
          </h1>
          <p className="hero-text">
            After login, your booking forms become active and your personal booking and delivery history appears in the site.
          </p>
          <div className="auth-switcher">
            <button className={`auth-tab ${authMode === 'login' ? 'is-active' : ''}`} type="button" onClick={() => setAuthMode('login')}>
              Login
            </button>
            <button className={`auth-tab ${authMode === 'register' ? 'is-active' : ''}`} type="button" onClick={() => setAuthMode('register')}>
              Register
            </button>
            <button className={`auth-tab ${authMode === 'forgot' ? 'is-active' : ''}`} type="button" onClick={() => setAuthMode('forgot')}>
              Forgot Password
            </button>
          </div>
        </div>

        <form className="auth-form-card" onSubmit={handleAuthSubmit}>
          {authMessage && <p className="confirmation-message">{authMessage}</p>}
          {forgotResetToken && authMode === 'reset' && <p className="dev-note">Reset code: {forgotResetToken}</p>}

          {authMode === 'register' && (
            <label>
              Full Name
              <input name="name" value={authForm.name} onChange={handleChange(setAuthForm)} />
            </label>
          )}
          {(authMode === 'login' || authMode === 'register' || authMode === 'forgot') && (
            <label>
              Email
              <input name="email" type="email" value={authForm.email} onChange={handleChange(setAuthForm)} />
            </label>
          )}
          {(authMode === 'login' || authMode === 'register' || authMode === 'reset') && (
            <label>
              Password
              <input name="password" type="password" value={authForm.password} onChange={handleChange(setAuthForm)} />
            </label>
          )}
          {authMode === 'register' && (
            <label>
              Confirm Password
              <input
                name="confirmPassword"
                type="password"
                value={authForm.confirmPassword}
                onChange={handleChange(setAuthForm)}
              />
            </label>
          )}
          {authMode === 'reset' && (
            <>
              <label>
                Reset Code
                <input name="resetToken" value={authForm.resetToken} onChange={handleChange(setAuthForm)} />
              </label>
              <label>
                Confirm Password
                <input
                  name="confirmPassword"
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={handleChange(setAuthForm)}
                />
              </label>
            </>
          )}

          <button className="button-primary wide-button" type="submit" disabled={isAuthSubmitting}>
            {authMode === 'login' && 'Login'}
            {authMode === 'register' && 'Create Account'}
            {authMode === 'forgot' && 'Generate Reset Code'}
            {authMode === 'reset' && 'Reset Password'}
          </button>
        </form>
      </section>
    </main>
  );
}

function AccountSection({
  authUser,
  handleChange,
  handleProfileSubmit,
  isProfileSubmitting,
  myBookings,
  myDeliveries,
  profileForm,
  profileMessage,
  setProfileForm,
}) {
  const totalGuestsBooked = myBookings.reduce((sum, booking) => sum + (Number.parseInt(booking.guest_count, 10) || 0), 0);
  const totalDeliverySpend = myDeliveries.reduce((sum, delivery) => sum + (Number(delivery.order_total) || 0), 0);

  return (
    <section className="content-section account-section" id="my-activity">
      <div className="section-heading">
        <p className="eyebrow">My Account</p>
        <h2>{authUser.name}, your profile, bookings, and delivery activity are all in one place.</h2>
      </div>
      <div className="account-overview-grid">
        <article className="account-card profile-card">
          <div className="profile-card-head">
            <div className="profile-avatar" aria-hidden="true">
              {authUser.name?.slice(0, 1).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="eyebrow">Profile</p>
              <h3>{authUser.name}</h3>
              <p className="profile-meta">{authUser.email}</p>
            </div>
          </div>
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <label>
              Full Name
              <input name="name" value={profileForm.name} onChange={handleChange(setProfileForm)} />
            </label>
            <label>
              Email Address
              <input name="email" type="email" value={profileForm.email} onChange={handleChange(setProfileForm)} />
            </label>
            <button className="button-primary profile-save-button" type="submit" disabled={isProfileSubmitting}>
              {isProfileSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
            {profileMessage && <p className="confirmation-message profile-message">{profileMessage}</p>}
          </form>
          <div className="profile-details">
            <div className="profile-detail-row">
              <span>Member Since</span>
              <strong>{new Date(authUser.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            </div>
            <div className="profile-detail-row">
              <span>Saved Orders</span>
              <strong>{myDeliveries.length}</strong>
            </div>
            <div className="profile-detail-row">
              <span>Reservations</span>
              <strong>{myBookings.length}</strong>
            </div>
          </div>
        </article>

        <article className="account-card profile-stats-card">
          <p className="eyebrow">Account Snapshot</p>
          <div className="profile-stats-grid">
            <div className="profile-stat">
              <strong>{myBookings.length}</strong>
              <span>Table bookings</span>
            </div>
            <div className="profile-stat">
              <strong>{myDeliveries.length}</strong>
              <span>Delivery orders</span>
            </div>
            <div className="profile-stat">
              <strong>{totalGuestsBooked}</strong>
              <span>Total guests hosted</span>
            </div>
            <div className="profile-stat">
              <strong>{formatCurrency(totalDeliverySpend)}</strong>
              <span>Total delivery spend</span>
            </div>
          </div>
        </article>
      </div>
      <div className="account-grid">
        <article className="account-card">
          <h3>My Table Bookings</h3>
          {myBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            myBookings.map((booking) => (
              <div className="activity-item" key={booking.id}>
                <strong>
                  {booking.booking_date} at {booking.booking_time}
                </strong>
                <p>{booking.guest_count} guests</p>
                <p>{booking.special_request || 'No special request'}</p>
              </div>
            ))
          )}
        </article>
        <article className="account-card">
          <h3>My Delivery Requests</h3>
          {myDeliveries.length === 0 ? (
            <p>No delivery requests yet.</p>
          ) : (
            myDeliveries.map((delivery) => (
              <div className="activity-item" key={delivery.id}>
                <strong>{delivery.customer_name}</strong>
                <p>{delivery.phone}</p>
                <p>{formatDeliveryItems(delivery.items)}</p>
                <p>
                  {(delivery.status || 'placed').toUpperCase()}
                  {delivery.payment_method ? ` | ${formatPaymentMethod(delivery.payment_method)}` : ''}
                  {delivery.payment_status ? ` | ${delivery.payment_status}` : ''}
                  {delivery.order_total ? ` | ${formatCurrency(Number(delivery.order_total))}` : ''}
                </p>
              </div>
            ))
          )}
        </article>
      </div>
    </section>
  );
}

function SiteFooter({ authUser }) {
  return (
    <footer className="footer-section" id="contact">
      <div>
        <h3>Saffron Table</h3>
        <p>Refined dining, online table booking, and delivery-ready food in the heart of Kolkata.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <a href="#/">Home</a>
        <a href="#/menu">Menu</a>
        <a href="#reservation">Reserve</a>
        <a href={authUser ? '#my-activity' : '#/auth'}>{authUser ? 'My Account' : 'Login / Register'}</a>
      </div>
      <div>
        <h4>Social Media</h4>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
          YouTube
        </a>
      </div>
      <div>
        <h4>Newsletter</h4>
        <p>Get event nights, festive menus, and exclusive reservation updates.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" aria-label="Email address" />
          <button type="button">Subscribe</button>
        </form>
      </div>
    </footer>
  );
}

function getImageForItem(name) {
  const imageMap = {
    'Paneer Tikka':
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80',
    'Tom Yum Veg Soup':
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    'Butter Chicken':
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80',
    'Tandoori Pomfret':
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80',
    'Pasta Alfredo':
      'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?auto=format&fit=crop&w=1000&q=80',
    'Kolkata Chicken Biryani':
      'https://images.unsplash.com/photo-1701579231347-6d98d48c5f2c?auto=format&fit=crop&w=1000&q=80',
    'Butter Naan':
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
    'Baked Rosogolla':
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=80',
  };

  return imageMap[name] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80';
}

function formatDeliveryItems(items) {
  try {
    const parsed = JSON.parse(items);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => `${item.name} x ${item.quantity}`).join(', ');
    }
  } catch {}

  return items;
}

function formatPaymentMethod(method) {
  if (method === 'upi') {
    return 'UPI';
  }

  if (method === 'card') {
    return 'Credit / Debit Card';
  }

  if (method === 'online') {
    return 'Online Payment';
  }

  return 'Cash on Delivery';
}

export default App;

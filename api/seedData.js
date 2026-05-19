const seedData = {
  header: {
    topbarText: 'Welcome to FreshMart Grocery Marketplace',
    topLinks: [
      
      { label: 'English', hasArrow: true },
      { label: 'Blog', hasArrow: false },
      { label: 'Contact', hasArrow: false }
    ],
    phone: '+91 98765 43210',
    searchPlaceholder: 'Search in fresh grocery products...'
  },
  heroSlides: {
    main: '/wolmart-demo29/shop29-slide-1.jpg',
    sideOne: '/wolmart-demo29/shop29-banner-1.jpg',
    sideTwo: '/wolmart-demo29/shop29-banner-2.jpg',
    sideThree: '/wolmart-demo29/shop29-banner-3.jpg',
    dealPromo: 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2025/03/shop29-banner-4.jpg',
    logo: '/wolmart-demo29/shop29-logo.png',
    footerLogo: '/wolmart-demo29/shop29-footer-logo.png',
    googlePlay: '/wolmart-demo29/shop29-google.png',
    appStore: '/wolmart-demo29/shop29-app.png',
    payments: '/wolmart-demo29/shop29-payments.png'
  },
  hero: {
    main: {
      eyebrow: 'Fresh Food Collection',
      title: 'Delivery for 24 hours a day for you, fast delivery!',
      highlight: '24',
      description: 'Free shipping will be applied to orders above $50',
      cta: 'Shop Now'
    },
    sideOne: {
      title: 'Buy bundle & get discounts',
      cta: 'Shop Now'
    },
    sideTwo: {
      title: 'Organic Beverages sale up to',
      highlight: '40%'
    },
    sideThree: {
      title: 'Get pack of fish at a discount',
      highlight: 'Every 3rd Unit'
    },
    tickerItems: [
      'Spend over $50',
      'Free delivery when you spend over $50',
      'Free delivery when you spend over $50',
      'Spend over $50',
      'Free delivery when you spend over $50',
      'Free delivery when you spend over $50'
    ]
  },
  navigation: {
    searchCategories: ['All Categories', 'Fruits', 'Vegan Meat', 'Seafood', 'Dairy', 'Bakery', 'Beverages', 'Beer & Liquor', 'Vegetable'],
    utilities: [
      { label: 'Promotions' },
      { label: 'Weekly Discounts' }
    ],
    items: [
      { label: 'Fruits' },
      { label: 'Vegetable' },
      {
        label: 'Vegan Meat',
        megaMenuClass: 'vegan-menu',
        columns: [
          {
            title: 'Chucken & Duck',
            displayType: 'media',
            items: [
              { label: 'Chickendog', image: '/wolmart-demo29/shop29-sm-img-1.jpg' },
              { label: 'Chicken Liver', image: '/wolmart-demo29/shop29-sm-img-2.jpg' },
              { label: 'Smoked Duck', image: '/wolmart-demo29/shop29-sm-img-3.jpg' }
            ]
          },
          {
            title: 'Beef & Veal',
            displayType: 'media',
            items: [
              { label: 'Dressed', image: '/wolmart-demo29/shop29-sm-img-4.jpg' },
              { label: 'Fillet', image: '/wolmart-demo29/shop29-sm-img-5.jpg' },
              { label: 'Dried Beef', image: '/wolmart-demo29/shop29-sm-img-6.jpg' }
            ]
          },
          {
            title: 'Burgers',
            displayType: 'media',
            items: [
              { label: 'Cheeseburger', image: '/wolmart-demo29/shop29-sm-img-7.jpg' },
              { label: 'Eggburger', image: '/wolmart-demo29/shop29-sm-img-8.jpg' },
              { label: 'Steakburger', image: '/wolmart-demo29/shop29-sm-img-9.jpg' }
            ]
          },
          {
            title: 'Pork',
            displayType: 'media',
            items: [
              { label: 'Pork-Chop', image: '/wolmart-demo29/shop29-sm-img-10.jpg' },
              { label: 'Pork-Pie', image: '/wolmart-demo29/shop29-sm-img-11.jpg' },
              { label: 'Baked Ham', image: '/wolmart-demo29/shop29-sm-img-12.jpg' }
            ]
          }
        ]
      },
      { label: 'Seafood' },
      { label: 'Dairy' },
      {
        label: 'Bakery',
        megaMenuClass: 'bakery-menu',
        columns: [
          {
            title: 'Fresh bread',
            displayType: 'text',
            items: [{ label: 'Breadstick' }, { label: 'Brioche' }, { label: 'Choco bread' }]
          },
          {
            title: 'Cookies',
            displayType: 'text',
            items: [{ label: 'Icebox Cookie' }, { label: 'Sandwich Cookie' }, { label: 'Fried Cookie' }]
          },
          {
            title: 'Desserts',
            displayType: 'text',
            items: [{ label: 'Custards' }, { label: 'Cheesecakes' }, { label: 'Gelatin' }]
          },
          {
            title: 'Chocolates',
            displayType: 'text',
            items: [{ label: 'Semisweet' }, { label: 'Bittersweet' }, { label: 'Dark & White' }]
          }
        ],
        promo: {
          eyebrow: 'Exclusive Product New Arrival',
          title: 'Free Shipping and 50% Off',
          image: 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2025/03/shop29-megamenu-banner.jpg'
        }
      },
      { label: 'Beverages' },
      { label: 'Beer & Liquor' }
    ]
  },
  sections: {
    categories: { title: 'Popular Categories', linkLabel: 'View All' },
    dealMonth: {
      title: 'Deal of The Month',
      linkLabel: 'See All',
      promoEyebrow: 'Hot This Month',
      promoTitle: 'Save For Extra',
      promoAccent: '$15 Per Order',
      countdownSeconds: 50562
    },
    weeklyDiscounts: {
      title: 'Weekly Discounts',
      subtitle: 'Best offers from our fresh grocery collection'
    },
    newArrivals: {
      title: 'New Arrivals',
      subtitle: 'Recently added products for your daily shopping'
    },
    promoBanner: {
      eyebrow: 'Limited Time Offer',
      title: 'Get 30% discount on your first grocery order',
      buttonLabel: 'Use Code: FRESH30'
    },
    vendors: {
      title: 'Top Weekly Vendors',
      linkLabel: 'Store List'
    },
    articles: {
      title: 'Our Articles',
      linkLabel: 'All Products'
    },
    productList: {
      title: 'Fruits',
      breadcrumbCurrent: 'Fruits',
      resultLabel: 'Products Found',
      sidebarTitle: 'Browse Categories',
      promoEyebrow: 'Fresh Picks',
      promoTitle: 'Organic fruits for daily delivery',
      promoImage: '/wolmart-demo29/shop29-banner-1.jpg',
      sortOptions: ['Default sorting', 'Latest products', 'Price: Low to High', 'Price: High to Low'],
      showOptions: [12, 9, 6],
      priceRange: { min: 0, max: 10 }
    },
    productDetails: {
      descriptionTabLabel: 'Description',
      additionalInfoTitle: 'Additional information',
      relatedTitle: 'Related products',
      relatedSubtitle: 'FreshMart picks from the same collection',
      shareLabel: 'Share',
      addToCartLabel: 'Add To Cart'
    }
  },
  categories: [
    { name: 'Vegetables', image: '/wolmart-demo29/shop29-cat-8.jpg', count: '24 items' },
    { name: 'Beer & Liquor', image: '/wolmart-demo29/shop29-cat-7.jpg', count: '12 items' },
    { name: 'Beverages', image: '/wolmart-demo29/shop29-cat-1.jpg', count: '38 items' },
    { name: 'Bakery', image: '/wolmart-demo29/shop29-cat-3.jpg', count: '18 items' },
    { name: 'Dairy', image: '/wolmart-demo29/shop29-cat-4.jpg', count: '31 items' },
    { name: 'Seafood', image: '/wolmart-demo29/shop29-cat-2.jpg', count: '15 items' },
    { name: 'Vegan Meals', image: '/wolmart-demo29/shop29-cat-5.jpg', count: '20 items' },
    { name: 'Fruits', image: '/wolmart-demo29/shop29-cat-6.jpg', count: '42 items' }
  ],
  products: [
    { slug: 'cauliflower', sku: 'MS98282801', name: 'Cauliflower', category: 'Vegetable', price: '$2.15', oldPrice: '$2.65', tag: '19% OFF', image: '/wolmart-demo29/shop29-product-40-1-232x279.jpg', rating: 4, available: 175, sold: 1, accentColor: 'green', nutritionTags: ['Low Calorie'], shortDescription: 'Fresh-picked cauliflower with a clean crunch and mild flavor.', longDescription: 'Cauliflower is one of the most versatile staples in the market collection. It works well roasted, steamed, or folded into soups, and its mild taste makes it easy to pair with herbs, butter, and cheeses.', galleryImages: ['/wolmart-demo29/shop29-product-40-1-232x279.jpg'] },
    { slug: 'red-apple', sku: 'MS98282802', name: 'Red Apple', category: 'Fresh Fruit', price: '$3.40', oldPrice: '$4.10', tag: '17% OFF', image: '/wolmart-demo29/shop29-product-10-1-232x279.jpg', rating: 5, available: 140, sold: 12, accentColor: 'red', nutritionTags: ['Low Fat'], shortDescription: 'Sweet red apples selected for snacking and juice blends.', longDescription: 'These apples balance sweetness and crisp texture, making them suitable for direct snacking, fruit bowls, and seasonal desserts. Their bright skin and stable shelf life make them a reliable kitchen staple.', galleryImages: ['/wolmart-demo29/shop29-product-10-1-232x279.jpg'] },
    { slug: 'fresh-milk', sku: 'MS98282803', name: 'Fresh Milk', category: 'Dairy Product', price: '$1.95', oldPrice: '$2.45', tag: '20% OFF', image: '/wolmart-demo29/shop29-product-11-1-232x279.jpg', rating: 4, available: 96, sold: 18, accentColor: 'white', nutritionTags: ['Low Fat'], shortDescription: 'Chilled dairy milk for breakfast, baking, and hot drinks.', longDescription: 'Fresh milk from the daily dairy range delivers a smooth texture and balanced flavor. It is suitable for cereals, tea, coffee, sauces, and bakery preparation where a dependable dairy base is needed.', galleryImages: ['/wolmart-demo29/shop29-product-11-1-232x279.jpg'] },
    { slug: 'croissant-pack', sku: 'MS98282804', name: 'Croissant Pack', category: 'Bakery', price: '$5.25', oldPrice: '$6.10', tag: '14% OFF', image: '/wolmart-demo29/shop29-product-12-1-232x279.jpg', rating: 4, available: 64, sold: 7, accentColor: 'yellow', nutritionTags: [], shortDescription: 'Layered buttery croissants packed for quick breakfasts.', longDescription: 'The bakery selection includes flaky croissants with a rich butter profile and tender crumb. Serve them warm, pair them with jam, or use them as the base for savory sandwich builds.', galleryImages: ['/wolmart-demo29/shop29-product-12-1-232x279.jpg'] },
    { slug: 'fresh-salmon-fillet', sku: 'MS98282805', name: 'Fresh Salmon Fillet', category: 'Seafood', price: '$21.50', oldPrice: '$28.00', tag: '25% OFF', image: '/wolmart-demo29/shop29-product-13-1-232x279.jpg', rating: 5, available: 34, sold: 11, accentColor: 'orange', nutritionTags: [], shortDescription: 'Premium salmon fillet with rich color and tender flakes.', longDescription: 'This seafood cut is ideal for grilling, pan searing, or oven roasting. The fillet carries a clean finish and rich texture that works well with citrus, garlic butter, or fresh herb marinades.', galleryImages: ['/wolmart-demo29/shop29-product-13-1-232x279.jpg'] },
    { slug: 'green-vegan-salad', sku: 'MS98282806', name: 'Green Vegan Salad', category: 'Healthy Meals', price: '$9.40', oldPrice: '$13.20', tag: 'FRESH', image: '/wolmart-demo29/shop29-product-14-1-232x279.jpg', rating: 4, available: 41, sold: 9, accentColor: 'green', nutritionTags: ['Low Calorie', 'Low Fat'], shortDescription: 'Prepared vegan salad for light lunches and clean meal plans.', longDescription: 'The salad mix combines crisp greens and simple fresh ingredients in a ready-to-serve format. It suits quick lunches, meal prep, or healthy side servings when time is limited.', galleryImages: ['/wolmart-demo29/shop29-product-14-1-232x279.jpg'] },
    { slug: 'natural-orange-juice', sku: 'MS98282807', name: 'Natural Orange Juice', category: 'Beverage', price: '$4.99', oldPrice: '$7.99', tag: 'BEST', image: '/wolmart-demo29/shop29-product-15-1-1-232x279.jpg', rating: 5, available: 88, sold: 24, accentColor: 'orange', nutritionTags: [], shortDescription: 'Citrus-forward juice with a bright and refreshing finish.', longDescription: 'Natural orange juice brings a vivid citrus profile to breakfast service and daily refreshment. It works chilled on its own or as a base for smoothies and mocktail combinations.', galleryImages: ['/wolmart-demo29/shop29-product-15-1-1-232x279.jpg'] },
    { slug: 'cheese-family-pack', sku: 'MS98282808', name: 'Cheese Family Pack', category: 'Dairy Product', price: '$13.90', oldPrice: '$17.50', tag: 'DEAL', image: '/wolmart-demo29/shop29-product-16-3-232x279.jpg', rating: 4, available: 57, sold: 14, accentColor: 'yellow', nutritionTags: ['Low Fat'], shortDescription: 'Multi-pack cheese assortment for family breakfasts and snacks.', longDescription: 'This cheese pack is built for family-size use across sandwiches, platters, and cooking. The balanced flavor profile makes it practical for both quick daily use and larger gatherings.', galleryImages: ['/wolmart-demo29/shop29-product-16-3-232x279.jpg'] },
    { slug: 'italy-olive', sku: 'MS98282832', name: 'Italy Olive', category: 'Fruits', price: '$3.20', oldPrice: '$3.90', tag: '8% OFF', image: 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-5-1-1.jpg', rating: 4, available: 122, sold: 0, accentColor: 'yellow', nutritionTags: ['Low Calorie'], shortDescription: 'Ultrices eros in cursus turpis massa tincidunt cursus mattis. Volutpat ac tincidunt vitae semper quis lectus. Aliquam id diam maecenas ultricies mi eget mauris.', longDescription: 'Italy Olive is presented in the original Wolmart product detail layout with a clean gallery and a focused purchase column. It fits salad bowls, light platters, and Mediterranean-style meals where a bright and savory fruit element is needed. The product page highlights the same fresh-market visual language with a large image stage, compact meta details, and related fruit recommendations.', galleryImages: ['https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-5-1-1.jpg', 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-5-2.jpg', 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-5-4.jpg', 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-5-3.jpg'] },
    { slug: 'lemon', sku: 'MS98282835', name: 'Lemon', category: 'Fruits', price: '$2.60', oldPrice: '$3.00', tag: '12% OFF', image: 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-6-1-1.jpg', rating: 4, available: 321, sold: 0, accentColor: 'yellow', nutritionTags: ['Low Calorie', 'Low Fat'], shortDescription: 'Fresh lemons for juice, marinades, and bright fruit displays.', longDescription: 'Lemon brings acidity and fragrance that elevate drinks, seafood marinades, and dessert finishing. Its clean profile makes it a strong supporting ingredient across sweet and savory kitchen use.', galleryImages: ['https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-6-1-1.jpg'] },
    { slug: 'sweet-cherry', sku: 'MS98282858', name: 'Sweet Cherry', category: 'Fruits', price: '$2.30', oldPrice: '$2.90', tag: '10% OFF', image: 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-7-1-1.jpg', rating: 4, available: 192, sold: 0, accentColor: 'red', nutritionTags: ['Low Fat'], shortDescription: 'Sweet cherries selected for fresh snacking and dessert garnish.', longDescription: 'Sweet cherry delivers a concentrated fruit sweetness and polished red color that works well in snack bowls, cake decoration, and chilled fruit platters.', galleryImages: ['https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-7-1-1.jpg'] },
    { slug: 'swiss-grapes', sku: 'MS98282833', name: 'Swiss Grapes', category: 'Fruits', price: '$3.50', oldPrice: '$4.10', tag: '13% OFF', image: 'https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-8-1-1.jpg', rating: 4, available: 168, sold: 0, accentColor: 'yellow', nutritionTags: ['Low Calorie'], shortDescription: 'Sweet table grapes for platters, lunches, and chilled snacks.', longDescription: 'Swiss grapes are selected for convenience and presentation. Their balanced sweetness makes them useful for casual snacking, charcuterie boards, and family fruit servings.', galleryImages: ['https://d-themes.com/wordpress/wolmart/demo-29/wp-content/uploads/sites/50/2023/12/shop29-product-8-1-1.jpg'] }
  ],
  dealMonthProducts: [
    { slug: 'cauliflower-deal', sku: 'MS98282861', name: 'Cauliflower', category: 'Vegetable', price: '$2.15', oldPrice: '$2.65', tag: '19% OFF', image: '/wolmart-demo29/shop29-product-1-1-1-232x279.jpg', rating: 4, available: 175, sold: 1, accentColor: 'green', nutritionTags: ['Low Calorie'], shortDescription: 'Deal of the month cauliflower with limited promo stock.', longDescription: 'Fresh cauliflower from the deal collection with the same clean taste profile and a stronger promotional price point for monthly offers.', galleryImages: ['/wolmart-demo29/shop29-product-1-1-1-232x279.jpg'] },
    { slug: 'garlic', sku: 'MS98282862', name: 'Garlic', category: 'Vegetable', price: '$3.20', oldPrice: '$3.70', tag: '14% OFF', image: '/wolmart-demo29/shop29-product-2-1-1-232x279.jpg', rating: 4, available: 89, sold: 1, accentColor: 'white', nutritionTags: ['Low Calorie'], shortDescription: 'Fresh garlic bulbs for seasoning, roasting, and sauces.', longDescription: 'Garlic is essential pantry produce for savory cooking. It adds depth to sauces, soups, marinades, and roasted vegetable dishes.', galleryImages: ['/wolmart-demo29/shop29-product-2-1-1-232x279.jpg'] },
    { slug: 'red-grapes', sku: 'MS98282839', name: 'Red Grapes', category: 'Fruits', price: '$4.20', oldPrice: '$5.00', tag: '16% OFF', image: '/wolmart-demo29/shop29-product-3-1-232x279.jpg', rating: 4, available: 888, sold: 0, accentColor: 'red', nutritionTags: ['Low Fat'], shortDescription: 'Clusters of red grapes for snacking and table service.', longDescription: 'Red grapes bring a balanced sweetness and strong shelf appeal. They are suitable for snack bowls, party platters, and chilled fruit service.', galleryImages: ['/wolmart-demo29/shop29-product-3-1-232x279.jpg'] },
    { slug: 'carp', sku: 'MS98282863', name: 'Carp', category: 'Seafood', price: '$45.00', oldPrice: '$50.00', tag: '10% OFF', image: '/wolmart-demo29/shop29-product-4-1-232x279.jpg', rating: 5, available: 548, sold: 0, accentColor: 'silver', nutritionTags: [], shortDescription: 'Whole carp for seafood counters and family meals.', longDescription: 'Carp from the seafood collection is suited to larger family-style preparations and regional fish recipes that call for a full-bodied, firm fish cut.', galleryImages: ['/wolmart-demo29/shop29-product-4-1-232x279.jpg'] }
  ],
  vendors: [
    {
      name: 'Wolmart29 Vendor5',
      logo: '/wolmart-demo29/shop29-vendor-5.jpg',
      rating: 5,
      items: [
        '/wolmart-demo29/shop29-product-23-1-300x338.jpg',
        '/wolmart-demo29/shop29-product-13-1.jpg',
        '/wolmart-demo29/shop29-product-7-1.jpg'
      ]
    },
    {
      name: 'Wolmart29 Vendor4',
      logo: '/wolmart-demo29/shop29-vendor-4.jpg',
      rating: 5,
      items: [
        '/wolmart-demo29/shop29-product-24-1-300x338.jpg',
        '/wolmart-demo29/shop29-product-40-1.jpg',
        '/wolmart-demo29/shop29-product-14-1.jpg'
      ]
    },
    {
      name: 'Wolmart29 Vendor3',
      logo: '/wolmart-demo29/shop29-vendor-3.jpg',
      rating: 4,
      items: [
        '/wolmart-demo29/shop29-product-25-1-300x338.jpg',
        '/wolmart-demo29/shop29-product-10-1.jpg',
        '/wolmart-demo29/shop29-product-9-1.jpg'
      ]
    },
    {
      name: 'Wolmart29 Vendor1',
      logo: '/wolmart-demo29/shop29-vendor-1.jpg',
      rating: 5,
      items: [
        '/wolmart-demo29/shop29-product-22-1-300x338.jpg',
        '/wolmart-demo29/shop29-product-12-1.jpg',
        '/wolmart-demo29/shop29-product-2-1-1.jpg'
      ]
    },
    {
      name: 'Wolmart29 Vendor2',
      logo: '/wolmart-demo29/shop29-vendor-2.jpg',
      rating: 5,
      items: [
        '/wolmart-demo29/shop29-product-21-1-300x338.jpg',
        '/wolmart-demo29/shop29-product-11-1.jpg',
        '/wolmart-demo29/shop29-product-1-1-1.jpg'
      ]
    }
  ],
  articles: [
    {
      title: 'The Pastry and French Bread',
      date: 'December 26, 2023',
      excerpt: 'Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Suspendisse potenti.Sed egstas, ant at...',
      image: '/wolmart-demo29/shop29-blog-1-310x192.jpg'
    },
    {
      title: 'The Beauty of Honey Making',
      date: 'January 10, 2024',
      excerpt: 'Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Suspendisse potenti.Sed egstas, ant at...',
      image: '/wolmart-demo29/shop29-blog-2-310x192.jpg'
    },
    {
      title: 'Is Buying Origanic Healthier?',
      date: 'January 10, 2024',
      excerpt: 'Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Suspendisse potenti.Sed egstas, ant at...',
      image: '/wolmart-demo29/shop29-blog-3-310x192.jpg'
    },
    {
      title: 'Spicey Choose Plush Amazing',
      date: 'January 10, 2024',
      excerpt: 'Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Suspendisse potenti.Sed egstas, ant at...',
      image: '/wolmart-demo29/shop29-blog-4-310x192.jpg'
    }
  ],
  footer: {
    description: 'Modern grocery marketplace React template with sticky header and smooth animations.',
    companyLinks: ['About', 'Contact', 'Vendors'],
    accountLinks: ['Login', 'Cart', 'Wishlist'],
    newsletterPlaceholder: 'Email address',
    newsletterButton: 'Subscribe'
  }
};

export default seedData;

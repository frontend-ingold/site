export const pageMenuItems = [
  { key: "about", label: "About us", href: "#/about-us", route: "about-us" },
  { key: "contact", label: "Contact with Us", href: "#/contact-us", route: "contact-us" },
  { key: "faqs", label: "Faq's", href: "#/faqs", route: "faqs" },
  { key: "privacy", label: "Privacy Policy", href: "#/privacy-policy", route: "privacy-policy" },
  { key: "shipping", label: "Shipping & Delivery", href: "#/shipping-delivery", route: "shipping-delivery" },
  { key: "terms", label: "Terms & Conditions", href: "#/terms-conditions", route: "terms-conditions" }
];

export const blogMenuItems = [
  { key: "blogs", label: "Blogs Page", href: "#/blogs", route: "blogs" },
  { key: "article", label: "Article Page", href: "#/article", route: "article" }
];

export const staticPages = {
  "about-us": {
    eyebrow: "Brand Story",
    title: "Designed for wardrobes that move with real life.",
    intro:
      "VOGUE curates elevated everyday fashion with an editorial point of view, focusing on modern silhouettes, wearable luxury, and practical styling.",
    sections: [
      {
        heading: "What we build",
        body:
          "Our collections combine statement pieces, refined essentials, and occasion-led edits so customers can move from casual daytime looks to evening dressing without friction."
      },
      {
        heading: "How we choose",
        body:
          "We prioritize versatile cuts, tactile fabrics, and color stories that can be styled across seasons. Each category is shaped to feel current without becoming disposable."
      },
      {
        heading: "What matters",
        body:
          "Clarity in fit, reliable shipping, and a polished digital experience matter as much as the clothing itself. The store is built to reduce guesswork and support confident purchases."
      }
    ]
  },
  "contact-us": {
    eyebrow: "Contact",
    title: "Reach the team behind your order.",
    intro:
      "For order help, delivery questions, sizing support, or partnership requests, use the channels below and include your order ID when relevant.",
    sections: [
      {
        heading: "Customer support",
        body:
          "Email support@vogue-demo.com for account, product, and delivery help. Standard response time is within one business day."
      },
      {
        heading: "Phone",
        body:
          "Call +1 (800) 555-1234 Monday to Saturday, 9:00 AM to 6:00 PM for urgent order questions."
      },
      {
        heading: "Studio address",
        body:
          "VOGUE Client Studio, 228 Mercer Street, New York, NY 10012. Visits are by appointment only."
      }
    ]
  },
  faqs: {
    eyebrow: "Support",
    title: "Frequently asked questions.",
    intro:
      "A short operating guide for orders, payments, returns, and product availability.",
    sections: [
      {
        heading: "Order tracking",
        body:
          "Use the Track Order page with your order number and email address to view current fulfillment and shipment updates."
      },
      {
        heading: "Returns",
        body:
          "Unused items can be returned within 14 days of delivery. Final-sale and personalized items may be excluded."
      },
      {
        heading: "Payments",
        body:
          "Major cards and supported checkout methods are processed securely at checkout. Pricing is shown in the currency selected in the header."
      }
    ]
  },
  "privacy-policy": {
    eyebrow: "Policy",
    title: "How customer data is handled.",
    intro:
      "We collect only the information required to process orders, improve the store experience, and provide support when requested.",
    sections: [
      {
        heading: "Information collected",
        body:
          "Typical data includes name, email, shipping address, order details, and device-level browsing signals needed for store performance and analytics."
      },
      {
        heading: "How it is used",
        body:
          "We use your information to fulfill purchases, send transactional updates, personalize storefront content, and respond to support requests."
      },
      {
        heading: "Your control",
        body:
          "You can request account updates, marketing preference changes, or data-related support by contacting the customer support team."
      }
    ]
  },
  "shipping-delivery": {
    eyebrow: "Delivery",
    title: "Shipping options and fulfillment timing.",
    intro:
      "Processing and transit times vary by item availability, destination, and service level selected at checkout.",
    sections: [
      {
        heading: "Processing",
        body:
          "Most in-stock orders are prepared within 1 to 2 business days. High-demand periods can extend handling times slightly."
      },
      {
        heading: "Transit windows",
        body:
          "Domestic delivery typically arrives within 3 to 7 business days after dispatch. Expedited options may be available at checkout."
      },
      {
        heading: "Order updates",
        body:
          "Shipment confirmation emails include tracking details as soon as the carrier scans your parcel into the network."
      }
    ]
  },
  "terms-conditions": {
    eyebrow: "Legal",
    title: "Store terms and purchase conditions.",
    intro:
      "Using this storefront or placing an order means you agree to the operating terms covering payments, fulfillment, returns, and account use.",
    sections: [
      {
        heading: "Orders and pricing",
        body:
          "Orders are subject to availability and payment verification. Pricing, promotions, and stock levels can change without prior notice."
      },
      {
        heading: "Customer responsibilities",
        body:
          "Customers are expected to provide accurate shipping, billing, and contact information to avoid delays or failed delivery attempts."
      },
      {
        heading: "Store rights",
        body:
          "The store may cancel or limit orders affected by fraud signals, pricing errors, or restricted inventory conditions."
      }
    ]
  },
  blogs: {
    eyebrow: "Editorial",
    title: "Style notes, campaign stories, and seasonal edits.",
    intro:
      "Browse curated reads that translate runway energy into practical wardrobe decisions.",
    cards: [
      {
        title: "The modern neutral wardrobe",
        meta: "Styling Guide",
        body: "A grounded palette built around sand, espresso, and soft black for daily rotation."
      },
      {
        title: "Occasion dressing without overthinking it",
        meta: "Event Edit",
        body: "How to build one elegant look and restyle it for dinner, parties, and formal events."
      },
      {
        title: "Why texture matters more than trend",
        meta: "Material Focus",
        body: "The fastest way to make simple silhouettes feel expensive is choosing better surfaces."
      }
    ]
  },
  article: {
    eyebrow: "Feature Article",
    title: "Five ways to sharpen a capsule wardrobe this season.",
    intro:
      "Capsule dressing does not mean dressing flat. It means controlling proportion, texture, and repeatability with more discipline.",
    sections: [
      {
        heading: "Start with proportion",
        body:
          "Balance one structured piece against one relaxed piece so core outfits feel deliberate rather than purely basic."
      },
      {
        heading: "Repeat a material family",
        body:
          "Leather, brushed cotton, soft tailoring, and crisp poplin can connect multiple outfits faster than color alone."
      },
      {
        heading: "Use accessories to change tempo",
        body:
          "A belt, sculptural bag, or pointed shoe can shift the same clothing from daytime utility to evening polish."
      }
    ]
  }
};

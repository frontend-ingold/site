import { useEffect, useMemo, useRef, useState } from "react";
import { EditorialBanner } from "./EditorialBanner";
import { LoadingScreen } from "./LoadingScreen";
import { NewArrivalShowcase } from "./NewArrivalShowcase";
import { Newsletter } from "./Newsletter";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useWishlist } from "../context/WishlistContext";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://clothsapi.vercel.app");

function getDisplayImage(url) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("pexels.com")) {
      parsedUrl.searchParams.set("auto", "compress");
      parsedUrl.searchParams.set("cs", "tinysrgb");
      parsedUrl.searchParams.set("w", "1800");
      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
}

function getColorLabel(product) {
  return String(product.optionLabel ?? "").trim().toLowerCase() === "color:"
    ? product.optionValue
    : product.optionValue;
}

function renderStars(rating) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

function formatReviewDate(value) {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "";
  }
}

export function CollectionProductDetailPage({ data, homepageContent, isLoading = false }) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { hasItem, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeAttributeIndex, setActiveAttributeIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [isSizingGuideOpen, setIsSizingGuideOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [reviewSummary, setReviewSummary] = useState(data.reviewSummary ?? { averageRating: 0, reviewCount: 0 });
  const [reviews, setReviews] = useState(data.reviews ?? []);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    content: "",
    displayName: "",
    email: ""
  });
  const reviewSectionRef = useRef(null);

  const product = data.product;
  const collection = data.collection;
  const relatedProducts = data.relatedProducts ?? [];
  const recentProducts = data.recentProducts ?? [];
  const newArrivalShowcase = homepageContent?.newArrivalShowcase ?? {
    feature: {
      title: "",
      description: "",
      buttonLabel: "SHOP NOW",
      image: ""
    },
    tabs: [],
    title: "Fashion That Reflects Who You Are",
    description: "",
    sideImage: "",
    products: []
  };
  const editorialBanner = homepageContent?.editorialBanner ?? {
    title: "The World is Your Fashion Oyster",
    description: "",
    backgroundImage: "",
    products: []
  };

  useEffect(() => {
    setReviews(data.reviews ?? []);
    setReviewSummary(data.reviewSummary ?? { averageRating: 0, reviewCount: 0 });
  }, [data.reviews, data.reviewSummary, product?.id]);

  const attributeImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.attributeImages?.length
      ? product.attributeImages
      : [
          {
            value: product.optionValue,
            image: product.image,
            images: product.galleryImages?.length ? product.galleryImages : [product.image]
          }
        ];
  }, [product]);

  const activeAttribute = attributeImages[activeAttributeIndex] ?? attributeImages[0] ?? null;
  const galleryImages = activeAttribute?.images?.length
    ? activeAttribute.images
    : product?.galleryImages?.length
      ? product.galleryImages
      : product?.image
        ? [product.image]
        : [];
  const wishlistKey = product && collection ? `${collection.slug}::${product.id}` : "";
  const isWishlisted = wishlistKey ? hasItem(wishlistKey) : false;

  useEffect(() => {
    setQuantity(1);
    setActiveAttributeIndex(0);
    setActiveImageIndex(0);
    setIsZoomActive(false);
    setIsSizingGuideOpen(false);
    setIsReviewFormOpen(false);
    setReviewMessage("");
    setIsSubmittingReview(false);
    setReviewForm({
      rating: 0,
      title: "",
      content: "",
      displayName: "",
      email: ""
    });
    setZoomOrigin("50% 50%");
  }, [product?.id]);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsZoomActive(false);
    setZoomOrigin("50% 50%");
  }, [activeAttributeIndex]);

  useEffect(() => {
    if (!shareMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShareMessage("");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [shareMessage]);

  useEffect(() => {
    if (!reviewMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setReviewMessage("");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [reviewMessage]);

  if (!product || !collection || isLoading) {
    return (
      <main className="product-detail-page">
        <section className="product-detail-page__hero">
          <div className="container">
            <LoadingScreen label="Loading product" />
          </div>
        </section>
      </main>
    );
  }

  async function handleShare() {
    const shareUrl = window.location.href;
    const sharePayload = {
      title: product.name,
      text: `${product.brand} ${product.name}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Link copied");
        return;
      }

      setShareMessage("Share unavailable");
    } catch (error) {
      if (error?.name !== "AbortError") {
        setShareMessage("Share unavailable");
      }
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!reviewForm.rating || !reviewForm.title.trim() || !reviewForm.content.trim() || !reviewForm.displayName.trim() || !reviewForm.email.trim()) {
      setReviewMessage("Please complete all required review fields.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/collections/${collection.slug}/products/${product.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewForm)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed with status ${response.status}`);
      }

      setReviews((current) => [result.review, ...current]);
      setReviewSummary(result.reviewSummary ?? reviewSummary);
      setReviewForm({
        rating: 0,
        title: "",
        content: "",
        displayName: "",
        email: ""
      });
      setIsReviewFormOpen(false);
      setReviewMessage("Review submitted successfully.");
      scrollToReviewSection();
    } catch (error) {
      setReviewMessage(error.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  function openReviewForm() {
    setIsReviewFormOpen(true);
    window.requestAnimationFrame(() => {
      reviewSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  function scrollToReviewSection() {
    reviewSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  return (
    <main className="product-detail-page">
      <section className="product-detail-page__hero">
        <div className="container product-detail-page__hero-grid">
          <div className="product-detail-page__summary">
            <button
              type="button"
              className="product-detail-page__back"
              onClick={() => {
                window.location.hash = `/collections/${collection.slug}`;
              }}
            >
              <span>&larr;</span>
              Back to {collection.title}
            </button>

            <h2>{product.name}</h2>
            <p className="product-detail-page__category">{product.category}</p>

            <div className="product-detail-page__selector">
              <span>{String(product.optionLabel || "Option").replace(":", "")}:</span>
              <strong>{activeAttribute?.value || getColorLabel(product)}</strong>
            </div>

            <div className="product-detail-page__swatches">
              {attributeImages.map((item, index) => (
                <button
                  type="button"
                  key={`${product.id}-${item.value}-${index}`}
                  className={`product-detail-page__swatch ${index === activeAttributeIndex ? "is-active" : ""}`}
                  onClick={() => {
                    setActiveAttributeIndex(index);
                  }}
                  title={item.value}
                >
                  <img src={getDisplayImage(item.image)} alt={`${product.name} ${item.value}`} />
                </button>
              ))}
            </div>

            <div className="product-detail-page__quantity">
              <span>Quantity</span>
              <div>
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  -
                </button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="product-detail-page__price">
              <strong>{formatPrice(product.price)}</strong>
              {product.oldPrice ? <span>{formatPrice(product.oldPrice)}</span> : null}
            </div>

            <div className="product-detail-page__actions">
              <button
                type="button"
                className={`product-detail-page__button ${product.inStock ? "" : "is-sold-out"}`}
                onClick={() => {
                  if (!product.inStock) {
                    return;
                  }

                  addItem({
                    id: product.id,
                    productId: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: galleryImages[activeImageIndex] || product.image,
                    optionLabel: product.optionLabel,
                    optionValue: activeAttribute?.value || product.optionValue,
                    quantity
                  });
                }}
              >
                {product.inStock ? "ADD TO CART" : "SOLD OUT"}
                <span>&raquo;</span>
              </button>
              <button
                type="button"
                className="product-detail-page__button product-detail-page__button--buy"
                onClick={() => {
                  if (!product.inStock) {
                    return;
                  }

                  addItem({
                    id: product.id,
                    productId: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: galleryImages[activeImageIndex] || product.image,
                    optionLabel: product.optionLabel,
                    optionValue: activeAttribute?.value || product.optionValue,
                    quantity
                  });
                }}
              >
                BUY IT NOW
              </button>
            </div>
          </div>

          <div className="product-detail-page__media-panel">
            <div
              className={`product-detail-page__media ${isZoomActive ? "is-zoom-active" : ""}`}
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - bounds.left) / bounds.width) * 100;
                const y = ((event.clientY - bounds.top) / bounds.height) * 100;
                setIsZoomActive(true);
                setZoomOrigin(`${x}% ${y}%`);
              }}
              onMouseEnter={() => {
                setIsZoomActive(true);
              }}
              onMouseLeave={() => {
                setIsZoomActive(false);
                setZoomOrigin("50% 50%");
              }}
            >
              <div
                className="product-detail-page__media-track"
                style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
              >
                {galleryImages.map((image, index) => (
                  <div className="product-detail-page__media-slide" key={`${product.id}-${index}`}>
                    <img
                      src={getDisplayImage(image)}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              {galleryImages[activeImageIndex] ? (
                <div
                  className="product-detail-page__zoom-layer"
                  style={{
                    backgroundImage: `url(${getDisplayImage(galleryImages[activeImageIndex])})`,
                    backgroundPosition: zoomOrigin
                  }}
                />
              ) : null}
            </div>

            <div className="product-detail-page__thumbs">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={`${product.id}-thumb-${index}`}
                  className={`product-detail-page__thumb ${index === activeImageIndex ? "is-active" : ""}`}
                  onClick={() => {
                    setActiveImageIndex(index);
                  }}
                >
                  <img src={getDisplayImage(image)} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <aside className="product-detail-page__meta">
            <div className="product-detail-page__meta-top">
              <button
                type="button"
                className={`product-detail-page__link ${isWishlisted ? "is-active" : ""}`}
                onClick={() => {
                  toggleItem({
                    key: wishlistKey,
                    id: product.id,
                    productId: product.id,
                    collectionSlug: collection.slug,
                    href: `#/collections/${collection.slug}/products/${product.id}`,
                    name: product.name,
                    brand: product.brand,
                    category: product.category,
                    price: product.price,
                    oldPrice: product.oldPrice,
                    image: galleryImages[activeImageIndex] || product.image,
                    optionLabel: product.optionLabel,
                    optionValue: activeAttribute?.value || product.optionValue
                  });
                }}
              >
                <span>&hearts;</span>
                {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
              <button
                type="button"
                className="product-detail-page__link product-detail-page__link--secondary"
                onClick={openReviewForm}
              >
                <span>&#9998;</span>
                Write a Review
              </button>
            </div>
            <p className="product-detail-page__rating">{renderStars(reviewSummary.averageRating)}</p>
            <p className="product-detail-page__brand">{product.brand}</p>
            <p className="product-detail-page__sku">SKU: {product.sku}</p>
            <p className="product-detail-page__product-category">Category: {product.category}</p>
            <p className="product-detail-page__stock">
              {product.inStock ? "In stock" : "Out of stock"}
            </p>
            <p className="product-detail-page__description">{product.description}</p>
            <div className="product-detail-page__meta-links">
              <button type="button" onClick={() => setIsSizingGuideOpen(true)}>
                <span aria-hidden="true">&#9986;</span>
                See Sizing Guide
              </button>
              <button type="button" onClick={handleShare}>
                <span aria-hidden="true">&#x2934;</span>
                Share
              </button>
            </div>
            {shareMessage ? <p className="product-detail-page__share-message">{shareMessage}</p> : null}
          </aside>
        </div>
      </section>

      <section className="product-detail-page__recent">
        <div className="container">
          <h2>Recently Viewed Products</h2>
          <div className="product-detail-page__recent-grid">
            {recentProducts.map((item) => (
              <article
                className="product-detail-page__recent-card"
                key={item.id}
                onClick={() => {
                  window.location.hash = `/collections/${collection.slug}/products/${item.id}`;
                }}
              >
                <div className="product-detail-page__recent-media">
                  <img src={getDisplayImage(item.image)} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <div className="product-detail-page__recent-price">
                  <strong>{formatPrice(item.price)}</strong>
                  {item.oldPrice ? <span>{formatPrice(item.oldPrice)}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail-page__reviews" ref={reviewSectionRef}>
        <div className="container">
          <h2>Customer Reviews</h2>
          <div className="product-detail-page__reviews-card">
            <div className="product-detail-page__reviews-copy">
              <p className="product-detail-page__reviews-stars">
                {reviewSummary.reviewCount ? renderStars(reviewSummary.averageRating) : "☆☆☆☆☆"}
              </p>
              <p>
                {reviewSummary.reviewCount
                  ? `${reviewSummary.averageRating} out of 5 from ${reviewSummary.reviewCount} review${reviewSummary.reviewCount === 1 ? "" : "s"}`
                  : "Be the first to write a review"}
              </p>
            </div>
            <div className="product-detail-page__reviews-divider" aria-hidden="true" />
            <button type="button" className="product-detail-page__reviews-button" onClick={openReviewForm}>
              Write a review
            </button>
          </div>

          {isReviewFormOpen ? (
            <form className="product-detail-page__review-form" onSubmit={handleReviewSubmit}>
              <h3>Write a review</h3>

              <label className="product-detail-page__review-field">
                <span>Rating</span>
                <div className="product-detail-page__review-picker">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={`product-detail-page__review-star-button ${value <= reviewForm.rating ? "is-active" : ""}`}
                      onClick={() => {
                        setReviewForm((current) => ({
                          ...current,
                          rating: value
                        }));
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </label>

              <label className="product-detail-page__review-field">
                <span>Review Title (100)</span>
                <input
                  type="text"
                  placeholder="Give your review a title"
                  value={reviewForm.title}
                  onChange={(event) => {
                    setReviewForm((current) => ({
                      ...current,
                      title: event.target.value
                    }));
                  }}
                />
              </label>

              <label className="product-detail-page__review-field">
                <span>Review content</span>
                <textarea
                  rows="5"
                  placeholder="Start writing here..."
                  value={reviewForm.content}
                  onChange={(event) => {
                    setReviewForm((current) => ({
                      ...current,
                      content: event.target.value
                    }));
                  }}
                />
              </label>

              <div className="product-detail-page__review-field">
                <span>Picture/Video (optional)</span>
                <button type="button" className="product-detail-page__review-upload">
                  <span>&uarr;</span>
                </button>
              </div>

              <label className="product-detail-page__review-field">
                <span>Display name (displayed publicly like John Smith)</span>
                <input
                  type="text"
                  placeholder="Display name"
                  value={reviewForm.displayName}
                  onChange={(event) => {
                    setReviewForm((current) => ({
                      ...current,
                      displayName: event.target.value
                    }));
                  }}
                />
              </label>

              <label className="product-detail-page__review-field">
                <span>Email address</span>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={reviewForm.email}
                  onChange={(event) => {
                    setReviewForm((current) => ({
                      ...current,
                      email: event.target.value
                    }));
                  }}
                />
              </label>

              <p className="product-detail-page__review-help">
                How we use your data: We'll only contact you about the review you left, and only if necessary. By
                submitting your review, you agree to Judge.me's terms, privacy and content policies.
              </p>

              <div className="product-detail-page__review-actions">
                <button
                  type="button"
                  className="product-detail-page__review-cancel"
                  onClick={() => {
                    setIsReviewFormOpen(false);
                    scrollToReviewSection();
                  }}
                >
                  Cancel review
                </button>
                <button type="submit" className="product-detail-page__review-submit" disabled={isSubmittingReview}>
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          ) : null}

          {reviewMessage ? <p className="product-detail-page__review-message">{reviewMessage}</p> : null}

          {reviews.length > 0 ? (
            <div className="product-detail-page__review-list">
              {reviews.map((item) => (
                <article className="product-detail-page__review-item" key={item.id}>
                  <div className="product-detail-page__review-item-head">
                    <div>
                      <p className="product-detail-page__review-item-stars">{renderStars(item.rating)}</p>
                      <h3>{item.title}</h3>
                    </div>
                    <div className="product-detail-page__review-item-meta">
                      <strong>{item.displayName}</strong>
                      <span>{formatReviewDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <p>{item.content}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <NewArrivalShowcase content={newArrivalShowcase} />
      <EditorialBanner content={editorialBanner} />
      <Newsletter />

      {isSizingGuideOpen ? (
        <div
          className="product-detail-page__modal-backdrop"
          onClick={() => {
            setIsSizingGuideOpen(false);
          }}
        >
          <div
            className="product-detail-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sizing-guide-title"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="product-detail-page__modal-head">
              <h3 id="sizing-guide-title">Sizing Guide</h3>
              <button
                type="button"
                className="product-detail-page__modal-close"
                onClick={() => {
                  setIsSizingGuideOpen(false);
                }}
                aria-label="Close sizing guide"
              >
                &times;
              </button>
            </div>
            <p className="product-detail-page__modal-copy">
              Use this guide as a quick fit reference for {product.category.toLowerCase()} styles.
            </p>
            <div className="product-detail-page__modal-table">
              <div>
                <strong>Size</strong>
                <strong>Bust</strong>
                <strong>Waist</strong>
                <strong>Hip</strong>
              </div>
              <div>
                <span>XS</span>
                <span>32-33 in</span>
                <span>24-25 in</span>
                <span>34-35 in</span>
              </div>
              <div>
                <span>S</span>
                <span>34-35 in</span>
                <span>26-27 in</span>
                <span>36-37 in</span>
              </div>
              <div>
                <span>M</span>
                <span>36-37 in</span>
                <span>28-29 in</span>
                <span>38-39 in</span>
              </div>
              <div>
                <span>L</span>
                <span>38-40 in</span>
                <span>30-32 in</span>
                <span>40-42 in</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

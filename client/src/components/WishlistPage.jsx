import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";

export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <main className="account-page wishlist-page">
      <section className="container account-page__hero">
        <p className="account-page__eyebrow">{t("wishlist.eyebrow")}</p>
        <h1>{t("wishlist.title")}</h1>
        <p>{t("wishlist.description")}</p>
      </section>

      <section className="container account-page__section">
        {items.length ? (
          <>
            <div className="account-page__toolbar">
              <p>{t("wishlist.savedItems", { count: items.length, label: items.length === 1 ? t("common.item") : t("common.items") })}</p>
              <button type="button" onClick={clearWishlist}>{t("wishlist.clearAll")}</button>
            </div>

            <div className="wishlist-grid">
              {items.map((item) => (
                <article className="wishlist-card" key={item.key}>
                  <button
                    type="button"
                    className="wishlist-card__remove"
                    aria-label={t("wishlist.removeItem", { name: item.name })}
                    onClick={() => removeItem(item.key)}
                  >
                    ×
                  </button>

                  <button
                    type="button"
                    className="wishlist-card__media"
                    onClick={() => {
                      window.location.hash = item.href.replace(/^#/, "");
                    }}
                  >
                    <img src={item.image} alt={item.name} />
                  </button>

                  <p className="wishlist-card__brand">{item.brand}</p>
                  <h2>{item.name}</h2>
                  <p className="wishlist-card__meta">{item.category}</p>

                  <div className="wishlist-card__price">
                    <strong>{formatPrice(item.price)}</strong>
                    {item.oldPrice ? <span>{formatPrice(item.oldPrice)}</span> : null}
                  </div>

                  <div className="wishlist-card__actions">
                    <button
                      type="button"
                      className="wishlist-card__button wishlist-card__button--ghost"
                      onClick={() => {
                        window.location.hash = item.href.replace(/^#/, "");
                      }}
                    >
                      {t("common.viewItem")}
                    </button>
                    <button
                      type="button"
                      className="wishlist-card__button"
                      onClick={() => {
                        addItem({
                          id: item.id,
                          productId: item.productId,
                          name: item.name,
                          category: item.category,
                          price: item.price,
                          image: item.image,
                          optionLabel: item.optionLabel,
                          optionValue: item.optionValue || "",
                          quantity: 1
                        });
                      }}
                    >
                      {t("common.addToCart")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="account-empty-state">
            <h2>{t("wishlist.emptyTitle")}</h2>
            <p>{t("wishlist.emptyDescription")}</p>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "/collections";
              }}
            >
              {t("wishlist.exploreCollections")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

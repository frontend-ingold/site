import { useMemo } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { useOrders } from "../context/OrdersContext";
import { useLanguage } from "../context/LanguageContext";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function MyOrdersPage() {
  const { orders } = useOrders();
  const { formatStoredAmount } = useCurrency();
  const { t } = useLanguage();

  const stats = useMemo(() => {
    return {
      totalOrders: orders.length,
      totalItems: orders.reduce((sum, order) => sum + Number(order.itemCount || 0), 0)
    };
  }, [orders]);

  return (
    <main className="account-page orders-page">
      <section className="container account-page__hero">
        <p className="account-page__eyebrow">{t("orders.eyebrow")}</p>
        <h1>{t("orders.title")}</h1>
        <p>{t("orders.description")}</p>
      </section>

      <section className="container account-page__section">
        {orders.length ? (
          <>
            <div className="account-page__stats">
              <div>
                <span>{t("orders.totalOrders")}</span>
                <strong>{stats.totalOrders}</strong>
              </div>
              <div>
                <span>{t("orders.itemsOrdered")}</span>
                <strong>{stats.totalItems}</strong>
              </div>
            </div>

            <div className="orders-list">
              {orders.map((order) => (
                <article className="orders-card" key={order.orderNumber}>
                  <div className="orders-card__head">
                    <div>
                      <p>{formatDate(order.createdAt)}</p>
                      <h2>{order.orderNumber}</h2>
                    </div>
                    <span className={`orders-card__status orders-card__status--${String(order.status).toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="orders-card__meta">
                    <div>
                      <span>{t("common.total")}</span>
                      <strong>{formatStoredAmount(order.total, order.currencyCode)}</strong>
                    </div>
                    <div>
                      <span>{t("orders.tracking")}</span>
                      <strong>{order.trackingNumber || "Pending"}</strong>
                    </div>
                    <div>
                      <span>{t("orders.delivery")}</span>
                      <strong>{formatDate(order.estimatedDelivery)}</strong>
                    </div>
                  </div>

                  <div className="orders-card__items">
                    {order.items.slice(0, 3).map((item) => (
                      <div className="orders-card__item" key={`${order.orderNumber}-${item.id}`}>
                        <img src={item.image} alt={item.name} />
                        <div>
                          <p>{item.name}</p>
                          <span>
                            {item.quantity} × {formatStoredAmount(item.price, order.currencyCode)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="orders-card__actions">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.hash = `/track-order/${order.orderNumber}`;
                      }}
                    >
                      {t("common.trackOrder")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="account-empty-state">
            <h2>{t("orders.noOrdersTitle")}</h2>
            <p>{t("orders.noOrdersDescription")}</p>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "/collections";
              }}
            >
              {t("orders.startShopping")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

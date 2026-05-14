import { useEffect, useState } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { useOrders } from "../context/OrdersContext";
import { LoadingScreen } from "./LoadingScreen";

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

export function OrderSuccessPage({ apiBaseUrl, hashPath }) {
  const orderNumber = hashPath.replace(/^order-success\//, "");
  const { getOrder, upsertOrder } = useOrders();
  const { formatStoredAmount } = useCurrency();
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const storedOrder = getOrder(orderNumber);

    if (storedOrder) {
      setOrder(storedOrder);
    }

    async function loadOrder() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/orders/${orderNumber}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load order.");
        }

        if (isMounted) {
          setOrder(data.order);
          upsertOrder(data.order);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load order.");
        }
      }
    }

    if (orderNumber) {
      loadOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, getOrder, orderNumber, upsertOrder]);

  if (!order && !errorMessage) {
    return <LoadingScreen label="Loading order confirmation" />;
  }

  if (errorMessage) {
    return (
      <main className="order-success-page">
        <div className="container order-success-page__error">
          <h1>Order not found</h1>
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              window.location.hash = "/track-order";
            }}
          >
            Track order
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="order-success-page">
      <section className="container order-success-page__hero">
        <div className="order-success-page__card">
          <span className="order-success-page__badge">Order placed</span>
          <h1>Your order is confirmed.</h1>
          <p>
            Order <strong>{order.orderNumber}</strong> is now in our system. Track it any time with tracking number{" "}
            <strong>{order.trackingNumber}</strong>.
          </p>

          <div className="order-success-page__stats">
            <div>
              <span>Total</span>
              <strong>{formatStoredAmount(order.total, order.currencyCode)}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{order.status}</strong>
            </div>
            <div>
              <span>Estimated delivery</span>
              <strong>{formatDate(order.estimatedDelivery)}</strong>
            </div>
          </div>

          <div className="order-success-page__actions">
            <button
              type="button"
              className="is-primary"
              onClick={() => {
                window.location.hash = `/track-order/${order.orderNumber}`;
              }}
            >
              Track order
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "/";
              }}
            >
              Continue shopping
            </button>
          </div>
        </div>
      </section>

      <section className="container order-success-page__content">
        <div className="order-success-page__timeline">
          {order.steps.map((step) => (
            <div className={`order-step order-step--${step.status}`} key={step.label}>
              <span className="order-step__dot" />
              <p>{step.label}</p>
            </div>
          ))}
        </div>

        <div className="order-success-page__summary">
          <h2>Order summary</h2>
          <div className="order-success-page__items">
            {order.items.map((item) => (
              <article className="order-success-item" key={`${order.orderNumber}-${item.id}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.optionLabel} {item.optionValue}
                  </p>
                </div>
                <strong>
                  {item.quantity} × {formatStoredAmount(item.price, order.currencyCode)}
                </strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

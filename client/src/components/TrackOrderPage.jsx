import { useEffect, useState } from "react";

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

export function TrackOrderPage({ apiBaseUrl, hashPath }) {
  const initialOrderNumber = hashPath.startsWith("track-order/") ? hashPath.replace(/^track-order\//, "") : "";
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber);
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(initialOrderNumber));

  useEffect(() => {
    setOrderNumberInput(initialOrderNumber);
  }, [initialOrderNumber]);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!initialOrderNumber) {
        setOrder(null);
        setErrorMessage("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`${apiBaseUrl}/api/orders/${initialOrderNumber}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Order not found.");
        }

        if (isMounted) {
          setOrder(data.order);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setOrder(null);
          setErrorMessage(error.message || "Order not found.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, initialOrderNumber]);

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedValue = orderNumberInput.trim().toUpperCase();

    if (!normalizedValue) {
      setErrorMessage("Please enter an order number.");
      return;
    }

    window.location.hash = `/track-order/${normalizedValue}`;
  }

  return (
    <main className="track-order-page">
      <section className="container track-order-page__hero">
        <div className="track-order-page__search-card">
          <h1>Track your order</h1>
          <p>Enter your order number to see live status, items, and estimated delivery date.</p>

          <form className="track-order-page__form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Order number"
              value={orderNumberInput}
              onChange={(event) => setOrderNumberInput(event.target.value)}
            />
            <button type="submit">Track</button>
          </form>
          {errorMessage ? <p className="track-order-page__message is-error">{errorMessage}</p> : null}
        </div>
      </section>

      {isLoading ? (
        <section className="container track-order-page__loading">
          <p>Loading order...</p>
        </section>
      ) : order ? (
        <section className="container track-order-page__content">
          <div className="track-order-page__overview">
            <div>
              <span>Order number</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div>
              <span>Tracking number</span>
              <strong>{order.trackingNumber}</strong>
            </div>
            <div>
              <span>Estimated delivery</span>
              <strong>{formatDate(order.estimatedDelivery)}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{order.status}</strong>
            </div>
          </div>

          <div className="track-order-page__timeline">
            {order.steps.map((step) => (
              <div className={`order-step order-step--${step.status}`} key={step.label}>
                <span className="order-step__dot" />
                <p>{step.label}</p>
              </div>
            ))}
          </div>

          <div className="track-order-page__items">
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
                  {item.quantity} × ${item.price}
                </strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

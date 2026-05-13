import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    appliedCoupon,
    amountToFreeShipping,
    freeShippingProgress,
    changeQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCart();
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code ?? "");
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    setCouponInput(appliedCoupon?.code ?? "");
  }, [appliedCoupon]);

  function handleApplyCoupon(event) {
    event.preventDefault();
    const result = applyCoupon(couponInput);
    setCouponMessage(result.message);
    if (!result.ok) {
      return;
    }
  }

  return (
    <main className="cart-page">
      <section className="cart-page__hero">
        <div className="container">
          <h1>View Cart</h1>
          <p>{itemCount} item{itemCount === 1 ? "" : "s"} in your shopping bag.</p>
        </div>
      </section>

      <section className="cart-page__content">
        <div className="container cart-page__layout">
          <div className="cart-page__items">
            <div className="cart-page__shipping">
              <div className="cart-page__shipping-copy">
                <strong>
                  {amountToFreeShipping > 0
                    ? `You're $${amountToFreeShipping.toFixed(2)} away from FREE shipping.`
                    : "You unlocked FREE shipping."}
                </strong>
                <div className="cart-page__shipping-bar">
                  <span style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>
              <div className="cart-page__shipping-icon">&#128666;</div>
            </div>

            {items.length === 0 ? (
              <div className="cart-page__empty">
                <div className="cart-page__empty-icon">&#8962;</div>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <article className="cart-page__item" key={item.key}>
                  <div className="cart-page__item-media">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-page__item-copy">
                    <h2>{item.name}</h2>
                    <p>{item.optionLabel} {item.optionValue}</p>
                    <div className="cart-page__item-controls">
                      <div className="cart-page__qty">
                        <button type="button" onClick={() => changeQuantity(item.key, -1)}>-</button>
                        <strong>{item.quantity}</strong>
                        <button type="button" onClick={() => changeQuantity(item.key, 1)}>+</button>
                      </div>
                      <strong>{item.price}</strong>
                    </div>
                  </div>
                  <button type="button" className="cart-page__remove" onClick={() => removeItem(item.key)}>
                    &#128465;
                  </button>
                </article>
              ))
            )}
          </div>

          <aside className="cart-page__summary">
            <div className="cart-page__feature-grid">
              <div className="cart-page__feature-card">
                <span>&#127991;</span>
                <strong>Coupon</strong>
              </div>
              <div className="cart-page__feature-card">
                <span>&#127873;</span>
                <strong>Free Shipping</strong>
              </div>
            </div>

            <form className="cart-page__coupon" onSubmit={handleApplyCoupon}>
              <label htmlFor="cart-coupon">Coupon Section</label>
              {!appliedCoupon ? (
                <div className="cart-page__coupon-row">
                  <input
                    id="cart-coupon"
                    type="text"
                    value={couponInput}
                    placeholder="Use SAVE10 or VOGUE50"
                    onChange={(event) => setCouponInput(event.target.value)}
                  />
                  <button type="submit">Apply</button>
                </div>
              ) : (
                <button
                  type="button"
                  className="cart-page__coupon-remove"
                  onClick={() => {
                    removeCoupon();
                    setCouponInput("");
                    setCouponMessage("Coupon removed.");
                  }}
                >
                  Remove {appliedCoupon.code}
                </button>
              )}
              {couponMessage ? <p className="cart-page__coupon-message">{couponMessage}</p> : null}
            </form>

            <div className="cart-page__totals">
              <div>
                <span>Total Item</span>
                <strong>{itemCount}</strong>
              </div>
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong>{discount > 0 ? `-$${discount.toFixed(2)}` : "$0.00"}</strong>
              </div>
              <div className="cart-page__total-row">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="cart-page__actions">
              <button type="button" onClick={() => { window.location.hash = "/"; }}>
                Continue Shopping
              </button>
              <button
                type="button"
                className="is-primary"
                onClick={() => {
                  window.location.hash = "/checkout";
                }}
              >
                Proceed to checkout
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

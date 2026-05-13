import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export function CartDrawer() {
  const {
    items,
    isOpen,
    itemCount,
    subtotal,
    discount,
    total,
    appliedCoupon,
    amountToFreeShipping,
    freeShippingProgress,
    closeCart,
    removeItem,
    changeQuantity,
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
  }

  return (
    <>
      <div
        className={`cart-drawer__backdrop ${isOpen ? "is-open" : ""}`}
        onClick={closeCart}
        aria-hidden={isOpen ? "false" : "true"}
      />
      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={isOpen ? "false" : "true"}>
        <div className="cart-drawer__head">
          <div>
            <p className="cart-drawer__eyebrow">My Cart</p>
            <h2>{itemCount} item{itemCount === 1 ? "" : "s"}</h2>
          </div>
          <button type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
            &times;
          </button>
        </div>

        <div className="cart-drawer__body">
          <div className="cart-drawer__shipping">
            <p>
              {amountToFreeShipping > 0
                ? `You're $${amountToFreeShipping.toFixed(2)} away from FREE shipping.`
                : "You unlocked FREE shipping."}
            </p>
            <div className="cart-drawer__shipping-bar">
              <span style={{ width: `${freeShippingProgress}%` }} />
            </div>
          </div>

          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">&#8962;</div>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <article className="cart-drawer__item" key={item.key}>
                <div className="cart-drawer__item-media">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-drawer__item-copy">
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                  <span>{item.optionLabel} {item.optionValue}</span>
                  <strong>{item.price}</strong>
                  <div className="cart-drawer__item-actions">
                    <div className="cart-drawer__qty">
                      <button type="button" onClick={() => changeQuantity(item.key, -1)}>-</button>
                      <strong>{item.quantity}</strong>
                      <button type="button" onClick={() => changeQuantity(item.key, 1)}>+</button>
                    </div>
                    <button type="button" className="cart-drawer__remove" onClick={() => removeItem(item.key)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}

          <div className="cart-drawer__feature-grid">
            <div className="cart-drawer__feature-card">
              <span>&#127991;</span>
              <strong>Coupon</strong>
            </div>
            <div className="cart-drawer__feature-card">
              <span>&#127873;</span>
              <strong>Free Shipping</strong>
            </div>
          </div>

          <form className="cart-drawer__coupon" onSubmit={handleApplyCoupon}>
            <label htmlFor="drawer-coupon">Coupon Section</label>
            {!appliedCoupon ? (
              <div className="cart-drawer__coupon-row">
                <input
                  id="drawer-coupon"
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
                className="cart-drawer__coupon-remove"
                onClick={() => {
                  removeCoupon();
                  setCouponInput("");
                  setCouponMessage("Coupon removed.");
                }}
              >
                Remove {appliedCoupon.code}
              </button>
            )}
            {couponMessage ? <p className="cart-drawer__coupon-message">{couponMessage}</p> : null}
          </form>
        </div>

        <div className="cart-drawer__foot">
          <div className="cart-drawer__summary-grid">
            <div className="cart-drawer__subtotal">
              <span>Total Item</span>
              <strong>{itemCount}</strong>
            </div>
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="cart-drawer__subtotal">
              <span>Discount</span>
              <strong>{discount > 0 ? `-$${discount.toFixed(2)}` : "$0.00"}</strong>
            </div>
            <div className="cart-drawer__subtotal cart-drawer__subtotal--total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
          <div className="cart-drawer__footer-actions">
            <button
              type="button"
              className="cart-drawer__view-cart"
              onClick={() => {
                closeCart();
                window.location.hash = "/cart";
              }}
            >
              View Cart
            </button>
            <button
              type="button"
              className="cart-drawer__checkout"
              onClick={() => {
                closeCart();
                window.location.hash = "/checkout";
              }}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

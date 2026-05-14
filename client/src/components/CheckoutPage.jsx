import { useEffect, useMemo, useState } from "react";
import { getStatesForCountry, supportedCountries } from "../data/regions";
import { useCart } from "../context/CartContext";
import { useAddressBook } from "../context/AddressContext";
import { useCurrency } from "../context/CurrencyContext";
import { useOrders } from "../context/OrdersContext";

const initialFormState = {
  contact: "",
  newsletter: false,
  country: "United States",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  saveInfo: true,
  paymentMethod: "card",
  cardNumber: "",
  expiryDate: "",
  securityCode: "",
  cardName: "",
  useShippingAsBilling: true,
  orderNote: ""
};

function parsePrice(value) {
  return Number(String(value ?? "0").replace(/[^0-9.]/g, "")) || 0;
}

export function CheckoutPage({ apiBaseUrl }) {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    changeQuantity,
    clearCart
  } = useCart();
  const { addresses, defaultAddress, saveAddress } = useAddressBook();
  const { upsertOrder } = useOrders();
  const { currency, convertAmount, formatAmount } = useCurrency();
  const [formState, setFormState] = useState(initialFormState);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code ?? "");
  const [couponMessage, setCouponMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const stateOptions = useMemo(() => getStatesForCountry(formState.country), [formState.country]);

  useEffect(() => {
    setCouponInput(appliedCoupon?.code ?? "");
  }, [appliedCoupon]);

  useEffect(() => {
    if (!defaultAddress) {
      return;
    }

    setSelectedAddressId(defaultAddress.id);
    setFormState((current) => ({
      ...current,
      contact: current.contact || defaultAddress.contact,
      country: defaultAddress.country || current.country,
      firstName: current.firstName || defaultAddress.firstName,
      lastName: current.lastName || defaultAddress.lastName,
      address: current.address || defaultAddress.address,
      apartment: current.apartment || defaultAddress.apartment,
      city: current.city || defaultAddress.city,
      state: current.state || defaultAddress.state,
      zipCode: current.zipCode || defaultAddress.zipCode
    }));
  }, [defaultAddress]);

  const shippingCost = useMemo(() => {
    if (!items.length) {
      return 0;
    }

    return subtotal >= 900 ? 0 : 15;
  }, [items.length, subtotal]);

  const grandTotal = total + shippingCost;

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateCountry(country) {
    const nextStates = getStatesForCountry(country);
    setFormState((current) => ({
      ...current,
      country,
      state: nextStates.includes(current.state) ? current.state : nextStates[0] ?? ""
    }));
  }

  function handleApplyCoupon(event) {
    event.preventDefault();
    const result = applyCoupon(couponInput);
    setCouponMessage(result.message);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!items.length) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (!formState.contact || !formState.address || !formState.city || !formState.state || !formState.zipCode) {
      setErrorMessage("Please complete the required contact and delivery fields.");
      return;
    }

    if (formState.paymentMethod === "card") {
      if (!formState.cardNumber || !formState.expiryDate || !formState.securityCode || !formState.cardName) {
        setErrorMessage("Please complete your card payment details.");
        return;
      }
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contact: formState.contact,
          newsletter: formState.newsletter,
          country: formState.country,
          firstName: formState.firstName,
          lastName: formState.lastName,
          address: formState.address,
          apartment: formState.apartment,
          city: formState.city,
          state: formState.state,
          zipCode: formState.zipCode,
          saveInfo: formState.saveInfo,
          note: formState.orderNote,
          paymentMethod: formState.paymentMethod,
          cardNumber: formState.cardNumber,
          currencyCode: currency,
          subtotal: convertAmount(subtotal).toFixed(2),
          discount: convertAmount(discount).toFixed(2),
          shipping: convertAmount(shippingCost).toFixed(2),
          total: convertAmount(grandTotal).toFixed(2),
          items: items.map((item) => ({
            ...item,
            price: convertAmount(parsePrice(item.price)).toFixed(2)
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order.");
      }

      if (formState.saveInfo) {
        saveAddress({
          id: selectedAddressId || undefined,
          label: defaultAddress?.label || "Home",
          firstName: formState.firstName,
          lastName: formState.lastName,
          contact: formState.contact,
          country: formState.country,
          address: formState.address,
          apartment: formState.apartment,
          city: formState.city,
          state: formState.state,
          zipCode: formState.zipCode,
          isDefault: true
        });
      }

      upsertOrder(data.order);
      clearCart();
      window.location.hash = `/order-success/${data.order.orderNumber}`;
    } catch (error) {
      setErrorMessage(error.message || "Failed to create order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="checkout-page">
      <div className="container checkout-page__layout">
        <section className="checkout-page__form-shell">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form__section">
              <div className="checkout-form__section-head">
                <h1>Contact</h1>
                <a
                  href="#/login"
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.hash = "/login";
                  }}
                >
                  Sign in
                </a>
              </div>

              <input
                type="text"
                placeholder="Email or mobile phone number"
                value={formState.contact}
                onChange={(event) => updateField("contact", event.target.value)}
              />

              <label className="checkout-form__checkbox">
                <input
                  type="checkbox"
                  checked={formState.newsletter}
                  onChange={(event) => updateField("newsletter", event.target.checked)}
                />
                <span>Email me with news and offers</span>
              </label>
            </div>

            <div className="checkout-form__section">
              <div className="checkout-form__section-head">
                <h2>Delivery</h2>
                {addresses.length ? (
                  <button
                    type="button"
                    className="checkout-form__address-link"
                    onClick={() => {
                      window.location.hash = "/my-address";
                    }}
                  >
                    Manage addresses
                  </button>
                ) : null}
              </div>

              {addresses.length ? (
                <div className="checkout-form__saved-addresses">
                  <label>
                    <span>Use saved address</span>
                    <select
                      value={selectedAddressId}
                      onChange={(event) => {
                        const nextAddress = addresses.find((item) => item.id === event.target.value);
                        setSelectedAddressId(event.target.value);
                        if (!nextAddress) {
                          return;
                        }

                        setFormState((current) => ({
                          ...current,
                          contact: nextAddress.contact,
                          country: nextAddress.country,
                          firstName: nextAddress.firstName,
                          lastName: nextAddress.lastName,
                          address: nextAddress.address,
                          apartment: nextAddress.apartment,
                          city: nextAddress.city,
                          state: nextAddress.state,
                          zipCode: nextAddress.zipCode
                        }));
                      }}
                    >
                      {addresses.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label} - {item.address}, {item.city}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}

              <select value={formState.country} onChange={(event) => updateCountry(event.target.value)}>
                {supportedCountries.map((country) => (
                  <option key={country}>{country}</option>
                ))}
              </select>

              <div className="checkout-form__row checkout-form__row--split">
                <input
                  type="text"
                  placeholder="First name"
                  value={formState.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={formState.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={formState.address}
                onChange={(event) => updateField("address", event.target.value)}
              />

              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={formState.apartment}
                onChange={(event) => updateField("apartment", event.target.value)}
              />

              <div className="checkout-form__row checkout-form__row--triple">
                <input
                  type="text"
                  placeholder="City"
                  value={formState.city}
                  onChange={(event) => updateField("city", event.target.value)}
                />
                <select value={formState.state} onChange={(event) => updateField("state", event.target.value)}>
                  <option value="">Select state</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="ZIP code"
                  value={formState.zipCode}
                  onChange={(event) => updateField("zipCode", event.target.value)}
                />
              </div>

              <label className="checkout-form__checkbox">
                <input
                  type="checkbox"
                  checked={formState.saveInfo}
                  onChange={(event) => updateField("saveInfo", event.target.checked)}
                />
                <span>Save this information for next time</span>
              </label>
            </div>

            <div className="checkout-form__section">
              <div className="checkout-form__section-head">
                <h2>Shipping method</h2>
              </div>

              <div className="checkout-form__shipping">
                {items.length ? (
                  <>
                    <strong>{shippingCost === 0 ? "Free shipping" : "Standard shipping"}</strong>
                    <span>{shippingCost === 0 ? "FREE" : formatAmount(shippingCost)}</span>
                  </>
                ) : (
                  <span>Enter your shipping address to view available shipping methods.</span>
                )}
              </div>
            </div>

            <div className="checkout-form__section">
              <div className="checkout-form__section-head checkout-form__section-head--stack">
                <div>
                  <h2>Payment</h2>
                  <p>All transactions are secure and encrypted.</p>
                </div>
              </div>

              <div className="checkout-form__payment-methods">
                <button
                  type="button"
                  className={`checkout-form__payment-tab ${formState.paymentMethod === "card" ? "is-active" : ""}`}
                  onClick={() => updateField("paymentMethod", "card")}
                >
                  Credit card
                </button>
                <button
                  type="button"
                  className={`checkout-form__payment-tab ${formState.paymentMethod === "cod" ? "is-active" : ""}`}
                  onClick={() => updateField("paymentMethod", "cod")}
                >
                  Cash on delivery
                </button>
              </div>

              {formState.paymentMethod === "card" ? (
                <div className="checkout-form__payment-card">
                  <input
                    type="text"
                    placeholder="Card number"
                    value={formState.cardNumber}
                    onChange={(event) => updateField("cardNumber", event.target.value)}
                  />
                  <div className="checkout-form__row checkout-form__row--split">
                    <input
                      type="text"
                      placeholder="Expiration date (MM / YY)"
                      value={formState.expiryDate}
                      onChange={(event) => updateField("expiryDate", event.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Security code"
                      value={formState.securityCode}
                      onChange={(event) => updateField("securityCode", event.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={formState.cardName}
                    onChange={(event) => updateField("cardName", event.target.value)}
                  />
                  <label className="checkout-form__checkbox">
                    <input
                      type="checkbox"
                      checked={formState.useShippingAsBilling}
                      onChange={(event) => updateField("useShippingAsBilling", event.target.checked)}
                    />
                    <span>Use shipping address as billing address</span>
                  </label>
                </div>
              ) : (
                <div className="checkout-form__payment-cod">
                  <p>Pay with cash when your order is delivered to your address.</p>
                </div>
              )}
            </div>

            {errorMessage ? <p className="checkout-form__error">{errorMessage}</p> : null}

            <button type="submit" className="checkout-form__submit">
              {isSubmitting ? "Processing..." : formState.paymentMethod === "card" ? "Pay now" : "Place order"}
            </button>
          </form>
        </section>

        <aside className="checkout-page__summary">
          <div className="checkout-summary">
            <div className="checkout-summary__items">
              {items.map((item) => (
                <article className="checkout-summary__item" key={item.key}>
                  <div className="checkout-summary__media">
                    <img src={item.image} alt={item.name} />
                    <span>{item.quantity}</span>
                  </div>
                  <div className="checkout-summary__copy">
                    <h3>{item.name}</h3>
                    <p>
                      {item.optionLabel} {item.optionValue}
                    </p>
                    <div className="checkout-summary__qty">
                      <button type="button" onClick={() => changeQuantity(item.key, -1)}>-</button>
                      <strong>{item.quantity}</strong>
                      <button type="button" onClick={() => changeQuantity(item.key, 1)}>+</button>
                    </div>
                  </div>
                  <strong>{formatAmount(parsePrice(item.price) * item.quantity)}</strong>
                </article>
              ))}
            </div>

            <form className="checkout-summary__coupon" onSubmit={handleApplyCoupon}>
              <label htmlFor="checkout-coupon">Enter coupon code</label>
              {!appliedCoupon ? (
                <div className="checkout-summary__coupon-row">
                  <input
                    id="checkout-coupon"
                    type="text"
                    value={couponInput}
                    placeholder="Enter coupon code"
                    onChange={(event) => setCouponInput(event.target.value)}
                  />
                  <button type="submit">Apply</button>
                </div>
              ) : (
                <button
                  type="button"
                  className="checkout-summary__coupon-remove"
                  onClick={() => {
                    removeCoupon();
                    setCouponInput("");
                    setCouponMessage("Coupon removed.");
                  }}
                >
                  Remove {appliedCoupon.code}
                </button>
              )}
              {couponMessage ? <p className="checkout-summary__coupon-message">{couponMessage}</p> : null}
            </form>

            <div className="checkout-summary__note">
              <label htmlFor="checkout-note">Note</label>
              <textarea
                id="checkout-note"
                rows="4"
                placeholder="Add a note for your order"
                value={formState.orderNote}
                onChange={(event) => updateField("orderNote", event.target.value)}
              />
            </div>

            <div className="checkout-summary__totals">
              <div>
                <span>Subtotal · {itemCount} items</span>
                <strong>{formatAmount(subtotal)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong>{discount > 0 ? `-${formatAmount(discount)}` : formatAmount(0)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{items.length ? (shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`) : "—"}</strong>
              </div>
              <div className="checkout-summary__total">
                <span>Total</span>
                <strong>{formatAmount(grandTotal)}</strong>
              </div>
            </div>

            {!items.length ? (
              <button
                type="button"
                className="checkout-summary__empty-button"
                onClick={() => {
                  window.location.hash = "/cart";
                }}
              >
                Back to cart
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}

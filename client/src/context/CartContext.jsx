import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const FREE_SHIPPING_THRESHOLD = 900;
const CART_STORAGE_KEY = "dress-cart-state";
const COUPONS = {
  SAVE10: {
    type: "percent",
    value: 10
  },
  VOGUE50: {
    type: "fixed",
    value: 50
  }
};

function buildCartKey(item) {
  return [item.productId ?? item.id ?? item.name, item.optionValue ?? "", item.image ?? ""].join("::");
}

function readStoredCartState() {
  if (typeof window === "undefined") {
    return {
      items: [],
      couponCode: "",
      appliedCoupon: null
    };
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) {
      return {
        items: [],
        couponCode: "",
        appliedCoupon: null
      };
    }

    const parsedValue = JSON.parse(rawValue);
    return {
      items: Array.isArray(parsedValue.items) ? parsedValue.items : [],
      couponCode: typeof parsedValue.couponCode === "string" ? parsedValue.couponCode : "",
      appliedCoupon: parsedValue.appliedCoupon && typeof parsedValue.appliedCoupon.code === "string"
        ? parsedValue.appliedCoupon
        : null
    };
  } catch {
    return {
      items: [],
      couponCode: "",
      appliedCoupon: null
    };
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCartState().items);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState(() => readStoredCartState().couponCode);
  const [appliedCoupon, setAppliedCoupon] = useState(() => readStoredCartState().appliedCoupon);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items,
        couponCode,
        appliedCoupon
      })
    );
  }, [items, couponCode, appliedCoupon]);

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  function addItem(item) {
    const quantityToAdd = Math.max(1, Number(item.quantity) || 1);
    const normalizedItem = {
      ...item,
      quantity: quantityToAdd,
      key: buildCartKey(item)
    };

    setItems((current) => {
      const existingIndex = current.findIndex((entry) => entry.key === normalizedItem.key);
      if (existingIndex === -1) {
        return [...current, normalizedItem];
      }

      return current.map((entry, index) =>
        index === existingIndex
          ? {
              ...entry,
              quantity: entry.quantity + quantityToAdd
            }
          : entry
      );
    });

    setIsOpen(true);
  }

  function removeItem(key) {
    setItems((current) => current.filter((entry) => entry.key !== key));
  }

  function changeQuantity(key, delta) {
    setItems((current) =>
      current
        .map((entry) =>
          entry.key === key
            ? {
                ...entry,
                quantity: Math.max(1, entry.quantity + delta)
              }
            : entry
        )
    );
  }

  function applyCoupon(rawCode) {
    const normalizedCode = String(rawCode ?? "").trim().toUpperCase();
    const coupon = COUPONS[normalizedCode];

    if (!coupon) {
      return {
        ok: false,
        message: "Invalid coupon code."
      };
    }

    setCouponCode(normalizedCode);
    setAppliedCoupon({
      code: normalizedCode,
      ...coupon
    });

    return {
      ok: true,
      message: `${normalizedCode} applied.`
    };
  }

  function removeCoupon() {
    setCouponCode("");
    setAppliedCoupon(null);
  }

  function clearCart() {
    setItems([]);
    setCouponCode("");
    setAppliedCoupon(null);
    setIsOpen(false);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = Number(String(item.price ?? "0").replace(/[^0-9.]/g, "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  const discount =
    appliedCoupon?.type === "percent"
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon?.type === "fixed"
        ? appliedCoupon.value
        : 0;

  const normalizedDiscount = Math.min(subtotal, discount);
  const total = Math.max(0, subtotal - normalizedDiscount);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = FREE_SHIPPING_THRESHOLD
    ? Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
    : 0;

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      discount: normalizedDiscount,
      total,
      couponCode,
      appliedCoupon,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping,
      freeShippingProgress,
      addItem,
      removeItem,
      changeQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      openCart,
      closeCart
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      normalizedDiscount,
      total,
      couponCode,
      appliedCoupon,
      amountToFreeShipping,
      freeShippingProgress
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const OrdersContext = createContext(null);
const ORDERS_STORAGE_KEY = "dress-orders-history";

function readStoredOrders() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function normalizeOrder(order) {
  return {
    orderNumber: order.orderNumber,
    trackingNumber: order.trackingNumber ?? "",
    contact: order.contact ?? "",
    firstName: order.firstName ?? "",
    lastName: order.lastName ?? "",
    country: order.country ?? "",
    address: order.address ?? "",
    apartment: order.apartment ?? "",
    city: order.city ?? "",
    state: order.state ?? "",
    zipCode: order.zipCode ?? "",
    newsletter: Boolean(order.newsletter),
    saveInfo: Boolean(order.saveInfo),
    note: order.note ?? "",
    paymentMethod: order.paymentMethod ?? "",
    currencyCode: order.currencyCode ?? "USD",
    subtotal: order.subtotal ?? "0.00",
    discount: order.discount ?? "0.00",
    shipping: order.shipping ?? "0.00",
    total: order.total ?? "0.00",
    status: order.status ?? "confirmed",
    estimatedDelivery: order.estimatedDelivery ?? "",
    createdAt: order.createdAt ?? new Date().toISOString(),
    itemCount: Number(order.itemCount ?? order.items?.length ?? 0),
    steps: Array.isArray(order.steps) ? order.steps : [],
    items: Array.isArray(order.items) ? order.items : []
  };
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => readStoredOrders());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  function upsertOrder(order) {
    const normalizedOrder = normalizeOrder(order);

    setOrders((current) => {
      const nextOrders = current.filter((entry) => entry.orderNumber !== normalizedOrder.orderNumber);
      return [normalizedOrder, ...nextOrders].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }

  function getOrder(orderNumber) {
    return orders.find((entry) => entry.orderNumber === orderNumber) ?? null;
  }

  const value = useMemo(
    () => ({
      orders,
      upsertOrder,
      getOrder
    }),
    [orders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }

  return context;
}

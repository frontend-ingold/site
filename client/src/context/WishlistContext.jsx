import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = "dress-wishlist-state";

function readStoredWishlist() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function normalizeWishlistItem(item) {
  return {
    key: item.key ?? `${item.collectionSlug ?? ""}::${item.productId ?? item.id ?? item.name}`,
    id: item.id ?? item.productId ?? item.name,
    productId: item.productId ?? item.id ?? item.name,
    collectionSlug: item.collectionSlug ?? "",
    href: item.href ?? "#/",
    name: item.name ?? "",
    brand: item.brand ?? "",
    category: item.category ?? "",
    price: item.price ?? "",
    oldPrice: item.oldPrice ?? "",
    image: item.image ?? "",
    optionLabel: item.optionLabel ?? "",
    optionValue: item.optionValue ?? ""
  };
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readStoredWishlist());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(item) {
    const normalizedItem = normalizeWishlistItem(item);
    setItems((current) => {
      if (current.some((entry) => entry.key === normalizedItem.key)) {
        return current;
      }

      return [normalizedItem, ...current];
    });
  }

  function removeItem(key) {
    setItems((current) => current.filter((entry) => entry.key !== key));
  }

  function toggleItem(item) {
    const normalizedItem = normalizeWishlistItem(item);

    setItems((current) => {
      if (current.some((entry) => entry.key === normalizedItem.key)) {
        return current.filter((entry) => entry.key !== normalizedItem.key);
      }

      return [normalizedItem, ...current];
    });
  }

  function clearWishlist() {
    setItems([]);
  }

  function hasItem(key) {
    return items.some((entry) => entry.key === key);
  }

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
      hasItem
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}

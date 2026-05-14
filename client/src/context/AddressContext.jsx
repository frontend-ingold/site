import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AddressContext = createContext(null);
const ADDRESS_STORAGE_KEY = "dress-address-book";

function readStoredAddresses() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function normalizeAddress(address) {
  const id = address.id ?? `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    label: String(address.label ?? "Home").trim() || "Home",
    firstName: String(address.firstName ?? "").trim(),
    lastName: String(address.lastName ?? "").trim(),
    contact: String(address.contact ?? "").trim(),
    country: String(address.country ?? "United States").trim() || "United States",
    address: String(address.address ?? "").trim(),
    apartment: String(address.apartment ?? "").trim(),
    city: String(address.city ?? "").trim(),
    state: String(address.state ?? "").trim(),
    zipCode: String(address.zipCode ?? "").trim(),
    isDefault: Boolean(address.isDefault)
  };
}

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(() => readStoredAddresses());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  function saveAddress(address) {
    const normalizedAddress = normalizeAddress(address);

    setAddresses((current) => {
      const nextAddresses = current.filter((entry) => entry.id !== normalizedAddress.id).map((entry) => ({
        ...entry,
        isDefault: normalizedAddress.isDefault ? false : entry.isDefault
      }));

      const withAddress = [normalizedAddress, ...nextAddresses];
      return withAddress.some((entry) => entry.isDefault)
        ? withAddress
        : withAddress.map((entry, index) => ({
            ...entry,
            isDefault: index === 0
          }));
    });

    return normalizedAddress;
  }

  function removeAddress(id) {
    setAddresses((current) => {
      const nextAddresses = current.filter((entry) => entry.id !== id);
      if (!nextAddresses.length) {
        return [];
      }

      if (nextAddresses.some((entry) => entry.isDefault)) {
        return nextAddresses;
      }

      return nextAddresses.map((entry, index) => ({
        ...entry,
        isDefault: index === 0
      }));
    });
  }

  function setDefaultAddress(id) {
    setAddresses((current) =>
      current.map((entry) => ({
        ...entry,
        isDefault: entry.id === id
      }))
    );
  }

  function getAddress(id) {
    return addresses.find((entry) => entry.id === id) ?? null;
  }

  const defaultAddress = useMemo(
    () => addresses.find((entry) => entry.isDefault) ?? addresses[0] ?? null,
    [addresses]
  );

  const value = useMemo(
    () => ({
      addresses,
      defaultAddress,
      saveAddress,
      removeAddress,
      setDefaultAddress,
      getAddress
    }),
    [addresses, defaultAddress]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddressBook() {
  const context = useContext(AddressContext);

  if (!context) {
    throw new Error("useAddressBook must be used within an AddressProvider");
  }

  return context;
}

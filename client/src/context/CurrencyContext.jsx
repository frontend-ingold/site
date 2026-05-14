import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CurrencyContext = createContext(null);
const CURRENCY_STORAGE_KEY = "dress-currency";

const currencyConfig = {
  USD: { code: "USD", symbol: "$", locale: "en-US", rate: 1 },
  EUR: { code: "EUR", symbol: "EUR", locale: "de-DE", rate: 0.92 },
  INR: { code: "INR", symbol: "INR", locale: "en-IN", rate: 83.2 }
};

function normalizeCurrencyCode(value) {
  return currencyConfig[value] ? value : "USD";
}

export function parsePrice(value) {
  return Number(String(value ?? "0").replace(/[^0-9.-]/g, "")) || 0;
}

function readStoredCurrency() {
  if (typeof window === "undefined") {
    return "USD";
  }

  return normalizeCurrencyCode(window.localStorage.getItem(CURRENCY_STORAGE_KEY));
}

function formatCurrencyValue(amount, currencyCode) {
  const normalizedCode = normalizeCurrencyCode(currencyCode);
  const config = currencyConfig[normalizedCode];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount ?? 0));
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(readStoredCurrency);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  function setCurrency(nextCurrency) {
    setCurrencyState(normalizeCurrencyCode(nextCurrency));
  }

  function convertAmount(amount, targetCurrency = currency) {
    const normalizedCode = normalizeCurrencyCode(targetCurrency);
    return Number(amount ?? 0) * currencyConfig[normalizedCode].rate;
  }

  function formatAmount(amount) {
    return formatCurrencyValue(convertAmount(amount, currency), currency);
  }

  function formatPrice(value) {
    return formatAmount(parsePrice(value));
  }

  function formatStoredAmount(amount, currencyCode = "USD") {
    return formatCurrencyValue(parsePrice(amount), currencyCode);
  }

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      currencies: Object.values(currencyConfig),
      convertAmount,
      formatAmount,
      formatPrice,
      formatStoredAmount,
      parsePrice
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
}

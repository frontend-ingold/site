import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";
const storageKey = "urban-care-auth";

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: "",
    user: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (parsed?.token && parsed?.user) {
        setAuthState(parsed);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  function persist(nextState) {
    setAuthState(nextState);

    if (nextState.token && nextState.user) {
      localStorage.setItem(storageKey, JSON.stringify(nextState));
      return;
    }

    localStorage.removeItem(storageKey);
  }

  async function register(payload) {
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed.");
    }

    persist({
      token: result.token,
      user: result.user,
    });
  }

  async function login(payload) {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed.");
    }

    persist({
      token: result.token,
      user: result.user,
    });
  }

  async function logout() {
    if (authState.token) {
      try {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
      } catch {
        // Ignore network logout failures and clear local state anyway.
      }
    }

    persist({
      token: "",
      user: null,
    });
  }

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      isAuthenticated: Boolean(authState.token && authState.user),
      register,
      login,
      logout,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

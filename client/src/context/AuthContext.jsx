import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "dress-auth-session";

function readStoredSession() {
  if (typeof window === "undefined") {
    return { token: "", user: null };
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawValue) {
      return { token: "", user: null };
    }

    const parsed = JSON.parse(rawValue);
    return {
      token: typeof parsed.token === "string" ? parsed.token : "",
      user: parsed.user ?? null
    };
  } catch {
    return { token: "", user: null };
  }
}

function writeStoredSession(token, user) {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token,
      user
    })
  );
}

export function AuthProvider({ apiBaseUrl, children }) {
  const storedSession = readStoredSession();
  const [token, setToken] = useState(storedSession.token);
  const [user, setUser] = useState(storedSession.user);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(storedSession.token));
  const [hasCheckedStoredSession, setHasCheckedStoredSession] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!token) {
      writeStoredSession("", null);
      return;
    }

    writeStoredSession(token, user);
  }, [token, user]);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      if (hasCheckedStoredSession) {
        return;
      }

      if (!token) {
        setIsAuthLoading(false);
        setHasCheckedStoredSession(true);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            if (isMounted) {
              setToken("");
              setUser(null);
            }
            return;
          }

          return;
        }

        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        // Keep the locally stored session on transient network/server failures.
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
          setHasCheckedStoredSession(true);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, hasCheckedStoredSession, token]);

  async function submitAuth(path, payload) {
    const response = await fetch(`${apiBaseUrl}/api/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Authentication failed.");
    }

    return data;
  }

  async function register(payload) {
    const data = await submitAuth("register", payload);
    writeStoredSession(data.session.token, data.user);
    setToken(data.session.token);
    setUser(data.user);
    setIsAuthLoading(false);
    return data.user;
  }

  async function login(payload) {
    const data = await submitAuth("login", payload);
    writeStoredSession(data.session.token, data.user);
    setToken(data.session.token);
    setUser(data.user);
    setIsAuthLoading(false);
    return data.user;
  }

  async function forgotPassword(payload) {
    const data = await submitAuth("forgot-password", payload);
    return data.message;
  }

  async function logout() {
    try {
      if (token) {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } finally {
      writeStoredSession("", null);
      setToken("");
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: Boolean(token),
      isAuthLoading,
      register,
      login,
      forgotPassword,
      logout
    }),
    [user, token, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

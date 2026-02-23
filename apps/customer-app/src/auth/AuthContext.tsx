import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const TOKEN_KEY = 'foodbot_access_token';

type AuthContextValue = {
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback((t: string) => {
    setToken(t);
    localStorage.setItem(TOKEN_KEY, t);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

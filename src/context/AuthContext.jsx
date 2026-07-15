import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.js";
import { getToken, setToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const data = await authApi.fetchMe();
      setUser(data.user);
      return data.user;
    } catch {
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signup = async (payload) => {
    const data = await authApi.signup(payload);
    setUser(data.user);
    return data;
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCurrentUser, loginRequest, registerRequest, type RegisterPayload } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";
import { getAuthToken, setAuthToken } from "@/lib/api/client";
import type { AuthUser } from "@/lib/api/types";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { user: current } = await fetchCurrentUser();
      setUser(current);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        setAuthToken(null);
      }
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedInUser } = await loginRequest({ email, password });
    setAuthToken(token);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { token, user: registeredUser } = await registerRequest(payload);
    setAuthToken(token);
    setUser(registeredUser);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

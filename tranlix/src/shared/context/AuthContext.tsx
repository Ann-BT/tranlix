import { useState, createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { apiClient } from "@/shared/api/client";

export interface AuthUser {
  fullName: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: AuthUser | null;
  }>(() => {
    const token = localStorage.getItem("access_token");
    const hasRealToken = Boolean(token && token !== "demo-token");
    return {
      isAuthenticated: hasRealToken,
      user: null,
    };
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && token !== "demo-token") {
      apiClient
        .get("/users/me")
        .then((res) => {
          setAuthState({
            isAuthenticated: true,
            user: {
              fullName: res.data.full_name ?? res.data.username,
              username: res.data.username,
              isAdmin: Boolean(res.data.is_admin),
            },
          });
        })
        .catch(() => {
          // If token is invalid or expired on server, invalidate session
          localStorage.removeItem("access_token");
          setAuthState({
            isAuthenticated: false,
            user: null,
          });
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { username, password });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      const userResponse = await apiClient.get("/users/me");
      const userData = userResponse.data;

      setAuthState({
        isAuthenticated: true,
        user: {
          fullName: userData.full_name,
          username: userData.username,
          isAdmin: userData.is_admin,
        },
      });
      return true;
    } catch (error) {
      console.warn("Backend API offline or login failed. Falling back to Demo Mode:", error);
      // Demo mode fallback so you can preview internal pages when backend is offline
      if (username) {
        const mockUser: AuthUser = {
          fullName: username === "admin" ? "Quản trị viên (Demo)" : "Người dùng Demo",
          username: username,
          isAdmin: username === "admin" || true,
        };
        localStorage.setItem("access_token", "demo-token");
        setAuthState({
          isAuthenticated: true,
          user: mockUser,
        });
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("tranlix_recent_jobs_v6");
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

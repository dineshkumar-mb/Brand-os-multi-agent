import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEAM_MEMBER" | "USER";
  profile?: {
    industry?: string;
    careerStage?: string;
    targetAudience?: string;
    writingTone?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; resetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(api.getToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = api.getToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const profileData = await api.getProfile();
        setUser(profileData);
        setTokenState(storedToken);
      } catch (error) {
        console.warn("[Auth Notice] Failed to restore session from token:", error);
        api.setToken(null);
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setTokenState(response.token);
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string, role = "USER") => {
    const response = await api.register(name, email, password, role);
    setTokenState(response.token);
    setUser(response.user);
  };

  const forgotPassword = async (email: string) => {
    return await api.forgotPassword(email);
  };

  const resetPassword = async (tokenVal: string, newPassword: string) => {
    return await api.resetPassword(tokenVal, newPassword);
  };

  const logout = () => {
    api.setToken(null);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

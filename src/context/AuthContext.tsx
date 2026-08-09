"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password?: string, name?: string, avatar?: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, role?: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; avatar?: string; role?: string }) => Promise<void>;
  logout: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("pyramid-user");
    const savedToken = localStorage.getItem("pyramid-token");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (savedToken) setToken(savedToken);

        if (savedToken) {
          fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
            .then((res) => (res.ok ? res.json() : null))
            .then((dbUser) => {
              if (dbUser) {
                const updated: User = {
                  id: dbUser.id,
                  name: dbUser.name,
                  email: dbUser.email,
                  avatar: dbUser.avatar,
                  role: dbUser.role,
                  isGuest: dbUser.isGuest,
                };
                setUser(updated);
                localStorage.setItem("pyramid-user", JSON.stringify(updated));
              }
            })
            .catch(() => {});
        }
      } catch {
        localStorage.removeItem("pyramid-user");
        localStorage.removeItem("pyramid-token");
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (resData: { access_token?: string; user: any }) => {
    const dbUser = resData.user || resData;
    const jwtToken = resData.access_token || "mock_jwt_token";

    const loggedUser: User = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar,
      role: dbUser.role || "MEMBER",
      isGuest: !!dbUser.isGuest,
    };

    setUser(loggedUser);
    setToken(jwtToken);
    localStorage.setItem("pyramid-user", JSON.stringify(loggedUser));
    localStorage.setItem("pyramid-token", jwtToken);
    router.push("/dashboard");
  };

  const registerWithEmail = async (email: string, password: string, name: string, role = "MEMBER") => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (res.ok) {
        const data = await res.json();
        handleAuthSuccess(data);
        return;
      }
    } catch (e) {
      console.warn("Backend auth offline, using local fallback", e);
    }

    handleAuthSuccess({
      access_token: "mock_jwt_register",
      user: {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        name,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role,
        isGuest: false,
      },
    });
  };

  const loginWithEmail = async (email: string, password?: string, name?: string, avatar?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, avatar }),
      });

      if (res.ok) {
        const data = await res.json();
        handleAuthSuccess(data);
        return;
      }
    } catch (e) {
      console.warn("Backend auth offline, using local fallback auth", e);
    }

    handleAuthSuccess({
      access_token: "mock_jwt_login",
      user: {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: name || email.split("@")[0] || "User",
        email: email,
        avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "MEMBER",
        isGuest: false,
      },
    });
  };

  const loginAsGuest = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/guest`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        handleAuthSuccess(data);
        return;
      }
    } catch (e) {
      console.warn("Backend guest auth offline, using local fallback", e);
    }

    handleAuthSuccess({
      access_token: "mock_jwt_guest",
      user: {
        id: "guest_" + Math.random().toString(36).substring(2, 9),
        name: "Guest User",
        email: "guest@pyramid.app",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "GUEST",
        isGuest: true,
      },
    });
  };

  const loginWithGoogle = async (email?: string, name?: string, avatar?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, avatar }),
      });

      if (res.ok) {
        const data = await res.json();
        handleAuthSuccess(data);
        return;
      }
    } catch (e) {
      console.warn("Backend Google auth offline, using local fallback", e);
    }

    handleAuthSuccess({
      access_token: "mock_jwt_google",
      user: {
        id: "google_" + Math.random().toString(36).substring(2, 9),
        name: name || "Alex Morgan",
        email: email || "alex.morgan@gmail.com",
        avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: "MANAGER",
        isGuest: false,
      },
    });
  };

  const updateProfile = async (data: { name?: string; email?: string; avatar?: string; role?: string }) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.avatar && { avatar: data.avatar }),
      ...(data.role && { role: data.role }),
    };

    setUser(updatedUser);
    localStorage.setItem("pyramid-user", JSON.stringify(updatedUser));

    if (user.id && !user.id.startsWith("guest_") && !user.id.startsWith("google_")) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.access_token) {
            setToken(resData.access_token);
            localStorage.setItem("pyramid-token", resData.access_token);
          }
        }
      } catch (e) {
        console.warn("Backend updateProfile offline, state saved locally", e);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pyramid-user");
    localStorage.removeItem("pyramid-token");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        loginWithGoogle,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

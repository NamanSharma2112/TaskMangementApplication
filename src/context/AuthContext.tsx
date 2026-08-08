"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAsGuest: () => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("pyramid-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("pyramid-user");
      }
    }
    setIsLoading(false);
  }, []);

  const loginAsGuest = () => {
    const guestUser: User = {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      name: "Guest User",
      email: "guest@pyramid.app",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem("pyramid-user", JSON.stringify(guestUser));
    router.push("/dashboard");
  };

  const loginWithGoogle = () => {
    // Simulated Google Auth for evaluation preview
    const googleUser: User = {
      id: "google_" + Math.random().toString(36).substring(2, 9),
      name: "Alex Morgan",
      email: "alex.morgan@gmail.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isGuest: false,
    };
    setUser(googleUser);
    localStorage.setItem("pyramid-user", JSON.stringify(googleUser));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pyramid-user");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, loginAsGuest, loginWithGoogle, logout }}
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

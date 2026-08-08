"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "violet" | "emerald";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorAccent: string;
  setColorAccent: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorAccent, setColorAccentState] = useState<string>("zinc");

  const applyThemeToDOM = (t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const applyColorAccentToDOM = (color: string) => {
    document.documentElement.setAttribute("data-accent", color);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("pyramid-theme") as Theme;
    if (savedTheme && ["light", "dark", "violet", "emerald"].includes(savedTheme)) {
      setThemeState(savedTheme);
      applyThemeToDOM(savedTheme);
    } else {
      applyThemeToDOM("light");
    }

    const savedAccent = localStorage.getItem("pyramid-color-accent");
    if (savedAccent) {
      setColorAccentState(savedAccent);
      applyColorAccentToDOM(savedAccent);
    } else {
      applyColorAccentToDOM("zinc");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("pyramid-theme", newTheme);
    applyThemeToDOM(newTheme);
  };

  const setColorAccent = (newAccent: string) => {
    setColorAccentState(newAccent);
    localStorage.setItem("pyramid-color-accent", newAccent);
    applyColorAccentToDOM(newAccent);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorAccent, setColorAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

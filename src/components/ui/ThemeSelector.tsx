"use client";

import React, { useState } from "react";
import { useTheme, Theme } from "@/context/ThemeContext";
import { Palette, Check, Sun, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const themes: { id: Theme; label: string; colorBg: string; icon: React.ReactNode }[] = [
  { id: "light", label: "Light", colorBg: "bg-zinc-100 border-zinc-300", icon: <Sun className="w-3.5 h-3.5" /> },
  { id: "dark", label: "Dark", colorBg: "bg-zinc-900 border-zinc-700", icon: <Moon className="w-3.5 h-3.5" /> },
  { id: "violet", label: "Violet", colorBg: "bg-purple-600 border-purple-400", icon: <Sparkles className="w-3.5 h-3.5 text-purple-200" /> },
  { id: "emerald", label: "Emerald", colorBg: "bg-emerald-600 border-emerald-400", icon: <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full gap-2 border-zinc-200 dark:border-zinc-800 text-xs font-medium bg-white dark:bg-zinc-900 shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <Palette className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
        <span className="capitalize hidden sm:inline">{theme} Theme</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-lg z-50 animate-in fade-in-80 zoom-in-95">
            <div className="px-2 py-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Select Theme
            </div>
            <div className="space-y-1 mt-1">
              {themes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    theme === item.id
                      ? "theme-sidebar-active text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full border ${item.colorBg}`} />
                    <span>{item.label}</span>
                  </div>
                  {theme === item.id && <Check className="w-3.5 h-3.5 theme-primary-text" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

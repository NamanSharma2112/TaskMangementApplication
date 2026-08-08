"use client";

import React from "react";
import { useTheme, Theme } from "@/context/ThemeContext";
import { Sun, Moon, Sparkles, Check } from "lucide-react";

const themesList: { id: Theme; title: string; description: string; previewBg: string; icon: React.ReactNode }[] = [
  {
    id: "light",
    title: "Light Theme",
    description: "Clean, high contrast standard light mode interface.",
    previewBg: "bg-white border-zinc-200 text-zinc-900",
    icon: <Sun className="w-5 h-5 text-amber-500" />,
  },
  {
    id: "dark",
    title: "Dark Theme",
    description: "Sleek dark mode ideal for night and low-light working.",
    previewBg: "bg-zinc-950 border-zinc-800 text-white",
    icon: <Moon className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "violet",
    title: "Violet Accent",
    description: "Soft violet hue for creative workspace focus.",
    previewBg: "bg-purple-50 border-purple-200 text-purple-950",
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
  },
  {
    id: "emerald",
    title: "Emerald Accent",
    description: "Relaxing emerald palette for maximum task clarity.",
    previewBg: "bg-emerald-50 border-emerald-200 text-emerald-950",
    icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
  },
];

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Theme
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Customize your interface theme and visual preferences. Selected theme automatically persists.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {themesList.map((t) => {
          const isSelected = theme === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`cursor-pointer rounded-3xl border-2 p-6 transition-all duration-200 ${
                isSelected
                  ? "border-[hsl(var(--primary))] shadow-md scale-[1.02]"
                  : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  {t.icon}
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full theme-btn-primary">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1">
                {t.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {t.description}
              </p>

              <div
                className={`mt-4 h-12 rounded-xl border ${t.previewBg} p-2 flex items-center justify-between text-xs font-semibold`}
              >
                <span>Preview</span>
                <span className="w-3 h-3 rounded-full bg-current opacity-60" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

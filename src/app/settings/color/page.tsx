"use client";

import React from "react";
import { Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const colors = [
  { id: "zinc", name: "Zinc", bg: "bg-zinc-900" },
  { id: "blue", name: "Sapphire Blue", bg: "bg-blue-600" },
  { id: "purple", name: "Royal Violet", bg: "bg-purple-600" },
  { id: "emerald", name: "Emerald Green", bg: "bg-emerald-600" },
  { id: "rose", name: "Rose Pink", bg: "bg-rose-600" },
  { id: "amber", name: "Warm Amber", bg: "bg-amber-500" },
];

export default function ColorSettingsPage() {
  const { colorAccent, setColorAccent } = useTheme();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Color Accent
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Select primary brand accent highlights for interactive elements and buttons.
        </p>
      </div>

      <div className="theme-card theme-border border rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Primary Accent Color
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {colors.map((c) => {
            const isSelected = colorAccent === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setColorAccent(c.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 font-semibold"
                    : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center shrink-0`}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </span>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

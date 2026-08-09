"use client";

import React, { useState } from "react";
import { List, LayoutGrid, Check } from "lucide-react";

interface FieldsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: "board" | "list";
  onViewModeChange: (mode: "board" | "list") => void;
  visibleFields: Record<string, boolean>;
  onToggleField: (fieldKey: string) => void;
}

export function FieldsDropdown({
  isOpen,
  onClose,
  viewMode,
  onViewModeChange,
  visibleFields,
  onToggleField,
}: FieldsDropdownProps) {
  if (!isOpen) return null;

  const fieldsList = [
    { key: "priority", label: "Priority" },
    { key: "members", label: "Members" },
    { key: "dueDate", label: "Due Date" },
    { key: "labels", label: "Labels" },
    { key: "status", label: "Status" },
    { key: "reporter", label: "Reporter" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 shadow-xl z-50 animate-in fade-in-80 zoom-in-95 select-none">
        {/* Top View Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-3">
          <button
            onClick={() => onViewModeChange("list")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "list"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            onClick={() => onViewModeChange("board")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "board"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
        </div>

        {/* Fields toggle list */}
        <div className="space-y-0.5">
          {fieldsList.map((f) => {
            const isChecked = visibleFields[f.key] !== false;
            return (
              <button
                key={f.key}
                onClick={() => onToggleField(f.key)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
              >
                <span>{f.label}</span>
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 dark:border-zinc-700 bg-transparent"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

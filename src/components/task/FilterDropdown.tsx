"use client";

import React from "react";
import { Check, Filter, RotateCcw } from "lucide-react";
import { useTasks } from "@/context/TaskContext";

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDropdown({ isOpen, onClose }: FilterDropdownProps) {
  const { priorityFilter, setPriorityFilter, statusFilter, setStatusFilter } = useTasks();

  if (!isOpen) return null;

  const priorities = [
    { id: "all", label: "All Priorities" },
    { id: "high", label: "High Priority" },
    { id: "medium", label: "Medium Priority" },
    { id: "low", label: "Low Priority" },
  ];

  const statuses = [
    { id: "all", label: "All Statuses" },
    { id: "todo", label: "To Do" },
    { id: "in-progress", label: "Doing" },
    { id: "completed", label: "Completed" },
    { id: "on-hold", label: "On Hold" },
  ];

  const handleReset = () => {
    setPriorityFilter("all");
    setStatusFilter("all");
  };

  const isFiltered = priorityFilter !== "all" || statusFilter !== "all";

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-16 top-14 w-60 rounded-2xl border theme-border theme-card p-3.5 shadow-xl z-50 animate-in fade-in-80 zoom-in-95 select-none space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b theme-border">
          <div className="flex items-center gap-1.5 text-xs font-bold theme-fg">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Tasks</span>
          </div>
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Priority Section */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
            Priority
          </label>
          <div className="space-y-0.5">
            {priorities.map((p) => {
              const isSelected = priorityFilter === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPriorityFilter(p.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? "theme-sidebar-active theme-fg font-semibold"
                      : "theme-muted-fg hover:bg-[hsl(var(--accent))]"
                  }`}
                >
                  <span>{p.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 theme-primary-text" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Section */}
        <div className="space-y-1 pt-1 border-t theme-border">
          <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
            Status
          </label>
          <div className="space-y-0.5">
            {statuses.map((s) => {
              const isSelected = statusFilter === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? "theme-sidebar-active theme-fg font-semibold"
                      : "theme-muted-fg hover:bg-[hsl(var(--accent))]"
                  }`}
                >
                  <span>{s.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 theme-primary-text" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

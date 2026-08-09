"use client";

import React, { useState } from "react";
import { Check, ChevronRight, Signal } from "lucide-react";
import { useTasks } from "@/context/TaskContext";

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDropdown({ isOpen, onClose }: FilterDropdownProps) {
  const { priorityFilter, setPriorityFilter, statusFilter, setStatusFilter } = useTasks();
  const [showPrioritySubMenu, setShowPrioritySubMenu] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Main Filter Dropdown matching Screenshot 1 */}
      <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl z-50 space-y-1 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100 select-none">
        
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400" />
            <span>Status</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowPrioritySubMenu(!showPrioritySubMenu)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
              showPrioritySubMenu 
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Signal className="w-3.5 h-3.5 text-zinc-500" />
              <span>Priority</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Priority Sub-Flyout matching Screenshot 1 */}
          {showPrioritySubMenu && (
            <div className="absolute right-full top-0 mr-2 w-44 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl z-50 space-y-1 animate-in slide-in-from-right-2 duration-150">
              <p className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Priority
              </p>
              {[
                { id: "all", label: "No Priority" },
                { id: "urgent", label: "Urgent", color: "text-rose-500" },
                { id: "high", label: "High", color: "text-amber-500" },
                { id: "medium", label: "Medium", color: "text-amber-400" },
                { id: "low", label: "Low", color: "text-zinc-400 dark:text-zinc-500" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPriorityFilter(p.id);
                    setShowPrioritySubMenu(false);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {p.id !== "all" && <Signal className={`w-3 h-3 ${p.color}`} />}
                    <span className={p.color || "text-zinc-700 dark:text-zinc-300"}>
                      {p.label}
                    </span>
                  </div>
                  {priorityFilter === p.id && (
                    <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Other Filter Items */}
        {[
          { label: "Members", icon: "svg-users" },
          { label: "Due Date", icon: "svg-calendar" },
          { label: "Teams", icon: "svg-users-group" },
          { label: "Labels", icon: "svg-tag" },
          { label: "Reporter", icon: "svg-user" }
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {/* Note: In a real app we'd use specific lucide icons here like Users, Calendar, Tag, User */}
              <div className="w-3.5 h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <span>{item.label}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        ))}
      </div>
    </>
  );
}

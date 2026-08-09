"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Settings,
  LogOut,
  Sun,
  Moon,
  FolderKanban,
  SlidersHorizontal,
  ArrowRight,
  Hash,
  Command,
  Sparkles,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTasks } from "@/context/TaskContext";
import { Task } from "@/types/task";

interface CommandPaletteProps {
  onCreateTask?: () => void;
  onSetViewMode?: (mode: "board" | "list") => void;
  onNavigateTab?: (tab: string) => void;
  onEditTask?: (task: Task) => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  keywords?: string[];
  action: () => void;
  shortcut?: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  "todo": <Clock className="w-3.5 h-3.5 text-amber-500" />,
  "in-progress": <AlertCircle className="w-3.5 h-3.5 text-blue-500" />,
  "doing": <AlertCircle className="w-3.5 h-3.5 text-blue-500" />,
  "completed": <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  "on-hold": <PauseCircle className="w-3.5 h-3.5 text-purple-400" />,
};

export function CommandPalette({
  onCreateTask,
  onSetViewMode,
  onNavigateTab,
  onEditTask,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { tasks } = useTasks();

  // Build command list
  const commands: CommandItem[] = React.useMemo(() => {
    const items: CommandItem[] = [
      // --- Actions ---
      {
        id: "create-task",
        label: "Create New Task",
        description: "Add a new task to the board",
        icon: <Plus className="w-4 h-4" />,
        group: "Actions",
        keywords: ["new", "add", "create", "task"],
        action: () => { onCreateTask?.(); setIsOpen(false); },
        shortcut: "N",
      },
      {
        id: "view-board",
        label: "Switch to Board View",
        description: "Kanban board layout",
        icon: <LayoutGrid className="w-4 h-4" />,
        group: "Actions",
        keywords: ["board", "kanban", "view", "grid"],
        action: () => { onSetViewMode?.("board"); setIsOpen(false); },
      },
      {
        id: "view-list",
        label: "Switch to List View",
        description: "Table list layout",
        icon: <List className="w-4 h-4" />,
        group: "Actions",
        keywords: ["list", "table", "view"],
        action: () => { onSetViewMode?.("list"); setIsOpen(false); },
      },

      // --- Navigation ---
      {
        id: "nav-tasks",
        label: "Go to Tasks",
        description: "View all tasks",
        icon: <LayoutGrid className="w-4 h-4" />,
        group: "Navigation",
        keywords: ["tasks", "go", "navigate"],
        action: () => { onNavigateTab?.("tasks"); setIsOpen(false); },
      },
      {
        id: "nav-projects",
        label: "Go to Projects",
        description: "View all projects",
        icon: <FolderKanban className="w-4 h-4" />,
        group: "Navigation",
        keywords: ["projects", "go", "navigate"],
        action: () => { onNavigateTab?.("projects"); setIsOpen(false); },
      },
      {
        id: "nav-settings",
        label: "Go to Settings",
        description: "Account & profile settings",
        icon: <Settings className="w-4 h-4" />,
        group: "Navigation",
        keywords: ["settings", "account", "profile", "preferences"],
        action: () => { router.push("/settings/profile"); setIsOpen(false); },
      },

      // --- Theme ---
      {
        id: "theme-light",
        label: "Light Theme",
        description: "Switch to light mode",
        icon: <Sun className="w-4 h-4" />,
        group: "Theme",
        keywords: ["light", "theme", "mode", "bright"],
        action: () => { setTheme("light"); setIsOpen(false); },
      },
      {
        id: "theme-dark",
        label: "Dark Theme",
        description: "Switch to dark mode",
        icon: <Moon className="w-4 h-4" />,
        group: "Theme",
        keywords: ["dark", "theme", "mode", "night"],
        action: () => { setTheme("dark"); setIsOpen(false); },
      },
      {
        id: "theme-violet",
        label: "Violet Theme",
        description: "Switch to violet theme",
        icon: <Sparkles className="w-4 h-4 text-purple-500" />,
        group: "Theme",
        keywords: ["violet", "purple", "theme"],
        action: () => { setTheme("violet"); setIsOpen(false); },
      },
      {
        id: "theme-emerald",
        label: "Emerald Theme",
        description: "Switch to emerald theme",
        icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
        group: "Theme",
        keywords: ["emerald", "green", "theme"],
        action: () => { setTheme("emerald"); setIsOpen(false); },
      },

      // --- Account ---
      {
        id: "logout",
        label: "Log Out",
        description: `Sign out of ${user?.name || "your account"}`,
        icon: <LogOut className="w-4 h-4" />,
        group: "Account",
        keywords: ["logout", "sign out", "exit"],
        action: () => { logout(); setIsOpen(false); },
      },
    ];

    // Add task items for quick jump
    tasks.forEach((task) => {
      items.push({
        id: `task-${task.id}`,
        label: task.title,
        description: `${task.status} · ${task.priority} priority`,
        icon: statusIcons[task.status] || <FileText className="w-4 h-4" />,
        group: "Tasks",
        keywords: [task.title, task.category, task.status, task.priority, task.assignee?.name || ""].map(s => s.toLowerCase()),
        action: () => { onEditTask?.(task); setIsOpen(false); },
      });
    });

    return items;
  }, [tasks, user, theme, onCreateTask, onSetViewMode, onNavigateTab, onEditTask, logout, setTheme, router]);

  // Filter commands
  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((cmd) => {
      return (
        cmd.label.toLowerCase().includes(q) ||
        cmd.description?.toLowerCase().includes(q) ||
        cmd.keywords?.some((kw) => kw.includes(q))
      );
    });
  }, [commands, query]);

  // Group filtered commands
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    const groupOrder = ["Actions", "Tasks", "Navigation", "Theme", "Account"];
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push(cmd);
    });
    return groupOrder
      .filter((g) => groups[g]?.length)
      .map((g) => ({ group: g, items: groups[g] }));
  }, [filteredCommands]);

  // Flat list for keyboard nav
  const flatList = groupedCommands.flatMap((g) => g.items);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
        return;
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatList.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        flatList[selectedIndex]?.action();
      }
    },
    [isOpen, flatList, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              className="w-full max-w-[560px] rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 border-b border-zinc-100 dark:border-zinc-800">
                <Search className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 h-12 bg-transparent text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[360px] overflow-y-auto overscroll-contain py-2">
                {flatList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mb-3" />
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      No results found
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      Try searching for something else
                    </p>
                  </div>
                ) : (
                  groupedCommands.map((group) => (
                    <div key={group.group}>
                      {/* Group Header */}
                      <div className="px-4 pt-2.5 pb-1">
                        <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          {group.group}
                        </span>
                      </div>

                      {/* Group Items */}
                      {group.items.map((item) => {
                        const globalIdx = flatList.indexOf(item);
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75 ${
                              isSelected
                                ? "bg-zinc-100 dark:bg-zinc-800/80"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                            }`}
                          >
                            {/* Icon */}
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                              }`}
                            >
                              {item.icon}
                            </div>

                            {/* Label + Description */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[13px] font-semibold truncate ${
                                  isSelected
                                    ? "text-zinc-900 dark:text-zinc-50"
                                    : "text-zinc-700 dark:text-zinc-300"
                                }`}
                              >
                                {item.label}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Shortcut badge */}
                            {item.shortcut && (
                              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700">
                                {item.shortcut}
                              </kbd>
                            )}

                            {/* Arrow indicator for selected */}
                            {isSelected && (
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
                  <span className="flex items-center gap-1">
                    <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold">↑</kbd>
                    <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold">↓</kbd>
                    <span className="ml-0.5 font-medium">Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold">↵</kbd>
                    <span className="ml-0.5 font-medium">Select</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold">Esc</kbd>
                    <span className="ml-0.5 font-medium">Close</span>
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-zinc-300 dark:text-zinc-600 flex items-center gap-1">
                  <Command className="w-3 h-3" />K
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

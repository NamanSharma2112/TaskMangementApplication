"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  ChevronsUpDown,
  LayoutGrid,
  FolderKanban,
  BarChart3,
  History,
  Sun,
  Palette,
  Settings,
  ChevronRight,
  Check,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme, Theme } from "@/context/ThemeContext";

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const colorModes = [
  { id: "amber", name: "Amber", colorBg: "bg-amber-500" },
  { id: "blue", name: "Blue", colorBg: "bg-blue-600" },
  { id: "pink", name: "Pink", colorBg: "bg-pink-500" },
  { id: "rose", name: "Rose", colorBg: "bg-rose-600" },
  { id: "emerald", name: "Emerald", colorBg: "bg-emerald-600" },
  { id: "black", name: "Black", colorBg: "bg-zinc-950" },
];

const sidebarVariants = {
  hidden: { x: -240, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.15 + i * 0.06, ease: [0, 0, 0.58, 1] as const },
  }),
};

export function AppSidebar({
  isOpen,
  onToggle,
  activeTab = "tasks",
  setActiveTab,
}: AppSidebarProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showColorFlyout, setShowColorFlyout] = useState(false);
  const [activeColorMode, setActiveColorMode] = useState("blue");

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={onToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Drawer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 theme-sidebar border-r theme-border flex flex-col shrink-0 min-h-screen theme-fg select-none transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } relative`}
      >
      {/* Top User Header */}
      <motion.div
        className="p-4 border-b theme-border relative"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={user?.name || "User Profile"}
              className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <span className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
              {user?.name || "Dexter"}
            </span>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-zinc-400 shrink-0" />
        </motion.button>

        {/* User Profile Card Dropdown */}
        <AnimatePresence>
          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
              <motion.div
                className="absolute left-4 top-16 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-2xl z-50 space-y-3"
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* User Avatar & Email Header */}
                <div className="flex flex-col items-center text-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <img
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    }
                    alt={user?.name || "User Avatar"}
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 mb-2"
                  />
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {user?.name || "Dexter"}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {user?.email || "Dexter@gmail.com"}
                  </span>
                </div>

                {/* Menu items */}
                <div className="space-y-1 text-xs font-semibold">
                  {/* Change Theme */}
                  <motion.button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-4 h-4 text-zinc-500" />
                      <span>Change Theme</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </motion.button>

                  {/* Color Mode with Flyout Submenu */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowColorFlyout(!showColorFlyout)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span>Color Mode</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </motion.button>

                    {/* Color Mode Flyout Submenu */}
                    <AnimatePresence>
                      {showColorFlyout && (
                        <motion.div
                          className="absolute left-full top-0 ml-2 w-44 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl z-50 space-y-1"
                          initial={{ opacity: 0, x: -8, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -8, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase">
                            Color Mode
                          </p>
                          {colorModes.map((c) => (
                            <motion.button
                              key={c.id}
                              onClick={() => {
                                setActiveColorMode(c.id);
                                setShowColorFlyout(false);
                                setIsUserMenuOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-3.5 h-3.5 rounded-md ${c.colorBg}`} />
                                <span className="text-zinc-800 dark:text-zinc-200">{c.name}</span>
                              </div>
                              {activeColorMode === c.id && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Settings Link */}
                  <Link
                    href="/settings/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-zinc-500" />
                    <span>Settings</span>
                  </Link>

                  {/* Logout Button */}
                  <motion.button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mt-1 border-t border-zinc-100 dark:border-zinc-800 pt-2"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span className="font-semibold text-rose-600 dark:text-rose-400">Log Out</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Workspace Navigation */}
      <div className="p-3 space-y-6 flex-1">
        <div>
          <div className="flex items-center justify-between px-3 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-1">
            <span>Workspace</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>

          <nav className="space-y-1">
            <motion.button
              custom={0}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => setActiveTab && setActiveTab("tasks")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "tasks"
                  ? "theme-sidebar-active text-zinc-900 dark:text-zinc-50 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-[hsl(var(--accent))]"
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <LayoutGrid className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Tasks</span>
            </motion.button>

            <motion.button
              custom={1}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => setActiveTab && setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "projects"
                  ? "theme-sidebar-active text-zinc-900 dark:text-zinc-50 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-[hsl(var(--accent))]"
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <FolderKanban className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Projects</span>
            </motion.button>

            <motion.button
              custom={2}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => setActiveTab && setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "analytics"
                  ? "theme-sidebar-active text-zinc-900 dark:text-zinc-50 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-[hsl(var(--accent))]"
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Analytics</span>
            </motion.button>

            <motion.button
              custom={3}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => setActiveTab && setActiveTab("activity")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "activity"
                  ? "theme-sidebar-active text-zinc-900 dark:text-zinc-50 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-[hsl(var(--accent))]"
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <History className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Activity</span>
            </motion.button>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t theme-border">
        <Link
          href="/settings/profile"
          className="flex items-center gap-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <span>Account Settings</span>
        </Link>
      </div>
    </aside>
    </>
  );
}

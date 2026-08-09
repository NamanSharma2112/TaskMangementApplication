"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Search, User, Sun, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    {
      href: "/settings/profile",
      label: "Profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      href: "/settings/theme",
      label: "Theme",
      icon: <Sun className="w-4 h-4" />,
    },
    {
      href: "/settings/color",
      label: "Color",
      icon: <div className="w-3.5 h-3.5 rounded-sm bg-zinc-900 dark:bg-zinc-100" />,
    },
  ];

  return (
    <div className="min-h-screen flex theme-bg theme-fg">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r theme-border p-6 flex flex-col shrink-0 min-h-screen theme-sidebar">
        {/* Back to app */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to app</span>
        </Link>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="pl-9 h-9 text-xs rounded-xl theme-muted theme-border"
          />
        </div>

        {/* Nav list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname === "/settings" && item.href === "/settings/profile");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 sm:p-12 max-w-4xl">{children}</main>
    </div>
  );
}

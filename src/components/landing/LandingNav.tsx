"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Moon, Sun, LayoutGrid, Clock, BarChart3, ArrowRight } from "lucide-react";
import { PyramidLogo } from "@/components/ui/PyramidLogo";
import { useTheme } from "@/context/ThemeContext";

const MENU_LINKS = [
  { label: "Open the board", href: "#board", icon: LayoutGrid },
  { label: "Activity log", href: "#flow", icon: Clock },
  { label: "What's inside", href: "#inside", icon: BarChart3 },
  { label: "Continue as guest", href: "#cta", icon: ArrowRight },
];

const SPRING = { type: "spring" as const, stiffness: 220, damping: 26 };

export function LandingNav({ onGuest }: { onGuest: () => void }) {
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => setCondensed(latest > 90));

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("click", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isDark = theme === "dark";

  return (
    <motion.header
      animate={{ width: condensed ? "min(860px, 88%)" : "min(1060px, 94%)", y: condensed ? 4 : 0 }}
      transition={SPRING}
      className="fixed left-1/2 top-3.5 z-50 -translate-x-1/2 rounded-full border theme-border theme-card-blur shadow-xs backdrop-blur-xl"
    >
      <div className="flex h-14 items-center gap-5 pl-4 pr-2.5">
        <Link href="#top" className="mr-auto">
          <PyramidLogo iconSize={17} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {[
            { label: "Board", href: "#board" },
            { label: "Activity", href: "#flow" },
            { label: "Inside", href: "#inside" },
            { label: "FAQ", href: "#faq" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium theme-muted-fg transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="grid h-8 w-8 place-items-center rounded-full border theme-border theme-muted-fg transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={onGuest}
          className="hidden h-9 items-center rounded-full px-4 text-[13px] font-bold theme-btn-primary transition-opacity sm:inline-flex"
        >
          Continue as guest
        </button>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-full border theme-border theme-muted theme-muted-fg font-data text-[10px] font-semibold transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            NS
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                transition={SPRING}
                className="absolute right-0 top-11 w-56 rounded-2xl border theme-border theme-card p-1.5 shadow-lg"
              >
                {MENU_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.06, duration: 0.24 }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium theme-muted-fg transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <link.icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SPECS = [
  { label: "Views", value: "Board, list, projects, analytics" },
  { label: "Keyboard", value: "kbd" },
  { label: "Appearance", value: "4 themes, 6 accents" },
  { label: "Access", value: "JWT sessions, 4 roles" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function LandingHero({ onGuest }: { onGuest: () => void }) {
  return (
    <section
      id="top"
      className="pt-14 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] text-zinc-900/[0.05] dark:text-zinc-100/[0.06]"
    >
      <div className="mx-auto w-full max-w-[1080px] px-6 text-zinc-900 dark:text-zinc-50">
        <div className="max-w-[720px]">
          <motion.p
            {...fade(0)}
            className="font-data text-[10.5px] uppercase tracking-[0.16em] theme-muted-fg"
          >
            Task management for small teams
          </motion.p>
          <motion.h1
            {...fade(0.08)}
            className="mt-4 font-display text-[clamp(38px,5.2vw,60px)] font-bold leading-[1.08] tracking-[-0.032em] text-balance"
          >
            The board that keeps&nbsp;the receipts.
          </motion.h1>
          <motion.p {...fade(0.14)} className="mt-5 max-w-[60ch] text-[16.5px] leading-relaxed theme-muted-fg">
            A Kanban board, a grouped list and an analytics view over one set of tasks &mdash; with an activity
            log underneath that records who moved what, and when.
          </motion.p>
          <motion.div {...fade(0.2)} className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onGuest}
              className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-[13.5px] font-bold theme-btn-primary shadow-xs transition-transform hover:-translate-y-px"
            >
              Continue as guest
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#board"
              className="inline-flex h-11 items-center rounded-full border theme-border theme-card px-6 text-[13.5px] font-bold transition-transform hover:-translate-y-px"
            >
              See the board
            </a>
          </motion.div>
        </div>

        <motion.dl
          {...fade(0.26)}
          className="mt-11 grid grid-cols-2 gap-px border-y theme-border bg-[hsl(var(--border))] md:grid-cols-4"
        >
          {SPECS.map((spec) => (
            <div key={spec.label} className="theme-bg px-5 pb-5 pt-4">
              <dt className="font-data text-[10px] uppercase tracking-[0.14em] theme-muted-fg">{spec.label}</dt>
              <dd className="mt-1.5 text-[13.5px] font-medium">
                {spec.value === "kbd" ? (
                  <span className="flex items-center gap-2">
                    <kbd className="rounded-md border theme-border theme-muted px-1.5 py-0.5 font-data text-[10.5px] theme-muted-fg">
                      &#8984;K
                    </kbd>
                    palette
                    <kbd className="rounded-md border theme-border theme-muted px-1.5 py-0.5 font-data text-[10.5px] theme-muted-fg">
                      &#8984;F
                    </kbd>
                    search
                  </span>
                ) : (
                  spec.value
                )}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

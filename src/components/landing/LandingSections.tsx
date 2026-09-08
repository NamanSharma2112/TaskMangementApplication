"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Info } from "lucide-react";
import { useTheme, Theme } from "@/context/ThemeContext";
import { ROLES, STATUS_SPLIT, QUOTES, FAQS } from "./landing-data";

const STATS = [
  { figure: "4", label: "views over one task set" },
  { figure: "24", label: "appearances — four themes × six accents" },
  { figure: "0", label: "fields to fill before the board loads" },
  { figure: "100%", label: "of task changes write an activity row" },
];

const THEME_SWATCHES: { theme: Theme; label: string; swatch: string }[] = [
  { theme: "light", label: "LIGHT", swatch: "bg-white" },
  { theme: "dark", label: "DARK", swatch: "bg-[#050a16]" },
  { theme: "violet", label: "VIOLET", swatch: "bg-[#5b21f0]" },
  { theme: "emerald", label: "EMERALD", swatch: "bg-emerald-500" },
];

const ACCENTS = ["bg-amber-500", "bg-blue-500", "bg-purple-500", "bg-rose-600", "bg-emerald-500", "bg-zinc-900"];

/** Sections rise into place once, and stay put if the observer never fires. */
const rise = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionHead({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb?: string }) {
  return (
    <motion.div {...rise} className="mb-10 max-w-[56ch]">
      <p className="font-data text-[10.5px] uppercase tracking-[0.16em] theme-muted-fg">{eyebrow}</p>
      <h2 className="mt-3.5 font-display text-[clamp(26px,3.1vw,36px)] font-semibold tracking-[-0.032em] text-balance">
        {title}
      </h2>
      {blurb && <p className="mt-3.5 text-[15.5px] theme-muted-fg">{blurb}</p>}
    </motion.div>
  );
}

export function Stats() {
  return (
    <section className="border-y theme-border theme-muted">
      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-px bg-[hsl(var(--border))] md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.figure} className="theme-muted px-6 py-8">
            <b className="block font-display text-[32px] font-semibold leading-none tracking-[-0.04em] tabular-nums">
              {stat.figure}
            </b>
            <span className="mt-2.5 block max-w-[26ch] text-[12.5px] theme-muted-fg">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureTiles() {
  const { theme, setTheme } = useTheme();

  return (
    <section id="inside" className="pb-24">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <SectionHead eyebrow="What's inside" title="Four things it does properly." />

        <div className="grid gap-5 md:grid-cols-2">
          <motion.div {...rise} className="flex flex-col gap-3.5 rounded-3xl border theme-border theme-card p-6 shadow-2xs">
            <h3 className="font-display text-[17px] font-semibold">Board and list, same tasks</h3>
            <p className="text-[13.5px] theme-muted-fg">
              Drag across the four columns, or switch to the grouped list when you want owners and dates lined
              up. The Fields popover decides what the list shows &mdash; and it remembers.
            </p>
            <ul className="mt-auto pt-1.5">
              {[
                { title: "Command palette, scoped to the view", meta: "Aisha R.", done: true },
                { title: "Notification fan-out on assignee change", due: "Today" },
                { title: "Rate-limit /auth/guest per IP", due: "Sep 12" },
              ].map((row) => (
                <li
                  key={row.title}
                  className="flex items-center gap-2.5 border-t border-zinc-100 py-2.5 text-[12px] theme-muted-fg first:border-t-0 dark:border-zinc-800"
                >
                  <span
                    className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[5px] border-[1.5px] ${
                      row.done ? "border-emerald-500 bg-emerald-500 text-white" : "theme-border"
                    }`}
                  >
                    {row.done && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium text-zinc-900 dark:text-zinc-100">
                    {row.title}
                  </span>
                  {row.meta && <span className="font-data text-[11px]">{row.meta}</span>}
                  {row.due && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 font-data text-[10px] font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                      {row.due}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...rise} className="flex flex-col gap-3.5 rounded-3xl border theme-border theme-card p-6 shadow-2xs">
            <h3 className="font-display text-[17px] font-semibold">Analytics you&rsquo;d actually open</h3>
            <p className="text-[13.5px] theme-muted-fg">
              Status and priority distribution across the workspace, created against completed over the last
              fortnight, and a workload table showing who is carrying the sprint.
            </p>
            <div className="mt-auto pt-1.5">
              <div
                className="flex h-2.5 overflow-hidden rounded-full theme-muted"
                role="img"
                aria-label={STATUS_SPLIT.map((s) => `${s.label} ${s.value} percent`).join(", ")}
              >
                {STATUS_SPLIT.map((slice) => (
                  <i key={slice.label} className={slice.color} style={{ width: `${slice.value}%` }} />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] theme-muted-fg">
                {STATUS_SPLIT.map((slice) => (
                  <span key={slice.label} className="inline-flex items-center gap-1.5">
                    <i className={`h-2 w-2 rounded-full ${slice.color}`} />
                    {slice.label}{" "}
                    <b className="font-data font-semibold text-zinc-900 dark:text-zinc-100">{slice.value}%</b>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div {...rise} className="flex flex-col gap-3.5 rounded-3xl border theme-border theme-card p-6 shadow-2xs">
            <h3 className="font-display text-[17px] font-semibold">Roles that hold</h3>
            <p className="text-[13.5px] theme-muted-fg">
              Four roles, checked on the server for every request &mdash; not hidden buttons in the interface.
            </p>
            <ul className="mt-auto pt-1.5">
              {ROLES.map((row) => (
                <li
                  key={row.role}
                  className="grid grid-cols-[88px_1fr] items-center gap-3 border-t border-zinc-100 py-2 text-[12.5px] theme-muted-fg first:border-t-0 dark:border-zinc-800"
                >
                  <span className="rounded-md border theme-border theme-muted py-0.5 text-center font-data text-[9.5px] font-semibold tracking-[0.09em] text-zinc-900 dark:text-zinc-100">
                    {row.role}
                  </span>
                  <span>{row.can}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...rise} className="flex flex-col gap-3.5 rounded-3xl border theme-border theme-card p-6 shadow-2xs">
            <h3 className="font-display text-[17px] font-semibold">Make it yours</h3>
            <p className="text-[13.5px] theme-muted-fg">
              Light, Dark, Violet and Emerald are full palettes rather than filters. Try one &mdash; this page
              uses the same tokens as the app.
            </p>
            <div className="mt-auto pt-1.5">
              <div className="flex gap-2.5">
                {THEME_SWATCHES.map((option) => (
                  <button
                    key={option.theme}
                    type="button"
                    onClick={() => setTheme(option.theme)}
                    aria-pressed={theme === option.theme}
                    className={`flex-1 overflow-hidden rounded-xl border transition-transform hover:-translate-y-0.5 ${
                      theme === option.theme ? "border-zinc-900 dark:border-zinc-100" : "theme-border"
                    }`}
                  >
                    <i className={`block h-9 ${option.swatch}`} />
                    <em className="block theme-card py-1 text-center font-data text-[8.5px] not-italic tracking-[0.08em] theme-muted-fg">
                      {option.label}
                    </em>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2" aria-hidden>
                {ACCENTS.map((accent) => (
                  <i key={accent} className={`h-4 w-4 rounded-full border theme-border ${accent}`} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Quotes() {
  return (
    <section id="teams" className="pb-24">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <SectionHead eyebrow="How teams use it" title="One board, no standup theatre." />
        <div className="grid gap-5 md:grid-cols-3">
          {QUOTES.map((item) => (
            <motion.figure
              {...rise}
              key={item.name}
              className="m-0 flex flex-col rounded-3xl border theme-border theme-card p-6 shadow-2xs"
            >
              <blockquote className="font-display text-[15.5px] leading-snug tracking-[-0.018em]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-2.5 pt-5">
                <i className="grid h-[30px] w-[30px] place-items-center rounded-full border theme-border theme-muted text-[10.5px] font-bold not-italic theme-muted-fg">
                  {item.initials}
                </i>
                <span>
                  <strong className="block text-[12.5px] font-semibold">{item.name}</strong>
                  <span className="block text-[11.5px] theme-muted-fg">{item.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="mt-6 flex max-w-[72ch] items-start gap-2 border-l-2 theme-border pl-3 text-[12px] theme-muted-fg">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Illustrative quotes from fictional teams, written to show how Pyramid is meant to be used. They are not
          real customer reviews.
        </p>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="pb-24">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <SectionHead eyebrow="Questions" title="Before you open the board." />
        <motion.div {...rise} className="max-w-[740px]">
          {FAQS.map((item, i) => (
            <div key={item.q} className="border-b theme-border">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center gap-4 py-4.5 text-left font-display text-[16px] font-medium tracking-[-0.02em]"
              >
                {item.q}
                <Plus
                  className={`ml-auto h-4 w-4 shrink-0 theme-muted-fg transition-transform duration-300 ${
                    open === i ? "rotate-[135deg]" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="max-w-[66ch] pb-5 text-[14px] theme-muted-fg">{item.a}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ClosingCta({ onGuest }: { onGuest: () => void }) {
  return (
    <section id="cta" className="pb-24">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <motion.div
          {...rise}
          className="flex flex-wrap items-center justify-between gap-8 rounded-[26px] border theme-border theme-muted p-10 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] text-zinc-900/[0.05] dark:text-zinc-100/[0.06]"
        >
          <div className="text-zinc-900 dark:text-zinc-50">
            <h2 className="font-display text-[clamp(23px,2.7vw,30px)] font-semibold tracking-[-0.032em]">
              Open a board in about four seconds.
            </h2>
            <p className="mt-2.5 max-w-[44ch] text-[14px] theme-muted-fg">
              Guest access needs no email. Add one when you want the board to be yours &mdash; the same
              workspace comes with you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onGuest}
              className="inline-flex h-11 items-center rounded-full px-6 text-[13.5px] font-bold theme-btn-primary transition-transform hover:-translate-y-px"
            >
              Continue as guest
            </button>
            <a
              href="#inside"
              className="inline-flex h-11 items-center rounded-full border theme-border theme-card px-6 text-[13.5px] font-bold text-zinc-900 transition-transform hover:-translate-y-px dark:text-zinc-50"
            >
              Read what&rsquo;s inside
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

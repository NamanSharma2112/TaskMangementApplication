"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Search, Bell, LayoutGrid, List, Folder, BarChart3, Clock, MousePointer2 } from "lucide-react";
import { PREVIEW_COLUMNS, DRAGGED_CARD, PreviewCard } from "./landing-data";

const SIDEBAR = [
  { label: "Board", icon: LayoutGrid, href: "#board", active: true },
  { label: "List", icon: List, href: "#inside" },
  { label: "Projects", icon: Folder, href: "#inside" },
  { label: "Analytics", icon: BarChart3, href: "#inside" },
  { label: "Activity", icon: Clock, href: "#flow" },
];

function Card({ card, dragging }: { card: PreviewCard; dragging?: boolean }) {
  return (
    <article
      className={`rounded-2xl border theme-border theme-card p-3 shadow-2xs ${
        dragging ? "border-dashed shadow-lg" : "transition-transform hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <h4 className="text-[12.5px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{card.title}</h4>
      <div className="mt-2.5 flex min-h-5 items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium theme-muted-fg">
          <i className="grid h-[18px] w-[18px] place-items-center rounded-full border theme-border theme-muted text-[8.5px] font-bold not-italic">
            {card.assignee.initials}
          </i>
          {card.assignee.name}
        </span>
        {card.due && (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 font-data text-[10px] font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            {card.due}
          </span>
        )}
        {card.tag && (
          <span className="rounded-md theme-muted px-2 py-0.5 text-[10px] font-semibold theme-muted-fg">
            {card.tag}
          </span>
        )}
      </div>
    </article>
  );
}

export function BoardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [9, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.982, 1]);

  return (
    <div id="board" ref={ref} className="pb-24 pt-11 [perspective:1400px]">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <motion.div
          style={reduce ? undefined : { rotateX, scale }}
          className="overflow-hidden rounded-3xl border theme-border theme-card shadow-2xl [transform-origin:50%_0]"
        >
          <div className="flex items-center gap-3.5 border-b theme-border theme-muted px-4 py-2.5">
            <span className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <i key={i} className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--border))]" />
              ))}
            </span>
            <span className="flex h-[30px] max-w-[300px] flex-1 items-center gap-2 rounded-full border theme-border theme-card px-3 text-[12.5px] theme-muted-fg">
              <Search className="h-3.5 w-3.5" />
              Search tasks
              <kbd className="ml-auto rounded-md border theme-border theme-muted px-1.5 py-0.5 font-data text-[10px]">
                &#8984;F
              </kbd>
            </span>
            <span className="ml-auto flex items-center gap-5">
              <span className="relative grid place-items-center theme-muted-fg">
                <Bell className="h-4 w-4" />
                <b className="absolute -right-1.5 -top-1 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-rose-500 px-1 font-data text-[9px] text-white">
                  3
                </b>
              </span>
              <span className="flex">
                {["NS", "AR", "ML"].map((initials, i) => (
                  <span
                    key={initials}
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                    className="grid h-6 w-6 place-items-center rounded-full border-2 border-[hsl(var(--muted))] bg-zinc-900 text-[9.5px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    {initials}
                  </span>
                ))}
              </span>
            </span>
          </div>

          <div className="grid md:grid-cols-[180px_minmax(0,1fr)]">
            <aside className="hidden content-start gap-0.5 border-r theme-border theme-muted p-2.5 md:grid">
              <p className="px-2.5 pb-1.5 pt-2 font-data text-[9.5px] uppercase tracking-[0.14em] theme-muted-fg">
                Workspace
              </p>
              {SIDEBAR.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[12.5px] font-medium ${
                    item.active
                      ? "theme-sidebar-active font-semibold text-zinc-900 dark:text-zinc-100"
                      : "theme-muted-fg"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  {item.label}
                </a>
              ))}
            </aside>

            <div className="relative overflow-x-auto p-4">
              <div className="grid min-w-[700px] grid-cols-4 gap-3">
                {PREVIEW_COLUMNS.map((column) => (
                  <div key={column.id}>
                    <div className="mb-2.5 flex h-5 items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${column.colorDot}`} />
                      <em className="font-display text-[12.5px] font-bold not-italic">
                        {column.title}
                      </em>
                      <span className="ml-auto font-data text-[10.5px] theme-muted-fg">
                        {column.isDropTarget ? 1 : column.cards.length}
                      </span>
                    </div>
                    <div
                      className={`grid min-h-24 content-start gap-2.5 rounded-2xl p-1.5 ${
                        column.isDropTarget
                          ? "border-[1.5px] border-dashed border-blue-500 bg-blue-500/[0.07]"
                          : ""
                      }`}
                    >
                      {column.isDropTarget ? (
                        <div className="grid h-[150px] justify-center rounded-2xl border-[1.5px] border-dashed border-[hsl(var(--border))] pt-2.5 font-data text-[10px] theme-muted-fg">
                          drop here
                        </div>
                      ) : (
                        column.cards.map((card) => <Card key={card.title} card={card} />)
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* The card in transit, hovering inside the Doing column's drop zone. */}
              <motion.div
                aria-hidden
                animate={reduce ? undefined : { x: [-6, 8, -6], y: [4, -6, 4], rotate: [2.4, -1.4, 2.4] }}
                transition={{ duration: 5.4, ease: "easeInOut", repeat: Infinity }}
                className="absolute left-[28.5%] top-[104px] z-10 w-[164px]"
              >
                <Card card={DRAGGED_CARD} dragging />
                <MousePointer2 className="absolute left-[70px] top-[54px] h-[19px] w-[19px] fill-[hsl(var(--card))] text-zinc-900 dark:text-zinc-100" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <p className="mt-4 max-w-[74ch] text-[12.5px] theme-muted-fg">
          A card on its way from <b className="font-semibold text-zinc-900 dark:text-zinc-100">To&nbsp;Do</b> to{" "}
          <b className="font-semibold text-zinc-900 dark:text-zinc-100">Doing</b> &mdash; the target column stays
          outlined while you drag, and the drop writes one activity row.
        </p>
      </div>
    </div>
  );
}

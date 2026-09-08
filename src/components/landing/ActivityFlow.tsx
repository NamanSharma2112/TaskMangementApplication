"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import { FLOW_SOURCES } from "./landing-data";

/** A short lit segment chasing along each path, the way a change travels to the log. */
const SEGMENT = 0.09;
const GAP = 1 - SEGMENT;

export function ActivityFlow() {
  const reduce = useReducedMotion();

  return (
    <section id="flow" className="py-24">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <div className="mb-10 max-w-[56ch]">
          <p className="font-data text-[10.5px] uppercase tracking-[0.16em] theme-muted-fg">The activity log</p>
          <h2 className="mt-3.5 font-display text-[clamp(26px,3.1vw,36px)] font-semibold tracking-[-0.032em] text-balance">
            Five kinds of change. One place they all land.
          </h2>
          <p className="mt-3.5 text-[15.5px] theme-muted-fg">
            Move a card, check a subtask, post a comment &mdash; each one writes a row with the actor, a readable
            message, and the payload of what changed.
          </p>
        </div>

        {/* Stage matches the 720x400 viewBox so each chip can sit on its line's start point. */}
        <div className="relative mx-auto hidden aspect-[720/400] w-full max-w-[760px] sm:block">
          {FLOW_SOURCES.map((source) => (
            <span
              key={source.label}
              style={{
                left: source.chip.left,
                right: source.chip.right,
                top: source.chip.top,
                transform: source.chip.translate,
              }}
              className="absolute z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full border theme-border theme-card-blur px-3 py-1.5 font-data text-[clamp(8.5px,1.06vw,11px)] uppercase tracking-[0.07em] theme-muted-fg shadow-xs backdrop-blur-sm"
            >
              <i className={`h-2 w-2 rounded-full ${source.dot}`} />
              {source.label}
            </span>
          ))}

          <svg viewBox="0 0 720 400" fill="none" role="presentation" className="absolute inset-0 h-full w-full">
            {FLOW_SOURCES.map((source) => (
              <path
                key={`base-${source.label}`}
                d={source.d}
                strokeWidth={2.5}
                className="stroke-[hsl(var(--border))]"
              />
            ))}
            {FLOW_SOURCES.map((source) => (
              <motion.path
                key={`pulse-${source.label}`}
                d={source.d}
                pathLength={1}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={`${SEGMENT} ${GAP}`}
                className={source.stroke}
                initial={{ strokeDashoffset: 0 }}
                animate={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: -1 }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity, delay: source.delay }}
              />
            ))}
          </svg>

          <div className="absolute bottom-0 left-1/2 w-[min(300px,42%)] -translate-x-1/2 overflow-hidden rounded-2xl border theme-border theme-card shadow-lg">
            <header className="flex items-center gap-2 border-b theme-border theme-muted px-3 py-2.5 font-data text-[9.5px] uppercase tracking-[0.14em] theme-muted-fg">
              <Clock className="h-3 w-3 shrink-0" />
              Activity
            </header>
            <ul>
              {[
                { time: "09:14", who: "Naman", what: "moved a card to Doing" },
                { time: "09:02", who: "Aisha", what: "checked a subtask" },
              ].map((row) => (
                <li
                  key={row.time}
                  className="flex items-baseline gap-2 border-b border-zinc-100 px-3 py-2 text-[11.5px] theme-muted-fg last:border-b-0 dark:border-zinc-800"
                >
                  <time className="font-data text-[9.5px] theme-muted-fg">{row.time}</time>
                  <span>
                    <b className="font-semibold text-zinc-900 dark:text-zinc-100">{row.who}</b> {row.what}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Narrow screens get the same five sources as a plain list. */}
        <ul className="mx-auto grid max-w-[420px] gap-2.5 sm:hidden">
          {FLOW_SOURCES.map((source) => (
            <li
              key={source.label}
              className="flex items-center gap-2.5 rounded-xl border theme-border theme-card px-3.5 py-2.5 font-data text-[10.5px] uppercase tracking-[0.07em] theme-muted-fg"
            >
              <i className={`h-2 w-2 rounded-full ${source.dot}`} />
              {source.label}
            </li>
          ))}
          <li className="rounded-xl theme-muted px-3.5 py-2.5 text-center font-data text-[10.5px] theme-muted-fg">
            &darr; one activity row each
          </li>
        </ul>

        <p className="mt-7 max-w-[74ch] text-[12.5px] theme-muted-fg">
          The same event decides who hears about it: the assignee and the reporter get a notification, and you
          never get one for your own action.
        </p>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  UserX,
} from "lucide-react";
import { api } from "@/lib/api";
import { AnalyticsOverview } from "@/types/task";

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  doing: "Doing",
  completed: "Completed",
  "on-hold": "On Hold",
  backlog: "Backlog",
};

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-amber-400",
  "in-progress": "bg-blue-500",
  doing: "bg-sky-500",
  completed: "bg-emerald-500",
  "on-hold": "bg-purple-400",
  backlog: "bg-zinc-400",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-rose-500",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-emerald-500",
  "no-priority": "bg-zinc-300 dark:bg-zinc-600",
};

function StatCard({
  label,
  value,
  icon,
  accent,
  hint,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        <span className={`p-1.5 rounded-lg ${accent}`}>{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      {hint && <p className="text-[11px] font-medium text-zinc-400 mt-0.5">{hint}</p>}
    </div>
  );
}

/** Horizontal proportional bar used for the status and priority breakdowns. */
function DistributionBar({
  data,
  colors,
  labels,
}: {
  data: Record<string, number>;
  colors: Record<string, string>;
  labels?: Record<string, string>;
}) {
  const entries = Object.entries(data).filter(([, count]) => count > 0);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) {
    return <p className="text-xs text-zinc-400 font-medium">No tasks yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        {entries.map(([key, count]) => (
          <div
            key={key}
            className={colors[key] || "bg-zinc-400"}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${labels?.[key] || key}: ${count}`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {entries.map(([key, count]) => (
          <li key={key} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${colors[key] || "bg-zinc-400"}`} />
              <span className="truncate font-medium text-zinc-600 dark:text-zinc-400">
                {labels?.[key] || key}
              </span>
            </span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Created-vs-completed columns; pure CSS so no chart library is needed. */
function ThroughputChart({ points }: { points: AnalyticsOverview["throughput"] }) {
  const max = useMemo(
    () => Math.max(1, ...points.map((p) => Math.max(p.created, p.completed))),
    [points],
  );

  return (
    <div>
      {/* items-stretch (the default) is load-bearing: the columns must fill the
          row's height for the percentage bar heights below to resolve. */}
      <div className="flex gap-1.5 h-32">
        {points.map((point) => (
          <div key={point.date} className="flex-1 flex items-end gap-0.5 group relative">
            <div
              className="flex-1 rounded-t bg-blue-500/80 min-h-[2px] transition-all"
              style={{ height: `${(point.created / max) * 100}%` }}
            />
            <div
              className="flex-1 rounded-t bg-emerald-500/80 min-h-[2px] transition-all"
              style={{ height: `${(point.completed / max) * 100}%` }}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 dark:bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-white dark:text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {point.date}: +{point.created} / ✓{point.completed}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[11px] font-medium text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Created
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
        </span>
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.analytics
      .overview(14)
      .then((overview) => {
        if (!cancelled) {
          setData(overview);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Analytics need the API running on port 4000.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <p className="text-sm text-zinc-400 font-medium py-10 text-center">Loading analytics…</p>;
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
        <AlertTriangle className="w-5 h-5 mx-auto text-amber-500 mb-2" />
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {error || "Analytics unavailable"}
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Start it with <code className="font-mono">cd backend &amp;&amp; npm run start:dev</code>
        </p>
      </div>
    );
  }

  const { summary, workload, throughput, projects } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Open"
          value={summary.totals.open}
          icon={<ListTodo className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          accent="bg-blue-500/10"
          hint={`of ${summary.totals.tasks} total`}
        />
        <StatCard
          label="Completed"
          value={summary.totals.completed}
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          accent="bg-emerald-500/10"
          hint={`${summary.completionRate}% completion rate`}
        />
        <StatCard
          label="Overdue"
          value={summary.totals.overdue}
          icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
          accent="bg-rose-500/10"
          hint="past their due date"
        />
        <StatCard
          label="Due this week"
          value={summary.totals.dueThisWeek}
          icon={<CalendarClock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          accent="bg-amber-500/10"
          hint="next 7 days"
        />
        <StatCard
          label="Unassigned"
          value={summary.totals.unassigned}
          icon={<UserX className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
          accent="bg-purple-500/10"
          hint="need an owner"
        />
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Tasks by status
          </h3>
          <DistributionBar
            data={summary.byStatus}
            colors={STATUS_COLORS}
            labels={STATUS_LABELS}
          />
        </div>
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Tasks by priority
          </h3>
          <DistributionBar data={summary.byPriority} colors={PRIORITY_COLORS} />
        </div>
      </div>

      {/* Throughput */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xs">
        <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          <TrendingUp className="w-4 h-4 text-zinc-400" />
          Throughput — last {throughput.length} days
        </h3>
        <ThroughputChart points={throughput} />
      </div>

      {/* Workload */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <h3 className="px-5 py-3.5 text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800">
          Team workload
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-400 font-semibold">
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-4 w-20">Role</th>
                <th className="py-3 px-4 w-16 text-right">Open</th>
                <th className="py-3 px-4 w-20 text-right">Overdue</th>
                <th className="py-3 px-4 w-44">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {workload.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-500 font-medium">{member.role}</td>
                  <td className="py-3 px-4 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {member.open}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold tabular-nums ${
                      member.overdue > 0 ? "text-rose-500" : "text-zinc-400"
                    }`}
                  >
                    {member.overdue}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-500 tabular-nums w-9 text-right">
                        {member.completionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project progress */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Project progress
        </h3>
        {projects.length === 0 ? (
          <p className="text-xs text-zinc-400 font-medium">No projects yet.</p>
        ) : (
          <ul className="space-y-3.5">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {project.title}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-400 shrink-0 tabular-nums">
                    {project.completedTasks}/{project.totalTasks} · {project.progress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full theme-btn-primary"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

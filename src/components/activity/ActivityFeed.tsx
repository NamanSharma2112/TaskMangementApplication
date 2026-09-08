"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity as ActivityIcon,
  ArrowRightLeft,
  Copy,
  FolderPlus,
  MessageSquare,
  Plus,
  Trash2,
  UserCheck,
  Archive,
  CheckSquare,
} from "lucide-react";
import { api } from "@/lib/api";
import { ActivityEntry } from "@/types/task";

const ICONS: Record<string, React.ReactNode> = {
  "task.created": <Plus className="w-3.5 h-3.5" />,
  "task.status_changed": <ArrowRightLeft className="w-3.5 h-3.5" />,
  "task.assigned": <UserCheck className="w-3.5 h-3.5" />,
  "task.archived": <Archive className="w-3.5 h-3.5" />,
  "task.duplicated": <Copy className="w-3.5 h-3.5" />,
  "task.deleted": <Trash2 className="w-3.5 h-3.5" />,
  "comment.added": <MessageSquare className="w-3.5 h-3.5" />,
  "subtask.created": <CheckSquare className="w-3.5 h-3.5" />,
  "subtask.toggled": <CheckSquare className="w-3.5 h-3.5" />,
  "subtask.deleted": <Trash2 className="w-3.5 h-3.5" />,
  "project.created": <FolderPlus className="w-3.5 h-3.5" />,
  "project.status_changed": <ArrowRightLeft className="w-3.5 h-3.5" />,
  "project.deleted": <Trash2 className="w-3.5 h-3.5" />,
};

const ACCENTS: Record<string, string> = {
  "task.created": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "task.status_changed": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "task.assigned": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "task.deleted": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "project.deleted": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "subtask.deleted": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "comment.added": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h ago`;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ActivityFeedProps {
  /** Omit to show the workspace-wide feed. */
  taskId?: string;
  limit?: number;
  compact?: boolean;
}

export function ActivityFeed({ taskId, limit = 50, compact = false }: ActivityFeedProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = taskId ? api.activity.forTask(taskId) : api.activity.feed(limit);

    load
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Activity needs the API running on port 4000.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [taskId, limit]);

  if (isLoading) {
    return <p className="text-xs text-zinc-400 font-medium py-6 text-center">Loading activity…</p>;
  }

  if (error) {
    return <p className="text-xs text-amber-600 dark:text-amber-400 font-medium py-4">{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="py-10 flex flex-col items-center gap-2 text-zinc-400">
        <ActivityIcon className="w-5 h-5" />
        <p className="text-xs font-medium">Nothing has happened here yet.</p>
      </div>
    );
  }

  return (
    <ul className={compact ? "space-y-2.5" : "space-y-1"}>
      {entries.map((entry, index) => (
        <motion.li
          key={entry.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
          className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${
            compact ? "" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
          }`}
        >
          <span
            className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
              ACCENTS[entry.type] || "bg-zinc-500/10 text-zinc-500"
            }`}
          >
            {ICONS[entry.type] || <ActivityIcon className="w-3.5 h-3.5" />}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs leading-snug text-zinc-700 dark:text-zinc-300">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {entry.actor?.name || "Someone"}
              </span>{" "}
              {entry.message}
            </p>
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
              {formatTimestamp(entry.createdAt)}
              {entry.project ? ` · ${entry.project.title}` : ""}
            </p>
          </div>

          {entry.actor?.avatar && (
            <img
              src={entry.actor.avatar}
              alt={entry.actor.name}
              className="w-5 h-5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
            />
          )}
        </motion.li>
      ))}
    </ul>
  );
}

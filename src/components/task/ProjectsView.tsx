"use client";

import React, { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Project } from "@/types/task";
import { useAuth } from "@/context/AuthContext";
import {
  AlertTriangle,
  Check,
  MoreHorizontal,
  Plus,
  Signal,
  Trash2,
  X,
} from "lucide-react";

interface ProjectsViewProps {
  onSelectProject?: (title: string, id: string) => void;
}

const PROJECT_STATUSES = ["Active", "Planning", "On Hold", "Completed", "Archived"];
const PROJECT_PRIORITIES = ["urgent", "high", "medium", "low", "no-priority"];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Planning: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "On Hold": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Completed: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  Archived: "bg-zinc-500/10 text-zinc-500",
};

function priorityStyle(p: string) {
  if (p === "urgent") return { color: "text-rose-600 dark:text-rose-400", label: "Urgent" };
  if (p === "high") return { color: "text-rose-500", label: "High" };
  if (p === "medium") return { color: "text-amber-500", label: "Medium" };
  if (p === "low") return { color: "text-emerald-500", label: "Low" };
  return { color: "text-zinc-400 dark:text-zinc-500", label: "None" };
}

export function ProjectsView({ onSelectProject }: ProjectsViewProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDueDate, setNewDueDate] = useState("");

  // Only ADMIN and MANAGER can mutate projects; the API enforces this too.
  const canManage = user?.role === "ADMIN" || user?.role === "MANAGER";

  const load = useCallback(async () => {
    try {
      setProjects(await api.projects.list());
      setError(null);
    } catch {
      setError("Projects need the API running on port 4000.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const created = await api.projects.create({
        title: newTitle.trim(),
        priority: newPriority as Project["priority"],
        dueDate: newDueDate || undefined,
      });
      setProjects((prev) => [created, ...prev]);
      setNewTitle("");
      setNewDueDate("");
      setIsCreating(false);
      setError(null);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Could not create the project.",
      );
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setOpenMenuId(null);
    try {
      const updated = await api.projects.update(id, { status });
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not update the project.");
    }
  };

  const handleDelete = async (id: string) => {
    setOpenMenuId(null);
    const previous = projects;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.projects.remove(id);
      setError(null);
    } catch (e) {
      setProjects(previous);
      setError(
        e instanceof ApiError ? e.message : "Could not delete the project.",
      );
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-0.5 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-400 dark:text-zinc-500 font-semibold">
                <th className="py-3.5 px-5">Projects</th>
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4 w-28">Priority</th>
                <th className="py-3.5 px-4 w-40">Progress</th>
                <th className="py-3.5 px-4 w-24">Lead</th>
                <th className="py-3.5 px-4 w-32">Due Date</th>
                <th className="py-3.5 px-4 w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium text-zinc-800 dark:text-zinc-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 px-5 text-center text-zinc-400 font-medium">
                    Loading projects…
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-5 text-center text-zinc-400 font-medium">
                    No projects yet.
                  </td>
                </tr>
              ) : (
                projects.map((p) => {
                  const pStyle = priorityStyle(p.priority);
                  const progress = p.progress ?? 0;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProject?.(p.title, p.id)}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {p.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            statusStyles[p.status || "Active"] || statusStyles.Active
                          }`}
                        >
                          {p.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className={`flex items-center gap-1.5 font-semibold ${pStyle.color}`}>
                          <Signal className="w-3.5 h-3.5" />
                          <span>{pStyle.label}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 tabular-nums w-14 text-right">
                            {p.completedTasks ?? 0}/{p.totalTasks ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.lead?.avatar ? (
                          <img
                            src={p.lead.avatar}
                            alt={p.lead.name}
                            className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {p.lead?.name?.charAt(0) || "—"}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 font-medium">
                        {p.dueDate || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right relative">
                        {canManage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === p.id ? null : p.id);
                            }}
                            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        )}

                        {openMenuId === p.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                              }}
                            />
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-4 top-10 z-50 w-44 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl text-left"
                            >
                              <p className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase">
                                Set status
                              </p>
                              {PROJECT_STATUSES.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(p.id, s)}
                                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                  <span>{s}</span>
                                  {p.status === s && <Check className="w-3.5 h-3.5" />}
                                </button>
                              ))}
                              {user?.role === "ADMIN" && (
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 mt-1 border-t border-zinc-100 dark:border-zinc-800 pt-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete project
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Inline create row */}
        <div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {!canManage ? (
            <p className="px-3 py-1.5 text-[11px] font-medium text-zinc-400">
              Creating projects requires an ADMIN or MANAGER role.
            </p>
          ) : isCreating ? (
            <div className="flex flex-wrap items-center gap-2 px-1">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Project title"
                autoFocus
                className="flex-1 min-w-[180px] h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-semibold"
              >
                {PROJECT_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {priorityStyle(p).label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-medium"
              />
              <button
                onClick={handleCreate}
                className="h-9 px-4 rounded-xl theme-btn-primary text-xs font-bold"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle("");
                }}
                className="h-9 px-3 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

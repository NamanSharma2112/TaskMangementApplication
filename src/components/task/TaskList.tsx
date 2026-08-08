"use client";

import React from "react";
import { Task, TaskStatus } from "@/types/task";
import { ChevronDown, MoreHorizontal, Plus, Signal, User } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddTaskGroup?: (status: TaskStatus) => void;
  visibleFields?: Record<string, boolean>;
}

const statusGroups: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "Doing" },
  { id: "completed", label: "Completed" },
];

export function TaskList({ tasks, onEditTask, onAddTaskGroup, visibleFields }: TaskListProps) {
  const getPriorityStyle = (p: string) => {
    if (p === "high") return { color: "text-rose-500", label: "High" };
    if (p === "medium") return { color: "text-amber-500", label: "Medium" };
    return { color: "text-zinc-400 dark:text-zinc-500", label: "Low" };
  };

  return (
    <div className="space-y-6">
      {statusGroups.map((group) => {
        const groupTasks = tasks.filter((t) =>
          group.id === "in-progress"
            ? t.status === "in-progress" || t.status === ("doing" as TaskStatus)
            : t.status === group.id
        );

        return (
          <div key={group.id} className="space-y-2">
            {/* Status Section Accordion Header */}
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
              <ChevronDown className="w-4 h-4 text-zinc-500" />
              <span>{group.label}</span>
            </div>

            {/* Table Container matching Screenshot 3 & 4 */}
            <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-400 dark:text-zinc-500 font-medium">
                    <th className="py-3 px-5 font-semibold">Task</th>
                    {visibleFields?.priority !== false && <th className="py-3 px-4 font-semibold w-32">Priority</th>}
                    {visibleFields?.members !== false && <th className="py-3 px-4 font-semibold w-32">Members</th>}
                    {visibleFields?.dueDate !== false && <th className="py-3 px-4 font-semibold w-36">Due Date</th>}
                    <th className="py-3 px-4 font-semibold w-16 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-800 dark:text-zinc-200 font-medium">
                  {groupTasks.map((t) => {
                    const pStyle = getPriorityStyle(t.priority);
                    return (
                      <tr
                        key={t.id}
                        onClick={() => onEditTask(t)}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                      >
                        {/* Task Title */}
                        <td className="py-3.5 px-5 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          {t.title}
                        </td>

                        {/* Priority with signal bars */}
                        {visibleFields?.priority !== false && (
                          <td className="py-3.5 px-4">
                            <div className={`flex items-center gap-1.5 font-semibold ${pStyle.color}`}>
                              <Signal className="w-3.5 h-3.5" />
                              <span>{pStyle.label}</span>
                            </div>
                          </td>
                        )}

                        {/* Members Avatar / Pill */}
                        {visibleFields?.members !== false && (
                          <td className="py-3.5 px-4">
                            {t.assignee?.avatar ? (
                              <img
                                src={t.assignee.avatar}
                                alt={t.assignee.name}
                                className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-600 dark:text-zinc-300 font-bold border border-zinc-200 dark:border-zinc-700">
                                CN
                              </div>
                            )}
                          </td>
                        )}

                        {/* Due Date */}
                        {visibleFields?.dueDate !== false && (
                          <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 font-medium">
                            {t.dueDate || "12 Sep 2026"}
                          </td>
                        )}

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(t);
                            }}
                            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Add Task Row at bottom of table */}
              <div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900">
                <button
                  onClick={() => onAddTaskGroup && onAddTaskGroup(group.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

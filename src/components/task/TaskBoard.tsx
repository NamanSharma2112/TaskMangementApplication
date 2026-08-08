"use client";

import React, { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { GripVertical, Plus, MoreHorizontal, Move } from "lucide-react";
import { useTasks } from "@/context/TaskContext";

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddTaskColumn?: (status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string; colorDot: string }[] = [
  { id: "todo", title: "To Do", colorDot: "bg-amber-400" },
  { id: "in-progress", title: "Doing", colorDot: "bg-blue-500" },
  { id: "completed", title: "Completed", colorDot: "bg-emerald-500" },
  { id: "on-hold", title: "On Hold", colorDot: "bg-purple-400" },
];

export function TaskBoard({ tasks, onEditTask, onAddTaskColumn }: TaskBoardProps) {
  const { moveTaskStatus } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) =>
          col.id === "in-progress"
            ? t.status === "in-progress" || t.status === ("doing" as TaskStatus)
            : t.status === col.id
        );

        const isTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            className={`flex flex-col rounded-3xl theme-muted border p-3.5 min-w-[260px] min-h-[580px] transition-all duration-200 ${
              isTarget
                ? "border-dashed border-[hsl(var(--primary))] bg-[hsl(var(--accent))] shadow-lg scale-[1.01] ring-2 ring-[hsl(var(--primary))/30]"
                : "theme-border"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOverColumn(col.id);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedTaskId) {
                moveTaskStatus(draggedTaskId, col.id);
              }
              setDraggedTaskId(null);
              setDragOverColumn(null);
            }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1 mb-3 select-none">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.colorDot}`} />
                <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>{col.title}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {colTasks.length}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAddTaskColumn && onAddTaskColumn(col.id)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                  title="Add task to column"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 min-h-[200px]">
              {colTasks.length === 0 ? (
                <div
                  className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 text-xs transition-colors ${
                    isTarget
                      ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary))/5]"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-400"
                  }`}
                >
                  <Move className="w-4 h-4 opacity-60" />
                  <span>{isTarget ? "Drop task here" : "No tasks here"}</span>
                </div>
              ) : (
                colTasks.map((task) => {
                  const isBeingDragged = draggedTaskId === task.id;
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedTaskId(task.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setDraggedTaskId(null);
                        setDragOverColumn(null);
                      }}
                      className={`transition-all duration-200 ${
                        isBeingDragged
                          ? "opacity-30 scale-95 rotate-1 border-dashed border-2 border-[hsl(var(--primary))] rounded-2xl"
                          : "hover:scale-[1.01] active:scale-[0.99]"
                      }`}
                    >
                      <TaskCard task={task} onEdit={onEditTask} />
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Add Task Button */}
            <button
              onClick={() => onAddTaskColumn && onAddTaskColumn(col.id)}
              className="mt-3 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 rounded-xl transition-colors text-left"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

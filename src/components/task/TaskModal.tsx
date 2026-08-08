"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/context/TaskContext";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import {
  X,
  Calendar,
  Tag,
  AlertCircle,
  Plus,
  Sparkles,
  Signal,
  CheckCircle2,
  Clock,
  Circle,
  PauseCircle,
} from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
}

const CATEGORY_SUGGESTIONS = ["Design", "Frontend", "Backend", "UX/UI", "QA & Audit"];

export function TaskModal({ isOpen, onClose, initialTask }: TaskModalProps) {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState("Design");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setCategory(initialTask.category);
      setDueDate(initialTask.dueDate);
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setCategory("Design");
      setDueDate(new Date().toISOString().split("T")[0]);
    }
    setErrors({});
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: "Task title is required" });
      return;
    }

    if (initialTask) {
      updateTask(initialTask.id, {
        title,
        description,
        status,
        priority,
        category,
        dueDate,
      });
    } else {
      addTask({
        title,
        description,
        status,
        priority,
        category,
        dueDate,
      });
    }
    onClose();
  };

  const statusOptions: { id: TaskStatus; label: string; icon: React.ReactNode; activeColor: string }[] = [
    { id: "todo", label: "To Do", icon: <Circle className="w-3.5 h-3.5" />, activeColor: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { id: "in-progress", label: "Doing", icon: <Clock className="w-3.5 h-3.5" />, activeColor: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { id: "completed", label: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, activeColor: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { id: "on-hold", label: "On Hold", icon: <PauseCircle className="w-3.5 h-3.5" />, activeColor: "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  ];

  const priorityOptions: { id: TaskPriority; label: string; color: string }[] = [
    { id: "low", label: "Low", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" },
    { id: "medium", label: "Medium", color: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
    { id: "high", label: "High", color: "text-rose-500 bg-rose-500/10 border-rose-500/30" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg theme-card border theme-border rounded-[28px] p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b theme-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl theme-sidebar-active flex items-center justify-center theme-primary-text shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight theme-fg">
                {initialTask ? "Edit Task Details" : "Create New Task"}
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Organize tasks with status, priority, & dates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Task Title */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Redesign Landing Page Hero & Navigation"
              className={`h-11 rounded-2xl theme-muted theme-border font-medium text-sm text-zinc-900 dark:text-zinc-100 ${
                errors.title ? "border-rose-500 ring-1 ring-rose-500" : ""
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add key deliverables, goals, or notes for team members..."
              className="w-full rounded-2xl theme-muted theme-border p-3.5 text-xs sm:text-sm font-medium theme-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] transition-all resize-none"
            />
          </div>

          {/* Status Selection Pills */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              Status Column
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((s) => {
                const isSelected = status === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatus(s.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${s.activeColor} shadow-2xs font-bold scale-[1.02]`
                        : "theme-border theme-muted text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Pill Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1">
              <Signal className="w-3 h-3" />
              <span>Priority Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {priorityOptions.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? `${p.color} ring-2 ring-offset-1 ring-current scale-[1.02]`
                        : "theme-border theme-muted text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                Category
              </label>
              <div className="relative mb-2">
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Design, Dev, UX..."
                  className="pl-9 h-10 rounded-xl theme-muted theme-border text-xs font-medium"
                />
                <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                      category === cat
                        ? "theme-sidebar-active theme-fg font-bold"
                        : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-9 h-10 rounded-xl theme-muted theme-border text-xs font-medium"
                />
                <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t theme-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-5 h-10 text-xs font-semibold theme-border hover:bg-[hsl(var(--accent))]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-6 h-10 text-xs font-bold theme-btn-primary shadow-sm gap-1.5"
            >
              {initialTask ? (
                "Save Changes"
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Task</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

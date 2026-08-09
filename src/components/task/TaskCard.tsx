"use client";

import React from "react";
import { motion } from "framer-motion";
import { Task } from "@/types/task";
import { Calendar, Tag, MoreHorizontal, User } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    <motion.div
      onClick={() => onEdit(task)}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      className="group relative cursor-pointer rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xs hover:shadow-md transition-all duration-200"
    >
      {/* Title & Options */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Assignee & Due Date Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {task.assignee?.avatar ? (
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-5 h-5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">
              <User className="w-3 h-3" />
            </div>
          )}
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {task.assignee?.name || "Admin"}
          </span>
        </div>

        {/* Date pill with soft red highlight */}
        {task.dueDate && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-semibold">
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>

      {/* Tag pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {(task.tags?.length ? task.tags : [task.category || "Design"]).map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-[6px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <Tag className="w-3 h-3 text-zinc-400" />
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

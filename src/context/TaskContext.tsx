"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";

const API_BASE_URL = "http://localhost:4000/api/tasks";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  isBackendConnected: boolean;
}

const initialMockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design System Implementation & Figma Audit",
    description: "Align custom components with the new Figma design system tokens and theme variables.",
    status: "in-progress",
    priority: "high",
    category: "Design",
    dueDate: "2026-08-12",
    createdAt: "2026-08-01",
    assignee: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "task-2",
    title: "Implement Guest Authentication & Theme Persistence",
    description: "Ensure users can test the application as a guest and persist their selected theme across reloads.",
    status: "completed",
    priority: "high",
    category: "Frontend",
    dueDate: "2026-08-08",
    createdAt: "2026-08-02",
    assignee: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "task-3",
    title: "Setup NestJS Backend Architecture & PostgreSQL Schema",
    description: "Prepare RESTful API endpoints for user auth, task CRUD operations, and pagination.",
    status: "todo",
    priority: "medium",
    category: "Backend",
    dueDate: "2026-08-15",
    createdAt: "2026-08-05",
    assignee: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "task-4",
    title: "Mobile Responsiveness & Micro-animations Polish",
    description: "Refine hover states, modal transitions, and touch responsiveness across tablet and mobile viewports.",
    status: "todo",
    priority: "low",
    category: "UX/UI",
    dueDate: "2026-08-18",
    createdAt: "2026-08-07",
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Fetch tasks from NestJS PostgreSQL Backend API
  const fetchTasksFromBackend = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTasks(data);
          setIsBackendConnected(true);
          localStorage.setItem("pyramid-tasks", JSON.stringify(data));
          return;
        }
      }
    } catch (e) {
      console.warn("Backend API offline, falling back to local persistence", e);
      setIsBackendConnected(false);
    }

    const saved = localStorage.getItem("pyramid-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks(initialMockTasks);
      }
    } else {
      setTasks(initialMockTasks);
      localStorage.setItem("pyramid-tasks", JSON.stringify(initialMockTasks));
    }
  };

  useEffect(() => {
    fetchTasksFromBackend();
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("pyramid-tasks", JSON.stringify(newTasks));
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: "task-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Optimistic UI update
    saveTasks([newTask, ...tasks]);

    // Send to NestJS Backend API
    try {
      await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      fetchTasksFromBackend();
    } catch (e) {
      console.error("Failed to sync task with NestJS backend:", e);
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    saveTasks(
      tasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );

    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (e) {
      console.error("Failed to sync update with NestJS backend:", e);
    }
  };

  const deleteTask = async (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));

    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to sync delete with NestJS backend:", e);
    }
  };

  const moveTaskStatus = async (id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        isBackendConnected,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}

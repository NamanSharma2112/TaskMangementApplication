"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, ApiError } from "@/lib/api";
import { Label, Task, TaskInput, TaskStatus } from "@/types/task";

interface TaskContextType {
  tasks: Task[];
  labels: Label[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: TaskInput) => Promise<void>;
  updateTask: (id: string, updatedFields: Record<string, unknown>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  archiveTask: (id: string, archived?: boolean) => Promise<void>;
  duplicateTask: (id: string) => Promise<void>;
  bulkUpdateTasks: (ids: string[], changes: Record<string, unknown>) => Promise<void>;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => Promise<void>;
  reorderTasks: (status: TaskStatus, orderedIds: string[]) => Promise<void>;
  refresh: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  labelFilter: string;
  setLabelFilter: (label: string) => void;
  showArchived: boolean;
  setShowArchived: (value: boolean) => void;
  isBackendConnected: boolean;
}

const STORAGE_KEY = "pyramid-tasks";

/** Shown only when the API is unreachable, so the board is never blank. */
const initialMockTasks: Task[] = [
  {
    id: "task-1",
    title: "Write API Documentation",
    description: "",
    status: "todo",
    priority: "no-priority",
    category: "Documentation",
    tags: ["Documentation"],
    dueDate: "29 Jul",
    createdAt: "2026-08-01",
    assignee: { name: "Admin" },
  },
  {
    id: "task-2",
    title: "Implement Search Function",
    description: "",
    status: "todo",
    priority: "medium",
    category: "Frontend",
    tags: ["Frontend"],
    dueDate: "29 Jul",
    createdAt: "2026-08-01",
    assignee: { name: "Admin" },
  },
  {
    id: "task-3",
    title: "Code Review Completed",
    description: "",
    status: "in-progress",
    priority: "high",
    category: "Backend",
    tags: ["Backend"],
    dueDate: "29 Jul",
    createdAt: "2026-08-01",
    assignee: { name: "Admin" },
  },
  {
    id: "task-4",
    title: "Feature Testing Passed",
    description: "",
    status: "completed",
    priority: "medium",
    category: "Testing",
    tags: ["Testing"],
    dueDate: "30 Jul",
    createdAt: "2026-08-01",
    assignee: { name: "QA Team" },
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const loadLocalFallback = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
        return;
      } catch {
        /* corrupt cache — fall through to the seed set */
      }
    }
    setTasks(initialMockTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockTasks));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [fetchedTasks, fetchedLabels] = await Promise.all([
        api.tasks.list({ archived: showArchived ? "only" : "false" }),
        api.labels.list(),
      ]);
      setTasks(fetchedTasks);
      setLabels(fetchedLabels);
      setIsBackendConnected(true);
      setError(null);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedTasks));
    } catch (e) {
      console.warn("Backend API unavailable, using local persistence", e);
      setIsBackendConnected(false);
      loadLocalFallback();
    } finally {
      setIsLoading(false);
    }
  }, [showArchived, loadLocalFallback]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Keeps offline edits durable; a no-op once the API is the source of truth. */
  const persistLocally = (next: Task[]) => {
    setTasks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const reportError = (e: unknown, fallback: string) => {
    const message = e instanceof ApiError ? e.message : fallback;
    setError(message);
    console.error(fallback, e);
  };

  const addTask = async (taskData: TaskInput) => {
    if (!isBackendConnected) {
      persistLocally([
        {
          ...(taskData as Task),
          id: "task-" + Date.now(),
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...tasks,
      ]);
      return;
    }

    try {
      const created = await api.tasks.create(taskData);
      setTasks((prev) => [created, ...prev]);
      setError(null);
    } catch (e) {
      reportError(e, "Failed to create the task.");
    }
  };

  const updateTask = async (id: string, updatedFields: Record<string, unknown>) => {
    // Optimistic update so the board reacts immediately on drag or edit.
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? ({ ...t, ...updatedFields } as Task) : t)),
    );

    if (!isBackendConnected) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(previous.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))),
      );
      return;
    }

    try {
      const updated = await api.tasks.update(id, updatedFields);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setError(null);
    } catch (e) {
      setTasks(previous);
      reportError(e, "Failed to save the task.");
    }
  };

  const deleteTask = async (id: string) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (!isBackendConnected) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(previous.filter((t) => t.id !== id)));
      return;
    }

    try {
      await api.tasks.remove(id);
      setError(null);
    } catch (e) {
      setTasks(previous);
      reportError(e, "Failed to delete the task. Deleting requires an ADMIN or MANAGER role.");
    }
  };

  const archiveTask = async (id: string, archived = true) => {
    if (!isBackendConnected) {
      persistLocally(tasks.filter((t) => t.id !== id));
      return;
    }

    try {
      await api.tasks.archive(id, archived);
      // Archived tasks leave the active board (and vice-versa), so re-fetch.
      await refresh();
      setError(null);
    } catch (e) {
      reportError(e, "Failed to archive the task.");
    }
  };

  const duplicateTask = async (id: string) => {
    if (!isBackendConnected) return;
    try {
      const copy = await api.tasks.duplicate(id);
      setTasks((prev) => [copy, ...prev]);
      setError(null);
    } catch (e) {
      reportError(e, "Failed to duplicate the task.");
    }
  };

  const bulkUpdateTasks = async (ids: string[], changes: Record<string, unknown>) => {
    if (!isBackendConnected || ids.length === 0) return;
    try {
      const { tasks: updated } = await api.tasks.bulkUpdate(ids, changes);
      const byId = new Map(updated.map((t) => [t.id, t]));
      setTasks((prev) => prev.map((t) => byId.get(t.id) ?? t));
      setError(null);
    } catch (e) {
      reportError(e, "Failed to apply the bulk update.");
    }
  };

  const moveTaskStatus = async (id: string, newStatus: TaskStatus) => {
    await updateTask(id, { status: newStatus });
  };

  const reorderTasks = async (status: TaskStatus, orderedIds: string[]) => {
    if (!isBackendConnected) return;
    try {
      await api.tasks.reorder(status, orderedIds);
      setError(null);
    } catch (e) {
      reportError(e, "Failed to save the new order.");
    }
  };

  // Filtering runs client-side so typing in the search box stays instant; the
  // API exposes the same filters for callers that need server-side paging.
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query) ||
        (task.category || "").toLowerCase().includes(query) ||
        (task.tags || []).some((tag) => tag.toLowerCase().includes(query));

      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "in-progress"
          ? task.status === "in-progress" || task.status === "doing"
          : task.status === statusFilter);

      const matchesLabel =
        labelFilter === "all" || (task.tags || []).includes(labelFilter);

      return matchesSearch && matchesPriority && matchesStatus && matchesLabel;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter, labelFilter]);

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        labels,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        archiveTask,
        duplicateTask,
        bulkUpdateTasks,
        moveTaskStatus,
        reorderTasks,
        refresh,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        labelFilter,
        setLabelFilter,
        showArchived,
        setShowArchived,
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

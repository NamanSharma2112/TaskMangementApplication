import {
  ActivityEntry,
  AnalyticsOverview,
  AnalyticsSummary,
  Label,
  Notification,
  Project,
  Subtask,
  Task,
  TaskComment,
  TaskInput,
  TaskQuery,
  ThroughputPoint,
  WorkloadEntry,
} from "@/types/task";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** The token is written by AuthContext; reading it here keeps callers simple. */
function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("pyramid-token");
  // Offline fallback logins store a placeholder that the API would reject.
  if (!token || token.startsWith("mock_jwt")) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...authHeader(),
      ...(init.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      // The backend's exception filter returns { statusCode, error, message }.
      message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : body?.message || message;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function toQueryString(query: object = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "" || value === "all") {
      continue;
    }
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  /** Cheap liveness probe used to decide between API and local-storage mode. */
  async ping(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/labels`, { method: "GET" });
      return res.ok;
    } catch {
      return false;
    }
  },

  tasks: {
    list: (query: TaskQuery = {}) =>
      request<Task[]>(`/api/tasks${toQueryString(query)}`),
    search: (query: TaskQuery = {}) =>
      request<{ data: Task[]; meta: Record<string, number | boolean> }>(
        `/api/tasks/search${toQueryString(query)}`,
      ),
    get: (id: string) => request<Task>(`/api/tasks/${id}`),
    create: (body: TaskInput) =>
      request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    updateStatus: (id: string, status: string) =>
      request<Task>(`/api/tasks/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    archive: (id: string, archived = true) =>
      request<Task>(`/api/tasks/${id}/archive`, {
        method: "PATCH",
        body: JSON.stringify({ archived }),
      }),
    duplicate: (id: string) =>
      request<Task>(`/api/tasks/${id}/duplicate`, { method: "POST" }),
    bulkUpdate: (ids: string[], changes: Record<string, unknown>) =>
      request<{ updated: number; tasks: Task[] }>("/api/tasks/bulk", {
        method: "PATCH",
        body: JSON.stringify({ ids, ...changes }),
      }),
    reorder: (status: string, orderedIds: string[]) =>
      request<Task[]>("/api/tasks/reorder", {
        method: "PATCH",
        body: JSON.stringify({ status, orderedIds }),
      }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/tasks/${id}`, { method: "DELETE" }),
  },

  subtasks: {
    list: (taskId: string) => request<Subtask[]>(`/api/tasks/${taskId}/subtasks`),
    create: (taskId: string, body: { title: string; priority?: string; dueDate?: string }) =>
      request<Subtask>(`/api/tasks/${taskId}/subtasks`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Record<string, unknown>) =>
      request<Subtask>(`/api/subtasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/subtasks/${id}`, { method: "DELETE" }),
    reorder: (taskId: string, orderedIds: string[]) =>
      request<Subtask[]>(`/api/tasks/${taskId}/subtasks/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ orderedIds }),
      }),
  },

  labels: {
    list: () => request<Label[]>("/api/labels"),
    create: (body: { name: string; color?: string }) =>
      request<Label>("/api/labels", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: { name?: string; color?: string }) =>
      request<Label>(`/api/labels/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/labels/${id}`, { method: "DELETE" }),
    forTask: (taskId: string) => request<Label[]>(`/api/tasks/${taskId}/labels`),
    attach: (taskId: string, body: { labelId?: string; name?: string; color?: string }) =>
      request<Label[]>(`/api/tasks/${taskId}/labels`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    detach: (taskId: string, labelId: string) =>
      request<Label[]>(`/api/tasks/${taskId}/labels/${labelId}`, { method: "DELETE" }),
  },

  projects: {
    list: () => request<Project[]>("/api/projects"),
    get: (id: string) => request<Project>(`/api/projects/${id}`),
    tasks: (id: string) => request<Task[]>(`/api/projects/${id}/tasks`),
    create: (body: Partial<Project> & { title: string }) =>
      request<Project>("/api/projects", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request<Project>(`/api/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/projects/${id}`, { method: "DELETE" }),
  },

  comments: {
    list: (taskId: string) => request<TaskComment[]>(`/api/tasks/${taskId}/comments`),
    create: (taskId: string, content: string) =>
      request<TaskComment>(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/comments/${id}`, { method: "DELETE" }),
  },

  notifications: {
    list: (unread = false) =>
      request<Notification[]>(`/api/notifications${unread ? "?unread=true" : ""}`),
    unreadCount: () => request<{ count: number }>("/api/notifications/unread-count"),
    markRead: (id: string) =>
      request<Notification>(`/api/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () =>
      request<{ updated: number }>("/api/notifications/read-all", { method: "PATCH" }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/notifications/${id}`, { method: "DELETE" }),
    clearRead: () =>
      request<{ deleted: number }>("/api/notifications/read", { method: "DELETE" }),
  },

  activity: {
    feed: (limit = 50) => request<ActivityEntry[]>(`/api/activity?limit=${limit}`),
    forTask: (taskId: string) => request<ActivityEntry[]>(`/api/tasks/${taskId}/activity`),
    forProject: (projectId: string) =>
      request<ActivityEntry[]>(`/api/projects/${projectId}/activity`),
  },

  analytics: {
    overview: (days = 14) => request<AnalyticsOverview>(`/api/analytics?days=${days}`),
    summary: () => request<AnalyticsSummary>("/api/analytics/summary"),
    workload: () => request<WorkloadEntry[]>("/api/analytics/workload"),
    throughput: (days = 14) =>
      request<ThroughputPoint[]>(`/api/analytics/throughput?days=${days}`),
  },

  users: {
    list: () => request<Array<{ id: string; name: string; email: string; avatar?: string; role: string }>>("/users"),
  },
};

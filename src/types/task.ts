export type TaskStatus =
  | "todo"
  | "in-progress"
  | "doing"
  | "completed"
  | "on-hold"
  | "backlog";

export type TaskPriority = "low" | "medium" | "high" | "urgent" | "no-priority";

export interface UserSummary {
  id?: string;
  name: string;
  email?: string;
  avatar?: string | null;
  role?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  taskCount?: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority | string;
  dueDate?: string | null;
  position: number;
  taskId: string;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  author?: UserSummary | null;
}

export interface TaskProgress {
  total: number;
  completed: number;
  percent: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  tags?: string[];
  labels?: Label[];
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string | null;
  estimateHours?: number | null;
  archived?: boolean;
  position?: number;
  assignee?: UserSummary | null;
  creator?: UserSummary | null;
  projectId?: string | null;
  project?: { id: string; title: string; status: string } | null;
  subtasks?: Subtask[];
  comments?: TaskComment[];
  progress?: TaskProgress;
}

/**
 * Payload shape for creating/updating a task. Labels are sent as plain names —
 * the API resolves them to Label rows and creates any that don't exist yet.
 */
export type TaskInput = Omit<Partial<Task>, "labels" | "assignee"> & {
  title: string;
  labels?: string[];
  assigneeId?: string;
  projectId?: string;
};

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  category?: string;
  status?: string;
  priority: TaskPriority;
  lead: UserSummary;
  dueDate: string;
  totalTasks?: number;
  completedTasks?: number;
  progress?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  read: boolean;
  createdAt: string;
  taskId?: string | null;
  task?: { id: string; title: string; status: string; priority: string } | null;
}

export interface ActivityEntry {
  id: string;
  type: string;
  message: string;
  meta?: Record<string, unknown> | null;
  createdAt: string;
  actor?: UserSummary | null;
  task?: { id: string; title: string; status?: string } | null;
  project?: { id: string; title: string } | null;
}

export interface AnalyticsSummary {
  totals: {
    tasks: number;
    completed: number;
    open: number;
    overdue: number;
    dueThisWeek: number;
    unassigned: number;
    archived: number;
    projects: number;
    users: number;
    comments: number;
  };
  completionRate: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface WorkloadEntry extends UserSummary {
  id: string;
  total: number;
  completed: number;
  open: number;
  overdue: number;
  completionRate: number;
}

export interface ThroughputPoint {
  date: string;
  created: number;
  completed: number;
}

export interface ProjectBreakdown {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  lead?: UserSummary | null;
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

export interface AnalyticsOverview {
  summary: AnalyticsSummary;
  workload: WorkloadEntry[];
  throughput: ThroughputPoint[];
  projects: ProjectBreakdown[];
}

export interface TaskQuery {
  search?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  projectId?: string;
  category?: string;
  label?: string;
  archived?: "true" | "false" | "only";
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

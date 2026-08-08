export type TaskStatus =
  | "todo"
  | "in-progress"
  | "doing"
  | "completed"
  | "on-hold"
  | "backlog";

export type TaskPriority = "low" | "medium" | "high" | "urgent" | "no-priority";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate: string;
  createdAt: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  priority: TaskPriority;
  lead: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
}

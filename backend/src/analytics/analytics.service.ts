import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const BOARD_STATUSES = ['todo', 'in-progress', 'doing', 'completed', 'on-hold', 'backlog'];
const PRIORITIES = ['no-priority', 'low', 'medium', 'high', 'urgent'];

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Due dates are stored as free-form strings, so a value only counts as
   * overdue when it parses to a real calendar date in the past.
   */
  private isOverdue(dueDate: string | null, status: string) {
    if (!dueDate || status === 'completed') return false;
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsed < today;
  }

  private isDueWithin(dueDate: string | null, status: string, days: number) {
    if (!dueDate || status === 'completed') return false;
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(today);
    limit.setDate(limit.getDate() + days);
    return parsed >= today && parsed <= limit;
  }

  async summary() {
    const tasks = await this.prisma.task.findMany({
      where: { archived: false },
      select: {
        id: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        completedAt: true,
        assignee: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    const byStatus = Object.fromEntries(BOARD_STATUSES.map((s) => [s, 0])) as Record<string, number>;
    const byPriority = Object.fromEntries(PRIORITIES.map((p) => [p, 0])) as Record<string, number>;

    let overdue = 0;
    let dueThisWeek = 0;
    let unassigned = 0;

    for (const task of tasks) {
      byStatus[task.status] = (byStatus[task.status] ?? 0) + 1;
      byPriority[task.priority] = (byPriority[task.priority] ?? 0) + 1;
      if (this.isOverdue(task.dueDate, task.status)) overdue++;
      if (this.isDueWithin(task.dueDate, task.status, 7)) dueThisWeek++;
      if (!task.assignee) unassigned++;
    }

    const total = tasks.length;
    const completed = byStatus['completed'] ?? 0;

    const [projectCount, userCount, commentCount, archivedCount] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.user.count(),
      this.prisma.comment.count(),
      this.prisma.task.count({ where: { archived: true } }),
    ]);

    return {
      totals: {
        tasks: total,
        completed,
        open: total - completed,
        overdue,
        dueThisWeek,
        unassigned,
        archived: archivedCount,
        projects: projectCount,
        users: userCount,
        comments: commentCount,
      },
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      byStatus,
      byPriority,
    };
  }

  /** Per-assignee workload, ordered by open task count. */
  async workload() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        tasks: {
          where: { archived: false },
          select: { status: true, dueDate: true },
        },
      },
    });

    return users
      .map((user) => {
        const completed = user.tasks.filter((t) => t.status === 'completed').length;
        const overdue = user.tasks.filter((t) => this.isOverdue(t.dueDate, t.status)).length;
        const total = user.tasks.length;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          total,
          completed,
          open: total - completed,
          overdue,
          completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
        };
      })
      .sort((a, b) => b.open - a.open || b.total - a.total);
  }

  /** Tasks created vs. completed per day, for the trend chart. */
  async throughput(days = 14) {
    const window = Math.min(Math.max(days, 1), 90);
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (window - 1));

    const [created, completed] = await Promise.all([
      this.prisma.task.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      this.prisma.task.findMany({
        where: { completedAt: { gte: since } },
        select: { completedAt: true },
      }),
    ]);

    const buckets = new Map<string, { date: string; created: number; completed: number }>();
    for (let i = 0; i < window; i++) {
      const day = new Date(since);
      day.setDate(day.getDate() + i);
      const key = day.toISOString().slice(0, 10);
      buckets.set(key, { date: key, created: 0, completed: 0 });
    }

    for (const t of created) {
      const bucket = buckets.get(t.createdAt.toISOString().slice(0, 10));
      if (bucket) bucket.created++;
    }
    for (const t of completed) {
      if (!t.completedAt) continue;
      const bucket = buckets.get(t.completedAt.toISOString().slice(0, 10));
      if (bucket) bucket.completed++;
    }

    return Array.from(buckets.values());
  }

  /** Task counts and completion percentage per project. */
  async projectBreakdown() {
    const projects = await this.prisma.project.findMany({
      include: {
        lead: { select: { id: true, name: true, avatar: true } },
        tasks: { where: { archived: false }, select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => {
      const total = project.tasks.length;
      const completed = project.tasks.filter((t) => t.status === 'completed').length;
      return {
        id: project.id,
        title: project.title,
        status: project.status,
        priority: project.priority,
        dueDate: project.dueDate,
        lead: project.lead,
        totalTasks: total,
        completedTasks: completed,
        progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      };
    });
  }

  async overview(days = 14) {
    const [summary, workload, throughput, projects] = await Promise.all([
      this.summary(),
      this.workload(),
      this.throughput(days),
      this.projectBreakdown(),
    ]);
    return { summary, workload, throughput, projects };
  }
}

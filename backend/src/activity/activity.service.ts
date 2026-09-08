import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RecordActivityInput {
  type: string;
  message: string;
  actorId?: string | null;
  taskId?: string | null;
  projectId?: string | null;
  meta?: Record<string, any>;
}

const ACTOR_SELECT = {
  select: { id: true, name: true, email: true, avatar: true, role: true },
};

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Writes an audit-trail entry. Activity logging must never break the request
   * that triggered it, so failures are swallowed and logged.
   */
  async record(input: RecordActivityInput) {
    try {
      return await this.prisma.activity.create({
        data: {
          type: input.type,
          message: input.message,
          meta: input.meta ? JSON.stringify(input.meta) : null,
          actorId: input.actorId ?? null,
          taskId: input.taskId ?? null,
          projectId: input.projectId ?? null,
        },
      });
    } catch (e) {
      this.logger.warn(`Failed to record activity "${input.type}": ${e}`);
      return null;
    }
  }

  private hydrate<T extends { meta: string | null }>(entry: T) {
    let meta: Record<string, any> | null = null;
    if (entry.meta) {
      try {
        meta = JSON.parse(entry.meta);
      } catch {
        meta = null;
      }
    }
    return { ...entry, meta };
  }

  async findAll(limit = 50) {
    const entries = await this.prisma.activity.findMany({
      take: Math.min(Math.max(limit, 1), 200),
      include: {
        actor: ACTOR_SELECT,
        task: { select: { id: true, title: true, status: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return entries.map((e) => this.hydrate(e));
  }

  async findByTask(taskId: string) {
    const entries = await this.prisma.activity.findMany({
      where: { taskId },
      include: { actor: ACTOR_SELECT },
      orderBy: { createdAt: 'desc' },
    });
    return entries.map((e) => this.hydrate(e));
  }

  async findByProject(projectId: string) {
    const entries = await this.prisma.activity.findMany({
      where: { projectId },
      include: { actor: ACTOR_SELECT, task: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return entries.map((e) => this.hydrate(e));
  }
}

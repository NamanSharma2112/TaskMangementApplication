import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  BulkUpdateTasksDto,
  CreateTaskDto,
  QueryTasksDto,
  ReorderTasksDto,
  UpdateTaskDto,
} from './dto/task.dto';

const USER_SELECT = {
  select: { id: true, name: true, email: true, avatar: true, role: true },
};

const TASK_INCLUDE = {
  assignee: USER_SELECT,
  creator: { select: { id: true, name: true, email: true, avatar: true } },
  project: { select: { id: true, title: true, status: true } },
  subtasks: { orderBy: { position: 'asc' } },
  labels: { include: { label: true } },
  comments: {
    include: { author: USER_SELECT },
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.TaskInclude;

type TaskWithRelations = Prisma.TaskGetPayload<{ include: typeof TASK_INCLUDE }>;

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Flattens the TaskLabel join rows and adds derived subtask progress. */
  private shape(task: TaskWithRelations) {
    const { labels, subtasks, ...rest } = task;
    const completedSubtasks = subtasks.filter((s) => s.completed).length;

    return {
      ...rest,
      subtasks,
      labels: labels.map((l) => l.label),
      tags: labels.map((l) => l.label.name),
      progress: {
        total: subtasks.length,
        completed: completedSubtasks,
        percent:
          subtasks.length === 0
            ? 0
            : Math.round((completedSubtasks / subtasks.length) * 100),
      },
    };
  }

  private buildWhere(query: QueryTasksDto): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {};

    if (query.archived === 'only') where.archived = true;
    else if (query.archived !== 'true') where.archived = false;

    if (query.status) where.status = { in: query.status.split(',') };
    if (query.priority) where.priority = { in: query.priority.split(',') };
    if (query.assigneeId) where.assigneeId = query.assigneeId;
    if (query.projectId) where.projectId = query.projectId;
    if (query.category) where.category = query.category;
    if (query.label) {
      where.labels = { some: { label: { name: query.label } } };
    }
    if (query.search) {
      // SQLite has no case-insensitive `mode`, but its default LIKE is already
      // case-insensitive for ASCII, which is what `contains` compiles to.
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { category: { contains: query.search } },
      ];
    }

    return where;
  }

  private buildOrderBy(query: QueryTasksDto): Prisma.TaskOrderByWithRelationInput {
    const order = (query.order as Prisma.SortOrder) || 'desc';
    switch (query.sortBy) {
      case 'title':
        return { title: order };
      case 'dueDate':
        return { dueDate: order };
      case 'priority':
        return { priority: order };
      case 'position':
        return { position: order };
      case 'updatedAt':
        return { updatedAt: order };
      default:
        return { createdAt: order };
    }
  }

  async findAll(query: QueryTasksDto = {}) {
    const tasks = await this.prisma.task.findMany({
      where: this.buildWhere(query),
      include: TASK_INCLUDE,
      orderBy: this.buildOrderBy(query),
    });
    return tasks.map((t) => this.shape(t));
  }

  /** Same filters as findAll, wrapped in a pagination envelope. */
  async search(query: QueryTasksDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = this.buildWhere(query);

    const [total, tasks] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        include: TASK_INCLUDE,
        orderBy: this.buildOrderBy(query),
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: tasks.map((t) => this.shape(t)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
      },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: TASK_INCLUDE,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return this.shape(task);
  }

  /** Resolves label names to ids, creating any that don't exist yet. */
  private async resolveLabelIds(names: string[]) {
    const ids: string[] = [];
    for (const raw of names) {
      const name = raw.trim();
      if (!name) continue;
      const label =
        (await this.prisma.label.findUnique({ where: { name } })) ??
        (await this.prisma.label.create({ data: { name } }));
      ids.push(label.id);
    }
    return ids;
  }

  private async syncLabels(taskId: string, names: string[]) {
    const labelIds = await this.resolveLabelIds(names);
    await this.prisma.taskLabel.deleteMany({
      where: { taskId, labelId: { notIn: labelIds.length ? labelIds : ['__none__'] } },
    });
    for (const labelId of labelIds) {
      await this.prisma.taskLabel.upsert({
        where: { taskId_labelId: { taskId, labelId } },
        update: {},
        create: { taskId, labelId },
      });
    }
  }

  async create(dto: CreateTaskDto, creatorId?: string) {
    const status = dto.status || 'todo';

    const last = await this.prisma.task.findFirst({
      where: { status },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const created = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status,
        priority: dto.priority || 'medium',
        category: dto.category || 'General',
        dueDate: dto.dueDate,
        assigneeId: dto.assigneeId,
        projectId: dto.projectId,
        estimateHours: dto.estimateHours,
        creatorId,
        position: (last?.position ?? -1) + 1,
        completedAt: status === 'completed' ? new Date() : null,
      },
    });

    if (dto.labels?.length) {
      await this.syncLabels(created.id, dto.labels);
    }

    await this.activity.record({
      type: 'task.created',
      message: `created task "${created.title}"`,
      actorId: creatorId,
      taskId: created.id,
      projectId: created.projectId,
    });

    if (created.assigneeId) {
      await this.notifications.notify(
        {
          userId: created.assigneeId,
          type: 'task.assigned',
          title: 'You were assigned a new task',
          body: created.title,
          taskId: created.id,
        },
        creatorId,
      );
    }

    return this.findOne(created.id);
  }

  async update(id: string, dto: UpdateTaskDto, actorId?: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    const data: Prisma.TaskUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate;
    if (dto.estimateHours !== undefined) data.estimateHours = dto.estimateHours;
    if (dto.archived !== undefined) data.archived = dto.archived;
    if (dto.position !== undefined) data.position = dto.position;

    if (dto.assigneeId !== undefined) {
      data.assignee = dto.assigneeId
        ? { connect: { id: dto.assigneeId } }
        : { disconnect: true };
    }
    if (dto.projectId !== undefined) {
      data.project = dto.projectId
        ? { connect: { id: dto.projectId } }
        : { disconnect: true };
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
      // completedAt only moves when the task crosses the completed boundary,
      // so re-completing a task doesn't reset its original completion date.
      if (dto.status === 'completed' && existing.status !== 'completed') {
        data.completedAt = new Date();
      } else if (dto.status !== 'completed' && existing.status === 'completed') {
        data.completedAt = null;
      }
    }

    await this.prisma.task.update({ where: { id }, data });

    if (dto.labels !== undefined) {
      await this.syncLabels(id, dto.labels);
    }

    await this.recordUpdateSideEffects(existing, dto, actorId);

    return this.findOne(id);
  }

  private async recordUpdateSideEffects(
    existing: { id: string; title: string; status: string; assigneeId: string | null; creatorId: string | null; projectId: string | null },
    dto: UpdateTaskDto,
    actorId?: string,
  ) {
    if (dto.status !== undefined && dto.status !== existing.status) {
      await this.activity.record({
        type: 'task.status_changed',
        message: `moved "${existing.title}" from ${existing.status} to ${dto.status}`,
        actorId,
        taskId: existing.id,
        projectId: existing.projectId,
        meta: { from: existing.status, to: dto.status },
      });

      for (const userId of [existing.assigneeId, existing.creatorId]) {
        if (!userId) continue;
        await this.notifications.notify(
          {
            userId,
            type: 'task.status_changed',
            title: `Task moved to ${dto.status}`,
            body: existing.title,
            taskId: existing.id,
          },
          actorId,
        );
      }
    }

    if (dto.assigneeId !== undefined && dto.assigneeId !== existing.assigneeId) {
      await this.activity.record({
        type: 'task.assigned',
        message: dto.assigneeId
          ? `reassigned "${existing.title}"`
          : `unassigned "${existing.title}"`,
        actorId,
        taskId: existing.id,
        meta: { from: existing.assigneeId, to: dto.assigneeId },
      });

      if (dto.assigneeId) {
        await this.notifications.notify(
          {
            userId: dto.assigneeId,
            type: 'task.assigned',
            title: 'You were assigned a task',
            body: existing.title,
            taskId: existing.id,
          },
          actorId,
        );
      }
    }

    if (dto.archived === true) {
      await this.activity.record({
        type: 'task.archived',
        message: `archived "${existing.title}"`,
        actorId,
        taskId: existing.id,
      });
    }
  }

  async updateStatus(id: string, status: string, actorId?: string) {
    return this.update(id, { status }, actorId);
  }

  /** Applies one set of changes to many tasks at once. */
  async bulkUpdate(dto: BulkUpdateTasksDto, actorId?: string) {
    const { ids, ...changes } = dto;
    const tasks: Awaited<ReturnType<TasksService['findOne']>>[] = [];
    for (const id of ids) {
      tasks.push(await this.update(id, changes, actorId));
    }
    return { updated: tasks.length, tasks };
  }

  /** Persists a drag-and-drop reorder within one board column. */
  async reorder(dto: ReorderTasksDto) {
    await this.prisma.$transaction(
      dto.orderedIds.map((id, index) =>
        this.prisma.task.updateMany({
          where: { id },
          data: { position: index, status: dto.status },
        }),
      ),
    );
    return this.findAll({ status: dto.status, sortBy: 'position', order: 'asc' });
  }

  async archive(id: string, archived: boolean, actorId?: string) {
    return this.update(id, { archived }, actorId);
  }

  /** Duplicates a task along with its subtasks and labels. */
  async duplicate(id: string, actorId?: string) {
    const source = await this.prisma.task.findUnique({
      where: { id },
      include: { subtasks: true, labels: true },
    });
    if (!source) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    const copy = await this.prisma.task.create({
      data: {
        title: `${source.title} (copy)`,
        description: source.description,
        status: source.status,
        priority: source.priority,
        category: source.category,
        dueDate: source.dueDate,
        assigneeId: source.assigneeId,
        projectId: source.projectId,
        estimateHours: source.estimateHours,
        creatorId: actorId ?? source.creatorId,
        subtasks: {
          create: source.subtasks.map((s) => ({
            title: s.title,
            priority: s.priority,
            dueDate: s.dueDate,
            position: s.position,
          })),
        },
        labels: {
          create: source.labels.map((l) => ({ labelId: l.labelId })),
        },
      },
    });

    await this.activity.record({
      type: 'task.duplicated',
      message: `duplicated "${source.title}"`,
      actorId,
      taskId: copy.id,
    });

    return this.findOne(copy.id);
  }

  async remove(id: string, actorId?: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    await this.prisma.task.delete({ where: { id } });
    await this.activity.record({
      type: 'task.deleted',
      message: `deleted task "${task.title}"`,
      actorId,
      projectId: task.projectId,
    });

    return { message: `Task ${id} removed successfully.` };
  }
}

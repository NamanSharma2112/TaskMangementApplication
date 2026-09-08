import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  private async requireTask(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }
    return task;
  }

  async findByTask(taskId: string) {
    await this.requireTask(taskId);
    return this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    });
  }

  /** Completed / total counts, used by the task progress bar. */
  async progress(taskId: string) {
    await this.requireTask(taskId);
    const [total, completed] = await Promise.all([
      this.prisma.subtask.count({ where: { taskId } }),
      this.prisma.subtask.count({ where: { taskId, completed: true } }),
    ]);
    return {
      total,
      completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }

  async create(taskId: string, dto: CreateSubtaskDto, actorId?: string) {
    const task = await this.requireTask(taskId);

    const last = await this.prisma.subtask.findFirst({
      where: { taskId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const subtask = await this.prisma.subtask.create({
      data: {
        title: dto.title,
        priority: dto.priority || 'medium',
        dueDate: dto.dueDate,
        completed: dto.completed ?? false,
        position: (last?.position ?? -1) + 1,
        taskId,
      },
    });

    await this.activity.record({
      type: 'subtask.created',
      message: `added subtask "${subtask.title}" to "${task.title}"`,
      actorId,
      taskId,
      meta: { subtaskId: subtask.id },
    });

    return subtask;
  }

  async update(id: string, dto: UpdateSubtaskDto, actorId?: string) {
    const existing = await this.prisma.subtask.findUnique({
      where: { id },
      include: { task: { select: { id: true, title: true } } },
    });
    if (!existing) {
      throw new NotFoundException(`Subtask with ID "${id}" not found.`);
    }

    const subtask = await this.prisma.subtask.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
        ...(dto.completed !== undefined && { completed: dto.completed }),
        ...(dto.position !== undefined && { position: dto.position }),
      },
    });

    if (dto.completed !== undefined && dto.completed !== existing.completed) {
      await this.activity.record({
        type: 'subtask.toggled',
        message: `marked subtask "${subtask.title}" as ${dto.completed ? 'complete' : 'incomplete'}`,
        actorId,
        taskId: existing.taskId,
        meta: { subtaskId: id, completed: dto.completed },
      });
    }

    return subtask;
  }

  async remove(id: string, actorId?: string) {
    const existing = await this.prisma.subtask.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Subtask with ID "${id}" not found.`);
    }

    await this.prisma.subtask.delete({ where: { id } });
    await this.activity.record({
      type: 'subtask.deleted',
      message: `removed subtask "${existing.title}"`,
      actorId,
      taskId: existing.taskId,
    });

    return { message: `Subtask "${id}" deleted successfully.` };
  }

  /** Persists a drag-and-drop reorder in a single transaction. */
  async reorder(taskId: string, orderedIds: string[]) {
    await this.requireTask(taskId);
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.subtask.updateMany({
          where: { id, taskId },
          data: { position: index },
        }),
      ),
    );
    return this.findByTask(taskId);
  }
}

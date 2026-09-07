import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
  ) {}

  async findByTask(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(taskId: string, dto: CreateCommentDto, authorId?: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        taskId: taskId,
        authorId: authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    await this.activity.record({
      type: 'comment.added',
      message: `commented on "${task.title}"`,
      actorId: authorId,
      taskId,
      projectId: task.projectId,
      meta: { commentId: comment.id },
    });

    // The assignee and the creator both follow a task, so both get pinged.
    for (const userId of new Set([task.assigneeId, task.creatorId].filter(Boolean))) {
      await this.notifications.notify(
        {
          userId: userId as string,
          type: 'comment.added',
          title: `New comment on "${task.title}"`,
          body: dto.content.slice(0, 140),
          taskId,
        },
        authorId,
      );
    }

    return comment;
  }

  async remove(id: string, userId?: string, userRole?: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found.`);
    }

    if (
      userId &&
      comment.authorId !== userId &&
      userRole !== 'ADMIN' &&
      userRole !== 'MANAGER'
    ) {
      throw new ForbiddenException('You do not have permission to delete this comment.');
    }

    await this.prisma.comment.delete({ where: { id } });
    return { message: `Comment "${id}" deleted successfully.` };
  }
}

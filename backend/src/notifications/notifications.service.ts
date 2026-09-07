import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body?: string;
  taskId?: string | null;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fan-out helper. Skips self-notifications (an actor never gets notified about
   * their own action) and never throws into the caller's request.
   */
  async notify(input: CreateNotificationInput, actorId?: string | null) {
    if (!input.userId || input.userId === actorId) return null;

    try {
      return await this.prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          body: input.body,
          taskId: input.taskId ?? null,
        },
      });
    } catch (e) {
      this.logger.warn(`Failed to create notification "${input.type}": ${e}`);
      return null;
    }
  }

  async findForUser(userId: string, onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(onlyUnread ? { read: false } : {}) },
      include: {
        task: { select: { id: true, title: true, status: true, priority: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found.`);
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException('You cannot modify another user\'s notifications.');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { updated: result.count };
  }

  async remove(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found.`);
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException('You cannot delete another user\'s notifications.');
    }

    await this.prisma.notification.delete({ where: { id } });
    return { message: `Notification "${id}" deleted successfully.` };
  }

  async clearRead(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId, read: true },
    });
    return { deleted: result.count };
  }
}

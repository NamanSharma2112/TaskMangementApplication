import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany({
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        creator: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        subtasks: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, avatar: true, role: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        creator: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        subtasks: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, avatar: true, role: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return task;
  }

  create(dto: CreateTaskDto, creatorId?: string) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'todo',
        priority: dto.priority || 'medium',
        category: dto.category || 'General',
        dueDate: dto.dueDate,
        assigneeId: dto.assigneeId,
        creatorId: creatorId,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        creator: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        subtasks: true,
        comments: true,
      },
    });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate;
    if (dto.assigneeId !== undefined) updateData.assigneeId = dto.assigneeId;

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        creator: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        subtasks: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, avatar: true, role: true },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: `Task ${id} removed successfully.` };
  }
}

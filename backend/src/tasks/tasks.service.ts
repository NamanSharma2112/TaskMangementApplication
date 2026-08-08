import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        assignee: true,
        subtasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        subtasks: true,
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
    assigneeId?: string;
  }) {
    return this.prisma.task.create({
      data,
      include: {
        assignee: true,
        subtasks: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: true,
        subtasks: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}

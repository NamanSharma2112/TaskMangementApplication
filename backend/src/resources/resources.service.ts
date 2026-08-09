import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTask(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    return this.prisma.resource.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(taskId: string, dto: CreateResourceDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    let url = dto.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    return this.prisma.resource.create({
      data: {
        title: dto.title,
        url: url,
        taskId: taskId,
      },
    });
  }

  async remove(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource with ID "${id}" not found.`);
    }

    await this.prisma.resource.delete({ where: { id } });
    return { message: `Resource "${id}" deleted successfully.` };
  }
}

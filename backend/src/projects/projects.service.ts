import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        lead: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }

    return project;
  }

  async create(dto: CreateProjectDto, leadId?: string) {
    return this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category || 'Web App',
        status: dto.status || 'Active',
        priority: dto.priority || 'high',
        dueDate: dto.dueDate,
        leadId: dto.leadId || leadId,
      },
      include: {
        lead: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { message: `Project ${id} removed successfully.` };
  }
}

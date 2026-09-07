import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

const LEAD_SELECT = {
  select: { id: true, name: true, email: true, avatar: true, role: true },
};

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  private withProgress<T extends { tasks: { status: string }[] }>(project: T) {
    const { tasks, ...rest } = project;
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return {
      ...rest,
      totalTasks: total,
      completedTasks: completed,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }

  async findAll() {
    const projects = await this.prisma.project.findMany({
      include: {
        lead: LEAD_SELECT,
        tasks: { where: { archived: false }, select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return projects.map((p) => this.withProgress(p));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: LEAD_SELECT,
        tasks: { where: { archived: false }, select: { status: true } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }

    return this.withProgress(project);
  }

  /** Full task records belonging to a project, for the project detail view. */
  async findTasks(id: string) {
    await this.findOne(id);
    return this.prisma.task.findMany({
      where: { projectId: id, archived: false },
      include: {
        assignee: LEAD_SELECT,
        subtasks: true,
        labels: { include: { label: true } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async create(dto: CreateProjectDto, leadId?: string) {
    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category || 'Web App',
        status: dto.status || 'Active',
        priority: dto.priority || 'high',
        dueDate: dto.dueDate,
        leadId: dto.leadId || leadId,
      },
      include: { lead: LEAD_SELECT },
    });

    await this.activity.record({
      type: 'project.created',
      message: `created project "${project.title}"`,
      actorId: leadId,
      projectId: project.id,
    });

    return { ...project, totalTasks: 0, completedTasks: 0, progress: 0 };
  }

  async update(id: string, dto: UpdateProjectDto, actorId?: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }

    await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
        ...(dto.leadId !== undefined && { leadId: dto.leadId || null }),
      },
    });

    if (dto.status !== undefined && dto.status !== existing.status) {
      await this.activity.record({
        type: 'project.status_changed',
        message: `moved project "${existing.title}" from ${existing.status} to ${dto.status}`,
        actorId,
        projectId: id,
        meta: { from: existing.status, to: dto.status },
      });
    }

    return this.findOne(id);
  }

  async remove(id: string, actorId?: string) {
    const project = await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });

    await this.activity.record({
      type: 'project.deleted',
      message: `deleted project "${project.title}"`,
      actorId,
    });

    return { message: `Project ${id} removed successfully.` };
  }
}

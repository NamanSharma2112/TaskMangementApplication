import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const labels = await this.prisma.label.findMany({
      include: { _count: { select: { tasks: true } } },
      orderBy: { name: 'asc' },
    });

    return labels.map(({ _count, ...label }) => ({
      ...label,
      taskCount: _count.tasks,
    }));
  }

  async create(dto: CreateLabelDto) {
    const name = dto.name.trim();
    const existing = await this.prisma.label.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException(`A label named "${name}" already exists.`);
    }

    return this.prisma.label.create({
      data: { name, color: dto.color || '#6366f1' },
    });
  }

  async update(id: string, dto: UpdateLabelDto) {
    const label = await this.prisma.label.findUnique({ where: { id } });
    if (!label) {
      throw new NotFoundException(`Label with ID "${id}" not found.`);
    }

    if (dto.name) {
      const clash = await this.prisma.label.findUnique({
        where: { name: dto.name.trim() },
      });
      if (clash && clash.id !== id) {
        throw new ConflictException(`A label named "${dto.name.trim()}" already exists.`);
      }
    }

    return this.prisma.label.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.color && { color: dto.color }),
      },
    });
  }

  async remove(id: string) {
    const label = await this.prisma.label.findUnique({ where: { id } });
    if (!label) {
      throw new NotFoundException(`Label with ID "${id}" not found.`);
    }

    await this.prisma.label.delete({ where: { id } });
    return { message: `Label "${label.name}" deleted successfully.` };
  }

  async findByTask(taskId: string) {
    const links = await this.prisma.taskLabel.findMany({
      where: { taskId },
      include: { label: true },
    });
    return links.map((l) => l.label);
  }

  /**
   * Attaches a label to a task. Accepts either an existing label id or a plain
   * name — an unknown name creates the label, so the UI can offer free typing.
   */
  async attach(taskId: string, input: { labelId?: string; name?: string; color?: string }) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    let label = input.labelId
      ? await this.prisma.label.findUnique({ where: { id: input.labelId } })
      : null;

    if (!label && input.name) {
      const name = input.name.trim();
      label =
        (await this.prisma.label.findUnique({ where: { name } })) ??
        (await this.prisma.label.create({
          data: { name, color: input.color || '#6366f1' },
        }));
    }

    if (!label) {
      throw new NotFoundException('Provide either an existing labelId or a label name.');
    }

    await this.prisma.taskLabel.upsert({
      where: { taskId_labelId: { taskId, labelId: label.id } },
      update: {},
      create: { taskId, labelId: label.id },
    });

    return this.findByTask(taskId);
  }

  async detach(taskId: string, labelId: string) {
    await this.prisma.taskLabel.deleteMany({ where: { taskId, labelId } });
    return this.findByTask(taskId);
  }
}

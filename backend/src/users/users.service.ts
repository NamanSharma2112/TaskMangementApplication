import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../common/enums/role.enum';
import { ChangeRoleDto, UpdateProfileDto } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isGuest: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isGuest: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: { id: true, title: true, status: true, priority: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return user;
  }

  async updateRole(id: string, dto: ChangeRoleDto, currentAdminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isGuest: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, currentAdminId: string) {
    if (id === currentAdminId) {
      throw new ForbiddenException('Admin cannot delete their own active account.');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: `User "${user.name}" (${user.email}) deleted successfully.` };
  }
}

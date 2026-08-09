import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, UpdateProfileDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: dto.name,
        avatar:
          dto.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: dto.role || Role.MEMBER,
        isGuest: false,
      },
    });

    const access_token = this.generateToken(user);
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isGuest: user.isGuest,
      },
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (user && user.password && dto.password) {
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password credentials.');
      }
    }

    if (!user) {
      // Auto-register seamless user
      const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 10) : null;
      user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: dto.name || email.split('@')[0],
          avatar:
            dto.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: dto.role || Role.MEMBER,
          isGuest: false,
        },
      });
    } else if (dto.name || dto.avatar) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.avatar && { avatar: dto.avatar }),
        },
      });
    }

    const access_token = this.generateToken(user);
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isGuest: user.isGuest,
      },
    };
  }

  async loginAsGuest() {
    const guestEmail = 'guest@pyramid.app';
    let user = await this.prisma.user.findUnique({ where: { email: guestEmail } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: guestEmail,
          name: 'Guest User',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: Role.GUEST,
          isGuest: true,
        },
      });
    }

    const access_token = this.generateToken(user);
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isGuest: user.isGuest,
      },
    };
  }

  async loginWithGoogle(email?: string, name?: string, avatar?: string) {
    const googleEmail = (email || 'alex.morgan@gmail.com').toLowerCase().trim();
    let user = await this.prisma.user.findUnique({ where: { email: googleEmail } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleEmail,
          name: name || 'Alex Morgan',
          avatar:
            avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: Role.MANAGER,
          isGuest: false,
        },
      });
    }

    const access_token = this.generateToken(user);
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isGuest: user.isGuest,
      },
    };
  }

  async getUserById(id: string) {
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
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email.toLowerCase().trim() }),
        ...(dto.avatar && { avatar: dto.avatar }),
        ...(dto.role && { role: dto.role }),
      },
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
    });

    const access_token = this.generateToken(user);
    return {
      access_token,
      user,
    };
  }
}

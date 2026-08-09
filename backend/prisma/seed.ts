import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with roles and test accounts...');

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pyramid.app' },
    update: {
      password: defaultPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@pyramid.app',
      password: defaultPassword,
      name: 'Dexter Morgan (Admin)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'ADMIN',
      isGuest: false,
    },
  });

  // 2. Manager User
  const managerUser = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {
      password: defaultPassword,
      role: 'MANAGER',
    },
    create: {
      email: 'alex@example.com',
      password: defaultPassword,
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'MANAGER',
      isGuest: false,
    },
  });

  // 3. Member User
  const memberUser = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {
      password: defaultPassword,
      role: 'MEMBER',
    },
    create: {
      email: 'sarah@example.com',
      password: defaultPassword,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'MEMBER',
      isGuest: false,
    },
  });

  // 4. Guest User
  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@pyramid.app' },
    update: {
      role: 'GUEST',
    },
    create: {
      email: 'guest@pyramid.app',
      name: 'Guest User',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'GUEST',
      isGuest: true,
    },
  });

  console.log(`Created users: Admin (${adminUser.email}), Manager (${managerUser.email}), Member (${memberUser.email}), Guest (${guestUser.email})`);

  // Seed initial tasks if empty
  const taskCount = await prisma.task.count();
  if (taskCount === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Design System Implementation & Figma Audit',
          description: 'Align custom components with the new Figma design system tokens and theme variables.',
          status: 'in-progress',
          priority: 'high',
          category: 'Design',
          dueDate: '2026-08-12',
          assigneeId: managerUser.id,
          creatorId: adminUser.id,
        },
        {
          title: 'Implement JWT Auth & Role-Based Access Control',
          description: 'Secure API endpoints with JwtAuthGuard and RolesGuard enforcing ADMIN, MANAGER, and MEMBER scopes.',
          status: 'completed',
          priority: 'urgent',
          category: 'Security',
          dueDate: '2026-08-09',
          assigneeId: adminUser.id,
          creatorId: adminUser.id,
        },
        {
          title: 'Mobile Responsiveness & Micro-animations Polish',
          description: 'Refine hover states, modal transitions, and touch responsiveness across tablet and mobile viewports.',
          status: 'todo',
          priority: 'low',
          category: 'UX/UI',
          dueDate: '2026-08-18',
          assigneeId: memberUser.id,
          creatorId: managerUser.id,
        },
      ],
    });
  }

  // Seed initial projects if empty
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: 'Design Homepage & Navigation System',
          description: 'Complete UI layout design, component library integration, and responsive state handlers.',
          category: 'Frontend',
          status: 'Active',
          priority: 'high',
          dueDate: '2026-08-20',
          leadId: adminUser.id,
        },
        {
          title: 'Task Management Mobile App',
          description: 'Cross-platform mobile application with push notifications and offline sync capabilities.',
          category: 'Mobile',
          status: 'Planning',
          priority: 'medium',
          dueDate: '2026-09-01',
          leadId: managerUser.id,
        },
      ],
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Neon PostgreSQL Database...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Product Manager',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Senior Developer',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'david@example.com' },
    update: {},
    create: {
      email: 'david@example.com',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      role: 'Full Stack Engineer',
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design System Implementation & Figma Audit',
        description: 'Align custom components with the new Figma design system tokens and theme variables.',
        status: 'in-progress',
        priority: 'high',
        category: 'Design',
        dueDate: '2026-08-12',
        assigneeId: user1.id,
      },
      {
        title: 'Implement Guest Authentication & Theme Persistence',
        description: 'Ensure users can test the application as a guest and persist their selected theme across reloads.',
        status: 'completed',
        priority: 'high',
        category: 'Frontend',
        dueDate: '2026-08-08',
        assigneeId: user2.id,
      },
      {
        title: 'Setup NestJS Backend Architecture & PostgreSQL Schema',
        description: 'Prepare RESTful API endpoints for user auth, task CRUD operations, and pagination.',
        status: 'todo',
        priority: 'medium',
        category: 'Backend',
        dueDate: '2026-08-15',
        assigneeId: user3.id,
      },
      {
        title: 'Mobile Responsiveness & Micro-animations Polish',
        description: 'Refine hover states, modal transitions, and touch responsiveness across tablet and mobile viewports.',
        status: 'todo',
        priority: 'low',
        category: 'UX/UI',
        dueDate: '2026-08-18',
        assigneeId: user1.id,
      },
    ],
  });

  // Create sample projects
  await prisma.project.createMany({
    data: [
      {
        title: 'Design Homepage & Navigation System',
        description: 'Complete UI layout design, component library integration, and responsive state handlers.',
        category: 'Frontend',
        status: 'Active',
        priority: 'high',
        dueDate: '2026-08-20',
      },
      {
        title: 'Task Management Mobile App',
        description: 'Cross-platform mobile application with push notifications and offline sync capabilities.',
        category: 'Mobile',
        status: 'Planning',
        priority: 'medium',
        dueDate: '2026-09-01',
      },
    ],
  });

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

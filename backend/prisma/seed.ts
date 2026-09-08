import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/** ISO date `offsetDays` from today, used for realistic demo due dates. */
function dateFromToday(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

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

  // 4. Second Member User
  const devUser = await prisma.user.upsert({
    where: { email: 'david@example.com' },
    update: { password: defaultPassword, role: 'MEMBER' },
    create: {
      email: 'david@example.com',
      password: defaultPassword,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      role: 'MEMBER',
      isGuest: false,
    },
  });

  // 5. Guest User
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

  console.log(
    `Created users: Admin (${adminUser.email}), Manager (${managerUser.email}), Members (${memberUser.email}, ${devUser.email}), Guest (${guestUser.email})`,
  );

  // Labels — colours match the frontend badge palette.
  const labelSeeds = [
    { name: 'Design', color: '#8b5cf6' },
    { name: 'Frontend', color: '#3b82f6' },
    { name: 'Backend', color: '#10b981' },
    { name: 'Security', color: '#ef4444' },
    { name: 'Deployment', color: '#f59e0b' },
    { name: 'Bug', color: '#f43f5e' },
    { name: 'Documentation', color: '#64748b' },
  ];

  const labels: Record<string, string> = {};
  for (const seed of labelSeeds) {
    const label = await prisma.label.upsert({
      where: { name: seed.name },
      update: { color: seed.color },
      create: seed,
    });
    labels[seed.name] = label.id;
  }
  console.log(`Created ${labelSeeds.length} labels.`);

  // Projects
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
          dueDate: dateFromToday(14),
          leadId: adminUser.id,
        },
        {
          title: 'Task Management Mobile App',
          description: 'Cross-platform mobile application with push notifications and offline sync capabilities.',
          category: 'Mobile',
          status: 'Planning',
          priority: 'medium',
          dueDate: dateFromToday(45),
          leadId: managerUser.id,
        },
        {
          title: 'Platform Hardening & Observability',
          description: 'Rate limiting, audit trails, structured logging, and uptime alerting for the API tier.',
          category: 'Backend',
          status: 'Active',
          priority: 'urgent',
          dueDate: dateFromToday(21),
          leadId: devUser.id,
        },
      ],
    });
  }

  const [homepageProject, mobileProject, platformProject] = await prisma.project.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // Tasks — each with subtasks and labels so every view has real data.
  const taskCount = await prisma.task.count();
  if (taskCount === 0) {
    const taskSeeds = [
      {
        title: 'Design System Implementation & Figma Audit',
        description: 'Align custom components with the new Figma design system tokens and theme variables.',
        status: 'in-progress',
        priority: 'high',
        category: 'Design',
        dueDate: dateFromToday(5),
        assigneeId: managerUser.id,
        creatorId: adminUser.id,
        projectId: homepageProject?.id,
        labelNames: ['Design', 'Frontend'],
        subtasks: [
          { title: 'Review Figma component specs', completed: true, priority: 'high' },
          { title: 'Implement dark & light theme variables', completed: false, priority: 'low' },
          { title: 'Verify touch interactions on mobile viewport', completed: false, priority: 'medium' },
        ],
      },
      {
        title: 'Implement JWT Auth & Role-Based Access Control',
        description: 'Secure API endpoints with JwtAuthGuard and RolesGuard enforcing ADMIN, MANAGER, and MEMBER scopes.',
        status: 'completed',
        priority: 'urgent',
        category: 'Security',
        dueDate: dateFromToday(-3),
        assigneeId: adminUser.id,
        creatorId: adminUser.id,
        projectId: platformProject?.id,
        labelNames: ['Security', 'Backend'],
        subtasks: [
          { title: 'Add Passport JWT strategy', completed: true, priority: 'high' },
          { title: 'Guard mutating routes with RolesGuard', completed: true, priority: 'high' },
        ],
      },
      {
        title: 'Mobile Responsiveness & Micro-animations Polish',
        description: 'Refine hover states, modal transitions, and touch responsiveness across tablet and mobile viewports.',
        status: 'todo',
        priority: 'low',
        category: 'UX/UI',
        dueDate: dateFromToday(11),
        assigneeId: memberUser.id,
        creatorId: managerUser.id,
        projectId: mobileProject?.id,
        labelNames: ['Frontend', 'Design'],
        subtasks: [{ title: 'Audit breakpoints below 480px', completed: false, priority: 'medium' }],
      },
      {
        title: 'Write API Documentation',
        description: 'Document every REST route, its auth scope, and an example request/response payload.',
        status: 'todo',
        priority: 'medium',
        category: 'Documentation',
        dueDate: dateFromToday(9),
        assigneeId: devUser.id,
        creatorId: adminUser.id,
        projectId: platformProject?.id,
        labelNames: ['Documentation', 'Backend'],
        subtasks: [],
      },
      {
        title: 'Task Board Drag-and-Drop Persistence',
        description: 'Persist board column ordering through the reorder endpoint instead of local component state.',
        status: 'doing',
        priority: 'high',
        category: 'Frontend',
        dueDate: dateFromToday(4),
        assigneeId: memberUser.id,
        creatorId: managerUser.id,
        projectId: homepageProject?.id,
        labelNames: ['Frontend'],
        subtasks: [
          { title: 'Send ordered ids on drop', completed: false, priority: 'high' },
          { title: 'Reconcile optimistic ordering on failure', completed: false, priority: 'medium' },
        ],
      },
      {
        title: 'Deploy to Production',
        description: 'Provision the production environment, run migrations, and cut over DNS.',
        status: 'on-hold',
        priority: 'urgent',
        category: 'Deployment',
        dueDate: dateFromToday(-1),
        assigneeId: adminUser.id,
        creatorId: adminUser.id,
        projectId: platformProject?.id,
        labelNames: ['Deployment', 'Backend'],
        subtasks: [{ title: 'Smoke-test the staging build', completed: true, priority: 'high' }],
      },
      {
        title: 'Fix duplicate notification fan-out',
        description: 'A task whose assignee is also the creator should only produce a single notification.',
        status: 'backlog',
        priority: 'no-priority',
        category: 'Bug',
        dueDate: dateFromToday(25),
        assigneeId: devUser.id,
        creatorId: memberUser.id,
        projectId: platformProject?.id,
        labelNames: ['Bug', 'Backend'],
        subtasks: [],
      },
    ];

    for (const [index, seed] of taskSeeds.entries()) {
      const { labelNames, subtasks, ...taskData } = seed;
      const task = await prisma.task.create({
        data: {
          ...taskData,
          position: index,
          completedAt: taskData.status === 'completed' ? new Date() : null,
          subtasks: {
            create: subtasks.map((s, i) => ({ ...s, position: i })),
          },
          labels: {
            create: labelNames.map((name) => ({ labelId: labels[name] })),
          },
        },
      });

      await prisma.activity.create({
        data: {
          type: 'task.created',
          message: `created task "${task.title}"`,
          actorId: task.creatorId,
          taskId: task.id,
          projectId: task.projectId,
        },
      });
    }

    console.log(`Created ${taskSeeds.length} tasks with subtasks, labels, and activity.`);
  }

  // A couple of comments so the task detail feed isn't empty.
  const commentCount = await prisma.comment.count();
  if (commentCount === 0) {
    const firstTask = await prisma.task.findFirst({ orderBy: { position: 'asc' } });
    if (firstTask) {
      await prisma.comment.createMany({
        data: [
          {
            content: 'Tokens are exported — the spacing scale still needs a second pass.',
            taskId: firstTask.id,
            authorId: managerUser.id,
          },
          {
            content: 'Picking up the dark theme variables today.',
            taskId: firstTask.id,
            authorId: memberUser.id,
          },
        ],
      });

      await prisma.notification.create({
        data: {
          userId: memberUser.id,
          type: 'comment.added',
          title: `New comment on "${firstTask.title}"`,
          body: 'Tokens are exported — the spacing scale still needs a second pass.',
          taskId: firstTask.id,
        },
      });
    }
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

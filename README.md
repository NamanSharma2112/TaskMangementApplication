# 📐 Task Management Application — Full-Stack & Production System Design

A full-stack, enterprise-grade Task Management web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **NestJS 11 Backend**, and **SQLite Database** (via Prisma ORM). Designed with high attention to detail, matching modern UI/UX design systems.

---

## 🏗️ Production System Design Architecture

```
                               ┌───────────────────────────┐
                               │     Next.js Frontend      │
                               │  (React 19 / App Router)  │
                               └─────────────┬─────────────┘
                                             │ HTTP / Bearer JWT
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    NestJS Backend                                      │
│                                                                                        │
│  ┌─────────────────────────┐   ┌──────────────────────────┐   ┌─────────────────────┐  │
│  │ Global ValidationPipe   │──►│ JwtAuthGuard (Passport)  │──►│  RolesGuard (RBAC)  │  │
│  └─────────────────────────┘   └──────────────────────────┘   └─────────────────────┘  │
│                                              │                                         │
│        ┌──────────────────────┬──────────────┴───────┬──────────────────────┐          │
│        ▼                      ▼                      ▼                      ▼          │
│  ┌───────────┐          ┌───────────┐          ┌───────────┐          ┌───────────┐    │
│  │ AuthModule│          │UsersModule│          │TasksModule│          │Projects...│    │
│  └─────┬─────┘          └─────┬─────┘          └─────┬─────┘          └─────┬─────┘    │
│        └──────────────────────┴──────────────┬───────┴──────────────────────┘          │
│                                              ▼                                         │
│                                   ┌─────────────────────┐                              │
│                                   │   Prisma ORM Client │                              │
│                                   └──────────┬──────────┘                              │
└──────────────────────────────────────────────┼─────────────────────────────────────────┘
                                               ▼
                                   ┌─────────────────────┐
                                   │  SQLite Database    │
                                   │  (prisma/dev.db)    │
                                   └─────────────────────┘
```

### 🔑 Authentication System
* **Password Hashing**: Secure password hashing using `bcryptjs` with salt rounds.
* **JWT Tokens**: Signed JWT Bearer tokens issued via `@nestjs/jwt` and `@nestjs/passport` on `/auth/register`, `/auth/login`, `/auth/guest`, and `/auth/google`.
* **Public & Protected Scopes**: Unauthenticated endpoints annotated with `@Public()`, while protected routes require valid Bearer token headers.
* **Custom Parameter Decorator**: `@CurrentUser()` extracts the authenticated user payload directly inside controller methods.

### 🛡️ Authorization & Role-Based Access Control (RBAC)
* **Role Hierarchy**: `ADMIN` | `MANAGER` | `MEMBER` | `GUEST`.
* **Roles Guard**: `RolesGuard` implements NestJS `CanActivate` to verify the authenticated user's role against route requirements defined by `@Roles(...)`.
* **Role Assignment Endpoint**: `PATCH /users/:id/role` is strictly protected by `@Roles(Role.ADMIN)` so only Administrators can promote or demote user roles.
* **Deletion Protection**: `DELETE /users/:id` is restricted to `ADMIN` users only.

### 🛠️ Production Architecture & Best Practices
* **Global ValidationPipe**: Whitelists and sanitizes request payloads using `class-validator` and `class-transformer` DTOs (`RegisterDto`, `LoginDto`, `ChangeRoleDto`, `CreateTaskDto`, `CreateProjectDto`).
* **Global Exception Filter**: `GlobalHttpExceptionFilter` formats all thrown HTTP errors into structured, standardized JSON responses `{ statusCode, error, message, path, timestamp }`.
* **Database Relations & Audit Fields**: User -> Tasks (`AssignedTasks` and `CreatedTasks`), User -> Projects (`ProjectLead`), with `@updatedAt` and `@default(now())` timestamps.

---

## 🌟 Application Features

### 🎨 Design System & Visual Fidelity
* **Theme System**: Light Mode, Dark Mode, Violet, and Emerald themes with dynamic CSS variables.
* **Color Modes**: Primary accent color switcher (Amber, Blue, Pink, Rose, Emerald, Black).
* **Typography & Spacing**: Clean hierarchy, micro-interactions, soft borders, subtle shadows, and sleek custom scrollbars.
* **Icons & Components**: Integrated Lucide icons, custom Pyramid logo, priority signal badges, status indicators, date badges, and avatar badges.

### 📋 Task & Project Management
* **Kanban Board View**: Interactive drag-and-drop task movement across status columns (`To Do`, `Doing`, `Completed`, `On Hold`).
* **Grouped List View**: Clean structured table view grouped by task status with expandable fields.
* **Fields Toggle**: Custom fields popover to toggle column visibility (`Priority`, `Members`, `Due Date`, `Labels`, `Status`, `Reporter`).
* **Filtering & Search**: Real-time task searching (`⌘F`) and multi-criteria filtering by priority and status.
* **Detailed Task Modal**: Slide-over modal featuring task properties, subtasks table, date picker popover, priority selector, viewer counter, lock toggle, share link, and real-time comment feed.
* **Projects Overview**: Separate workspace section for managing high-level project tasks, project leads, and target dates.

---

## 🚀 API Endpoints Overview

### Authentication Routes (`/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user account with hashed password | Public |
| `POST` | `/auth/login` | Authenticate user credentials & receive JWT token | Public |
| `POST` | `/auth/guest` | Generate guest user & JWT token | Public |
| `POST` | `/auth/google` | OAuth / Google SSO authentication | Public |
| `GET` | `/auth/me` | Retrieve profile of currently authenticated user | Protected (JWT) |

### User & Role Management Routes (`/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/users` | List all users and assigned roles | Protected (JWT) |
| `GET` | `/users/:id` | Get details of a single user | Protected (JWT) |
| `PATCH` | `/users/:id/role` | Assign role (`ADMIN`, `MANAGER`, `MEMBER`, `GUEST`) | **ADMIN Only** |
| `DELETE` | `/users/:id` | Delete user account | **ADMIN Only** |

### Tasks Routes (`/api/tasks`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tasks` | List all tasks | Public / Protected |
| `POST` | `/api/tasks` | Create new task | Protected (JWT) |
| `PATCH` | `/api/tasks/:id` | Update task details or status | Protected (JWT) |
| `DELETE` | `/api/tasks/:id` | Delete task | **ADMIN, MANAGER** |

---

## 🏃 Getting Started

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Seed database with Admin/Manager/Member test users
cd backend
npx prisma db seed
cd ..

# 3. Start Backend & Frontend
# Terminal 1 (Backend API):
cd backend && npm run start:dev

# Terminal 2 (Next.js Frontend):
npm run dev
```

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:4000](http://localhost:4000)

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
│  │UsersModule│          │  Subtasks │          │  Labels   │          │ Analytics │    │
│  │ Comments  │          │ Resources │          │Notificat's│          │ Activity  │    │
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

### 🔔 Notifications & Audit Trail
* **Notifications**: Assigning a task, moving it between columns, or commenting on it fans out a notification to the task's assignee and creator. Self-actions never notify the actor. Exposed at `/api/notifications` and surfaced by the header bell (unread badge, mark-read, mark-all-read, dismiss).
* **Activity Log**: Every task, subtask, comment, and project mutation writes an `Activity` row with the actor, a human-readable message, and a JSON `meta` payload. Readable workspace-wide (`/api/activity`), per task, or per project.
* **Optional Authentication on Public Routes**: `JwtAuthGuard` still runs the JWT strategy on `@Public()` routes, so a caller who sends a valid token is identified (and correctly attributed in the audit trail) while anonymous callers are still allowed through.

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
* **Projects Overview**: Live project table with per-project task progress bars, inline creation, status changes, and RBAC-aware actions (create/edit needs MANAGER, delete needs ADMIN).
* **Subtasks**: Persisted checklists per task with priority, ordering, a completion progress bar, and drag-to-reorder support on the API.
* **Labels**: A shared, colour-coded label catalogue. Attach or detach labels from the task detail panel, filter the board by label, and type a new name to create one on the fly.
* **Archive**: Tasks can be archived instead of deleted, with a header toggle that swaps the board over to the archived set.
* **Analytics Dashboard**: Headline counters (open, completed, overdue, due this week, unassigned), status and priority distributions, a 14-day created-vs-completed throughput chart, per-member workload with overdue counts, and project progress — all computed server-side.
* **Activity Feed**: A workspace-wide audit timeline, plus a per-task timeline inside the detail modal.
* **Notification Bell**: Unread badge with 30-second polling, mark-read / mark-all-read, and dismissal.

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
| `GET` | `/api/tasks` | List tasks. Filters: `search`, `status`, `priority`, `assigneeId`, `projectId`, `category`, `label`, `archived`, `sortBy`, `order` | Optional auth |
| `GET` | `/api/tasks/search` | Same filters, returned as `{ data, meta }` with `page` / `limit` | Optional auth |
| `GET` | `/api/tasks/:id` | Get one task with subtasks, labels, comments, and progress | Optional auth |
| `POST` | `/api/tasks` | Create a task (accepts `labels` as plain names) | Optional auth |
| `POST` | `/api/tasks/:id/duplicate` | Copy a task along with its subtasks and labels | Optional auth |
| `PATCH` | `/api/tasks/bulk` | Apply one set of changes to many tasks | Optional auth |
| `PATCH` | `/api/tasks/reorder` | Persist board column ordering | Optional auth |
| `PATCH` | `/api/tasks/:id` | Update task details | Optional auth |
| `PATCH` | `/api/tasks/:id/status` | Move a task between columns | Optional auth |
| `PATCH` | `/api/tasks/:id/archive` | Archive or restore a task | Optional auth |
| `DELETE` | `/api/tasks/:id` | Delete task | **ADMIN, MANAGER** |

### Subtask Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tasks/:taskId/subtasks` | List a task's subtasks in order | Optional auth |
| `GET` | `/api/tasks/:taskId/subtasks/progress` | `{ total, completed, percent }` | Optional auth |
| `POST` | `/api/tasks/:taskId/subtasks` | Add a subtask | Optional auth |
| `PATCH` | `/api/tasks/:taskId/subtasks/reorder` | Persist a drag-and-drop reorder | Optional auth |
| `PATCH` | `/api/subtasks/:id` | Update title, priority, due date, or completion | Optional auth |
| `DELETE` | `/api/subtasks/:id` | Delete a subtask | Optional auth |

### Label Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/labels` | List labels with their task counts | Optional auth |
| `POST` | `/api/labels` | Create a label (`name`, optional hex `color`) | Optional auth |
| `PATCH` | `/api/labels/:id` | Rename or recolour a label | Optional auth |
| `DELETE` | `/api/labels/:id` | Delete a label | **ADMIN, MANAGER** |
| `GET` | `/api/tasks/:taskId/labels` | Labels attached to a task | Optional auth |
| `POST` | `/api/tasks/:taskId/labels` | Attach by `labelId`, or by `name` to create-and-attach | Optional auth |
| `DELETE` | `/api/tasks/:taskId/labels/:labelId` | Detach a label | Optional auth |

### Project Routes (`/api/projects`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/projects` | List projects with task counts and progress | Optional auth |
| `GET` | `/api/projects/:id` | Get one project | Optional auth |
| `GET` | `/api/projects/:id/tasks` | Tasks belonging to a project | Optional auth |
| `POST` | `/api/projects` | Create a project | **ADMIN, MANAGER** |
| `PATCH` | `/api/projects/:id` | Update a project | **ADMIN, MANAGER** |
| `DELETE` | `/api/projects/:id` | Delete a project | **ADMIN Only** |

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/notifications` | Your notifications (`?unread=true` to filter) | Protected (JWT) |
| `GET` | `/api/notifications/unread-count` | `{ count }` for the bell badge | Protected (JWT) |
| `PATCH` | `/api/notifications/:id/read` | Mark one as read | Protected (JWT) |
| `PATCH` | `/api/notifications/read-all` | Mark everything as read | Protected (JWT) |
| `DELETE` | `/api/notifications/:id` | Dismiss one | Protected (JWT) |
| `DELETE` | `/api/notifications/read` | Clear all read notifications | Protected (JWT) |

### Activity & Analytics Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/activity?limit=50` | Workspace-wide audit feed | Optional auth |
| `GET` | `/api/tasks/:taskId/activity` | Audit trail for one task | Optional auth |
| `GET` | `/api/projects/:projectId/activity` | Audit trail for one project | Optional auth |
| `GET` | `/api/analytics` | Everything below in one payload (`?days=14`) | Optional auth |
| `GET` | `/api/analytics/summary` | Totals, completion rate, status/priority breakdowns | Optional auth |
| `GET` | `/api/analytics/workload` | Per-member open, completed, and overdue counts | Optional auth |
| `GET` | `/api/analytics/throughput` | Created vs. completed per day | Optional auth |
| `GET` | `/api/analytics/projects` | Task counts and completion per project | Optional auth |

> **Optional auth** means the route is open to anonymous callers, but a valid `Authorization: Bearer` header is still read so the actor is recorded in the activity log and excluded from their own notifications.

---

## 🏃 Getting Started

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Configure the backend environment
cd backend
cp .env.example .env

# 3. Create the schema and seed users, labels, projects, and tasks
npx prisma db push
npx prisma db seed
cd ..

# 4. Start Backend & Frontend
# Terminal 1 (Backend API):
cd backend && npm run start:dev

# Terminal 2 (Next.js Frontend):
npm run dev
```

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:4000](http://localhost:4000)

### Seeded accounts

All seeded accounts share the password `Password123!`.

| Email | Role |
|---|---|
| `admin@pyramid.app` | ADMIN |
| `alex@example.com` | MANAGER |
| `sarah@example.com` | MEMBER |
| `david@example.com` | MEMBER |
| `guest@pyramid.app` | GUEST (passwordless — use **Continue as Guest**) |

### Running without the API

The frontend degrades gracefully: if `http://localhost:4000` is unreachable the
header badge switches to **Offline mode** and the board falls back to
`localStorage`. Analytics, activity, notifications, and labels need the API.

import { TaskStatus } from "@/types/task";

export interface PreviewCard {
  title: string;
  assignee: { name: string; initials: string };
  due?: string;
  tag?: string;
}

export interface PreviewColumn {
  id: TaskStatus;
  title: string;
  colorDot: string;
  cards: PreviewCard[];
  isDropTarget?: boolean;
}

/** Mirrors the columns and colour dots used by TaskBoard. */
export const PREVIEW_COLUMNS: PreviewColumn[] = [
  {
    id: "todo",
    title: "To Do",
    colorDot: "bg-amber-400",
    cards: [
      { title: "Rate-limit /auth/guest per IP", assignee: { name: "Naman S.", initials: "NS" }, due: "Sep 12" },
      { title: "Empty state for the Projects view", assignee: { name: "Aisha R.", initials: "AR" }, tag: "Design" },
    ],
  },
  { id: "in-progress", title: "Doing", colorDot: "bg-blue-500", cards: [], isDropTarget: true },
  {
    id: "completed",
    title: "Completed",
    colorDot: "bg-emerald-500",
    cards: [
      { title: "Prisma migration: activity meta", assignee: { name: "Naman S.", initials: "NS" }, tag: "Backend" },
      { title: "Command palette, scoped to the view", assignee: { name: "Aisha R.", initials: "AR" }, tag: "Frontend" },
    ],
  },
  {
    id: "on-hold",
    title: "On Hold",
    colorDot: "bg-purple-400",
    cards: [
      { title: "Google OAuth callback fails on staging", assignee: { name: "Naman S.", initials: "NS" }, due: "Blocked" },
    ],
  },
];

/** The card shown mid-drag over the Doing column's drop zone. */
export const DRAGGED_CARD: PreviewCard = {
  title: "Subtask table: inline priority",
  assignee: { name: "Aisha R.", initials: "AR" },
};

export interface FlowSource {
  label: string;
  /** SVG path, drawn in a 720x400 viewBox, ending on the log card's top edge. */
  d: string;
  stroke: string;
  dot: string;
  /** Position of the label chip, as a percentage of the stage. */
  chip: { left?: string; right?: string; top: string; translate: string };
  delay: number;
}

export const FLOW_SOURCES: FlowSource[] = [
  {
    label: "Card moved",
    d: "M 360 34 V 300",
    stroke: "stroke-blue-500",
    dot: "bg-blue-500",
    chip: { left: "50%", top: "8.5%", translate: "translate(-50%,-115%)" },
    delay: 0,
  },
  {
    label: "Comment posted",
    d: "M 160 100 H 220 L 320 190 V 300",
    stroke: "stroke-amber-400",
    dot: "bg-amber-400",
    chip: { left: "22.2%", top: "25%", translate: "translate(-50%,-115%)" },
    delay: 0.5,
  },
  {
    label: "Assignee changed",
    d: "M 560 100 H 500 L 400 190 V 300",
    stroke: "stroke-purple-400",
    dot: "bg-purple-400",
    chip: { left: "77.8%", top: "25%", translate: "translate(-50%,-115%)" },
    delay: 1,
  },
  {
    label: "Subtask checked",
    d: "M 24 214 H 290 V 300",
    stroke: "stroke-emerald-500",
    dot: "bg-emerald-500",
    chip: { left: "0", top: "53.5%", translate: "translate(0,-115%)" },
    delay: 1.5,
  },
  {
    label: "Due date set",
    d: "M 696 214 H 430 V 300",
    stroke: "stroke-rose-500",
    dot: "bg-rose-500",
    chip: { right: "0", top: "53.5%", translate: "translate(0,-115%)" },
    delay: 2,
  },
];

export const ROLES: { role: string; can: string }[] = [
  { role: "ADMIN", can: "Promotes, demotes, deletes accounts." },
  { role: "MANAGER", can: "Runs projects and assigns work." },
  { role: "MEMBER", can: "Owns and moves their own tasks." },
  { role: "GUEST", can: "Looks around, changes nothing." },
];

export const STATUS_SPLIT: { label: string; value: number; color: string }[] = [
  { label: "To Do", value: 38, color: "bg-amber-400" },
  { label: "Doing", value: 24, color: "bg-blue-500" },
  { label: "Done", value: 30, color: "bg-emerald-500" },
  { label: "Hold", value: 8, color: "bg-purple-400" },
];

export const QUOTES: { quote: string; name: string; role: string; initials: string }[] = [
  {
    quote:
      "We stopped asking \u2018where is this?\u2019 in chat. The card moved, the log says who moved it, and that\u2019s the end of it.",
    name: "Priya Menon",
    role: "Product lead, four-person studio",
    initials: "PM",
  },
  {
    quote:
      "Guest login is why it stuck. Everyone poked at a real board in the first meeting instead of waiting on invites.",
    name: "Daniel Okoye",
    role: "Engineering manager",
    initials: "DO",
  },
  {
    quote:
      "List view with due dates on Monday, the board the rest of the week. Same tasks, so nothing drifts.",
    name: "Sofia Hartmann",
    role: "Design ops",
    initials: "SH",
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "What happens when I continue as guest?",
    a: "A guest session is issued and a workspace is seeded with example tasks, so the board has something in it. You can drag, filter, comment and open the analytics view. Guests cannot change roles or delete other people's work.",
  },
  {
    q: "How do the four roles differ?",
    a: "Admins manage people and can delete accounts, managers run projects and assign work, members own their tasks, guests are read-mostly. Every role is checked on the server, so a hidden button is never the only thing standing between someone and an action they should not take.",
  },
  {
    q: "When does Pyramid notify someone?",
    a: "Assigning a task, moving it between columns, or commenting on it notifies the task's assignee and its creator. Your own actions never notify you. Everything lands in the bell with an unread count, and can be marked read or dismissed.",
  },
  {
    q: "Is anything lost when a task changes?",
    a: "No. Each change writes an activity row with the actor, a readable message and a JSON meta payload of what changed. Read the trail workspace-wide, per project, or for a single task.",
  },
  {
    q: "What is it built on?",
    a: "Next.js 16 with the App Router and React 19 on the front, a NestJS API behind it with Prisma over SQLite, JWT bearer sessions and role guards on protected routes. Styling is Tailwind v4 over CSS-variable themes, which is how four full palettes cost one token file.",
  },
];

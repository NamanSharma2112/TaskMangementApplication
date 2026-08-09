"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useTasks } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  PanelRight,
  Calendar,
  Tag,
  Paperclip,
  Send,
  Plus,
  ChevronDown,
  Settings,
  Signal,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Trash2,
  Edit3,
  ExternalLink,
  Link2,
} from "lucide-react";

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  authorId?: string;
}

interface SubtaskItem {
  id: string;
  title: string;
  priority: string;
  completed: boolean;
  date: string;
}

interface ResourceItem {
  id: string;
  title: string;
  url: string;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const teamMembers = [
  {
    id: "user-1",
    name: "Alex Morgan",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "MANAGER",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "MEMBER",
  },
  {
    id: "user-3",
    name: "Dexter Morgan",
    email: "admin@pyramid.app",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "ADMIN",
  },
  {
    id: "user-4",
    name: "David Kim",
    email: "david@example.com",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    role: "MEMBER",
  },
];

const statusOptions: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: "todo", label: "To Do", dotColor: "bg-amber-400" },
  { id: "in-progress", label: "Doing", dotColor: "bg-blue-500" },
  { id: "completed", label: "Completed", dotColor: "bg-emerald-500" },
  { id: "on-hold", label: "On Hold", dotColor: "bg-purple-400" },
];

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const { updateTask } = useTasks();
  const { user, token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("high");
  const [dueDate, setDueDate] = useState("12 Aug 2026");
  const [assignee, setAssignee] = useState<{ name: string; avatar?: string } | null>(null);

  // Dropdown popup triggers
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showMembersMenu, setShowMembersMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(12);
  const [isLocked, setIsLocked] = useState(false);
  const [viewerCount, setViewerCount] = useState(1);
  const [isShared, setIsShared] = useState(false);

  // Resources state
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [showAddResourceForm, setShowAddResourceForm] = useState(false);
  const [resourceTitleInput, setResourceTitleInput] = useState("");
  const [resourceUrlInput, setResourceUrlInput] = useState("");
  const [isSubmittingResource, setIsSubmittingResource] = useState(false);

  // Subtasks state
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([
    { id: "sub-1", title: "Review Figma component specs", priority: "high", completed: true, date: "12 Aug 2026" },
    { id: "sub-2", title: "Implement dark & light theme variables", priority: "low", completed: false, date: "15 Aug 2026" },
    { id: "sub-3", title: "Verify touch interactions on mobile viewport", priority: "medium", completed: false, date: "18 Aug 2026" },
  ]);

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(
        task.description ||
          "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively."
      );
      setStatus(task.status);
      setPriority(task.priority);
      if (task.dueDate) setDueDate(task.dueDate);
      if (task.assignee) setAssignee(task.assignee);

      // Fetch resources from NestJS API
      fetch(`${API_BASE_URL}/api/tasks/${task.id}/resources`)
        .then((res) => (res.ok ? res.json() : []))
        .then((dbResources: any[]) => {
          if (Array.isArray(dbResources) && dbResources.length > 0) {
            setResources(dbResources.map((r) => ({ id: r.id, title: r.title, url: r.url })));
          } else {
            setResources([
              { id: "res-1", title: "Figma Component Specs", url: "https://figma.com" },
              { id: "res-2", title: "API Documentation", url: "http://localhost:4000" },
            ]);
          }
        })
        .catch(() => {
          setResources([
            { id: "res-1", title: "Figma Component Specs", url: "https://figma.com" },
            { id: "res-2", title: "API Documentation", url: "http://localhost:4000" },
          ]);
        });

      // Fetch live comments from NestJS API
      fetch(`${API_BASE_URL}/api/tasks/${task.id}/comments`)
        .then((res) => (res.ok ? res.json() : []))
        .then((dbComments: any[]) => {
          if (Array.isArray(dbComments) && dbComments.length > 0) {
            const mapped = dbComments.map((c) => ({
              id: c.id,
              author: c.author?.name || "Member",
              avatar:
                c.author?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "just now",
              content: c.content,
              authorId: c.authorId,
            }));
            setComments(mapped);
          } else {
            setComments([
              {
                id: "c-1",
                author: user?.name || "Dexter Morgan",
                avatar: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                time: "10:30 AM",
                content: "Aligned Figma tokens and verified component spacing across board and list views.",
                authorId: user?.id,
              },
            ]);
          }
        })
        .catch(() => {
          setComments([
            {
              id: "c-1",
              author: user?.name || "Dexter Morgan",
              avatar: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              time: "10:30 AM",
              content: "Aligned Figma tokens and verified component spacing across board and list views.",
              authorId: user?.id,
            },
          ]);
        });
    }
  }, [task, user]);

  if (!isOpen || !task) return null;

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== task.title) {
      updateTask(task.id, { title: title.trim() });
    }
  };

  const handleDescriptionSave = () => {
    setIsEditingDescription(false);
    if (description !== task.description) {
      updateTask(task.id, { description });
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    updateTask(task.id, { status: newStatus });
    setShowStatusMenu(false);
  };

  const handlePriorityChange = (newP: TaskPriority) => {
    setPriority(newP);
    updateTask(task.id, { priority: newP });
    setShowPriorityMenu(false);
  };

  const handleAssigneeChange = (member: { name: string; avatar?: string } | null) => {
    setAssignee(member);
    updateTask(task.id, { assignee: member || undefined });
    setShowMembersMenu(false);
  };

  const handleDateChange = (day: number) => {
    setSelectedDay(day);
    const newFormattedDate = `${day} Aug 2026`;
    setDueDate(newFormattedDate);
    updateTask(task.id, { dueDate: newFormattedDate });
    setShowDatePicker(false);
  };

  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitleInput.trim() || !resourceUrlInput.trim() || isSubmittingResource) return;

    setIsSubmittingResource(true);
    const rTitle = resourceTitleInput.trim();
    let rUrl = resourceUrlInput.trim();
    if (!rUrl.startsWith("http://") && !rUrl.startsWith("https://")) {
      rUrl = `https://${rUrl}`;
    }

    setResourceTitleInput("");
    setResourceUrlInput("");
    setShowAddResourceForm(false);

    const tempRes: ResourceItem = {
      id: "res-" + Date.now(),
      title: rTitle,
      url: rUrl,
    };

    setResources((prev) => [...prev, tempRes]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${task.id}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: rTitle, url: rUrl }),
      });

      if (res.ok) {
        const created = await res.json();
        setResources((prev) =>
          prev.map((r) => (r.id === tempRes.id ? { id: created.id, title: created.title, url: created.url } : r))
        );
      }
    } catch (e) {
      console.warn("Backend resource API offline, saved in local view", e);
    } finally {
      setIsSubmittingResource(false);
    }
  };

  const handleDeleteResource = async (resId: string) => {
    setResources((prev) => prev.filter((r) => r.id !== resId));

    if (!resId.startsWith("res-")) {
      try {
        await fetch(`${API_BASE_URL}/api/resources/${resId}`, { method: "DELETE" });
      } catch (e) {
        console.warn("Backend delete resource offline", e);
      }
    }
  };

  const handleToggleSubtask = (subId: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleAddSubtask = () => {
    const newSub: SubtaskItem = {
      id: "sub-" + Date.now(),
      title: `New Subtask ${subtasks.length + 1}`,
      priority: "medium",
      completed: false,
      date: "20 Aug 2026",
    };
    setSubtasks([...subtasks, newSub]);
  };

  const handleDeleteSubtask = (subId: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== subId));
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    const contentText = newComment.trim();
    setNewComment("");
    setIsSubmittingComment(true);

    const tempComment: CommentItem = {
      id: "c-" + Date.now(),
      author: user?.name || "User",
      avatar:
        user?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      time: "just now",
      content: contentText,
      authorId: user?.id,
    };

    setComments((prev) => [...prev, tempComment]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ content: contentText }),
      });

      if (res.ok) {
        const created = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === tempComment.id
              ? {
                  id: created.id,
                  author: created.author?.name || user?.name || "User",
                  avatar:
                    created.author?.avatar ||
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                  time: "just now",
                  content: created.content,
                  authorId: created.authorId,
                }
              : c
          )
        );
      }
    } catch (e) {
      console.warn("Backend comment API offline, saved in local view", e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    if (!commentId.startsWith("c-")) {
      try {
        await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
          method: "DELETE",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
      } catch (e) {
        console.warn("Backend delete comment offline", e);
      }
    }
  };

  const currentStatusObj = statusOptions.find((s) => s.id === status) || statusOptions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Task Detail</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            {/* Lock Button */}
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLocked ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Lock task"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Viewers Badge */}
            <button
              onClick={() => setViewerCount((v) => v + 1)}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 transition-colors"
              title="Current viewers"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{viewerCount}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => setIsShared(!isShared)}
              className={`p-1.5 rounded-lg transition-colors ${
                isShared ? "text-blue-600 bg-blue-50 dark:bg-blue-950" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Share task link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <PanelRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Left Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
            {/* Interactive Title & Description */}
            <div className="space-y-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  autoFocus
                  className="w-full text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight bg-transparent border-b-2 border-zinc-900 dark:border-zinc-100 outline-none pb-1"
                />
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="group flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 p-1.5 -ml-1.5 rounded-xl transition-colors"
                >
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {title}
                  </h1>
                  <Edit3 className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}

              {isEditingDescription ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionSave}
                  autoFocus
                  rows={3}
                  className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 outline-none resize-none"
                />
              ) : (
                <p
                  onClick={() => setIsEditingDescription(true)}
                  className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 p-2 -ml-2 rounded-xl transition-colors"
                >
                  {description}
                </p>
              )}
            </div>

            {/* Properties & Tags Row */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-zinc-400 w-24 shrink-0">Properties</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300">
                    {task.category || "Design"}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5" /> {dueDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-zinc-400 w-24 shrink-0">Labels</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["Research", "Design", "Development", "Testing", "Deployment"].map((lbl) => (
                    <span
                      key={lbl}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold"
                    >
                      <Tag className="w-3 h-3 text-zinc-400" /> {lbl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Resources Section */}
              <div className="flex items-start gap-4 text-xs">
                <span className="font-semibold text-zinc-400 w-24 shrink-0 pt-1">Resources</span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {resources.map((res) => (
                      <div
                        key={res.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-200 dark:border-blue-800 group"
                      >
                        <Link2 className="w-3 h-3 shrink-0" />
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline truncate max-w-[150px]"
                          title={res.url}
                        >
                          {res.title}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-blue-400 hover:text-rose-500 transition-colors ml-0.5"
                          title="Delete resource"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setShowAddResourceForm(!showAddResourceForm)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add resource link...</span>
                    </button>
                  </div>

                  {/* Add Resource Popup Form */}
                  {showAddResourceForm && (
                    <form
                      onSubmit={handleAddResourceSubmit}
                      className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 space-y-2 animate-in fade-in-80 duration-150"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        <span>New Resource Link</span>
                        <button type="button" onClick={() => setShowAddResourceForm(false)}>
                          <X className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={resourceTitleInput}
                          onChange={(e) => setResourceTitleInput(e.target.value)}
                          placeholder="Title (e.g. Figma Specs, API Docs)"
                          className="w-full h-8 px-3 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none"
                        />
                        <input
                          type="text"
                          required
                          value={resourceUrlInput}
                          onChange={(e) => setResourceUrlInput(e.target.value)}
                          placeholder="URL (e.g. https://figma.com/file/...)"
                          className="w-full h-8 px-3 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddResourceForm(false)}
                          className="px-3 py-1 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingResource}
                          className="px-3.5 py-1 rounded-xl text-xs font-bold theme-btn-primary shadow-2xs"
                        >
                          Add Resource
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Subtasks Section */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                  <span>Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})</span>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 text-zinc-400 font-semibold">
                      <th className="py-2.5 px-4 w-10">Status</th>
                      <th className="py-2.5 px-4">Task</th>
                      <th className="py-2.5 px-4">Priority</th>
                      <th className="py-2.5 px-4">Due Date</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                    {subtasks.map((st) => (
                      <tr key={st.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => handleToggleSubtask(st.id)}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className={`py-3 px-4 font-semibold ${st.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"}`}>
                          {st.title}
                        </td>
                        <td className="py-3 px-4 text-rose-500 font-semibold">
                          📊 {st.priority.charAt(0).toUpperCase() + st.priority.slice(1)}
                        </td>
                        <td className="py-3 px-4 text-zinc-500">{st.date}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSubtask(st.id)}
                            className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                            title="Delete subtask"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={handleAddSubtask}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-2 py-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subtasks</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Comments Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Comments</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {comments.length}
                  </span>
                </h3>
              </div>

              {comments.length === 0 ? (
                <p className="text-xs text-zinc-400 font-medium py-2">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 text-xs group">
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 mt-0.5"
                    />
                    <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-1 relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.author}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400">{c.time}</span>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 transition-opacity p-0.5"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-2 pt-2">
                <div className="relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    disabled={isSubmittingComment}
                    className="w-full h-11 pl-4 pr-20 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button type="button" className="p-1.5 text-zinc-400 hover:text-zinc-600">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="p-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Details Sidebar */}
          <div className="w-full md:w-72 bg-zinc-50/60 dark:bg-zinc-950/40 border-l border-zinc-200/80 dark:border-zinc-800 p-6 space-y-6 overflow-y-auto relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <div className="flex items-center gap-1.5">
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                  <span>Details</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <Plus className="w-3.5 h-3.5" />
                  <Settings className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Status Selector */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Status</span>
                    <button
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                      className="flex items-center gap-1.5 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded-lg transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${currentStatusObj.dotColor}`} />
                      <span className="text-zinc-900 dark:text-zinc-100">{currentStatusObj.label}</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>
                  </div>

                  {/* Status Dropdown Menu */}
                  {showStatusMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                      <div className="absolute right-0 mt-1 w-44 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl z-20 space-y-1">
                        <p className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase">
                          Task Status
                        </p>
                        {statusOptions.map((sItem) => (
                          <button
                            key={sItem.id}
                            onClick={() => handleStatusChange(sItem.id)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                              <span className={`w-2 h-2 rounded-full ${sItem.dotColor}`} /> {sItem.label}
                            </span>
                            {status === sItem.id && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Priority Selector */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Priority</span>
                    <button
                      onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                      className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded-lg transition-colors"
                    >
                      <Signal className="w-3.5 h-3.5" />
                      <span className="capitalize">{priority}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Priority Popup Menu */}
                  {showPriorityMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPriorityMenu(false)} />
                      <div className="absolute right-0 mt-1 w-44 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl z-20 space-y-1">
                        <p className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase">
                          Priority
                        </p>
                        {[
                          { id: "no-priority", label: "No Priority", color: "text-zinc-400" },
                          { id: "urgent", label: "Urgent", color: "text-rose-500" },
                          { id: "high", label: "High", color: "text-amber-500" },
                          { id: "medium", label: "Medium", color: "text-amber-400" },
                          { id: "low", label: "Low", color: "text-zinc-500" },
                        ].map((pItem) => (
                          <button
                            key={pItem.id}
                            onClick={() => handlePriorityChange(pItem.id as TaskPriority)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <span className={`flex items-center gap-2 ${pItem.color}`}>
                              <Signal className="w-3.5 h-3.5" /> {pItem.label}
                            </span>
                            {priority === pItem.id && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Members Selector */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Members</span>
                    <button
                      onClick={() => setShowMembersMenu(!showMembersMenu)}
                      className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded-lg transition-colors"
                    >
                      {assignee?.avatar ? (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-5 h-5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                        />
                      ) : (
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                      <span>{assignee?.name || "Add members"}</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>
                  </div>

                  {/* Members Dropdown Menu */}
                  {showMembersMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMembersMenu(false)} />
                      <div className="absolute right-0 mt-1 w-52 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl z-20 space-y-1">
                        <p className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase">
                          Assign Member
                        </p>
                        <button
                          onClick={() => handleAssigneeChange(null)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                        >
                          <span>Unassigned</span>
                          {!assignee && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                        </button>
                        {teamMembers.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => handleAssigneeChange({ name: m.name, avatar: m.avatar })}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                          >
                            <div className="flex items-center gap-2">
                              <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                              <span>{m.name}</span>
                            </div>
                            {assignee?.name === m.name && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Dates & Calendar Picker Trigger */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Dates</span>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/80 transition-colors"
                    >
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span>{dueDate}</span>
                    </button>
                  </div>

                  {/* Calendar Popup */}
                  {showDatePicker && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDatePicker(false)} />
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-2xl z-20 animate-in fade-in-80 zoom-in-95 space-y-3">
                        {/* Month Header */}
                        <div className="flex items-center justify-between px-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          <button className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span>August 2026</span>
                          <button className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Calendar Grid 1..31 */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                            <span key={d} className="font-bold text-zinc-400 py-0.5">
                              {d}
                            </span>
                          ))}
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                            const isSelected = day === selectedDay;
                            return (
                              <button
                                key={day}
                                onClick={() => handleDateChange(day)}
                                className={`py-1 rounded-lg font-semibold transition-all ${
                                  isSelected
                                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold"
                                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Updates Timeline Card */}
            <div className="space-y-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <ChevronDown className="w-4 h-4 text-zinc-500" />
                <span>Updates</span>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0 text-rose-500 mt-0.5">
                    <Signal className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{user?.name || "You"}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      changed priority to <span className="capitalize font-bold">{priority}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={user?.name || "You"}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{user?.name || "You"}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      updated task details · Aug 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

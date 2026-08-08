"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useTasks } from "@/context/TaskContext";
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
} from "lucide-react";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const { updateTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("high");
  const [dueDate, setDueDate] = useState("31 Jul");

  // Interactive popup states matching Figma screenshots
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(10);
  const [isLocked, setIsLocked] = useState(false);
  const [viewerCount, setViewerCount] = useState(1);
  const [isShared, setIsShared] = useState(false);

  // Subtasks & Comments state
  const [subtasks, setSubtasks] = useState([
    { id: "sub-1", title: "Subtask 1", priority: "high", member: "Avatar", date: "12 Sep 2026" },
    { id: "sub-2", title: "Subtask 2", priority: "low", member: "CN", date: "15 Sep 2026" },
    { id: "sub-3", title: "Subtask 3", priority: "medium", member: "+", date: "18 Sep 2026" },
  ]);

  const [comments, setComments] = useState([
    {
      id: "c-1",
      author: "Ankit Dutta",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      time: "just now",
      content: "dsds",
    },
  ]);
  const [newComment, setNewComment] = useState("");

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
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handlePriorityChange = (newP: TaskPriority) => {
    setPriority(newP);
    updateTask(task.id, { priority: newP });
    setShowPriorityMenu(false);
  };

  const handleAddSubtask = () => {
    const newSub = {
      id: "sub-" + Date.now(),
      title: `Subtask ${subtasks.length + 1}`,
      priority: "medium",
      member: "CN",
      date: "20 Sep 2026",
    };
    setSubtasks([...subtasks, newSub]);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: "c-" + Date.now(),
        author: "Dexter",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        time: "just now",
        content: newComment,
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Controls matching Figma Screenshot 5 */}
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
          {/* Main Left Content */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Properties & Tags Row */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-zinc-400 w-24 shrink-0">Properties</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300">
                    A Designer
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

              <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-zinc-400 w-24 shrink-0">Resources</span>
                <button className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Add document or link...</span>
                </button>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                  <span>Subtasks</span>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 text-zinc-400 font-semibold">
                      <th className="py-2.5 px-4">Task</th>
                      <th className="py-2.5 px-4">Priority</th>
                      <th className="py-2.5 px-4">Members</th>
                      <th className="py-2.5 px-4">Due Date</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                    {subtasks.map((st) => (
                      <tr key={st.id}>
                        <td className="py-3 px-4 font-semibold text-zinc-800 dark:text-zinc-200">{st.title}</td>
                        <td className="py-3 px-4 text-rose-500 font-semibold">
                          📊 {st.priority.charAt(0).toUpperCase() + st.priority.slice(1)}
                        </td>
                        <td className="py-3 px-4">
                          {st.member === "Avatar" ? (
                            <img
                              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                              alt="Member"
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 inline-flex items-center justify-center text-[10px] font-bold text-zinc-600">
                              {st.member}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-zinc-500">{st.date}</td>
                        <td className="py-3 px-4 text-right text-zinc-400">...</td>
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

            {/* Activity Comments */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Comments</h3>

              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 text-xs">
                  <img
                    src={c.avatar}
                    alt={c.author}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 mt-0.5"
                  />
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.author}</span>
                      <span className="text-[10px] text-zinc-400">{c.time}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium">{c.content}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddComment} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full h-11 pl-4 pr-20 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button type="button" className="p-1.5 text-zinc-400 hover:text-zinc-600">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      className="p-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform"
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
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-400">Status</span>
                  <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Backlog
                  </span>
                </div>

                {/* Priority Trigger */}
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

                {/* Members */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-400">Members</span>
                  <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer hover:text-zinc-900">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Add members</span>
                  </div>
                </div>

                {/* Dates & Date Picker Trigger matching Screenshot 1 */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Dates</span>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/80 transition-colors"
                    >
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span>Jan 10 → End</span>
                    </button>
                  </div>

                  {/* Calendar Popup Popup matching Screenshot 1 */}
                  {showDatePicker && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDatePicker(false)} />
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-2xl z-20 animate-in fade-in-80 zoom-in-95 space-y-3">
                        {/* Month Header */}
                        <div className="flex items-center justify-between px-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          <button className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span>January 2026</span>
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
                                onClick={() => {
                                  setSelectedDay(day);
                                  setDueDate(`${day} Jan`);
                                  setShowDatePicker(false);
                                }}
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
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">You</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      changed priority from No priority to Urgent
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="You"
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">You</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      posted an update · Aug 2026
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

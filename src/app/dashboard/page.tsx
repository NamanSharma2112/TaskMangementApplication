"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskProvider, useTasks } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import { TaskBoard } from "@/components/task/TaskBoard";
import { TaskList } from "@/components/task/TaskList";
import { ProjectsView } from "@/components/task/ProjectsView";
import { FieldsDropdown } from "@/components/task/FieldsDropdown";
import { TaskDetailModal } from "@/components/task/TaskDetailModal";
import { TaskModal } from "@/components/task/TaskModal";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Task, TaskStatus } from "@/types/task";
import Link from "next/link";
import {
  Plus,
  Search,
  SlidersHorizontal,
  PanelLeft,
  Filter,
  Command,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

import { FilterDropdown } from "@/components/task/FilterDropdown";

function DashboardContent() {
  const { logout } = useAuth();
  const { tasks, searchQuery, setSearchQuery, priorityFilter, statusFilter, isBackendConnected } = useTasks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState("tasks");
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  // Fields dropdown toggle state
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  // Task creation and detail modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState<TaskStatus>("todo");
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

  // Search input expansion state
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Filter tasks logic
  const filteredTasks = tasks.filter((t) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query);

    const matchesPriority =
      priorityFilter === "all" || t.priority === priorityFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in-progress"
        ? t.status === "in-progress" || t.status === ("doing" as TaskStatus)
        : t.status === statusFilter);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleOpenCreateModal = (status: TaskStatus = "todo") => {
    setCreateInitialStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleToggleField = (fieldKey: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  return (
    <div className="min-h-screen flex theme-bg theme-fg transition-colors duration-200">
      {/* App Sidebar matching Screenshot 3 */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeNavTab}
        setActiveTab={(tab) => {
          setActiveNavTab(tab);
          setSelectedProjectTitle(null);
        }}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching Screenshot 1-4 */}
        <header className="px-6 py-4 border-b theme-border flex items-center justify-between gap-4 theme-bg">
          <motion.div
            className="flex items-center justify-between w-full gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Toggle sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </button>

              {/* Breadcrumb Navigation matching Screenshot 4 */}
              <div className="flex items-center gap-1.5 text-sm">
                {selectedProjectTitle ? (
                  <>
                    <span className="font-semibold text-zinc-400">Projects</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-50">
                      {selectedProjectTitle}
                    </span>
                  </>
                ) : activeNavTab === "projects" ? (
                  <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Projects
                  </h1>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                      Tasks
                    </h1>
                    {isBackendConnected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Neon PostgreSQL API
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Header Toolbar Controls */}
            <div className="flex items-center gap-2.5">
              {/* Search Bar / Icon */}
              {isSearchExpanded ? (
                <div className="relative animate-in fade-in zoom-in-95 duration-150">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Design Homepage"
                    autoFocus
                    onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                    className="pl-9 pr-10 h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 w-56 sm:w-64"
                  />
                  <span className="absolute right-2.5 top-2 flex items-center gap-0.5 text-[10px] font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                    <Command className="w-2.5 h-2.5" />F
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  title="Search tasks (⌘F)"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Fields Button + Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFieldsOpen(!isFieldsOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Fields</span>
                </button>

                {/* Fields Dropdown Popup */}
                <FieldsDropdown
                  isOpen={isFieldsOpen}
                  onClose={() => setIsFieldsOpen(false)}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  visibleFields={visibleFields}
                  onToggleField={handleToggleField}
                />
              </div>

              {/* Filter Button + Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-2 rounded-xl border transition-colors ${
                    priorityFilter !== "all" || statusFilter !== "all"
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))] theme-primary-text"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                  title="Filter tasks"
                >
                  <Filter className="w-4 h-4" />
                </button>

                {/* Filter Dropdown Popup */}
                <FilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>

              {/* Black + Add Task Button matching Screenshot 1-4 */}
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  onClick={() => handleOpenCreateModal("todo")}
                  className="h-9 rounded-xl theme-btn-primary font-bold text-xs px-3.5 gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNavTab === "projects" ? "projects" : viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeNavTab === "projects" ? (
                  <ProjectsView
                    onSelectProject={(title) => {
                      setSelectedProjectTitle(title);
                      setActiveNavTab("tasks");
                    }}
                  />
                ) : viewMode === "board" ? (
                  <TaskBoard
                    tasks={filteredTasks}
                    onEditTask={(t) => setSelectedDetailTask(t)}
                    onAddTaskColumn={handleOpenCreateModal}
                  />
                ) : (
                  <TaskList
                    tasks={filteredTasks}
                    onEditTask={(t) => setSelectedDetailTask(t)}
                    onAddTaskGroup={handleOpenCreateModal}
                    visibleFields={visibleFields}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Full Task Detail Modal matching Screenshot 5 */}
      <TaskDetailModal
        isOpen={!!selectedDetailTask}
        onClose={() => setSelectedDetailTask(null)}
        task={selectedDetailTask}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        onCreateTask={() => handleOpenCreateModal("todo")}
        onSetViewMode={setViewMode}
        onNavigateTab={(tab) => {
          setActiveNavTab(tab);
          setSelectedProjectTitle(null);
        }}
        onEditTask={(task) => setSelectedDetailTask(task)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}

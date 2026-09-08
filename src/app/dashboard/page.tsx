"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskProvider, useTasks } from "@/context/TaskContext";
import { TaskBoard } from "@/components/task/TaskBoard";
import { TaskList } from "@/components/task/TaskList";
import { ProjectsView } from "@/components/task/ProjectsView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { FieldsDropdown } from "@/components/task/FieldsDropdown";
import { TaskDetailModal } from "@/components/task/TaskDetailModal";
import { TaskModal } from "@/components/task/TaskModal";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Task, TaskStatus } from "@/types/task";
import {
  Plus,
  Search,
  PanelLeft,
  Filter,
  Command,
  LayoutGrid,
  ChevronRight,
  Archive,
  AlertTriangle,
  X,
  Tag,
} from "lucide-react";

import { FilterDropdown } from "@/components/task/FilterDropdown";

const VIEW_TITLES: Record<string, string> = {
  tasks: "Tasks",
  projects: "Projects",
  analytics: "Analytics",
  activity: "Activity",
};

function DashboardContent() {
  const {
    tasks,
    labels,
    error,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    statusFilter,
    labelFilter,
    setLabelFilter,
    showArchived,
    setShowArchived,
    isBackendConnected,
  } = useTasks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState("tasks");
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState<TaskStatus>("todo");
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  // Search, status, priority and label filters are all applied in TaskContext,
  // so this list is already the one to render.
  const filteredTasks = tasks;

  const handleOpenCreateModal = (status: TaskStatus = "todo") => {
    setCreateInitialStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleToggleField = (fieldKey: string) => {
    setVisibleFields((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const isTaskView = activeNavTab === "tasks";
  const hasActiveFilter =
    priorityFilter !== "all" || statusFilter !== "all" || labelFilter !== "all";

  return (
    <div className="min-h-screen flex theme-bg theme-fg transition-colors duration-200">
      <AppSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeNavTab}
        setActiveTab={(tab) => {
          setActiveNavTab(tab);
          setSelectedProjectTitle(null);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
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

              <div className="flex items-center gap-1.5 text-sm">
                {selectedProjectTitle ? (
                  <>
                    <span className="font-semibold text-zinc-400">Projects</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-50">
                      {selectedProjectTitle}
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {VIEW_TITLES[activeNavTab] || "Tasks"}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isBackendConnected
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                      }`}
                      title={
                        isBackendConnected
                          ? "Reading and writing through the NestJS API"
                          : "API unreachable — changes stay in this browser"
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                        }`}
                      />
                      {isBackendConnected ? "Live API" : "Offline mode"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <NotificationBell />

              {isTaskView && (
                <>
                  {isSearchExpanded ? (
                    <div className="relative animate-in fade-in zoom-in-95 duration-150">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks…"
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

                  {/* Label filter */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLabelMenuOpen(!isLabelMenuOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                        labelFilter !== "all"
                          ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))] theme-primary-text"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                      title="Filter by label"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>{labelFilter === "all" ? "Labels" : labelFilter}</span>
                    </button>

                    {isLabelMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsLabelMenuOpen(false)} />
                        <div className="absolute right-0 top-10 z-50 w-48 max-h-72 overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl">
                          <button
                            onClick={() => {
                              setLabelFilter("all");
                              setIsLabelMenuOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          >
                            All labels
                          </button>
                          {labels.length === 0 && (
                            <p className="px-2.5 py-2 text-[11px] text-zinc-400 font-medium">
                              No labels yet.
                            </p>
                          )}
                          {labels.map((label) => (
                            <button
                              key={label.id}
                              onClick={() => {
                                setLabelFilter(label.name);
                                setIsLabelMenuOpen(false);
                              }}
                              className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: label.color }}
                                />
                                <span className="truncate">{label.name}</span>
                              </span>
                              <span className="text-[10px] text-zinc-400 tabular-nums">
                                {label.taskCount ?? 0}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setIsFieldsOpen(!isFieldsOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Fields</span>
                    </button>

                    <FieldsDropdown
                      isOpen={isFieldsOpen}
                      onClose={() => setIsFieldsOpen(false)}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      visibleFields={visibleFields}
                      onToggleField={handleToggleField}
                    />
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`p-2 rounded-xl border transition-colors ${
                        hasActiveFilter
                          ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))] theme-primary-text"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                      title="Filter tasks"
                    >
                      <Filter className="w-4 h-4" />
                    </button>

                    <FilterDropdown
                      isOpen={isFilterOpen}
                      onClose={() => setIsFilterOpen(false)}
                    />
                  </div>

                  {/* Archive toggle */}
                  <button
                    onClick={() => setShowArchived(!showArchived)}
                    className={`p-2 rounded-xl border transition-colors ${
                      showArchived
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))] theme-primary-text"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                    title={showArchived ? "Back to active tasks" : "Show archived tasks"}
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      onClick={() => handleOpenCreateModal("todo")}
                      className="h-9 rounded-xl theme-btn-primary font-bold text-xs px-3.5 gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Task</span>
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {error && error !== dismissedError && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => setDismissedError(error)}
                className="ml-auto p-0.5 hover:opacity-70"
                aria-label="Dismiss error"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {showArchived && isTaskView && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <Archive className="w-3.5 h-3.5 shrink-0" />
              <span>Showing archived tasks only.</span>
              <button
                onClick={() => setShowArchived(false)}
                className="ml-auto font-bold theme-primary-text hover:opacity-70"
              >
                Back to active
              </button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isTaskView ? viewMode : activeNavTab}
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
                ) : activeNavTab === "analytics" ? (
                  <AnalyticsView />
                ) : activeNavTab === "activity" ? (
                  <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xs">
                    <ActivityFeed limit={100} />
                  </div>
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

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialStatus={createInitialStatus}
      />

      <TaskDetailModal
        isOpen={!!selectedDetailTask}
        onClose={() => setSelectedDetailTask(null)}
        task={selectedDetailTask}
      />

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

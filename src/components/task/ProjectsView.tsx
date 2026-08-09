"use client";

import React, { useState } from "react";
import { Project, TaskPriority } from "@/types/task";
import { MoreHorizontal, Plus, Signal, SlidersHorizontal, Check, ChevronRight } from "lucide-react";

interface ProjectsViewProps {
  onSelectProject?: (title: string) => void;
}

const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Design Homepage",
    priority: "high",
    lead: {
      name: "Dexter",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    dueDate: "12 Sep 2026",
  },
  {
    id: "proj-2",
    title: "Develop Login Feature",
    priority: "low",
    lead: {
      name: "CN",
    },
    dueDate: "15 Sep 2026",
  },
  {
    id: "proj-3",
    title: "Test Payment Gateway",
    priority: "medium",
    lead: {
      name: "+",
    },
    dueDate: "18 Sep 2026",
  },
];

export function ProjectsView({ onSelectProject }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showPrioritySubMenu, setShowPrioritySubMenu] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>("urgent");

  const getPriorityStyle = (p: string) => {
    if (p === "high" || p === "urgent") return { color: "text-rose-500", label: "High" };
    if (p === "medium") return { color: "text-amber-500", label: "Medium" };
    return { color: "text-zinc-400 dark:text-zinc-500", label: "Low" };
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: "proj-" + Date.now(),
      title: "New Project Task " + (projects.length + 1),
      priority: "medium",
      lead: { name: "Dexter" },
      dueDate: "20 Sep 2026",
    };
    setProjects([...projects, newProj]);
  };

  return (
    <div className="space-y-4 pt-2">

      {/* Projects Table matching Screenshot 2 */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-400 dark:text-zinc-500 font-semibold">
              <th className="py-3.5 px-5">Projects</th>
              <th className="py-3.5 px-4 w-32">Priority</th>
              <th className="py-3.5 px-4 w-32">Lead</th>
              <th className="py-3.5 px-4 w-36">Due Date</th>
              <th className="py-3.5 px-4 w-16 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium text-zinc-800 dark:text-zinc-200">
            {projects.map((p) => {
              const pStyle = getPriorityStyle(p.priority);
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelectProject && onSelectProject(p.title)}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    {p.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className={`flex items-center gap-1.5 font-semibold ${pStyle.color}`}>
                      <Signal className="w-3.5 h-3.5" />
                      <span>{pStyle.label}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {p.lead.avatar ? (
                      <img
                        src={p.lead.avatar}
                        alt={p.lead.name}
                        className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {p.lead.name}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 font-medium">
                    {p.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Add Projects Footer Row */}
        <div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Projects</span>
          </button>
        </div>
      </div>
    </div>
  );
}

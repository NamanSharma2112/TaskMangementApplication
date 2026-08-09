"use client";

import React, { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.name || "Dexter");
  const [jobTitle, setJobTitle] = useState(user?.role || "Designer");
  const [username, setUsername] = useState(
    user?.name ? user.name.toLowerCase().replace(/\s+/g, "") : "Dexuser"
  );
  const [email, setEmail] = useState(user?.email || "dexter@gmail.com");

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      if (user.role) setJobTitle(user.role);
      setUsername(user.name.toLowerCase().replace(/\s+/g, ""));
    }
  }, [user]);

  const handleSave = () => {
    updateProfile({
      name: fullName,
      email: email,
      role: jobTitle,
    });
  };

  return (
    <div className="max-w-[800px] w-full pt-10 pl-8 pr-16 space-y-10 animate-in fade-in duration-300">
      <div className="space-y-6">
        <h1 className="text-[28px] font-semibold text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>

        <div className="rounded-[16px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
          {/* Profile Picture */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
              Profile picture
            </span>
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt="Profile Avatar"
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                {email}
              </span>
              <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/80 gap-4">
            <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
              Full name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={handleSave}
              className="w-[280px] h-9 px-3.5 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-lg outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/80 gap-4">
            <div className="space-y-0.5">
              <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                Title
              </p>
              <p className="text-[13px] text-zinc-500">Your job title or role</p>
            </div>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onBlur={handleSave}
              className="w-[280px] h-9 px-3.5 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-lg outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
            <div className="space-y-0.5">
              <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                Username
              </p>
              <p className="text-[13px] text-zinc-500">
                One word, like a nickname or first name
              </p>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleSave}
              className="w-[280px] h-9 px-3.5 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-lg outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-50">
          Workspace access
        </h2>

        <div className="rounded-[16px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <span className="text-[13px] font-medium text-zinc-500">
            Remove yourself from the workspace
          </span>
          <button className="px-4 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-[13px] font-semibold transition-colors">
            Leave Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

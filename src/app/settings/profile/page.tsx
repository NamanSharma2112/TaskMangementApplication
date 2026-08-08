"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("Dexter");
  const [jobTitle, setJobTitle] = useState("Designer");
  const [username, setUsername] = useState("Dexuser");
  const [email, setEmail] = useState("dexter@gmail.com");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("pyramid-profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.email) setEmail(parsed.email);
      } catch {}
    } else if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    const data = { fullName, jobTitle, username, email };
    localStorage.setItem("pyramid-profile", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Title & Save Feedback */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in duration-200">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* Profile Details Card */}
      <div className="rounded-3xl border theme-border theme-card divide-y divide-[hsl(var(--border))] shadow-2xs overflow-hidden">
        {/* Profile Picture */}
        <div className="flex items-center justify-between p-6 sm:p-7">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Profile picture
          </span>
          <div className="w-11 h-11 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between p-6 sm:p-7">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Email
          </span>
          <div className="flex items-center gap-2">
            {isEditingEmail ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  setIsEditingEmail(false);
                  handleSave();
                }}
                className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none"
                autoFocus
              />
            ) : (
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {email}
              </span>
            )}
            <button
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex items-center justify-between p-6 sm:p-7 gap-4">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
            Full name
          </span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={handleSave}
            placeholder="Full name"
            className="w-64 h-11 px-4 text-sm font-normal text-zinc-800 dark:text-zinc-200 bg-zinc-100/70 dark:bg-zinc-800/60 rounded-xl border border-transparent focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-950 transition-all outline-none"
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between p-6 sm:p-7 gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Title
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              Your job title or role
            </p>
          </div>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onBlur={handleSave}
            placeholder="Designer"
            className="w-64 h-11 px-4 text-sm font-normal text-zinc-800 dark:text-zinc-200 bg-zinc-100/70 dark:bg-zinc-800/60 rounded-xl border border-transparent focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-950 transition-all outline-none"
          />
        </div>

        {/* Username */}
        <div className="flex items-center justify-between p-6 sm:p-7 gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Username
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              One word, like a nickname or first name
            </p>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleSave}
            placeholder="Dexuser"
            className="w-64 h-11 px-4 text-sm font-normal text-zinc-800 dark:text-zinc-200 bg-zinc-100/70 dark:bg-zinc-800/60 rounded-xl border border-transparent focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-950 transition-all outline-none"
          />
        </div>
      </div>

      {/* Workspace Access Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Workspace access
        </h2>

        <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex items-center justify-between shadow-2xs">
          <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
            Remove yourself from the workspace
          </span>
          <Button
            variant="ghost"
            className="h-10 px-5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 dark:text-rose-400 font-semibold text-xs transition-colors"
          >
            Leave Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}

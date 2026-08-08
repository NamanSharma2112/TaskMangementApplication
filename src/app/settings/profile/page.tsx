"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Check, Camera, Mail, User, Shield, Briefcase, AtSign, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("Dexter");
  const [jobTitle, setJobTitle] = useState("Lead Product Designer");
  const [username, setUsername] = useState("Dexuser");
  const [email, setEmail] = useState("dexter@gmail.com");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  );

  useEffect(() => {
    const savedProfile = localStorage.getItem("pyramid-profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
      } catch {}
    } else if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    const data = { fullName, jobTitle, username, email, avatarUrl };
    localStorage.setItem("pyramid-profile", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-300">
      {/* Header Banner & Save Notification */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight theme-fg">
            Profile Settings
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-1">
            Manage your identity, role, and personal workspace preferences
          </p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 animate-in zoom-in-95 duration-150">
            <Check className="w-4 h-4" /> Changes Saved
          </span>
        )}
      </div>

      {/* Hero Avatar Card */}
      <div className="rounded-[28px] border theme-border theme-card p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[hsl(var(--primary))/0.04] rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Upload */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[hsl(var(--primary))] shadow-md">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-white"
              title="Change Profile Photo"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* User Details Overview */}
          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold tracking-tight theme-fg truncate">
                {fullName || "Dexter"}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[hsl(var(--primary))/0.1] theme-primary-text border border-[hsl(var(--primary))/0.2]">
                <Sparkles className="w-2.5 h-2.5" />
                Admin
              </span>
            </div>
            <p className="text-xs font-semibold text-zinc-400">
              {jobTitle || "Lead Product Designer"}
            </p>
            <p className="text-xs text-zinc-500 font-mono">
              @{username || "dexuser"}
            </p>
          </div>

          <Button
            onClick={handleSave}
            className="rounded-xl px-5 h-10 text-xs font-bold theme-btn-primary shadow-xs"
          >
            Save Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="rounded-[28px] border theme-border theme-card divide-y divide-[hsl(var(--border))] shadow-xs overflow-hidden">
        {/* Full Name */}
        <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl theme-muted flex items-center justify-center text-zinc-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Full Name
              </p>
              <p className="text-xs text-zinc-400 font-medium">Your public display name</p>
            </div>
          </div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={handleSave}
            placeholder="Dexter Morgan"
            className="w-full sm:w-72 h-11 px-4 text-xs sm:text-sm font-semibold theme-fg theme-muted rounded-xl border theme-border focus:border-[hsl(var(--primary))] outline-none transition-all"
          />
        </div>

        {/* Job Title */}
        <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl theme-muted flex items-center justify-center text-zinc-400 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Job Title / Role
              </p>
              <p className="text-xs text-zinc-400 font-medium">What you do in the team</p>
            </div>
          </div>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onBlur={handleSave}
            placeholder="Designer / Engineer"
            className="w-full sm:w-72 h-11 px-4 text-xs sm:text-sm font-semibold theme-fg theme-muted rounded-xl border theme-border focus:border-[hsl(var(--primary))] outline-none transition-all"
          />
        </div>

        {/* Username */}
        <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl theme-muted flex items-center justify-center text-zinc-400 shrink-0">
              <AtSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Username
              </p>
              <p className="text-xs text-zinc-400 font-medium">Unique handle for mentions</p>
            </div>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleSave}
            placeholder="dexuser"
            className="w-full sm:w-72 h-11 px-4 text-xs sm:text-sm font-semibold theme-fg theme-muted rounded-xl border theme-border focus:border-[hsl(var(--primary))] outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl theme-muted flex items-center justify-center text-zinc-400 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Email Address
              </p>
              <p className="text-xs text-zinc-400 font-medium">Used for system notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-72">
            {isEditingEmail ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  setIsEditingEmail(false);
                  handleSave();
                }}
                className="w-full h-11 px-4 text-xs sm:text-sm font-semibold theme-fg theme-muted rounded-xl border border-[hsl(var(--primary))] outline-none"
                autoFocus
              />
            ) : (
              <div className="w-full h-11 px-4 text-xs sm:text-sm font-semibold theme-fg theme-muted rounded-xl border theme-border flex items-center justify-between">
                <span className="truncate">{email}</span>
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold tracking-tight text-rose-500 uppercase flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          <span>Danger Zone</span>
        </h3>

        <div className="rounded-[28px] border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
              Leave Workspace
            </p>
            <p className="text-xs text-rose-500/80 font-medium mt-0.5">
              Revoke your access permissions and remove yourself from this workspace
            </p>
          </div>
          <Button
            variant="ghost"
            className="h-10 px-5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900 font-bold text-xs transition-colors shrink-0 gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Workspace</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

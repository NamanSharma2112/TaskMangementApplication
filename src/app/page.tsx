"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PyramidLogo } from "@/components/ui/PyramidLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { loginAsGuest, loginWithGoogle, loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await loginWithEmail(email.trim(), name.trim() || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center theme-bg px-4 py-12 transition-colors duration-200">
      {/* Brand Header */}
      <motion.div
        className="mb-8 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PyramidLogo iconSize={22} />
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="w-full max-w-[440px] rounded-[28px] border theme-border theme-card shadow-sm transition-all duration-200">
          <CardHeader className="text-center pt-8 pb-4 px-8">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Let's get back on track
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 font-normal">
              Enter your details below to login to your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8 space-y-4">
            {/* Email / Name Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name (e.g. Dexter Morgan)"
                  className="h-11 rounded-2xl text-xs font-semibold px-4 border-zinc-200 dark:border-zinc-800"
                />
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="h-11 rounded-2xl text-xs font-semibold pl-10 pr-4 border-zinc-200 dark:border-zinc-800"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-full theme-btn-primary font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? "Logging in..." : "Continue with Email"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <span className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
              <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[11px] font-semibold text-zinc-400 uppercase">
                or
              </span>
            </div>

            {/* Continue as Guest Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => loginAsGuest()}
                variant="outline"
                className="w-full h-11 rounded-full border-zinc-200 dark:border-zinc-800 font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Continue as Guest</span>
              </Button>
            </motion.div>

            {/* Login with Google Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => loginWithGoogle()}
                variant="outline"
                className="w-full h-11 rounded-full border-zinc-200 dark:border-zinc-800 font-bold text-xs transition-all flex items-center justify-center gap-3 shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                {/* Google SVG Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Login with Google</span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Links */}
      <motion.footer
        className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500 space-y-1 max-w-[360px] leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <p>
          By clicking continue, you agree to our{" "}
          <Link
            href="#"
            className="underline underline-offset-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="underline underline-offset-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </motion.footer>
    </div>
  );
}

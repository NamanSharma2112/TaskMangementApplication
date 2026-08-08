"use client";

import React from "react";
import { PyramidLogo } from "@/components/ui/PyramidLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { loginAsGuest, loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center theme-bg px-4 py-12 transition-colors duration-200">
      {/* Brand Header */}
      <div className="mb-8 flex justify-center">
        <PyramidLogo iconSize={22} />
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-[440px] rounded-[28px] border theme-border theme-card shadow-sm transition-all duration-200">
        <CardHeader className="text-center pt-8 pb-4 px-8">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Let's get back on track
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 font-normal">
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-3.5">
          {/* Continue as Guest Button */}
          <Button
            onClick={loginAsGuest}
            className="w-full h-12 rounded-full theme-btn-primary font-medium text-sm transition-all shadow-xs"
          >
            Continue as Guest
          </Button>

          {/* Login with Google Button */}
          <Button
            onClick={loginWithGoogle}
            variant="outline"
            className="w-full h-12 rounded-full theme-border theme-card hover:opacity-90 font-medium text-sm transition-all flex items-center justify-center gap-3 shadow-2xs"
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
        </CardContent>
      </Card>

      {/* Footer Links */}
      <footer className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500 space-y-1 max-w-[360px] leading-relaxed">
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
      </footer>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PyramidLogo } from "@/components/ui/PyramidLogo";
import { useAuth } from "@/context/AuthContext";
import { LandingNav } from "./LandingNav";
import { LandingHero } from "./LandingHero";
import { BoardPreview } from "./BoardPreview";
import { ActivityFlow } from "./ActivityFlow";
import { Stats, FeatureTiles, Quotes, Faq, ClosingCta } from "./LandingSections";

const FOOTER_LINKS = [
  { label: "Board", href: "#board" },
  { label: "Activity", href: "#flow" },
  { label: "Inside", href: "#inside" },
  { label: "FAQ", href: "#faq" },
];

export function LandingPage() {
  const { loginAsGuest } = useAuth();
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  /** The same guest sign-in the login screen uses; it redirects to /dashboard on success. */
  const handleGuest = async () => {
    if (pending) return;
    setPending(true);
    try {
      await loginAsGuest();
    } catch {
      router.push("/");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg pt-[92px] text-[15px] text-zinc-900 antialiased dark:text-zinc-50">
      <LandingNav onGuest={handleGuest} />

      <main>
        <LandingHero onGuest={handleGuest} />
        <BoardPreview />
        <Stats />
        <ActivityFlow />
        <FeatureTiles />
        <Quotes />
        <Faq />
        <ClosingCta onGuest={handleGuest} />
      </main>

      <footer className="border-t theme-border py-8">
        <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center gap-6 px-6 text-[12.5px] theme-muted-fg">
          <Link href="#top">
            <PyramidLogo iconSize={14} />
          </Link>
          <span>Task management, kept honest by its own log.</span>
          <nav className="flex gap-5 md:ml-auto">
            {FOOTER_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

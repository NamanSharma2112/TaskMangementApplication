import React from "react";
import { cn } from "@/lib/utils";

interface PyramidLogoProps {
  className?: string;
  iconSize?: number;
}

export function PyramidLogo({ className, iconSize = 24 }: PyramidLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <div className="flex items-center justify-center bg-zinc-950 text-white rounded-lg p-1.5 shadow-xs border border-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-200">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current"
        >
          {/* Pyramid / Delta Icon Shape */}
          <path
            d="M12 3L2 20H22L12 3Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3V20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
          <path
            d="M7 11.5L17 11.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
        Pyramid
      </span>
    </div>
  );
}

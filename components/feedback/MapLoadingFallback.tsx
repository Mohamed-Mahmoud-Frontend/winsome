"use client";

import { Spinner } from "./Spinner";
import { cn } from "@/utils/cn";

export interface MapLoadingFallbackProps {
  className?: string;
  minHeight?: string;
}

/** Fallback UI for lazy-loaded map (e.g. next/dynamic). */
export function MapLoadingFallback({
  className,
  minHeight = "300px",
}: MapLoadingFallbackProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800",
        className
      )}
      style={{ minHeight }}
      role="status"
      aria-label="Loading map"
    >
      <Spinner size="lg" />
    </div>
  );
}


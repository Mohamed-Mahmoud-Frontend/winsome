"use client";

import { Spinner } from "./Spinner";
import { cn } from "@/utils/cn";

export interface PageLoadingProps {
  className?: string;
  /** Optional message below spinner */
  message?: string;
}

export function PageLoading({ className, message }: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner size="lg" />
      {message && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      )}
    </div>
  );
}


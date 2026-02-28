"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

export interface NotFoundStateProps {
  title?: string;
  message: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function NotFoundState({
  title = "Not found",
  message,
  description,
  backHref,
  backLabel = "Go back",
  className,
}: NotFoundStateProps) {
  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950", className)}>
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{message}</p>
        {description && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            {description}
          </p>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {backLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

